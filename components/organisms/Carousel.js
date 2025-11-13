import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { CarouselCard } from '../molecules/CarouselCard';
import { useThemeColors } from '../../constants/Colors';

const { width: screenWidth } = Dimensions.get('window');

export const CaruselApp = ({ items, onItemPress }) => {
  const colors = useThemeColors();
  const [activeIndex, setActiveIndex] = useState(0);

  const renderItem = ({ item }) => (
    <CarouselCard 
      item={item} 
      colors={colors}
      onPress={onItemPress}
    />
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Título de la sección */}
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { color: colors.title }]}>
          Destacados del Museo
        </Text>
        <Text style={[styles.sectionSubtitle, { color: colors.subtitle }]}>
          {items.length} {items.length === 1 ? 'muestra destacada' : 'muestras destacadas'}
        </Text>
      </View>

      {/* Carrusel */}
      <Carousel
        loop
        width={screenWidth}
        height={350}
        autoPlay={true}
        autoPlayInterval={5000}
        data={items}
        scrollAnimationDuration={1000}
        onSnapToItem={(index) => setActiveIndex(index)}
        renderItem={({ item }) => (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <CarouselCard 
              item={item} 
              colors={colors}
              onPress={onItemPress}
            />
          </View>
        )}
      />

      {/* Indicadores de puntos */}
      <View style={styles.pagination}>
        {items.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: index === activeIndex ? colors.accent : colors.subtitle,
                opacity: index === activeIndex ? 1 : 0.3,
              }
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    marginTop:10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});