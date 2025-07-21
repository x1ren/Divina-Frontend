import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface TabBarButtonProps {
  focused: boolean;
  icon: React.ComponentProps<typeof FontAwesome>["name"];
  label: string;
}

export default function TabBarButton({
  focused,
  icon,
  label,
}: TabBarButtonProps) {
  return (
    <View style={styles.container}>
      <FontAwesome
        name={icon}
        size={24}
        color={focused ? "#1B5E20" : "#9E9E9E"}
        style={styles.icon}
      />
      <Text style={[styles.label, focused && styles.labelFocused]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: "#9E9E9E",
  },
  labelFocused: {
    color: "#1B5E20",
  },
});
