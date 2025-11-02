import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>✈️ BooksyGo</Text>
        <Text style={styles.subtitle}>
          Descoperă lumea cu cele mai bune oferte de zboruri și hoteluri
        </Text>
      </View>

      <View style={styles.searchCard}>
        <Text style={styles.searchTitle}>Caută călătoria perfectă</Text>
        <Text style={styles.searchSubtitle}>
          Zboruri • Hoteluri • Pachete Complete
        </Text>
      </View>

      <View style={styles.authButtons}>
        <Link href="/auth/login" asChild>
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Conectare</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/auth/register" asChild>
          <TouchableOpacity style={styles.registerButton}>
            <Text style={styles.registerButtonText}>Creează cont</Text>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity style={styles.guestButton}>
          <Text style={styles.guestButtonText}>Continuă ca vizitator</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.features}>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>💰</Text>
          <Text style={styles.featureText}>Cele mai bune prețuri</Text>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>🎁</Text>
          <Text style={styles.featureText}>BooksyPoints Rewards</Text>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>⚡</Text>
          <Text style={styles.featureText}>Rezervare instantanee</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  hero: {
    padding: 24,
    paddingTop: 40,
    backgroundColor: '#3b82f6',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0f2fe',
    lineHeight: 24,
  },
  searchCard: {
    margin: 20,
    marginTop: -30,
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  searchSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  authButtons: {
    padding: 20,
    gap: 12,
  },
  loginButton: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  registerButtonText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '600',
  },
  guestButton: {
    padding: 12,
    alignItems: 'center',
  },
  guestButtonText: {
    color: '#64748b',
    fontSize: 14,
  },
  features: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  feature: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
});

