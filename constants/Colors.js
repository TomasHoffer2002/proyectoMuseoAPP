// constants/Colors.js
export const Colors = {
  light: {
    // para home
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
    // para busqueda
    searchBackground: '#ffffff',
    searchBorder: 'rgba(0, 0, 0, 0.15)',
    searchPlaceholder: '#94a3b8',
    searchIcon: '#64748b',
    filterButton: '#ffffff',
    filterButtonActive: '#4ade80',
    filterTextActive: '#1a2332',
    filterText: '#64748b',
    // requeridos por el template de Expo
    text: '#1a2332',
    tint: '#4ade80',
    tabIconDefault: '#687076',
    tabIconSelected: '#4ade80',
  },
  dark: {
    // para home
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
    //para busqueda
    searchBackground: '#2d3748',
    searchBorder: 'rgba(255, 255, 255, 0.15)',
    searchPlaceholder: '#64748b',
    searchIcon: '#94a3b8',
    filterButton: '#2d3748',
    filterButtonActive: '#4ade80',
    filterTextActive: '#1a2332',
    filterText: '#94a3b8',
    // requeridos por el template de Expo
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