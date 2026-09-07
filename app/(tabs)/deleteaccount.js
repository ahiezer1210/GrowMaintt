import { useState } from "react";
import {
  Alert,
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
  Ionicons,
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
  dark: "#081023",
  white: "#FFFFFF",
  gray: "#ACADAD",
  textDark: "#0A3438",
};

const NAV = [
  ["home-outline", "ion"],
  ["bar-chart-outline", "ion"],
  ["swap-horizontal", "material"],
  ["layers-outline", "material"],
  ["person-outline", "ion"],
];

export default function DeleteAccount({ navigation }) {
  const [password, setPassword] = useState("");

  const { width, height } = useWindowDimensions();

  const BASE_WIDTH = 390;
  const BASE_HEIGHT = 844;

  const scale = Math.min(
    width / BASE_WIDTH,
    height / BASE_HEIGHT
  );

  const responsiveScale = Math.max(
    0.82,
    Math.min(scale, 1.12)
  );

  const s = (value) =>
    Math.round(value * responsiveScale);

  const horizontalPadding = Math.max(
    18,
    Math.min(width * 0.064, 34)
  );

  const small = width < 360;

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
                      if (navigation?.reset) {
                        navigation.reset({
                          index: 0,
                          routes: [
                            {
                              name: "Login",
                            },
                          ],
                        });
                      }
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
                error.code === "auth/wrong-password" ||
                error.code === "auth/invalid-credential"
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
                error.code === "auth/invalid-email"
              ) {
                Alert.alert(
                  "Error",
                  "The email associated with this account is invalid."
                );
              } else if (
                error.code === "auth/user-disabled"
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
      ]
    );
  };

  const handleCancel = () => {
    router.push("/settings");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.dark}
      />

      <View style={styles.app}>
        <View
          style={[
            styles.topContent,
            {
              paddingHorizontal: horizontalPadding,
            },
          ]}
        >
          <View
            style={[
              styles.header,
              {
                minHeight: s(65),
                marginTop: s(5),
                marginBottom: s(20),
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.backButton,
                {
                  width: s(44),
                  height: s(44),
                },
              ]}
              activeOpacity={0.7}
              onPress={handleCancel}
            >
              <Ionicons
                name="arrow-back"
                size={s(24)}
                color={COLORS.white}
              />
            </TouchableOpacity>

            <Text
              style={[
                styles.headerTitle,
                {
                  fontSize: s(18),
                },
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
            >
              Delete Account
            </Text>

            <TouchableOpacity
              style={[
                styles.headerNotification,
                {
                  width: s(44),
                  height: s(44),
                  borderRadius: s(22),
                },
              ]}
              activeOpacity={0.7}
            >
              <Ionicons
                name="notifications-outline"
                size={s(23)}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[
            styles.whiteContainer,
            {
              borderTopLeftRadius: s(45),
              borderTopRightRadius: s(45),
            },
          ]}
        >
          <ScrollView
            style={styles.whiteScroll}
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingHorizontal: horizontalPadding,
                paddingTop: s(40),
                paddingBottom: s(140),
              },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            <View style={styles.content}>
              <View
                style={[
                  styles.iconContainer,
                  {
                    height: s(155),
                    marginBottom: s(10),
                  },
                ]}
              >
                <View
                  style={[
                    styles.warningCircle,
                    {
                      width: s(135),
                      height: s(135),
                      borderRadius: s(68),
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="alert"
                    size={s(85)}
                    color="#1769E0"
                  />
                </View>
              </View>

              <Text
                style={[
                  styles.description,
                  {
                    fontSize: s(15),
                    lineHeight: s(22),
                    marginBottom: s(28),
                  },
                ]}
                adjustsFontSizeToFit
                minimumFontScale={0.85}
              >
                This action will delete all your data
                and cannot be undone.
              </Text>

              <Text
                style={[
                  styles.label,
                  {
                    fontSize: s(17),
                    marginBottom: s(10),
                  },
                ]}
              >
                Enter your password
              </Text>

              <TextInput
                style={[
                  styles.input,
                  {
                    height: s(58),
                    borderRadius: s(18),
                    paddingHorizontal: s(18),
                    fontSize: s(16),
                    marginBottom: s(25),
                  },
                ]}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
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
                  styles.deleteButton,
                  {
                    height: s(58),
                    borderRadius: s(30),
                  },
                ]}
                activeOpacity={0.8}
                onPress={handleDelete}
              >
                <Text
                  style={[
                    styles.deleteText,
                    {
                      fontSize: s(18),
                    },
                  ]}
                >
                  Delete Account
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  {
                    paddingVertical: s(12),
                  },
                ]}
                activeOpacity={0.7}
                onPress={handleCancel}
              >
                <Text
                  style={[
                    styles.cancelText,
                    {
                      fontSize: s(15),
                    },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        <BottomNav
          small={small}
          scale={responsiveScale}
        />
      </View>
    </SafeAreaView>
  );
}

function BottomNav({ small, scale }) {
  const s = (value) =>
    Math.round(value * scale);

  const routes = [
    "../../home",
    "/",
    "/",
    "/",
    "../../Edit_profile",
  ];

  return (
    <View
      style={[
        styles.bottom,
        {
          height: s(small ? 85 : 100),
          borderTopLeftRadius: s(
            small ? 45 : 65
          ),
        },
      ]}
    >
      {NAV.map(([icon, type], index) => (
        <TouchableOpacity
          key={index}
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => router.push(routes[index])}
        >
          {type === "ion" ? (
            <Ionicons
              name={icon}
              size={s(small ? 25 : 31)}
              color={
                index === 4
                  ? COLORS.dark
                  : COLORS.white
              }
            />
          ) : (
            <MaterialCommunityIcons
              name={icon}
              size={s(small ? 28 : 34)}
              color={COLORS.white}
            />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },

  app: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },

  topContent: {
    backgroundColor: COLORS.dark,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color: COLORS.white,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },

  headerNotification: {
    backgroundColor: COLORS.cyan,
    alignItems: "center",
    justifyContent: "center",
  },

  whiteContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    overflow: "hidden",
  },

  whiteScroll: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  scrollContent: {
    flexGrow: 1,
  },

  content: {
    width: "100%",
    backgroundColor: COLORS.white,
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
    shadowColor: "#1769E0",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 3,
  },

  description: {
    width: "100%",
    color: "#777C86",
    textAlign: "center",
    fontWeight: "400",
  },

  label: {
    width: "100%",
    color: "#555B66",
    fontWeight: "600",
  },

  input: {
    width: "100%",
    borderWidth: 1.5,
    borderColor: "#C8CCD5",
    backgroundColor: COLORS.white,
    color: "#252833",
  },

  deleteButton: {
    width: "100%",
    backgroundColor: COLORS.cyan,
    justifyContent: "center",
    alignItems: "center",
  },

  deleteText: {
    color: COLORS.white,
    fontWeight: "700",
  },

  cancelButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  cancelText: {
    color: "#777C86",
    fontWeight: "500",
  },

  bottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.cyan,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    zIndex: 20,
  },

  navItem: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});