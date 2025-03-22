import React from "react";
import { View, Animated, Easing } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { colors } from "@/constants/colors";

const LoadingSpinner = ({ size = 40 }) => {
  const spinValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <Svg width={size} height={size} viewBox="0 0 50 50">
        <Circle
          cx="25"
          cy="25"
          r="20"
          stroke={colors.primary}
          strokeWidth="4"
          fill="none"
          strokeDasharray="80,200"
          strokeLinecap="round"
        />
      </Svg>
    </Animated.View>
  );
};

export default LoadingSpinner;
