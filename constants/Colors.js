// constants/Colors.js
export const Colors = {
  light: {
    // Colores del museo
    background: '#f8fafc',
    cardBackground: '#ffffff',
    cardBorder: 'rgba(0, 0, 0, 0.1)',
    headerBorder: 'rgba(0, 0, 0, 0.1)',
    title: '#1a2332',
    subtitle: '#64748b',
    category: '#64748b',
    accent: '#4ade80',
    error: '#f87171',
    imagePlaceholder: '#e2e8f0',
    statusBar: 'dark-content',
    // Colores requeridos por el template de Expo
    text: '#1a2332',
    tint: '#4ade80',
    tabIconDefault: '#687076',
    tabIconSelected: '#4ade80',
  },
  dark: {
    // Colores del museo
    background: '#1a2332',
    cardBackground: '#2d3748',
    cardBorder: 'rgba(255, 255, 255, 0.1)',
    headerBorder: 'rgba(255, 255, 255, 0.1)',
    title: '#ffffff',
    subtitle: '#94a3b8',
    category: '#94a3b8',
    accent: '#4ade80',
    error: '#f87171',
    imagePlaceholder: '#1a202c',
    statusBar: 'light-content',
    // Colores requeridos por el template de Expo
    text: '#ECEDEE',
    tint: '#4ade80',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#4ade80',
  },
};

// Hook personalizado para obtener los colores según el tema
import { useColorScheme } from 'react-native';

export const useThemeColors = () => {
  const colorScheme = useColorScheme();
  return Colors[colorScheme === 'dark' ? 'dark' : 'light'];
};