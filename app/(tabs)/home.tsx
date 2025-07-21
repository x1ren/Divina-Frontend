import React from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import RecipeCard from "../../components/RecipeCard";
import { useFonts } from "expo-font";

export default function Home() {
  const [fontsLoaded] = useFonts({
    "PlusJakartaSans-Bold": require("../../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "PlusJakartaSans-SemiBold": require("../../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "PlusJakartaSans-Medium": require("../../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "PlusJakartaSans-Regular": require("../../assets/fonts/PlusJakartaSans-Regular.ttf"),
  });
  if (!fontsLoaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.greeting, { fontFamily: "PlusJakartaSans-Bold"}]}>
                Good Morning
              </Text>
             
            </View>
            <TouchableOpacity style={styles.menuButton}>
              <FontAwesome name="bars" size={24} color="#1B5E20" />
            </TouchableOpacity>
          </View>

          <Text style={[styles.subtitle, { fontFamily:  "PlusJakartaSans-SemiBold" }]}>
            Feeling hungry?{"\n"}What are we cookin' today?
          </Text>

          <View style={styles.searchBarContainer}>
            <View style={styles.searchBar}>
              <FontAwesome name="search" size={20} color="#9E9E9E" />
              <TextInput
                style={[styles.searchInput, { fontFamily: "PlusJakartaSans-Regular" }]}
                placeholder="Search any recipe..."
                placeholderTextColor="#9E9E9E"
              />
              <TouchableOpacity>
                <FontAwesome name="sliders" size={20} color="#1B5E20" />
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
                  { fontFamily:  "PlusJakartaSans-Regular" },
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryBtn}>
              <Text
                style={[
                  styles.categoryBtnText,
                  { fontFamily:  "PlusJakartaSans-Regular" },
                ]}
              >
                Soup
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryBtn}>
              <Text
                style={[
                  styles.categoryBtnText,
                  { fontFamily:  "PlusJakartaSans-Regular" },
                ]}
              >
                Breakfast
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryBtn}>
              <Text
                style={[
                  styles.categoryBtnText,
                  { fontFamily:  "PlusJakartaSans-Regular"},
                ]}
              >
                Salad
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
   

      {/* Recommendation Section */}
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontFamily: "PlusJakartaSans-SemiBold"}]}>
            Recommendation
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <RecipeCard
              imageSource={require("../../assets/images/icon.png")}
              title="Spicy Thai Tom Yum"
              time="30 mins"
            />
            <RecipeCard
              imageSource={require("../../assets/images/icon.png")}
              title="Creamy Mushroom Soup"
              time="30 mins"
            />
          </ScrollView>
        </View>

        {/* Recipe of The Week Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontFamily: "PlusJakartaSans-SemiBold" }]}>
            Recipe of The Week
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* Add RecipeCard components here */}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    gap: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 16,
    color: "#1B5E20",
    opacity: 0.8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1B5E20",
    marginTop: 4,
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
  subtitle: {
    fontSize: 20,
    color: "#1B5E20",
    lineHeight: 28,
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
    marginTop: 5,
  },
  categoryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "transparent",
    marginRight: 10,
  },
  categoryBtnActive: {
    backgroundColor: "#1B5E20",
  },
  categoryBtnText: {
    color: "#1B5E20",
    fontSize: 14,
  },
  categoryBtnTextActive: {
    color: "#fff",
    fontSize: 14,
  },
  scrollContainer: {
    flex: 1,
    marginTop: 10,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#1B5E20",
  },
});
