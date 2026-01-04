import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 40;

const PROMOTIONS = [
  {
    id: '1',
    title: '🌸 Offre Spéciale',
    subtitle: '-20% sur toutes les fleurs',
    description: 'Valable cette semaine uniquement',
    bgColor: '#E91E63',
    icon: 'flower-outline',
  },
  {
    id: '2',
    title: '🍫 Chocolats Premium',
    subtitle: 'Livraison gratuite',
    description: 'Dès 150 DH d\'achat',
    bgColor: '#795548',
    icon: 'gift-outline',
  },
  {
    id: '3',
    title: '🎂 Gâteaux Frais',
    subtitle: 'Nouveau! Personnalisés',
    description: 'Commandez 48h à l\'avance',
    bgColor: '#FF9800',
    icon: 'restaurant-outline',
  },
  {
    id: '4',
    title: '💝 Saint-Valentin',
    subtitle: 'Collection spéciale',
    description: 'Bouquets & Chocolats',
    bgColor: '#9C27B0',
    icon: 'heart-outline',
  },
];

export default function PromoBanner({ onPress }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (activeIndex + 1) % PROMOTIONS.length;
      setActiveIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 4000);

    return () => clearInterval(timer);
  }, [activeIndex]);

  const renderPromo = ({ item }) => (
    <TouchableOpacity
      style={[styles.bannerCard, { backgroundColor: item.bgColor }]}
      onPress={() => onPress && onPress(item)}
      activeOpacity={0.9}
    >
      <View style={styles.bannerContent}>
        <View style={styles.bannerTextContainer}>
          <Text style={styles.bannerTitle}>{item.title}</Text>
          <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
          <Text style={styles.bannerDescription}>{item.description}</Text>
          <View style={styles.bannerButton}>
            <Text style={styles.bannerButtonText}>Découvrir</Text>
            <Ionicons name="arrow-forward" size={14} color="#fff" />
          </View>
        </View>
        <View style={styles.bannerIconContainer}>
          <Ionicons name={item.icon} size={60} color="rgba(255,255,255,0.3)" />
        </View>
      </View>
      <View style={styles.bannerDecor1} />
      <View style={styles.bannerDecor2} />
    </TouchableOpacity>
  );

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / BANNER_WIDTH);
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={PROMOTIONS}
        renderItem={renderPromo}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={BANNER_WIDTH + 10}
        decelerationRate="fast"
        contentContainerStyle={styles.listContainer}
        onMomentumScrollEnd={handleScroll}
        getItemLayout={(_, index) => ({
          length: BANNER_WIDTH + 10,
          offset: (BANNER_WIDTH + 10) * index,
          index,
        })}
      />
      <View style={styles.pagination}>
        {PROMOTIONS.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              activeIndex === index && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  bannerCard: {
    width: BANNER_WIDTH,
    height: 160,
    borderRadius: 24,
    marginRight: 10,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#1A1F36',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  bannerContent: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  bannerTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  bannerSubtitle: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '900',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  bannerDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 14,
    fontWeight: '500',
  },
  bannerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  bannerButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
    marginRight: 6,
    letterSpacing: 0.5,
  },
  bannerIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  bannerDecor1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  bannerDecor2: {
    position: 'absolute',
    bottom: -40,
    right: 30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#E91E63',
    width: 24,
  },
});
