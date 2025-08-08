import { Stack } from "expo-router";
import { View } from "react-native";

export default function RecipeLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen
          name="[id]"
          options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: "",
            headerBackVisible: true,
            headerTintColor: "#fff",
          }}
        />
      </Stack>
    </View>
  );
}
