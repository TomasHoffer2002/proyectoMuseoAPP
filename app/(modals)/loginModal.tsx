import { router } from 'expo-router';
import { 
  Button, 
  StyleSheet, 
  Text, 
  TextInput, 
  View, 
  ImageBackground, 
  KeyboardAvoidingView, 
  Platform,
  Dimensions 
} from 'react-native';
import React, { useState } from 'react';
import { useThemeColors } from '../../constants/Colors.js';
import { iniciarSesion } from '../../services/login.js';
import { API_BASE_URL } from '../../config.js'; 

const { width } = Dimensions.get('window');
const API_ENDPOINT = '/apiLogin/imagenes/fondoAppp.jpg';

const BACKGROUND_IMAGE = API_BASE_URL + API_ENDPOINT;

export default function LoginModal() {
  const [error, setError] = useState('');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const colors = useThemeColors();

  const handleLogin = async () => {
    setError(''); 
    
    if (!usuario || !password) {
        setError('Debe ingresar usuario y contraseña.');
        return;
    }

    try {
      await iniciarSesion(usuario, password); 
      router.back(); 
    } catch (e) {
      let errorMessage = 'Error desconocido al iniciar sesión.';
      if (e instanceof Error) {
        errorMessage = e.message;
      } else if (typeof e === 'string') {
          errorMessage = e;
      }
      setError(errorMessage);
    }
  };
  
  return (
    <ImageBackground 
      source={{ uri: BACKGROUND_IMAGE }} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      {/* CAPA OSCURA (OVERLAY) */}
      {/* Esto oscurece la imagen para que el cuadro blanco resalte más */}
      <View style={styles.overlay} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        {/* TARJETA DE LOGIN (CARD) */}
        <View style={[styles.loginCard, { backgroundColor: colors.cardBackground }]}>
          
          <Text style={[styles.title, { color: colors.text }]}>
            Bienvenido al Museo!!
          </Text>
          <Text style={[styles.subtitle, { color: colors.tint }]}>
            Inicia sesión para continuar
          </Text>

          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.background, // Un poco diferente al fondo de la card
              borderColor: colors.headerBorder,
              color: colors.text
            }]}
            placeholder="Usuario"
            placeholderTextColor={colors.tabIconDefault || '#999'}
            value={usuario}
            onChangeText={setUsuario}
            autoCapitalize="none"
          />
          
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.background,
              borderColor: colors.headerBorder,
              color: colors.text
            }]}
            placeholder="Contraseña"
            placeholderTextColor={colors.tabIconDefault || '#999'}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <View style={styles.buttonContainer}>
            <Button title="Entrar" onPress={handleLogin} color={colors.primary} />
          </View>
          
          <View style={styles.buttonContainer}>
            <Button title="Cancelar" onPress={() => router.back()} color={colors.secondary || '#666'} /> 
          </View>

        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Negro al 50% de opacidad
  },
  keyboardContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginCard: {
    width: width * 0.85, // 85% del ancho de la pantalla
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 20,
    // Sombras para dar efecto de elevación (3D)
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10, // Sombra en Android
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 15,
    marginBottom: 15,
    width: '100%', 
    borderRadius: 12, // Bordes más redondeados en inputs
    fontSize: 16,
  },
  errorText: {
    color: '#ff4444',
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 6,
    borderRadius: 12,
    overflow: 'hidden',
  },
});