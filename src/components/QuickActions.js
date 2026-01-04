import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const QUICK_ACTIONS = [
  {
    id: 'new',
    label: 'Nouveautés',
    icon: 'sparkles',
    color: '#E91E63',
    gradient: ['#FF6B9D', '#E91E63'],
  },
  {
    id: 'popular',
    label: 'Populaires',
    icon: 'trending-up',
    color: '#FF9800',
    gradient: ['#FFB74D', '#FF9800'],
  },
  {
    id: 'promo',
    label: 'Promos',
    icon: 'pricetag',
    color: '#48BB78',
    gradient: ['#68D391', '#48BB78'],
  },
  {
    id: 'gift',
    label: 'Cadeaux',
    icon: 'gift',
    color: '#9C27B0',
    gradient: ['#BA68C8', '#9C27B0'],
  },
  {
    id: 'express',
    label: 'Express',
    icon: 'flash',
    color: '#4299E1',
    gradient: ['#63B3ED', '#4299E1'],
  },
];

export default function QuickActions({ onPress }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⚡ Accès Rapide</Text>
        <Text style={styles.subtitle}>Trouvez ce que vous cherchez</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {QUICK_ACTIONS.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionCard}
            onPress={() => onPress && onPress(action.id)}
            activeOpacity={0.8}
          >
            <View style={[styles.iconContainer, { backgroundColor: action.color }]}>
              <Ionicons name={action.icon} size={24} color="#fff" />
              <View style={styles.iconGlow} />
            </View>
            <Text style={styles.label}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1F36',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: '#718096',
    marginTop: 2,
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  actionCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
    minWidth: 100,
    shadowColor: '#1A1F36',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F7FAFC',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    position: 'relative',
  },
  iconGlow: {
    position: 'absolute',
    width: '120%',
    height: '120%',
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    top: -2,
    left: -2,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1F36',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});
