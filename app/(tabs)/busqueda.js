import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../components/ThemeContext';
import { API_BASE_URL } from '../../config';
import { searchStyles } from '../../styles/SearchStyles';


export default function SearchScreen() {
  const [items, setItems] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {colors} = useTheme();
  const router = useRouter();
  // Estado para monedas
  const [coinNotification, setCoinNotification] = useState({
    visible: false,
    coins: 0,
    message: ''
  });
 

  useEffect(() => {
    fetchData();
    
  }, []);

  useEffect(() => {
    filterItems();
  }, [searchQuery, selectedCategory, items]);

  const handleItemPress = async (item) => {
    router.push(`/item/${item.id}`);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [itemsResponse, categoriasResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/apiLogin/obtenerItems.php`),
        axios.get(`${API_BASE_URL}/apiLogin/obtenerCategorias.php`)
      ]);
      
      setItems(itemsResponse.data);
      setCategorias(categoriasResponse.data);
      setFilteredItems(itemsResponse.data);
      setError(null);
    } catch (err) {
      console.error('Error al obtener datos:', err);
      setError('No se pudieron cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = items;

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category_label.toLowerCase().includes(query)
      );
    }

    // Filtrar por categoría
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category_value === selectedCategory);
    }

    setFilteredItems(filtered);
  };


  const toggleCategory = (categoryValue) => {
    setSelectedCategory(selectedCategory === categoryValue ? null : categoryValue);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={[searchStyles.card, { 
      backgroundColor: colors.cardBackground,
      borderColor: colors.cardBorder 
    }]}
      onPress={() => handleItemPress(item)}>
      <Image
        source={{ uri: `${API_BASE_URL}${item.imageUrl}` }}
        style={[searchStyles.cardImage, { backgroundColor: colors.imagePlaceholder }]}
        resizeMode="cover"
      />
      <View style={searchStyles.cardContent}>
        <Text style={[searchStyles.categoryText, { color: colors.category }]}>
          {item.category_label}
        </Text>
        <Text style={[searchStyles.titleText, { color: colors.title }]}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[searchStyles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />
        <View style={searchStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[searchStyles.loadingText, { color: colors.subtitle }]}>
            Cargando catálogo...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[searchStyles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />
        <View style={searchStyles.errorContainer}>
          <Text style={[searchStyles.errorText, { color: colors.error }]}>
            {error}
          </Text>
          <TouchableOpacity 
            style={[searchStyles.retryButton, { backgroundColor: colors.accent }]} 
            onPress={fetchData}
          >
            <Text style={searchStyles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[searchStyles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />
      
      {/* Sección de búsqueda y filtros */}
      <View style={searchStyles.searchSection}>
        {/* Barra de búsqueda */}
        <View style={[searchStyles.searchInputContainer, {
          backgroundColor: colors.searchBackground,
          borderColor: colors.searchBorder,
        }]}>
          {/* Ícono de búsqueda */}
          <FontAwesome 
            name="search" 
            size={18} 
            color={colors.searchIcon}
            style={searchStyles.searchIcon}
          />

          {/* Campo de texto */}
          <TextInput
            style={[searchStyles.searchInput, { color: colors.title }]}
            placeholder="Buscar en el catálogo..."
            placeholderTextColor={colors.searchPlaceholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* Botón QR */}
          <TouchableOpacity onPress={() => router.push("/scanner")}>
            <FontAwesome 
              name="qrcode" 
              size={22} 
              color={colors.searchIcon}
              style={{ marginLeft: 12 }}
            />
          </TouchableOpacity>
        </View>

        {/* Filtros por categoría */}
        <View style={searchStyles.filterSection}>
          <Text style={[searchStyles.filterTitle, { color: colors.title }]}>
            Filtrar por categoría
          </Text>
          <View style={searchStyles.filterContainer}>
            {categorias.map((categoria) => {
              const isActive = selectedCategory === categoria.value;
              return (
                <TouchableOpacity
                  key={categoria.value}
                  style={[
                    searchStyles.filterButton,
                    {
                      backgroundColor: isActive ? colors.filterButtonActive : colors.filterButton,
                      borderColor: isActive ? colors.filterButtonActive : colors.cardBorder,
                    }
                  ]}
                  onPress={() => toggleCategory(categoria.value)}
                >
                  <Text style={[
                    searchStyles.filterButtonText,
                    { color: isActive ? colors.filterTextActive : colors.filterText }
                  ]}>
                    {categoria.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* Resultados */}
      <View style={searchStyles.resultsSection}>
        <Text style={[searchStyles.resultsText, { color: colors.subtitle }]}>
          {filteredItems.length} resultado{filteredItems.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Grid de items */}
      {filteredItems.length > 0 ? (
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={searchStyles.gridContainer}
          columnWrapperStyle={searchStyles.row}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={searchStyles.emptyContainer}>
          <Text style={{ fontSize: 48 }}>🔍</Text>
          <Text style={[searchStyles.emptyText, { color: colors.subtitle }]}>
            No se encontraron resultados
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}