import { useEffect } from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from "react-native-reanimated";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type DonutChartProps = {
  moneyPercentage: number;
  goldPercentage: number;
  size?: number;
  strokeWidth?: number;
};

export default function DonutChart({ moneyPercentage, goldPercentage,size = 150, strokeWidth = 18}: DonutChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const moneyLength = useSharedValue(
    (moneyPercentage / 100) * circumference,
  );

  const goldLength = useSharedValue(
    (goldPercentage / 100) * circumference,
  );

  useEffect(() => {
    const config = {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    };

    moneyLength.value = withTiming(
      (moneyPercentage / 100) * circumference,
      config,
    );

    goldLength.value = withTiming(
      (goldPercentage / 100) * circumference,
      config,
    );
  }, [moneyPercentage, goldPercentage, circumference]);

  const moneyAnimatedProps = useAnimatedProps(() => ({
    strokeDasharray: [moneyLength.value, circumference],
  }));

  const goldAnimatedProps = useAnimatedProps(() => ({
    strokeDasharray: [goldLength.value, circumference],
    strokeDashoffset: -moneyLength.value,
  }));

  return (
    <View>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E7E5DB"
          strokeWidth={strokeWidth}
          fill="none"
        />

        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#174C3C"
          strokeWidth={strokeWidth}
          animatedProps={moneyAnimatedProps}
          strokeLinecap="round"
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
          fill="none"
        />

        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#C59A55"
          strokeWidth={strokeWidth}
          animatedProps={goldAnimatedProps}
          strokeLinecap="round"
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
          fill="none"
        />
      </Svg>
    </View>
  );
}