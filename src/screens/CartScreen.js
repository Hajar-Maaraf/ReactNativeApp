import React, { useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartContext } from '../contexts/CartContext';

export default function CartScreen({ navigation }) {
  const { cart, removeFromCart, clearCart, addToCart, decrementFromCart } = useContext(CartContext);

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleCheckout = () => {
    Alert.alert('Confirmer', `Total: ${totalAmount.toFixed(2)} DH`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Commander', onPress: () => { clearCart(); Alert.alert('Merci!', 'Commande passée!'); } },
    ]);
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.itemPrice}>{item.price} DH</Text>
        <View style={styles.qtyContainer}>
          <TouchableOpacity style={styles.qtyButton} onPress={() => decrementFromCart(item.id)}>
            <Ionicons name="remove" size={18} color="#E91E63" />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.qty}</Text>
          <TouchableOpacity style={styles.qtyButton} onPress={() => addToCart(item)}>
            <Ionicons name="add" size={18} color="#E91E63" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={() => removeFromCart(item.id)}>
        <Ionicons name="trash-outline" size={20} color="#FF5252" />
      </TouchableOpacity>
    </View>
  );

  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={80} color="#ddd" />
        <Text style={styles.emptyText}>Votre panier est vide</Text>
        <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate('Catalog')}>
          <Text style={styles.shopButtonText}>Commencer vos achats</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mon Panier</Text>
        <TouchableOpacity onPress={() => Alert.alert('Vider?', 'Vider le panier?', [
          { text: 'Non' }, { text: 'Oui', onPress: clearCart }
        ])}>
          <Ionicons name="trash-outline" size={24} color="#E91E63" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={renderCartItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total ({totalItems} articles)</Text>
          <Text style={styles.summaryValue}>{totalAmount.toFixed(2)} DH</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutText}>Commander</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF2F4' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 50 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#2D3436' },
  listContent: { padding: 16 },
  cartItem: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, padding: 12, marginBottom: 12, elevation: 2 },
  itemImage: { width: 80, height: 80, borderRadius: 12 },
  itemInfo: { flex: 1, marginLeft: 12 },
  itemTitle: { fontSize: 16, fontWeight: '600', color: '#2D3436' },
  itemPrice: { fontSize: 16, fontWeight: '700', color: '#E91E63', marginTop: 4 },
  qtyContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  qtyButton: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#FFF0F3', alignItems: 'center', justifyContent: 'center' },
  qtyText: { fontSize: 16, fontWeight: '600', marginHorizontal: 12 },
  removeButton: { padding: 8 },
  summary: { backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24, elevation: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  summaryLabel: { fontSize: 16, color: '#666' },
  summaryValue: { fontSize: 20, fontWeight: '800', color: '#2D3436' },
  checkoutButton: { backgroundColor: '#E91E63', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  checkoutText: { color: '#fff', fontSize: 18, fontWeight: '700', marginRight: 8 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FDF2F4' },
  emptyText: { fontSize: 18, color: '#999', marginTop: 16 },
  shopButton: { backgroundColor: '#E91E63', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, marginTop: 20 },
  shopButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
