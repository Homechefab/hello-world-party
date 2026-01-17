import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const normalizeForMatch = (value: string) =>
  value
    .toLowerCase()
    .replaceAll('å', 'a')
    .replaceAll('ä', 'a')
    .replaceAll('ö', 'o')
    .replaceAll('é', 'e')
    .replaceAll('kommun', '')
    .replace(/[^a-z0-9]/g, '');

const pickFallbackMunicipalityUrl = (data: any, municipality?: string): string | null => {
  const urls: string[] = [];

  if (Array.isArray(data?.citations)) {
    urls.push(...data.citations.filter((u: unknown) => typeof u === 'string'));
  }

  if (Array.isArray(data?.search_results)) {
    for (const r of data.search_results) {
      if (typeof r?.url === 'string') urls.push(r.url);
    }
  }

  const blockedHostParts = [
    'kommunkartan',
    'fastighetsbyran',
    'arbetsformedlingen',
    'wikipedia',
    'linkedin',
    'facebook',
    'instagram',
    'youtube',
    'twitter',
    'x.com',
  ];

  const muniKey = municipality ? normalizeForMatch(municipality) : '';

  const candidates: { url: string; host: string }[] = [];
  for (const raw of urls) {
    try {
      const u = new URL(raw);
      const host = u.hostname.replace(/^www\./, '');
      if (!host.endsWith('.se')) continue;
      if (blockedHostParts.some((b) => host.includes(b))) continue;
      candidates.push({ url: u.toString(), host });
    } catch {
      // ignore invalid URLs
    }
  }

  if (candidates.length === 0) return null;

  // Prefer hostnames that resemble the municipality name
  if (muniKey) {
    const match = candidates.find((c) => normalizeForMatch(c.host).includes(muniKey));
    if (match) return match.url;
  }

  return candidates[0].url;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { address } = await req.json();

    if (!address?.trim()) {
      return new Response(
        JSON.stringify({ error: 'Adress krävs för sökning' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
    
    console.log('API key exists:', !!perplexityApiKey);
    console.log('API key length:', perplexityApiKey?.length || 0);
    
    if (!perplexityApiKey) {
      console.error('Perplexity API key not found in environment');
      return new Response(
        JSON.stringify({ error: 'API-konfiguration saknas - ingen API-nyckel hittades' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (perplexityApiKey.length < 10) {
      console.error('API key seems too short:', perplexityApiKey.length);
      return new Response(
        JSON.stringify({ error: 'API-nyckeln verkar vara för kort eller felaktig' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Searching for municipality for address: ${address}`);

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: 'Du är en expert på svenska kommuner och deras e-tjänster för livsmedelsregistrering. Du ska alltid hitta den officiella kommunwebbplatsen och länken till livsmedelsregistrering eller registrering av livsmedelsverksamhet. Svara ENDAST med giltigt JSON utan markdown-formatering.'
          },
          {
            role: 'user',
            content: `Hitta vilken kommun adressen "${address}" i Sverige tillhör och ge mig den DIREKTA länken till kommunens sida för registrering av livsmedelsverksamhet (ofta kallat "anmälan om livsmedelsverksamhet" eller "registrera livsmedelsanläggning").

Sök på kommunens officiella webbplats efter:
- E-tjänster för livsmedelsregistrering
- Anmälan om livsmedelsverksamhet
- Registrera livsmedelsanläggning
- Starta livsmedelsföretag

Svara i exakt detta JSON-format (utan markdown):
{
  "municipality": "Kommunnamn",
  "links": [
    {
      "title": "Registrera livsmedelsverksamhet",
      "url": "https://direktlänk-till-e-tjänst",
      "description": "E-tjänst för att anmäla livsmedelsverksamhet"
    }
  ]
}

Om du hittar kommunens webbplats men inte den exakta e-tjänsten, inkludera åtminstone en länk till kommunens huvudsida för livsmedel/miljö med instruktioner om var användaren kan hitta rätt blankett.`
          }
        ],
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 1000,
        return_images: false,
        return_related_questions: false,
        search_recency_filter: 'month',
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    });

    if (!response.ok) {
      console.error(`Perplexity API error: ${response.status} - ${response.statusText}`);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      
      let errorMessage = 'API-anrop misslyckades';
      if (response.status === 401) {
        errorMessage = 'API-nyckeln är inte giltig. Kontrollera att du har angett rätt Perplexity API-nyckel.';
      } else if (response.status === 403) {
        errorMessage = 'API-nyckeln har inte rätt behörigheter.';
      } else if (response.status === 429) {
        errorMessage = 'För många förfrågningar. Försök igen om en stund.';
      }
      
      return new Response(
        JSON.stringify({ 
          error: errorMessage,
          details: `Status: ${response.status}, ${errorText.slice(0, 200)}`
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const data = await response.json();
    console.log('Perplexity API response:', data);
    
    const content = data.choices[0].message.content;
    console.log('Raw content:', content);
    
    try {
      // Extract JSON from markdown code blocks if present
      let jsonContent = content;
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonContent = jsonMatch[1].trim();
      }
      
      const parsedResult = JSON.parse(jsonContent);
      console.log('Parsed result:', parsedResult);

      if (!Array.isArray(parsedResult?.links)) {
        parsedResult.links = [];
      }

      if (parsedResult.links.length === 0) {
        const fallbackUrl = pickFallbackMunicipalityUrl(data, parsedResult?.municipality);
        if (fallbackUrl) {
          parsedResult.links.push({
            title: 'Kommunens hemsida',
            url: fallbackUrl,
            description: 'Officiell webbplats (om e-tjänsten inte hittades direkt).'
          });
        }
      }
      
      return new Response(JSON.stringify(parsedResult), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Failed to parse API response:', parseError);
      console.error('Raw content:', content);
      
      return new Response(
        JSON.stringify({ error: 'Kunde inte tolka svaret från API:t' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
  } catch (error) {
    console.error('Error in municipality-search function:', error);
    return new Response(
      JSON.stringify({ error: 'Ett fel uppstod vid sökningen' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});