import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

interface CategoryTabProps {
  title: string;
  image: any; // You might want to use a more specific type based on your image sources
  onPress: () => void;
}

const CategoryTab: React.FC<CategoryTabProps> = ({ title, image, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.tabContainer}>
    <ImageBackground source={image} style={styles.tabBackground} imageStyle={styles.tabBackgroundImage}>
      <Text style={styles.tabText}>{title}</Text>
    </ImageBackground>
  </TouchableOpacity>
);

interface CategoryTabsProps {
  categories: Array<{ title: string; image: any; onPress: () => void }>;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ categories }) => (
  <View style={styles.container}>
    {categories.map((category, index) => (
      <CategoryTab key={index} {...category} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tabContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  tabBackground: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBackgroundImage: {
    borderRadius: 8,
    opacity: 0.7,
  },
  tabText: {
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});

export default CategoryTabs;