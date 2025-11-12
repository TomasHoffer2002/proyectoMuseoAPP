import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from 'axios';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_BASE_URL } from '../../config';
import { useThemeColors } from '../../constants/Colors';
import { homeStyles } from '../../styles/HomeStyles';

// IMPORTACIONES DE AUTENTICACIÓN 
import { cerrarSesion, checkAuthStatus } from '../../services/login';

export default function HomeScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const colors = useThemeColors();
  const router = useRouter();

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
    router.push('/modal');
  }, [router]);

  // ----------------------------------------------------
  // LOGICA DE DATOS
  // ----------------------------------------------------

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/apiLogin/obtenerItems.php`);
      setItems(response.data);
      setError(null);
    } catch (err) {
      console.error('Error al obtener items:', err);
      setError('No se pudieron cargar los items del museo');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={[homeStyles.card, { 
      backgroundColor: colors.cardBackground,
      borderColor: colors.cardBorder 
    }]}>
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
    const iconSize = 24;
    if (isLoggedIn) {
      return (
        <TouchableOpacity onPress={handleLogout} hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
          <FontAwesome 
            name="sign-out" // Icono de Salida
            size={iconSize} 
            color={colors.error} // Rojo para acción destructiva
          />
        </TouchableOpacity>
      );
    }
    // Si no está logueado, muestra Login
    return (
      <TouchableOpacity onPress={abrirModalLogin} hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
        <FontAwesome 
          name="user-circle" // Icono de Perfil
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
          <Text style={homeStyles.logoText}>🏛️</Text>
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
      {HeaderView}
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={homeStyles.gridContainer}
        columnWrapperStyle={homeStyles.row}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}