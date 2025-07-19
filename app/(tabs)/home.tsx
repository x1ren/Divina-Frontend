import React from "react";
import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import RecipeCard from "../../components/RecipeCard";
import { useFonts } from "expo-font";
import { LinearGradient } from 'expo-linear-gradient';

export default function Home() {
  const [fontsLoaded] = useFonts({
    "Inter-Regular": require("../../assets/fonts/Inter_18pt-Regular.ttf"),
  });
  if (!fontsLoaded) {
    return null; 
  }
  return (
    <View style={styles.container}>
      {/* Header with Blue Sky Gradient */}
      <View style={styles.headerContainer}>
       
          <View style={styles.headerContent}>
          <Text style={[styles.title, { fontFamily: 'Inter-Regular' }]}>Divina</Text>
            <Text style={[styles.subtitle, { fontFamily: 'Inter-Regular' }]}>
              Feeling hungry? What are we cookin' today?
            </Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search any recipe..."
            />
          </View>
    
        
     
        
      </View>

      {/* Recommendation Section */}
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontFamily: 'Inter-Regular' }]}>Recommendation</Text>
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
          <Text style={[styles.sectionTitle, { fontFamily: 'Inter-Regular' }]}>Recipe of The Week</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* Add RecipeCard components here */}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    position: 'relative',
  },
  headerGradient: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
 
  headerContent: {
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 8,
    opacity: 0.9,
  },
  searchInput: {
    marginTop: 20,
    padding: 15,
    borderWidth: 0,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    fontWeight: "bold",
    marginBottom: 10,
    color: '#2D5F4F',
  },
});