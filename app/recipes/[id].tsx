import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
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
  Platform,
} from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
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

// Memoized ingredient item component for better performance
const IngredientItem = React.memo(
  ({
    ingredient,
    index,
    isChecked,
    onToggle,
  }: {
    ingredient: { name: string; amount: number; unit: string };
    index: number;
    isChecked: boolean;
    onToggle: (index: number) => void;
  }) => (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[styles.ingredientItem, isChecked && styles.ingredientItemChecked]}
      onPress={() => onToggle(index)}
    >
      <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
        {isChecked && <FontAwesome name="check" size={12} color="#fff" />}
      </View>
      <View style={styles.ingredientContent}>
        <Text
          style={[
            styles.ingredientName,
            isChecked && styles.ingredientNameChecked,
          ]}
        >
          {ingredient.name}
        </Text>
        <Text
          style={[
            styles.ingredientAmount,
            isChecked && styles.ingredientAmountChecked,
          ]}
        >
          {ingredient.amount} {ingredient.unit}
        </Text>
      </View>
    </TouchableOpacity>
  )
);

// Memoized instruction item component for better performance
const InstructionItem = React.memo(
  ({
    step,
    index,
    isCompleted,
    onToggle,
  }: {
    step: string;
    index: number;
    isCompleted: boolean;
    onToggle: (index: number) => void;
  }) => (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[
        styles.instructionItem,
        isCompleted && styles.instructionItemCompleted,
      ]}
      onPress={() => onToggle(index)}
    >
      <View style={styles.stepHeader}>
        <View
          style={[styles.stepNumber, isCompleted && styles.stepNumberCompleted]}
        >
          {isCompleted ? (
            <FontAwesome name="check" size={14} color="#fff" />
          ) : (
            <Text style={styles.stepNumberText}>{index + 1}</Text>
          )}
        </View>
        <Text style={styles.stepLabel}>Step {index + 1}</Text>
      </View>
      <Text
        style={[
          styles.instructionText,
          isCompleted && styles.instructionTextCompleted,
        ]}
      >
        {step}
      </Text>
    </TouchableOpacity>
  )
);

export default function RecipeDetails() {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"ingredients" | "instructions">(
    "ingredients"
  );
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<{
    [key: number]: boolean;
  }>({});
  const [completedSteps, setCompletedSteps] = useState<{
    [key: number]: boolean;
  }>({});

  const saveAnim = useRef(new Animated.Value(1)).current;
  const scrollY = useRef(new Animated.Value(0)).current;


  // Optimized toggle functions with useCallback to prevent re-renders
  const toggleIngredient = useCallback((index: number) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }, []);

  const toggleStep = useCallback((index: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }, []);

  // Memoize instruction steps parsing to avoid re-computation
  const instructionSteps = useMemo(() => {
    if (!recipe?.instructions) return [];

    const cleanInstructions = recipe.instructions
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim();

    const steps = cleanInstructions
      .split(/(?:\d+\.\s|\.\s+(?=[A-Z])|;\s+)/)
      .filter((step) => step.trim().length > 10)
      .map((step) => step.trim().replace(/^\.+/, ""));

    return steps.length > 1 ? steps : [cleanInstructions];
  }, [recipe?.instructions]);

  // Memoize tab change handler
  const handleTabChange = useCallback((tab: "ingredients" | "instructions") => {
    setActiveTab(tab);
  }, []);

  useEffect(() => {
    async function fetchRecipeDetails() {
      try {
        const response = await fetch(
          `http://192.168.1.35:8080/api/recipes/${id}`
        );
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
    const handleSave = useCallback(async () => {
    Animated.sequence([
      Animated.spring(saveAnim, { toValue: 1.3, useNativeDriver: true }),
      Animated.spring(saveAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
    setIsSaved((prev) => !prev);

    try {
      if (!isSaved) {
        await fetch(`http://192.168.1.35:8080/saved/save/${1}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
            title: recipe?.title ?? "",
            description: recipe?.description ?? "",
          }),
        });
      }else{
        await fetch(`http://192.168.1.35:8080/saved/unsave/${1}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
            title: recipe?.title ?? "",
            description: recipe?.description ?? "",
          }),
        });
      }
    } catch (error) {


    }
  }, [saveAnim]);


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
      <Stack.Screen options={{ headerShown: false }} />
      <Animated.ScrollView
        style={styles.scrollView}
        keyboardShouldPersistTaps="handled"
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
            colors={["transparent", "rgba(0,0,0,0.85)"]}
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
                <FontAwesome name="clock-o" size={16} color="#FF6B6B" />
                <Text style={styles.metaText}>{recipe.readyInMinutes} min</Text>
              </View>
              <View style={styles.metaCard}>
                <FontAwesome name="users" size={16} color="#4ECDC4" />
                <Text style={styles.metaText}>{recipe.servings} servings</Text>
              </View>
              <View style={styles.metaCard}>
                <FontAwesome name="star" size={16} color="#FFB400" />
                <Text style={styles.metaText}>
                  {recipe.rating?.toFixed(1) || "4.7"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Description */}
          <View style={styles.descriptionCard}>
            <Text
              style={styles.descriptionText}
              numberOfLines={showFullDesc ? undefined : 2}
            >
              {recipe.description ||
                "A delicious recipe that you'll love to make and share with family and friends."}
            </Text>
            {!showFullDesc && (
              <TouchableOpacity onPress={() => setShowFullDesc(true)}>
                <Text style={styles.showMoreText}>Read more</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            {["ingredients", "instructions"].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => handleTabChange(tab as any)}
              >
                <FontAwesome
                  name={tab === "ingredients" ? "list-ul" : "cutlery"}
                  size={16}
                  color={activeTab === tab ? "#fff" : "#666"}
                />
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab === "ingredients" ? "Ingredients" : "Instructions"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>
            {activeTab === "ingredients" ? (
              <View style={styles.contentCard}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>
                    Ingredients ({recipe.extendedIngredients?.length || 0})
                  </Text>
                  <Text style={styles.sectionSubtitle}>
                    Tap to check off items
                  </Text>
                </View>

                <View style={styles.ingredientsList}>
                  {recipe.extendedIngredients?.map((ingredient, index) => (
                    <IngredientItem
                      key={index}
                      ingredient={ingredient}
                      index={index}
                      isChecked={checkedIngredients[index] || false}
                      onToggle={toggleIngredient}
                    />
                  ))}
                </View>
              </View>
            ) : (
              <View style={styles.contentCard}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>
                    Instructions ({instructionSteps.length} steps)
                  </Text>
                  <Text style={styles.sectionSubtitle}>
                    Follow each step carefully
                  </Text>
                </View>

                <View style={styles.instructionsList}>
                  {instructionSteps.map((step, index) => (
                    <InstructionItem
                      key={index}
                      step={step}
                      index={index}
                      isCompleted={completedSteps[index] || false}
                      onToggle={toggleStep}
                    />
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.watchVideoButton}>
              <FontAwesome name="play" size={16} color="#fff" />
              <Text style={styles.watchVideoText}>Watch Video</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareButton}>
              <FontAwesome name="share-alt" size={16} color="#4ECDC4" />
              <Text style={styles.shareButtonText}>Share Recipe</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centered: { justifyContent: "center", alignItems: "center" },
  scrollView: { flex: 1 },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: "#666",
    fontFamily: "System",
    fontWeight: "500",
  },

  errorTitle: {
    fontSize: 24,
    fontFamily: "System",
    fontWeight: "800",
    marginTop: 20,
    color: "#333",
  },
  errorSubtitle: {
    fontSize: 16,
    color: "#666",
    fontFamily: "System",
    fontWeight: "400",
    textAlign: "center",
    marginVertical: 10,
    paddingHorizontal: 32,
  },
  retryButton: {
    backgroundColor: "#333",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    marginTop: 20,
    elevation: 3,
  },
  retryButtonText: {
    color: "#fff",
    fontFamily: "System",
    fontWeight: "600",
    fontSize: 16,
  },

  heroContainer: { height: height * 0.4, position: "relative" },
  heroImage: { width: "100%", height: "100%", resizeMode: "cover" },
  heroGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
    opacity: 100,
  },

  saveButton: {
    position: "absolute",
    top: (StatusBar.currentHeight || 44) + 10,
    right: 20,
    zIndex: 10,
  },
  saveButtonInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.95)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  saveButtonActive: { backgroundColor: "#FF6B6B" },

  heroContent: { position: "absolute", bottom: 24, left: 24, right: 24 },
  recipeTitle: {
    fontSize: 26,
    fontFamily: "Inter",
    fontWeight: "600",
    color: "#fff",
    marginBottom: 16,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    letterSpacing: -0.3,
  },
  metaContainer: { flexDirection: "row", flexWrap: "wrap" },
  metaCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    elevation: 1,
  },
  metaText: {
    marginLeft: 6,
    fontSize: 13,
    fontFamily: "System",
    fontWeight: "600",
    color: "#333",
  },

  contentContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    paddingTop: 8,
    minHeight: height * 0.6,
  },

  descriptionCard: {
    backgroundColor: "#fff",
    margin: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  descriptionText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
    fontFamily: "System",
    fontWeight: "400",
  },
  showMoreText: {
    marginTop: 8,
    color: "#333",
    fontFamily: "System",
    fontWeight: "600",
    fontSize: 14,
  },

  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: "#333",
    elevation: 2,
  },
  tabText: {
    marginLeft: 8,
    fontSize: 15,
    fontFamily: "System",
    fontWeight: "600",
    color: "#666",
  },
  activeTabText: { color: "#fff" },

  tabContent: { paddingHorizontal: 20, paddingBottom: 100 },

  contentCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },

  sectionHeader: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: "System",
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    fontFamily: "System",
    fontWeight: "500",
  },

  // Ingredients Styles
  ingredientsList: { gap: 12 },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafafa",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  ingredientItemChecked: {
    backgroundColor: "#f0f0f0",
    borderColor: "#333",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    backgroundColor: "#fff",
  },
  checkboxChecked: {
    backgroundColor: "#333",
    borderColor: "#333",
  },
  ingredientContent: { flex: 1 },
  ingredientName: {
    fontSize: 16,
    fontFamily: "System",
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
    textTransform: "capitalize",
  },
  ingredientNameChecked: {
    color: "#666",
    textDecorationLine: "line-through",
  },
  ingredientAmount: {
    fontSize: 13,
    color: "#666",
    fontFamily: "System",
    fontWeight: "500",
  },
  ingredientAmountChecked: {
    color: "#999",
  },

  // Instructions Styles
  instructionsList: { gap: 16 },
  instructionItem: {
    backgroundColor: "#fafafa",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderLeftWidth: 4,
    borderLeftColor: "#333",
  },
  instructionItemCompleted: {
    backgroundColor: "#f0f0f0",
    borderColor: "#333",
    opacity: 0.8,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepNumberCompleted: {
    backgroundColor: "#666",
  },
  stepNumberText: {
    fontSize: 14,
    fontFamily: "System",
    fontWeight: "700",
    color: "#fff",
  },
  stepNumberTextCompleted: {
    color: "#fff",
  },
  stepLabel: {
    fontSize: 14,
    fontFamily: "System",
    fontWeight: "600",
    color: "#333",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  instructionText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
    fontFamily: "System",
    fontWeight: "400",
  },
  instructionTextCompleted: {
    color: "#666",
    textDecorationLine: "line-through",
  },

  // Action Buttons
  actionButtonsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 24,
    bottom: 36,
    position: "absolute",
    left: 0,
    right: 0,
  },
  watchVideoButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#333",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  watchVideoText: {
    color: "#fff",
    fontFamily: "System",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8,
  },
  shareButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#333",
    elevation: 1,
  },
  shareButtonText: {
    color: "#333",
    fontFamily: "System",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8,
  },
});
