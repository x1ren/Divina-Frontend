import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { useFonts } from "expo-font";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import RecipeCard from "@/components/RecipeCard"; // adjust import path

type Recipe = {
  id: number;
  title: string;
  readyInMinutes?: number;
  rating?: number;
  image?: string;
  category?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
};

type CategoryFilter = 'all' | 'breakfast' | 'lunch' | 'dinner' | 'snack';

const url = "192.168.1.35:8080";

const fetchSavedRecipes = async (): Promise<Recipe[]> => {
  const res = await fetch(`http://${url}/api/save/recipes/1`);
  if (!res.ok) throw new Error("Failed to fetch saved recipes");
  const data = await res.json();
  console.log("[fetchSavedRecipes] API returned:", data);
  return data;
};

const categoryIcons: Record<CategoryFilter, "th-list" | "coffee" | "sun-o" | "cutlery" | "star-o"> = {
  all: 'th-list',
  breakfast: 'coffee',
  lunch: 'sun-o',
  dinner: 'cutlery',
  snack: 'star-o'
};

const categoryLabels = {
  all: 'All',
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack'
};

const Saved = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [animatedValue] = useState(new Animated.Value(0));

  const [fontsLoaded] = useFonts({
    "PlusJakartaSans-Bold": require("../../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "PlusJakartaSans-SemiBold": require("../../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "PlusJakartaSans-Medium": require("../../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "PlusJakartaSans-Regular": require("../../assets/fonts/PlusJakartaSans-Regular.ttf"),
  });

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

  // Filter recipes based on selected category
  const filteredRecipes = useMemo(() => {
    if (selectedCategory === 'all') return recipes;
    return recipes.filter(recipe => recipe.category === selectedCategory);
  }, [recipes, selectedCategory]);

  // Debug logging
  React.useEffect(() => {
    const cached = queryClient.getQueryData(["savedRecipes"]);
    console.log("[SavedTab] useQuery state:", {
      isLoading,
      isFetching,
      recipesLength: recipes.length,
      cached,
    });
  }, [recipes, isLoading, isFetching, queryClient]);

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleCategoryPress = (category: CategoryFilter) => {
    setSelectedCategory(category);
    // Add subtle animation for category change
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  if (!fontsLoaded) return null;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <FontAwesome name="heart" size={24} color="#FF6B6B" />
          <Text style={[styles.loadingText, { fontFamily: "PlusJakartaSans-Medium" }]}>
            Loading your saved recipes...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Modern Header with Recipe Count */}
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <Text style={[styles.greeting, { fontFamily: "PlusJakartaSans-Bold" }]}>
            My Kitchen
          </Text>
          <View style={styles.statsContainer}>
            <View style={styles.statBadge}>
              <FontAwesome name="heart" size={16} color="#FF6B6B" />
              <Text style={[styles.statNumber, { fontFamily: "PlusJakartaSans-Bold" }]}>
                {recipes.length}
              </Text>
            </View>
            <Text style={[styles.statLabel, { fontFamily: "PlusJakartaSans-Regular" }]}>
              saved recipe{recipes.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      </View>

      {/* Recipe List with Animation */}
      <Animated.View style={[styles.contentContainer, { opacity: animatedValue, transform: [{ scale: animatedValue }] }]}>
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {filteredRecipes.length > 0 ? (
            <View style={styles.recipeGrid}>
              {filteredRecipes.map((recipe, index) => (
                <Animated.View 
                  key={recipe.id} 
                  style={[
                    styles.recipeCardContainer,
                    {
                      opacity: animatedValue,
                      transform: [{
                        translateY: animatedValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0]
                        })
                      }]
                    }
                  ]}
                >
                  <RecipeCard
                    id={recipe.id}
                    imageSource={{ uri: recipe.image }}
                    title={recipe.title}
                    time={`${recipe.readyInMinutes ?? 0} mins`}
                    servings={2}
                  />
                </Animated.View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyStateCard}>
                <FontAwesome name="heart-o" size={48} color="#E0E0E0" />
                <Text style={[styles.emptyStateTitle, { fontFamily: "PlusJakartaSans-SemiBold" }]}>
                  No {selectedCategory !== 'all' ? categoryLabels[selectedCategory].toLowerCase() + ' ' : ''}recipes yet
                </Text>
                <Text style={[styles.emptyStateSubtitle, { fontFamily: "PlusJakartaSans-Regular" }]}>
                  Start exploring and save your favorite recipes!
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </Animated.View>

      {/* Modern Category Filter at Bottom */}
      <View style={styles.categoryContainer}>
        <View style={styles.categoryFilterCard}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {(Object.keys(categoryLabels) as CategoryFilter[]).map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonActive
                ]}
                onPress={() => handleCategoryPress(category)}
                activeOpacity={0.7}
              >
                <FontAwesome 
                  name={categoryIcons[category]} 
                  size={18} 
                  color={selectedCategory === category ? '#FFFFFF' : '#666666'} 
                />
                <Text style={[
                  styles.categoryButtonText,
                  { fontFamily: "PlusJakartaSans-Medium" },
                  selectedCategory === category && styles.categoryButtonTextActive
                ]}>
                  {categoryLabels[category]}
                </Text>
                {selectedCategory === category && (
                  <View style={styles.activeIndicator} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: '#FFFFFF',
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 12,
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerContent: {
    paddingHorizontal: 24,
  },
  greeting: {
    fontSize: 28,
    color: '#1A1A1A',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statNumber: {
    fontSize: 16,
    color: '#FF6B6B',
  },
  statLabel: {
    fontSize: 16,
    color: '#666666',
  },
  contentContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 120, // Space for category bar
  },
  recipeGrid: {
    padding: 20,
    gap: 16,
  },
  recipeCardContainer: {
    marginBottom: 4,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateCard: {
    backgroundColor: '#FFFFFF',
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyStateTitle: {
    fontSize: 18,
    color: '#1A1A1A',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#999999',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  categoryContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  categoryFilterCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  categoryScroll: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginRight: 12,
    gap: 8,
    position: 'relative',
    minWidth: 100,
    justifyContent: 'center',
  },
  categoryButtonActive: {
    backgroundColor: '#FF6B6B',
    transform: [{ scale: 1.05 }],
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666666',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -4,
    width: 8,
    height: 8,
    backgroundColor: '#FF6B6B',
    borderRadius: 4,
  },
});

export default Saved;