import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
type RecipeCardProps = {
  id: string | number;
  imageSource: any;
  title: string;
  time: string;
  servings: number;
};

const RecipeCard: React.FC<RecipeCardProps> = ({
  id,
  imageSource,
  title,
  time,
  servings,
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const savedList = queryClient.getQueryData<any[]>(["savedRecipes"]) || [];
  const isSaved = savedList.some((r) => String(r.id) === String(id));

  const handlePress = () => {
    router.push({
      pathname: "/recipes/[id]",
      params: { id: id.toString() },
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.cardImage} />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.gradient}
        />

        {/* ✅ Saved heart badge - top left */}
        {isSaved && (
          <View style={styles.savedBadge}>
            <FontAwesome name="heart" size={14} color="#FF6B6B" />
          </View>
        )}

        {/* Time container - top right */}
        <View style={styles.timeContainer}>
          <FontAwesome name="clock-o" size={14} color="#fff" />
          <Text style={styles.cardTime}>{time}</Text>
        </View>

        {/* Title and servings - bottom overlay */}
        <View style={styles.overlayContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {title}
          </Text>
          <View style={styles.servingsContainer}>
            <FontAwesome name="users" size={12} color="#fff" />
            <Text style={styles.servingsText}>{servings} servings</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  card: {
    width: 280, // Made bigger (was 200)
    marginRight: 15,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    height: 280, // Made much taller
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "60%", // Increased gradient coverage
  },
  timeContainer: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  cardTime: {
    fontSize: 12,
    color: "#FFFFFF",
    marginLeft: 4,
    fontFamily: "System",
    fontWeight: "500", // Medium weight for better readability
  },
  overlayContent: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: "System",
    fontWeight: "600", // Semi-bold like "Cooking" in the screenshot
    color: "#FFFFFF",
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    letterSpacing: -0.5, // Tighter spacing like the screenshot
  },
  servingsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  servingsText: {
    fontSize: 12,
    color: "#FFFFFF",
    marginLeft: 4,
    fontFamily: "System",
    fontWeight: "500", // Medium weight to match
  },
  savedBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    padding: 6,
    elevation: 3,
  },
});

export default RecipeCard;
