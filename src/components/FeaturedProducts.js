import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.42;

const CATEGORY_COLORS = {
  fleurs: '#E91E63',
  chocolats: '#8D6E63',
  gateaux: '#FF7043',
};

export default function FeaturedProducts({ 
  title, 
  subtitle,
  products, 
  onProductPress, 
  onAddToCart,
  onSeeAll,
  horizontal = true,
}) {
  const renderProduct = ({ item }) => {
    const categoryColor = CATEGORY_COLORS[item.category] || '#E91E63';
    
    return (
      <TouchableOpacity
        style={[styles.productCard, horizontal && styles.horizontalCard]}
        onPress={() => onProductPress && onProductPress(item)}
        activeOpacity={0.9}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image || 'https://via.placeholder.com/150' }}
            style={styles.productImage}
            resizeMode="cover"
          />
          {item.isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>Nouveau</Text>
            </View>
          )}
          {item.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{item.discount}%</Text>
            </View>
          )}
        </View>
        
        <View style={styles.productInfo}>
          <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
          
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.rating}>{item.rating || '4.8'}</Text>
            <Text style={styles.reviews}>({item.reviews || '120'})</Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: categoryColor }]}>
              {item.price?.toFixed(0)} DH
            </Text>
            {item.oldPrice && (
              <Text style={styles.oldPrice}>{item.oldPrice} DH</Text>
            )}
          </View>
          
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: categoryColor }]}
            onPress={() => onAddToCart && onAddToCart(item)}
          >
            <Ionicons name="add" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {onSeeAll && (
          <TouchableOpacity style={styles.seeAllButton} onPress={onSeeAll}>
            <Text style={styles.seeAllText}>Voir tout</Text>
            <Ionicons name="chevron-forward" size={16} color="#E91E63" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1A1F36',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 3,
    fontWeight: '500',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    color: '#E91E63',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    marginHorizontal: 6,
    shadowColor: '#1A1F36',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  horizontalCard: {
    width: CARD_WIDTH,
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: CARD_WIDTH * 0.9,
    backgroundColor: '#f5f5f5',
  },
  newBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  newBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF5252',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  discountText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  productInfo: {
    padding: 12,
    position: 'relative',
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1F36',
    marginBottom: 6,
    lineHeight: 18,
    letterSpacing: -0.2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2D3436',
    marginLeft: 4,
  },
  reviews: {
    fontSize: 12,
    color: '#888',
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  oldPrice: {
    fontSize: 13,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  addButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 36,
    height: 36,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1A1F36',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});
