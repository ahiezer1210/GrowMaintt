import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import { useAppSettings } from "../../context/Appsettings";
import { auth, db } from "../../firebaseConfig.js";

export default function LogoutDevices() {
  const { t, colors } = useAppSettings();

  const { width } = useWindowDimensions();

  const small = width < 350;
  const tablet = width >= 600;

  const titleScale = small
    ? 0.72
    : tablet
    ? 1.02
    : 0.82;

  const headerScale = small
    ? 0.85
    : tablet
    ? 1.15
    : 1;

  const [loading, setLoading] = useState(false);

  const isDarkTheme =
    colors.background?.toLowerCase() !== "#ffffff" &&
    colors.background?.toLowerCase() !== "#fff" &&
    colors.background?.toLowerCase() !== "#f5f5f5" &&
    colors.background?.toLowerCase() !== "#f4f4f4" &&
    colors.background?.toLowerCase() !== "#f3f4f5";

  const horizontalPadding = small
    ? 18
    : tablet
    ? 45
    : 25;

  const contentScale = small
    ? 0.85
    : tablet
    ? 1.15
    : 1;

  const s = (value) =>
    Math.round(value * contentScale);

  const navItems = [
    {
      icon: "home-outline",
      route: "/home",
    },
    {
      icon: "chart-box-outline",
      route: "/historial",
    },
    {
      icon: "swap-horizontal",
      route: "/expensesManagement",
    },
    {
      icon: "layers-outline",
      route: "/currentgoal",
    },
    {
      icon: "account-outline",
      route: "/profile",
    },
  ];

  const abrirNotificaciones = () => {
    router.push({
      pathname: "/notifications",
      params: {
        from: "/logoutalldevices",
      },
    });
  };

  const logoutEverywhere = async () => {
    if (loading) return;

    const user = auth.currentUser;

    if (!user) {
      Alert.alert(
        t.error,
        t.noActiveSession ||
          "There is no active session."
      );
      return;
    }

    setLoading(true);

    try {
      const uid = user.uid;

      const usersQuery = query(
        collection(db, "users"),
        where("uid", "==", uid)
      );

      const snapshot = await getDocs(usersQuery);

      if (snapshot.empty) {
        Alert.alert(
          t.error,
          t.noUserFound ||
            "No user found in the database."
        );
        setLoading(false);
        return;
      }

      const userDocument = snapshot.docs[0];

      await updateDoc(userDocument.ref, {
        sessionVersion: increment(1),
      });

      await signOut(auth);

      router.replace("/login");
    } catch (error) {
      console.log(
        "Error signing out of all devices:",
        error
      );

      Alert.alert(
        t.error,
        t.logoutAllDevicesError ||
          "Failed to sign out of all devices. Please try again."
      );

      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.screen,
        {
          backgroundColor:
            colors.primaryBackground,
        },
      ]}
    >
      <StatusBar
        translucent
        backgroundColor={colors.header}
        barStyle="light-content"
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
      >
       
        <View
          style={[
            styles.header,
            {
              height: 118 * headerScale,
              paddingHorizontal: small
                ? 18
                : tablet
                ? 45
                : 25,
              backgroundColor: colors.header,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.back,
              {
                transform: [
                  {
                    translateY:
                      4 * headerScale,
                  },
                ],
              },
            ]}
            onPress={() =>
              router.push("/signout")
            }
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={35 * headerScale}
              color={colors.white}
            />
          </TouchableOpacity>

          <View
            style={styles.titleContainer}
            pointerEvents="none"
          >
            <Text
              numberOfLines={2}
              adjustsFontSizeToFit
              minimumFontScale={0.68}
              style={[
                styles.headerTitle,
                {
                  fontSize: 25 * titleScale,
                  lineHeight:
                    28 * titleScale,
                  color: colors.white,
                  transform: [
                    {
                      translateX:
                        5 * headerScale,
                    },
                    {
                      translateY:
                        8 * headerScale,
                    },
                  ],
                },
              ]}
            >
              {t.logoutAllDevicesTitle}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.headerBell,
              {
                transform: [
                  {
                    translateY:
                      4 * headerScale,
                  },
                  {
                    translateX:
                      7 * headerScale,
                  },
                ],
              },
            ]}
            onPress={abrirNotificaciones}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="bell-circle-outline"
              size={35 * headerScale}
              color={colors.white}
            />
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.main,
            {
              backgroundColor: colors.background,
              borderTopLeftRadius: small
                ? 35
                : tablet
                ? 55
                : 45,
              borderTopRightRadius: small
                ? 35
                : tablet
                ? 55
                : 45,
            },
          ]}
        >
          <ScrollView
            style={styles.whiteScroll}
            contentContainerStyle={[
              styles.content,
              {
                paddingTop: s(10),
                paddingHorizontal:
                  horizontalPadding,
                paddingBottom: s(100),
              },
            ]}
            showsVerticalScrollIndicator={false}
            alwaysBounceVertical={true}
            overScrollMode="always"
          >
            <Image
              source={require(
                "../../assets/images/Screenshot 2026-08-28 21253461.png"
              )}
              style={{
                width: s(210),
                height: s(210),
                marginTop: s(-17),
                transform: [
                  {
                    translateX:
                      -5 * contentScale,
                  },
                ],
              }}
              resizeMode="contain"
            />

            <Text
              style={[
                styles.description,
                {
                  fontSize: s(14),
                  lineHeight: s(20),
                  marginTop: s(20),
                  transform: [
                    {
                      translateY:
                        -23 * contentScale,
                    },
                  ],
                  color: colors.text,
                },
              ]}
            >
              {t.logoutAllDevicesDescription}
            </Text>

            <Text
              style={[
                styles.question,
                {
                  fontSize: s(25),
                  marginTop: s(25),
                  transform: [
                    {
                      translateY:
                        -29 * contentScale,
                    },
                  ],
                  color: colors.text,
                },
              ]}
            >
              {t.logoutAllDevicesQuestion}
            </Text>

            <View
              style={[
                styles.buttonsContainer,
                {
                  marginTop: s(40),
                  transform: [
                    {
                      translateY:
                        -45 * contentScale,
                    },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  {
                    width: s(190),
                    height: s(44),
                    borderRadius: s(22),
                    opacity: loading ? 0.6 : 1,
                    backgroundColor:
                      isDarkTheme
                        ? "#25B5D1"
                        : "#071426",
                  },
                ]}
                onPress={logoutEverywhere}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.buttonText,
                    {
                      fontSize: s(14),
                    },
                  ]}
                >
                  {loading
                    ? t.loggingOut
                    : t.continueAction}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  {
                    width: s(190),
                    height: s(44),
                    borderRadius: s(22),
                    marginTop: s(12),
                    backgroundColor:
                      isDarkTheme
                        ? "#25B5D1"
                        : "#071426",
                  },
                ]}
                onPress={() => router.back()}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.buttonText,
                    {
                      fontSize: s(13),
                    },
                  ]}
                >
                  {t.cancel}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View
            style={[
              styles.bottomBar,
              {
                height:
                  65 * headerScale,
                borderTopLeftRadius:
                  78 * headerScale,
                backgroundColor: colors.nav,
              },
            ]}
          >
            {navItems.map((item) => (
              <TouchableOpacity
                key={item.route}
                style={styles.navButton}
                onPress={() =>
                  router.push(item.route)
                }
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={
                    item.icon ===
                    "swap-horizontal"
                      ? 37 * headerScale
                      : 35 * headerScale
                  }
                  color={colors.white}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  back: {
    width: 30,
    alignItems: "flex-start",
    justifyContent: "center",
    zIndex: 2,
  },

  titleContainer: {
    position: "absolute",
    left: 40,
    right: 40,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },

  headerTitle: {
    width: "100%",
    fontWeight: "700",
    textAlign: "center",
  },

  headerBell: {
    justifyContent: "center",
    zIndex: 2,
  },

  main: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
  },

  whiteScroll: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    alignItems: "center",
  },

  description: {
    textAlign: "center",
  },

  question: {
    textAlign: "center",
    fontWeight: "400",
  },

  buttonsContainer: {
    alignItems: "center",
  },

  actionButton: {
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "505",
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    overflow: "hidden",
  },

  navButton: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});