import { FirebaseError } from "firebase/app";
import { updatePassword } from "firebase/auth";
import { useState } from "react";
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
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const changePassword = async () => {
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

      Alert.alert(
        "Success",
        "Your password was changed successfully."
      );

      setNewPassword("");
      setConfirmPassword("");
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
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showNew}
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
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirm}
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

  passwordBox: {
    height: 48,
    backgroundColor: "#F3F4F5",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#000000",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    marginBottom: 22,
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
    height: 48,
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