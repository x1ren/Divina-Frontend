export const COLORS = {
  primary: "#4A90E2",
  primaryGradient: ["#87CEEB", "#4A90E2", "#1E90FF", "#0077BE"],
  background: "#fff",
  white: "#fff",
  black: "#000",
  text: {
    primary: "#000",
    secondary: "#666",
    tertiary: "#999",
  },
  border: "#e0e0e0",
  // Additional semantic colors
  success: "#4CAF50",
  error: "#FF6B6B",
  warning: "#FFD700",
};

export const gradientText = {
  gradient: {
    colors: COLORS.primaryGradient,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
};

export const shadows = {
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
};
