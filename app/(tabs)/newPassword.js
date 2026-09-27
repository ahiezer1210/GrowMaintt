import { router } from "expo-router";
import { FirebaseError } from "firebase/app";
import { updatePassword } from "firebase/auth";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { useRef, useState } from "react";
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
  View,
  useWindowDimensions,
} from "react-native";
import { auth, db } from "../../firebaseConfig";

export default function ChangePassword() {
  const newPasswordRef = useRef("");
  const confirmPasswordRef = useRef("");

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const { width } = useWindowDimensions();

  const small = width < 360;
  const tablet = width >= 600;
  const horizontalPadding = tablet ? 50 : small ? 18 : 25;

  const createSecurityAlert = async (user) => {
    try {
      const alertsRef = collection(
        db,
        "Users",
        user.uid,
        "securityAlerts"
      );

      await addDoc(alertsRef, {
        uid: user.uid,
        type: "password_change",
        title: "Password changed",
        message:
          "Your account password was changed successfully. If you did not make this change, secure your account immediately.",
        read: false,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.log("Error creating password security alert:", error);
    }
  };

  const changePassword = async () => {
    const newPassword = newPasswordRef.current;
    const confirmPassword = confirmPasswordRef.current;

    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please complete all fields.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(
        "Error",
        "The password must be at least 6 characters long."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "The passwords do not match.");
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "There is no user currently signed in.");
      return;
    }

    try {
      setLoading(true);

      await updatePassword(user, newPassword);

      await createSecurityAlert(user);

      newPasswordRef.current = "";
      confirmPasswordRef.current = "";

      Alert.alert(
        "Success",
        "Your password was changed successfully.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/login"),
          },
        ]
      );
    } catch (error) {
      console.log("Password change error:", error);

      if (
        error instanceof FirebaseError &&
        error.code === "auth/requires-recent-login"
      ) {
        Alert.alert(
          "Session expired",
          "You need to sign in again before changing your password."
        );
      } else if (
        error instanceof FirebaseError &&
        error.code === "auth/weak-password"
      ) {
        Alert.alert(
          "Weak password",
          "The password must be stronger."
        );
      } else if (
        error instanceof FirebaseError &&
        error.code === "auth/network-request-failed"
      ) {
        Alert.alert(
          "Without connection",
          "Could not connect to Firebase. Check your Internet connection."
        );
      } else {
        Alert.alert(
          "Error",
          "The password could not be changed."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#081023"
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Change Password</Text>
        </View>

        <View style={styles.whiteContainer}>
          <ScrollView
            style={styles.whiteScroll}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingHorizontal: horizontalPadding },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            alwaysBounceVertical={true}
            overScrollMode="always"
          >
            <View style={styles.card}>
              <Text style={styles.label}>New Password</Text>

              <View style={styles.passwordBox}>
                <TextInput
                  placeholder="Enter your new password"
                  placeholderTextColor="#ACADAD"
                  style={styles.password}
                  defaultValue=""
                  onChangeText={(text) => {
                    newPasswordRef.current = text;
                  }}
                  secureTextEntry={!showNew}
                  autoCapitalize="none"
                  autoCorrect={false}
                  spellCheck={false}
                  autoComplete="off"
                  textContentType="oneTimeCode"
                  importantForAutofill="no"
                  editable={!loading}
                />

                <TouchableOpacity
                  onPress={() => setShowNew(!showNew)}
                  disabled={loading}
                >
                  <Text style={styles.show}>
                    {showNew ? "Hide" : "Show"}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Confirm Password</Text>

              <View style={styles.passwordBox}>
                <TextInput
                  placeholder="Confirm your password"
                  placeholderTextColor="#ACADAD"
                  style={styles.password}
                  defaultValue=""
                  onChangeText={(text) => {
                    confirmPasswordRef.current = text;
                  }}
                  secureTextEntry={!showConfirm}
                  autoCapitalize="none"
                  autoCorrect={false}
                  spellCheck={false}
                  autoComplete="off"
                  textContentType="oneTimeCode"
                  importantForAutofill="no"
                  editable={!loading}
                />

                <TouchableOpacity
                  onPress={() =>
                    setShowConfirm(!showConfirm)
                  }
                  disabled={loading}
                >
                  <Text style={styles.show}>
                    {showConfirm ? "Hide" : "Show"}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[
                  styles.button,
                  loading && { opacity: 0.7 },
                ]}
                onPress={changePassword}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>
                  {loading
                    ? "Changing..."
                    : "Change Password"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#081023",
  },

  header: {
    alignItems: "center",
    paddingTop: 65,
    paddingBottom: 100,
    backgroundColor: "#081023",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
  },

  whiteContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    overflow: "hidden",
  },

  whiteScroll: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollContent: {
    flexGrow: 1,
    paddingTop: 40,
    paddingBottom: 350,
  },

  card: {
    backgroundColor: "#FFFFFF",
    paddingBottom: 40,
  },

  label: {
    color: "#081023",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },

  passwordBox: {
    height: 55,
    backgroundColor: "#F3F4F5",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#000000",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    marginBottom: 20,
  },

  password: {
    flex: 1,
    fontSize: 14,
    color: "#081023",
  },

  show: {
    color: "#25B7D3",
    fontWeight: "700",
  },

  button: {
    height: 55,
    backgroundColor: "#25B7D3",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 17,
  },
});