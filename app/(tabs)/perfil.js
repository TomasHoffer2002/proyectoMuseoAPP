import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StatusBar, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { profileStyles } from '../../styles/ProfileStyles';
import { CoinService } from '../../services/CoinService';
import { BenefitService } from '../../services/BenefitService';
import { useTheme } from '../../components/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const ACTIVE_THEME_KEY = '@museum_active_theme';

const PRODUCT_OPTIONS = [
  { coins: 50, price: '1000', name: '50 Monedas', checkoutUrl: 'https://mpago.la/18NBNAn' },
  { coins: 100, price: '1500', name: '100 Monedas', checkoutUrl: 'https://mpago.la/18NBNAn' },
  { coins: 500, price: '3000', name: '500 Monedas', checkoutUrl: 'https://mpago.la/18NBNAn' },
];

export default function PerfilScreen() {
  const [coins, setCoins] = useState(0);
  const [itemsViewed, setItemsViewed] = useState(0);
  const [nightThemeUnlocked, setNightThemeUnlocked] = useState(false);
  const [collectorBadgeUnlocked, setCollectorBadgeUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Visitante del Museo');
  
  // Estado para controlar el login
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { colors, activeTheme, toggleTheme } = useTheme();
  
  const loadUserData = async () => {
    try {
      setLoading(true);
      
      const storedUserName = await AsyncStorage.getItem('userName');
      // Verificamos el ID para saber si es un usuario real
      const storedUserId = await AsyncStorage.getItem('userId');
      const userIsLogged = !!storedUserId;
      setIsLoggedIn(userIsLogged);

      if (storedUserName) {
        setUserName(storedUserName);
      } else {
        setUserName('Visitante del Museo'); 
      }
      
      const stats = await CoinService.getStats();
      setCoins(stats.totalCoins);
      setItemsViewed(stats.itemsViewed);

      const benefits = await BenefitService.getUnlockedBenefits();
      setNightThemeUnlocked(benefits.nightTheme);
      setCollectorBadgeUnlocked(benefits.collectorBadge);
    
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      setUserName('Visitante del Museo');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );
  
  // --- FUNCIÓN DE COMPRA ---
  const handleBuyCoins = async (option) => {
    // Seguridad extra por si acaso
    if (!isLoggedIn) {
        Alert.alert("Atención", "Debes iniciar sesión para comprar.");
        return;
    }

    if (await Linking.canOpenURL(option.checkoutUrl)) {
      Alert.alert(
          'Confirmar Compra',
          `Vas a ser redirigido a Mercado Pago para comprar ${option.coins} monedas.\n\nAl completar el pago, vuelve a esta pantalla.`,
          [
            { text: 'Cancelar', style: 'cancel' },
            { 
              text: 'Ir a Pagar', 
              onPress: async () => {
                // Abrir Mercado Pago
                Linking.openURL(option.checkoutUrl);
                        
                // Sumar monedas con delay para simular éxito al volver
                setTimeout(async () => {
                  await CoinService.addCoins(option.coins);
                }, 3000); 
              } 
            }
          ]
      );

    } else {
        Alert.alert('Error', 'No se pudo abrir la aplicación de Mercado Pago o el enlace.');
    }
  };

  // --- FUNCIÓN DE CANJE ---
  const handleUnlockBenefit = async (benefit) => {
    // Seguridad extra
    if (!isLoggedIn) {
        Alert.alert("Atención", "Debes iniciar sesión para canjear.");
        return;
    }

    const currentCoins = await CoinService.getCoins();

    if (currentCoins < benefit.cost) {
      Alert.alert(
        'Monedas insuficientes',
        `Necesitas ${benefit.cost} monedas. Actualmente tienes ${currentCoins}.`
      );
      return;
    }

    Alert.alert(
      'Confirmar canje',
      `¿Deseas canjear ${benefit.cost} monedas por "${benefit.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Canjear',
          onPress: async () => {
            const newCoins = await CoinService.subtractCoins(benefit.cost);
            
            if (newCoins !== null) {
              if (benefit.id === 'night_theme') {
                await BenefitService.unlockNightTheme();
                setNightThemeUnlocked(true);
              } else if (benefit.id === 'collector_badge') {
                await BenefitService.unlockCollectorBadge();
                setCollectorBadgeUnlocked(true);
              }

              setCoins(newCoins);
              
              Alert.alert(
                '¡Desbloqueado!',
                `Has desbloqueado: ${benefit.name}`
              );
            }
          }
        }
      ]
    );
  };


  if (loading) {
    return (
      <SafeAreaView style={[profileStyles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.subtitle }}>Cargando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[profileStyles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header con Avatar y Stats */}
        <View style={profileStyles.header}>
          <View style={[profileStyles.avatarContainer, { backgroundColor: colors.accent }]}>
            <Text style={profileStyles.avatarText}>👤</Text>
            {collectorBadgeUnlocked && (
              <Text style={profileStyles.badge}>🏅​</Text>
            )}
          </View>
          
          <Text style={[profileStyles.userName, { color: colors.title }]}>
            {userName}
          </Text>

          {/* Estadísticas */}
          <View style={profileStyles.statsContainer}>
            <View style={profileStyles.statItem}>
              <Text style={[profileStyles.statValue, { color: colors.accent }]}>
                🪙 {coins}
              </Text>
              <Text style={[profileStyles.statLabel, { color: colors.subtitle }]}>
                Monedas
              </Text>
            </View>

            <View style={profileStyles.statItem}>
              <Text style={[profileStyles.statValue, { color: colors.accent }]}>
                {itemsViewed}
              </Text>
              <Text style={[profileStyles.statLabel, { color: colors.subtitle }]}>
                Items vistos
              </Text>
            </View>
          </View>
        </View>

        {/* Cambiar tema */}
        {nightThemeUnlocked && (
          <View style={profileStyles.themeToggle}>
            <TouchableOpacity
              style={[profileStyles.themeButton, {
                backgroundColor: colors.cardBackground,
                borderColor: colors.cardBorder
              }]}
              onPress={toggleTheme}
            >
              <View style={profileStyles.themeButtonLeft}>
                <Text style={profileStyles.themeIcon}>
                  {activeTheme === 'night' ? '🌙' : '☀️'}
                </Text>
                <Text style={[profileStyles.themeText, { color: colors.title }]}>
                  {activeTheme === 'night' ? 'Modo Nocturno' : 'Modo Normal'}
                </Text>
              </View>
              <Text style={profileStyles.activeThemeIndicator}>
                {activeTheme === 'night' ? '✓' : ''}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Beneficios disponibles */}
        <View style={profileStyles.section}>
          <Text style={[profileStyles.sectionTitle, { color: colors.title }]}>
            🎁 Beneficios Canjeables
          </Text>

          {BenefitService.availableBenefits.map((benefit) => {
            const isUnlocked = benefit.id === 'night_theme' 
              ? nightThemeUnlocked 
              : collectorBadgeUnlocked;

            return (
              <View
                key={benefit.id}
                style={[profileStyles.benefitCard, {
                  backgroundColor: colors.cardBackground,
                  borderColor: isUnlocked ? colors.accent : colors.cardBorder
                }]}
              >
                <View style={profileStyles.benefitHeader}>
                  <Text style={profileStyles.benefitIcon}>{benefit.icon}</Text>
                  <View style={profileStyles.benefitInfo}>
                    <Text style={[profileStyles.benefitName, { color: colors.title }]}>
                      {benefit.name}
                    </Text>
                    <Text style={[profileStyles.benefitDescription, { color: colors.subtitle }]}>
                      {benefit.description}
                    </Text>
                  </View>
                </View>

                <View style={profileStyles.benefitFooter}>
                  <View style={profileStyles.costContainer}>
                    <Text style={profileStyles.costIcon}>🪙</Text>
                    <Text style={[profileStyles.costText, { color: colors.title }]}>
                      {benefit.cost}
                    </Text>
                  </View>

                  {isUnlocked ? (
                    <View style={[profileStyles.unlockedBadge, { backgroundColor: colors.accent }]}>
                      <Text style={[profileStyles.unlockedText, { color: '#1a2332' }]}>
                        ✓ Desbloqueado
                      </Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      // APLICAMOS ESTILOS Y DISABLED SEGÚN LOGIN
                      style={[
                        profileStyles.unlockButton, 
                        { 
                            backgroundColor: isLoggedIn ? colors.accent : colors.cardBorder, // Gris si no logueado
                            opacity: isLoggedIn ? 1 : 0.5 
                        }
                      ]}
                      onPress={() => handleUnlockBenefit(benefit)}
                      disabled={!isLoggedIn} // Bloquea el toque si no está logueado
                    >
                      <Text style={[profileStyles.unlockButtonText, { color: isLoggedIn ? '#1a2332' : colors.subtitle }]}>
                        {isLoggedIn ? 'Canjear' : 'Logueate'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* --- SECCIÓN DE COMPRA DE MONEDAS --- */}
        <View style={profileStyles.section}>
          <Text style={[profileStyles.sectionTitle, { color: colors.title, marginBottom: 15 }]}>
            💰 Paquetes de Monedas
          </Text>
          
          {PRODUCT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.coins}
              // APLICAMOS ESTILOS Y DISABLED SEGÚN LOGIN
              style={[
                profileStyles.buyCoinsButton, 
                { 
                    backgroundColor: colors.cardBackground, 
                    borderWidth: 1, 
                    borderColor: isLoggedIn ? colors.accent : colors.cardBorder, // Borde gris si no logueado
                    marginBottom: 12,
                    opacity: isLoggedIn ? 1 : 0.5 // Opacidad reducida si no logueado
                }
              ]}
              onPress={() => handleBuyCoins(option)}
              disabled={!isLoggedIn} // Bloquea el toque si no está logueado
            >
              <View style={profileStyles.buyCoinsContent}>
                <Text style={profileStyles.buyCoinsIcon}>🪙</Text>
                <Text style={[profileStyles.buyCoinsText, { color: colors.title, flex: 1, textAlign: 'left' }]}>
                  {option.name}
                </Text>
                <Text style={[profileStyles.buyCoinsText, { color: isLoggedIn ? colors.accent : colors.subtitle, fontWeight: '700' }]}>
                  ${option.price}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        {/* Espaciado final */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}