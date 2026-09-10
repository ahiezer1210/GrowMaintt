import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { useState } from "react";
import {
  Alert,
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
  const { width, height } = useWindowDimensions();
  const tablet = width >= 600;

  const registerusers = async () => {
    if (!username.trim() || !email.trim() || !password || !confirmpassword) {
      Alert.alert("Incomplete fields");
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
        "The password must have at least one capital letter or special caracter",
      );
      return;
    }
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
          onPress: () => router.push("/home"),
        },
      ]);
    } catch (error) {
      if (error.code == "auth/email-already-in-use") {
        Alert.alert("Email already exits");
      } else if (error.code === "auth/username-already-in-use") {
        Alert.alert("Username already exits");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Invalid Email");
      } else if (error.code === "auth/weak-password") {
        Alert.alert("The password must have at least 6 chracters");
      } else {
        console.log(error.code, error.message);
        Alert.alert("Error", error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Register</Text>
      </View>

      <View style={[styles.card, tablet && { paddingTop: 55 }]}>
        <Text style={styles.label}>Username</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#ACADAD"
          autoCapitalize="none"
        />

        <Text style={styles.label}>E-mail</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your E-mail"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#ACADAD"
          autoCapitalize="none"
          keybooardType="email-address"
          autoCorrect={false}
        />

        <Text style={styles.label}>Password</Text>

        <View style={styles.passwordBox}>
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

        <Text style={styles.label}>Confirm Password</Text>

        <View style={styles.passwordBox}>
          <TextInput
            style={styles.password}
            placeholder="Enter your password"
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

        <TouchableOpacity style={styles.button} onPress={registerusers}>
          <Text style={styles.buttonText}>Next</Text>
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
    paddingTop: 25,
  },

  label: {
    color: "#081023",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },

  input: {
    height: 48,
    backgroundColor: "#F3F4F5",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#000000",
    paddingHorizontal: 18,
    marginBottom: 34,
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
    marginBottom: 28,
  },

  password: {
    flex: 1,
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
