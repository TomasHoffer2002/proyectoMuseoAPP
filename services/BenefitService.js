// services/BenefitService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const NIGHT_THEME_KEY = '@museum_night_theme';
const COLLECTOR_BADGE_KEY = '@museum_collector_badge';

export const BenefitService = {
  // Verificar si el tema nocturno está desbloqueado
  isNightThemeUnlocked: async () => {
    try {
      const unlocked = await AsyncStorage.getItem(NIGHT_THEME_KEY);
      return unlocked === 'true';
    } catch (error) {
      console.error('Error al verificar tema nocturno:', error);
      return false;
    }
  },

  // Desbloquear tema nocturno
  unlockNightTheme: async () => {
    try {
      await AsyncStorage.setItem(NIGHT_THEME_KEY, 'true');
      return true;
    } catch (error) {
      console.error('Error al desbloquear tema nocturno:', error);
      return false;
    }
  },

  // Verificar si la insignia de coleccionista está desbloqueada
  isCollectorBadgeUnlocked: async () => {
    try {
      const unlocked = await AsyncStorage.getItem(COLLECTOR_BADGE_KEY);
      return unlocked === 'true';
    } catch (error) {
      console.error('Error al verificar insignia:', error);
      return false;
    }
  },

  // Desbloquear insignia de coleccionista
  unlockCollectorBadge: async () => {
    try {
      await AsyncStorage.setItem(COLLECTOR_BADGE_KEY, 'true');
      return true;
    } catch (error) {
      console.error('Error al desbloquear insignia:', error);
      return false;
    }
  },

  // Obtener todos los beneficios desbloqueados
  getUnlockedBenefits: async () => {
    try {
      const nightTheme = await BenefitService.isNightThemeUnlocked();
      const collectorBadge = await BenefitService.isCollectorBadgeUnlocked();

      return {
        nightTheme,
        collectorBadge,
        totalUnlocked: (nightTheme ? 1 : 0) + (collectorBadge ? 1 : 0)
      };
    } catch (error) {
      console.error('Error al obtener beneficios:', error);
      return {
        nightTheme: false,
        collectorBadge: false,
        totalUnlocked: 0
      };
    }
  },

  // Definición de beneficios disponibles
  availableBenefits: [
    {
      id: 'night_theme',
      name: 'Modo Nocturno del Museo',
      description: 'Tema especial con colores violetas y morados',
      icon: '🌙',
      cost: 100,
      unlockKey: NIGHT_THEME_KEY
    },
    {
      id: 'collector_badge',
      name: 'Insignia de Coleccionista',
      description: 'Insignia especial que aparece sobre tu foto de perfil',
      icon: '🏅​',
      cost: 200,
      unlockKey: COLLECTOR_BADGE_KEY
    },
    {
      id: 'visor_3d',
      name: 'Visor 3D Avanzado',
      description: 'Permite ver imagenes de las muestras en 3D',
      icon: '🥽',
      cost: 1000,
      unlockKey: COLLECTOR_BADGE_KEY
    }
  ]
};