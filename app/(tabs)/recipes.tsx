import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const Recipes = () => {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#A8FFCE', '#F5F5F5']} style={styles.headerGradient}>
        <Text style={[styles.title, { fontFamily: 'Inter-Regular' }]}>Recipes</Text>
      </LinearGradient>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.recipeCard}>
          <Text style={[styles.recipeTitle, { fontFamily: 'Inter-Regular' }]}>Choco Macarons</Text>
          <Text style={[styles.recipeDetails, { fontFamily: 'Inter-Regular' }]}>10 min | Medium</Text>
          <TouchableOpacity style={styles.watchButton}>
            <Text style={[styles.watchButtonText, { fontFamily: 'Inter-Regular' }]}>Watch Video</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 0,
  },
  headerGradient: {
    paddingTop: 0,
    paddingBottom: 20,
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 0,
    padding: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  recipeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  recipeDetails: {
    fontSize: 14,
    color: "#757575",
    marginTop: 5,
  },
  watchButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#388E3C",
    borderRadius: 5,
  },
  watchButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default Recipes;
