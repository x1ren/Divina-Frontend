import React, { useState } from "react";
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
  TextInput,
  Animated,
} from "react-native";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";

type Styles = {
  container: ViewStyle;
  headerContent: ViewStyle;
  headerTop: ViewStyle;
  greeting: TextStyle;
  subtitle: TextStyle;
  menuButton: ViewStyle;
  searchBarContainer: ViewStyle;
  searchBar: ViewStyle;
  searchInput: TextStyle;
  categoryScroll: ViewStyle;
  categoryBtnContainer: ViewStyle;
  categoryBtn: ViewStyle;
  categoryBtnText: TextStyle;
  scrollContainer: ViewStyle;
  section: ViewStyle;
  sectionTitle: TextStyle;
  savedSection: ViewStyle;
  recipeCard: ViewStyle;
  recipeImage: ImageStyle;
  recipeInfo: ViewStyle;
  recipeName: TextStyle;
  recipeMetrics: ViewStyle;
  metricItem: ViewStyle;
  metricText: TextStyle;
  noRecipesText: TextStyle;
  emptyStateContainer: ViewStyle;
  emptyStateIcon: ViewStyle;
  emptyStateTitle: TextStyle;
  emptyStateSubtitle: TextStyle;
};

const Saved = () => {
  const [fontsLoaded] = useFonts({
    "PlusJakartaSans-Bold": require("../../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "PlusJakartaSans-SemiBold": require("../../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "PlusJakartaSans-Medium": require("../../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "PlusJakartaSans-Regular": require("../../assets/fonts/PlusJakartaSans-Regular.ttf"),
  });

  const [activeCategory, setActiveCategory] = useState("All");

  // Animation values for each category
  const [animationValues] = useState(() => {
    const values: { [key: string]: Animated.Value } = {};
    ["All", "Breakfast", "Lunch", "Dinner", "Dessert"].forEach((category) => {
      values[category] = new Animated.Value(category === "All" ? 1 : 0);
    });
    return values;
  });

  if (!fontsLoaded) {
    return null;
  }

  const demoRecipes = [
    {
      id: "1",
      name: "Classic Caesar Salad",
      category: "Lunch",
      time: "20 mins",
      calories: "350",
      rating: "4.8",
      servings: 2,
      image: require("../../assets/images/icon.png"),
    },
    {
      id: "2",
      name: "Fluffy Pancakes",
      category: "Breakfast",
      time: "25 mins",
      calories: "420",
      rating: "4.9",
      servings: 4,
      image: require("../../assets/images/icon.png"),
    },
    {
      id: "3",
      name: "Chocolate Chip Cookies",
      category: "Dessert",
      time: "35 mins",
      calories: "280",
      rating: "4.7",
      servings: 12,
      image: require("../../assets/images/icon.png"),
    },
  ];

  const categories = ["All", "Breakfast", "Lunch", "Dinner", "Dessert"];

  const handleCategoryPress = (category: string) => {
    setActiveCategory(category);

    // Animate all buttons
    Object.keys(animationValues).forEach((cat) => {
      Animated.timing(animationValues[cat], {
        toValue: cat === category ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });
  };

  // Filter recipes based on active category
  const filteredRecipes = activeCategory === "All" 
    ? demoRecipes 
    : demoRecipes.filter(recipe => recipe.category === activeCategory);

  return (
    <View style={styles.container}>
      {/* Header matching Home tab style */}
      <View style={styles.headerContent}>
        <View style={styles.headerTop}>
          <View>
            <Text
              style={[styles.greeting, { fontFamily: "PlusJakartaSans-Bold" }]}
            >
              Your Favorites
            </Text>
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <FontAwesome name="heart" size={24} color="#FF6B6B" />
          </TouchableOpacity>
        </View>

        <Text
          style={[styles.subtitle, { fontFamily: "PlusJakartaSans-SemiBold" }]}
        >
          Saved recipes for{"\n"}your cooking adventures
        </Text>

        <View style={styles.searchBarContainer}>
          <View style={styles.searchBar}>
            <FontAwesome name="search" size={20} color="#9E9E9E" />
            <TextInput
              style={[
                styles.searchInput,
                { fontFamily: "PlusJakartaSans-Regular" },
              ]}
              placeholder="Search saved recipes..."
              placeholderTextColor="#9E9E9E"
            />
            <TouchableOpacity>
              <FontAwesome name="sliders" size={20} color="#4A90E2" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {categories.map((category) => {
            const animatedValue = animationValues[category];

            return (
              <TouchableOpacity
                key={category}
                style={styles.categoryBtnContainer}
                onPress={() => handleCategoryPress(category)}
                activeOpacity={0.8}
              >
                <Animated.View
                  style={[
                    styles.categoryBtn,
                    {
                      backgroundColor: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["transparent", "#000000ff"],
                      }),
                      transform: [
                        {
                          scale: animatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.05],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Animated.Text
                    style={[
                      styles.categoryBtnText,
                      { fontFamily: "PlusJakartaSans-Regular" },
                      {
                        color: animatedValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["#000000ff", "#fff"],
                        }),
                      },
                    ]}
                  >
                    {category}
                  </Animated.Text>
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Content Section */}
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { fontFamily: "PlusJakartaSans-SemiBold" },
            ]}
          >
            Saved Recipes ({filteredRecipes.length})
          </Text>

          {filteredRecipes.length > 0 ? (
            <View style={styles.savedSection}>
              {filteredRecipes.map((recipe) => (
                <TouchableOpacity key={recipe.id} style={styles.recipeCard} activeOpacity={0.8}>
                  <Image source={recipe.image} style={styles.recipeImage} />
                  <View style={styles.recipeInfo}>
                    <Text
                      style={[styles.recipeName, { fontFamily: "PlusJakartaSans-SemiBold" }]}
                    >
                      {recipe.name}
                    </Text>
                    <View style={styles.recipeMetrics}>
                      <View style={styles.metricItem}>
                        <FontAwesome name="clock-o" size={14} color="#9E9E9E" />
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
                        <FontAwesome name="users" size={14} color="#4A90E2" />
                        <Text
                          style={[
                            styles.metricText,
                            { fontFamily: "PlusJakartaSans-Regular" },
                          ]}
                        >
                          {recipe.servings} servings
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
                  <TouchableOpacity style={{ padding: 12 }}>
                    <FontAwesome name="heart" size={20} color="#FF6B6B" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyStateIcon}>
                <FontAwesome name="heart-o" size={48} color="#9E9E9E" />
              </View>
              <Text style={[styles.emptyStateTitle, { fontFamily: "PlusJakartaSans-SemiBold" }]}>
                No saved recipes yet
              </Text>
              <Text style={[styles.emptyStateSubtitle, { fontFamily: "PlusJakartaSans-Regular" }]}>
                Start exploring recipes and save your favorites to see them here
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 30,
  },
  headerContent: {
    gap: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  greeting: {
    fontSize: 16,
    color: "#000000ff",
    opacity: 0.8,
  },
  subtitle: {
    fontSize: 20,
    color: "#000000ff",
    lineHeight: 28,
  },
  menuButton: {
    width: 45,
    height: 45,
    backgroundColor: "#fff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchBarContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 14,
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
    color: "#424242",
  },
  categoryScroll: {
    marginTop: 15,
    paddingLeft: 5,
  },
  categoryBtnContainer: {
    marginRight: 12,
  },
  categoryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  categoryBtnText: {
    fontSize: 14,
  },
  scrollContainer: {
    flex: 1,
    marginTop: 20,
    paddingBottom: 100,
  },
  section: {
    marginTop: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    color: "#000000ff",
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
    alignItems: "center",
  },
  recipeImage: {
    width: 80,
    height: 80,
    resizeMode: "cover",
    borderRadius: 12,
    margin: 12,
  },
  recipeInfo: {
    flex: 1,
    padding: 12,
    paddingLeft: 0,
    justifyContent: "space-between",
  },
  recipeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000ff",
    marginBottom: 8,
  },
  recipeMetrics: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 15,
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metricText: {
    fontSize: 12,
    color: "#9E9E9E",
  },
  noRecipesText: {
    fontSize: 16,
    color: "#9E9E9E",
    textAlign: "center",
    marginTop: 20,
  },
  emptyStateContainer: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    marginBottom: 20,
    opacity: 0.5,
  },
  emptyStateTitle: {
    fontSize: 18,
    color: "#000000ff",
    textAlign: "center",
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: "#9E9E9E",
    textAlign: "center",
    lineHeight: 20,
  },
});

export default Saved;