import React, { useState, useEffect, useContext, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal,
  Pressable,
  Platform,
  Vibration,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getProducts } from '../services/productsApi';
import ProductCard from '../components/ProductCard';
import { CartContext } from '../contexts/CartContext';
import { getFavorites, toggleFavorite } from '../utils/favorites';
import { COLORS, SHADOWS, SPACING, RADIUS, CATEGORIES } from '../utils/theme';

const { width, height } = Dimensions.get('window');

// Constantes
const SORT_OPTIONS = [
  { id: 'default', label: 'Par défaut', icon: 'apps-outline' },
  { id: 'price_asc', label: 'Prix croissant', icon: 'arrow-up-outline' },
  { id: 'price_desc', label: 'Prix décroissant', icon: 'arrow-down-outline' },
  { id: 'name_asc', label: 'Nom A-Z', icon: 'text-outline' },
  { id: 'popular', label: 'Populaire', icon: 'flame-outline' },
];

const PRICE_RANGES = [
  { id: 'all', label: 'Tous les prix', min: 0, max: Infinity },
  { id: 'budget', label: '< 100 DH', min: 0, max: 100 },
  { id: 'mid', label: '100 - 300 DH', min: 100, max: 300 },
  { id: 'premium', label: '300 - 500 DH', min: 300, max: 500 },
  { id: 'luxury', label: '> 500 DH', min: 500, max: Infinity },
];

const TRENDING_SEARCHES = [
  { term: 'Roses rouges', emoji: '🌹', hot: true },
  { term: 'Chocolat belge', emoji: '🍫', hot: false },
  { term: 'Gâteau fraise', emoji: '🍓', hot: true },
  { term: 'Bouquet mixte', emoji: '💐', hot: false },
  { term: 'Truffes', emoji: '🍬', hot: false },
];

// Aide pour le retour haptique
const vibrate = () => {
  try {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      if (Vibration && typeof Vibration.vibrate === 'function') {
        Vibration.vibrate(10);
      }
    }
  } catch (error) {
    // Échec silencieux - la vibration est optionnelle
  }
};

export default function SearchScreen({ navigation }) {
  // État
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('default');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [showFilters, setShowFilters] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [recentSearches, setRecentSearches] = useState(['Roses', 'Chocolat noir', 'Gâteau anniversaire']);
  const [addingToCart, setAddingToCart] = useState(null); // Suivre quel produit est ajouté
  const { addToCart } = useContext(CartContext);

  // Références d'animation
  const headerAnim = useRef(new Animated.Value(0)).current;
  const searchAnim = useRef(new Animated.Value(0)).current;
  const listAnim = useRef(new Animated.Value(0)).current;
  const filterAnim = useRef(new Animated.Value(0)).current;
  const searchDebounce = useRef(null);

  // Nombre de filtres actifs
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedPriceRange !== 'all') count++;
    if (selectedSort !== 'default') count++;
    return count;
  }, [selectedCategory, selectedPriceRange, selectedSort]);

  // Animations d'entrée
  useEffect(() => {
    Animated.stagger(100, [
      Animated.spring(headerAnim, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true }),
      Animated.spring(searchAnim, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true }),
      Animated.spring(listAnim, { toValue: 1, tension: 40, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  // Animation du panneau de filtres
  useEffect(() => {
    Animated.spring(filterAnim, { toValue: showFilters ? 1 : 0, tension: 50, friction: 10, useNativeDriver: false }).start();
  }, [showFilters]);

  useEffect(() => { loadProducts(); }, []);

  useFocusEffect(useCallback(() => { loadFavorites(); }, []));

  useEffect(() => { filterAndSortProducts(); }, [searchQuery, selectedCategory, selectedSort, selectedPriceRange, products]);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      setError('Impossible de charger les produits. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
      await loadFavorites();
    } catch (error) {
      console.error('Error refreshing:', error);
      setError('Erreur lors du rafraîchissement.');
    } finally {
      setRefreshing(false);
    }
  };

  const loadFavorites = async () => {
    const favs = await getFavorites();
    setFavoriteIds(favs.map((f) => f.id));
  };

  const handleToggleFavorite = async (product) => {
    vibrate(); // Retour haptique
    await toggleFavorite(product);
    await loadFavorites();
  };

  const handleAddToCart = async (product) => {
    vibrate(); // Retour haptique
    setAddingToCart(product.id);
    
    try {
      await addToCart(product);
      // Afficher l'animation de succès
      setTimeout(() => {
        setAddingToCart(null);
      }, 600);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setAddingToCart(null);
    }
  };

  const filterAndSortProducts = () => {
    let result = [...products];

    // Filtrer par catégorie
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filtrer par gamme de prix
    const priceRange = PRICE_RANGES.find(r => r.id === selectedPriceRange);
    if (priceRange && selectedPriceRange !== 'all') {
      result = result.filter((p) => p.price >= priceRange.min && p.price < priceRange.max);
    }

    // Filtrer par requête de recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.title?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query)
      );
    }

    // Trier les résultats
    switch (selectedSort) {
      case 'price_asc': result.sort((a, b) => (a.price || 0) - (b.price || 0)); break;
      case 'price_desc': result.sort((a, b) => (b.price || 0) - (a.price || 0)); break;
      case 'name_asc': result.sort((a, b) => (a.title || '').localeCompare(b.title || '')); break;
      case 'popular': result.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      default: break;
    }

    setFilteredProducts(result);
  };

  const handleProductPress = (product) => {
    vibrate(); // Retour haptique
    navigation.navigate('ProductDetail', { id: product.id });
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim() && !recentSearches.includes(searchQuery.trim())) {
      setRecentSearches(prev => [searchQuery.trim(), ...prev.slice(0, 4)]);
    }
  };

  const clearFilters = () => {
    vibrate(); // Retour haptique
    setSelectedCategory('all');
    setSelectedPriceRange('all');
    setSelectedSort('default');
    setSearchQuery('');
  };

  const handleCategorySelect = (categoryId) => {
    vibrate(); // Retour haptique
    setSelectedCategory(categoryId);
  };

  const handlePriceRangeSelect = (rangeId) => {
    vibrate(); // Retour haptique
    setSelectedPriceRange(rangeId);
  };

  const handleSortSelect = (sortId) => {
    vibrate(); // Retour haptique
    setSelectedSort(sortId);
    setShowSortModal(false);
  };

  const toggleViewMode = () => {
    vibrate(); // Retour haptique
    setViewMode(prev => prev === 'list' ? 'grid' : 'list');
  };

  // Composant puce de catégorie
  const renderCategoryChip = ({ item }) => {
    const isActive = selectedCategory === item.id;
    return (
      <TouchableOpacity
        style={[styles.categoryChip, isActive && { backgroundColor: item.color }]}
        onPress={() => handleCategorySelect(item.id)}
        activeOpacity={0.7}
      >
        <Text style={styles.categoryEmoji}>{item.emoji}</Text>
        <Text style={[styles.categoryLabel, { color: isActive ? '#fff' : item.color }]}>{item.label}</Text>
        {isActive && (
          <View style={styles.categoryCheckmark}>
            <Ionicons name="checkmark" size={12} color="#fff" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Éléments de produit avec état de chargement - mémorisés pour les performances
  const renderProductGrid = useCallback(({ item, index }) => (
    <ProductCard 
      product={item} 
      onPress={handleProductPress} 
      onAddToCart={handleAddToCart} 
      onFavorite={handleToggleFavorite} 
      isFavorite={favoriteIds.includes(item.id)} 
      compact={true} 
      index={index}
      isAddingToCart={addingToCart === item.id}
    />
  ), [favoriteIds, addingToCart, handleProductPress, handleAddToCart, handleToggleFavorite]);

  const renderProductList = useCallback(({ item, index }) => (
    <ProductCard 
      product={item} 
      onPress={handleProductPress} 
      onAddToCart={handleAddToCart} 
      onFavorite={handleToggleFavorite} 
      isFavorite={favoriteIds.includes(item.id)} 
      index={index}
      isAddingToCart={addingToCart === item.id}
    />
  ), [favoriteIds, addingToCart, handleProductPress, handleAddToCart, handleToggleFavorite]);

  // Modal de tri
  const renderSortModal = () => (
    <Modal visible={showSortModal} transparent animationType="fade" onRequestClose={() => setShowSortModal(false)}>
      <Pressable style={styles.modalOverlay} onPress={() => setShowSortModal(false)}>
        <View style={styles.sortModal}>
          <View style={styles.sortModalHeader}>
            <Text style={styles.sortModalTitle}>Trier par</Text>
            <TouchableOpacity onPress={() => setShowSortModal(false)}>
              <Ionicons name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
          {SORT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.sortOption, selectedSort === option.id && styles.sortOptionActive]}
              onPress={() => handleSortSelect(option.id)}
            >
              <Ionicons name={option.icon} size={20} color={selectedSort === option.id ? COLORS.primary : COLORS.textSecondary} />
              <Text style={[styles.sortOptionText, selectedSort === option.id && styles.sortOptionTextActive]}>{option.label}</Text>
              {selectedSort === option.id && <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />}
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );

  const filterPanelHeight = filterAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 180] });

  return (
    <View style={styles.container}>
      {/* Modern Header with Gradient */}
      <View style={styles.header}>
        <View style={styles.headerGradient} />
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerGreeting}>Découvrez nos produits</Text>
              <Text style={styles.headerTitle}>Recherche</Text>
            </View>
            <View style={styles.resultsCounter}>
              <Text style={styles.resultsNumber}>{filteredProducts.length}</Text>
              <Text style={styles.resultsLabel}>produits</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Enhanced Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, searchFocused && styles.searchBarFocused]}>
          <View style={[styles.searchIconContainer, searchFocused && styles.searchIconContainerActive]}>
            <Ionicons name="search" size={22} color={searchFocused ? '#fff' : COLORS.primary} />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Que recherchez-vous ?"
            placeholderTextColor={COLORS.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            returnKeyType="search"
            accessible={true}
            accessibilityLabel="Champ de recherche"
            accessibilityHint="Saisissez le nom d'un produit pour rechercher"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.clearSearchButton}
              onPress={() => setSearchQuery('')}
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle" size={22} color={COLORS.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <TouchableOpacity 
          style={[styles.filterButton, showFilters && styles.filterButtonActive]} 
          onPress={() => { vibrate(); setShowFilters(!showFilters); }}
          accessible={true}
          accessibilityLabel="Filtres"
          accessibilityHint={showFilters ? "Masquer les filtres" : "Afficher les filtres"}
          accessibilityRole="button"
        >
          <Ionicons name="options-outline" size={18} color={showFilters ? '#fff' : COLORS.primary} />
          <Text style={[styles.filterButtonText, showFilters && styles.filterButtonTextActive]}>Filtres</Text>
          {activeFiltersCount > 0 && (
            <View style={styles.filterCount}>
              <Text style={styles.filterCountText}>{activeFiltersCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={() => { vibrate(); setShowSortModal(true); }}
        >
          <Ionicons name="swap-vertical" size={18} color={COLORS.primary} />
          <Text style={styles.filterButtonText}>Trier</Text>
        </TouchableOpacity>

        <View style={styles.viewToggleContainer}>
          <TouchableOpacity 
            style={[styles.viewToggleButton, viewMode === 'list' && styles.viewToggleButtonActive]} 
            onPress={() => { vibrate(); setViewMode('list'); }}
          >
            <Ionicons name="list" size={18} color={viewMode === 'list' ? '#fff' : COLORS.textTertiary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.viewToggleButton, viewMode === 'grid' && styles.viewToggleButtonActive]} 
            onPress={() => { vibrate(); setViewMode('grid'); }}
          >
            <Ionicons name="grid" size={18} color={viewMode === 'grid' ? '#fff' : COLORS.textTertiary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Collapsible Filters */}
      {showFilters && (
        <View style={styles.filtersPanel}>
          <Text style={styles.filterLabel}>Catégorie</Text>
          <View style={styles.chipsContainer}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.chip,
                  selectedCategory === cat.id && styles.chipActive
                ]}
                onPress={() => handleCategorySelect(cat.id)}
              >
                <Text style={styles.chipEmoji}>{cat.emoji}</Text>
                <Text style={[
                  styles.chipText,
                  selectedCategory === cat.id && styles.chipTextActive
                ]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.filterLabel}>Prix</Text>
          <View style={styles.chipsContainer}>
            {PRICE_RANGES.map((range) => (
              <TouchableOpacity
                key={range.id}
                style={[
                  styles.chip,
                  selectedPriceRange === range.id && styles.chipActive
                ]}
                onPress={() => handlePriceRangeSelect(range.id)}
              >
                <Text style={[
                  styles.chipText,
                  selectedPriceRange === range.id && styles.chipTextActive
                ]}>
                  {range.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {activeFiltersCount > 0 && (
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={clearFilters}
              accessible={true}
              accessibilityLabel="Réinitialiser les filtres"
              accessibilityRole="button"
            >
              <Ionicons name="refresh-outline" size={16} color={COLORS.primary} />
              <Text style={styles.clearButtonText}>Réinitialiser</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Results */}
      {error ? (
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle" size={64} color={COLORS.error || '#F44336'} />
          <Text style={styles.emptyTitle}>Erreur</Text>
          <Text style={styles.emptyMessage}>{error}</Text>
          <TouchableOpacity style={styles.resetButton} onPress={loadProducts}>
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles.resetButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="search" size={64} color={COLORS.textTertiary} />
          <Text style={styles.emptyTitle}>Aucun résultat</Text>
          <Text style={styles.emptyMessage}>Essayez avec d'autres mots-clés</Text>
          {activeFiltersCount > 0 && (
            <TouchableOpacity style={styles.resetButton} onPress={clearFilters}>
              <Text style={styles.resetButtonText}>Réinitialiser les filtres</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={viewMode === 'grid' ? renderProductGrid : renderProductList}
          numColumns={viewMode === 'grid' ? 2 : 1}
          key={viewMode}
          contentContainerStyle={styles.productsList}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : null}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={10}
          windowSize={10}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
        />
      )}

      {renderSortModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // En-tête
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: SPACING.xl,
    position: 'relative',
    overflow: 'hidden',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
    opacity: 0.95,
  },
  headerContent: {
    paddingHorizontal: SPACING.lg,
    position: 'relative',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerGreeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1,
  },
  resultsCounter: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    minWidth: 70,
  },
  resultsNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -0.5,
  },
  resultsLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    marginTop: 2,
  },
  headerDecor1: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: COLORS.primarySoft,
  },
  headerDecor2: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primarySoft,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerGreeting: {
    fontSize: 14,
    color: COLORS.textTertiary,
    fontWeight: '500',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: -1,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  statBadge: {
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primaryGlow,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Section de recherche
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    marginTop: -24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: RADIUS.xxl,
    borderWidth: 3,
    borderColor: 'transparent',
    ...SHADOWS.large,
    elevation: 8,
  },
  searchBarFocused: {
    borderColor: COLORS.primary,
    ...SHADOWS.glow,
    transform: [{ scale: 1.01 }],
  },
  searchIconContainer: {
    width: 46,
    height: 46,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  searchIconContainerActive: {
    backgroundColor: COLORS.primary,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  clearSearchButton: {
    padding: 8,
  },

  // Barre de filtres
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: RADIUS.xl,
    ...SHADOWS.small,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    gap: 8,
    flex: 1,
    maxWidth: width * 0.4,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    ...SHADOWS.primary,
  },
  filterIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIconWrapperActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: 0.2,
    flex: 1,
  },
  filterButtonTextActive: {
    color: '#fff',
    fontWeight: '800',
  },
  filterCount: {
    backgroundColor: '#fff',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  filterCountText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '900',
  },
  viewToggleContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 3,
    ...SHADOWS.small,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
  },
  viewToggleButton: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewToggleButtonActive: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.small,
  },
  viewDivider: {
    width: 1,
    height: 20,
    backgroundColor: COLORS.borderLight,
    alignSelf: 'center',
  },

  // Panneau de filtres
  filtersPanel: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    borderRadius: RADIUS.xl,
    ...SHADOWS.medium,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    marginTop: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: RADIUS.full,
    borderWidth: 0,
    gap: 8,
    minWidth: 90,
  },
  chipEmoji: {
    fontSize: 18,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#424242',
    letterSpacing: 0.2,
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.medium,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: COLORS.primarySoft,
    borderRadius: RADIUS.full,
    gap: 8,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 0.2,
  },

  // État vide
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.xxxl,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginTop: SPACING.lg,
    letterSpacing: -0.5,
  },
  emptyMessage: {
    fontSize: 15,
    color: COLORS.textTertiary,
    marginTop: SPACING.sm,
    textAlign: 'center',
    lineHeight: 22,
  },
  resetButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: RADIUS.full,
    marginTop: SPACING.xl,
    ...SHADOWS.primary,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  emptyMessage: {
    fontSize: 15,
    color: COLORS.textTertiary,
    marginTop: SPACING.sm,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Actions rapides
  quickActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: RADIUS.full,
    ...SHADOWS.medium,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    gap: 6,
  },
  actionButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    ...SHADOWS.primary,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.2,
  },
  actionTextActive: {
    color: '#fff',
    fontWeight: '900',
  },
  filterBadge: {
    backgroundColor: '#fff',
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterBadgeText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '900',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.full,
    padding: 5,
    marginLeft: 'auto',
    ...SHADOWS.medium,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    gap: 4,
  },
  viewButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  viewButtonActive: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.small,
  },

  // Panneau de filtres
  filterPanel: {
    overflow: 'hidden',
    marginTop: SPACING.md,
  },
  filterSectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textTertiary,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  filterList: {
    paddingBottom: SPACING.md,
    paddingRight: SPACING.xl,
  },
  clearFiltersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: SPACING.md,
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: COLORS.primarySoft,
    borderRadius: RADIUS.full,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.primary + '20',
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.2,
  },

  // Catégories
  categoriesListCompact: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    paddingRight: SPACING.xl,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: RADIUS.full,
    marginRight: 10,
    ...SHADOWS.small,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    minWidth: 100,
  },
  categoryEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  categoryLabel: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  categoryCheckmark: {
    marginLeft: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Puces de prix
  priceChip: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: RADIUS.full,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  priceChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  priceChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  priceChipTextActive: {
    color: '#fff',
    fontWeight: '700',
  },

  // Conteneur de suggestions de recherche
  searchSuggestions: {
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.md,
  },

  // Recherches récentes
  recentSearches: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    ...SHADOWS.small,
    marginBottom: SPACING.md,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  recentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  clearRecent: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  recentTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  recentTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    gap: 8,
  },
  recentTagText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },

  // Section tendances
  trendingSection: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    ...SHADOWS.small,
  },
  trendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.md,
  },
  trendingTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  trendingTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  trendingTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    gap: 8,
  },
  trendingTagHot: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  trendingEmoji: {
    fontSize: 16,
  },
  trendingTagText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  trendingTagTextHot: {
    color: '#B45309',
    fontWeight: '700',
  },
  hotBadge: {
    marginLeft: 2,
  },
  hotBadgeText: {
    fontSize: 12,
  },

  // Conteneur de résultats
  resultsContainer: {
    flex: 1,
  },

  // Chargement
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: SPACING.lg,
  },
  loadingSpinner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    ...SHADOWS.glow,
  },
  loadingText: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  loadingSubtext: {
    color: COLORS.textTertiary,
    fontSize: 14,
    marginTop: 6,
  },

  // État vide
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 80,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    ...SHADOWS.glow,
  },
  emptyEmoji: {
    fontSize: 56,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  emptySubtitle: {
    fontSize: 15,
    color: COLORS.textTertiary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: RADIUS.full,
    marginTop: SPACING.xxl,
    ...SHADOWS.primary,
    gap: 10,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  suggestionsContainer: {
    marginTop: SPACING.xxxl,
    alignItems: 'center',
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textTertiary,
    marginBottom: SPACING.md,
  },
  suggestionsTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  suggestionTag: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: RADIUS.full,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  suggestionTagText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // Listes de produits
  productsList: {
    paddingHorizontal: SPACING.md,
    paddingBottom: 100,
    paddingTop: SPACING.sm,
  },
  gridList: {
    paddingHorizontal: SPACING.md,
    paddingBottom: 100,
    paddingTop: SPACING.sm,
  },
  gridRow: {
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xs,
  },

  // Modal de tri
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  sortModal: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xxxl,
    borderTopRightRadius: RADIUS.xxxl,
    paddingTop: SPACING.xxl,
    paddingBottom: Platform.OS === 'ios' ? 40 : SPACING.xxl,
  },
  sortModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxl,
    marginBottom: SPACING.lg,
  },
  sortModalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  sortOptionActive: {
    backgroundColor: COLORS.primarySoft,
  },
  sortOptionText: {
    flex: 1,
    marginLeft: SPACING.md,
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  sortOptionTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});
