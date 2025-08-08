import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  Animated,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

type Recipe = {
  id: string;
  image: string;
  title: string;
  readyInMinutes: number;
  servings: number;
  instructions: string;
  extendedIngredients: Array<{
    name: string;
    amount: number;
    unit: string;
  }>;
  description: string;   // Add description field
  difficulty: string;    // Add difficulty field (e.g., "Medium")
  rating: number;        // Add rating field (e.g., 4.7)
};

export default function RecipeDetails() {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');
  const [showFullDesc, setShowFullDesc] = useState(false);
  const scrollY = new Animated.Value(0);

  const handleSave = () => {
    setIsSaved(!isSaved);
    // TODO: Implement save functionality with backend
  };

  useEffect(() => {
    async function fetchRecipeDetails() {
      try {
        const response = await fetch(`http://localhost:8080/api/recipes/${id}`);
        if (!response.ok) {
          throw new Error("Recipe not found");
        }
        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipeDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Preparing your recipe...</Text>
        </View>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={[styles.container, styles.centered]}>
        <View style={styles.errorContainer}>
          <FontAwesome name="exclamation-triangle" size={64} color="#FF6B6B" />
          <Text style={styles.errorTitle}>Recipe Not Found</Text>
          <Text style={styles.errorSubtitle}>
            We couldn't find the recipe you're looking for.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <Animated.ScrollView
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image Section */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: recipe.image }} style={styles.heroImage} />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.heroGradient}
          />

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <View style={[styles.saveButtonInner, isSaved && styles.saveButtonActive]}>
              <FontAwesome
                name={isSaved ? "heart" : "heart-o"}
                size={24}
                color={isSaved ? "#fff" : "#666"}
              />
            </View>
          </TouchableOpacity>

          {/* Recipe Title & Meta */}
          <View style={styles.heroContent}>
            <Text style={styles.recipeTitle}>{recipe.title}</Text>
            <View style={styles.metaContainer}>
              {/* Cook Time */}
              <View style={styles.metaCard}>
                <FontAwesome name="clock-o" size={16} color="#444" />
                <Text style={styles.metaText}>{recipe.readyInMinutes} min</Text>
              </View>

              {/* Difficulty */}
              <View style={styles.metaCard}>
                <FontAwesome name="signal" size={16} color="#444" />
                <Text style={styles.metaText}>{recipe.difficulty || "Medium"}</Text>
              </View>

              {/* Rating */}
              <View style={[styles.metaCard, styles.ratingCard]}>
                <FontAwesome name="star" size={16} color="#FFB400" />
                <Text style={styles.metaText}>{recipe.rating?.toFixed(1) || "4.7"}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText} numberOfLines={showFullDesc ? undefined : 3}>
            {recipe.description}
          </Text>
          {!showFullDesc && (
            <TouchableOpacity onPress={() => setShowFullDesc(true)}>
              <Text style={styles.showMoreText}>Show more</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Content Section */}
        <View style={styles.contentContainer}>
          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'ingredients' && styles.activeTab]}
              onPress={() => setActiveTab('ingredients')}
            >
              <Text style={[styles.tabText, activeTab === 'ingredients' && styles.activeTabText]}>
                Ingredients
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'instructions' && styles.activeTab]}
              onPress={() => setActiveTab('instructions')}
            >
              <Text style={[styles.tabText, activeTab === 'instructions' && styles.activeTabText]}>
                Directions
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {activeTab === 'ingredients' ? (
            <View style={styles.tabContent}>
              <View style={styles.ingredientsHeader}>
                <Text style={styles.sectionTitle}>
                  {recipe.extendedIngredients?.length || 0} Ingredients
                </Text>
                <Text style={styles.sectionSubtitle}>
                  Everything you need for this recipe
                </Text>
              </View>

              <View style={styles.ingredientsList}>
                {recipe.extendedIngredients?.map((ingredient, index) => (
                  <View key={index} style={styles.ingredientCard}>
                    <View style={styles.ingredientCheckbox}>
                      <FontAwesome name="check" size={14} color="#4ECDC4" />
                    </View>
                    <View style={styles.ingredientContent}>
                      <Text style={styles.ingredientName}>{ingredient.name}</Text>
                      <Text style={styles.ingredientAmount}>
                        {ingredient.amount} {ingredient.unit}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.tabContent}>
              <View style={styles.instructionsHeader}>
                <Text style={styles.sectionTitle}>How to Cook</Text>
                <Text style={styles.sectionSubtitle}>
                  Follow these steps for the perfect result
                </Text>
              </View>

              <View style={styles.instructionsCard}>
                <Text style={styles.instructionsText}>{recipe.instructions}</Text>
              </View>
            </View>
          )}

          {/* Watch Video Button */}
          <TouchableOpacity style={styles.watchVideoButton}>
            <Text style={styles.watchVideoText}>Watch Video</Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },

  // Loading States
  loadingContainer: {
    alignItems: "center",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  errorContainer: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  // Hero Section
  heroContainer: {
    height: height * 0.45,
    position: "relative",
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  heroGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
  },
  saveButton: {
    position: "absolute",
    top: (StatusBar.currentHeight || 44) + 10,
    right: 20,
    zIndex: 10,
  },
  saveButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonActive: {
    backgroundColor: "#FF6B6B",
  },
  heroContent: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  recipeTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 12,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
    lineHeight: 34,
  },
  metaContainer: {
    flexDirection: "row",
    gap: 16,
  },
  metaCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 12,
  },
  ratingCard: {
    backgroundColor: "#fff",
  },
  metaText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  // Description
  descriptionContainer: {
    marginHorizontal: 24,
    marginTop: 20,
  },
  descriptionText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
    fontWeight: "400",
  },
  showMoreText: {
    marginTop: 4,
    color: "#4ECDC4",
    fontWeight: "600",
  },

  // Content Section
  contentContainer: {
    backgroundColor: "#FAFAFA",
    marginTop: 24,
    paddingTop: 0,
    minHeight: height * 0.5,
  },

  // Tabs
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    marginHorizontal: 24,
    borderRadius: 20,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  activeTabText: {
    color: "#333",
  },
  tabContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  // Section Headers
  ingredientsHeader: {
    marginBottom: 24,
  },
  instructionsHeader: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#333",
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },

  // Ingredients
  ingredientsList: {
    gap: 12,
  },
  ingredientCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  ingredientCheckbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E8F8F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  ingredientContent: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
    textTransform: "capitalize",
  },
  ingredientAmount: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },

  // Instructions
  instructionsCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  instructionsText: {
    fontSize: 16,
    color: "#444",
    lineHeight: 26,
    fontWeight: "400",
  },

  // Watch Video Button
  watchVideoButton: {
    marginTop: 20,
    marginHorizontal: 24,
    backgroundColor: "#2A9D8F",
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: "center",
    shadowColor: "#1E776E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 5,
  },
  watchVideoText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
