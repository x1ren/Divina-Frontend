import { Pressable } from "react-native";
import { Tabs } from "expo-router";
import * as Haptics from "expo-haptics";

export function HapticTab(props: Parameters<typeof Tabs.Screen>[0]['options']['tabBarButton']) {
    return (
        <Pressable
            {...props}
            android_ripple={{ color: "transparent" }} // REMOVE ripple effect
            onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                props?.onPress?.(); // ensure navigation still works
            }}
            style={({ pressed }) => [
                {
                    opacity: pressed ? 0.75 : 1, // optional visual feedback
                },
                props?.style,
            ]}
        />
    );
}
