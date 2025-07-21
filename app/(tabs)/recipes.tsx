import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";

type Styles = {
  container: ViewStyle;
  headerContainer: ViewStyle;
  headerContent: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  searchContainer: ViewStyle;
  searchBar: ViewStyle;
  searchInput: TextStyle;
  filterButton: ViewStyle;
  categoryGrid: ViewStyle;
  categoryCard: ViewStyle;
  categoryIcon: ViewStyle;
  categoryName: TextStyle;
  recipesSection: ViewStyle;
  sectionTitle: TextStyle;
  recipeCard: ViewStyle;
  recipeImage: ImageStyle;
  recipeContent: ViewStyle;
  recipeTitle: TextStyle;
  recipeMetrics: ViewStyle;
  metricItem: ViewStyle;
  metricText: TextStyle;
};

const Recipes = () => {
  const [fontsLoaded] = useFonts({
    "PlusJakartaSans-Bold": require("../../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "PlusJakartaSans-SemiBold": require("../../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "PlusJakartaSans-Medium": require("../../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "PlusJakartaSans-Regular": require("../../assets/fonts/PlusJakartaSans-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  const categories = [
    { id: "1", name: "Breakfast", icon: "coffee" as const },
    { id: "2", name: "Lunch", icon: "cutlery" as const },
    { id: "3", name: "Dinner", icon: "moon-o" as const },
    { id: "4", name: "Dessert", icon: "birthday-cake" as const },
    { id: "5", name: "Drinks", icon: "glass" as const },
    { id: "6", name: "Snacks", icon: "apple" as const },
  ];

  const trendingRecipes = [
    {
      id: "1",
      name: "Japanese Ramen",
      time: "45 mins",
      calories: "580",
      rating: "4.9",
      image: require("../../assets/images/icon.png"),
    },
    {
      id: "2",
      name: "Italian Pizza",
      time: "30 mins",
      calories: "800",
      rating: "4.7",
      image: require("../../assets/images/icon.png"),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <Text style={[styles.title, { fontFamily: "PlusJakartaSans-Bold" }]}>
            Find Recipes
          </Text>
          <Text
            style={[styles.subtitle, { fontFamily: "PlusJakartaSans-Medium" }]}
          >
            What would you like to cook today?
          </Text>

          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <FontAwesome name="search" size={20} color="#9E9E9E" />
              <Text
                style={[
                  styles.searchInput,
                  { fontFamily: "PlusJakartaSans-Regular" },
                ]}
              >
                Search recipes, ingredients...
              </Text>
              <TouchableOpacity style={styles.filterButton}>
                <FontAwesome name="sliders" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.recipesSection}>
        <View style={styles.categoryGrid}>
          {categories.map((category) => (
            <TouchableOpacity key={category.id} style={styles.categoryCard}>
              <View style={styles.categoryIcon}>
                <FontAwesome name={category.icon} size={24} color="#666" />
              </View>
              <Text
                style={[
                  styles.categoryName,
                  { fontFamily: "PlusJakartaSans-Medium" },
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text
          style={[
            styles.sectionTitle,
            { fontFamily: "PlusJakartaSans-SemiBold" },
          ]}
        >
          Trending Now
        </Text>

        {trendingRecipes.map((recipe) => (
          <TouchableOpacity key={recipe.id} style={styles.recipeCard}>
            <Image source={recipe.image} style={styles.recipeImage} />
            <View style={styles.recipeContent}>
              <Text
                style={[
                  styles.recipeTitle,
                  { fontFamily: "PlusJakartaSans-SemiBold" },
                ]}
              >
                {recipe.name}
              </Text>
              <View style={styles.recipeMetrics}>
                <View style={styles.metricItem}>
                  <FontAwesome name="clock-o" size={14} color="#666" />
                  <Text
                    style={[
                      styles.metricText,
                      { fontFamily: "PlusJakartaSans-Regular" },
                    ]}
                  >
                    {recipe.time}
                  </Text>
                </View>
                <View style={styles.metricItem}>
                  <FontAwesome name="fire" size={14} color="#FF6B6B" />
                  <Text
                    style={[
                      styles.metricText,
                      { fontFamily: "PlusJakartaSans-Regular" },
                    ]}
                  >
                    {recipe.calories} cal
                  </Text>
                </View>
                <View style={styles.metricItem}>
                  <FontAwesome name="star" size={14} color="#FFD700" />
                  <Text
                    style={[
                      styles.metricText,
                      { fontFamily: "PlusJakartaSans-Regular" },
                    ]}
                  >
                    {recipe.rating}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerContent: {
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#000",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  searchContainer: {
    marginTop: 5,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 6,
    gap: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#999",
  },
  filterButton: {
    padding: 5,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  categoryCard: {
    width: "30%",
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
  },
  recipesSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginVertical: 16,
    paddingHorizontal: 20,
  },
  recipeCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 6,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  recipeImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
  },
  recipeContent: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  recipeMetrics: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metricText: {
    fontSize: 12,
    color: "#666",
  },
});

export default Recipes;
