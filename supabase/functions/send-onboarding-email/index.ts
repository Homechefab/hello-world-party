import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OnboardingEmailRequest {
  type: 'chef' | 'kitchen_partner' | 'restaurant' | 'business';
  applicant_name: string;
  applicant_email: string;
  business_name: string;
}

interface OnboardingStep {
  title: string;
  description: string;
  timeframe?: string;
  tips?: string[];
}

interface OnboardingContent {
  role: string;
  title: string;
  introduction: string;
  steps: OnboardingStep[];
  requirements: string[];
  faq: { question: string; answer: string }[];
  contact: {
    phone: string;
    email: string;
    hours: string;
  };
  provision: string;
}

const onboardingData: Record<string, OnboardingContent> = {
  chef: {
    role: 'chef',
    title: 'Kock',
    provision: '20%',
    introduction: 'Välkommen till Homechef! Denna guide hjälper dig genom hela ansökningsprocessen för att bli hemkock på vår plattform.',
    steps: [
      {
        title: '1. Skicka in ansökan',
        description: 'Fyll i dina personuppgifter, erfarenhet och ladda upp ditt kommunbeslut (livsmedelstillstånd).',
        timeframe: 'Ca 15-20 minuter',
        tips: [
          'Ha ditt kommunbeslut redo som PDF eller bild',
          'Beskriv din kulinariska erfarenhet detaljerat',
          'Ange den e-post där du vill få inloggningsuppgifter'
        ]
      },
      {
        title: '2. Granskning av admin',
        description: 'Vårt team granskar din ansökan och dina dokument.',
        timeframe: '2-3 arbetsdagar',
        tips: [
          'Vi kontaktar dig om vi behöver kompletteringar',
          'Du får ett mail när beslut är fattat'
        ]
      },
      {
        title: '3. Godkannande och kontoskapande',
        description: 'Nar du godkanns skapas ditt kock-konto automatiskt och du far inloggningsuppgifter via e-post.',
        timeframe: 'Omedelbart efter godkannande',
        tips: [
          'Kolla din skrappost om du inte ser mailet',
          'Byt losenord vid forsta inloggning'
        ]
      },
      {
        title: '4. Uppstartsmote',
        description: 'Nar du fatt dina inloggningsuppgifter bokar vi in ett personligt mote for att hjalpa dig komma igang.',
        timeframe: 'Inom en vecka efter godkannande',
        tips: [
          'Vi hjalper dig lagga upp dina ratter',
          'Tips pa hur du tar proffsiga bilder pa maten',
          'Genomgang av din dashboard och funktioner',
          'Fragor och svar om plattformen'
        ]
      },
      {
        title: '5. Borja salja!',
        description: 'Efter uppstartsmotet ar du redo att borja ta emot bestallningar.',
        tips: [
          'Satt konkurrenskraftiga priser',
          'Svara snabbt pa forfragningar for battre recensioner'
        ]
      }
    ],
    requirements: [
      'Godkänt kommunbeslut (livsmedelstillstånd) - OBLIGATORISKT',
      'Registrerat företag eller F-skattsedel (rekommenderas)',
      'Ansvarsförsäkring (rekommenderas)',
      'Godkänt kök enligt kommunens krav'
    ],
    faq: [
      {
        question: 'Hur lång tid tar godkännandet?',
        answer: 'Vanligtvis 2-3 arbetsdagar. Om komplettering behövs kan det ta längre.'
      },
      {
        question: 'Vad kostar det att vara kock på Homechef?',
        answer: 'Det är gratis att registrera sig. Vi tar 20% provision på försäljningen.'
      },
      {
        question: 'Hur får jag betalt?',
        answer: 'Utbetalningar sker veckovis till ditt angivna bankkonto.'
      }
    ],
    contact: {
      phone: '0734234686',
      email: 'support@homechef.nu',
      hours: 'Vardagar 09-18, Helger 10-16'
    }
  },
  restaurant: {
    role: 'restaurant',
    title: 'Restaurang',
    provision: '3 999 kr/mån (fast avgift)',
    introduction: 'Välkommen till Homechef! Denna guide hjälper din restaurang att nå fler kunder genom vår plattform.',
    steps: [
      {
        title: '1. Skicka in ansökan',
        description: 'Fyll i restaurangens uppgifter, beskrivning och ladda upp relevanta tillstånd.',
        timeframe: 'Ca 20-30 minuter',
        tips: [
          'Ha ditt restaurangtillstånd redo',
          'Beskriv er matprofil och specialiteter',
          'Ange kontaktperson för Homechef-ärenden'
        ]
      },
      {
        title: '2. Granskning',
        description: 'Vårt team granskar din ansökan och verifierar att alla krav är uppfyllda.',
        timeframe: '3-5 arbetsdagar',
        tips: [
          'Se till att HACCP-dokumentation är i ordning',
          'Vi kan göra ett kort telefonsamtal för verifiering'
        ]
      },
      {
        title: '3. Kontoskapande',
        description: 'Efter godkannande skapas ert restaurangkonto med full tillgang till plattformen.',
        timeframe: 'Omedelbart efter godkannande'
      },
      {
        title: '4. Uppstartsmote',
        description: 'Vi bokar in ett mote for att hjalpa er komma igang med plattformen.',
        timeframe: 'Inom en vecka efter godkannande',
        tips: [
          'Genomgang av hur ni lagger upp menyn',
          'Tips pa fotografering av ratter',
          'Fragor och svar om plattformen'
        ]
      },
      {
        title: '5. Lagg upp er meny',
        description: 'Lagg upp era ratter med bilder, priser och beskrivningar. Borja ta emot bestallningar!',
        tips: [
          'Professionella foton okar forsaljningen med 40%',
          'Uppdatera menyn regelbundet',
          'Erbjud specialerbjudanden for nya kunder'
        ]
      }
    ],
    requirements: [
      'Restaurangtillstånd från kommunen - OBLIGATORISKT',
      'HACCP-dokumentation (rekommenderas)',
      'Ansvarsförsäkring (rekommenderas)',
      'Organisationsnummer'
    ],
    faq: [
      {
        question: 'Vad kostar det att vara pa Homechef?',
        answer: 'Fast manadsavgift pa 3 999 kr/man. Inga provisioner - ni beháller hela intakten fran maten. Kunden betalar maten + leveransavgift som gar till budet.'
      },
      {
        question: 'Kan vi integrera med vårt kassasystem?',
        answer: 'Ja, vi erbjuder integration med flera populära kassasystem. Kontakta oss för mer info.'
      },
      {
        question: 'Hur hanteras leveranser?',
        answer: 'Ni väljer själva om ni vill erbjuda hämtning, egen leverans eller använda våra samarbetspartners.'
      }
    ],
    contact: {
      phone: '0734234686',
      email: 'support@homechef.nu',
      hours: 'Vardagar 09-18, Helger 10-16'
    }
  },
  kitchen_partner: {
    role: 'kitchen_partner',
    title: 'Kokspartner',
    provision: '20%',
    introduction: 'Valkommen till Homechef! Som kokspartner hyr du ut ditt kok till kockar som behover en professionell arbetsplats.',
    steps: [
      {
        title: '1. Registrera ditt kok',
        description: 'Beskriv ditt kok, utrustning, tillgangliga tider och pris per timme.',
        timeframe: 'Ca 15-20 minuter',
        tips: [
          'Ta tydliga foton pa koket och utrustningen',
          'Lista all tillganglig utrustning',
          'Var tydlig med regler och forvantningar'
        ]
      },
      {
        title: '2. Verifiering',
        description: 'Vi granskar att koket uppfyller vara krav och eventuellt gor en inspektion.',
        timeframe: '3-7 arbetsdagar',
        tips: [
          'Se till att koket ar godkant av kommunen',
          'Ha brandskyddsutrustning pa plats'
        ]
      },
      {
        title: '3. Aktivering',
        description: 'Nar ditt kok ar godkant blir det synligt for kockar som soker arbetsplats.',
        timeframe: 'Omedelbart efter godkannande'
      },
      {
        title: '4. Uppstartsmote',
        description: 'Vi bokar in ett mote for att hjalpa dig komma igang med plattformen.',
        timeframe: 'Inom en vecka efter godkannande',
        tips: [
          'Genomgang av bokningssystemet',
          'Tips pa hur du presenterar ditt kok',
          'Fragor och svar om plattformen'
        ]
      },
      {
        title: '5. Ta emot bokningar',
        description: 'Godkann eller neka bokningsforfragningar. Vi hanterar betalningen.',
        tips: [
          'Svara snabbt pa forfragningar',
          'Hall kalendern uppdaterad',
          'Goda recensioner ger fler bokningar'
        ]
      }
    ],
    requirements: [
      'Godkant kok fran kommunen - OBLIGATORISKT',
      'Ansvarsforsakring (rekommenderas)',
      'Grundlaggande koksutrustning',
      'Brandslackare och sakerhetsutrustning'
    ],
    faq: [
      {
        question: 'Vad ar en rimlig timpris?',
        answer: 'De flesta kok tar mellan 200-500 kr/timme beroende pa storlek och utrustning.'
      },
      {
        question: 'Vilken provision tar Homechef?',
        answer: 'Vi tar 20% provision pa varje bokning.'
      },
      {
        question: 'Hur ofta far jag betalt?',
        answer: 'Utbetalningar sker manadsvis till ditt angivna bankkonto.'
      }
    ],
    contact: {
      phone: '0734234686',
      email: 'support@homechef.nu',
      hours: 'Vardagar 09-18, Helger 10-16'
    }
  },
  business: {
    role: 'business',
    title: 'Foretagspartner',
    provision: '20%',
    introduction: 'Valkommen till Homechef! Som foretagspartner kan ni erbjuda era anstallda och kunder tillgang till hemalagad mat fran lokala kockar.',
    steps: [
      {
        title: '1. Skicka in ansokan',
        description: 'Fyll i foretagsuppgifter, organisationsnummer och beskriv hur ni vill anvanda Homechef.',
        timeframe: 'Ca 20-30 minuter',
        tips: [
          'Ha organisationsnummer och foretagsuppgifter redo',
          'Beskriv ert behov - catering, personalmat, events?',
          'Ange kontaktperson for Homechef-samarbetet'
        ]
      },
      {
        title: '2. Granskning och kontakt',
        description: 'Vart team granskar er ansokan och kontaktar er for att diskutera samarbetet.',
        timeframe: '3-5 arbetsdagar',
        tips: [
          'Vi ringer eller mailar for att diskutera era behov',
          'Forbered fragor om hur ni vill anvanda tjansten'
        ]
      },
      {
        title: '3. Avtalsskapande',
        description: 'Vi skapar ett skraddarsytt avtal baserat pa era behov och volymer.',
        timeframe: '1-2 veckor',
        tips: [
          'Vi diskuterar priser och volymer',
          'Specialerbjudanden for stora foretag'
        ]
      },
      {
        title: '4. Uppstartsmote',
        description: 'Vi bokar in ett mote for att hjalpa er komma igang med plattformen och era anstallda.',
        timeframe: 'Inom en vecka efter avtal',
        tips: [
          'Genomgang av hur era anstallda bestaller',
          'Setup av foretagskonto och fakturering',
          'Tips pa hur ni kommunicerar tjansten internt',
          'Fragor och svar om plattformen'
        ]
      },
      {
        title: '5. Lansering',
        description: 'Lansera Homechef for era anstallda eller kunder och borja bestalla!',
        tips: [
          'Vi hjalper med internt kommunikationsmaterial',
          'Mojlighet till rabatterade priser vid stora volymer',
          'Dedikerad kontaktperson for ert foretag'
        ]
      }
    ],
    requirements: [
      'Registrerat foretag med organisationsnummer - OBLIGATORISKT',
      'Kontaktperson med beslutanderatt',
      'Faktureringsuppgifter',
      'Uppskattad volym per manad (rekommenderas)'
    ],
    faq: [
      {
        question: 'Vilka foretag kan anvanda Homechef?',
        answer: 'Alla foretag oavsett storlek kan anvanda var tjanst - fran sma startups till stora koncerner.'
      },
      {
        question: 'Hur fungerar faktureringen?',
        answer: 'Ni far en samlad faktura i slutet av varje manad for alla bestallningar.'
      },
      {
        question: 'Finns det rabatter for stora volymer?',
        answer: 'Ja, vi erbjuder volymrabatter. Kontakta oss for att diskutera era behov.'
      },
      {
        question: 'Kan vi anvanda Homechef for events?',
        answer: 'Absolut! Vi hjalper er hitta kockar for catering, teambuilding och andra events.'
      }
    ],
    contact: {
      phone: '0734234686',
      email: 'support@homechef.nu',
      hours: 'Vardagar 09-18, Helger 10-16'
    }
  }
};

const generateOnboardingHTML = (content: OnboardingContent, applicantName: string, businessName: string) => {
  const stepsHTML = content.steps.map((step, index) => `
    <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 16px; border-left: 4px solid #f97316;">
      <h3 style="color: #f97316; margin: 0 0 8px 0; font-size: 16px;">${step.title}</h3>
      <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px;">${step.description}</p>
      ${step.timeframe ? `<p style="color: #6b7280; font-size: 12px; margin: 0 0 8px 0;">⏱ ${step.timeframe}</p>` : ''}
      ${step.tips && step.tips.length > 0 ? `
        <ul style="margin: 8px 0 0 0; padding-left: 20px;">
          ${step.tips.map(tip => `<li style="color: #374151; font-size: 13px; margin-bottom: 4px;">✓ ${tip}</li>`).join('')}
        </ul>
      ` : ''}
    </div>
  `).join('');

  const requirementsHTML = content.requirements.map(req => 
    `<li style="margin-bottom: 8px; color: #374151; font-size: 14px;">📋 ${req}</li>`
  ).join('');

  const faqHTML = content.faq.map(item => `
    <div style="margin-bottom: 16px;">
      <p style="font-weight: bold; color: #374151; margin: 0 0 4px 0; font-size: 14px;">❓ ${item.question}</p>
      <p style="color: #6b7280; margin: 0; font-size: 13px; padding-left: 24px;">→ ${item.answer}</p>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 40px 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🎉 Din ansökan är mottagen!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">Onboarding-guide för ${content.title}</p>
        </div>

        <!-- Content -->
        <div style="padding: 30px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Hej <strong>${applicantName}</strong>!</p>
          
          <p style="color: #374151; margin-bottom: 20px;">
            Tack för att du skickade in din ansökan för <strong>${businessName}</strong>. 
            ${content.introduction}
          </p>

          <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              <strong>⏱ Vad händer nu?</strong><br>
              Din ansökan granskas av vårt team. Du får svar inom 2-5 arbetsdagar.
            </p>
          </div>

          <!-- Steps -->
          <h2 style="color: #111827; font-size: 20px; margin: 32px 0 16px 0; border-bottom: 2px solid #f97316; padding-bottom: 8px;">
            📝 Steg för steg
          </h2>
          ${stepsHTML}

          <!-- Requirements -->
          <h2 style="color: #111827; font-size: 20px; margin: 32px 0 16px 0; border-bottom: 2px solid #f97316; padding-bottom: 8px;">
            ✅ Krav & dokument
          </h2>
          <ul style="padding-left: 0; list-style: none;">
            ${requirementsHTML}
          </ul>

          <!-- FAQ -->
          <h2 style="color: #111827; font-size: 20px; margin: 32px 0 16px 0; border-bottom: 2px solid #f97316; padding-bottom: 8px;">
            💬 Vanliga frågor
          </h2>
          ${faqHTML}

          <!-- Provision info -->
          <div style="background-color: #dbeafe; border-radius: 8px; padding: 16px; margin: 24px 0;">
            <p style="margin: 0; color: #1e40af; font-size: 14px;">
              <strong>💰 Provision:</strong> Homechef tar ${content.provision} provision på din försäljning/uthyrning. 
              Det är helt gratis att registrera sig!
            </p>
          </div>

          <!-- Contact -->
          <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin-top: 32px;">
            <h3 style="margin: 0 0 12px 0; color: #111827; font-size: 16px;">📞 Behöver du hjälp?</h3>
            <p style="margin: 0; color: #374151; font-size: 14px;">
              <strong>Telefon:</strong> ${content.contact.phone}<br>
              <strong>E-post:</strong> ${content.contact.email}<br>
              <strong>Öppettider:</strong> ${content.contact.hours}
            </p>
          </div>

        </div>

        <!-- Footer -->
        <div style="background-color: #111827; color: #9ca3af; padding: 24px 30px; text-align: center;">
          <p style="margin: 0 0 8px 0; font-size: 14px;">
            Spara detta mail - det innehåller viktig information om din ansökan.
          </p>
          <p style="margin: 0; font-size: 12px;">
            © 2025 Homechef | <a href="https://homechef.nu" style="color: #f97316; text-decoration: none;">homechef.nu</a>
          </p>
        </div>

      </div>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const supabaseAnon = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseAnon.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const data: OnboardingEmailRequest = await req.json();
    const { type, applicant_name, applicant_email, business_name } = data;

    console.log(`Sending onboarding email for ${type}:`, {
      applicant_name,
      applicant_email,
      business_name
    });

    const content = onboardingData[type];
    if (!content) {
      throw new Error(`Unknown application type: ${type}`);
    }

    const htmlContent = generateOnboardingHTML(content, applicant_name, business_name);

    const emailResponse = await resend.emails.send({
      from: "Homechef <info@homechef.nu>",
      to: [applicant_email],
      subject: `🎉 Tack för din ansökan, ${applicant_name}! - Onboarding-guide`,
      html: htmlContent,
    });

    console.log("Onboarding email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-onboarding-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
