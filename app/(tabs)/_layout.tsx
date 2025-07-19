import React from "react";
import { HapticTab } from "@/components/HapticTab";
import { FontAwesome, Feather, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import {
    Platform,
    Pressable,
    View,
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, interpolateColor, withSequence } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

const COLORS = {
    primary: "#111", 
    gray: "#6b7280",
    white: "#fff",
    black: "#000",
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
                        backgroundColor: COLORS.white,
                        borderTopWidth: 0,
                        marginHorizontal: Platform.OS === 'web' ? 0 : 20,
                        marginBottom: Platform.OS === 'web' ? 0 : 20,
                        borderRadius: Platform.OS === 'web' ? 0 : 30,
                        height: 70,
                        shadowColor: Platform.OS === 'web' ? 'transparent' : '#000',
                        shadowOffset: Platform.OS === 'web' ? undefined : { width: 0, height: 8 },
                        shadowOpacity: Platform.OS === 'web' ? 0 : 0.30,
                        shadowRadius: Platform.OS === 'web' ? 0 : 16,
                        elevation: Platform.OS === 'web' ? 0 : 8,
                        position: 'absolute',
                        bottom: 20,
                        left: 20,
                        right: 20,
                    },
                    tabBarLabelStyle: {
                        fontSize: 13,
                        fontWeight: '600',
                        letterSpacing: 0.5,
                        marginTop: 2,
                    },
                    tabBarItemStyle: {
                        borderRadius: 20,
                        margin: 4,
                        paddingVertical: 8,
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
                        tabBarLabel: '',
                        tabBarIcon: () => null,
                        tabBarButton: ({ onPress }) => (
                            <Pressable
                                onPress={onPress}
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 58,
                                    height: 58,
                                    borderRadius: 29,
                                    marginTop: -8,
                                }}
                            >
                                {/* Main sparkling icon with blue sky gradient */}
                                <Animated.View style={sparkleStyle}>
                                    <MaskedView
                                        style={{ width: 34, height: 34 }}
                                        maskElement={
                                            <MaterialIcons
                                                name="auto-awesome"
                                                size={34}
                                                color="black"
                                            />
                                        }
                                    >
                                        <LinearGradient
                                            colors={['#87CEEB', '#4A90E2', '#1E90FF', '#0077BE']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={{ width: 34, height: 34 }}
                                        />
                                    </MaskedView>
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