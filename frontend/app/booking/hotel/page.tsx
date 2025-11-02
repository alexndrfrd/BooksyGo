'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star, MapPin, Wifi, Car, Coffee, Waves, CreditCard, User, Mail, Phone, CheckCircle, ArrowLeft, ArrowRight, Calendar, Users } from 'lucide-react';

interface Hotel {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice: number;
  discount: number;
  currency: string;
  image: string;
  amenities: string[];
  location: string;
  distance: string;
  stars: number;
  freeCancellation: boolean;
  breakfastIncluded: boolean;
  description: string;
}

interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests: string;
}

interface PaymentDetails {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

export default function HotelBookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const checkIn = searchParams.get('checkIn') || '2025-11-15';
  const checkOut = searchParams.get('checkOut') || '2025-11-17';
  const guests = parseInt(searchParams.get('guests') || '2');

  // Calculate number of nights
  const nights = Math.ceil(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Form data
  const [guestDetails, setGuestDetails] = useState<GuestDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
  });

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Load hotel data from query params
  useEffect(() => {
    const hotelData = searchParams.get('hotel');
    if (hotelData) {
      try {
        const parsedHotel = JSON.parse(decodeURIComponent(hotelData));
        setHotel(parsedHotel);
      } catch (error) {
        console.error('Failed to parse hotel data:', error);
      }
    }
  }, [searchParams]);

  const validateGuestDetails = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!guestDetails.firstName.trim()) {
      newErrors.firstName = 'Prenumele este obligatoriu';
    }
    if (!guestDetails.lastName.trim()) {
      newErrors.lastName = 'Numele este obligatoriu';
    }
    if (!guestDetails.email.trim()) {
      newErrors.email = 'Email-ul este obligatoriu';
    } else if (!/\S+@\S+\.\S+/.test(guestDetails.email)) {
      newErrors.email = 'Email invalid';
    }
    if (!guestDetails.phone.trim()) {
      newErrors.phone = 'Telefonul este obligatoriu';
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
    if (currentStep === 2 && !validateGuestDetails()) {
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
        bookingType: 'HOTEL',
        hotelData: {
          ...hotel!,
          checkIn,
          checkOut,
          nights,
          guests,
        },
        passengerData: guestDetails,
        totalPrice: totalPrice,
        currency: hotel!.currency,
        paymentData: {
          cardLast4: paymentDetails.cardNumber.slice(-4),
          cardName: paymentDetails.cardName,
        },
        checkInDate: checkIn,
        checkOutDate: checkOut,
      };

      // Send to backend
      const response = await fetch('http://localhost:3002/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      const booking = await response.json();
      setBookingId(booking.id);
      setBookingConfirmed(true);
    } catch (error) {
      console.error('Booking error:', error);
      alert('A apărut o eroare la crearea rezervării. Te rugăm să încerci din nou.');
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = hotel ? hotel.price * nights : 0;

  const renderStars = (stars: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
        <div className="container mx-auto">
          <Card className="max-w-md mx-auto mt-20">
            <CardHeader>
              <CardTitle>Hotel negăsit</CardTitle>
              <CardDescription>Nu am putut găsi detaliile hotelului selectat.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push('/hotels')} className="w-full">
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
                <h3 className="font-semibold mb-3 text-lg">Detalii Rezervare</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hotel:</span>
                    <span className="font-medium">{hotel.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-in:</span>
                    <span className="font-medium">{new Date(checkIn).toLocaleDateString('ro-RO')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-out:</span>
                    <span className="font-medium">{new Date(checkOut).toLocaleDateString('ro-RO')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nopți:</span>
                    <span className="font-medium">{nights}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Oaspeți:</span>
                    <span className="font-medium">{guests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Titular:</span>
                    <span className="font-medium">{guestDetails.firstName} {guestDetails.lastName}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>✉️ Email de confirmare trimis!</strong><br />
                  Am trimis voucherul de hotel la <strong>{guestDetails.email}</strong>
                </p>
              </div>

              {hotel.freeCancellation && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-900">
                    <CheckCircle className="inline w-4 h-4 mr-1" />
                    <strong>Anulare gratuită</strong> până cu 24h înainte de check-in
                  </p>
                </div>
              )}

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
                  {step === 1 && 'Detalii Hotel'}
                  {step === 2 && 'Date Contact'}
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

        {/* Step 1: Hotel Review */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Revizuiește Rezervarea</CardTitle>
              <CardDescription>Verifică detaliile hotelului și sejurului</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl mb-1">{hotel.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(hotel.stars)}
                      <span className="text-sm text-muted-foreground">({hotel.reviewCount} recenzii)</span>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {hotel.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">de la</p>
                    <p className="text-2xl font-bold text-primary">{hotel.price} {hotel.currency}</p>
                    <p className="text-xs text-muted-foreground">per noapte</p>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Check-in</p>
                        <p className="text-xs text-muted-foreground">{new Date(checkIn).toLocaleDateString('ro-RO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Check-out</p>
                        <p className="text-xs text-muted-foreground">{new Date(checkOut).toLocaleDateString('ro-RO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-white/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium">{guests} oaspeți</span>
                    </div>
                    <span className="text-sm font-medium">{nights} {nights === 1 ? 'noapte' : 'nopți'}</span>
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <p className="text-xs text-muted-foreground mb-2">Facilități incluse:</p>
                  <div className="flex flex-wrap gap-2">
                    {hotel.amenities.slice(0, 6).map((amenity, index) => (
                      <span key={index} className="text-xs bg-white/70 px-2 py-1 rounded">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {hotel.breakfastIncluded && (
                  <div className="bg-green-100 text-green-800 p-3 rounded-lg mt-3 flex items-center gap-2">
                    <Coffee className="w-4 h-4" />
                    <span className="text-sm font-medium">Mic dejun inclus</span>
                  </div>
                )}

                {hotel.freeCancellation && (
                  <div className="bg-blue-100 text-blue-800 p-3 rounded-lg mt-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Anulare gratuită până cu 24h înainte</span>
                  </div>
                )}
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

        {/* Step 2: Guest Details */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Date de Contact</CardTitle>
              <CardDescription>Completează informațiile pentru rezervare</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Prenume *</Label>
                  <Input
                    id="firstName"
                    placeholder="Ion"
                    value={guestDetails.firstName}
                    onChange={(e) => setGuestDetails({ ...guestDetails, firstName: e.target.value })}
                  />
                  {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <Label htmlFor="lastName">Nume *</Label>
                  <Input
                    id="lastName"
                    placeholder="Popescu"
                    value={guestDetails.lastName}
                    onChange={(e) => setGuestDetails({ ...guestDetails, lastName: e.target.value })}
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
                  value={guestDetails.email}
                  onChange={(e) => setGuestDetails({ ...guestDetails, email: e.target.value })}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                <p className="text-xs text-muted-foreground mt-1">Voucherul va fi trimis la această adresă</p>
              </div>

              <div>
                <Label htmlFor="phone">Telefon *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+40 712 345 678"
                  value={guestDetails.phone}
                  onChange={(e) => setGuestDetails({ ...guestDetails, phone: e.target.value })}
                />
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <Label htmlFor="specialRequests">Cerințe speciale (opțional)</Label>
                <textarea
                  id="specialRequests"
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Ex: Pat matrimonial, etaj superior, cameră liniștită..."
                  value={guestDetails.specialRequests}
                  onChange={(e) => setGuestDetails({ ...guestDetails, specialRequests: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">Hotelul va încerca să îndeplinească cerințele, dar nu sunt garantate</p>
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
              {/* Hotel Summary */}
              <div>
                <h3 className="font-semibold mb-3">Hotel</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nume:</span>
                    <span className="font-medium">{hotel.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Locație:</span>
                    <span className="font-medium">{hotel.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-in:</span>
                    <span className="font-medium">{new Date(checkIn).toLocaleDateString('ro-RO')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-out:</span>
                    <span className="font-medium">{new Date(checkOut).toLocaleDateString('ro-RO')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nopți:</span>
                    <span className="font-medium">{nights}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Oaspeți:</span>
                    <span className="font-medium">{guests}</span>
                  </div>
                </div>
              </div>

              {/* Guest Summary */}
              <div>
                <h3 className="font-semibold mb-3">Date Contact</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nume:</span>
                    <span className="font-medium">{guestDetails.firstName} {guestDetails.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{guestDetails.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Telefon:</span>
                    <span className="font-medium">{guestDetails.phone}</span>
                  </div>
                  {guestDetails.specialRequests && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cerințe speciale:</span>
                      <span className="font-medium text-right max-w-xs">{guestDetails.specialRequests}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Price Summary */}
              <div>
                <h3 className="font-semibold mb-3">Sumar Preț</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{hotel.price} {hotel.currency} x {nights} nopți:</span>
                    <span className="font-medium">{totalPrice} {hotel.currency}</span>
                  </div>
                  {hotel.breakfastIncluded && (
                    <div className="flex justify-between text-green-600">
                      <span>Mic dejun:</span>
                      <span className="font-medium">Inclus</span>
                    </div>
                  )}
                </div>
                <div className="bg-primary/10 p-4 rounded-lg mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total de Plată:</span>
                    <span className="text-3xl font-bold text-primary">{totalPrice} {hotel.currency}</span>
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

