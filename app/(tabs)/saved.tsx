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
  headerGradient: ViewStyle;
  headerContent: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  scrollContainer: ViewStyle;
  searchContainer: ViewStyle;
  searchBar: ViewStyle;
  searchInput: TextStyle;
  categoryTabs: ViewStyle;
  tabButton: ViewStyle;
  activeTabButton: ViewStyle;
  tabText: TextStyle;
  activeTabText: TextStyle;
  savedSection: ViewStyle;
  recipeCard: ViewStyle;
  recipeImage: ImageStyle;
  recipeInfo: ViewStyle;
  recipeName: TextStyle;
  recipeMetrics: ViewStyle;
  metricItem: ViewStyle;
  metricText: TextStyle;
  noRecipesText: TextStyle;
};

const Saved = () => {
  const [fontsLoaded] = useFonts({
    "PlusJakartaSans-Bold": require("../../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "PlusJakartaSans-SemiBold": require("../../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "PlusJakartaSans-Medium": require("../../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "PlusJakartaSans-Regular": require("../../assets/fonts/PlusJakartaSans-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  const demoRecipes = [
    {
      id: "1",
      name: "Classic Caesar Salad",
      category: "Salad",
      time: "20 mins",
      calories: "350",
      rating: "4.8",
      image: require("../../assets/images/icon.png"),
    },
    {
      id: "2",
      name: "Fluffy Pancakes",
      category: "Breakfast",
      time: "25 mins",
      calories: "420",
      rating: "4.9",
      image: require("../../assets/images/icon.png"),
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.savedSection}>
          {demoRecipes.map((recipe) => (
            <TouchableOpacity key={recipe.id} style={styles.recipeCard}>
              <Image source={recipe.image} style={styles.recipeImage} />
              <View style={styles.recipeInfo}>
                <Text
                  style={[styles.recipeName, { fontFamily: "Inter-Regular" }]}
                >
                  {recipe.name}
                </Text>
                <View style={styles.recipeMetrics}>
                  <View style={styles.metricItem}>
                    <FontAwesome name="clock-o" size={14} color="#666" />
                    <Text
                      style={[
                        styles.metricText,
                        { fontFamily: "Inter-Regular" },
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
                        { fontFamily: "Inter-Regular" },
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
                        { fontFamily: "Inter-Regular" },
                      ]}
                    >
                      {recipe.rating}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerGradient: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    gap: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    color: "#1B5E20",
  },
  subtitle: {
    fontSize: 16,
    color: "#1B5E20",
    opacity: 0.8,
  },
  searchContainer: {
    marginTop: 5,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#9E9E9E",
  },
  categoryTabs: {
    marginTop: 10,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  activeTabButton: {
    backgroundColor: "#1B5E20",
  },
  tabText: {
    color: "#1B5E20",
    fontSize: 14,
    fontWeight: "500",
  },
  activeTabText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  savedSection: {
    gap: 15,
  },
  recipeCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  recipeImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
  },
  recipeInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  recipeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1B5E20",
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
  noRecipesText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});

export default Saved;
