import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Platform,
} from "react-native";
import { router } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";
import RecipeCard from "../../components/RecipeCard";
import { useFonts } from "expo-font";

type Recipe = {
  id: number;
  image: string;
  title: string;
  readyInMinutes: number;
  servings: number;
};

type SearchSuggestion = {
  id: number;
  title: string;
  type: string; // 'recipe', 'ingredient', 'cuisine'
};

export default function Home() {
  const [fontsLoaded] = useFonts({
    "PlusJakartaSans-Bold": require("../../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "PlusJakartaSans-SemiBold": require("../../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "PlusJakartaSans-Medium": require("../../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "PlusJakartaSans-Regular": require("../../assets/fonts/PlusJakartaSans-Regular.ttf"),
  });

  const [data, setData] = useState<Recipe[]>([]);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<
    SearchSuggestion[]
  >([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const url = Platform.select({
    android: "10.0.2.2:8080",
    default: "192.168.1.35:8080",
  });
  const [activeCategory, setActiveCategory] = useState("All");
  const searchInputRef = useRef<TextInput>(null);

  const handleDismissSearch = useCallback(() => {
    Keyboard.dismiss();
    setSearchQuery("");
    setSearchResults([]);
    setSearchSuggestions([]);
    setShowDropdown(false);
    if (searchInputRef.current) {
      searchInputRef.current.clear();
    }
  }, []);

  // Clear search when screen comes into focus (user navigates back)
  useFocusEffect(
    useCallback(() => {
      // Clear search state
      setSearchQuery("");
      setSearchResults([]);
      setSearchSuggestions([]);
      setShowDropdown(false);
      // Also clear the search input text
      if (searchInputRef.current) {
        searchInputRef.current.clear();
      }
    }, [])
  );

  // Animation values for each category
  const [animationValues] = useState(() => {
    const values: { [key: string]: Animated.Value } = {};
    ["All", "Breakfast", "Lunch", "Dinner"].forEach((category) => {
      values[category] = new Animated.Value(category === "All" ? 1 : 0);
    });
    return values;
  });

  const fetchData = useCallback(
    async (activeCategory: string) => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://${url}/api/recipes/recommendations/${activeCategory}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const validData = data.filter(
          (item: any) =>
            item &&
            item.title &&
            item.image &&
            typeof item.readyInMinutes === "number" &&
            typeof item.servings === "number"
        );

        setData(validData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    },
    [url]
  );

  // Fetch search suggestions
  const fetchSearchSuggestions = useCallback(
    async (query: string) => {
      if (query.length < 2) {
        setSearchSuggestions([]);
        setShowDropdown(false);
        return;
      }

      setLoadingSuggestions(true);

      try {
        const response = await fetch(
          `http://${url}/api/recipes/search?query=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const titlesList = await response.json(); // This is List<String> from your backend

        // Convert string titles to SearchSuggestion objects
        const suggestions = titlesList.map((title: string, index: number) => ({
          id: index + 1,
          title: title,
          type: "recipe",
        }));

        setSearchSuggestions(suggestions);
        setShowDropdown(suggestions.length > 0);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSearchSuggestions([]);
        setShowDropdown(false);
      } finally {
        setLoadingSuggestions(false);
      }
    },
    [url]
  );

  // Perform search function (uncommented and fixed)
  const performSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) return;

      setLoading(true);

      try {
        const response = await fetch(
          `http://${url}/api/recipes/search?q=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const recipeTitles = await response.json(); // List<String>
        setSearchResults(recipeTitles);
        setActiveCategory("Search Results");
      } catch (error) {
        console.error("Error performing search:", error);
        setSearchResults([]);
      } finally {
        setLoading(false);
        setShowDropdown(false);
      }
    },
    [url]
  );

  useEffect(() => {
    fetchData(activeCategory);
  }, [activeCategory, fetchData]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSearchSuggestions(searchQuery);
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery, fetchSearchSuggestions]);

  const categories = ["All", "Breakfast", "Lunch", "Dinner"];

  const handleCategoryPress = useCallback(
    (category: string) => {
      setActiveCategory(category);
      setSearchQuery(""); // Clear search when selecting category
      setSearchResults([]); // Clear search results
      setShowDropdown(false);

      // Animate all buttons
      Object.keys(animationValues).forEach((cat) => {
        Animated.timing(animationValues[cat], {
          toValue: cat === category ? 1 : 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      });
    },
    [animationValues]
  );

  const handleSuggestionPress = useCallback(
    (suggestion: SearchSuggestion) => {
      setSearchQuery(suggestion.title);
      setShowDropdown(false);
      performSearch(suggestion.title);
    },
    [performSearch]
  );

  const handleSearchSubmit = useCallback(() => {
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    }
  }, [searchQuery, performSearch]);

  const getSuggestionIcon = useCallback((type: string) => {
    switch (type) {
      case "recipe":
        return "cutlery";
      case "ingredient":
        return "leaf";
      case "cuisine":
        return "globe";
      default:
        return "search";
    }
  }, []);

  const handleRecipeSelect = useCallback((title: string) => {
    console.log("Selected recipe:", title);
    // Add your navigation or selection logic here
    // Example: router.push(`/recipe/${encodeURIComponent(title)}`);
  }, []);

  const renderRecipeCard = useCallback(
    ({ item }: { item: Recipe }) => (
      <RecipeCard
        id={item.id}
        imageSource={{ uri: item.image }}
        title={item.title}
        time={`${item.readyInMinutes} mins`}
        servings={item.servings}
        category={activeCategory}
      />
    ),
    [activeCategory]
  );

  const renderSuggestionItem = useCallback(
    ({ item }: { item: SearchSuggestion }) => (
      <TouchableOpacity
        style={styles.suggestionItem}
        onPress={() => handleSuggestionPress(item)}
      >
        <FontAwesome
          name={getSuggestionIcon(item.type)}
          size={16}
          color="#9E9E9E"
        />
        <Text
          style={[
            styles.suggestionText,
            { fontFamily: "PlusJakartaSans-Regular" },
          ]}
        >
          {item.title}
        </Text>
        <Text
          style={[
            styles.suggestionType,
            { fontFamily: "PlusJakartaSans-Regular" },
          ]}
        >
          {item.type}
        </Text>
      </TouchableOpacity>
    ),
    [getSuggestionIcon, handleSuggestionPress]
  );

  const renderSearchResult = useCallback(
    ({ item, index }: { item: string; index: number }) => (
      <TouchableOpacity
        style={styles.searchResultItem}
        onPress={() => handleRecipeSelect(item)}
      >
        <FontAwesome name="cutlery" size={18} color="#4A90E2" />
        <Text
          style={[
            styles.searchResultText,
            { fontFamily: "PlusJakartaSans-Regular" },
          ]}
        >
          {item}
        </Text>
        <FontAwesome name="chevron-right" size={14} color="#9E9E9E" />
      </TouchableOpacity>
    ),
    [handleRecipeSelect]
  );

  // Early returns for loading states
  if (!fontsLoaded) {
    return null;
  }

  if (loading && data.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text
          style={[
            styles.loadingText,
            { fontFamily: "PlusJakartaSans-Regular" },
          ]}
        >
          {activeCategory === "Search Results"
            ? "Searching recipes..."
            : "Loading recipes..."}
        </Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={handleDismissSearch}>
      <View style={styles.container}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View>
              <Text
                style={[
                  styles.greeting,
                  { fontFamily: "PlusJakartaSans-Bold" },
                ]}
              >
                Good Morning
              </Text>
            </View>
            <TouchableOpacity style={styles.menuButton}>
              <FontAwesome name="bars" size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.subtitle,
              { fontFamily: "PlusJakartaSans-SemiBold" },
            ]}
          >
            Feeling hungry?{"\n"}What are we cookin' today?
          </Text>

          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.searchBarContainer}>
              <View style={styles.searchBar}>
                <FontAwesome name="search" size={20} color="#9E9E9E" />
                <TextInput
                  ref={searchInputRef}
                  style={[
                    styles.searchInput,
                    { fontFamily: "PlusJakartaSans-Regular" },
                  ]}
                  placeholder="Search any recipe..."
                  placeholderTextColor="#9E9E9E"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={handleSearchSubmit}
                  returnKeyType="search"
                />
                <TouchableOpacity>
                  <FontAwesome name="sliders" size={20} color="#4A90E2" />
                </TouchableOpacity>
              </View>

              {/* Dropdown Suggestions */}
              {showDropdown && (
                <View style={styles.dropdownContainer}>
                  {loadingSuggestions ? (
                    <View style={styles.dropdownLoading}>
                      <ActivityIndicator size="small" color="#4A90E2" />
                      <Text
                        style={[
                          styles.loadingText,
                          { fontFamily: "PlusJakartaSans-Regular" },
                        ]}
                      >
                        Loading suggestions...
                      </Text>
                    </View>
                  ) : (
                    <FlatList
                      data={searchSuggestions}
                      renderItem={renderSuggestionItem}
                      keyExtractor={(item) => item.id.toString()}
                      style={styles.dropdownScroll}
                      keyboardShouldPersistTaps="always"
                      showsVerticalScrollIndicator={false}
                    />
                  )}
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>

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

        {/* Recommendation/Search Results Section */}
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                { fontFamily: "PlusJakartaSans-SemiBold" },
              ]}
            >
              {activeCategory === "Search Results"
                ? `Search Results for "${searchQuery}"`
                : "Recipe For You"}
            </Text>

            {activeCategory === "Search Results" ? (
              // Show search results as simple list
              searchResults.length > 0 ? (
                <FlatList
                  data={searchResults}
                  renderItem={renderSearchResult}
                  keyExtractor={(item, index) => `${item}-${index}`}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <View style={styles.noResults}>
                  <FontAwesome name="search" size={48} color="#E0E0E0" />
                  <Text
                    style={[
                      styles.noResultsText,
                      { fontFamily: "PlusJakartaSans-Regular" },
                    ]}
                  >
                    No recipes found for "{searchQuery}"
                  </Text>
                </View>
              )
            ) : // Show recipe cards for categories
            data.length > 0 ? (
              <FlatList
                data={data.slice(0, 5)}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderRecipeCard}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            ) : (
              <View style={styles.noResults}>
                <FontAwesome name="search" size={48} color="#E0E0E0" />
                <Text
                  style={[
                    styles.noResultsText,
                    { fontFamily: "PlusJakartaSans-Regular" },
                  ]}
                >
                  No recipes available
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    fontSize: 16,
    color: "#9E9E9E",
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
    zIndex: 1000,
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
  dropdownContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 8,
    maxHeight: 200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownLoading: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    gap: 10,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    gap: 12,
  },
  suggestionText: {
    flex: 1,
    fontSize: 16,
    color: "#424242",
  },
  suggestionType: {
    fontSize: 12,
    color: "#9E9E9E",
    textTransform: "capitalize",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
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
  noResults: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 15,
  },
  noResultsText: {
    fontSize: 16,
    color: "#9E9E9E",
    textAlign: "center",
  },
  searchResultText: {
    fontSize: 16,
    color: "#424242",
    flex: 1,
    marginLeft: 12,
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    gap: 12,
  },
});
