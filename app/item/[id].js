import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  View,
  //Modal,
  Pressable
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../components/ThemeContext';
import { API_BASE_URL } from '../../config';
import { itemDetailStyles } from '../../styles/ItemDetailStyles';
import CommentInput from '../../components/CommentInput';
import ImageViewing from 'react-native-image-viewing';

const { width, height } = Dimensions.get('window');

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();
  
  const [item, setItem] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  // Estados para el carrusel y modal
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [fullScreenVisible, setFullScreenVisible] = useState(false);

  useEffect(() => {
    if (id) {
      fetchItemDetail();
      fetchComments();
    }
  }, [id]);

  const fetchItemDetail = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/apiLogin/obtenerItemsDetalle.php?id=${id}`);
      setItem(response.data);
    } catch (error) {
      console.error('Error al cargar item:', error);
    } finally {
      setLoading(false);
    }   
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/apiLogin/obtener_comentarios_publicos.php?id=${id}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
    }
  };

  // Función para abrir el visor
  const openFullScreen = (index) => {
    setActiveImageIndex(index);
    setFullScreenVisible(true);
  };

  const BtnReturn = () => {
    return (
        <TouchableOpacity
            style={{
                position: 'absolute',
                top: 30,
                left: 10,
                zIndex: 10,
                backgroundColor: colors.cardBackground,
                width: 50,
                height: 50,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5,
            }}
            onPress={() => router.back()}
        >
            <Ionicons name="arrow-back" size={24} color={colors.title} />
        </TouchableOpacity>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={[itemDetailStyles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />
        <BtnReturn />
        <View style={itemDetailStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[itemDetailStyles.loadingText, { color: colors.subtitle }]}>
            Cargando detalle...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView style={[itemDetailStyles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />
        <BtnReturn />
        <View style={itemDetailStyles.loadingContainer}>
          <Text style={{ color: colors.error }}>Item no encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Combinar imagen principal con imágenes adicionales
 const allImages = [item.imageUrl, ...(item.images || [])];
  //array de imágenes para el Visor
 const imagesForViewer = allImages.map(img => ({
    uri: `${API_BASE_URL}${img}`
  }));
  

  return (
    <SafeAreaView style={[itemDetailStyles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />
      <BtnReturn />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Carrusel Principal (Pequeño) */}
          <View style={itemDetailStyles.carouselContainer}>
            <Carousel
              loop={false}
              width={width}
              height={350}
              data={allImages}
              onSnapToItem={(index) => setActiveImageIndex(index)}
              renderItem={({ item: imageUrl, index }) => (
                <Pressable 
                  onPress={() => openFullScreen(index)} 
                  style={itemDetailStyles.imageWrapper}
                >
                  <Image
                    source={{ uri: `${API_BASE_URL}${imageUrl}` }}
                    style={[itemDetailStyles.image, { backgroundColor: colors.imagePlaceholder }]}
                    resizeMode="cover"
                  />
                </Pressable>
              )}
            />
            
            {/* Indicadores */}
            <View style={itemDetailStyles.imageDots}>
              {allImages.map((_, index) => (
                <View
                  key={index}
                  style={[
                    itemDetailStyles.dot,
                    {
                      backgroundColor: index === activeImageIndex ? colors.accent : colors.subtitle,
                      opacity: index === activeImageIndex ? 1 : 0.3,
                    }
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Info del Item */}
          <View style={itemDetailStyles.content}>
            <View style={[itemDetailStyles.badge, { backgroundColor: colors.accent }]}>
              <Text style={[itemDetailStyles.badgeText, { color: '#1a2332' }]}>
                {item.category_label}
              </Text>
            </View>

            <Text style={[itemDetailStyles.title, { color: colors.title }]}>
              {item.title}
            </Text>

            <Text style={[itemDetailStyles.description, { color: colors.subtitle }]}>
              {item.description}
            </Text>

            {item.longDescription && (
              <Text style={[itemDetailStyles.longDescription, { color: colors.title }]}>
                {item.longDescription}
              </Text>
            )}

            <View style={itemDetailStyles.infoSection}>
              <Text style={[itemDetailStyles.sectionTitle, { color: colors.title }]}>
                📋 Información del Espécimen
              </Text>
              <View style={[itemDetailStyles.infoCard, { backgroundColor: colors.cardBackground }]}>
                {item.period && (
                  <View style={itemDetailStyles.infoRow}>
                    <Text style={[itemDetailStyles.infoLabel, { color: colors.subtitle }]}>Período:</Text>
                    <Text style={[itemDetailStyles.infoValue, { color: colors.title }]}>{item.period}</Text>
                  </View>
                )}
                {item.discoveryDate && (
                  <View style={itemDetailStyles.infoRow}>
                    <Text style={[itemDetailStyles.infoLabel, { color: colors.subtitle }]}>Descubrimiento:</Text>
                    <Text style={[itemDetailStyles.infoValue, { color: colors.title }]}>{item.discoveryDate}</Text>
                  </View>
                )}
                {item.location && (
                  <View style={itemDetailStyles.infoRow}>
                    <Text style={[itemDetailStyles.infoLabel, { color: colors.subtitle }]}>Ubicación:</Text>
                    <Text style={[itemDetailStyles.infoValue, { color: colors.title }]}>{item.location}</Text>
                  </View>
                )}
                {item.dimensions && (
                  <View style={itemDetailStyles.infoRow}>
                    <Text style={[itemDetailStyles.infoLabel, { color: colors.subtitle }]}>Dimensiones:</Text>
                    <Text style={[itemDetailStyles.infoValue, { color: colors.title }]}>{item.dimensions}</Text>
                  </View>
                )}
                {item.weight && (
                  <View style={itemDetailStyles.infoRow}>
                    <Text style={[itemDetailStyles.infoLabel, { color: colors.subtitle }]}>Peso:</Text>
                    <Text style={[itemDetailStyles.infoValue, { color: colors.title }]}>{item.weight}</Text>
                  </View>
                )}
              </View>
            </View>

            {item.tags && item.tags.length > 0 && (
              <View style={itemDetailStyles.tagsContainer}>
                {item.tags.map((tag, index) => (
                  <View
                    key={index}
                    style={[itemDetailStyles.tag, {
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.accent
                    }]}
                  >
                    <Text style={[itemDetailStyles.tagText, { color: colors.accent }]}>
                      #{tag}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Comentarios */}
            <View style={itemDetailStyles.commentsSection}>
              <Text style={[itemDetailStyles.sectionTitle, { color: colors.title }]}>
                💬 Comentarios ({comments.length})
              </Text>

              <CommentInput itemId={id} onCommentSent={fetchComments} />

              {comments.length > 0 ? (
                comments.map((comment) => (
                  <View
                    key={comment.id}
                    style={[itemDetailStyles.commentCard, { backgroundColor: colors.cardBackground }]}
                  >
                    <View style={itemDetailStyles.commentHeader}>
                      <Text style={[itemDetailStyles.commentAuthor, { color: colors.title }]}
                        numberOfLines={1} 
                        ellipsizeMode="tail"
                      >
                        {comment.autor_usuario}
                      </Text>
                      <Text style={[itemDetailStyles.commentDate, { color: colors.subtitle }]}>
                        {formatDate(comment.fecha)}
                      </Text>
                    </View>
                    <Text style={[itemDetailStyles.commentContent, { color: colors.subtitle }]}>
                      {comment.contenido}
                    </Text>
                  </View>
                ))
              ) : (
                <View style={itemDetailStyles.emptyComments}>
                  <Text style={{ fontSize: 32 }}>💭</Text>
                  <Text style={[itemDetailStyles.emptyCommentsText, { color: colors.subtitle }]}>
                    Sé el primero en comentar
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* --- VISOR DE IMÁGENES CON ZOOM --- */}
      <ImageViewing
        images={imagesForViewer}
        imageIndex={activeImageIndex}
        visible={fullScreenVisible}
        onRequestClose={() => setFullScreenVisible(false)}
        swipeToCloseEnabled={true} // Cerrar deslizando hacia abajo
        doubleTapToZoomEnabled={true} // Zoom con doble toque
      />

    </SafeAreaView>
  );
}