import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ViewStyle,
  TextStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";

type Styles = {
  container: ViewStyle;
  headerContainer: ViewStyle;
  headerContent: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  content: ViewStyle;
  inputContainer: ViewStyle;
  inputWrapper: ViewStyle;
  input: TextStyle;
  generateButton: ViewStyle;
  generateButtonText: TextStyle;
  tipsContainer: ViewStyle;
  tipsTitle: TextStyle;
  tipCard: ViewStyle;
  tipText: TextStyle;
};

export default function GenerateScreen() {
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
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <Text style={[styles.title, { fontFamily: "PlusJakartaSans-Bold" }]}>
            Recipe Generator
          </Text>
          <Text
            style={[styles.subtitle, { fontFamily: "PlusJakartaSans-Medium" }]}
          >
            Tell me what ingredients you have,{"\n"}and I'll create a recipe for
            you
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <FontAwesome name="cutlery" size={20} color="#666" />
            <TextInput
              style={[styles.input, { fontFamily: "PlusJakartaSans-Regular" }]}
              placeholder="Enter your ingredients..."
              multiline
              numberOfLines={4}
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity style={styles.generateButton}>
            <Text
              style={[
                styles.generateButtonText,
                { fontFamily: "PlusJakartaSans-SemiBold" },
              ]}
            >
              Generate Recipe
            </Text>
            <FontAwesome name="magic" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.tipsContainer}>
          <Text
            style={[
              styles.tipsTitle,
              { fontFamily: "PlusJakartaSans-SemiBold" },
            ]}
          >
            Tips for better results
          </Text>
          <View style={styles.tipCard}>
            <FontAwesome name="lightbulb-o" size={20} color="#666" />
            <Text
              style={[
                styles.tipText,
                { fontFamily: "PlusJakartaSans-Regular" },
              ]}
            >
              List main ingredients first
            </Text>
          </View>
          <View style={styles.tipCard}>
            <FontAwesome name="check-circle-o" size={20} color="#666" />
            <Text
              style={[
                styles.tipText,
                { fontFamily: "PlusJakartaSans-Regular" },
              ]}
            >
              Specify quantities if possible
            </Text>
          </View>
          <View style={styles.tipCard}>
            <FontAwesome name="clock-o" size={20} color="#666" />
            <Text
              style={[
                styles.tipText,
                { fontFamily: "PlusJakartaSans-Regular" },
              ]}
            >
              Mention cooking time preferences
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerContent: {
    gap: 12,
  },
  title: {
    fontSize: 32,
    color: "#000",
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    gap: 20,
    marginBottom: 30,
  },
  inputWrapper: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    minHeight: 100,
    textAlignVertical: "top",
  },
  generateButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  generateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  tipsContainer: {
    gap: 12,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 5,
  },
  tipCard: {
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  tipText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
  },
});
