/**
 * Skyscanner Flight Search API Integration
 * Provides real-time flight data from Skyscanner
 */

const SKYSCANNER_API_KEY = process.env.SKYSCANNER_API_KEY || '';
const SKYSCANNER_API_BASE_URL = 'https://partners.api.skyscanner.net/apiservices';

export interface SkyscannerSearchParams {
  originSkyId: string; // e.g., "LOND" for London
  destinationSkyId: string;
  departureDate: string; // YYYY-MM-DD
  returnDate?: string;
  adults?: number;
  children?: number;
  infants?: number;
  cabinClass?: 'economy' | 'premium_economy' | 'business' | 'first';
  currency?: string;
  locale?: string;
  market?: string;
}

export interface SkyscannerFlight {
  id: string;
  price: {
    amount: number;
    currency: string;
  };
  legs: Array<{
    origin: {
      displayCode: string;
      name: string;
    };
    destination: {
      displayCode: string;
      name: string;
    };
    departure: string; // ISO date
    arrival: string;
    duration: number; // minutes
    stops: number;
    carriers: Array<{
      name: string;
      imageUrl: string;
    }>;
  }>;
  deepLink: string; // Affiliate link to book
}

/**
 * Search flights using Skyscanner API
 */
export async function searchFlights(
  params: SkyscannerSearchParams
): Promise<SkyscannerFlight[]> {
  try {
    // Step 1: Create search session
    const sessionResponse = await fetch(
      `${SKYSCANNER_API_BASE_URL}/v3/flights/live/search/create`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': SKYSCANNER_API_KEY,
        },
        body: JSON.stringify({
          query: {
            market: params.market || 'RO',
            locale: params.locale || 'ro-RO',
            currency: params.currency || 'EUR',
            queryLegs: [
              {
                originPlaceId: { iata: params.originSkyId },
                destinationPlaceId: { iata: params.destinationSkyId },
                date: {
                  year: parseInt(params.departureDate.split('-')[0]),
                  month: parseInt(params.departureDate.split('-')[1]),
                  day: parseInt(params.departureDate.split('-')[2]),
                },
              },
              ...(params.returnDate
                ? [
                    {
                      originPlaceId: { iata: params.destinationSkyId },
                      destinationPlaceId: { iata: params.originSkyId },
                      date: {
                        year: parseInt(params.returnDate.split('-')[0]),
                        month: parseInt(params.returnDate.split('-')[1]),
                        day: parseInt(params.returnDate.split('-')[2]),
                      },
                    },
                  ]
                : []),
            ],
            adults: params.adults || 1,
            children: params.children || 0,
            infants: params.infants || 0,
            cabinClass: params.cabinClass || 'economy',
          },
        }),
      }
    );

    if (!sessionResponse.ok) {
      throw new Error(`Skyscanner API error: ${sessionResponse.status}`);
    }

    const sessionData = await sessionResponse.json();
    const sessionToken = sessionData.sessionToken;

    // Step 2: Poll for results
    const pollResponse = await fetch(
      `${SKYSCANNER_API_BASE_URL}/v3/flights/live/search/poll/${sessionToken}`,
      {
        method: 'GET',
        headers: {
          'x-api-key': SKYSCANNER_API_KEY,
        },
      }
    );

    if (!pollResponse.ok) {
      throw new Error(`Skyscanner poll error: ${pollResponse.status}`);
    }

    const pollData = await pollResponse.json();

    // Step 3: Transform results to our format
    const flights: SkyscannerFlight[] = pollData.content.results.itineraries.map(
      (itinerary: any) => ({
        id: itinerary.id,
        price: {
          amount: itinerary.pricingOptions[0].price.amount,
          currency: params.currency || 'EUR',
        },
        legs: itinerary.legs.map((leg: any) => ({
          origin: {
            displayCode: leg.origin.displayCode,
            name: leg.origin.name,
          },
          destination: {
            displayCode: leg.destination.displayCode,
            name: leg.destination.name,
          },
          departure: leg.departure,
          arrival: leg.arrival,
          duration: leg.duration,
          stops: leg.stops.length,
          carriers: leg.carriers.map((carrier: any) => ({
            name: carrier.name,
            imageUrl: carrier.imageUrl,
          })),
        })),
        deepLink: itinerary.pricingOptions[0].items[0].deepLink,
      })
    );

    return flights;
  } catch (error) {
    console.error('Skyscanner API error:', error);
    throw error;
  }
}

/**
 * Get autocomplete suggestions for airport/city search
 */
export async function getPlaceSuggestions(query: string): Promise<
  Array<{
    skyId: string;
    entityId: string;
    name: string;
    type: string; // 'CITY' | 'AIRPORT'
    iata?: string;
  }>
> {
  try {
    const response = await fetch(
      `${SKYSCANNER_API_BASE_URL}/v1/autosuggest/flights?query=${encodeURIComponent(
        query
      )}&market=RO&locale=ro-RO`,
      {
        headers: {
          'x-api-key': SKYSCANNER_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Autocomplete error: ${response.status}`);
    }

    const data = await response.json();
    return data.places || [];
  } catch (error) {
    console.error('Autocomplete error:', error);
    return [];
  }
}

/**
 * Get flight price history/trends (for price monitoring)
 */
export async function getFlightPriceInsights(params: {
  originSkyId: string;
  destinationSkyId: string;
  departureMonth: string; // YYYY-MM
}): Promise<{
  cheapestMonth: string;
  averagePrice: number;
  priceHistory: Array<{ date: string; price: number }>;
}> {
  try {
    const response = await fetch(
      `${SKYSCANNER_API_BASE_URL}/v1/flights/browse/pricegraph/${params.originSkyId}/${params.destinationSkyId}/${params.departureMonth}`,
      {
        headers: {
          'x-api-key': SKYSCANNER_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Price insights error: ${response.status}`);
    }

    const data = await response.json();

    // Find cheapest month
    const quotes = data.Quotes || [];
    const cheapest = quotes.reduce((min: any, q: any) =>
      q.MinPrice < min.MinPrice ? q : min
    );

    return {
      cheapestMonth: cheapest.OutboundLeg.DepartureDate,
      averagePrice:
        quotes.reduce((sum: number, q: any) => sum + q.MinPrice, 0) /
        quotes.length,
      priceHistory: quotes.map((q: any) => ({
        date: q.OutboundLeg.DepartureDate,
        price: q.MinPrice,
      })),
    };
  } catch (error) {
    console.error('Price insights error:', error);
    throw error;
  }
}

