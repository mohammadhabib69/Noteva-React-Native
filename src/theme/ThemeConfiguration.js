// Theme Configuration for Noteva - Brutalist Minimalism Design System
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// ============================================
// COLORS - Brutalist High Contrast Palette
// ============================================
export const COLORS = {
  // Primary Accent
  primary: '#E53935',           // Vibrant Red
  primaryDark: '#C62828',       // Darker Red for pressed states
  
  // Background (OLED Optimized)
  background: '#000000',      // Pure OLED Black
  surface: '#0A0A0A',          // Card/Surface Dark
  surfaceElevated: '#1A1A1A',  // Elevated surfaces
  
  // Borders
  border: '#FFFFFF1A',         // Very subtle white border (10% opacity)
  borderStrong: '#FFFFFF33',   // Stronger border (20% opacity)
  
  // Text
  textPrimary: '#FFFFFF',      // Pure White
  textSecondary: '#A0A0A0',    // Muted Gray
  textTertiary: '#666666',     // Subtle Gray
  
  // Semantic
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#FF5252',
  
  // Pin Colors for folders/tags
  pinColors: [
    '#E53935', // Red
    '#FF9800', // Orange
    '#FFC107', // Amber
    '#4CAF50', // Green
    '#2196F3', // Blue
    '#9C27B0', // Purple
    '#E91E63', // Pink
    '#FFFFFF', // White
  ],
};

// ============================================
// TYPOGRAPHY - Mixed Serif/Sans System
// ============================================
export const FONTS = {
  // Display Serif (Vintage/Classic) - Playfair Display
  serif: {
    black: 'PlayfairDisplay-Black',     // 900 weight for titles
    extraBold: 'PlayfairDisplay-ExtraBold', // 800
    bold: 'PlayfairDisplay-Bold',       // 700
    regular: 'PlayfairDisplay-Regular', // 400
  },
  
  // Body Sans - Inter (Clean, Modern)
  sans: {
    regular: 'Inter-Regular',      // 400
    medium: 'Inter-Medium',        // 500
    semiBold: 'Inter-SemiBold',    // 600
    bold: 'Inter-Bold',            // 700
  },
  
  // Pixel Art Accent - Rubik Pixels
  pixel: 'RubikPixels-Regular',
  
  // Mono (for code/snippets)
  mono: {
    regular: 'SpaceMono-Regular',
    bold: 'SpaceMono-Bold',
  },
};

export const TYPOGRAPHY = {
  // Page Titles - Heavy Serif
  h1: {
    fontFamily: FONTS.serif.black,
    fontSize: 42,
    lineHeight: 42,          // Tight line height (1.0)
    letterSpacing: -1.5,   // Negative tracking
    color: COLORS.textPrimary,
  },
  
  // Section Headers
  h2: {
    fontFamily: FONTS.serif.extraBold,
    fontSize: 28,
    lineHeight: 28,
    letterSpacing: -0.5,
    color: COLORS.textPrimary,
  },
  
  // Card Titles
  h3: {
    fontFamily: FONTS.serif.bold,
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: -0.3,
    color: COLORS.textPrimary,
  },
  
  // Body Text - Clean Sans
  body: {
    fontFamily: FONTS.sans.regular,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
    color: COLORS.textSecondary,
  },
  
  // Body Large
  bodyLarge: {
    fontFamily: FONTS.sans.regular,
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: 0,
    color: COLORS.textPrimary,
  },
  
  // Labels/UI Text
  label: {
    fontFamily: FONTS.sans.semiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  
  // Pixel Accent (special decorative text)
  pixel: {
    fontFamily: FONTS.pixel,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 1,
    color: COLORS.primary,
  },
  
  // Mono for tags/code
  mono: {
    fontFamily: FONTS.mono.regular,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
    color: COLORS.textSecondary,
  },
};

// ============================================
// SPACING - 8px Base Grid
// ============================================
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// ============================================
// SHAPES - Extreme Rounded Corners
// ============================================
export const SHAPES = {
  // Extreme rounded corners (40px equivalent)
  extreme: 40,
  // Large rounded (cards)
  large: 32,
  // Medium (buttons, inputs)
  medium: 24,
  // Small (tags, pills)
  small: 16,
  // Pill (fully rounded)
  pill: 100,
};

// ============================================
// SHADOWS - Subtle elevation
// ============================================
export const SHADOWS = {
  small: {
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
};

// ============================================
// ANIMATION CONFIGS
// ============================================
export const ANIMATIONS = {
  // Spring config for card interactions
  spring: {
    type: 'spring',
    stiffness: 300,
    damping: 20,
    mass: 0.8,
  },
  // Gentle bounce
  bounce: {
    type: 'spring',
    stiffness: 400,
    damping: 15,
  },
  // Stagger timing for lists
  stagger: {
    delay: 50,
    duration: 300,
  },
};

// ============================================
// LAYOUT CONSTANTS
// ============================================
export const LAYOUT = {
  screenWidth: width,
  screenHeight: height,
  cardWidth: (width - 48) / 2, // For 2-column grid with 16px gaps
  maxContentWidth: 600,
  headerHeight: 80,
  fabSize: 72,
  bottomNavHeight: 80,
};

// ============================================
// EXPORT THEME OBJECT
// ============================================
export const Theme = {
  colors: COLORS,
  fonts: FONTS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  shapes: SHAPES,
  shadows: SHADOWS,
  animations: ANIMATIONS,
  layout: LAYOUT,
};

export default Theme;
