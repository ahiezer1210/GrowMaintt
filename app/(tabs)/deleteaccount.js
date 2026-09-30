import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import {
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { router } from "expo-router";

import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

import {
  deleteDoc,
  doc,
} from "firebase/firestore";

import { auth, db } from "../../firebaseConfig";

const COLORS = {
  cyan: "#25B7D3",
  dark: "#071426",
  white: "#FFFFFF",
  gray: "#ACADAD",
  textDark: "#0A3438",
  inputBorder: "#252833",
  cardBg: "#EEF5FF",
};

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

export default function DeleteAccount({ navigation }) {
  const [password, setPassword] = useState("");

  const { width, height } = useWindowDimensions();

  const small = width < 350;
  const tablet = width >= 600;

  const scale = (value, tabletValue) =>
    tablet
      ? tabletValue ?? value * 1.15
      : small
      ? value * 0.85
      : value;

  const s = (value) => Math.round(scale(value));

  const horizontalPadding = small
    ? 18
    : tablet
    ? 45
    : 25;

  const handleDelete = async () => {
    const cleanPassword = password.trim();

    if (!cleanPassword) {
      Alert.alert(
        "Password Required",
        "Please enter your password to continue."
      );
      return;
    }

    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const user = auth.currentUser;

              if (!user) {
                Alert.alert(
                  "Error",
                  "No authenticated user found."
                );
                return;
              }

              if (!user.email) {
                Alert.alert(
                  "Error",
                  "The authenticated user does not have an email address."
                );
                return;
              }

              const credential =
                EmailAuthProvider.credential(
                  user.email,
                  cleanPassword
                );

              await reauthenticateWithCredential(
                user,
                credential
              );

              await deleteDoc(
                doc(db, "Users", user.uid)
              );

              await deleteUser(user);

              Alert.alert(
                "Account Deleted",
                "Your account has been successfully deleted.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      router.replace("/login");
                    },
                  },
                ]
              );

              setPassword("");
            } catch (error) {
              console.log(
                "Delete account error:",
                error
              );

              if (
                error.code ===
                  "auth/wrong-password" ||
                error.code ===
                  "auth/invalid-credential"
              ) {
                Alert.alert(
                  "Incorrect Password",
                  "The password you entered is incorrect."
                );
              } else if (
                error.code ===
                "auth/requires-recent-login"
              ) {
                Alert.alert(
                  "Security",
                  "Please log in again before deleting your account."
                );
              } else if (
                error.code ===
                "auth/invalid-email"
              ) {
                Alert.alert(
                  "Error",
                  "The email associated with this account is invalid."
                );
              } else if (
                error.code ===
                "auth/user-disabled"
              ) {
                Alert.alert(
                  "Error",
                  "This account has been disabled."
                );
              } else if (
                error.code ===
                "auth/network-request-failed"
              ) {
                Alert.alert(
                  "Connection Error",
                  "Please check your internet connection and try again."
                );
              } else {
                Alert.alert(
                  "Error",
                  error.message ||
                    "An unexpected error occurred."
                );
              }
            }
          },
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  const handleCancel = () => {
    router.push("/settings");
  };

  const handleNotifications = () => {
    router.push({
      pathname: "/notifications",
      params: {
        from: "/deleteaccount",
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.dark}
      />

      <View style={styles.app}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={
            Platform.OS === "ios"
              ? "padding"
              : "height"
          }
        >
          {/* HEADER */}
          <View
            style={[
              styles.header,
              {
                height:
                  118 *
                  (small
                    ? 0.85
                    : tablet
                    ? 1.15
                    : 1),
                paddingHorizontal:
                  horizontalPadding,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.backButton,
                {
                  left: s(15),
                  top: s(34),
                  width: s(55),
                  height: s(55),
                  transform: [
                    {
                      translateY:
                        4 *
                        (small
                          ? 0.85
                          : tablet
                          ? 1.15
                          : 1),
                    },
                  ],
                },
              ]}
              activeOpacity={0.7}
              onPress={handleCancel}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={
                  35 *
                  (small
                    ? 0.85
                    : tablet
                    ? 1.15
                    : 1)
                }
                color={COLORS.white}
              />
            </TouchableOpacity>

            <Text
              style={[
                styles.headerTitle,
                {
                  fontSize:
                    25 *
                    (small
                      ? 0.85
                      : tablet
                      ? 1.15
                      : 1),
                  transform: [
                    {
                      translateX:
                        3 *
                        (small
                          ? 0.85
                          : tablet
                          ? 1.15
                          : 1),
                    },
                    {
                      translateY:
                        3 *
                        (small
                          ? 0.85
                          : tablet
                          ? 1.15
                          : 1),
                    },
                  ],
                },
              ]}
            >
              Delete Account
            </Text>

            <TouchableOpacity
              style={[
                styles.headerBell,
                {
                  right: s(15),
                  top: s(34),
                  width: s(55),
                  height: s(55),
                  transform: [
                    {
                      translateY:
                        4 *
                        (small
                          ? 0.85
                          : tablet
                          ? 1.15
                          : 1),
                    },
                  ],
                },
              ]}
              activeOpacity={0.7}
              onPress={handleNotifications}
            >
              <MaterialCommunityIcons
                name="bell-circle-outline"
                size={
                  35 *
                  (small
                    ? 0.85
                    : tablet
                    ? 1.15
                    : 1)
                }
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>

          {/* MAIN */}
          <View
            style={[
              styles.whiteContainer,
              {
                borderTopLeftRadius:
                  tablet
                    ? s(55)
                    : small
                    ? s(35)
                    : s(45),
                borderTopRightRadius:
                  tablet
                    ? s(55)
                    : small
                    ? s(35)
                    : s(45),
              },
            ]}
          >
            <ScrollView
              style={styles.whiteScroll}
              contentContainerStyle={[
                styles.scrollContent,
                {
                  paddingHorizontal:
                    horizontalPadding,
                  paddingTop: s(24),
                  paddingBottom: s(90),
                },
              ]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
            >
              <View style={styles.content}>
                {/* WARNING ICON */}
                <View
                  style={[
                    styles.iconContainer,
                    {
                      marginBottom: s(20),
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.warningCircle,
                      {
                        width: s(135),
                        height: s(135),
                        borderRadius: s(67.5),
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="alert"
                      size={s(75)}
                      color="#1769E0"
                    />
                  </View>
                </View>

                {/* DESCRIPTION */}
                <Text
                  style={[
                    styles.description,
                    {
                      fontSize: s(15),
                      lineHeight: s(21),
                      marginBottom: s(24),
                    },
                  ]}
                >
                  This action will delete all of your
                  data and this action cannot be
                  undone.
                </Text>

                {/* FORM */}
                <View style={styles.formGroup}>
                  <Text
                    style={[
                      styles.label,
                      {
                        fontSize: s(16),
                        marginBottom: s(8),
                      },
                    ]}
                  >
                    Enter your password
                  </Text>

                  <TextInput
                    style={[
                      styles.input,
                      {
                        height: s(48),
                        borderRadius: s(16),
                        paddingHorizontal: s(16),
                        fontSize: s(15),
                        marginBottom: s(24),
                      },
                    ]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder=""
                    placeholderTextColor="#A8ADB5"
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="password"
                    returnKeyType="done"
                    onSubmitEditing={handleDelete}
                  />

                  <TouchableOpacity
                    style={[
                      styles.darkButton,
                      {
                        height: s(46),
                        borderRadius: s(23),
                        marginBottom: s(12),
                      },
                    ]}
                    activeOpacity={0.8}
                    onPress={handleDelete}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        {
                          fontSize: s(15),
                        },
                      ]}
                    >
                      Delete
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.darkButton,
                      {
                        height: s(46),
                        borderRadius: s(23),
                      },
                    ]}
                    activeOpacity={0.8}
                    onPress={handleCancel}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        {
                          fontSize: s(15),
                        },
                      ]}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>

        {/* BOTTOM NAVBAR */}
        <View
          style={[
            styles.bottomBar,
            {
              height:
                65 *
                (small
                  ? 0.85
                  : tablet
                  ? 1.15
                  : 1),
              borderTopLeftRadius:
                78 *
                (small
                  ? 0.85
                  : tablet
                  ? 1.15
                  : 1),
            },
          ]}
        >
          {navItems.map((item) => (
            <TouchableOpacity
              key={item.route}
              style={styles.navItem}
              activeOpacity={0.8}
              onPress={() =>
                router.push(item.route)
              }
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={
                  item.icon ===
                  "swap-horizontal"
                    ? 37 *
                      (small
                        ? 0.85
                        : tablet
                        ? 1.15
                        : 1)
                    : 35 *
                      (small
                        ? 0.85
                        : tablet
                        ? 1.15
                        : 1)
                }
                color="#FFFFFF"
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#071426",
  },

  app: {
    flex: 1,
    backgroundColor: "#071426",
  },

  header: {
    width: "100%",
    backgroundColor: "#071426",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    elevation: 10,
  },

  headerTitle: {
    flex: 1,
    color: "#FFFFFF",
    fontWeight: "700",
    textAlign: "center",
  },

  headerBell: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    elevation: 10,
  },

  whiteContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },

  whiteScroll: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },

  content: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },

  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  warningCircle: {
    backgroundColor: "#EEF5FF",
    alignItems: "center",
    justifyContent: "center",
  },

  description: {
    width: "90%",
    color: "#2C313A",
    textAlign: "center",
    fontWeight: "400",
  },

  formGroup: {
    width: "88%",
    maxWidth: 400,
    alignItems: "center",
  },

  label: {
    width: "100%",
    color: "#000000",
    fontWeight: "700",
    textAlign: "left",
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#252833",
    backgroundColor: "#FFFFFF",
    color: "#252833",
  },

  darkButton: {
    width: "75%",
    maxWidth: 260,
    backgroundColor: "#071426",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#25B5D1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    overflow: "hidden",
    zIndex: 20,
  },

  navItem: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});