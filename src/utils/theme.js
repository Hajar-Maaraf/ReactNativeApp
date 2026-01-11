// Système de Design SweetBloom
// Constantes de thème centralisées pour un style cohérent dans l'application

export const COLORS = {
  // Couleurs primaires
  primary: '#E91E63',
  primaryLight: '#F8BBD9',
  primaryDark: '#C2185B',
  primarySoft: 'rgba(233, 30, 99, 0.1)',
  primaryMedium: 'rgba(233, 30, 99, 0.15)',
  
  // Couleurs secondaires / Catégories
  chocolate: '#8D6E63',
  chocolateLight: '#D7CCC8',
  cake: '#FF7043',
  cakeLight: '#FFCCBC',
  flower: '#E91E63',
  
  // Couleurs neutres
  background: '#FDF2F4',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  
  // Couleurs de texte
  textPrimary: '#2D3436',
  textSecondary: '#636E72',
  textTertiary: '#888888',
  textMuted: '#B2BEC3',
  textInverse: '#FFFFFF',
  
  // Couleurs de statut
  success: '#4CAF50',
  successLight: '#E8F5E9',
  warning: '#FF9800',
  warningLight: '#FFF3E0',
  error: '#F44336',
  errorLight: '#FFEBEE',
  info: '#2196F3',
  infoLight: '#E3F2FD',
  
  // Couleurs d'interface
  border: '#E8E8E8',
  borderLight: '#F0F0F0',
  divider: '#EEEEEE',
  placeholder: '#999999',
  disabled: '#BDBDBD',
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Points de dégradé
  gradientStart: '#E91E63',
  gradientEnd: '#FF6090',
  
  // Évaluation
  star: '#FFD700',
  starEmpty: '#E0E0E0',
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  primary: {
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryLarge: {
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 28,
  display: 34,
};

export const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

export const CATEGORIES = [
  { 
    id: 'all', 
    label: 'Tous', 
    icon: 'grid-outline', 
    color: COLORS.primary,
    emoji: '✨'
  },
  { 
    id: 'fleurs', 
    label: 'Fleurs', 
    icon: 'flower-outline', 
    color: COLORS.flower,
    emoji: '🌸'
  },
  { 
    id: 'chocolats', 
    label: 'Chocolats', 
    icon: 'cafe-outline', 
    color: COLORS.chocolate,
    emoji: '🍫'
  },
  { 
    id: 'gateaux', 
    label: 'Gâteaux', 
    icon: 'fast-food-outline', 
    color: COLORS.cake,
    emoji: '🎂'
  },
];

export const SORT_OPTIONS = [
  { id: 'default', label: 'Par défaut', icon: 'apps-outline' },
  { id: 'price_asc', label: 'Prix croissant', icon: 'arrow-up-outline' },
  { id: 'price_desc', label: 'Prix décroissant', icon: 'arrow-down-outline' },
  { id: 'name_asc', label: 'Nom A-Z', icon: 'text-outline' },
  { id: 'popular', label: 'Populaire', icon: 'flame-outline' },
];

export default {
  COLORS,
  SHADOWS,
  SPACING,
  RADIUS,
  FONT_SIZES,
  FONT_WEIGHTS,
  CATEGORIES,
  SORT_OPTIONS,
};
