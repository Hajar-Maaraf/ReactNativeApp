import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#E91E63',
  primaryDark: '#C2185B',
  secondary: '#8D6E63',
  success: '#4CAF50',
  warning: '#FF9800',
  danger: '#F44336',
  white: '#FFFFFF',
  disabled: '#BDBDBD',
  disabledBg: '#F5F5F5',
};

export default function Button({ 
  title, 
  onPress, 
  style, 
  textStyle,
  variant = 'primary', // primaire, secondaire, contour, fantôme
  size = 'medium', // petit, moyen, grand
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
}) {
  const getVariantStyles = () => {
    if (disabled) {
      return {
        container: { backgroundColor: COLORS.disabledBg },
        text: { color: COLORS.disabled },
      };
    }

    switch (variant) {
      case 'secondary':
        return {
          container: { backgroundColor: COLORS.secondary },
          text: { color: COLORS.white },
        };
      case 'outline':
        return {
          container: { 
            backgroundColor: 'transparent', 
            borderWidth: 2, 
            borderColor: COLORS.primary 
          },
          text: { color: COLORS.primary },
        };
      case 'ghost':
        return {
          container: { backgroundColor: 'transparent' },
          text: { color: COLORS.primary },
        };
      case 'success':
        return {
          container: { backgroundColor: COLORS.success },
          text: { color: COLORS.white },
        };
      case 'danger':
        return {
          container: { backgroundColor: COLORS.danger },
          text: { color: COLORS.white },
        };
      default: // primaire
        return {
          container: { backgroundColor: COLORS.primary },
          text: { color: COLORS.white },
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: { paddingVertical: 8, paddingHorizontal: 16 },
          text: { fontSize: 13 },
          icon: 16,
        };
      case 'large':
        return {
          container: { paddingVertical: 16, paddingHorizontal: 28 },
          text: { fontSize: 17 },
          icon: 22,
        };
      default: // moyen
        return {
          container: { paddingVertical: 12, paddingHorizontal: 22 },
          text: { fontSize: 15 },
          icon: 18,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const iconColor = disabled ? COLORS.disabled : variantStyles.text.color;

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.btn,
        variantStyles.container,
        sizeStyles.container,
        fullWidth && styles.fullWidth,
        pressed && !disabled && styles.pressed,
        style,
      ]} 
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={iconColor} />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <Ionicons name={icon} size={sizeStyles.icon} color={iconColor} style={styles.iconLeft} />
          )}
          <Text style={[styles.text, variantStyles.text, sizeStyles.text, textStyle]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons name={icon} size={sizeStyles.icon} color={iconColor} style={styles.iconRight} />
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
