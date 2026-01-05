import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getProducts } from '../services/productsApi';
import ProductCard from '../components/ProductCard';
import { CartContext } from '../contexts/CartContext';
import { getFavorites, toggleFavorite } from '../utils/favorites';

const CATEGORIES = [
  { id: 'all', label: 'Tous', icon: 'grid-outline' },
  { id: 'fleurs', label: 'Fleurs', icon: 'flower-outline' },
  { id: 'chocolats', label: 'Chocolats', icon: 'cafe-outline' },
  { id: 'gateaux', label: 'Gâteaux', icon: 'fast-food-outline' },
];

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => { loadProducts(); }, []);

  useFocusEffect(useCallback(() => { loadFavorites(); }, []));

  useEffect(() => { filterProducts(); }, [searchQuery, selectedCategory, products]);

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

  const loadFavorites = async () => {
    const favs = await getFavorites();
    setFavoriteIds(favs.map((f) => f.id));
  };

  const handleToggleFavorite = async (product) => {
    await toggleFavorite(product);
    await loadFavorites();
  };

  const filterProducts = () => {
    let result = [...products];
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(query) || p.description?.toLowerCase().includes(query));
    }
    setFilteredProducts(result);
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { id: product.id });
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.categoryButton, selectedCategory === item.id && styles.categoryButtonActive]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Ionicons name={item.icon} size={20} color={selectedCategory === item.id ? '#fff' : '#E91E63'} />
      <Text style={[styles.categoryLabel, selectedCategory === item.id && styles.categoryLabelActive]}>{item.label}</Text>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item, index }) => (
    <ProductCard
      product={item}
      onPress={() => handleProductPress(item)}
      onAddToCart={() => addToCart(item)}
      onFavorite={() => handleToggleFavorite(item)}
      isFavorite={favoriteIds.includes(item.id)}
      index={index}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recherche</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={CATEGORIES}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={renderCategoryItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesList}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E91E63" />
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={renderProductItem}
          contentContainerStyle={styles.productsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={64} color="#ddd" />
              <Text style={styles.emptyText}>Aucun produit trouvé</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF2F4' },
  header: { padding: 20, paddingTop: 50 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#2D3436' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 16, paddingHorizontal: 16, marginBottom: 16 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, paddingVertical: 14, fontSize: 16, color: '#2D3436' },
  categoriesList: { paddingHorizontal: 20, marginBottom: 16 },
  categoryButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginRight: 10 },
  categoryButtonActive: { backgroundColor: '#E91E63' },
  categoryLabel: { marginLeft: 6, fontSize: 14, color: '#E91E63', fontWeight: '600' },
  categoryLabelActive: { color: '#fff' },
  productsList: { paddingHorizontal: 20 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 16, color: '#999', marginTop: 16 },
});
