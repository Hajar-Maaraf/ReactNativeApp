import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../contexts/AuthContext';

const MENU_ITEMS = [
  { id: 'orders', icon: 'receipt-outline', label: 'Mes commandes', color: '#E91E63' },
  { id: 'favorites', icon: 'heart-outline', label: 'Mes favoris', color: '#E91E63' },
  { id: 'address', icon: 'location-outline', label: 'Adresses de livraison', color: '#4CAF50' },
  { id: 'payment', icon: 'card-outline', label: 'Moyens de paiement', color: '#2196F3' },
  { id: 'notifications', icon: 'notifications-outline', label: 'Notifications', color: '#FF9800' },
  { id: 'help', icon: 'help-circle-outline', label: 'Aide & Support', color: '#9C27B0' },
  { id: 'about', icon: 'information-circle-outline', label: 'À propos', color: '#607D8B' },
];

// Fonction de confirmation multiplateforme
const confirmLogout = (onConfirm) => {
  if (Platform.OS === 'web') {
    // Utiliser la confirmation navigateur pour le web
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter?')) {
      onConfirm();
    }
  } else {
    // Utiliser Alert.alert pour mobile
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnexion', style: 'destructive', onPress: onConfirm },
      ]
    );
  }
};

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    console.log('=== LOGOUT BUTTON PRESSED ===');
    confirmLogout(() => {
      console.log('Confirming logout...');
      if (logout) {
        logout()
          .then(() => {
            console.log('Logged out successfully');
          })
          .catch((error) => {
            console.error('Erreur lors de la déconnexion:', error);
            if (Platform.OS === 'web') {
              window.alert('Impossible de se déconnecter. Réessayez.');
            } else {
              Alert.alert('Erreur', 'Impossible de se déconnecter. Réessayez.');
            }
          });
      } else {
        console.error('logout function is undefined!');
      }
    });
  };

  const handleMenuPress = (itemId) => {
    switch (itemId) {
      case 'orders':
        navigation.navigate('Orders');
        break;
      case 'favorites':
        navigation.navigate('FavoritesFromProfile');
        break;
      case 'address':
        navigation.navigate('Address');
        break;
      case 'payment':
        navigation.navigate('Payment');
        break;
      case 'notifications':
        navigation.navigate('Notifications');
        break;
      case 'help':
        navigation.navigate('Help');
        break;
      case 'about':
        navigation.navigate('About');
        break;
      default:
        Alert.alert('Info', 'Fonctionnalité bientôt disponible!');
    }
  };

  const getInitials = () => {
    if (!user?.email) return 'SB';
    return user.email.substring(0, 2).toUpperCase();
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Mon Profil</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials()}</Text>
            </View>
          </View>
          <Text style={styles.email}>{user?.email || 'Utilisateur'}</Text>
          <View style={styles.memberBadge}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.memberText}>Membre SweetBloom</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item.id)}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: `${item.color}15` }]}>
                <Ionicons name={item.icon} size={22} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={22} color="#E91E63" />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={styles.version}>SweetBloom v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF2F4',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  profileCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  avatarContainer: {
    marginBottom: 18,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E91E63',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  avatarText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  email: {
    fontSize: 17,
    color: '#2D3436',
    fontWeight: '600',
    marginBottom: 10,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  memberText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '600',
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E91E63',
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#E91E63',
  },
  version: {
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 40,
    fontSize: 12,
    color: '#999',
  },
});