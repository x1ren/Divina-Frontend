import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";

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
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={styles.gradient}
        />
        <View style={styles.timeContainer}>
          <FontAwesome name="clock-o" size={14} color="#fff" />
          <Text style={styles.cardTime}>{time}</Text>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <FontAwesome name="star" size={12} color="#FFD700" />
            <Text style={styles.statText}>4.5</Text>
          </View>
          <View style={styles.statItem}>
            <FontAwesome name="users" size={12} color="#4A90E2" />
            <Text style={styles.statText}>{servings} servings</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 200,
    marginRight: 15,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    height: 150,
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
    height: "50%",
  },
  timeContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  contentContainer: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1B5E20",
    marginBottom: 8,
  },
  cardTime: {
    fontSize: 12,
    color: "#FFFFFF",
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: "#666",
  },
});

export default RecipeCard;
