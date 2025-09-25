import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
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
  responseContainer: ViewStyle;
  responseTitle: TextStyle;
  responseCard: ViewStyle;
  responseText: TextStyle;
  tipsContainer: ViewStyle;
  tipsTitle: TextStyle;
  tipCard: ViewStyle;
  tipText: TextStyle;
};

export default function GenerateScreen() {
  const [ingredients, setIngredients] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const url = Platform.select({
    android: "10.0.2.2:8080",
    default: "192.168.1.35:8080",
  });
  const handleGenerateRecipe = async () => {
    if (!ingredients.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`http://${url}/generate/ask/v1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: ingredients.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      // Clean up the prompt text by removing unnecessary asterisks
      const cleanPrompt = data.prompt.replace(/\*+/g, "").trim();
      setGeneratedPrompt(cleanPrompt);
    } catch (error) {
      console.error("Error generating recipe:", error);
      // Handle error here - maybe show an alert
    } finally {
      setIsLoading(false);
    }
  };

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
              value={ingredients}
              onChangeText={setIngredients}
            />
          </View>

          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGenerateRecipe}
            disabled={isLoading || !ingredients.trim()}
          >
            <MaskedView
              style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
              maskElement={
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                    <>
                      <Text
                        style={[
                          styles.generateButtonText,
                          { fontFamily: "PlusJakartaSans-SemiBold" },
                        ]}
                      >
                        Generate Recipe
                      </Text>
                      <FontAwesome name="magic" size={20} />
                    </>
                  )}
                </View>
              }
            >
              <LinearGradient
                colors={["#87CEEB", "#4A90E2", "#1E90FF", "#0077BE"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1, paddingVertical: 15 }}
              />
            </MaskedView>
          </TouchableOpacity>
        </View>

        {generatedPrompt && (
          <View style={styles.responseContainer}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <FontAwesome name="lightbulb-o" size={24} color="#4A90E2" />
              <Text
                style={[
                  styles.responseTitle,
                  { fontFamily: "PlusJakartaSans-Bold" },
                ]}
              >
                AI Generated Recipe
              </Text>
            </View>
            <View style={styles.responseCard}>
              <Text
                style={[
                  styles.responseText,
                  { fontFamily: "PlusJakartaSans-Medium" },
                ]}
              >
                {generatedPrompt}
              </Text>
            </View>
          </View>
        )}

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
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  generateButtonText: {
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
  responseContainer: {
    gap: 16,
    marginBottom: 32,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  responseTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  responseCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e8e8e8",
  },
  responseText: {
    fontSize: 16,
    lineHeight: 26,
    color: "#2c3e50",
    letterSpacing: 0.2,
  },
});
