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
  width: 170, // fits 2 per row
  height: 200,
  marginBottom: 16, // space between rows

  borderRadius: 16,
  backgroundColor: "#FFFFFF",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.15,
  shadowRadius: 6,
  elevation: 6,
  overflow: "hidden",
  
},

  imageContainer: {
    position: "relative",
    height: "100%",
    borderRadius: 16,
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
    height: "60%",
  },
  timeContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.65)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
  },
  cardTime: {
    fontSize: 12,
    color: "#FFFFFF",
    marginLeft: 5,
    fontWeight: "600",
  },
  overlayContent: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 6,
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  servingsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  servingsText: {
    fontSize: 12,
    color: "#FFFFFF",
    marginLeft: 4,
    fontWeight: "600",
  },
  savedBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 12,
    padding: 5,
    elevation: 4,
  },
});




export default RecipeCard;
