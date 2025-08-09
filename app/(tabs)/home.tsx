import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import RecipeCard from "../../components/RecipeCard";
import { useFonts } from "expo-font";
import { FlatList } from "react-native";

export default function Home() {
  const [fontsLoaded] = useFonts({
    "PlusJakartaSans-Bold": require("../../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "PlusJakartaSans-SemiBold": require("../../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "PlusJakartaSans-Medium": require("../../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "PlusJakartaSans-Regular": require("../../assets/fonts/PlusJakartaSans-Regular.ttf"),
  });

  type Recipe = {
    id: number;
    image: string;
    title: string;
    readyInMinutes: number;
    servings: number;
  };

  const [data, setData] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      const response = await fetch(
        "http://192.168.254.120:8080/api/recipes/recommendations"
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
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  if (loading) {
    return <ActivityIndicator size="large" color="blue" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        <View style={styles.headerTop}>
          <View>
            <Text
              style={[styles.greeting, { fontFamily: "PlusJakartaSans-Bold" }]}
            >
              Good Morning
            </Text>
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <FontAwesome name="bars" size={24} color="#000000" />
          </TouchableOpacity>
        </View>

        <Text
          style={[styles.subtitle, { fontFamily: "PlusJakartaSans-SemiBold" }]}
        >
          Feeling hungry?{"\n"}What are we cookin' today?
        </Text>

        <View style={styles.searchBarContainer}>
          <View style={styles.searchBar}>
            <FontAwesome name="search" size={20} color="#9E9E9E" />
            <TextInput
              style={[
                styles.searchInput,
                { fontFamily: "PlusJakartaSans-Regular" },
              ]}
              placeholder="Search any recipe..."
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
          <TouchableOpacity
            style={[styles.categoryBtn, styles.categoryBtnActive]}
          >
            <Text
              style={[
                styles.categoryBtnTextActive,
                { fontFamily: "PlusJakartaSans-Regular" },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryBtn}>
            <Text
              style={[
                styles.categoryBtnText,
                { fontFamily: "PlusJakartaSans-Regular" },
              ]}
            >
              Breakfast
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryBtn}>
            <Text
              style={[
                styles.categoryBtnText,
                { fontFamily: "PlusJakartaSans-Regular" },
              ]}
            >
              Lunch
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryBtn}>
            <Text
              style={[
                styles.categoryBtnText,
                { fontFamily: "PlusJakartaSans-Regular" },
              ]}
            >
              Dinner
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Recommendation Section */}
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { fontFamily: "PlusJakartaSans-SemiBold" },
            ]}
          >
            Recipe For You
          </Text>
          <FlatList
            data={data.slice(0, 5)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <RecipeCard
                id={item.id}
                imageSource={{ uri: item.image }}
                title={item.title}
                time={`${item.readyInMinutes} mins`}
                servings={item.servings}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Recipe of The Week Section */}
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
  categoryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "transparent",
    marginRight: 12,
  },
  categoryBtnActive: {
    backgroundColor: "#000000ff",
  },
  categoryBtnText: {
    color: "#000000ff",
    fontSize: 14,
  },
  categoryBtnTextActive: {
    color: "#fff",
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
});
