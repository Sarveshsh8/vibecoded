export const theme = {
  colors: {
    // Primary gradients
    primary: '#6366F1',
    primaryLight: '#8B5CF6',
    secondary: '#EC4899',
    secondaryLight: '#F97316',
    
    // Status colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Background colors
    background: '#FAFAFA',
    surface: '#FFFFFF',
    surfaceVariant: '#F8FAFC',
    
    // Text colors
    onBackground: '#111827',
    onSurface: '#374151',
    onSurfaceVariant: '#6B7280',
    onPrimary: '#FFFFFF',
    
    // Border and shadow
    outline: '#E5E7EB',
    shadow: '#000000',
    
    // Priority colors
    priorityHigh: '#EF4444',
    priorityMedium: '#F59E0B',
    priorityLow: '#10B981',
    
    // Category colors
    categoryWork: '#3B82F6',
    categoryPersonal: '#EC4899',
    categoryHealth: '#10B981',
    categoryLearning: '#8B5CF6',
    categoryOther: '#6B7280',
  },
  
  gradients: {
    primary: ['#6366F1', '#8B5CF6'],
    secondary: ['#EC4899', '#F97316'],
    success: ['#10B981', '#059669'],
    warning: ['#F59E0B', '#D97706'],
    error: ['#EF4444', '#DC2626'],
    surface: ['#FFFFFF', '#F8FAFC'],
    glass: ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)'],
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
  
  elevation: {
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12,
  },
  
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700',
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 24,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
    },
  },
};