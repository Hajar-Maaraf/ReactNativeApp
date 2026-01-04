import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#E91E63',
  textPrimary: '#1A1F36',
  textSecondary: '#4A5568',
  textTertiary: '#718096',
  surface: '#FFFFFF',
  border: '#E2E8F0',
};

export default function SectionHeader({ 
  title, 
  subtitle, 
  icon,
  emoji,
  count,
  actionLabel, 
  onAction,
  style,
  gradient = false,
}) {
  return (
    <View style={[styles.container, style]}>
      {gradient && (
        <View style={styles.gradientBg}>
          <View style={[styles.gradientLine, { backgroundColor: COLORS.primary }]} />
        </View>
      )}
      
      <View style={styles.content}>
        <View style={styles.titleSection}>
          {(icon || emoji) && (
            <View style={styles.iconContainer}>
              {emoji ? (
                <Text style={styles.emoji}>{emoji}</Text>
              ) : (
                <Ionicons name={icon} size={24} color={COLORS.primary} />
              )}
            </View>
          )}
          
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>

        <View style={styles.actions}>
          {count !== undefined && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{count}</Text>
            </View>
          )}
          
          {actionLabel && onAction && (
            <TouchableOpacity style={styles.actionButton} onPress={onAction}>
              <Text style={styles.actionText}>{actionLabel}</Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    position: 'relative',
  },
  gradientBg: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 1,
  },
  gradientLine: {
    height: 3,
    width: '30%',
    borderRadius: 2,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(233, 30, 99, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emoji: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textTertiary,
    marginTop: 2,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countBadge: {
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  countText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
