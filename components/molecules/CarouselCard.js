import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Text } from 'react-native';
import { CarouselImage } from '../atoms/CarouselImage';
import { CarouselTitle } from '../atoms/CarouselTitle';

export const CarouselCard = ({ item, colors, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.card, { 
        backgroundColor: colors.cardBackground,
        shadowColor: colors.title,
      }]}
      onPress={() => onPress(item)}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <CarouselImage imageUrl={item.imageUrl} />
      </View>
      
      <CarouselTitle title={item.title} color={colors.title} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding:15,
    marginHorizontal: 20,
    width: Dimensions.get('window').width * 0.93,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  imageContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#1a2332',
    fontSize: 12,
    fontWeight: '700',
  },
});