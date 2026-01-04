import React from 'react';
import { View, Text, Image, Pressable, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

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

export default function ProductCard({ product, onPress, onAddToCart, onFavorite, isFavorite, compact, index }) {
  const categoryColor = CATEGORY_COLORS[product.category] || '#E91E63';
  const categoryLabel = CATEGORY_LABELS[product.category] || product.category;
  const isFav = isFavorite === true;

  if (compact) {
    return (
      <View style={styles.compactCardWrapper}>
        <Pressable 
          style={styles.compactCard} 
          onPress={() => onPress && onPress(product)}
        >
          <View>
            <View style={styles.compactImageContainer}>
              <Image
                source={{ uri: product.image || 'https://via.placeholder.com/150' }}
                style={styles.compactImage}
                resizeMode="cover"
              />
              <View style={[styles.compactGradient, { backgroundColor: `${categoryColor}30` }]} />
              {onFavorite && (
                <TouchableOpacity
                  style={styles.compactFavoriteButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    onFavorite(product);
                  }}
                >
                  <Ionicons
                    name={isFav ? 'heart' : 'heart-outline'}
                    size={18}
                    color={isFav ? '#E91E63' : '#fff'}
                  />
                </TouchableOpacity>
              )}
              {product.category && (
                <View style={[styles.compactBadge, { backgroundColor: categoryColor }]}>
                  <Text style={styles.compactBadgeText}>
                    {product.category === 'fleurs' ? '🌸' : product.category === 'chocolats' ? '🍫' : '🎂'}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.compactInfo}>
              <Text style={styles.compactTitle} numberOfLines={2}>{product.title}</Text>
              <View style={styles.compactBottomRow}>
                <Text style={[styles.compactPrice, { color: categoryColor }]}>
                  {product.price?.toFixed(0)} DH
                </Text>
                {onAddToCart && (
                  <TouchableOpacity
                    style={[styles.compactAddButton, { backgroundColor: categoryColor }]}
                    onPress={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                  >
                    <Ionicons name="add" size={18} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </Pressable>
      </View>
    );
  }

  // Full card view
  return (
    <View style={styles.cardWrapper}>
      <Pressable 
        style={styles.card} 
        onPress={() => onPress && onPress(product)}
      >
        <View>
          {/* Product Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: product.image || 'https://via.placeholder.com/150' }}
              style={styles.image}
              resizeMode="cover"
            />
            {/* Gradient overlay */}
            <View style={styles.imageOverlay} />
            
            {/* Category Badge */}
            {product.category && (
              <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
                <Text style={styles.categoryText}>{categoryLabel}</Text>
              </View>
            )}
            
            {/* Favorite Button */}
            {onFavorite && (
              <TouchableOpacity
                style={[styles.favoriteButton, isFav && styles.favoriteButtonActive]}
                onPress={(e) => {
                  e.stopPropagation();
                  onFavorite(product);
                }}
              >
                <Ionicons
                  name={isFav ? 'heart' : 'heart-outline'}
                  size={24}
                  color={isFav ? '#E91E63' : '#fff'}
                />
              </TouchableOpacity>
            )}

            {/* Rating Badge */}
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>4.8</Text>
            </View>
          </View>

          {/* Product Info */}
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={2}>
              {product.title}
            </Text>
            <Text style={styles.description} numberOfLines={2}>
              {product.description}
            </Text>
            
            {/* Features */}
            <View style={styles.featuresRow}>
              <View style={styles.featureTag}>
                <Ionicons name="checkmark-circle" size={12} color="#4CAF50" />
                <Text style={styles.featureText}>Frais</Text>
              </View>
              <View style={styles.featureTag}>
                <Ionicons name="time" size={12} color="#FF9800" />
                <Text style={styles.featureText}>24h</Text>
              </View>
              <View style={styles.featureTag}>
                <Ionicons name="shield-checkmark" size={12} color="#2196F3" />
                <Text style={styles.featureText}>Garanti</Text>
              </View>
            </View>

            <View style={styles.bottomRow}>
              <View>
                <Text style={styles.priceLabel}>Prix</Text>
                <Text style={[styles.price, { color: categoryColor }]}>
                  {product.price?.toFixed(0)} DH
                </Text>
              </View>
              {onAddToCart && (
                <TouchableOpacity
                  style={[styles.addButton, { backgroundColor: categoryColor }]}
                  onPress={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                  }}
                >
                  <Ionicons name="cart-outline" size={18} color="#fff" />
                  <Text style={styles.addButtonText}>Ajouter</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // Full card styles
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    marginBottom: 20,
    shadowColor: '#1A1F36',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'transparent',
  },
  categoryBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  favoriteButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 25,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  favoriteButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    shadowColor: '#E91E63',
    shadowOpacity: 0.4,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  ratingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  info: {
    padding: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1F36',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 13,
    color: '#636E72',
    marginBottom: 12,
    lineHeight: 20,
  },
  featuresRow: {
    flexDirection: 'row',
    marginBottom: 14,
    gap: 8,
  },
  featureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  featureText: {
    fontSize: 11,
    color: '#636E72',
    marginLeft: 4,
    fontWeight: '500',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 11,
    color: '#B2BEC3',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  price: {
    fontSize: 22,
    fontWeight: '800',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 25,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  
  // Compact card styles
  compactCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#1A1F36',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  compactImageContainer: {
    position: 'relative',
    height: CARD_WIDTH,
  },
  compactImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
  },
  compactFavoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 6,
  },
  compactInfo: {
    padding: 12,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1F36',
    marginBottom: 8,
    lineHeight: 18,
    letterSpacing: -0.2,
  },
  compactBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactPrice: {
    fontSize: 16,
    fontWeight: '800',
  },
  compactAddButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1A1F36',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  compactGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  compactBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  compactBadgeText: {
    fontSize: 14,
  },
});
