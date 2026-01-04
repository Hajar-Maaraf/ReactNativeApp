import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getProducts } from '../services/productsApi';
import ProductCard from '../components/ProductCard';
import PromoBanner from '../components/PromoBanner';
import QuickActions from '../components/QuickActions';
import FeaturedProducts from '../components/FeaturedProducts';
import { CartContext } from '../contexts/CartContext';
import { getFavorites, toggleFavorite } from '../utils/favorites';
import { COLORS, SHADOWS, SPACING, RADIUS, FONT_SIZES, CATEGORIES } from '../utils/theme';

export default function CatalogScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    loadProducts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  useEffect(() => {
    filterByCategory();
  }, [selectedCategory, products]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    await loadFavorites();
    setRefreshing(false);
  };

  const loadFavorites = async () => {
    const favs = await getFavorites();
    setFavoriteIds(favs.map((f) => f.id));
  };

  const handleToggleFavorite = async (product) => {
    await toggleFavorite(product);
    await loadFavorites();
  };

  const filterByCategory = () => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((p) => p.category === selectedCategory)
      );
    }
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { id: product.id });
  };

  const renderCategoryButton = (category) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryButton,
        selectedCategory === category.id && { backgroundColor: category.color },
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <Ionicons
        name={category.icon}
        size={24}
        color={selectedCategory === category.id ? '#fff' : category.color}
      />
      <Text
        style={[
          styles.categoryLabel,
          { color: selectedCategory === category.id ? '#fff' : category.color },
        ]}
      >
        {category.label}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item, index }) => (
    <ProductCard
      product={item}
      onPress={() => handleProductPress(item)}
      onAddToCart={() => addToCart(item)}
      onFavorite={() => handleToggleFavorite(item)}
      isFavorite={favoriteIds.includes(item.id)}
      index={index}
    />
  );

  // Get featured products (first 5)
  const featuredProducts = products.slice(0, 5).map((p, i) => ({
    ...p,
    isNew: i < 2,
    discount: i === 2 ? 15 : null,
    rating: (4.5 + Math.random() * 0.5).toFixed(1),
    reviews: Math.floor(80 + Math.random() * 100),
  }));

  // Get popular products (random 5)
  const popularProducts = [...products]
    .sort(() => 0.5 - Math.random())
    .slice(0, 5)
    .map(p => ({
      ...p,
      rating: (4.3 + Math.random() * 0.6).toFixed(1),
      reviews: Math.floor(50 + Math.random() * 150),
    }));

  const handleQuickAction = (actionId) => {
    switch(actionId) {
      case 'new':
        setSelectedCategory('all');
        break;
      case 'popular':
        setSelectedCategory('all');
        break;
      case 'promo':
        setSelectedCategory('all');
        break;
      case 'gift':
        setSelectedCategory('fleurs');
        break;
      case 'express':
        setSelectedCategory('all');
        break;
    }
  };

  return (
    <View style={styles.container}>
      {/* Enhanced Header with Gradient Effect */}
      <View style={styles.header}>
        <View style={styles.headerGradient} />
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>Bienvenue sur</Text>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>🌸 SweetBloom</Text>
                <View style={styles.titleGlow} />
              </View>
              <Text style={styles.tagline}>Votre bonheur livré</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.searchButton}
                onPress={() => navigation.navigate('Search')}
              >
                <Ionicons name="search-outline" size={22} color="#E91E63" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.notificationButton}
                onPress={() => navigation.navigate('Notifications')}
              >
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>3</Text>
                </View>
                <Ionicons name="notifications-outline" size={22} color="#E91E63" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E91E63" />
          <Text style={styles.loadingText}>Chargement des produits...</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#E91E63']}
              tintColor="#E91E63"
            />
          }
        >
          {/* Promotional Banners */}
          <PromoBanner onPress={(promo) => console.log('Promo pressed:', promo)} />

          {/* Quick Actions */}
          <QuickActions onPress={handleQuickAction} />

          {/* Featured Products */}
          {featuredProducts.length > 0 && (
            <FeaturedProducts
              title="✨ Nouveautés"
              subtitle="Découvrez nos derniers produits"
              products={featuredProducts}
              onProductPress={handleProductPress}
              onAddToCart={addToCart}
              onSeeAll={() => setSelectedCategory('all')}
            />
          )}

          {/* Popular Products */}
          {popularProducts.length > 0 && (
            <FeaturedProducts
              title="🔥 Les Plus Populaires"
              subtitle="Ce que nos clients adorent"
              products={popularProducts}
              onProductPress={handleProductPress}
              onAddToCart={addToCart}
              onSeeAll={() => setSelectedCategory('all')}
            />
          )}

          {/* Categories Section */}
          <View style={styles.categoriesSection}>
            <Text style={styles.categoriesTitle}>🏷️ Catégories</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              {CATEGORIES.map(renderCategoryButton)}
            </ScrollView>
          </View>

          {/* Enhanced Section Header */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>
                {selectedCategory === 'all' ? '📦 Tous les Produits' : 
                 selectedCategory === 'fleurs' ? '🌸 Nos Fleurs' :
                 selectedCategory === 'chocolats' ? '🍫 Nos Chocolats' : '🎂 Nos Gâteaux'}
              </Text>
              <Text style={styles.sectionSubtitle}>
                {selectedCategory === 'all' ? 'Explorez toute notre collection' :
                 `Collection ${selectedCategory}`}
              </Text>
            </View>
            <View style={styles.productCountBadge}>
              <Text style={styles.productCount}>{filteredProducts.length}</Text>
            </View>
          </View>

          {/* Products Grid */}
          <View style={styles.productsGrid}>
            {filteredProducts.map((item, index) => (
              <ProductCard
                key={item.id}
                product={item}
                onPress={() => handleProductPress(item)}
                onAddToCart={() => addToCart(item)}
                onFavorite={() => handleToggleFavorite(item)}
                isFavorite={favoriteIds.includes(item.id)}
                index={index}
                compact={true}
              />
            ))}
          </View>

          {filteredProducts.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyTitle}>Aucun produit trouvé</Text>
              <Text style={styles.emptySubtitle}>Essayez une autre catégorie</Text>
            </View>
          )}

          {/* Bottom Spacing */}
          <View style={{ height: 100 }} />
        </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 22,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#1A1F36',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  headerGradient: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(233, 30, 99, 0.05)',
  },
  headerContent: {
    position: 'relative',
    zIndex: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  titleContainer: {
    position: 'relative',
  },
  titleGlow: {
    position: 'absolute',
    bottom: -6,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#E91E63',
    borderRadius: 2,
    opacity: 0.2,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  tagline: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
    position: 'relative',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.surface,
    zIndex: 1,
    ...SHADOWS.primary,
  },
  notificationBadgeText: {
    color: COLORS.textInverse,
    fontSize: FONT_SIZES.xs,
    fontWeight: '800',
    paddingHorizontal: 2,
  },
  greeting: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textTertiary,
    marginBottom: SPACING.xs,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  title: {
    fontSize: FONT_SIZES.display,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: -1.2,
  },
  subtitleContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  subtitleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: '#FFE0EB',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  categoriesSection: {
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.sm,
  },
  categoriesTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
  },
  categoriesContainer: {
    paddingHorizontal: SPACING.lg,
  },
  categoryButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.lg + 2,
    borderRadius: RADIUS.xxl,
    marginRight: SPACING.md + 2,
    minWidth: 95,
    ...SHADOWS.medium,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  categoryLabel: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZES.sm + 1,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    marginTop: SPACING.sm,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  sectionSubtitle: {
    fontSize: FONT_SIZES.sm + 1,
    color: COLORS.textTertiary,
    fontWeight: '500',
  },
  productCountBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md + 2,
    paddingVertical: 6,
    borderRadius: RADIUS.md + 2,
    ...SHADOWS.primary,
  },
  productCount: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textInverse,
    fontWeight: '800',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.textTertiary,
    fontSize: FONT_SIZES.md,
  },
  productsList: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 100,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.md,
    justifyContent: 'space-between',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textTertiary,
    textAlign: 'center',
  },
  titleContainer: {
    position: 'relative',
  },
  titleGlow: {
    position: 'absolute',
    bottom: -4,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    opacity: 0.3,
  },
  tagline: {
    fontSize: FONT_SIZES.sm + 1,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    fontWeight: '500',
  },
});
