import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const COLORS = {
  primary: '#E91E63',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  neutral: '#636E72',
};

export default function Badge({
  value,
  variant = 'primary', // primaire, succès, avertissement, erreur, info, neutre
  size = 'medium', // petit, moyen, grand
  dot = false,
  maxValue = 99,
  style,
}) {
  const getColor = () => {
    return COLORS[variant] || COLORS.primary;
  };

  const getSizeStyles = () => {
    if (dot) {
      switch (size) {
        case 'small': return { width: 8, height: 8, borderRadius: 4 };
        case 'large': return { width: 14, height: 14, borderRadius: 7 };
        default: return { width: 10, height: 10, borderRadius: 5 };
      }
    }
    
    switch (size) {
      case 'small':
        return {
          minWidth: 16,
          height: 16,
          borderRadius: 8,
          paddingHorizontal: 4,
          fontSize: 10,
        };
      case 'large':
        return {
          minWidth: 24,
          height: 24,
          borderRadius: 12,
          paddingHorizontal: 8,
          fontSize: 14,
        };
      default:
        return {
          minWidth: 20,
          height: 20,
          borderRadius: 10,
          paddingHorizontal: 6,
          fontSize: 12,
        };
    }
  };

  const color = getColor();
  const sizeStyles = getSizeStyles();

  if (dot) {
    return (
      <View 
        style={[
          styles.dot,
          { backgroundColor: color },
          sizeStyles,
          style,
        ]} 
      />
    );
  }

  const displayValue = value > maxValue ? `${maxValue}+` : value;

  if (!value || value === 0) return null;

  return (
    <View 
      style={[
        styles.badge,
        {
          backgroundColor: color,
          minWidth: sizeStyles.minWidth,
          height: sizeStyles.height,
          borderRadius: sizeStyles.borderRadius,
          paddingHorizontal: sizeStyles.paddingHorizontal,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { fontSize: sizeStyles.fontSize }]}>
        {displayValue}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
  dot: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
