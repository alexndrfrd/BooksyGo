'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Mail,
  Phone,
  Lock,
  Save,
  X,
  Edit,
  ArrowLeft,
  CheckCircle,
  Star,
  Trophy,
  Settings,
  Bell,
  Shield,
  Trash2
} from 'lucide-react';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  points: number;
  level: number;
  role: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Form data
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
      setProfileData({
        firstName: parsedUser.firstName,
        lastName: parsedUser.lastName,
        email: parsedUser.email,
        phone: parsedUser.phone || '',
      });
      setLoading(false);
    } catch (error) {
      console.error('Failed to parse user data:', error);
      router.push('/auth/login');
    }
  }, [router]);

  const validateProfileData = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!profileData.firstName.trim()) {
      newErrors.firstName = 'Prenumele este obligatoriu';
    }
    if (!profileData.lastName.trim()) {
      newErrors.lastName = 'Numele este obligatoriu';
    }
    if (!profileData.email.trim()) {
      newErrors.email = 'Email-ul este obligatoriu';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Email invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordData = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Parola curentă este obligatorie';
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Noua parolă este obligatorie';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Parola trebuie să aibă cel puțin 8 caractere';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Parolele nu se potrivesc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfileData()) {
      return;
    }

    setSaving(true);

    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update local storage
    const updatedUser = { ...user, ...profileData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser as UserData);

    setSaving(false);
    setEditMode(false);
    setSuccessMessage('Profilul a fost actualizat cu succes!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleChangePassword = async () => {
    if (!validatePasswordData()) {
      return;
    }

    setSaving(true);

    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSaving(false);
    setChangePasswordMode(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setSuccessMessage('Parola a fost schimbată cu succes!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setProfileData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setErrors({});
  };

  const handleCancelPasswordChange = () => {
    setChangePasswordMode(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setErrors({});
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const nextLevel = (user.level + 1) * 1000;
  const progressToNextLevel = (user.points / nextLevel) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.push('/dashboard')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Înapoi la Dashboard
        </Button>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Profile Header Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-1">{user.firstName} {user.lastName}</h1>
                <p className="text-muted-foreground mb-3">{user.email}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    <Trophy className="w-3 h-3 mr-1" />
                    Nivel {user.level}
                  </Badge>
                  <Badge className="bg-yellow-500 hover:bg-yellow-600">
                    <Star className="w-3 h-3 mr-1" />
                    {user.points} BooksyPoints
                  </Badge>
                </div>
              </div>
            </div>

            {/* Level Progress */}
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progres către Nivel {user.level + 1}</span>
                <span className="font-medium">{user.points} / {nextLevel}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all"
                  style={{ width: `${progressToNextLevel}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Informații Personale</CardTitle>
                <CardDescription>Gestionează datele contului tău</CardDescription>
              </div>
              {!editMode && (
                <Button onClick={() => setEditMode(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editează
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Prenume *</Label>
                <Input
                  id="firstName"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                  disabled={!editMode}
                />
                {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <Label htmlFor="lastName">Nume *</Label>
                <Input
                  id="lastName"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                  disabled={!editMode}
                />
                {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                disabled={!editMode}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+40 712 345 678"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                disabled={!editMode}
              />
              {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
            </div>

            {editMode && (
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleCancelEdit} disabled={saving}>
                  <X className="mr-2 h-4 w-4" />
                  Anulează
                </Button>
                <Button onClick={handleSaveProfile} disabled={saving}>
                  {saving ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Se salvează...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Salvează Modificările
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Securitate</CardTitle>
                <CardDescription>Schimbă parola contului tău</CardDescription>
              </div>
              {!changePasswordMode && (
                <Button onClick={() => setChangePasswordMode(true)}>
                  <Lock className="mr-2 h-4 w-4" />
                  Schimbă Parola
                </Button>
              )}
            </div>
          </CardHeader>
          {changePasswordMode && (
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Parola Curentă *</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                />
                {errors.currentPassword && <p className="text-sm text-red-500 mt-1">{errors.currentPassword}</p>}
              </div>

              <div>
                <Label htmlFor="newPassword">Parolă Nouă *</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                />
                {errors.newPassword && <p className="text-sm text-red-500 mt-1">{errors.newPassword}</p>}
                <p className="text-xs text-muted-foreground mt-1">Minim 8 caractere</p>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmă Parola Nouă *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                />
                {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleCancelPasswordChange} disabled={saving}>
                  <X className="mr-2 h-4 w-4" />
                  Anulează
                </Button>
                <Button onClick={handleChangePassword} disabled={saving}>
                  {saving ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Se salvează...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Schimbă Parola
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Preferences Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Preferințe</CardTitle>
            <CardDescription>Configurează notificările și preferințele contului</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Notificări Email</p>
                  <p className="text-sm text-muted-foreground">Primește oferte speciale și noutăți</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Activat
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Notificări Push</p>
                  <p className="text-sm text-muted-foreground">Alerte pentru rezervările tale</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Activat
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Autentificare în 2 Pași</p>
                  <p className="text-sm text-muted-foreground">Securitate suplimentară pentru contul tău</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Configurează
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone Card */}
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader>
            <CardTitle className="text-red-600">Zona Periculoasă</CardTitle>
            <CardDescription>Acțiuni ireversibile pentru contul tău</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-white">
              <div className="flex items-center gap-3">
                <Trash2 className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-600">Șterge Contul</p>
                  <p className="text-sm text-muted-foreground">Șterge permanent contul și toate datele asociate</p>
                </div>
              </div>
              <Button variant="destructive" size="sm">
                Șterge Contul
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

