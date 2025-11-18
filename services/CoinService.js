import AsyncStorage from '@react-native-async-storage/async-storage';

const COINS_KEY = '@museum_coins';
const LAST_LOGIN_KEY = '@museum_last_login';
const VIEWED_ITEMS_KEY = '@museum_viewed_items';

export const CoinService = {
  // Obtener monedas actuales
  getCoins: async () => {
    try {
      const coins = await AsyncStorage.getItem(COINS_KEY);
      return coins ? parseInt(coins, 10) : 0;
    } catch (error) {
      console.error('Error al obtener monedas:', error);
      return 0;
    }
  },

  // Agregar monedas
  addCoins: async (amount) => {
    try {
      const currentCoins = await CoinService.getCoins();
      const newCoins = currentCoins + amount;
      await AsyncStorage.setItem(COINS_KEY, newCoins.toString());
      return newCoins;
    } catch (error) {
      console.error('Error al agregar monedas:', error);
      return null;
    }
  },

  // Restar monedas (para canjear)
  subtractCoins: async (amount) => {
    try {
      const currentCoins = await CoinService.getCoins();
      if (currentCoins >= amount) {
        const newCoins = currentCoins - amount;
        await AsyncStorage.setItem(COINS_KEY, newCoins.toString());
        return newCoins;
      }
      return null; // No hay suficientes monedas
    } catch (error) {
      console.error('Error al restar monedas:', error);
      return null;
    }
  },

  // Verificar y otorgar monedas por login diario
  checkDailyLogin: async () => {
    try {
      const today = new Date().toDateString();
      const lastLogin = await AsyncStorage.getItem(LAST_LOGIN_KEY);

      if (lastLogin !== today) {
        // Es otro dia al de hoy, por lo que se le entregan las monedas +10
        await AsyncStorage.setItem(LAST_LOGIN_KEY, today);
        const newCoins = await CoinService.addCoins(10);
        return {
          earnedCoins: true,
          coins: 100,
          totalCoins: newCoins
        };
      }

      return {
        earnedCoins: false,
        coins: 0,
        totalCoins: await CoinService.getCoins()
      };
    } catch (error) {
      console.error('Error al verificar login diario:', error);
      return {
        earnedCoins: false,
        coins: 0,
        totalCoins: 0
      };
    }
  },

  // Marcar item como visto y otorgar monedas
  viewItem: async (itemId) => {
    try {
      const viewedItemsStr = await AsyncStorage.getItem(VIEWED_ITEMS_KEY);
      const viewedItems = viewedItemsStr ? JSON.parse(viewedItemsStr) : [];

      // Verificar si el item ya fue visto
      if (!viewedItems.includes(itemId)) {
        viewedItems.push(itemId);
        await AsyncStorage.setItem(VIEWED_ITEMS_KEY, JSON.stringify(viewedItems));
        
        // Otorgar monedas
        const newCoins = await CoinService.addCoins(5);
        return {
          earnedCoins: true,
          coins: 50,
          totalCoins: newCoins,
          isFirstView: true
        };
      }

      return {
        earnedCoins: false,
        coins: 0,
        totalCoins: await CoinService.getCoins(),
        isFirstView: false
      };
    } catch (error) {
      console.error('Error al marcar item como visto:', error);
      return {
        earnedCoins: false,
        coins: 0,
        totalCoins: 0,
        isFirstView: false
      };
    }
  },

  // Obtener estadísticas
  getStats: async () => {
    try {
      const coins = await CoinService.getCoins();
      const viewedItemsStr = await AsyncStorage.getItem(VIEWED_ITEMS_KEY);
      const viewedItems = viewedItemsStr ? JSON.parse(viewedItemsStr) : [];
      
      return {
        totalCoins: coins,
        itemsViewed: viewedItems.length,
        viewedItemIds: viewedItems
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return {
        totalCoins: 0,
        itemsViewed: 0,
        viewedItemIds: []
      };
    }
  },

  // Reiniciar todo lo del usuario, por si se quiere resetear
  resetAll: async () => {
    try {
      await AsyncStorage.multiRemove([COINS_KEY, LAST_LOGIN_KEY, VIEWED_ITEMS_KEY]);
      return true;
    } catch (error) {
      console.error('Error al reiniciar:', error);
      return false;
    }
  }
};