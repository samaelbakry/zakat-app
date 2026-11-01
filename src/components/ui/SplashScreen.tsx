
import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import tw from "twrnc";

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 45,
        useNativeDriver: true,
      }),
    ]).start();

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 1100,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1100,
          useNativeDriver: true,
        }),
      ])
    );

    const progress = Animated.loop(
      Animated.sequence([
        Animated.timing(progressAnim, {
          toValue: 0.85,
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(progressAnim, {
          toValue: 0.2,
          duration: 1200,
          useNativeDriver: false,
        }),
      ])
    );

    pulse.start();
    progress.start();

    return () => {
      pulse.stop();
      progress.stop();
    };
  }, []);

  return (
    <View
      style={tw`flex-1 items-center justify-center bg-[#FAF9F5]`}
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          alignItems: "center",
        }}
      >
        <Animated.View
          style={{
            transform: [{ scale: pulseAnim }],
          }}
        >
          <View
            style={[
              tw`w-24 h-24 rounded-[32px] bg-[#174C3C] items-center justify-center`,
              {
                shadowColor: "#174C3C",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.18,
                shadowRadius: 18,
                elevation: 8,
              },
            ]}
          >
            <Text
              style={{
                color: "#E5C58A",
                fontSize: 48,
                fontWeight: "bold",
              }}
            >
              ز
            </Text>
          </View>
        </Animated.View>

        <Text
          style={[
            tw`text-2xl font-bold text-[#174C3C] mt-7`,
            { letterSpacing: 3 },
          ]}
        >
          ZAKATY
        </Text>

        <Text style={tw`text-sm text-[#85897F] mt-2`}>
          Your Zakat, made simple.
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          tw`absolute bottom-16 w-16 h-1 rounded-full bg-[#E9E6DC] overflow-hidden`,
          { opacity: fadeAnim },
        ]}
      >
        <Animated.View
          style={{
            width: progressAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
            }),
            height: "100%",
            backgroundColor: "#C59A55",
            borderRadius: 10,
          }}
        />
      </Animated.View>
    </View>
  );
}
