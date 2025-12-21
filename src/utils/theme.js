export const colors = {
  primary: '#ff1493',
  secondary: '#b0a0ff',
  background: '#0f0f1a',
  surface: '#220a40',
  surfaceLight: '#1a0f2e',
  text: '#ffffff',
  textSecondary: '#b0a0ff',
  textTertiary: '#888888',
  success: '#4ade80',
  warning: '#fbbf24',
  danger: '#ef4444',
  info: '#3b82f6',
};

export const typography = {
  fontSizeXS: 10,
  fontSizeSmall: 12,
  fontSizeBase: 14,
  fontSizeLarge: 16,
  fontSizeXL: 20,
  fontSize2XL: 28,
  fontWeightLight: '300',
  fontWeightNormal: '400',
  fontWeightMedium: '500',
  fontWeightBold: '700',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 };

export const borderRadius = { sm: 4, base: 8, md: 12, lg: 16, full: 9999 };

export const shadows = {
  small: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3, elevation: 2 },
  medium: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 4 },
  large: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 8 },
};

export const navigationConfig = {
  headerStyle: { backgroundColor: colors.background },
  headerTintColor: colors.primary,
  headerTitleStyle: { fontWeight: 'bold', fontSize: typography.fontSizeLarge },
  headerShown: true,
};

export const bottomTabNavigatorConfig = {
  tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.surface, borderTopWidth: 1 },
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.textTertiary,
};
