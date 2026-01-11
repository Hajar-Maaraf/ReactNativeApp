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
  const freeDeliveryThreshold = 200;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - totalAmount);
  const deliveryFee = remainingForFreeDelivery > 0 ? 20 : 0;

  const handleCheckout = () => {
    Alert.alert(
      '✨ Confirmer la commande',
      `📦 ${totalItems} article(s)\n💰 Total: ${(totalAmount + deliveryFee).toFixed(2)} DH${deliveryFee === 0 ? '\n🎉 Livraison gratuite!' : ''}`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Commander',
          onPress: () => {
            clearCart();
            Alert.alert(
              '🎉 Commande confirmée!',
              'Votre commande a été passée avec succès!\nVous recevrez une confirmation par email.',
              [{ text: 'Super!' }]
            );
          },
        },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert('Vider le panier', 'Êtes-vous sûr de vouloir vider le panier?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Vider', style: 'destructive', onPress: clearCart },
    ]);
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image || 'https://via.placeholder.com/80' }}
          style={styles.itemImage}
        />
        {item.qty > 1 && (
          <View style={styles.qtyBadge}>
            <Text style={styles.qtyBadgeText}>{item.qty}</Text>
          </View>
        )}
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.itemPrice}>{item.price?.toFixed(0)} DH / unité</Text>
        <View style={styles.quantityRow}>
          <TouchableOpacity
            style={[styles.qtyButton, item.qty === 1 && styles.qtyButtonDelete]}
            onPress={() => decrementFromCart(item.id)}
          >
            <Ionicons 
              name={item.qty === 1 ? "trash-outline" : "remove"} 
              size={16} 
              color={item.qty === 1 ? "#FF5252" : "#E91E63"} 
            />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.qty}</Text>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => addToCart(item)}
          >
            <Ionicons name="add" size={16} color="#E91E63" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.itemActions}>
        <Text style={styles.itemTotal}>{(item.price * item.qty).toFixed(0)} DH</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => removeFromCart(item.id)}
        >
          <Ionicons name="trash-outline" size={16} color="#FF5252" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>🛒 Mon Panier</Text>
          {cart.length > 0 && (
            <Text style={styles.itemCount}>{totalItems} article{totalItems > 1 ? 's' : ''}</Text>
          )}
        </View>
        {cart.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClearCart}>
            <Ionicons name="trash-outline" size={20} color="#E91E63" />
          </TouchableOpacity>
        )}
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="cart-outline" size={60} color="#E91E63" />
          </View>
          <Text style={styles.emptyTitle}>Votre panier est vide</Text>
          <Text style={styles.emptySubtitle}>
            Explorez notre catalogue et ajoutez des produits
          </Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('Catalog')}
          >
            <Ionicons name="storefront-outline" size={20} color="#fff" />
            <Text style={styles.shopButtonText}>Voir le catalogue</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Free delivery progress */}
          {remainingForFreeDelivery > 0 && (
            <View style={styles.deliveryProgress}>
              <View style={styles.deliveryTextRow}>
                <Ionicons name="bicycle-outline" size={18} color="#E91E63" />
                <Text style={styles.deliveryText}>
                  Plus que <Text style={styles.deliveryAmount}>{remainingForFreeDelivery.toFixed(0)} DH</Text> pour la livraison gratuite!
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${Math.min(100, (totalAmount / freeDeliveryThreshold) * 100)}%` }]} />
              </View>
            </View>
          )}
          
          {remainingForFreeDelivery <= 0 && (
            <View style={styles.freeDeliveryBanner}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.freeDeliveryText}>🎉 Livraison gratuite débloquée!</Text>
            </View>
          )}

          <FlatList
            data={cart}
            keyExtractor={(item) => item.id}
            renderItem={renderCartItem}
            contentContainerStyle={styles.cartList}
            showsVerticalScrollIndicator={false}
          />

          {/* Summary */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>📦 Articles ({totalItems})</Text>
              <Text style={styles.summaryValue}>{totalAmount.toFixed(2)} DH</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>🚚 Livraison</Text>
              <Text style={[styles.summaryValue, remainingForFreeDelivery <= 0 && styles.freeText]}>
                {remainingForFreeDelivery <= 0 ? '✨ Gratuite' : '20 DH'}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                {(totalAmount + (remainingForFreeDelivery > 0 ? 20 : 0)).toFixed(2)} DH
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.checkoutButton} 
              onPress={handleCheckout}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
              <Text style={styles.checkoutText}>Passer la commande</Text>
              <View style={styles.checkoutArrow}>
                <Ionicons name="arrow-forward" size={18} color="#E91E63" />
              </View>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF2F4',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2D3436',
  },
  itemCount: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  clearButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryProgress: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  deliveryTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  deliveryText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
  },
  deliveryAmount: {
    fontWeight: '700',
    color: '#E91E63',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#E91E63',
    borderRadius: 3,
  },
  freeDeliveryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 14,
    borderRadius: 16,
  },
  freeDeliveryText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2D3436',
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
  shopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
    backgroundColor: '#E91E63',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
  cartList: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 14,
    backgroundColor: '#f0f0f0',
  },
  qtyBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#E91E63',
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  qtyBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 13,
    color: '#888',
    marginBottom: 10,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyButtonDelete: {
    backgroundColor: 'rgba(255, 82, 82, 0.1)',
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '700',
    marginHorizontal: 16,
    color: '#2D3436',
  },
  itemActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  itemTotal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#E91E63',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 82, 82, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#888',
  },
  summaryValue: {
    fontSize: 15,
    color: '#2D3436',
    fontWeight: '500',
  },
  freeText: {
    color: '#4CAF50',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 14,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2D3436',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#E91E63',
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E91E63',
    paddingVertical: 16,
    borderRadius: 20,
    marginTop: 18,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    marginLeft: 10,
    marginRight: 12,
  },
  checkoutArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
