import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { API_BASE_URL } from '../../config';

export const CarouselImage = ({ imageUrl }) => {
  return (
    <Image
      source={{ uri: `${API_BASE_URL}${imageUrl}` }}
      style={styles.image}
      resizeMode="cover"
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 280,
    borderRadius: 16,
  },
});