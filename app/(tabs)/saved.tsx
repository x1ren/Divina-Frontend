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
  Dimensions,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import RecipeCard from "@/components/RecipeSavedCard"; // adjust import path

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // 2 columns with padding

type Recipe = {
  id: number;
  title: string;
  readyInMinutes?: number;
  rating?: number;
  image?: string;
  category?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
};

type CategoryFilter = 'All' | 'Collections' | 'Recent' | 'Breakfast' | 'Lunch' | 'Dinner' | 'Dessert';

type Styles = {
  container: ViewStyle;
  headerContent: ViewStyle;
  headerTop: ViewStyle;
  greeting: TextStyle;
  subtitle: TextStyle;
  menuButton: ViewStyle;
  statsContainer: ViewStyle;
  statItem: ViewStyle;
  statNumber: TextStyle;
  statLabel: TextStyle;
  searchBarContainer: ViewStyle;
  searchBar: ViewStyle;
  searchInput: TextStyle;
  categoryScroll: ViewStyle;
  categoryBtnContainer: ViewStyle;
  categoryBtn: ViewStyle;
  categoryBtnText: TextStyle;
  scrollContainer: ViewStyle;
  section: ViewStyle;
  sectionHeader: ViewStyle;
  sectionTitle: TextStyle;
  viewToggle: ViewStyle;
  toggleButton: ViewStyle;
  activeToggleButton: ViewStyle;
  toggleText: TextStyle;
  activeToggleText: TextStyle;
  gridContainer: ViewStyle;
  recipeCard: ViewStyle;
  recipeImageContainer: ViewStyle;
  recipeImage: ImageStyle;
  saveIndicator: ViewStyle;
  recipeOverlay: ViewStyle;
  recipeInfo: ViewStyle;
  recipeName: TextStyle;
  recipeMetrics: ViewStyle;
  metricBadge: ViewStyle;
  metricText: TextStyle;
  listContainer: ViewStyle;
  listCard: ViewStyle;
  listImageContainer: ViewStyle;
  listImage: ImageStyle;
  listInfo: ViewStyle;
  listName: TextStyle;
  listMetrics: ViewStyle;
  listMetricItem: ViewStyle;
  listMetricText: TextStyle;
  emptyStateContainer: ViewStyle;
  emptyStateIcon: ViewStyle;
  emptyStateTitle: TextStyle;
  emptyStateSubtitle: TextStyle;
  emptyStateButton: ViewStyle;
  emptyStateButtonText: TextStyle;
  collectionCard: ViewStyle;
  collectionImage: ImageStyle;
  collectionOverlay: ViewStyle;
  collectionInfo: ViewStyle;
  collectionName: TextStyle;
  collectionCount: TextStyle;
  loadingContainer: ViewStyle;
  loadingText: TextStyle;
};

const url = "192.168.1.35:8080";

const fetchSavedRecipes = async (): Promise<Recipe[]> => {
  const res = await fetch(`http://${url}/api/save/recipes/1`);
  if (!res.ok) throw new Error("Failed to fetch saved recipes");
  const data = await res.json();
  console.log("[fetchSavedRecipes] API returned:", data);
  return data;
};

const Saved = () => {
  const [fontsLoaded] = useFonts({
    "PlusJakartaSans-Bold": require("../../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "PlusJakartaSans-SemiBold": require("../../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "PlusJakartaSans-Medium": require("../../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "PlusJakartaSans-Regular": require("../../assets/fonts/PlusJakartaSans-Regular.ttf"),
  });

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const {
    data: recipes = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["savedRecipes"],
    queryFn: fetchSavedRecipes,
    refetchOnMount: true,
    staleTime: 1000 * 60,
  });

  const queryClient = useQueryClient();

  // Animation values for each category
  const [animationValues] = useState(() => {
    const values: { [key: string]: Animated.Value } = {};
    (["All", "Collections", "Recent", "Breakfast", "Lunch", "Dinner", "Dessert"] as CategoryFilter[]).forEach((category) => {
      values[category] = new Animated.Value(category === "All" ? 1 : 0);
    });
    return values;
  });

  // Debug: log savedRecipes cache and query status
  React.useEffect(() => {
    const cached = queryClient.getQueryData(["savedRecipes"]);
    console.log("[SavedTab] useQuery state:", {
      isLoading,
      isFetching,
      recipesLength: recipes.length,
      cached,
    });
  }, [recipes, isLoading, isFetching, queryClient]);

  if (!fontsLoaded) {
    return null;
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={[styles.loadingText, { fontFamily: "PlusJakartaSans-Medium" }]}>
          Loading saved recipes...
        </Text>
      </View>
    );
  }

  const collections = [
    { id: "1", name: "Quick & Easy", count: 12, image: require("../../assets/images/icon.png") },
    { id: "2", name: "Date Night", count: 8, image: require("../../assets/images/icon.png") },
    { id: "3", name: "Healthy Meals", count: 15, image: require("../../assets/images/icon.png") },
  ];

  const categories: CategoryFilter[] = ["All", "Collections", "Recent", "Breakfast", "Lunch", "Dinner", "Dessert"];

  const handleCategoryPress = (category: CategoryFilter) => {
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

  // Map API recipe categories to display categories
  const mapRecipeCategory = (recipe: Recipe): CategoryFilter => {
    if (!recipe.category) return "All";
    const categoryMap: { [key: string]: CategoryFilter } = {
      'breakfast': 'Breakfast',
      'lunch': 'Lunch', 
      'dinner': 'Dinner',
      'snack': 'Dessert' // Map snack to Dessert for display
    };
    return categoryMap[recipe.category] || "All";
  };

  // Filter recipes based on active category
  const filteredRecipes = activeCategory === "All" 
    ? recipes 
    : activeCategory === "Recent"
    ? [...recipes].sort((a, b) => b.id - a.id) // Sort by ID as proxy for recency
    : recipes.filter(recipe => mapRecipeCategory(recipe) === activeCategory);

  const totalSaved = recipes.length;
  const totalCollections = collections.length;
  const avgRating = recipes.length > 0 
    ? (recipes.reduce((sum, recipe) => sum + (recipe.rating || 0), 0) / recipes.length).toFixed(1)
    : "0.0";

  const renderGridCard = (recipe: Recipe) => (
    <TouchableOpacity key={recipe.id} style={styles.recipeCard} activeOpacity={0.9}>
      <View style={styles.recipeImageContainer}>
        <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
        <View style={styles.saveIndicator}>
          <FontAwesome name="heart" size={12} color="#fff" />
        </View>
        <View style={styles.recipeOverlay}>
          <View style={styles.metricBadge}>
            <FontAwesome name="star" size={10} color="#FFD700" />
            <Text style={[styles.metricText, { fontFamily: "PlusJakartaSans-Medium" }]}>
              {recipe.rating?.toFixed(1) || "4.5"}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.recipeInfo}>
        <Text style={[styles.recipeName, { fontFamily: "PlusJakartaSans-SemiBold" }]} numberOfLines={2}>
          {recipe.title}
        </Text>
        <View style={styles.recipeMetrics}>
          <Text style={[styles.metricText, { fontFamily: "PlusJakartaSans-Regular", color: "#9E9E9E" }]}>
            {recipe.readyInMinutes || 30} mins • Easy
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderListCard = (recipe: Recipe) => (
    <TouchableOpacity key={recipe.id} style={styles.listCard} activeOpacity={0.8}>
      <View style={styles.listImageContainer}>
        <Image source={{ uri: recipe.image }} style={styles.listImage} />
        <View style={styles.saveIndicator}>
          <FontAwesome name="heart" size={10} color="#fff" />
        </View>
      </View>
      <View style={styles.listInfo}>
        <Text style={[styles.listName, { fontFamily: "PlusJakartaSans-SemiBold" }]}>
          {recipe.title}
        </Text>
        <View style={styles.listMetrics}>
          <View style={styles.listMetricItem}>
            <FontAwesome name="clock-o" size={12} color="#9E9E9E" />
            <Text style={[styles.listMetricText, { fontFamily: "PlusJakartaSans-Regular" }]}>
              {recipe.readyInMinutes || 30} mins
            </Text>
          </View>
          <View style={styles.listMetricItem}>
            <FontAwesome name="star" size={12} color="#FFD700" />
            <Text style={[styles.listMetricText, { fontFamily: "PlusJakartaSans-Regular" }]}>
              {recipe.rating?.toFixed(1) || "4.5"}
            </Text>
          </View>
          <Text style={[styles.listMetricText, { fontFamily: "PlusJakartaSans-Regular", opacity: 0.6 }]}>
            Saved recently
          </Text>
        </View>
      </View>
      <TouchableOpacity style={{ padding: 8 }}>
        <FontAwesome name="ellipsis-v" size={16} color="#9E9E9E" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderCollectionCard = (collection: any) => (
    <TouchableOpacity key={collection.id} style={styles.collectionCard} activeOpacity={0.9}>
      <Image source={collection.image} style={styles.collectionImage} />
      <View style={styles.collectionOverlay}>
        <View style={styles.collectionInfo}>
          <Text style={[styles.collectionName, { fontFamily: "PlusJakartaSans-SemiBold" }]}>
            {collection.name}
          </Text>
          <Text style={[styles.collectionCount, { fontFamily: "PlusJakartaSans-Regular" }]}>
            {collection.count} recipes
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Use RecipeCard component for grid view
  const renderRecipeCard = (recipe: Recipe) => (
    <View key={recipe.id} style={{ width: cardWidth, marginBottom: 15 }}>
      <RecipeCard
        id={recipe.id}
        imageSource={{ uri: recipe.image }}
        title={recipe.title}
        time={`${recipe.readyInMinutes || 30} mins`}
        servings={2}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContent}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.greeting, { fontFamily: "PlusJakartaSans-Bold" }]}>
              My Kitchen
            </Text>
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <FontAwesome name="plus" size={20} color="#4A90E2" />
          </TouchableOpacity>
        </View>
        <Text style={[styles.subtitle, { fontFamily: "PlusJakartaSans-SemiBold" }]}>
          Your culinary collection{"\n"}organized just the way you like it
        </Text>
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { fontFamily: "PlusJakartaSans-Bold" }]}>
              {totalSaved}
            </Text>
            <Text style={[styles.statLabel, { fontFamily: "PlusJakartaSans-Regular" }]}>
              Saved
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { fontFamily: "PlusJakartaSans-Bold" }]}>
              {totalCollections}
            </Text>
            <Text style={[styles.statLabel, { fontFamily: "PlusJakartaSans-Regular" }]}>
              Collections
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { fontFamily: "PlusJakartaSans-Bold" }]}>
              {avgRating}
            </Text>
            <Text style={[styles.statLabel, { fontFamily: "PlusJakartaSans-Regular" }]}>
              Avg Rating
            </Text>
          </View>
        </View>
        <View style={styles.searchBarContainer}>
          <View style={styles.searchBar}>
            <FontAwesome name="search" size={18} color="#9E9E9E" />
            <TextInput
              style={[styles.searchInput, { fontFamily: "PlusJakartaSans-Regular" }]}
              placeholder="Search your saved recipes..."
              placeholderTextColor="#9E9E9E"
            />
            <TouchableOpacity>
              <FontAwesome name="filter" size={18} color="#4A90E2" />
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
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {activeCategory === "Collections" ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { fontFamily: "PlusJakartaSans-SemiBold" }]}>
                Recipe Collections
              </Text>
            </View>
            <View style={styles.gridContainer}>
              {collections.map(renderCollectionCard)}
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { fontFamily: "PlusJakartaSans-SemiBold" }]}>
                {activeCategory === "All" ? "All Recipes" : activeCategory} ({filteredRecipes.length})
              </Text>
              <View style={styles.viewToggle}>
                <TouchableOpacity
                  style={[styles.toggleButton, viewMode === 'grid' && styles.activeToggleButton]}
                  onPress={() => setViewMode('grid')}
                >
                  <FontAwesome name="th" size={14} color={viewMode === 'grid' ? "#fff" : "#9E9E9E"} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleButton, viewMode === 'list' && styles.activeToggleButton]}
                  onPress={() => setViewMode('list')}
                >
                  <FontAwesome name="list" size={14} color={viewMode === 'list' ? "#fff" : "#9E9E9E"} />
                </TouchableOpacity>
              </View>
            </View>
            {filteredRecipes.length > 0 ? (
              viewMode === 'grid' ? (
                <View style={styles.gridContainer}>
                  {filteredRecipes.map(renderRecipeCard)}
                </View>
              ) : (
                <View style={styles.listContainer}>
                  {filteredRecipes.map(renderListCard)}
                </View>
              )
            ) : (
              <View style={styles.emptyStateContainer}>
                <View style={styles.emptyStateIcon}>
                  <FontAwesome name="heart-o" size={48} color="#9E9E9E" />
                </View>
                <Text style={[styles.emptyStateTitle, { fontFamily: "PlusJakartaSans-SemiBold" }]}>
                  No {activeCategory !== "All" ? activeCategory.toLowerCase() + " " : ""}recipes yet
                </Text>
                <Text style={[styles.emptyStateSubtitle, { fontFamily: "PlusJakartaSans-Regular" }]}>
                  Discover amazing recipes and start building your personal cookbook
                </Text>
                <TouchableOpacity style={styles.emptyStateButton}>
                  <Text style={[styles.emptyStateButtonText, { fontFamily: "PlusJakartaSans-SemiBold" }]}>
                    Explore Recipes
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
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
  loadingContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
  },
  loadingText: {
    fontSize: 16,
    color: "#666666",
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    paddingVertical: 20,
    marginTop: 10,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    color: "#000000ff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#9E9E9E",
  },
  searchBarContainer: {
    marginTop: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#424242",
  },
  categoryScroll: {
    paddingLeft: 5,
  },
  categoryBtnContainer: {
    marginRight: 12,
  },
  categoryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  categoryBtnText: {
    fontSize: 13,
  },
  scrollContainer: {
    flex: 1,
    marginTop: 15,
    paddingBottom: 100,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#000000ff",
  },
  viewToggle: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activeToggleButton: {
    backgroundColor: "#000000ff",
  },
  toggleText: {
    fontSize: 12,
    color: "#9E9E9E",
  },
  activeToggleText: {
    fontSize: 12,
    color: "#fff",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15,
  },
  recipeCard: {
    width: cardWidth,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  recipeImageContainer: {
    position: "relative",
  },
  recipeImage: {
    width: "100%",
    height: cardWidth * 0.8,
    resizeMode: "cover",
  },
  saveIndicator: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  recipeOverlay: {
    position: "absolute",
    bottom: 8,
    left: 8,
  },
  recipeInfo: {
    padding: 12,
  },
  recipeName: {
    fontSize: 14,
    color: "#000000ff",
    marginBottom: 6,
    lineHeight: 20,
  },
  recipeMetrics: {
    marginTop: 4,
  },
  metricBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  metricText: {
    fontSize: 11,
    color: "#fff",
  },
  listContainer: {
    gap: 12,
  },
  listCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  listImageContainer: {
    position: "relative",
    marginRight: 12,
  },
  listImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    resizeMode: "cover",
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: 15,
    color: "#000000ff",
    marginBottom: 6,
  },
  listMetrics: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  listMetricItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  listMetricText: {
    fontSize: 11,
    color: "#9E9E9E",
  },
  emptyStateContainer: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    marginBottom: 20,
    opacity: 0.3,
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
    marginBottom: 30,
  },
  emptyStateButton: {
    backgroundColor: "#000000ff",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyStateButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  collectionCard: {
    width: cardWidth,
    height: cardWidth * 0.7,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 15,
    position: "relative",
  },
  collectionImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  collectionOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  collectionInfo: {
    padding: 15,
  },
  collectionName: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 4,
  },
  collectionCount: {
    fontSize: 12,
    color: "#fff",
    opacity: 0.8,
  },
});

export default Saved;