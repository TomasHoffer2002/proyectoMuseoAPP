import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../components/ThemeContext'; 
import { API_BASE_URL } from '../config';
import { itemDetailStyles } from '../styles/ItemDetailStyles';


export default function CommentInput({ itemId, onCommentSent }) {
  const { colors } = useTheme();
  const [commentText, setCommentText] = useState('');
  const [sending, setSending] = useState(false);
  // Configuración de la animación
  // fadeAnim empieza en 0 (invisible)
  const fadeAnim = useRef(new Animated.Value(0)).current; 
  const [message, setMessage] = useState('');
  

  // Función para ejecutar la animación de mensaje éxito
  const showSuccessMessage = () => {
    setMessage('¡Comentario enviado! Pendiente de moderación.');
    
    Animated.sequence([
      // Aparecer 500ms
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      // Esperar
      Animated.delay(4000),
      // Desaparecer
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handleSend = async () => {
    if (!commentText.trim()) {
      Alert.alert('Error', 'El comentario no puede estar vacío.');
      return;
    }

    try {
      setSending(true);

      const userId = await AsyncStorage.getItem('userId'); 
      
      if (!userId) {
        Alert.alert('Atención', 'Debes iniciar sesión para comentar.');
        setSending(false);
        return;
      }

      const payload = {
        item_id: itemId,
        usuario_id: parseInt(userId),
        contenido: commentText
      };

      const response = await axios.post(`${API_BASE_URL}/apiLogin/crear_comentario.php`, payload);

      if (response.status === 201 || response.status === 200) {
        setCommentText(''); // Limpiar campo
        
        showSuccessMessage(); // Mostrar mensaje de éxito
        
        // Llamar a la función del padre para recargar la lista
        if (onCommentSent) {
            onCommentSent(); 
        }
      }

    } catch (error) {
      console.error('Error al enviar comentario:', error);
      Alert.alert('Error', 'No se pudo enviar el comentario. Intenta nuevamente.');
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={itemDetailStyles.inputSection}>
      <Text style={[itemDetailStyles.inputLabel, { color: colors.title }]}>
        Deja tu opinión
      </Text>
      <View style={itemDetailStyles.inputWrapper}>
        <TextInput
          style={[
            itemDetailStyles.textInput, 
            { 
              backgroundColor: colors.cardBackground, 
              color: colors.text,
              borderColor: colors.cardBorder
            }
          ]}
          placeholder="Escribe un comentario..."
          placeholderTextColor={colors.subtitle}
          multiline
          value={commentText}
          onChangeText={setCommentText}
          maxLength={500}
        />
        <TouchableOpacity
          style={[itemDetailStyles.sendButton, { backgroundColor: colors.accent }]}
          onPress={handleSend}
          disabled={sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="send" size={20} color="#1a2332" style={{ marginLeft: 2 }} />
          )}
        </TouchableOpacity>
      </View>
      {/* 4. Vista Animada para el mensaje */}
      <Animated.View 
        style={[
          styles.toastContainer, 
          { 
            opacity: fadeAnim, // Enlaza la opacidad a la variable animada
            backgroundColor: colors.accent 
          }
        ]}
        pointerEvents="none" // Evita clicks accidentales en el mensaje
      >
        <Text style={[styles.toastText, { color: colors.text}]}>
          {message}
        </Text>
      </Animated.View>
    </View>
  );
}

// Estilos para el mensaje de éxito
const styles = StyleSheet.create({
  toastContainer: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: '100%',         
    flexDirection: 'row',   
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,                
    flexWrap: 'wrap',
  }
});