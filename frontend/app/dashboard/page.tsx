'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Plane,
  MapPin,
  Calendar,
  Star,
  Trophy,
  Settings,
  LogOut,
  Plus,
  Search,
  Heart,
  Clock
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  points: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock user data - înlocuiește cu adevăratul user din localStorage/API
    const mockUser = localStorage.getItem('user');
    if (mockUser) {
      setUser(JSON.parse(mockUser));
    } else {
      // Redirect to login if no user
      window.location.href = '/auth/login';
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo-transparent.png"
                alt="BooksyGo Logo"
                width={32}
                height={32}
              />
              <span className="text-xl font-bold text-primary">BooksyGo</span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-primary/10 rounded-full px-3 py-1">
                <Trophy className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{user.points} Points</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.firstName[0]}{user.lastName[0]}
                  </span>
                </div>
                <span className="text-sm font-medium">
                  {user.firstName} {user.lastName}
                </span>
              </div>

              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Bun venit, {user.firstName}! 👋
          </h1>
          <p className="text-muted-foreground">
            Pregătit să descoperi următoarea ta aventură?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Search className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Caută zboruri</h3>
                  <p className="text-sm text-muted-foreground">Găsește cele mai bune oferte</p>
                </div>
              </div>
              <Button className="w-full mt-4" asChild>
                <Link href="/">
                  <Plane className="w-4 h-4 mr-2" />
                  Caută acum
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Plus className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Rezervări noi</h3>
                  <p className="text-sm text-muted-foreground">Vezi rezervările tale</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4" disabled>
                <Clock className="w-4 h-4 mr-2" />
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Favorite</h3>
                  <p className="text-sm text-muted-foreground">Destinațiile tale preferate</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4" disabled>
                <Heart className="w-4 h-4 mr-2" />
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Călătorii totale</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <Plane className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">BooksyPoints</p>
                  <p className="text-2xl font-bold">{user.points}</p>
                </div>
                <Trophy className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Review-uri</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nivel</p>
                  <p className="text-2xl font-bold">Traveler</p>
                </div>
                <MapPin className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Upcoming Trips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Activitate recentă
              </CardTitle>
              <CardDescription>
                Ultimele acțiuni din contul tău
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Ai câștigat 100 BooksyPoints</p>
                    <p className="text-xs text-muted-foreground">Pentru înregistrare</p>
                  </div>
                  <span className="text-xs text-muted-foreground">Acum</span>
                </div>

                <div className="text-center py-8">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    Mai multe activități vor apărea aici când începi să cauți și rezervi călătorii.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Trips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Călătorii viitoare
              </CardTitle>
              <CardDescription>
                Rezervările tale confirmate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Plane className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-medium mb-2">Nicio călătorie planificată</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Când rezervi zboruri și hoteluri, ele vor apărea aici.
                </p>
                <Button asChild>
                  <Link href="/">
                    <Search className="w-4 h-4 mr-2" />
                    Caută călătorii
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
