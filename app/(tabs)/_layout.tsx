import React from "react";
import { HapticTab } from "@/components/HapticTab";
import { FontAwesome, Feather, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";

const COLORS = {
  primary: "#111",
  gray: "#6b7280",
  white: "#fff",
  black: "#000",
};

// Custom curved tab bar background
const CurvedTabBarBackground = () => {
  return (
    <View style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      right: 0, 
      height: 70,
      backgroundColor: 'transparent'
    }}>
      <Svg width="100%" height="70" viewBox="0 0 375 70" style={{ position: 'absolute' }}>
        <Path
          d="M0,20 L120,20 Q140,20 150,35 Q170,60 190,60 Q210,60 230,35 Q240,20 260,20 L375,20 L375,70 L0,70 Z"
          fill={COLORS.white}
          stroke="#e5e7eb"
          strokeWidth="2"
        />
      </Svg>
    </View>
  );
};

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const pulseValue = useSharedValue(1);

  // Sparkling animation with pulsing scale only
  const sparkleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseValue.value }],
  }));

  // Animate the sparkle effect
  React.useEffect(() => {
    // Pulsing scale animation
    pulseValue.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 600 }),
        withTiming(1, { duration: 600 })
      ),
      -1,
      false
    );
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.gray,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            marginHorizontal: Platform.OS === "web" ? 0 : 20,
            marginBottom: Platform.OS === "web" ? 0 : 20,
            borderRadius: 0,
            height: 70,
            shadowColor: Platform.OS === "web" ? "transparent" : "#000",
            shadowOffset:
              Platform.OS === "web" ? undefined : { width: 0, height: 8 },
            shadowOpacity: Platform.OS === "web" ? 0 : 0.15,
            shadowRadius: Platform.OS === "web" ? 0 : 16,
            elevation: Platform.OS === "web" ? 0 : 8,
            position: "absolute",
            bottom: 35,
            left: 20,
            right: 20,
          },
          tabBarBackground: () => <CurvedTabBarBackground />,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
            letterSpacing: 0.5,
            marginTop: 2,
          },
          tabBarItemStyle: {
            borderRadius: 0,
            margin: 0,
            paddingVertical: 8,
            paddingTop: 20, // Push icons down to accommodate curve
          },
          tabBarIconStyle: {
            marginBottom: -2,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarButton: HapticTab,
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size, focused }) => (
              <Feather
                name="home"
                size={24}
                color={focused ? COLORS.primary : COLORS.gray}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="recipes"
          options={{
            tabBarButton: HapticTab,
            tabBarLabel: "Recipes",
            tabBarIcon: ({ color, size, focused }) => (
              <Feather
                name="book"
                size={24}
                color={focused ? COLORS.primary : COLORS.gray}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="generate"
          options={{
            tabBarLabel: "",
            tabBarIcon: () => null,
            tabBarButton: ({ onPress }) => (
              <Pressable
                onPress={onPress}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: COLORS.white,
                  position: 'absolute',
                  top: -15, // Elevate above the curved bar
                  left: '50%',
                  marginLeft: -30, // Center horizontally
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: 8,
                  borderWidth: 3,
                  borderColor: COLORS.white,
                }}
              >
                <Animated.View style={sparkleStyle}>
                  <View style={{ position: "relative" }}>
                    <MaterialIcons
                      name="auto-awesome"
                      size={28}
                      color="#4A90E2"
                    />
                  </View>
                </Animated.View>
              </Pressable>
            ),
          }}
        />
        <Tabs.Screen
          name="saved"
          options={{
            tabBarButton: HapticTab,
            tabBarLabel: "Saved",
            tabBarIcon: ({ color, size, focused }) => (
              <Feather
                name="bookmark"
                size={24}
                color={focused ? COLORS.primary : COLORS.gray}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarButton: HapticTab,
            tabBarLabel: "Profile",
            tabBarIcon: ({ color, size, focused }) => (
              <Feather
                name="user"
                size={24}
                color={focused ? COLORS.primary : COLORS.gray}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}