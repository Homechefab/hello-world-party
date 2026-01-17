import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OnboardingEmailRequest {
  type: 'chef' | 'kitchen_partner' | 'restaurant';
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
        title: '3. Godkännande & kontoskapande',
        description: 'När du godkänns skapas ditt kock-konto automatiskt och du får inloggningsuppgifter via e-post.',
        timeframe: 'Omedelbart efter godkännande',
        tips: [
          'Kolla din skräppost om du inte ser mailet',
          'Byt lösenord vid första inloggning'
        ]
      },
      {
        title: '4. Börja sälja!',
        description: 'Logga in på din dashboard, lägg upp dina rätter och börja ta emot beställningar.',
        tips: [
          'Ta proffsiga foton på dina rätter',
          'Sätt konkurrenskraftiga priser',
          'Svara snabbt på förfrågningar för bättre recensioner'
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
      email: 'support@homechef.se',
      hours: 'Vardagar 09-18, Helger 10-16'
    }
  },
  restaurant: {
    role: 'restaurant',
    title: 'Restaurang',
    provision: '18%',
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
        description: 'Efter godkännande skapas ert restaurangkonto med full tillgång till plattformen.',
        timeframe: 'Omedelbart efter godkännande'
      },
      {
        title: '4. Lägg upp er meny',
        description: 'Lägg upp era rätter med bilder, priser och beskrivningar. Börja ta emot beställningar!',
        tips: [
          'Professionella foton ökar försäljningen med 40%',
          'Uppdatera menyn regelbundet',
          'Erbjud specialerbjudanden för nya kunder'
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
        question: 'Vilken provision tar Homechef?',
        answer: 'Vi tar 18% provision på varje beställning via plattformen.'
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
      email: 'support@homechef.se',
      hours: 'Vardagar 09-18, Helger 10-16'
    }
  },
  kitchen_partner: {
    role: 'kitchen_partner',
    title: 'Kökspartner',
    provision: '15%',
    introduction: 'Välkommen till Homechef! Som kökspartner hyr du ut ditt kök till kockar som behöver en professionell arbetsplats.',
    steps: [
      {
        title: '1. Registrera ditt kök',
        description: 'Beskriv ditt kök, utrustning, tillgängliga tider och pris per timme.',
        timeframe: 'Ca 15-20 minuter',
        tips: [
          'Ta tydliga foton på köket och utrustningen',
          'Lista all tillgänglig utrustning',
          'Var tydlig med regler och förväntningar'
        ]
      },
      {
        title: '2. Verifiering',
        description: 'Vi granskar att köket uppfyller våra krav och eventuellt gör en inspektion.',
        timeframe: '3-7 arbetsdagar',
        tips: [
          'Se till att köket är godkänt av kommunen',
          'Ha brandskyddsutrustning på plats'
        ]
      },
      {
        title: '3. Aktivering',
        description: 'När ditt kök är godkänt blir det synligt för kockar som söker arbetsplats.',
        timeframe: 'Omedelbart efter godkännande'
      },
      {
        title: '4. Ta emot bokningar',
        description: 'Godkänn eller neka bokningsförfrågningar. Vi hanterar betalningen.',
        tips: [
          'Svara snabbt på förfrågningar',
          'Håll kalendern uppdaterad',
          'Goda recensioner ger fler bokningar'
        ]
      }
    ],
    requirements: [
      'Godkänt kök från kommunen - OBLIGATORISKT',
      'Ansvarsförsäkring (rekommenderas)',
      'Grundläggande köksutrustning',
      'Brandsläckare och säkerhetsutrustning'
    ],
    faq: [
      {
        question: 'Vad är en rimlig timpris?',
        answer: 'De flesta kök tar mellan 200-500 kr/timme beroende på storlek och utrustning.'
      },
      {
        question: 'Vilken provision tar Homechef?',
        answer: 'Vi tar 15% provision på varje bokning.'
      },
      {
        question: 'Hur ofta får jag betalt?',
        answer: 'Utbetalningar sker månadsvis till ditt angivna bankkonto.'
      }
    ],
    contact: {
      phone: '0734234686',
      email: 'support@homechef.se',
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
      from: "Homechef <onboarding@resend.dev>",
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
