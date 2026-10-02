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

import { useAppSettings } from "../../context/Appsettings";

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
  const { t, colors } = useAppSettings();

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

  const isDarkTheme =
    colors.background?.toLowerCase() === "#081023" ||
    colors.background?.toLowerCase() === "#071426" ||
    colors.primaryBackground?.toLowerCase() === "#081023" ||
    colors.primaryBackground?.toLowerCase() === "#071426";

  const handleDelete = async () => {
    const cleanPassword = password.trim();

    if (!cleanPassword) {
      Alert.alert(
        t.passwordRequired,
        t.passwordRequiredMessage
      );
      return;
    }

    Alert.alert(
      t.deleteAccountConfirm,
      t.deleteAccountConfirmMessage,
      [
        {
          text: t.cancel,
          style: "cancel",
        },
        {
          text: t.delete,
          style: "destructive",
          onPress: async () => {
            try {
              const user = auth.currentUser;

              if (!user) {
                Alert.alert(
                  t.error,
                  t.noAuthenticatedUser
                );
                return;
              }

              if (!user.email) {
                Alert.alert(
                  t.error,
                  t.noEmail
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
                t.accountDeleted,
                t.accountDeletedMessage,
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
                  t.incorrectPassword,
                  t.incorrectPasswordMessage
                );
              } else if (
                error.code ===
                "auth/requires-recent-login"
              ) {
                Alert.alert(
                  t.security,
                  t.securityMessage
                );
              } else if (
                error.code ===
                "auth/invalid-email"
              ) {
                Alert.alert(
                  t.error,
                  t.invalidEmail
                );
              } else if (
                error.code ===
                "auth/user-disabled"
              ) {
                Alert.alert(
                  t.error,
                  t.userDisabled
                );
              } else if (
                error.code ===
                "auth/network-request-failed"
              ) {
                Alert.alert(
                  t.connectionError,
                  t.connectionErrorMessage
                );
              } else {
                Alert.alert(
                  t.error,
                  error.message ||
                    t.unexpectedError
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
    <SafeAreaView
      style={[
        styles.safe,
        {
          backgroundColor:
            colors.primaryBackground,
        },
      ]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.header}
      />

      <View
        style={[
          styles.app,
          {
            backgroundColor:
              colors.primaryBackground,
          },
        ]}
      >
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
                height:
                  118 *
                  (small
                    ? 0.85
                    : tablet
                    ? 1.15
                    : 1),
                paddingHorizontal:
                  horizontalPadding,
                backgroundColor:
                  colors.header,
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
                color={colors.white}
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
                  color: colors.white,
                },
              ]}
            >
              {t.deleteAccount}
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
                color={colors.white}
              />
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.whiteContainer,
              {
                backgroundColor:
                  colors.background,
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
              style={[
                styles.whiteScroll,
                {
                  backgroundColor:
                    colors.background,
                },
              ]}
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
              <View
                style={[
                  styles.content,
                  {
                    backgroundColor:
                      colors.background,
                  },
                ]}
              >
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
                        backgroundColor:
                          isDarkTheme
                            ? "#172037"
                            : COLORS.cardBg,
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
                      color: colors.text,
                    },
                  ]}
                >
                  {t.deleteAccountDescription}
                </Text>

                <View style={styles.formGroup}>
                  <Text
                    style={[
                      styles.label,
                      {
                        fontSize: s(16),
                        marginBottom: s(8),
                        color: colors.text,
                      },
                    ]}
                  >
                    {t.enterYourPassword}
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
                        borderColor:
                          colors.border,
                        backgroundColor:
                          isDarkTheme
                            ? colors.primaryBackground
                            : COLORS.white,
                        color: colors.text,
                      },
                    ]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder=""
                    placeholderTextColor={
                      colors.secondaryText
                    }
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="password"
                    returnKeyType="done"
                    onSubmitEditing={
                      handleDelete
                    }
                  />

                  <TouchableOpacity
                    style={[
                      styles.darkButton,
                      {
                        height: s(46),
                        borderRadius: s(23),
                        marginBottom: s(12),
                        backgroundColor:
                          isDarkTheme
                            ? COLORS.cyan
                            : COLORS.dark,
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
                          color:
                            COLORS.white,
                        },
                      ]}
                    >
                      {t.delete}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.darkButton,
                      {
                        height: s(46),
                        borderRadius: s(23),
                        backgroundColor:
                          isDarkTheme
                            ? COLORS.cyan
                            : COLORS.dark,
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
                          color:
                            COLORS.white,
                        },
                      ]}
                    >
                      {t.cancel}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>

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
              backgroundColor:
                colors.nav,
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
                color={colors.white}
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
  },

  app: {
    flex: 1,
  },

  header: {
    width: "100%",
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
    overflow: "hidden",
  },

  whiteScroll: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },

  content: {
    width: "100%",
    alignItems: "center",
  },

  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  warningCircle: {
    alignItems: "center",
    justifyContent: "center",
  },

  description: {
    width: "90%",
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
    fontWeight: "700",
    textAlign: "left",
  },

  input: {
    width: "100%",
    borderWidth: 1,
  },

  darkButton: {
    width: "75%",
    maxWidth: 260,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    fontWeight: "600",
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
    zIndex: 20,
  },

  navItem: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});