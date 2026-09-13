import { router } from "expo-router";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

export default function Welcome() {
  const { width } = useWindowDimensions();

  const small = width < 360;
  const tablet = width >= 600;
  const horizontalPadding = tablet ? 50 : small ? 18 : 25;
  const logoSize = tablet ? 400 : 340;
  const appNameSize = tablet ? 52 : 43;
  const buttonHeight = tablet ? 72 : 64;
  const buttonFontSize = tablet ? 32 : 29;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: horizontalPadding,
          paddingTop: 40,
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>

          <Image
            source={require("../../assets/images/logo.png")}
            style={[
              styles.logo,
              {
                width: logoSize,
                height: logoSize,
              },
            ]}
            resizeMode="contain"
          />

          <Text style={[
            styles.appName,
            {
              fontSize: appNameSize,
            },
          ]}>
            GrowMaint
          </Text>

          <View style={styles.buttonsContainer}>

            <Pressable
              onPress={() => router.push("/login")}
              style={({ pressed }) => [
                styles.loginButton,
                {
                  height: buttonHeight,
                },
                pressed && styles.pressed,
              ]}
            >
              <Text style={[
                styles.loginText,
                {
                  fontSize: buttonFontSize,
                },
              ]}>
                Log In
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/register")}
              style={({ pressed }) => [
                styles.registerButton,
                {
                  height: buttonHeight,
                },
                pressed && styles.pressed,
              ]}
            >
              <Text style={[
                styles.registerText,
                {
                  fontSize: buttonFontSize,
                },
              ]}>
                Sign Up
              </Text>
            </Pressable>

          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0D1E2D",
  },

  container: {
    flex: 1,
    backgroundColor: "#0D1E2D",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    overflow: "hidden",
  },

  logo: {
    marginTop: 20,
    marginBottom: 10,
  },

  appName: {
    color: "#FFFFFF",
    fontWeight: "800",
    marginTop: -5,
    letterSpacing: -1,
    textAlign: "center",
  },

  buttonsContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 20,
    gap: 20,
  },

  loginButton: {
    width: "92%",
    backgroundColor: "#08AEEF",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  loginText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  registerButton: {
    width: "92%",
    backgroundColor: "#FFFFFF",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  registerText: {
    color: "#0D1E2D",
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