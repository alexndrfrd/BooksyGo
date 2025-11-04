import airportsData from './airports.json';

export interface Airport {
  id: string;
  iataCode: string;
  name: string;
  city: string;
  country: string;
  type: 'AIRPORT' | 'CITY';
  searchText?: string;
}

// Type-safe airports array
const airports: Airport[] = airportsData as Airport[];

/**
 * Search airports by keyword (city, airport name, IATA code)
 * Super fast - no API calls, instant results!
 */
export function searchAirports(query: string, limit: number = 10): Airport[] {
  if (!query || query.length < 2) {
    return [];
  }

  const searchTerm = query.toLowerCase().trim();
  const results: Airport[] = [];

  for (const airport of airports) {
    // Check if query matches
    if (
      airport.searchText?.includes(searchTerm) ||
      airport.city.toLowerCase().includes(searchTerm) ||
      airport.name.toLowerCase().includes(searchTerm) ||
      airport.iataCode.toLowerCase() === searchTerm ||
      airport.country.toLowerCase().includes(searchTerm)
    ) {
      results.push(airport);
      
      // Stop when we have enough results
      if (results.length >= limit) {
        break;
      }
    }
  }

  // Prioritize exact IATA matches and city matches
  return results.sort((a, b) => {
    const aIataMatch = a.iataCode.toLowerCase() === searchTerm;
    const bIataMatch = b.iataCode.toLowerCase() === searchTerm;
    if (aIataMatch && !bIataMatch) return -1;
    if (!aIataMatch && bIataMatch) return 1;

    const aCityMatch = a.city.toLowerCase().startsWith(searchTerm);
    const bCityMatch = b.city.toLowerCase().startsWith(searchTerm);
    if (aCityMatch && !bCityMatch) return -1;
    if (!aCityMatch && bCityMatch) return 1;

    return 0;
  });
}

/**
 * Get airport by IATA code
 */
export function getAirportByCode(iataCode: string): Airport | undefined {
  return airports.find(a => a.iataCode === iataCode);
}

/**
 * Get popular airports (most searched)
 */
export function getPopularAirports(limit: number = 20): Airport[] {
  const popularCodes = [
    'OTP', 'BUD', 'LON', 'LHR', 'LGW', 'PAR', 'CDG', 'ORY',
    'BCN', 'MAD', 'ROM', 'FCO', 'BER', 'AMS', 'VIE', 'PRG',
    'ATH', 'IST', 'DXB', 'NYC', 'JFK', 'LAX', 'MIA', 'SFO',
  ];

  return popularCodes
    .map(code => airports.find(a => a.iataCode === code))
    .filter((a): a is Airport => a !== undefined)
    .slice(0, limit);
}

console.log(`✅ Loaded ${airports.length} airports for autocomplete`);

