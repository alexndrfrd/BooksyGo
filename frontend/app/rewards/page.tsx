'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Star,
  Trophy,
  Gift,
  Plane,
  Hotel,
  CreditCard,
  TrendingUp,
  Users,
  Calendar,
  Check,
  Lock,
  ArrowRight,
  Sparkles,
  Crown,
  Zap,
  Heart,
  ArrowLeft
} from 'lucide-react';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  points: number;
  level: number;
}

interface EarnWay {
  icon: any;
  title: string;
  description: string;
  points: number;
  color: string;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'voucher' | 'upgrade';
  value: string;
  icon: any;
  color: string;
  available: boolean;
}

interface Level {
  level: number;
  name: string;
  pointsRequired: number;
  benefits: string[];
  icon: any;
  color: string;
}

export default function RewardsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'earn' | 'spend' | 'history' | 'levels'>('earn');

  useEffect(() => {
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
      setLoading(false);
    } catch (error) {
      console.error('Failed to parse user data:', error);
      router.push('/auth/login');
    }
  }, [router]);

  const earnWays: EarnWay[] = [
    {
      icon: Plane,
      title: 'Rezervă Zboruri',
      description: 'Câștigă 50 puncte pentru fiecare zbor rezervat',
      points: 50,
      color: 'bg-blue-500'
    },
    {
      icon: Hotel,
      title: 'Rezervă Hoteluri',
      description: 'Câștigă 30 puncte pentru fiecare noapte rezervată',
      points: 30,
      color: 'bg-purple-500'
    },
    {
      icon: Users,
      title: 'Recomandă Prieteni',
      description: 'Câștigă 200 puncte când un prieten își creează cont',
      points: 200,
      color: 'bg-green-500'
    },
    {
      icon: Calendar,
      title: 'Completează Călătoria',
      description: 'Câștigă 25 puncte suplimentare la finalizarea călătoriei',
      points: 25,
      color: 'bg-yellow-500'
    },
    {
      icon: Star,
      title: 'Scrie Recenzii',
      description: 'Câștigă 15 puncte pentru fiecare recenzie validată',
      points: 15,
      color: 'bg-orange-500'
    },
    {
      icon: Gift,
      title: 'Bonus Lunare',
      description: 'Câștigă 100 puncte la 3+ rezervări pe lună',
      points: 100,
      color: 'bg-red-500'
    }
  ];

  const rewards: Reward[] = [
    {
      id: '1',
      title: '10% Reducere Zbor',
      description: 'Discount de 10% la următoarea ta rezervare de zbor',
      pointsCost: 500,
      type: 'discount',
      value: '10%',
      icon: Plane,
      color: 'from-blue-500 to-blue-600',
      available: true
    },
    {
      id: '2',
      title: '15% Reducere Hotel',
      description: 'Discount de 15% la următoarea ta rezervare de hotel',
      pointsCost: 750,
      type: 'discount',
      value: '15%',
      icon: Hotel,
      color: 'from-purple-500 to-purple-600',
      available: true
    },
    {
      id: '3',
      title: '€50 Voucher',
      description: 'Voucher de 50 EUR valabil pentru orice rezervare',
      pointsCost: 2000,
      type: 'voucher',
      value: '€50',
      icon: Gift,
      color: 'from-green-500 to-green-600',
      available: true
    },
    {
      id: '4',
      title: 'Business Class Upgrade',
      description: 'Upgrade automat la Business Class la următorul zbor',
      pointsCost: 3000,
      type: 'upgrade',
      value: 'Business',
      icon: Crown,
      color: 'from-yellow-500 to-orange-500',
      available: true
    },
    {
      id: '5',
      title: '€100 Voucher Premium',
      description: 'Voucher premium de 100 EUR pentru rezervări de lux',
      pointsCost: 4000,
      type: 'voucher',
      value: '€100',
      icon: Sparkles,
      color: 'from-pink-500 to-rose-600',
      available: true
    },
    {
      id: '6',
      title: 'Zbor Gratuit',
      description: 'Un zbor gratuit în Europa (până la €200)',
      pointsCost: 8000,
      type: 'voucher',
      value: 'Gratuit',
      icon: Zap,
      color: 'from-indigo-500 to-purple-600',
      available: true
    }
  ];

  const levels: Level[] = [
    {
      level: 1,
      name: 'Explorer',
      pointsRequired: 0,
      benefits: ['5% reducere la zboruri', 'Suport prioritar', 'Newsletter săptămânal'],
      icon: Star,
      color: 'from-gray-400 to-gray-500'
    },
    {
      level: 2,
      name: 'Traveler',
      pointsRequired: 1000,
      benefits: ['10% reducere la zboruri', '5% reducere la hoteluri', 'Acces early bird la oferte', 'Anulare flexibilă'],
      icon: Plane,
      color: 'from-blue-400 to-blue-500'
    },
    {
      level: 3,
      name: 'Adventurer',
      pointsRequired: 3000,
      benefits: ['15% reducere la zboruri', '10% reducere la hoteluri', 'Check-in prioritar', 'Bagaj suplimentar gratuit', 'Acces lounge aeroporturi selectate'],
      icon: Trophy,
      color: 'from-purple-400 to-purple-500'
    },
    {
      level: 4,
      name: 'Legend',
      pointsRequired: 5000,
      benefits: ['20% reducere la toate', 'Business Class upgrade gratuit/an', 'Concierge 24/7', 'Acces lounge worldwide', 'Partner Diamond Status', 'Rezervări exclusive'],
      icon: Crown,
      color: 'from-yellow-400 to-orange-500'
    }
  ];

  const pointsHistory = [
    { date: '2025-10-28', description: 'Rezervare zbor OTP → BUD', points: 50, type: 'earned' },
    { date: '2025-10-27', description: 'Rezervare hotel - 2 nopți', points: 60, type: 'earned' },
    { date: '2025-10-25', description: 'Recomandare prieten (Ion Popescu)', points: 200, type: 'earned' },
    { date: '2025-10-20', description: 'Utilizat: 10% Reducere Zbor', points: -500, type: 'spent' },
    { date: '2025-10-15', description: 'Recenzie validată', points: 15, type: 'earned' },
    { date: '2025-10-10', description: 'Călătorie completată', points: 25, type: 'earned' },
  ];

  const handleRedeemReward = (reward: Reward) => {
    if (!user || user.points < reward.pointsCost) {
      alert('Nu ai suficiente puncte pentru această recompensă!');
      return;
    }

    // Mock redemption
    const updatedUser = { ...user, points: user.points - reward.pointsCost };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    alert(`Recompensa "${reward.title}" a fost activată! Verifică email-ul pentru detalii.`);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const nextLevel = levels.find(l => l.pointsRequired > user.points) || levels[levels.length - 1];
  const currentLevel = levels.find(l => user.level === l.level) || levels[0];
  const progressToNextLevel = nextLevel ? (user.points / nextLevel.pointsRequired) * 100 : 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-orange-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.push('/dashboard')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Înapoi la Dashboard
        </Button>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Star className="h-10 w-10" />
                BooksyPoints
              </h1>
              <p className="text-white/90 text-lg mb-6">
                Călătorește mai mult, economisește mai mult! Fiecare rezervare te apropie de recompense exclusive.
              </p>
              <div className="flex items-center gap-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-4">
                  <p className="text-white/80 text-sm mb-1">Punctele Tale</p>
                  <p className="text-4xl font-bold">{user.points}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-4">
                  <p className="text-white/80 text-sm mb-1">Nivelul Tău</p>
                  <p className="text-2xl font-bold flex items-center gap-2">
                    {currentLevel.icon && <currentLevel.icon className="h-6 w-6" />}
                    {currentLevel.name}
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <Trophy className="h-40 w-40 opacity-20" />
            </div>
          </div>

          {/* Progress to Next Level */}
          {user.level < levels.length && (
            <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progres către {nextLevel.name}</span>
                <span className="font-semibold">{user.points} / {nextLevel.pointsRequired}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div
                  className="bg-white h-3 rounded-full transition-all"
                  style={{ width: `${Math.min(progressToNextLevel, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs mt-2 text-white/70">
                Încă {nextLevel.pointsRequired - user.points} puncte pentru a ajunge la nivelul următor!
              </p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          <Button
            variant={selectedTab === 'earn' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('earn')}
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Câștigă Puncte
          </Button>
          <Button
            variant={selectedTab === 'spend' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('spend')}
          >
            <Gift className="mr-2 h-4 w-4" />
            Folosește Puncte
          </Button>
          <Button
            variant={selectedTab === 'levels' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('levels')}
          >
            <Crown className="mr-2 h-4 w-4" />
            Nivele
          </Button>
          <Button
            variant={selectedTab === 'history' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('history')}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Istoric
          </Button>
        </div>

        {/* Earn Points Tab */}
        {selectedTab === 'earn' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {earnWays.map((way, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`${way.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}>
                    <way.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{way.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{way.description}</p>
                  <Badge className="bg-yellow-500 hover:bg-yellow-600">
                    <Star className="w-3 h-3 mr-1" />
                    +{way.points} puncte
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Spend Points Tab */}
        {selectedTab === 'spend' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward) => (
              <Card key={reward.id} className="hover:shadow-lg transition-shadow relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${reward.color}`}></div>
                <CardContent className="p-6">
                  <div className={`bg-gradient-to-r ${reward.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}>
                    <reward.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{reward.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-lg font-bold">
                      {reward.pointsCost} puncte
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => handleRedeemReward(reward)}
                      disabled={user.points < reward.pointsCost}
                    >
                      {user.points < reward.pointsCost ? (
                        <>
                          <Lock className="h-4 w-4 mr-1" />
                          Blocat
                        </>
                      ) : (
                        <>
                          Activează
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Levels Tab */}
        {selectedTab === 'levels' && (
          <div className="space-y-6">
            {levels.map((level, index) => (
              <Card
                key={level.level}
                className={`relative overflow-hidden ${user.level === level.level ? 'border-2 border-primary' : ''}`}
              >
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${level.color}`}></div>
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <div className={`bg-gradient-to-r ${level.color} w-16 h-16 rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
                      <level.icon className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold">Nivel {level.level}: {level.name}</h3>
                        {user.level === level.level && (
                          <Badge className="bg-green-500 hover:bg-green-600">
                            <Check className="w-3 h-3 mr-1" />
                            Nivel Curent
                          </Badge>
                        )}
                        {user.points < level.pointsRequired && (
                          <Badge variant="outline">
                            <Lock className="w-3 h-3 mr-1" />
                            {level.pointsRequired} puncte necesare
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {level.pointsRequired === 0 ? 'Nivel de start' : `Necesare ${level.pointsRequired} puncte`}
                      </p>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold mb-2">Beneficii:</p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {level.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* History Tab */}
        {selectedTab === 'history' && (
          <Card>
            <CardHeader>
              <CardTitle>Istoric Puncte</CardTitle>
              <CardDescription>Vizualizează toate tranzacțiile tale cu BooksyPoints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pointsHistory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${item.type === 'earned' ? 'bg-green-100' : 'bg-red-100'}`}>
                        {item.type === 'earned' ? (
                          <Star className="h-5 w-5 text-green-600" />
                        ) : (
                          <Gift className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{item.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(item.date).toLocaleDateString('ro-RO', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <p className={`text-2xl font-bold ${item.type === 'earned' ? 'text-green-600' : 'text-red-600'}`}>
                      {item.type === 'earned' ? '+' : ''}{item.points}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

