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
    primary: '#4ade80',
    secondary: '#687076',
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
    primary: '#0b913cff',
    secondary: '#687076',
  },
  //tema especial para los que canjean sus puntos
  night: {
    background: '#1a0a2e',
    cardBackground: '#2d1b4e',
    cardBorder: 'rgba(138, 43, 226, 0.3)',
    headerBorder: 'rgba(138, 43, 226, 0.3)',
    title: '#ffffff',
    subtitle: '#b19cd9',
    category: '#b19cd9',
    accent: '#8a2be2',
    error: '#ff6b9d',
    imagePlaceholder: '#1a0a2e',
    statusBar: 'light-content',
    searchBackground: '#2d1b4e',
    searchBorder: 'rgba(138, 43, 226, 0.3)',
    searchPlaceholder: '#b19cd9',
    searchIcon: '#b19cd9',
    filterButton: '#2d1b4e',
    filterButtonActive: '#8a2be2',
    filterTextActive: '#ffffff',
    filterText: '#b19cd9',
    text: '#e0b0ff',
    tint: '#8a2be2',
    tabIconDefault: '#b19cd9',
    tabIconSelected: '#8a2be2',
    primary: '#8a2be2',
    secondary: '#b19cd9',
  },
};

import { useColorScheme } from 'react-native';

export const useThemeColors = () => {
  const colorScheme = useColorScheme();
  return Colors[colorScheme === 'dark' ? 'dark' : 'light'];
};
// funcion para obtener tema personalizado
export const getCustomTheme = (themeName) => {
  return Colors[themeName] || Colors.light;
};