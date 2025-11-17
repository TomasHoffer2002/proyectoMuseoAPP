import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StatusBar, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { profileStyles } from '../../styles/ProfileStyles';
import { CoinService } from '../../services/CoinService';
import { BenefitService } from '../../services/BenefitService';
import { useTheme } from '../../components/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const ACTIVE_THEME_KEY = '@museum_active_theme';

export default function PerfilScreen() {
  const [coins, setCoins] = useState(0);
  const [itemsViewed, setItemsViewed] = useState(0);
  const [nightThemeUnlocked, setNightThemeUnlocked] = useState(false);
  const [collectorBadgeUnlocked, setCollectorBadgeUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Visitante del Museo');

  // Obtener colores según el tema activo
  const { colors, activeTheme, toggleTheme } = useTheme();

  useFocusEffect(
    useCallback(() => {
      // Definimos la función que carga los datos
      const loadUserData = async () => {
        try {
          setLoading(true);
          
          const storedUserName = await AsyncStorage.getItem('userName');
          
          if (storedUserName) {
            setUserName(storedUserName);
          } else {
            // Si no hay nombre, resetea al valor por defecto
            setUserName('Visitante del Museo'); 
          }
          
          // Cargar estadísticas de monedas
          const stats = await CoinService.getStats();
          setCoins(stats.totalCoins);
          setItemsViewed(stats.itemsViewed);

          // Cargar beneficios desbloqueados
          const benefits = await BenefitService.getUnlockedBenefits();
          setNightThemeUnlocked(benefits.nightTheme);
          setCollectorBadgeUnlocked(benefits.collectorBadge);
        
        } catch (error) {
          console.error('Error al cargar datos del usuario:', error);
          // En caso de error, también resetea
          setUserName('Visitante del Museo');
        } finally {
          setLoading(false);
        }
      };

      // Llamamos a la función
      loadUserData();

    }, []) // El array vacío asegura que la lógica no se repita innecesariamente
  );

  const loadUserData = async () => {
    try {
      setLoading(true);
      //cargar nombre de usuario
      const storedUserName = await AsyncStorage.getItem('userName');
      if (storedUserName) {
        setUserName(storedUserName);
      }
      
      // Cargar estadísticas de monedas
      const stats = await CoinService.getStats();
      setCoins(stats.totalCoins);
      setItemsViewed(stats.itemsViewed);

      // Cargar beneficios desbloqueados
      const benefits = await BenefitService.getUnlockedBenefits();
      setNightThemeUnlocked(benefits.nightTheme);
      setCollectorBadgeUnlocked(benefits.collectorBadge);
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockBenefit = async (benefit) => {
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
            // Restar monedas
            const newCoins = await CoinService.subtractCoins(benefit.cost);
            
            if (newCoins !== null) {
              // Desbloquear beneficio
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
              <Text style={profileStyles.badge}>🏆</Text>
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

        {/* Cambiar tema (solo si está desbloqueado) */}
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
                      style={[profileStyles.unlockButton, { backgroundColor: colors.accent }]}
                      onPress={() => handleUnlockBenefit(benefit)}
                    >
                      <Text style={[profileStyles.unlockButtonText, { color: '#1a2332' }]}>
                        Canjear
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>
        <View style={profileStyles.section}>
          <TouchableOpacity
            style={[profileStyles.buyCoinsButton, { backgroundColor: colors.accent }]}
            onPress={() => {
              Alert.alert(
                'Comprar Monedas',
                '¿Cuántas monedas deseas comprar?\n\n50 monedas = $1.99\n100 monedas = $2.99\n500 monedas = $9.99',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  {
                    text: '50 monedas',
                    onPress: async () => {
                      await CoinService.addCoins(50);
                      loadUserData();
                      Alert.alert('¡Éxito!', 'Se agregaron 50 monedas a tu cuenta');
                    }
                  },
                  {
                    text: '100 monedas',
                    onPress: async () => {
                      await CoinService.addCoins(100);
                      loadUserData();
                      Alert.alert('¡Éxito!', 'Se agregaron 100 monedas a tu cuenta');
                    }
                  }
                ]
              );
            }}
          >
            <View style={profileStyles.buyCoinsContent}>
              <Text style={profileStyles.buyCoinsIcon}>🪙</Text>
              <Text style={[profileStyles.buyCoinsText, { color: '#1a2332' }]}>
                Comprar Monedas
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {/* Espaciado final */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}