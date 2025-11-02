'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Plane,
  Hotel,
  Calendar,
  MapPin,
  Star,
  Trophy,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  LogOut,
  User,
  Settings,
  Gift,
  ArrowRight
} from 'lucide-react';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  points: number;
  level: number;
  role: string;
}

interface Booking {
  id: string;
  type: 'flight' | 'hotel';
  status: 'confirmed' | 'cancelled' | 'completed';
  bookingDate: string;
  details: {
    name: string;
    from?: string;
    to?: string;
    checkIn?: string;
    checkOut?: string;
    date?: string;
    duration?: string;
    nights?: number;
    location?: string;
    price: number;
    currency: string;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (!token || !userData) {
        router.push('/auth/login');
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // Fetch real bookings from backend
        const response = await fetch('http://localhost:3002/api/bookings', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const backendBookings = await response.json();
          
          // Transform backend bookings to match UI format
          const transformedBookings = backendBookings.map((booking: any) => ({
            id: booking.id,
            type: booking.bookingType.toLowerCase() as 'flight' | 'hotel',
            status: booking.status.toLowerCase() as 'confirmed' | 'cancelled' | 'completed',
            bookingDate: booking.bookingDate,
            details: booking.bookingType === 'FLIGHT' ? {
              name: booking.data?.airline + ' ' + booking.data?.flightNumber || 'Zbor',
              from: booking.data?.departure?.city + ' (' + booking.data?.departure?.airport + ')' || 'N/A',
              to: booking.data?.arrival?.city + ' (' + booking.data?.arrival?.airport + ')' || 'N/A',
              date: booking.travelDate || booking.data?.departure?.date,
              duration: booking.data?.duration || 'N/A',
              price: booking.totalPrice,
              currency: booking.currency
            } : {
              name: booking.data?.name || 'Hotel',
              location: booking.data?.location || 'N/A',
              checkIn: booking.checkInDate,
              checkOut: booking.checkOutDate,
              nights: booking.data?.nights || Math.ceil((new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) / (1000 * 60 * 60 * 24)),
              price: booking.totalPrice,
              currency: booking.currency
            }
          }));

          setBookings(transformedBookings);
        }

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const calculateStats = () => {
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    const completedTrips = bookings.filter(b => b.status === 'completed').length;
    const totalSpent = bookings.reduce((sum, b) => sum + b.details.price, 0);
    return { confirmedBookings, completedTrips, totalSpent };
  };

  const stats = calculateStats();
  const nextLevel = user ? (user.level + 1) * 1000 : 1000;
  const progressToNextLevel = user ? (user.points / nextLevel) * 100 : 0;

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div>
                <h1 className="text-3xl font-bold">Bine ai revenit, {user.firstName}!</h1>
                <p className="text-white/80">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={() => router.push('/profile')}>
                <User className="mr-2 h-4 w-4" />
                Profil
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/20" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Deconectare
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* BooksyPoints */}
          <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Star className="h-8 w-8" />
                <Trophy className="h-6 w-6 opacity-70" />
              </div>
              <p className="text-sm opacity-90">BooksyPoints</p>
              <p className="text-3xl font-bold">{user.points}</p>
              <div className="mt-4">
                <p className="text-xs mb-1">Nivel {user.level}</p>
                <div className="w-full bg-white/30 rounded-full h-2">
                  <div
                    className="bg-white h-2 rounded-full transition-all"
                    style={{ width: `${progressToNextLevel}%` }}
                  ></div>
                </div>
                <p className="text-xs mt-1">Încă {nextLevel - user.points} puncte până la nivel {user.level + 1}</p>
              </div>
            </CardContent>
          </Card>

          {/* Confirmed Bookings */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-sm text-muted-foreground">Rezervări Active</p>
              <p className="text-3xl font-bold">{stats.confirmedBookings}</p>
              <Button 
                variant="link" 
                className="p-0 h-auto mt-2 text-blue-600"
                onClick={() => {
                  document.getElementById('bookings-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Vezi toate
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Completed Trips */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground">Călătorii Completate</p>
              <p className="text-3xl font-bold">{stats.completedTrips}</p>
              <p className="text-xs text-muted-foreground mt-2">+{stats.completedTrips * 50} BooksyPoints câștigate</p>
            </CardContent>
          </Card>

          {/* Total Spent */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-sm text-muted-foreground">Total Cheltuit</p>
              <p className="text-3xl font-bold">€{stats.totalSpent}</p>
              <p className="text-xs text-muted-foreground mt-2">În ultimele 3 luni</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/search')}>
            <CardContent className="p-6 text-center">
              <Plane className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Rezervă Zbor</h3>
              <p className="text-sm text-muted-foreground">Găsește cele mai bune oferte</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/hotels')}>
            <CardContent className="p-6 text-center">
              <Hotel className="h-12 w-12 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Rezervă Hotel</h3>
              <p className="text-sm text-muted-foreground">Descoperă locuri de cazare</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/rewards')}>
            <CardContent className="p-6 text-center">
              <Gift className="h-12 w-12 text-orange-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Recompense</h3>
              <p className="text-sm text-muted-foreground">Folosește BooksyPoints</p>
            </CardContent>
          </Card>
        </div>

        {/* Bookings History */}
        <Card id="bookings-section">
          <CardHeader>
            <CardTitle>Istoric Rezervări</CardTitle>
            <CardDescription>Toate rezervările tale recente</CardDescription>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nicio rezervare încă</h3>
                <p className="text-muted-foreground mb-4">
                  Începe să planifici următoarea ta aventură!
                </p>
                <Button onClick={() => router.push('/')}>
                  Începe Căutarea
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {/* Booking Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`p-3 rounded-lg ${
                        booking.type === 'flight' ? 'bg-blue-100' : 'bg-purple-100'
                      }`}>
                        {booking.type === 'flight' ? (
                          <Plane className={`h-6 w-6 ${booking.type === 'flight' ? 'text-blue-600' : 'text-purple-600'}`} />
                        ) : (
                          <Hotel className={`h-6 w-6 text-purple-600`} />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{booking.details.name}</h4>
                          <Badge variant={
                            booking.status === 'confirmed' ? 'default' :
                            booking.status === 'completed' ? 'secondary' : 'destructive'
                          }>
                            {booking.status === 'confirmed' && 'Confirmată'}
                            {booking.status === 'completed' && 'Completată'}
                            {booking.status === 'cancelled' && 'Anulată'}
                          </Badge>
                        </div>

                        {booking.type === 'flight' ? (
                          <p className="text-sm text-muted-foreground">
                            {booking.details.from} → {booking.details.to} • {new Date(booking.details.date!).toLocaleDateString('ro-RO')}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            {booking.details.location} • {new Date(booking.details.checkIn!).toLocaleDateString('ro-RO')} - {new Date(booking.details.checkOut!).toLocaleDateString('ro-RO')} ({booking.details.nights} nopți)
                          </p>
                        )}

                        <p className="text-xs text-muted-foreground mt-1">
                          Booking ID: {booking.id} • Rezervat pe {new Date(booking.bookingDate).toLocaleDateString('ro-RO')}
                        </p>
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary mb-2">
                        {booking.details.price} {booking.details.currency}
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Vezi Detalii
                        </Button>
                        {booking.status === 'confirmed' && (
                          <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                            Anulează
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
