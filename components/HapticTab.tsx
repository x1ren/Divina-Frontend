import { Pressable, PressableProps } from "react-native";
import { Tabs } from "expo-router";
import * as Haptics from "expo-haptics";

export function HapticTab(props: PressableProps) {
    return (
        <Pressable
            {...props}
            android_ripple={{ color: "transparent" }} // REMOVE ripple effect
            onPress={(event) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                props?.onPress?.(event); // ensure navigation still works
            }}
            style={(state) => {
                const baseStyle = {
                    opacity: state.pressed ? 0.75 : 1, // optional visual feedback
                };
                // If props.style is a function, call it with state; otherwise, use as is
                const propStyle = typeof props.style === "function"
                    ? props.style(state)
                    : props.style;
                return [baseStyle, propStyle];
            }}
        />
    );
}
