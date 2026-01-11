import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getProductById } from '../services/productsApi';
import { CartContext } from '../contexts/CartContext';
import { getFavorites, toggleFavorite } from '../utils/favorites';

const { width } = Dimensions.get('window');

const CATEGORY_COLORS = {
  fleurs: '#E91E63',
  chocolats: '#8D6E63',
  gateaux: '#FF7043',
};

const CATEGORY_LABELS = {
  fleurs: '🌸 Fleurs',
  chocolats: '🍫 Chocolats',
  gateaux: '🎂 Gâteaux',
};

export default function ProductDetailScreen({ route, navigation }) {
  const { id } = route.params || {};
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const scaleAnim = useState(new Animated.Value(1))[0];
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (id) {
      setLoading(true);
      getProductById(id)
        .then((fetchedProduct) => {
          setProduct(fetchedProduct);
        })
        .catch((error) => {
          console.error('Error fetching product:', error);
          setProduct(null);
        })
        .finally(() => {
          setLoading(false);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }).start();
        });
    } else {
      // Si aucun ID n'est fourni, arrêter le chargement et afficher une erreur
      setLoading(false);
      setProduct(null);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      loadFavoriteStatus();
    }, [product])
  );

  const loadFavoriteStatus = async () => {
    if (product) {
      const favs = await getFavorites();
      setIsFavorite(favs.some(f => f.id === product.id));
    }
  };

  const handleToggleFavorite = async () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    
    await toggleFavorite(product);
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    Alert.alert(
      'Ajouté au panier! 🛒',
      `${quantity}x ${product.title} ajouté au panier`,
      [{ text: 'OK' }]
    );
  };

  const categoryColor = CATEGORY_COLORS[product?.category] || '#E91E63';

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <View style={styles.loadingIconWrapper}>
            <ActivityIndicator size="large" color="#E91E63" />
          </View>
          <Text style={styles.loadingText}>Chargement...</Text>
          <Text style={styles.loadingSubtext}>Préparation de votre produit</Text>
        </View>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.errorContent}>
          <View style={styles.errorIconWrapper}>
            <Ionicons name="alert-circle-outline" size={48} color="#E91E63" />
          </View>
          <Text style={styles.errorTitle}>Produit non trouvé</Text>
          <Text style={styles.errorSubtitle}>Ce produit n'existe pas ou a été supprimé</Text>
          <TouchableOpacity 
            style={styles.errorButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={18} color="#fff" />
            <Text style={styles.errorButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          {imageLoading && (
            <View style={styles.imagePlaceholder}>
              <ActivityIndicator size="large" color="#E91E63" />
            </View>
          )}
          <Image
            source={{ uri: product.image || 'https://via.placeholder.com/400' }}
            style={styles.image}
            resizeMode="cover"
            onLoadEnd={() => setImageLoading(false)}
          />
          <View style={styles.imageGradient} />
          
          {/* Header Buttons */}
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={22} color="#1A1F36" />
            </TouchableOpacity>
            
            <View style={styles.headerRightButtons}>
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity 
                  style={[styles.actionButton, isFavorite && styles.favoriteButtonActive]}
                  onPress={handleToggleFavorite}
                >
                  <Ionicons 
                    name={isFavorite ? "heart" : "heart-outline"} 
                    size={22} 
                    color={isFavorite ? "#E91E63" : "#1A1F36"} 
                  />
                </TouchableOpacity>
              </Animated.View>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="share-outline" size={22} color="#1A1F36" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Image Badge */}
          <View style={[styles.imageBadge, { backgroundColor: categoryColor }]}>
            <Text style={styles.imageBadgeText}>✨ Premium</Text>
          </View>
        </View>

        {/* Product Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoContainer}>
            {/* Category & Rating Row */}
            <View style={styles.topInfoRow}>
              {product.category && (
                <View style={[styles.categoryBadge, { backgroundColor: `${categoryColor}15` }]}>
                  <Text style={[styles.categoryText, { color: categoryColor }]}>
                    {CATEGORY_LABELS[product.category] || product.category}
                  </Text>
                </View>
              )}
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>4.8</Text>
                <Text style={styles.reviewsText}>(128 avis)</Text>
              </View>
            </View>

            <Text style={styles.title}>{product.title}</Text>
            
            <View style={styles.priceRow}>
              <Text style={[styles.price, { color: categoryColor }]}>
                {product.price?.toFixed(0)} DH
              </Text>
              {product.price > 100 && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>-15%</Text>
                </View>
              )}
            </View>

          {/* Features */}
          <View style={styles.featuresRow}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Frais</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="time" size={20} color="#FF9800" />
              <Text style={styles.featureText}>Livraison 24h</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Text style={styles.featureText}>Premium</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Quantity Selector */}
          <View style={styles.quantityContainer}>
            <View>
              <Text style={styles.quantityLabel}>Quantité</Text>
              <Text style={styles.quantitySubtext}>Sélectionnez la quantité</Text>
            </View>
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={[styles.quantityButton, quantity === 1 && styles.quantityButtonDisabled]}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity === 1}
              >
                <Ionicons name="remove" size={20} color={quantity === 1 ? '#ccc' : categoryColor} />
              </TouchableOpacity>
              <View style={styles.quantityDisplay}>
                <Text style={styles.quantityText}>{quantity}</Text>
              </View>
              <TouchableOpacity
                style={[styles.quantityButton, { backgroundColor: categoryColor }]}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Delivery Info */}
          <View style={styles.deliveryCard}>
            <View style={styles.deliveryIconWrapper}>
              <Ionicons name="rocket-outline" size={24} color="#E91E63" />
            </View>
            <View style={styles.deliveryInfo}>
              <Text style={styles.deliveryTitle}>Livraison Express</Text>
              <Text style={styles.deliverySubtitle}>Recevez demain avant 18h</Text>
            </View>
            <View style={styles.deliveryBadge}>
              <Text style={styles.deliveryBadgeText}>Gratuit</Text>
            </View>
          </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={[styles.totalPrice, { color: categoryColor }]}>
            {(product.price * quantity).toFixed(0)} DH
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.addToCartButton, { backgroundColor: categoryColor }]}
          onPress={handleAddToCart}
          activeOpacity={0.85}
        >
          <View style={styles.cartIconWrapper}>
            <Ionicons name="cart" size={20} color="#fff" />
          </View>
          <Text style={styles.addToCartText}>Ajouter</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF2F4',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDF2F4',
  },
  loadingContent: {
    alignItems: 'center',
    padding: 40,
  },
  loadingIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1F36',
    marginBottom: 6,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#94A3B8',
  },
  errorContent: {
    alignItems: 'center',
    padding: 40,
  },
  errorIconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFF0F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1F36',
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 24,
  },
  errorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E91E63',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 28,
    gap: 8,
  },
  errorButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  imageContainer: {
    position: 'relative',
    height: 420,
    backgroundColor: '#fff',
  },
  imagePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F8F9FA',
  },
  imageGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  headerButtons: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerRightButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 12,
    shadowColor: '#1A1F36',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  actionButton: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 12,
    shadowColor: '#1A1F36',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  favoriteButtonActive: {
    backgroundColor: '#FFF0F3',
  },
  imageBadge: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  imageBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: '#fff',
    marginTop: -30,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    minHeight: 400,
    shadowColor: '#1A1F36',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 10,
  },
  infoContainer: {
    padding: 24,
  },
  topInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '700',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A1F36',
  },
  reviewsText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1A1F36',
    marginBottom: 12,
    letterSpacing: -0.8,
    lineHeight: 32,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  price: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
  },
  discountBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    color: '#16A34A',
    fontSize: 13,
    fontWeight: '700',
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingVertical: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  featureItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  featureText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 20,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1F36',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 24,
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1F36',
  },
  quantitySubtext: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityDisplay: {
    width: 50,
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1F36',
  },
  deliveryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 16,
    backgroundColor: '#FFF0F3',
    borderRadius: 20,
    gap: 14,
  },
  deliveryIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1F36',
  },
  deliverySubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  deliveryBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  deliveryBadgeText: {
    color: '#16A34A',
    fontSize: 13,
    fontWeight: '700',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 34,
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: '#1A1F36',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 16,
  },
  totalContainer: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  totalPrice: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 28,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
    gap: 10,
  },
  cartIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});
