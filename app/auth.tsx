import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { authStyles } from '../styles/AuthStyles';
import { homeStyles } from '@/styles/HomeStyles';

export default function AuthScreen() {
  const [isSupported, setIsSupported] = useState(false);
  const [hasHardware, setHasHardware] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [authTypes, setAuthTypes] = useState<number[]>([]);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    checkDeviceCapabilities();
  }, []);

  const checkDeviceCapabilities = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    setHasHardware(compatible);

    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setIsEnrolled(enrolled);

    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    setAuthTypes(types);

    setIsSupported(compatible && enrolled);
  };

  const handleBiometricAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autenticación requerida',
        fallbackLabel: 'Usar PIN',
        cancelLabel: 'Cancelar',
        disableDeviceFallback: false, // Permite usar PIN del dispositivo como alternativa
      });

      if (result.success) {
        // Autenticación exitosa, navegar a la app
        router.replace('/(tabs)');
      } else {
        console.log('Autenticación fallida:', result);
      }
    } catch (error) {
      console.error('Error en autenticación:', error);
    }
  };

  const getAuthTypeText = () => {
    if (authTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        return 'Desbloquear con Huella';
    } else if (authTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) { 
        return 'Desbloquear con Face ID';
    } else if (authTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
        return 'Desbloquear con Iris';
    }
    return 'Desbloquear';
  };

    const getAuthIcon = (): any => {
        if (authTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
            return 'smile-o';
        } else if (authTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
            return 'hand-paper-o'; // o 'hand-o-up'
        }
        return 'lock';
    };

  // Intentar autenticación automática al cargar
  useEffect(() => {
    if (isSupported) {
      // Pequeño delay para mejor UX
      setTimeout(() => {
        handleBiometricAuth();
      }, 500);
    }
  }, [isSupported]);

  return (
    <SafeAreaView style={[authStyles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar 
        barStyle={colors.statusBar as 'light-content' | 'dark-content'} 
        backgroundColor={colors.background} 
        />
      
      <View style={authStyles.content}>
        <View style={[homeStyles.logo, { backgroundColor: colors.accent }]}>
          <Text style={homeStyles.logoText}>M</Text>
        </View>

        <Text style={[authStyles.title, { color: colors.title }]}>
          Museo de Ciencias Naturales
        </Text>
        
        <Text style={[authStyles.subtitle, { color: colors.subtitle }]}>
          Catálogo Digital
        </Text>

        {/* Mensaje de autenticación */}
        <View style={authStyles.authSection}>
          {isSupported ? (
            <>
              <Text style={[authStyles.authText, { color: colors.subtitle }]}>
                Autenticación requerida para acceder
              </Text>

              <TouchableOpacity
                style={[authStyles.authButton, { backgroundColor: colors.accent }]}
                onPress={handleBiometricAuth}
              >
                <FontAwesome 
                  name={getAuthIcon()} 
                  size={24} 
                  color="#1a2332"
                  style={authStyles.buttonIcon}
                />
                <Text style={authStyles.authButtonText}>
                  {getAuthTypeText()}
                </Text>
              </TouchableOpacity>

              <Text style={[authStyles.helpText, { color: colors.subtitle }]}>
                {authTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT) 
                  ? 'También puedes usar el PIN de tu dispositivo'
                  : 'Usa el método de desbloqueo de tu dispositivo'}
              </Text>
            </>
          ) : (
            <>
              <Text style={[authStyles.warningText, { color: colors.error }]}>
                ⚠️ Autenticación biométrica no disponible
              </Text>
              
              {!hasHardware && (
                <Text style={[authStyles.helpText, { color: colors.subtitle }]}>
                  Tu dispositivo no tiene hardware biométrico
                </Text>
              )}
              
              {hasHardware && !isEnrolled && (
                <Text style={[authStyles.helpText, { color: colors.subtitle }]}>
                  No hay datos biométricos registrados en tu dispositivo.
                  Configura huella o Face ID en los ajustes.
                </Text>
              )}

              <TouchableOpacity
                style={[authStyles.authButton, { backgroundColor: colors.accent }]}
                onPress={() => router.replace('/(tabs)')}
              >
                <Text style={authStyles.authButtonText}>
                  Entrar sin autenticación
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
