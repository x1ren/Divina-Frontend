import React, { useEffect, useState, useRef } from "react";
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
  description: string;
  difficulty: string;
  rating: number;
};

export default function RecipeDetails() {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"ingredients" | "instructions">(
    "ingredients"
  );
  const [showFullDesc, setShowFullDesc] = useState(false);

  const saveAnim = useRef(new Animated.Value(1)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleSave = () => {
    Animated.sequence([
      Animated.spring(saveAnim, { toValue: 1.3, useNativeDriver: true }),
      Animated.spring(saveAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
    setIsSaved(!isSaved);
  };

  useEffect(() => {
    async function fetchRecipeDetails() {
      try {
        const response = await fetch(`http://localhost:8080/api/recipes/${id}`);
        if (!response.ok) throw new Error("Recipe not found");
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
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Preparing your recipe...</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={[styles.container, styles.centered]}>
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
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <Animated.ScrollView
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: recipe.image }} style={styles.heroImage} />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.75)"]}
            style={styles.heroGradient}
          />

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Animated.View
              style={[
                styles.saveButtonInner,
                isSaved && styles.saveButtonActive,
                { transform: [{ scale: saveAnim }] },
              ]}
            >
              <FontAwesome
                name={isSaved ? "heart" : "heart-o"}
                size={24}
                color={isSaved ? "#fff" : "#666"}
              />
            </Animated.View>
          </TouchableOpacity>

          {/* Title + Meta */}
          <View style={styles.heroContent}>
            <Text style={styles.recipeTitle}>{recipe.title}</Text>
            <View style={styles.metaContainer}>
              <View style={styles.metaCard}>
                <FontAwesome name="clock-o" size={16} color="#444" />
                <Text style={styles.metaText}>
                  {recipe.readyInMinutes} min
                </Text>
              </View>
              <View style={styles.metaCard}>
                <FontAwesome name="signal" size={16} color="#444" />
                <Text style={styles.metaText}>
                  {recipe.difficulty || "Medium"}
                </Text>
              </View>
              <View style={[styles.metaCard, styles.ratingCard]}>
                <FontAwesome name="star" size={16} color="#FFB400" />
                <Text style={styles.metaText}>
                  {recipe.rating?.toFixed(1) || "4.7"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text
            style={styles.descriptionText}
            numberOfLines={showFullDesc ? undefined : 3}
          >
            {recipe.description}
          </Text>
          {!showFullDesc && (
            <TouchableOpacity onPress={() => setShowFullDesc(true)}>
              <Text style={styles.showMoreText}>Show more</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {["ingredients", "instructions"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab,
              ]}
              onPress={() => setActiveTab(tab as any)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab === "ingredients" ? "Ingredients" : "Directions"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === "ingredients" ? (
            <>
              <Text style={styles.sectionTitle}>
                {recipe.extendedIngredients?.length || 0} Ingredients
              </Text>
              <Text style={styles.sectionSubtitle}>
                Everything you need for this recipe
              </Text>
              <View style={{ marginTop: 20 }}>
                {recipe.extendedIngredients?.map((ing, index) => (
                  <View key={index} style={styles.ingredientCard}>
                    <View style={styles.ingredientCheckbox}>
                      <FontAwesome name="check" size={14} color="#4ECDC4" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.ingredientName}>{ing.name}</Text>
                      <Text style={styles.ingredientAmount}>
                        {ing.amount} {ing.unit}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <>
              <Text style={styles.sectionTitle}>How to Cook</Text>
              <Text style={styles.sectionSubtitle}>
                Follow these steps for the perfect result
              </Text>
              <View style={styles.instructionsCard}>
                <Text style={styles.instructionsText}>
                  {recipe.instructions}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Watch Video Button */}
        <TouchableOpacity style={styles.watchVideoButton}>
          <Text style={styles.watchVideoText}>Watch Video</Text>
        </TouchableOpacity>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  centered: { justifyContent: "center", alignItems: "center" },
  scrollView: { flex: 1 },
  loadingText: { marginTop: 20, fontSize: 16, color: "#666" },

  errorTitle: { fontSize: 24, fontWeight: "bold", marginTop: 20 },
  errorSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginVertical: 10,
  },
  retryButton: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    marginTop: 10,
  },
  retryButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },

  heroContainer: { height: height * 0.45, position: "relative" },
  heroImage: { width: "100%", height: "100%" },
  heroGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
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
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonActive: { backgroundColor: "#FF6B6B" },
  heroContent: { position: "absolute", bottom: 20, left: 20, right: 20 },
  recipeTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 12,
  },
  metaContainer: { flexDirection: "row" },
  metaCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 12,
  },
  ratingCard: { backgroundColor: "#fff" },
  metaText: { marginLeft: 6, fontSize: 14, fontWeight: "600", color: "#333" },

  descriptionContainer: { marginHorizontal: 24, marginTop: 20 },
  descriptionText: { fontSize: 14, color: "#444", lineHeight: 20 },
  showMoreText: { marginTop: 4, color: "#4ECDC4", fontWeight: "600" },

  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    marginHorizontal: 24,
    borderRadius: 20,
    padding: 4,
    marginTop: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 16,
  },
  activeTab: {
    backgroundColor: "#fff",
    elevation: 3,
  },
  tabText: { fontSize: 16, fontWeight: "600", color: "#666" },
  activeTabText: { color: "#333" },

  tabContent: { paddingHorizontal: 24, paddingBottom: 40 },
  sectionTitle: { fontSize: 24, fontWeight: "800", color: "#333" },
  sectionSubtitle: { fontSize: 16, color: "#666", marginTop: 4 },

  ingredientCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
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
  ingredientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
    textTransform: "capitalize",
  },
  ingredientAmount: { fontSize: 14, color: "#666" },

  instructionsCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    marginTop: 20,
  },
  instructionsText: { fontSize: 16, color: "#444", lineHeight: 26 },

  watchVideoButton: {
    marginHorizontal: 24,
    backgroundColor: "#2A9D8F",
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: "center",
    marginBottom: 40,
    elevation: 4,
  },
  watchVideoText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
