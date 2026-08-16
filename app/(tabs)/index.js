import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming,
} from "react-native-reanimated";

export default function Inicio() {
  const scale = useSharedValue(0.7);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 500,
    });

    scale.value = withDelay(
      100,
      withSpring(1, {
        damping: 13,
        stiffness: 100,
      })
    );

    const timer = setTimeout(() => {
      router.replace("/welcome");
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        {
          scale: scale.value,
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        ¡Bienvenido!
      </Text>

      <Animated.Image
        source={require("../../assets/images/logo.png")}
        style={[styles.logo, logoAnimatedStyle]}
        resizeMode="contain"
      />

      <Text style={styles.appName}>
        GrowMaint
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1E2D",
    alignItems: "center",
    justifyContent: "center",
  },

  welcome: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "700",
    marginBottom: 55,
  },

  logo: {
    width: 300,
    height: 300,
    marginBottom: 35,
  },

  appName: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "700",
  },
});