import { Redirect, router, useFocusEffect } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { auth } from "../../firebaseConfig";
import { getDestination } from "../../utils/authDestination";

const AUTH_TIMEOUT_MS = 5000;
const DESTINATION_TIMEOUT_MS = 4000;

export default function Welcome() {
  const [checking, setChecking] = useState(true);
  const [destination, setDestination] = useState(null);

  const { width } = useWindowDimensions();

  const small = width < 360;
  const tablet = width >= 600;
  const horizontalPadding = tablet ? 50 : small ? 18 : 25;
  const logoSize = tablet ? 400 : 340;
  const appNameSize = tablet ? 52 : 43;
  const buttonHeight = tablet ? 72 : 64;
  const buttonFontSize = tablet ? 32 : 29;

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      const authTimeout = setTimeout(() => {
        if (!cancelled) {
          console.log("AUTH TIMEOUT: mostrando botones");
          setChecking(false);
        }
      }, AUTH_TIMEOUT_MS);

      const unsub = onAuthStateChanged(auth, async (user) => {
        if (cancelled) return;
        clearTimeout(authTimeout);

        console.log("AUTH AL ABRIR:", user ? user.email : "null (sin sesión)");

        if (!user) {
          setDestination(null);
          setChecking(false);
          return;
        }

        const route = await Promise.race([
          getDestination(user.uid),
          new Promise((resolve) =>
            setTimeout(() => resolve("/(tabs)/home"), DESTINATION_TIMEOUT_MS)
          ),
        ]);

        if (!cancelled) setDestination(route);
      });

      return () => {
        cancelled = true;
        clearTimeout(authTimeout);
        unsub();
      };
    }, [])
  );

  if (destination) {
    return <Redirect href={destination} />;
  }

  if (checking) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#08AEEF" />
      </View>
    );
  }

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

          <Text
            style={[
              styles.appName,
              {
                fontSize: appNameSize,
              },
            ]}
          >
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
              <Text
                style={[
                  styles.loginText,
                  {
                    fontSize: buttonFontSize,
                  },
                ]}
              >
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
              <Text
                style={[
                  styles.registerText,
                  {
                    fontSize: buttonFontSize,
                  },
                ]}
              >
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
  loadingScreen: {
    flex: 1,
    backgroundColor: "#0D1E2D",
    justifyContent: "center",
    alignItems: "center",
  },

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