// Enhanced Professional Design System
// Updated with refined colors, gradients, and spacing

export const COLORS = {
  // Primary Brand Colors
  primary: '#E91E63',
  primaryLight: '#F8BBD9',
  primaryDark: '#C2185B',
  primaryUltraLight: '#FFF5F7',
  primarySoft: 'rgba(233, 30, 99, 0.08)',
  primaryMedium: 'rgba(233, 30, 99, 0.12)',
  primaryStrong: 'rgba(233, 30, 99, 0.18)',
  
  // Gradient Colors
  gradientStart: '#FF6B9D',
  gradientEnd: '#C2185B',
  gradientLight: '#FFE5ED',
  
  // Secondary / Category Colors
  chocolate: '#8D6E63',
  chocolateLight: '#D7CCC8',
  chocolateSoft: 'rgba(141, 110, 99, 0.1)',
  
  cake: '#FF7043',
  cakeLight: '#FFCCBC',
  cakeSoft: 'rgba(255, 112, 67, 0.1)',
  
  flower: '#E91E63',
  flowerLight: '#F8BBD9',
  flowerSoft: 'rgba(233, 30, 99, 0.1)',
  
  // Neutral Colors
  background: '#FAFBFC',
  backgroundPink: '#FDF2F4',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceHover: '#F5F5F5',
  
  // Text Colors
  textPrimary: '#1A1F36',
  textSecondary: '#4A5568',
  textTertiary: '#718096',
  textMuted: '#A0AEC0',
  textInverse: '#FFFFFF',
  textDisabled: '#CBD5E0',
  
  // Status Colors
  success: '#48BB78',
  successLight: '#C6F6D5',
  successSoft: 'rgba(72, 187, 120, 0.1)',
  
  warning: '#ED8936',
  warningLight: '#FEEBC8',
  warningSoft: 'rgba(237, 137, 54, 0.1)',
  
  error: '#F56565',
  errorLight: '#FED7D7',
  errorSoft: 'rgba(245, 101, 101, 0.1)',
  
  info: '#4299E1',
  infoLight: '#BEE3F8',
  infoSoft: 'rgba(66, 153, 225, 0.1)',
  
  // UI Element Colors
  border: '#E2E8F0',
  borderLight: '#EDF2F7',
  borderMedium: '#CBD5E0',
  divider: '#F7FAFC',
  placeholder: '#A0AEC0',
  disabled: '#CBD5E0',
  overlay: 'rgba(0, 0, 0, 0.6)',
  overlayLight: 'rgba(0, 0, 0, 0.4)',
  
  // Special Colors
  star: '#FFC107',
  starEmpty: '#E2E8F0',
  badge: '#F56565',
  highlight: '#FEF9C3',
};

export const GRADIENTS = {
  primary: ['#FF6B9D', '#E91E63', '#C2185B'],
  secondary: ['#FFE5ED', '#FFF5F7', '#FFFFFF'],
  card: ['#FFFFFF', '#FAFBFC'],
  overlay: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)'],
};

export const SHADOWS = {
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  small: {
    shadowColor: '#1A1F36',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: '#1A1F36',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  large: {
    shadowColor: '#1A1F36',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  xl: {
    shadowColor: '#1A1F36',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 28,
    elevation: 12,
  },
  primary: {
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryLarge: {
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  card: {
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
};

export const SPACING = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 48,
};

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  huge: 32,
  full: 9999,
};

export const FONT_SIZES = {
  xxs: 10,
  xs: 11,
  sm: 12,
  md: 14,
  base: 15,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  huge: 28,
  massive: 34,
  display: 40,
};

export const FONT_WEIGHTS = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
};

export const LINE_HEIGHTS = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
};

export const LETTER_SPACING = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
};

export const CATEGORIES = [
  { 
    id: 'all', 
    label: 'Tous', 
    icon: 'grid-outline', 
    color: COLORS.primary,
    bgColor: COLORS.primarySoft,
    emoji: '✨'
  },
  { 
    id: 'fleurs', 
    label: 'Fleurs', 
    icon: 'flower-outline', 
    color: COLORS.flower,
    bgColor: COLORS.flowerSoft,
    emoji: '🌸'
  },
  { 
    id: 'chocolats', 
    label: 'Chocolats', 
    icon: 'cafe-outline', 
    color: COLORS.chocolate,
    bgColor: COLORS.chocolateSoft,
    emoji: '🍫'
  },
  { 
    id: 'gateaux', 
    label: 'Gâteaux', 
    icon: 'fast-food-outline', 
    color: COLORS.cake,
    bgColor: COLORS.cakeSoft,
    emoji: '🎂'
  },
];

export const SORT_OPTIONS = [
  { id: 'default', label: 'Par défaut', icon: 'apps-outline' },
  { id: 'price_asc', label: 'Prix croissant', icon: 'arrow-up-outline' },
  { id: 'price_desc', label: 'Prix décroissant', icon: 'arrow-down-outline' },
  { id: 'name_asc', label: 'Nom A-Z', icon: 'text-outline' },
  { id: 'popular', label: 'Populaire', icon: 'flame-outline' },
  { id: 'newest', label: 'Nouveautés', icon: 'sparkles-outline' },
];

export const ANIMATIONS = {
  fast: 200,
  normal: 300,
  slow: 500,
  slower: 700,
};

export const LAYOUT = {
  maxWidth: 1200,
  headerHeight: 120,
  tabBarHeight: 60,
  cardPadding: 16,
};

export default {
  COLORS,
  GRADIENTS,
  SHADOWS,
  SPACING,
  RADIUS,
  FONT_SIZES,
  FONT_WEIGHTS,
  LINE_HEIGHTS,
  LETTER_SPACING,
  CATEGORIES,
  SORT_OPTIONS,
  ANIMATIONS,
  LAYOUT,
};
