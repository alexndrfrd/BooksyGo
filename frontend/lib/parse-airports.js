const fs = require('fs');
const path = require('path');

// Read airports.dat
const data = fs.readFileSync(path.join(__dirname, 'airports.dat'), 'utf-8');
const lines = data.split('\n').filter(line => line.trim());

const airports = [];

for (const line of lines) {
  // Parse CSV (with quoted fields)
  const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
  if (!matches || matches.length < 5) continue;
  
  const clean = matches.map(m => m.replace(/^"|"$/g, ''));
  
  const [id, name, city, country, iata, icao] = clean;
  
  // Only include airports with valid IATA code (3 letters)
  if (iata && iata.length === 3 && iata !== '\\N') {
    // Add Romanian aliases for major Romanian cities
    let aliases = '';
    if (city === 'Bucharest') aliases = ' bucuresti bucureşti bucarest';
    if (city === 'Cluj-Napoca') aliases = ' cluj';
    if (city === 'Timisoara') aliases = ' timișoara timisoara';
    if (city === 'Iasi') aliases = ' iași iaşi';
    if (city === 'Constanta') aliases = ' constanța constanţa';
    if (city === 'Brasov') aliases = ' brașov braşov';
    if (city === 'Sibiu') aliases = ' sibiu';
    
    airports.push({
      id: iata,
      iataCode: iata,
      name: name,
      city: city,
      country: country,
      type: 'AIRPORT',
      // Create searchable text for fast filtering (with Romanian aliases)
      searchText: `${name} ${city} ${country} ${iata}${aliases}`.toLowerCase(),
    });
  }
}

// Add major cities (manually curated top destinations)
const majorCities = [
  { id: 'LON', iataCode: 'LON', name: 'All London Airports', city: 'London', country: 'United Kingdom', type: 'CITY' },
  { id: 'PAR', iataCode: 'PAR', name: 'All Paris Airports', city: 'Paris', country: 'France', type: 'CITY' },
  { id: 'NYC', iataCode: 'NYC', name: 'All New York Airports', city: 'New York', country: 'United States', type: 'CITY' },
  { id: 'TYO', iataCode: 'TYO', name: 'All Tokyo Airports', city: 'Tokyo', country: 'Japan', type: 'CITY' },
  { id: 'ROM', iataCode: 'ROM', name: 'All Rome Airports', city: 'Rome', country: 'Italy', type: 'CITY' },
  { id: 'BUE', iataCode: 'BUE', name: 'All Buenos Aires Airports', city: 'Buenos Aires', country: 'Argentina', type: 'CITY' },
  { id: 'MOW', iataCode: 'MOW', name: 'All Moscow Airports', city: 'Moscow', country: 'Russia', type: 'CITY' },
  { id: 'BER', iataCode: 'BER', name: 'All Berlin Airports', city: 'Berlin', country: 'Germany', type: 'CITY' },
  { id: 'STO', iataCode: 'STO', name: 'All Stockholm Airports', city: 'Stockholm', country: 'Sweden', type: 'CITY' },
];

majorCities.forEach(city => {
  city.searchText = `${city.name} ${city.city} ${city.country} ${city.iataCode}`.toLowerCase();
  airports.push(city);
});

// Sort by city name for better UX
airports.sort((a, b) => a.city.localeCompare(b.city));

console.log(`✅ Parsed ${airports.length} airports and cities`);
console.log(`📍 Sample: ${airports.slice(0, 5).map(a => a.city + ' (' + a.iataCode + ')').join(', ')}`);

// Write to JSON
fs.writeFileSync(
  path.join(__dirname, 'airports.json'),
  JSON.stringify(airports, null, 2)
);

console.log('✅ Saved to airports.json');

