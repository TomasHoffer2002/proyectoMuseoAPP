import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  useColorScheme,
} from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

export default function HomeScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const colorScheme = useColorScheme(); // 'light' o 'dark'
  const isDark = colorScheme === 'dark';

  // Definir colores según el tema
  const colors = {
    background: isDark ? '#1a2332' : '#f8fafc',
    cardBackground: isDark ? '#2d3748' : '#ffffff',
    cardBorder: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    headerBorder: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    title: isDark ? '#ffffff' : '#1a2332',
    subtitle: isDark ? '#94a3b8' : '#64748b',
    category: isDark ? '#94a3b8' : '#64748b',
    accent: '#4ade80', // Verde siempre igual
    error: '#f87171',
    imagePlaceholder: isDark ? '#1a202c' : '#e2e8f0',
  };

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
    <TouchableOpacity style={[styles.card, { 
      backgroundColor: colors.cardBackground,
      borderColor: colors.cardBorder 
    }]}>
      <Image
        source={{ uri: `${API_BASE_URL}${item.imageUrl}` }}
        style={[styles.cardImage, { backgroundColor: colors.imagePlaceholder }]}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={[styles.category, { color: colors.category }]}>
          {item.category_label}
        </Text>
        <Text style={[styles.title, { color: colors.title }]}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar 
          barStyle={isDark ? 'light-content' : 'dark-content'} 
          backgroundColor={colors.background} 
        />
        {/* Header */}
        <View style={[styles.header, { 
          backgroundColor: colors.background,
          borderBottomColor: colors.headerBorder 
        }]}>
          <View style={styles.logoContainer}>
            <View style={[styles.logo, { backgroundColor: colors.accent }]}>
              <Text style={styles.logoText}>🏛️</Text>
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={[styles.headerTitle, { color: colors.title }]}>
                Museo de Ciencias Naturales
              </Text>
              <Text style={[styles.headerSubtitle, { color: colors.subtitle }]}>
                Catálogo Digital
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.subtitle }]}>
            Cargando colección...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar 
          barStyle={isDark ? 'light-content' : 'dark-content'} 
          backgroundColor={colors.background} 
        />
        {/* Header */}
        <View style={[styles.header, { 
          backgroundColor: colors.background,
          borderBottomColor: colors.headerBorder 
        }]}>
          <View style={styles.logoContainer}>
            <View style={[styles.logo, { backgroundColor: colors.accent }]}>
              <Text style={styles.logoText}>🏛️</Text>
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={[styles.headerTitle, { color: colors.title }]}>
                Museo de Ciencias Naturales
              </Text>
              <Text style={[styles.headerSubtitle, { color: colors.subtitle }]}>
                Catálogo Digital
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: colors.accent }]} 
            onPress={fetchItems}
          >
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={colors.background} 
      />
      
      {/* Header */}
      <View style={[styles.header, { 
        backgroundColor: colors.background,
        borderBottomColor: colors.headerBorder 
      }]}>
        <View style={styles.logoContainer}>
          <View style={[styles.logo, { backgroundColor: colors.accent }]}>
            <Text style={styles.logoText}>🏛️</Text>
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={[styles.headerTitle, { color: colors.title }]}>
              Museo de Ciencias Naturales
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.subtitle }]}>
              Catálogo Digital
            </Text>
          </View>
        </View>
      </View>

      {/* Grid de items */}
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 24,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  gridContainer: {
    padding: 12,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    borderRadius: 12,
    margin: 6,
    overflow: 'hidden',
    borderWidth: 1,
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  cardContent: {
    padding: 12,
  },
  category: {
    fontSize: 12,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#1a2332',
    fontSize: 16,
    fontWeight: '600',
  },
});