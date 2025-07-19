import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const Saved = () => {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#A8FFCE', '#F5F5F5']} style={styles.headerGradient}>
        <Text style={[styles.title, { fontFamily: 'Inter-Regular' }]}>Saved Recipes</Text>
      </LinearGradient>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.savedSection}>
          <Text style={[styles.sectionTitle, { fontFamily: 'Inter-Regular' }]}>Salad</Text>
          {/* Add saved recipe cards here */}
        </View>
        <View style={styles.savedSection}>
          <Text style={[styles.sectionTitle, { fontFamily: 'Inter-Regular' }]}>Breakfast</Text>
          {/* Add saved recipe cards here */}
        </View>
        <View style={styles.savedSection}>
          <Text style={[styles.sectionTitle, { fontFamily: 'Inter-Regular' }]}>Main Dish</Text>
          {/* Add saved recipe cards here */}
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
  savedSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default Saved;
