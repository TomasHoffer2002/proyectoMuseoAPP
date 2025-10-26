import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../../constants/Colors';

export default function PerfilScreen() {
  const colors = useThemeColors();

  return (
    <SafeAreaView 
      style={{ flex: 1, backgroundColor: colors.background }} 
      edges={['top']}
    >
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />
      
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 20 
      }}>
        <Text style={{ 
          fontSize: 48, 
          marginBottom: 16 
        }}>
          👤
        </Text>
        <Text style={{ 
          fontSize: 24, 
          fontWeight: 'bold', 
          color: colors.title,
          marginBottom: 8 
        }}>
          Perfil
        </Text>
        <Text style={{ 
          fontSize: 16, 
          color: colors.subtitle,
          textAlign: 'center' 
        }}>
          Pantalla de perfil en construcción
        </Text>
      </View>
    </SafeAreaView>
  );
}