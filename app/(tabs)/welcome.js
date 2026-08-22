import { router } from "expo-router";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Welcome() {
  return (
    <View style={styles.screen}>
      <View style={styles.container}>

        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.appName}>
          GrowMaint
        </Text>

        <View style={styles.buttonsContainer}>

          <Pressable
            onPress={() => router.push("/login")}
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.loginText}>
              Log In
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/register")}
            style={({ pressed }) => [
              styles.registerButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.registerText}>
              Sign Up
            </Text>
          </Pressable>

        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },

  container: {
    flex: 1,

    backgroundColor: "#0D1E2D",

    alignItems: "center",

    paddingTop: 65,
    paddingBottom: 5,
    paddingHorizontal: 25,

    overflow: "hidden",
  },

  logo: {
    width: 340,
    height: 340,

    marginTop: 20,
  },

  appName: {
    color: "#FFFFFF",

    fontSize: 43,

    fontWeight: "800",

    marginTop: -5,

    letterSpacing: -1,
  },


  buttonsContainer: {
    width: "100%",

    alignItems: "center",

    marginTop: "auto",

    marginBottom: 20,
  },


  loginButton: {
    width: "92%",

    height: 64,

    backgroundColor: "#08AEEF",

    borderRadius: 40,

    alignItems: "center",

    justifyContent: "center",

    marginBottom: 20,
  },

  loginText: {
    color: "#FFFFFF",

    fontSize: 29,

    fontWeight: "700",
  },


  registerButton: {
    width: "92%",

    height: 64,

    backgroundColor: "#FFFFFF",

    borderRadius: 40,

    alignItems: "center",

    justifyContent: "center",
  },

  registerText: {
    color: "#0D1E2D",

    fontSize: 29,

    fontWeight: "700",
  },

  pressed: {
    opacity: 0.8,

    transform: [
      {
        scale: 0.97,
      },
    ],
  },
});