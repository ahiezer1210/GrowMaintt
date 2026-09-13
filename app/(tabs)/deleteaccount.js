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
  inputBorder: "#252833",
  cardBg: "#EEF5FF",
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
  const scale = Math.min(width / BASE_WIDTH, height / BASE_HEIGHT);
  const responsiveScale = Math.max(0.85, Math.min(scale, 1.2));

  const s = (value) => Math.round(value * responsiveScale);
  const horizontalPadding = Math.max(20, Math.min(width * 0.08, 40));
  const small = width < 360;

  const handleDelete = async () => {
    const cleanPassword = password.trim();

    if (!cleanPassword) {
      Alert.alert("Password Required", "Please enter your password to continue.");
      return;
    }

    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const user = auth.currentUser;

              if (!user) {
                Alert.alert("Error", "No authenticated user found.");
                return;
              }

              if (!user.email) {
                Alert.alert("Error", "The authenticated user does not have an email address.");
                return;
              }

              const credential = EmailAuthProvider.credential(user.email, cleanPassword);

              await reauthenticateWithCredential(user, credential);
              await deleteDoc(doc(db, "Users", user.uid));
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
                          routes: [{ name: "Login" }],
                        });
                      }
                    },
                  },
                ]
              );

              setPassword("");
            } catch (error) {
              console.log("Delete account error:", error);

              if (
                error.code === "auth/wrong-password" ||
                error.code === "auth/invalid-credential"
              ) {
                Alert.alert("Incorrect Password", "The password you entered is incorrect.");
              } else if (error.code === "auth/requires-recent-login") {
                Alert.alert("Security", "Please log in again before deleting your account.");
              } else if (error.code === "auth/invalid-email") {
                Alert.alert("Error", "The email associated with this account is invalid.");
              } else if (error.code === "auth/user-disabled") {
                Alert.alert("Error", "This account has been disabled.");
              } else if (error.code === "auth/network-request-failed") {
                Alert.alert("Connection Error", "Please check your internet connection and try again.");
              } else {
                Alert.alert("Error", error.message || "An unexpected error occurred.");
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
      <StatusBar barStyle="light-content" backgroundColor={COLORS.dark} />

      <View style={styles.app}>

        <View style={[styles.topContent, { paddingHorizontal: horizontalPadding }]}>
          <View style={[styles.header, { minHeight: s(55), marginTop: s(8), marginBottom: s(12) }]}>
            <TouchableOpacity
              style={[styles.iconButton, { width: s(40), height: s(40) }]}
              activeOpacity={0.7}
              onPress={handleCancel}
            >
              <Ionicons name="arrow-back" size={s(24)} color={COLORS.white} />
            </TouchableOpacity>

            <Text
              style={[styles.headerTitle, { fontSize: s(22) }]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              Delete Account
            </Text>

            <TouchableOpacity
              style={[styles.headerNotification, { width: s(38), height: s(38), borderRadius: s(19) }]}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={s(20)} color={COLORS.dark} />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[
            styles.whiteContainer,
            {
              borderTopLeftRadius: s(40),
              borderTopRightRadius: s(40),
            },
          ]}
        >
          <ScrollView
            style={styles.whiteScroll}
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingHorizontal: horizontalPadding,
                paddingTop: s(24),
                paddingBottom: s(90),
              },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            <View style={styles.content}>
              <View style={[styles.iconContainer, { marginBottom: s(20) }]}>
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
                This action will delete all of your data and this action cannot be undone.
              </Text>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { fontSize: s(16), marginBottom: s(8) }]}>
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
                  <Text style={[styles.buttonText, { fontSize: s(15) }]}>
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
                  <Text style={[styles.buttonText, { fontSize: s(15) }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>

        <BottomNav small={small} scale={responsiveScale} />
      </View>
    </SafeAreaView>
  );
}

function BottomNav({ small, scale }) {
  const s = (value) => Math.round(value * scale);

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
          height: s(small ? 68 : 78),
          borderTopLeftRadius: s(small ? 35 : 45),
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
              size={s(small ? 22 : 26)}
              color={COLORS.white}
            />
          ) : (
            <MaterialCommunityIcons
              name={icon}
              size={s(small ? 24 : 28)}
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
    justifyContent: "space-between",
  },
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: COLORS.white,
    fontWeight: "600",
    textAlign: "center",
  },
  headerNotification: {
    backgroundColor: "#DDF4F8",
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
    justifyContent: "center",
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
    backgroundColor: COLORS.cardBg,
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
    borderColor: COLORS.inputBorder,
    backgroundColor: COLORS.white,
    color: "#252833",
  },
  darkButton: {
    width: "75%",
    maxWidth: 260,
    backgroundColor: COLORS.dark,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "600",
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