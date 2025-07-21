import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 32,
    color: "#000",
    lineHeight: 40,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 20,
    color: "#000",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
  settingsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#000",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingText: {
    fontSize: 16,
    color: "#333",
  },
});

const Profile = () => {
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
      <View style={styles.header}>
        <Text style={[styles.title, { fontFamily: "PlusJakartaSans-Bold" }]}>
          Profile
        </Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <FontAwesome name="user" size={40} color="#666" />
            </View>
            <View>
              <Text style={[styles.name, { fontFamily: "PlusJakartaSans-SemiBold" }]}>
                John Doe
              </Text>
              <Text style={[styles.email, { fontFamily: "PlusJakartaSans-Regular" }]}>
                john@example.com
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { fontFamily: "PlusJakartaSans-SemiBold" }]}>
            Settings
          </Text>
          <TouchableOpacity style={styles.settingItem}>
            <FontAwesome name="user-circle" size={20} color="#666" />
            <Text style={[styles.settingText, { fontFamily: "PlusJakartaSans-Medium" }]}>
              Edit Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <FontAwesome name="bell" size={20} color="#666" />
            <Text style={[styles.settingText, { fontFamily: "PlusJakartaSans-Medium" }]}>
              Notifications
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <FontAwesome name="lock" size={20} color="#666" />
            <Text style={[styles.settingText, { fontFamily: "PlusJakartaSans-Medium" }]}>
              Privacy
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
