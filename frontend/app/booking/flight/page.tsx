'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plane, Clock, MapPin, CreditCard, User, Mail, Phone, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';

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
  cabinClass: string;
  aircraft: string;
}

interface PassengerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  passportNumber: string;
  dateOfBirth: string;
}

interface PaymentDetails {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

export default function FlightBookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState('');

  // Form data
  const [passengerDetails, setPassengerDetails] = useState<PassengerDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    passportNumber: '',
    dateOfBirth: '',
  });

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Load flight data from query params
  useEffect(() => {
    const flightData = searchParams.get('flight');
    if (flightData) {
      try {
        const parsedFlight = JSON.parse(decodeURIComponent(flightData));
        setFlight(parsedFlight);
      } catch (error) {
        console.error('Failed to parse flight data:', error);
      }
    }
  }, [searchParams]);

  const validatePassengerDetails = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!passengerDetails.firstName.trim()) {
      newErrors.firstName = 'Prenumele este obligatoriu';
    }
    if (!passengerDetails.lastName.trim()) {
      newErrors.lastName = 'Numele este obligatoriu';
    }
    if (!passengerDetails.email.trim()) {
      newErrors.email = 'Email-ul este obligatoriu';
    } else if (!/\S+@\S+\.\S+/.test(passengerDetails.email)) {
      newErrors.email = 'Email invalid';
    }
    if (!passengerDetails.phone.trim()) {
      newErrors.phone = 'Telefonul este obligatoriu';
    }
    if (!passengerDetails.passportNumber.trim()) {
      newErrors.passportNumber = 'Numărul pașaportului este obligatoriu';
    }
    if (!passengerDetails.dateOfBirth) {
      newErrors.dateOfBirth = 'Data nașterii este obligatorie';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePaymentDetails = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!paymentDetails.cardNumber.trim()) {
      newErrors.cardNumber = 'Numărul cardului este obligatoriu';
    } else if (!/^\d{16}$/.test(paymentDetails.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Număr de card invalid (16 cifre)';
    }
    if (!paymentDetails.cardName.trim()) {
      newErrors.cardName = 'Numele de pe card este obligatoriu';
    }
    if (!paymentDetails.expiryDate.trim()) {
      newErrors.expiryDate = 'Data de expirare este obligatorie';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentDetails.expiryDate)) {
      newErrors.expiryDate = 'Format invalid (MM/YY)';
    }
    if (!paymentDetails.cvv.trim()) {
      newErrors.cvv = 'CVV este obligatoriu';
    } else if (!/^\d{3,4}$/.test(paymentDetails.cvv)) {
      newErrors.cvv = 'CVV invalid (3-4 cifre)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 2 && !validatePassengerDetails()) {
      return;
    }
    if (currentStep === 3 && !validatePaymentDetails()) {
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleConfirmBooking = async () => {
    setLoading(true);

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Trebuie să fii autentificat pentru a face o rezervare');
        router.push('/auth/login');
        return;
      }

      // Prepare booking data
      const bookingData = {
        bookingType: 'FLIGHT',
        flightData: flight!,
        passengerData: passengerDetails,
        totalPrice: flight!.price,
        currency: flight!.currency,
        paymentData: {
          cardLast4: paymentDetails.cardNumber.slice(-4),
          cardName: paymentDetails.cardName,
        },
        travelDate: flight!.departure.date,
      };

      console.log('🚀 Sending booking data:', bookingData);
      console.log('🔑 Token:', token ? 'Present' : 'Missing');

      // Send to backend
      const response = await fetch('http://localhost:3002/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const responseText = await response.text();
        console.error('❌ Error response text:', responseText);
        
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { message: responseText || 'Unknown error' };
        }
        
        console.error('❌ Parsed error data:', errorData);
        throw new Error(errorData.message || `Failed to create booking (${response.status})`);
      }

      const booking = await response.json();
      console.log('Booking created successfully:', booking);
      setBookingId(booking.id);
      setBookingConfirmed(true);
    } catch (error) {
      console.error('Booking error:', error);
      alert('A apărut o eroare la crearea rezervării. Te rugăm să încerci din nou.');
    } finally {
      setLoading(false);
    }
  };

  if (!flight) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
        <div className="container mx-auto">
          <Card className="max-w-md mx-auto mt-20">
            <CardHeader>
              <CardTitle>Zbor negăsit</CardTitle>
              <CardDescription>Nu am putut găsi detaliile zborului selectat.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push('/search')} className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Înapoi la căutare
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (bookingConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-6">
        <div className="container mx-auto max-w-2xl">
          <Card className="mt-10">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-3xl">Rezervare Confirmată!</CardTitle>
              <CardDescription className="text-lg">
                Booking ID: <span className="font-bold text-primary">{bookingId}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-t border-b py-4">
                <h3 className="font-semibold mb-3 text-lg">Detalii Zbor</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Zbor:</span>
                    <span className="font-medium">{flight.airline} {flight.flightNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rută:</span>
                    <span className="font-medium">{flight.departure.city} → {flight.arrival.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dată:</span>
                    <span className="font-medium">{flight.departure.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pasager:</span>
                    <span className="font-medium">{passengerDetails.firstName} {passengerDetails.lastName}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>✉️ Email de confirmare trimis!</strong><br />
                  Am trimis detaliile rezervării la <strong>{passengerDetails.email}</strong>
                </p>
              </div>

              <div className="space-y-3">
                <Button onClick={() => router.push('/dashboard')} className="w-full" size="lg">
                  Vezi Rezervările Mele
                </Button>
                <Button onClick={() => router.push('/')} variant="outline" className="w-full">
                  Înapoi la Pagina Principală
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step}
                </div>
                <span className="text-xs mt-2 text-center">
                  {step === 1 && 'Detalii Zbor'}
                  {step === 2 && 'Pasager'}
                  {step === 3 && 'Plată'}
                  {step === 4 && 'Confirmare'}
                </span>
              </div>
            ))}
          </div>
          <div className="relative h-2 bg-gray-200 rounded-full">
            <div
              className="absolute h-2 bg-primary rounded-full transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Flight Review */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Revizuiește Zborul</CardTitle>
              <CardDescription>Verifică detaliile zborului înainte de a continua</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{flight.airline}</h3>
                    <p className="text-sm text-muted-foreground">{flight.flightNumber} • {flight.aircraft}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{flight.price} {flight.currency}</p>
                    <p className="text-sm text-muted-foreground">{flight.cabinClass}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{flight.departure.city}</p>
                    <p className="text-2xl font-bold">{flight.departure.time}</p>
                    <p className="text-sm">{flight.departure.airport}</p>
                    <p className="text-xs text-muted-foreground">{flight.departure.date}</p>
                  </div>

                  <div className="flex-1 flex flex-col items-center">
                    <Plane className="h-6 w-6 text-primary mb-1 rotate-90" />
                    <p className="text-sm font-medium">{flight.duration}</p>
                    <p className="text-xs text-muted-foreground">
                      {flight.stops === 0 ? 'Direct' : `${flight.stops} escală`}
                    </p>
                  </div>

                  <div className="flex-1 text-right">
                    <p className="text-sm text-muted-foreground">{flight.arrival.city}</p>
                    <p className="text-2xl font-bold">{flight.arrival.time}</p>
                    <p className="text-sm">{flight.arrival.airport}</p>
                    <p className="text-xs text-muted-foreground">{flight.arrival.date}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleNextStep} size="lg">
                  Continuă
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Passenger Details */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Detalii Pasager</CardTitle>
              <CardDescription>Completează informațiile pasagerului</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Prenume *</Label>
                  <Input
                    id="firstName"
                    placeholder="Ion"
                    value={passengerDetails.firstName}
                    onChange={(e) => setPassengerDetails({ ...passengerDetails, firstName: e.target.value })}
                  />
                  {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <Label htmlFor="lastName">Nume *</Label>
                  <Input
                    id="lastName"
                    placeholder="Popescu"
                    value={passengerDetails.lastName}
                    onChange={(e) => setPassengerDetails({ ...passengerDetails, lastName: e.target.value })}
                  />
                  {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ion.popescu@email.com"
                  value={passengerDetails.email}
                  onChange={(e) => setPassengerDetails({ ...passengerDetails, email: e.target.value })}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Telefon *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+40 712 345 678"
                  value={passengerDetails.phone}
                  onChange={(e) => setPassengerDetails({ ...passengerDetails, phone: e.target.value })}
                />
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="passportNumber">Număr Pașaport *</Label>
                  <Input
                    id="passportNumber"
                    placeholder="AB1234567"
                    value={passengerDetails.passportNumber}
                    onChange={(e) => setPassengerDetails({ ...passengerDetails, passportNumber: e.target.value })}
                  />
                  {errors.passportNumber && <p className="text-sm text-red-500 mt-1">{errors.passportNumber}</p>}
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Data Nașterii *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={passengerDetails.dateOfBirth}
                    onChange={(e) => setPassengerDetails({ ...passengerDetails, dateOfBirth: e.target.value })}
                  />
                  {errors.dateOfBirth && <p className="text-sm text-red-500 mt-1">{errors.dateOfBirth}</p>}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button onClick={handlePreviousStep} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Înapoi
                </Button>
                <Button onClick={handleNextStep}>
                  Continuă
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Payment */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Detalii Plată</CardTitle>
              <CardDescription>Completează informațiile cardului (DEMO - nu vor fi procesate)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
                <p className="text-sm text-yellow-900">
                  <strong>⚠️ Mod DEMO:</strong> Poți introduce orice date, nu vor fi procesate real.
                </p>
              </div>

              <div>
                <Label htmlFor="cardNumber">Număr Card *</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  value={paymentDetails.cardNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
                    setPaymentDetails({ ...paymentDetails, cardNumber: value });
                  }}
                />
                {errors.cardNumber && <p className="text-sm text-red-500 mt-1">{errors.cardNumber}</p>}
              </div>

              <div>
                <Label htmlFor="cardName">Nume Titular Card *</Label>
                <Input
                  id="cardName"
                  placeholder="ION POPESCU"
                  value={paymentDetails.cardName}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, cardName: e.target.value.toUpperCase() })}
                />
                {errors.cardName && <p className="text-sm text-red-500 mt-1">{errors.cardName}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Data Expirare *</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={paymentDetails.expiryDate}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length >= 2) {
                        value = value.slice(0, 2) + '/' + value.slice(2, 4);
                      }
                      setPaymentDetails({ ...paymentDetails, expiryDate: value });
                    }}
                  />
                  {errors.expiryDate && <p className="text-sm text-red-500 mt-1">{errors.expiryDate}</p>}
                </div>
                <div>
                  <Label htmlFor="cvv">CVV *</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    maxLength={4}
                    type="password"
                    value={paymentDetails.cvv}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value.replace(/\D/g, '') })}
                  />
                  {errors.cvv && <p className="text-sm text-red-500 mt-1">{errors.cvv}</p>}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button onClick={handlePreviousStep} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Înapoi
                </Button>
                <Button onClick={handleNextStep}>
                  Continuă
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Confirmare Rezervare</CardTitle>
              <CardDescription>Revizuiește toate detaliile și confirmă rezervarea</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Flight Summary */}
              <div>
                <h3 className="font-semibold mb-3">Zbor</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Companie:</span>
                    <span className="font-medium">{flight.airline} {flight.flightNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rută:</span>
                    <span className="font-medium">{flight.departure.city} → {flight.arrival.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dată:</span>
                    <span className="font-medium">{flight.departure.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Durată:</span>
                    <span className="font-medium">{flight.duration}</span>
                  </div>
                </div>
              </div>

              {/* Passenger Summary */}
              <div>
                <h3 className="font-semibold mb-3">Pasager</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nume:</span>
                    <span className="font-medium">{passengerDetails.firstName} {passengerDetails.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{passengerDetails.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Telefon:</span>
                    <span className="font-medium">{passengerDetails.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pașaport:</span>
                    <span className="font-medium">{passengerDetails.passportNumber}</span>
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              <div>
                <h3 className="font-semibold mb-3">Total de Plată</h3>
                <div className="bg-primary/10 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-3xl font-bold text-primary">{flight.price} {flight.currency}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Toate taxele incluse</p>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button onClick={handlePreviousStep} variant="outline" disabled={loading}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Înapoi
                </Button>
                <Button onClick={handleConfirmBooking} size="lg" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Se procesează...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Confirmă Rezervarea
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

