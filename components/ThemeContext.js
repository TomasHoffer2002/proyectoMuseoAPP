// contexts/ThemeContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { Colors, getCustomTheme } from '../constants/Colors';

const ACTIVE_THEME_KEY = '@museum_active_theme';

const ThemeContext = createContext();

export const MuseumThemeProvider = ({ children }) => { // ← Cambiar nombre aquí
  const systemColorScheme = useColorScheme();
  const [activeTheme, setActiveTheme] = useState(systemColorScheme || 'light');
  const [loading, setLoading] = useState(true);

  // Cargar tema guardado al iniciar
  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(ACTIVE_THEME_KEY);
      if (savedTheme) {
        setActiveTheme(savedTheme);
      }
    } catch (error) {
      console.error('Error al cargar tema:', error);
    } finally {
      setLoading(false);
    }
  };

  const setTheme = async (themeName) => {
    try {
      await AsyncStorage.setItem(ACTIVE_THEME_KEY, themeName);
      setActiveTheme(themeName);
    } catch (error) {
      console.error('Error al guardar tema:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = activeTheme === 'night' ? (systemColorScheme || 'light') : 'night';
    await setTheme(newTheme);
  };

  // Obtener colores según el tema activo
  const getColors = () => {
    if (activeTheme === 'night') {
      return getCustomTheme('night');
    }
    return Colors[systemColorScheme === 'dark' ? 'dark' : 'light'];
  };

  const colors = getColors();

  const value = {
    activeTheme,
    colors,
    setTheme,
    toggleTheme,
    loading
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar el tema
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de ThemeProvider');
  }
  return context;
};