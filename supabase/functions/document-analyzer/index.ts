import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!openAIApiKey) {
  console.error('OPENAI_API_KEY is not set');
}

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Supabase credentials are not set');
}

const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentUrl, documentType, municipality, permitNumber } = await req.json();
    
    console.log('Starting document analysis for:', { documentUrl, documentType, municipality, permitNumber });

    if (!documentUrl) {
      throw new Error('Document URL is required');
    }

    // Get the current user from the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Invalid authentication token');
    }

    // Extract the storage path from the URL
    // URL format: https://.../storage/v1/object/public/documents/path
    const urlParts = documentUrl.split('/documents/');
    if (urlParts.length < 2) {
      throw new Error('Invalid document URL format');
    }
    const storagePath = decodeURIComponent(urlParts[1]);
    
    console.log('Downloading document from storage path:', storagePath);

    // Download the document content using Supabase Storage API
    let documentContent: string;
    
    try {
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('documents')
        .download(storagePath);
        
      if (downloadError || !fileData) {
        console.error('Failed to download document:', downloadError);
        throw new Error('Failed to download document from storage');
      }
      
      const contentType = fileData.type;
      console.log('Document content type:', contentType);
      
      if (contentType?.includes('application/pdf')) {
        // For PDF files, we'll analyze them as binary data
        const arrayBuffer = await fileData.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        documentContent = `PDF document with ${uint8Array.length} bytes`;
      } else if (contentType?.includes('image/')) {
        // For images, we'll use OpenAI Vision API
        const arrayBuffer = await fileData.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        documentContent = `data:${contentType};base64,${base64}`;
      } else {
        // For text documents
        documentContent = await fileData.text();
      }
    } catch (error) {
      console.error('Failed to fetch document:', error);
      throw new Error('Failed to fetch document for analysis');
    }

    // Analyze document with OpenAI
    const analysisPrompt = `
You are a document analyzer for a food delivery platform. Analyze this municipal permit document and determine if it's a valid approval for food business operations.

Context:
- Municipality: ${municipality}
- Permit Number: ${permitNumber || 'Not provided'}
- Document Type: Municipal food business permit

Look for these key elements:
1. Official municipal letterhead or seal
2. Clear approval or permission granted for food business operations
3. Valid dates (not expired)
4. Specific permissions for food preparation/sales
5. Business name or applicant information
6. Official signatures or stamps

Respond with a JSON object containing:
{
  "approved": boolean,
  "confidence": number (0-100),
  "reasoning": "string explaining the decision",
  "expires_at": "YYYY-MM-DD or null if no expiry found",
  "business_name": "string or null",
  "permit_number": "string or null if different from provided",
  "issues": ["array of any issues found"]
}

Document content to analyze: ${documentContent.length > 1000 ? documentContent.substring(0, 1000) + '...' : documentContent}
`;

    let analysisResult;
    
    try {
      const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a document analyzer specializing in municipal permits for food businesses. Respond only with valid JSON.'
            },
            {
              role: 'user',
              content: analysisPrompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.1,
        }),
      });

      if (!openAIResponse.ok) {
        const errorText = await openAIResponse.text();
        console.error('OpenAI API error:', errorText);
        throw new Error(`OpenAI API error: ${openAIResponse.status}`);
      }

      const openAIData = await openAIResponse.json();
      const analysisText = openAIData.choices[0].message.content;
      
      console.log('Raw OpenAI response:', analysisText);
      
      try {
        analysisResult = JSON.parse(analysisText);
      } catch (parseError) {
        console.error('Failed to parse OpenAI response as JSON:', parseError);
        // Fallback analysis
        analysisResult = {
          approved: false,
          confidence: 0,
          reasoning: "Failed to parse AI analysis. Manual review required.",
          expires_at: null,
          business_name: null,
          permit_number: permitNumber || null,
          issues: ["AI analysis parsing error"]
        };
      }
    } catch (error) {
      console.error('OpenAI analysis failed:', error);
      // Fallback analysis
      analysisResult = {
        approved: false,
        confidence: 0,
        reasoning: "AI analysis failed. Manual review required.",
        expires_at: null,
        business_name: null,
        permit_number: permitNumber || null,
        issues: ["AI analysis unavailable"]
      };
    }

    console.log('Analysis result:', analysisResult);

    // Update the document submission with analysis results
    const updateData: any = {
      ai_analysis: JSON.stringify(analysisResult),
      status: analysisResult.approved && analysisResult.confidence >= 80 ? 'approved' : 'pending'
    };

    if (analysisResult.expires_at) {
      updateData.expiry_date = analysisResult.expires_at;
    }

    const { error: updateError } = await supabase
      .from('document_submissions')
      .update(updateData)
      .eq('user_id', user.id)
      .eq('document_url', documentUrl);

    if (updateError) {
      console.error('Failed to update document submission:', updateError);
      throw new Error('Failed to save analysis results');
    }

    // If approved with high confidence, update user profile
    if (analysisResult.approved && analysisResult.confidence >= 80) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ municipality_approved: true })
        .eq('id', user.id);

      if (profileError) {
        console.error('Failed to update user profile:', profileError);
      }

      console.log('Document approved automatically for user:', user.id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        approved: analysisResult.approved && analysisResult.confidence >= 80,
        confidence: analysisResult.confidence,
        reasoning: analysisResult.reasoning,
        analysis: analysisResult
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error('Error in document-analyzer function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Unknown error occurred'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});