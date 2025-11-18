import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from 'axios';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CoinNotification } from '../../components/molecules/CoinNotification';
import { CaruselApp } from '../../components/organisms/Carousel';
import { useTheme } from '../../components/ThemeContext';
import { API_BASE_URL } from '../../config';
import { CoinService } from '../../services/CoinService';
import { homeStyles } from '../../styles/HomeStyles';

// IMPORTACIONES DE AUTENTICACIÓN 
import { cerrarSesion, checkAuthStatus } from '../../services/login.js';

export default function HomeScreen() {
  const [items, setItems] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [regularItems, setRegularItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const {colors} = useTheme();
  const router = useRouter();
  //estados para manejo de monedas
  const [coinNotification, setCoinNotification] = useState({
    visible: false,
    coins: 0,
    message: ''
  });

  // ----------------------------------------------------
  // LOGICA DE AUTENTICACION
  // ----------------------------------------------------

  // Función para verificar el estado de autenticación (lee AsyncStorage)
  const checkLoginStatus = useCallback(async () => {
    const status = await checkAuthStatus();
    setIsLoggedIn(status);
  }, []);

  // 2. Hook para actualizar el estado cuando regresamos a esta pantalla (después de Login/Logout)
  useFocusEffect(
    useCallback(() => {
      checkLoginStatus();
    }, [checkLoginStatus])
  );

  // Manejador para cerrar sesión
  const handleLogout = useCallback(() => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar tu sesión actual?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sí, Cerrar Sesión", 
          onPress: async () => {
            await cerrarSesion();
            setIsLoggedIn(false); // Actualiza el estado local
          },
          style: 'destructive'
        }
      ]
    );
  }, []);

  // Función para abrir la Modal de Login
  const abrirModalLogin = useCallback(() => {
    router.push('/(modals)/loginModal');
  }, [router]);


  useEffect(() => {
    fetchItems();
  }, []);

  // Verificar login diario y otorgar monedas
  useEffect(() => {
    checkDailyReward();
  }, []);

  const checkDailyReward = async () => {
    const result = await CoinService.checkDailyLogin();
    if (result.earnedCoins) {
      setCoinNotification({
        visible: true,
        coins: result.coins,
        message: '¡Bienvenido! Recompensa diaria'
      });
    }
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/apiLogin/obtenerItems.php`);
      const allItems = response.data;
      const featured = allItems.filter(item => item.featured === true);
      const regular = allItems.filter(item => item.featured !== true);
      setItems(allItems);
      setFeaturedItems(featured);
      setRegularItems(regular);
      setError(null);

    } catch (err) {
      console.error('Error al obtener items:', err);
      setError('No se pudieron cargar los items del museo');
    } finally {
      setLoading(false);
    }
  };

  const handleItemPress = async (item) => {
    console.log('Item seleccionado:', item);
    // Otorgar monedas por ver el item
    const result = await CoinService.viewItem(item.id);
    if (result.earnedCoins) {
      setCoinNotification({
        visible: true,
        coins: result.coins,
        message: `Primera vez viendo: ${item.title}`
      });
    }
    router.push(`/item/${item.id}`);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[homeStyles.card, { 
        backgroundColor: colors.cardBackground,
        borderColor: colors.cardBorder 
      }]}
      onPress={() => handleItemPress(item)}
    >
      <Image
        source={{ uri: `${API_BASE_URL}${item.imageUrl}` }}
        style={[homeStyles.cardImage, { backgroundColor: colors.imagePlaceholder }]}
        resizeMode="cover"
      />
      <View style={homeStyles.cardContent}>
        <Text style={[homeStyles.category, { color: colors.category }]}>
          {item.category_label}
        </Text>
        <Text style={[homeStyles.title, { color: colors.title }]}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );


  // ******************************************************
  // RENDERIZADO CONDICIONAL
  // ******************************************************

  // Función para mostrar la cabecera (usada en loading, error y final)
  const renderLoginButton = () => {
    const iconSize = 29;
    if (isLoggedIn) {
      return (
        <TouchableOpacity onPress={handleLogout} hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
          <FontAwesome 
            name="sign-out" // Icono de Perfil
            size={iconSize} 
            color={colors.accent}
          />
        </TouchableOpacity>
      );
    }
    // Si no está logueado, muestra Login
    return (
      <TouchableOpacity onPress={abrirModalLogin} hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
        <FontAwesome 
          name="sign-in" 
          size={iconSize} 
          color={colors.accent} // Color principal
        />
      </TouchableOpacity>
    );
  };

  const HeaderView = (
    <View style={[homeStyles.header, { 
      backgroundColor: colors.background,
      borderBottomColor: colors.headerBorder 
    }]}>
      <View style={homeStyles.logoContainer}>
        <View style={[homeStyles.logo, { backgroundColor: colors.accent }]}>
          <Text style={homeStyles.logoText}>M</Text>
        </View>
        <View style={homeStyles.headerTextContainer}>
          <Text style={[homeStyles.headerTitle, { color: colors.title }]}>
            Museo de Ciencias Naturales
          </Text>
          <Text style={[homeStyles.headerSubtitle, { color: colors.subtitle }]}>
            Catálogo Digital
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 10, top: 10 }}> 
          {renderLoginButton()}
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[homeStyles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />
        
        {HeaderView}
        
        <View style={homeStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[homeStyles.loadingText, { color: colors.subtitle }]}>
            Cargando colección...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[homeStyles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />
        
        {HeaderView}
        
        <View style={homeStyles.errorContainer}>
          <Text style={[homeStyles.errorText, { color: colors.error }]}>
            {error}
          </Text>
          <TouchableOpacity 
            style={[homeStyles.retryButton, { backgroundColor: colors.accent }]} 
            onPress={fetchItems}
          >
            <Text style={homeStyles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
    
  return (
    <SafeAreaView style={[homeStyles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />
      {/* Notificación de monedas */}
      <CoinNotification
        visible={coinNotification.visible}
        coins={coinNotification.coins}
        message={coinNotification.message}
        onHide={() => setCoinNotification({ ...coinNotification, visible: false })}
      />

      {HeaderView}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Carrusel de items destacados (featured = true) */}
        {featuredItems.length > 0 && (
          <CaruselApp
            items={featuredItems}
            onItemPress={handleItemPress}
          />
        )}

        {/* Título de toda la colección */}
        {regularItems.length > 0 && (
          <View style={{ paddingHorizontal: 20, marginBottom: 12, marginTop: 8 }}>
            <Text style={[homeStyles.headerTitle, { color: colors.title, fontSize: 20 }]}>
                Otras colecciones
            </Text>
          </View>
        )}

        {/* Grid de items regulares (featured = false) */}
        <View style={[homeStyles.gridContainer, { flexDirection: 'row', flexWrap: 'wrap' }]}>
          {regularItems.map((item) => (
            <View key={item.id} style={{ width: '48%', marginBottom: 12 }}>
              {renderItem({ item })}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}