import { NextRequest, NextResponse } from 'next/server';

// Mock OpenAI Response (în producție va fi OpenAI API real)
// Pentru a folosi OpenAI real, uncomment-ează liniile de jos și adaugă API key în .env

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  messages: Message[];
  userContext?: {
    userId?: string;
    preferences?: any;
    recentSearches?: any[];
  };
}

// Mock travel data pentru răspunsuri inteligente
const TRAVEL_KNOWLEDGE = {
  destinations: {
    paris: {
      highlights: ['Turnul Eiffel', 'Louvre', 'Versailles', 'Notre Dame'],
      bestTime: 'Aprilie-Octombrie',
      avgBudget: '800-1200 EUR',
      recommendedDays: 4
    },
    santorini: {
      highlights: ['Apusuri în Oia', 'Plajă roșie', 'Degustări de vin'],
      bestTime: 'Mai-Septembrie',
      avgBudget: '1000-1500 EUR',
      recommendedDays: 5
    },
    barcelona: {
      highlights: ['Sagrada Familia', 'Park Güell', 'Las Ramblas', 'Plaja Barceloneta'],
      bestTime: 'Mai-Septembrie',
      avgBudget: '600-900 EUR',
      recommendedDays: 4
    },
    dubai: {
      highlights: ['Burj Khalifa', 'Dubai Mall', 'Safari în desert', 'Palm Jumeirah'],
      bestTime: 'Noiembrie-Martie',
      avgBudget: '1500-2500 EUR',
      recommendedDays: 5
    }
  },
  tips: {
    budget: [
      'Rezervă cu 2-3 luni înainte pentru cele mai bune prețuri',
      'Caută zboruri în zilele de miercuri/joi - sunt mai ieftine',
      'Folosește transportul public în loc de taxi',
      'Mănâncă la restaurante locale în loc de zone turistice'
    ],
    packing: [
      'Verifică prognoza meteo înainte să pleci',
      'Scanează documentele importante (pașaport, bilete)',
      'Ia cu tine un adaptor universal',
      'Lasă loc în bagaj pentru suveniruri'
    ]
  }
};

// Funcție pentru a genera răspunsuri inteligente
function generateTravelResponse(userMessage: string, context?: any): string {
  const msg = userMessage.toLowerCase();

  // Salutări
  if (msg.match(/\b(buna|salut|hello|hey|hi)\b/)) {
    return '👋 Bună! Sunt BooksyAI, asistentul tău personal de călătorii! 🌍✈️\n\n' +
           'Cum te pot ajuta astăzi?\n\n' +
           '💡 Pot să:\n' +
           '✈️ Găsesc cele mai bune oferte pentru destinația ta\n' +
           '🏨 Recomand hoteluri perfecte pentru bugetul tău\n' +
           '📦 Creez pachete turistice personalizate\n' +
           '💰 Ofer sfaturi pentru economisire\n' +
           '🗺️ Sugerez itinerarii detaliate\n\n' +
           'Unde vrei să mergi?';
  }

  // Paris
  if (msg.match(/\bparis\b/)) {
    const budget = msg.match(/(\d+)\s*(euro|eur|€)/i);
    const budgetText = budget ? `\n\n💰 Pentru bugetul tău de ${budget[1]}€, îți recomand:` : '';
    
    return `🗼 Paris - Orașul Luminilor!\n\n` +
           `✨ **Highlights:**\n` +
           TRAVEL_KNOWLEDGE.destinations.paris.highlights.map(h => `   • ${h}`).join('\n') + '\n\n' +
           `📅 **Perioada ideală:** ${TRAVEL_KNOWLEDGE.destinations.paris.bestTime}\n` +
           `💵 **Buget recomandat:** ${TRAVEL_KNOWLEDGE.destinations.paris.avgBudget}\n` +
           `⏱️ **Durata recomandată:** ${TRAVEL_KNOWLEDGE.destinations.paris.recommendedDays} zile` +
           budgetText + '\n\n' +
           `Am găsit 3 pachete perfecte pentru Paris! Vrei să le vezi?`;
  }

  // Santorini
  if (msg.match(/\bsantorini|grecia\b/)) {
    return `🏝️ Santorini - Paradisul Grec!\n\n` +
           `✨ **De ce să mergi:**\n` +
           TRAVEL_KNOWLEDGE.destinations.santorini.highlights.map(h => `   • ${h}`).join('\n') + '\n\n' +
           `📅 **Perioada ideală:** ${TRAVEL_KNOWLEDGE.destinations.santorini.bestTime}\n` +
           `💵 **Buget recomandat:** ${TRAVEL_KNOWLEDGE.destinations.santorini.avgBudget}\n` +
           `⏱️ **Durata recomandată:** ${TRAVEL_KNOWLEDGE.destinations.santorini.recommendedDays} zile\n\n` +
           `🌅 Perfect pentru cupluri romantice și iubitori de apusuri spectaculoase!\n\n` +
           `Am un pachet special "Santorini Sunset Romance" la doar 899€! Vrei să vezi detaliile?`;
  }

  // Barcelona
  if (msg.match(/\bbarcelona|spania\b/)) {
    return `🏖️ Barcelona - City & Beach Paradise!\n\n` +
           `✨ **Top atracții:**\n` +
           TRAVEL_KNOWLEDGE.destinations.barcelona.highlights.map(h => `   • ${h}`).join('\n') + '\n\n' +
           `📅 **Perioada ideală:** ${TRAVEL_KNOWLEDGE.destinations.barcelona.bestTime}\n` +
           `💵 **Buget recomandat:** ${TRAVEL_KNOWLEDGE.destinations.barcelona.avgBudget}\n\n` +
           `🎨 Combină perfect plaja cu cultura și artă!\n\n` +
           `Pachetul "Barcelona Beach & Culture" e la 549€! Interesant?`;
  }

  // Dubai
  if (msg.match(/\bdubai|emirate\b/)) {
    return `🏙️ Dubai - Luxul Oriental!\n\n` +
           `✨ **Experiențe unice:**\n` +
           TRAVEL_KNOWLEDGE.destinations.dubai.highlights.map(h => `   • ${h}`).join('\n') + '\n\n' +
           `📅 **Perioada ideală:** ${TRAVEL_KNOWLEDGE.destinations.dubai.bestTime}\n` +
           `💵 **Buget recomandat:** ${TRAVEL_KNOWLEDGE.destinations.dubai.avgBudget}\n\n` +
           `🌟 Pentru cei care vor lux și experiențe spectaculoase!\n\n` +
           `"Dubai Luxury Experience" - 1899€ all-inclusive! Vrei detalii?`;
  }

  // Buget
  if (msg.match(/\b(buget|ieftin|economis|pret|cost)\b/)) {
    return `💰 **Sfaturi pentru călătorii economice:**\n\n` +
           TRAVEL_KNOWLEDGE.tips.budget.map((tip, i) => `${i + 1}. ${tip}`).join('\n\n') + '\n\n' +
           `💡 **Bonus:** Cu BooksyGo economisești automat până la 50% prin:\n` +
           `   • Căutare flexibilă 60+ zile\n` +
           `   • Comparare de prețuri real-time\n` +
           `   • Pachete all-inclusive cu discount\n\n` +
           `Ce destinație te interesează? Îți găsesc cele mai bune oferte!`;
  }

  // Hotel
  if (msg.match(/\b(hotel|cazare|accommodation)\b/)) {
    return `🏨 **Găsim cazarea perfectă pentru tine!**\n\n` +
           `Pentru a-ți recomanda cele mai bune hoteluri, spune-mi:\n\n` +
           `📍 Unde mergi?\n` +
           `📅 Când? (check-in/check-out)\n` +
           `👥 Câte persoane?\n` +
           `💰 Ce buget ai? (per noapte)\n` +
           `⭐ Preferi 3*, 4* sau 5*?\n\n` +
           `Sau explorează secțiunea noastră de **Cazări** pentru oferte speciale!`;
  }

  // Pachete
  if (msg.match(/\b(pachet|package|all.?inclusive|complet)\b/)) {
    return `📦 **Pachete Turistice BooksyGo**\n\n` +
           `Avem pachete pentru toate gusturile:\n\n` +
           `🏖️ **Beach & Relax** - de la 549€\n` +
           `🏙️ **City Breaks** - de la 649€\n` +
           `💎 **Luxury Experiences** - de la 1299€\n` +
           `❤️ **Romantic Getaways** - de la 899€\n` +
           `🏔️ **Adventure Trips** - de la 999€\n\n` +
           `📍 Ce tip de experiență cauți? Sau îmi poți spune bugetul și găsesc eu cele mai bune opțiuni!`;
  }

  // Recomandare generală
  if (msg.match(/\b(recoman|sugera|unde|destinatie)\b/)) {
    const season = new Date().getMonth();
    let seasonalRec = '';
    
    if (season >= 5 && season <= 8) {
      seasonalRec = '☀️ **Perfect pentru vara aceasta:**\n' +
                    '   • Santorini - apusuri magice\n' +
                    '   • Barcelona - plajă + cultură\n' +
                    '   • Mykonos - party & beaches\n\n';
    } else {
      seasonalRec = '❄️ **Destinații perfecte pentru această perioadă:**\n' +
                    '   • Dubai - vremea perfectă\n' +
                    '   • Alpi - ski & wellness\n' +
                    '   • Paris - city break romantic\n\n';
    }
    
    return `🌍 **Recomandările mele TOP:**\n\n` +
           seasonalRec +
           `💡 Pentru recomandări personalizate, spune-mi:\n` +
           `   • Ce tip de călătorie vrei? (romantic, aventură, relax, city break)\n` +
           `   • Bugetul aproximativ?\n` +
           `   • Câte zile ai disponibile?\n\n` +
           `Și găsim împreună destinația perfectă! 🎯`;
  }

  // Default - răspuns generic inteligent
  return `🤔 Înțeleg că ești interesat de ${userMessage}!\n\n` +
         `💬 **Cum te pot ajuta mai exact?**\n\n` +
         `Pot să:\n` +
         `📍 Găsesc zboruri și hoteluri pentru destinația ta\n` +
         `💰 Îți arăt cele mai bune oferte în bugetul tău\n` +
         `📦 Creez un pachet personalizat\n` +
         `🗓️ Sugerez cel mai bun moment pentru călătorie\n` +
         `✈️ Ofer sfaturi și recomandări\n\n` +
         `Spune-mi mai multe despre ce îți dorești! 😊`;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { messages, userContext } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages are required' },
        { status: 400 }
      );
    }

    // Get last user message
    const lastUserMessage = messages[messages.length - 1];
    
    // Generate AI response (Mock)
    // În producție, aici ar fi:
    /*
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are BooksyAI, a helpful travel assistant for BooksyGo platform..."
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500
    });
    const assistantMessage = response.choices[0].message.content;
    */

    const assistantMessage = generateTravelResponse(lastUserMessage.content, userContext);

    // Simulate thinking delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({
      message: {
        role: 'assistant',
        content: assistantMessage
      },
      suggestions: [
        'Arată-mi cele mai bune oferte',
        'Vreau un pachet personalizat',
        'Ce destinații sunt populare acum?',
        'Cum economisesc mai mult?'
      ]
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'BooksyGo AI Chat',
    version: '1.0.0'
  });
}

