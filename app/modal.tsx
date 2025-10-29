import { router } from 'expo-router';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
// NOTA: Se elimina la importación de useThemeColors y de Colors
import React, { useState } from 'react';
import { useThemeColors } from '../constants/Colors.js';
import { iniciarSesion } from '../services/login.js';


// COLORES FIJOS
const Fijo = {
  background: '#F0F0F0', // Fondo claro
  text: '#333333',       // Texto oscuro
  title: '#1F2937',      // Título más oscuro
  cardBackground: '#FFFFFF',
  accent: '#3B82F6',     // Azul para el botón principal (Entrar)
  tint: '#6B7280',       // Gris para el botón secundario (Cerrar)
  error: 'red',          // Rojo
};

const baseStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC', 
    padding: 15,
    marginBottom: 15,
    width: '80%', 
    borderRadius: 8,
  },
  errorText: {
    color: Fijo.error,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '80%',          // Mismo ancho que el input
    marginVertical: 10,    // Espacio vertical entre botones
    borderRadius: 8,       // Para que el color del botón respete el borde
    overflow: 'hidden',    // Importante para el botón de Android
  }
});

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
    <View style={[baseStyles.container, { 
              backgroundColor: colors.background,
              borderBottomColor: colors.headerBorder 
            }]}>
      <Text style={[baseStyles.title, { 
              color: colors.text 
            }]}>Iniciar Sesión</Text>

      <TextInput
        style={[baseStyles.input, { 
              backgroundColor: colors.cardBackground,
              borderBottomColor: colors.headerBorder,
              color: colors.text
            }]}
        placeholder="Usuario"
        placeholderTextColor={colors.text}
        value={usuario}
        onChangeText={setUsuario}
      />
      
      <TextInput
        style={[baseStyles.input, { 
              backgroundColor: colors.cardBackground,
              borderBottomColor: colors.headerBorder,
              color: colors.text
            }]}
        placeholder="Contraseña"
        placeholderTextColor={colors.text}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      {error ? <Text style={baseStyles.errorText}>{error}</Text> : null}
      <View style={baseStyles.buttonContainer}>
        <Button title="Entrar" onPress={handleLogin} color={colors.primary} />
      </View>
      <View style={baseStyles.buttonContainer}>
        <Button title="Cerrar" onPress={() => router.back()} color={colors.secondary} /> 
      </View>
    </View>
  );
}
