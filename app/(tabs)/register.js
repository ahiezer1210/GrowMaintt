import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { auth, db } from "../../firebaseConfig.js";

export default function SignupScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { width } = useWindowDimensions();

  const small = width < 360;
  const tablet = width >= 600;
  const horizontalPadding = tablet ? 50 : small ? 18 : 25;
  const titleFontSize = tablet ? 34 : 28;
  const labelFontSize = tablet ? 16 : 14;
  const inputHeight = tablet ? 58 : 50;
  const passwordBoxHeight = tablet ? 56 : 48;
  const buttonHeight = tablet ? 54 : 48;
  const buttonFontSize = tablet ? 19 : 17;

  const registerusers = async () => {
    if (!username.trim() || !email.trim() || !password || !confirmpassword) {
      Alert.alert("Incomplete fields", "Please fill in all the required fields.");
      return;
    }
    if (password !== confirmpassword) {
      Alert.alert("Passwords don't match");
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        "Invalid password",
        "The password must have at least 8 characters",
      );
      return;
    }

    if (!/[A-Z]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      Alert.alert(
        "Invalid password",
        "The password must have at least one capital letter or special character",
      );
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      const user = userCredential.user;
      await setDoc(doc(db, "Users", user.uid), {
        username: username.trim(),
        email: email.trim(),
        uid: user.uid,
      });

      Alert.alert("Registration successfully", "", [
        {
          text: "Ok",
          onPress: () => router.push("/identityverification"),
        },
      ]);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Email already exists");
      } else if (error.code === "auth/username-already-in-use") {
        Alert.alert("Username already exists");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Invalid Email");
      } else if (error.code === "auth/weak-password") {
        Alert.alert("The password must have at least 6 characters");
      } else {
        console.log(error.code, error.message);
        Alert.alert("Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.topContent}>
          <View style={styles.header}>
            <Text style={[styles.title, { fontSize: titleFontSize }]}>
              Register
            </Text>
          </View>
        </View>

        <View style={styles.whiteContainer}>
          <ScrollView
            style={styles.whiteScroll}
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingHorizontal: horizontalPadding,
              },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.card}>
              <Text style={[styles.label, { fontSize: labelFontSize }]}>
                Username
              </Text>
              <TextInput
                style={[styles.input, { height: inputHeight }]}
                placeholder="Enter your username"
                value={username}
                onChangeText={setUsername}
                placeholderTextColor="#ACADAD"
                autoCapitalize="none"
              />

              <Text style={[styles.label, { fontSize: labelFontSize }]}>
                E-mail
              </Text>
              <TextInput
                style={[styles.input, { height: inputHeight }]}
                placeholder="Enter your E-mail"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#ACADAD"
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
              />

              <Text style={[styles.label, { fontSize: labelFontSize }]}>
                Password
              </Text>
              <View style={[styles.passwordBox, { height: passwordBoxHeight }]}>
                <TextInput
                  style={styles.password}
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  placeholderTextColor="#ACADAD"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Text style={styles.show}>{showPassword ? "Hide" : "Show"}</Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.label, { fontSize: labelFontSize }]}>
                Confirm Password
              </Text>
              <View style={[styles.passwordBox, { height: passwordBoxHeight }]}>
                <TextInput
                  style={styles.password}
                  placeholder="Confirm your password"
                  value={confirmpassword}
                  onChangeText={setConfirmPassword}
                  placeholderTextColor="#ACADAD"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Text style={styles.show}>{showPassword ? "Hide" : "Show"}</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[
                  styles.button,
                  { height: buttonHeight },
                  loading && { opacity: 0.7 },
                ]}
                onPress={registerusers}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={[styles.buttonText, { fontSize: buttonFontSize }]}>
                    Next
                  </Text>
                )}
              </TouchableOpacity>

              <View style={styles.loginRow}>
                <Text style={styles.accountText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => router.push("/login")}>
                  <Text style={styles.loginText}>Sign In</Text>
                </TouchableOpacity>
              </View>
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

  keyboardContainer: {
    flex: 1,
  },

  topContent: {
    backgroundColor: "#081023",
    paddingHorizontal: 25,
  },

  header: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 20,
  },

  title: {
    color: "#FFFFFF",
    fontWeight: "700",
    transform: [{ translateX: 4}],
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
    paddingTop: 35,
    paddingBottom: 30,
  },

  card: {
    backgroundColor: "#FFFFFF",
    paddingBottom: 20,
  },

  label: {
    color: "#081023",
    fontWeight: "600",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#F3F4F5",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#000000",
    paddingHorizontal: 18,
    marginBottom: 20,
    color: "#081023",
  },

  passwordBox: {
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
    color: "#081023",
  },

  show: {
    color: "#25B7D3",
    fontWeight: "700",
  },

  button: {
    backgroundColor: "#25B7D3",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 20,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  accountText: {
    color: "#ACADAD",
  },

  loginText: {
    color: "#25B7D3",
    fontWeight: "700",
    marginLeft: 5,
  },
});