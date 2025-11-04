// Amadeus API Client for BooksyGo
// Docs: https://developers.amadeus.com/self-service/apis-docs

const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY || '';
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET || '';
const AMADEUS_BASE_URL = process.env.AMADEUS_BASE_URL || 'https://test.api.amadeus.com';

// Cache for access token (valid for 30 min)
let cachedToken: { token: string; expiresAt: number } | null = null;

/**
 * Get OAuth2 access token from Amadeus
 * Token is cached for 30 minutes
 */
export async function getAccessToken(): Promise<string> {
  // Check if we have a valid cached token
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  // Get new token
  const response = await fetch(`${AMADEUS_BASE_URL}/v1/security/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: AMADEUS_API_KEY,
      client_secret: AMADEUS_API_SECRET,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get Amadeus access token: ${response.statusText}`);
  }

  const data = await response.json();
  
  // Cache token (expires in 30 min - 1799 seconds)
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000, // Subtract 1 min for safety
  };

  return data.access_token;
}

/**
 * Search for flights (real-time)
 * Returns all available flights for specific date
 */
export async function searchFlights(params: {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  cabinClass?: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
}) {
  const token = await getAccessToken();

  const url = new URL(`${AMADEUS_BASE_URL}/v2/shopping/flight-offers`);
  url.searchParams.append('originLocationCode', params.origin);
  url.searchParams.append('destinationLocationCode', params.destination);
  url.searchParams.append('departureDate', params.departureDate);
  if (params.returnDate) {
    url.searchParams.append('returnDate', params.returnDate);
  }
  url.searchParams.append('adults', params.adults.toString());
  if (params.children) {
    url.searchParams.append('children', params.children.toString());
  }
  if (params.cabinClass) {
    url.searchParams.append('travelClass', params.cabinClass);
  }
  url.searchParams.append('currencyCode', 'EUR');
  url.searchParams.append('max', '50'); // Get top 50 results

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Amadeus API error:', errorText);
    throw new Error(`Amadeus API error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get flight inspiration search (60-day best prices calendar!)
 * This is the KILLER FEATURE - shows cheapest dates to fly
 */
export async function getFlightInspirationSearch(params: {
  origin: string;
  destination?: string;
  departureDate?: string;
  oneWay?: boolean;
  duration?: string;
  nonStop?: boolean;
  maxPrice?: number;
  viewBy?: 'DATE' | 'DURATION' | 'WEEK' | 'COUNTRY';
}) {
  const token = await getAccessToken();

  const url = new URL(`${AMADEUS_BASE_URL}/v1/shopping/flight-dates`);
  url.searchParams.append('origin', params.origin);
  if (params.destination) {
    url.searchParams.append('destination', params.destination);
  }
  if (params.departureDate) {
    url.searchParams.append('departureDate', params.departureDate);
  }
  url.searchParams.append('oneWay', params.oneWay ? 'true' : 'false');
  if (params.duration) {
    url.searchParams.append('duration', params.duration);
  }
  if (params.nonStop !== undefined) {
    url.searchParams.append('nonStop', params.nonStop.toString());
  }
  if (params.maxPrice) {
    url.searchParams.append('maxPrice', params.maxPrice.toString());
  }
  if (params.viewBy) {
    url.searchParams.append('viewBy', params.viewBy);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Amadeus Inspiration API error:', errorText);
    throw new Error(`Amadeus Inspiration API error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get flight price analysis (trends, best time to book)
 * Shows if current price is low, medium, or high
 */
export async function getFlightPriceAnalysis(params: {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
}) {
  const token = await getAccessToken();

  const url = new URL(`${AMADEUS_BASE_URL}/v1/analytics/itinerary-price-metrics`);
  url.searchParams.append('originIataCode', params.origin);
  url.searchParams.append('destinationIataCode', params.destination);
  url.searchParams.append('departureDate', params.departureDate);
  if (params.returnDate) {
    url.searchParams.append('returnDate', params.returnDate);
  }
  url.searchParams.append('currencyCode', 'EUR');

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Amadeus Price Analysis API error:', errorText);
    throw new Error(`Amadeus Price Analysis API error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Search for destinations (autocomplete)
 * Returns airports and cities matching query
 */
export async function searchLocations(query: string) {
  const token = await getAccessToken();

  const url = new URL(`${AMADEUS_BASE_URL}/v1/reference-data/locations`);
  url.searchParams.append('keyword', query);
  url.searchParams.append('subType', 'CITY,AIRPORT');
  url.searchParams.append('page[limit]', '10');

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Amadeus Location Search API error:', errorText);
    throw new Error(`Amadeus Location Search API error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Transform Amadeus flight data to our internal format
 */
export function transformAmadeusFlightData(amadeusData: any) {
  if (!amadeusData.data || !Array.isArray(amadeusData.data)) {
    return [];
  }

  return amadeusData.data.map((offer: any, index: number) => {
    const firstItinerary = offer.itineraries[0];
    const firstSegment = firstItinerary.segments[0];
    const lastSegment = firstItinerary.segments[firstItinerary.segments.length - 1];

    return {
      id: offer.id || `${index}`,
      airline: firstSegment.carrierCode,
      flightNumber: `${firstSegment.carrierCode} ${firstSegment.number}`,
      departure: {
        airport: firstSegment.departure.iataCode,
        city: firstSegment.departure.iataCode, // Amadeus doesn't provide city name here
        time: new Date(firstSegment.departure.at).toLocaleTimeString('ro-RO', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        date: new Date(firstSegment.departure.at).toISOString().split('T')[0],
      },
      arrival: {
        airport: lastSegment.arrival.iataCode,
        city: lastSegment.arrival.iataCode,
        time: new Date(lastSegment.arrival.at).toLocaleTimeString('ro-RO', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        date: new Date(lastSegment.arrival.at).toISOString().split('T')[0],
      },
      duration: firstItinerary.duration.replace('PT', '').toLowerCase(),
      stops: firstItinerary.segments.length - 1,
      price: parseFloat(offer.price.total),
      currency: offer.price.currency,
      availableSeats: offer.numberOfBookableSeats || 9,
      cabinClass: firstSegment.cabin || 'Economy',
      aircraft: firstSegment.aircraft?.code || 'Unknown',
    };
  });
}

// searchLocations function removed - now using static airports database
// See: lib/airports-search.ts for the new implementation

