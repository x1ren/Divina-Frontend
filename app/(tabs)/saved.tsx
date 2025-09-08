import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
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
};
const url = "192.168.1.35:8080";
const fetchSavedRecipes = async (): Promise<Recipe[]> => {
  const res = await fetch(`http://${url}/api/save/recipes/1`); // change to your backend URL
  if (!res.ok) throw new Error("Failed to fetch saved recipes");
  return res.json();
};

const Saved = () => {
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
    // ensure we re-sync with backend when this screen mounts
    refetchOnMount: true,
    // keep cached data for fast startup
    staleTime: 1000 * 60,
  });

  const queryClient = useQueryClient();

  // Debug: log savedRecipes cache and query status to help diagnose disappearance
  React.useEffect(() => {
    const cached = queryClient.getQueryData(["savedRecipes"]);
    // eslint-disable-next-line no-console
    console.log("[SavedTab] useQuery state:", {
      isLoading,
      isFetching,
      recipesLength: recipes.length,
      cached,
    });
  }, [recipes, isLoading, isFetching, queryClient]);

  if (!fontsLoaded) return null;
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading saved recipes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContent}>
        <Text style={[styles.greeting, { fontFamily: "PlusJakartaSans-Bold" }]}>
          My Kitchen
        </Text>
        <Text
          style={[styles.subtitle, { fontFamily: "PlusJakartaSans-SemiBold" }]}
        >
          You have {recipes.length} saved recipe
          {recipes.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* Recipe list */}
      <ScrollView style={styles.scrollContainer}>
        {recipes.length > 0 ? (
          <View style={{ gap: 20, padding: 16 }}>
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                id={recipe.id}
                imageSource={{ uri: recipe.image }}
                title={recipe.title}
                time={`${recipe.readyInMinutes ?? 0} mins`}
                servings={2} // you can adjust if backend has servings
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyStateContainer}>
            <FontAwesome name="heart-o" size={48} color="#9E9E9E" />
            <Text>No saved recipes yet</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 30 },
  headerContent: { paddingHorizontal: 20, marginBottom: 20 },
  greeting: { fontSize: 16, color: "#000" },
  subtitle: { fontSize: 20, color: "#000", marginTop: 8 },
  scrollContainer: { flex: 1 },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
});

export default Saved;
