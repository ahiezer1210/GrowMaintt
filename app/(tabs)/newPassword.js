import { router } from "expo-router";
import { FirebaseError } from "firebase/app";
import { updatePassword } from "firebase/auth";
import { useRef, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../../firebaseConfig";

export default function ChangePassword() {
  // Refs en vez de estado: escribir no dispara re-render de toda la pantalla.
  const newPasswordRef = useRef("");
  const confirmPasswordRef = useRef("");

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

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
      Alert.alert(
        "Error",
        "There is no user currently signed in."
      );
      return;
    }

    try {
      setLoading(true);

      await updatePassword(user, newPassword);

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
      console.log(error);

      if (
        error instanceof FirebaseError &&
        error.code === "auth/requires-recent-login"
      ) {
        Alert.alert(
          "Session expired",
          "You need to sign in again."
        );
      } else if (
        error instanceof FirebaseError &&
        error.code === "auth/weak-password"
      ) {
        Alert.alert(
          "Weak password",
          "The password must be stronger."
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Change Password
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          New Password
        </Text>

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
          />

          <TouchableOpacity
            onPress={() => setShowNew(!showNew)}
          >
            <Text style={styles.show}>
              {showNew ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>
          Confirm Password
        </Text>

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
          />

          <TouchableOpacity
            onPress={() => setShowConfirm(!showConfirm)}
          >
            <Text style={styles.show}>
              {showConfirm ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={changePassword}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Changing..." : "Change Password"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#081023",
  },

  header: {
    height: 205,
    alignItems: "center",
    paddingTop: 55,
    paddingBottom: 30,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
  },

  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 30,
    paddingTop: 30,
  },

  label: {
    color: "#081023",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },

  input: {
    height: 55,
    backgroundColor: "#F3F4F5",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#000000",
    paddingHorizontal: 18,
    marginBottom: 35,
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
    marginBottom: 15,
  },

  password: {
    flex: 1,
    fontSize: 14,
  },

  show: {
    color: "#25B7D3",
    fontWeight: "700",
  },

  button: {
    height: 58,
    backgroundColor: "#25B7D3",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 17,
  },
});