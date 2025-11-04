'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plane, Clock, MapPin, Star, Euro, Users, Calendar, ExternalLink } from 'lucide-react';
// Removed Skyscanner affiliate - using direct booking now

interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    city: string;
    time: string;
    date: string;
  };
  arrival: {
    airport: string;
    city: string;
    time: string;
    date: string;
  };
  duration: string;
  stops: number;
  price: number;
  currency: string;
  availableSeats: number;
  cabinClass: string;
  aircraft: string;
}

interface SearchResponse {
  success: boolean;
  data: {
    flights: Flight[];
    search: {
      origin: string;
      destination: string;
      date: string;
      passengers: number;
      type: string;
    };
    meta: {
      total: number;
      currency: string;
      searchId: string;
    };
  };
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const origin = searchParams.get('origin') || 'OTP';
  const destination = searchParams.get('destination') || 'BUD';
  const date = searchParams.get('date') || '2025-11-15';

  const handleBookFlight = (flight: Flight) => {
    const flightData = encodeURIComponent(JSON.stringify(flight));
    router.push(`/booking/flight?flight=${flightData}`);
  };

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        const adults = searchParams.get('adults') || '1';
        const response = await fetch(
          `/api/flights/search?origin=${origin}&destination=${destination}&date=${date}&adults=${adults}`
        );
        const data: SearchResponse = await response.json();

        if (data.success) {
          setFlights(data.data.flights);
        } else {
          setError('Failed to fetch flights');
        }
      } catch (err) {
        setError('Network error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [origin, destination, date]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Căutăm cele mai bune oferte...</h2>
            <p className="text-muted-foreground">Analizăm 60+ combinații de date pentru tine</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2 text-red-600">Eroare la căutare</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => window.history.back()} className="mt-4">
              Înapoi la căutare
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Zboruri {origin} → {destination}
              </h1>
              <p className="text-white/80">
                <Calendar className="w-4 h-4 inline mr-1" />
                {new Date(date).toLocaleDateString('ro-RO', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/80">Găsit</p>
              <p className="text-2xl font-bold">{flights.length} zboruri</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Summary */}
      <div className="bg-muted/30 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{origin} → {destination}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>1 adult</span>
              </div>
            </div>
            <Button variant="outline" onClick={() => window.history.back()}>
              Modifică căutarea
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          {flights.map((flight) => (
            <Card key={flight.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  {/* Flight Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Plane className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{flight.airline}</h3>
                        <p className="text-sm text-muted-foreground">{flight.flightNumber}</p>
                      </div>
                    </div>

                    {/* Route */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{flight.departure.time}</div>
                        <div className="text-sm text-muted-foreground">{flight.departure.airport}</div>
                        <div className="text-xs text-muted-foreground">{flight.departure.city}</div>
                      </div>

                      <div className="flex-1 mx-4">
                        <div className="flex items-center justify-center mb-1">
                          <div className="h-px bg-border flex-1"></div>
                          <div className="px-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div className="h-px bg-border flex-1"></div>
                        </div>
                        <div className="text-center text-sm text-muted-foreground">
                          {flight.duration} • {flight.stops === 0 ? 'Direct' : `${flight.stops} escală`}
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-2xl font-bold">{flight.arrival.time}</div>
                        <div className="text-sm text-muted-foreground">{flight.arrival.airport}</div>
                        <div className="text-xs text-muted-foreground">{flight.arrival.city}</div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{flight.aircraft}</span>
                      <span>•</span>
                      <span>{flight.cabinClass}</span>
                      <span>•</span>
                      <span className="text-green-600">{flight.availableSeats} locuri disponibile</span>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="text-right ml-6">
                    <div className="text-3xl font-bold text-primary mb-2">
                      €{flight.price}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      per persoană
                    </p>
                    <div className="space-y-2">
                      <Button size="lg" className="w-full" onClick={() => handleBookFlight(flight)}>
                        🎫 Rezervă direct acum
                      </Button>
                      <p className="text-xs text-center text-green-600 font-semibold">
                        ✅ Prețuri reale de la Amadeus
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {flights.length === 0 && (
          <div className="text-center py-12">
            <Plane className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Niciun zbor găsit</h3>
            <p className="text-muted-foreground mb-4">
              Nu am găsit zboruri pentru această rută. Încearcă să modifici datele.
            </p>
            <Button onClick={() => window.history.back()}>
              Modifică căutarea
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
