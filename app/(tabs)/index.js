import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_BASE_URL } from '../../config';
import { useThemeColors } from '../../constants/Colors';
import { homeStyles } from '../../styles/HomeStyles';

export default function HomeScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const colors = useThemeColors();
  const router = useRouter();
  // Función para abrir la Modal de Login
  const abrirModalLogin = useCallback(() => {
    router.push('/modal');
  }, [router]);
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

  if (loading) {
    return (
      <SafeAreaView style={[homeStyles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />
        
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
          </View>
        </View>
        
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
          </View>
        </View>
        
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
        </View>
        <View style={{ position: 'absolute', right: 10, top: 10 }}> 
          <Button title="Login" onPress={abrirModalLogin} />
        </View>
      </View>

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