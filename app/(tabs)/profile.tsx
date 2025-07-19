import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const Profile = () => {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#A8FFCE', '#F5F5F5']} style={styles.headerGradient}>
        <Text style={[styles.title, { fontFamily: 'Inter-Regular' }]}>Profile</Text>
      </LinearGradient>
      {/* Add profile details and settings here */}
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
});

export default Profile;
