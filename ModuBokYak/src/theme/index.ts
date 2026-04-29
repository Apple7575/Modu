export const colors = {
  primary: '#1D4ED8',
  primaryLight: '#3B82F6',
  primaryDark: '#1A3F7F',
  secondary: '#059669',
  accent: '#4A9B7F',
  background: '#EEF2F7',
  surface: '#FFFFFF',
  text: {
    primary: '#1A2940',
    secondary: '#5A7090',
    hint: '#94A3B8',
    white: '#FFFFFF',
  },
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    purple: '#8B5CF6',
    orange: '#F97316',
  },
  border: '#DDE3EE',
  borderLight: '#F1F5F9',
  overlay: 'rgba(29, 78, 216, 0.08)',
};

export const shadows = {
  card: {
    shadowColor: '#1A2940',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  elevated: {
    shadowColor: '#1D4ED8',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 8,
  },
  button: {
    shadowColor: '#1D4ED8',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const typography = {
  h1: {fontSize: 26, fontWeight: '800' as const, letterSpacing: -0.5},
  h2: {fontSize: 20, fontWeight: '700' as const, letterSpacing: -0.3},
  h3: {fontSize: 17, fontWeight: '600' as const},
  body: {fontSize: 15, fontWeight: '400' as const, lineHeight: 22},
  bodyBold: {fontSize: 15, fontWeight: '600' as const},
  small: {fontSize: 13, fontWeight: '400' as const},
  smallBold: {fontSize: 13, fontWeight: '600' as const},
  caption: {fontSize: 12, fontWeight: '400' as const},
};
