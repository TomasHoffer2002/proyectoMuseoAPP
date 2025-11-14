import React from 'react';
import { Text, StyleSheet } from 'react-native';

export const CarouselTitle = ({ title, color }) => {
  return (
    <Text style={[styles.title, { color }]} numberOfLines={2}>
      {title}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
    textAlign: 'center',
    paddingHorizontal: 8,
    lineHeight: 24,
  },
});