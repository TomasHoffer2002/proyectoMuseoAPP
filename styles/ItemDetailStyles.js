import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const itemDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Carrusel de imágenes
  carouselContainer: {
    height: 350,
    marginBottom: 16,
  },
  imageWrapper: {
    width,
    height: 350,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  // Contenido
  content: {
    paddingHorizontal: 20,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 34,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  longDescription: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  // Info del espécimen
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    width: 120,
  },
  infoValue: {
    fontSize: 14,
    flex: 1,
  },
  // Tags
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  // Comentarios
  commentsSection: {
    marginBottom: 80,
  },
  commentCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  commentDate: {
    fontSize: 12,
  },
  commentContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyComments: {
    alignItems: 'center',
    padding: 32,
  },
  emptyCommentsText: {
    fontSize: 14,
    marginTop: 8,
  },
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  // Input de Comentarios
  inputSection: {
    marginTop: 10,
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  textInput: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    paddingTop: 12, 
    fontSize: 14,
    minHeight: 50,
    maxHeight: 100,
    borderWidth: 1,
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Modal Pantalla Completa
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50, // Ajustado para evitar el notch/isla dinámica
    right: 20,
    zIndex: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20,
  },
  fullscreenImageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
});