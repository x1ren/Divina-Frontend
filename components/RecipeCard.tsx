import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const RecipeCard = ({
  imageSource,
  title,
  time,
}: {
  imageSource: any;
  title: string;
  time: string;
}) => {
  return (
    <View style={styles.card}>
      <Image source={imageSource} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardTime}>{time}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginRight: 10,
    width: 150,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 100,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    margin: 5,
  },
  cardTime: {
    fontSize: 12,
    color: "#757575",
    marginLeft: 5,
    marginBottom: 5,
  },
});

export default RecipeCard;
