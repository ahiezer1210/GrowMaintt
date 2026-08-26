import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../../firebaseConfig.js";

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");

  const registerusers = async () => {
    if (!username || !email || !password || !confirmpassword) {
      Alert.alert("Incomplete fields");
      return;
    }
    if (password !== confirmpassword) {
      Alert.alert("Passwords don't match");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Invalid password");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      await setDoc(doc(db, "Users", user.uid), {
        username: username,
        email: email,
        uid: user.uid,
      });

      Alert.alert("Registration succesfully", [
        {
          text: "Ok",
          onPress: () => router.push("/verification"),
        },
      ]);
    } catch (error) {
      if (error.code == "auth/email-already-in-use") {
        Alert.alert("Email already exits");
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

      <View style={styles.card}>
        <Text style={styles.label}>Username</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#ACADAD"
        />

        <Text style={styles.label}>E-mail</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your E-mail"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#ACADAD"
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
          />

          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.show}>{showPassword ? "Hide" : "Show"}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={registerusers}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.or}>Or</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity style={styles.microsoftButton}>
          <Image
            source={require("../../assets/images/Microsoft.png")}
            style={styles.microsoftIcon}
          />

          <Text style={styles.microsoftText}>Continue with Microsoft</Text>
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
    marginBottom: 22,
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

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ACADAD",
  },

  or: {
    marginHorizontal: 12,
    color: "#ACADAD",
  },

  microsoftButton: {
    height: 55,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ACADAD",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  microsoftIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },

  microsoftText: {
    color: "#081023",
    fontWeight: "600",
  },
});
