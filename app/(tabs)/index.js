import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../../firebaseConfig";
export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Campos incompletos", "Ingresa tu correo y contraseña.");
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/home");
    } catch (error) {
      let message = "Ocurrió un error al iniciar sesión.";

      switch (error.code) {
        case "auth/invalid-email":
          message = "El correo no es válido.";
          break;
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          message = "Correo o contraseña incorrectos.";
          break;
        case "auth/too-many-requests":
          message = "Demasiados intentos. Intenta más tarde.";
          break;
      }

      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />

        <Text style={styles.title}>Sign In</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Email or Username</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#ACADAD"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>

        <View style={styles.passwordBox}>
          <TextInput
            style={styles.password}
            placeholder="Enter your password"
            placeholderTextColor="#ACADAD"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.show}>{showPassword ? "Hide" : "Show"}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push("/forgot-password")}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.or}>Or</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity style={styles.microsoftButton}>
          <Image
            source={require("../../assets/images/microsoft.jpeg")}
            style={styles.microsoftIcon}
          />

          <Text style={styles.microsoftText}>Continue with Microsoft</Text>
        </TouchableOpacity>

        <View style={styles.register}>
          <Text style={styles.account}>Don't have an account?</Text>

          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={styles.signup}>Sign Up</Text>
          </TouchableOpacity>
        </View>
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

  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 15,
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
    paddingTop: 40,
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
    marginBottom: 22,
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
  },

  password: {
    flex: 1,
  },

  show: {
    color: "#25B7D3",
    fontWeight: "700",
  },

  forgot: {
    textAlign: "right",
    color: "#25B7D3",
    marginTop: 15,
    marginBottom: 25,
  },

  button: {
    height: 55,
    backgroundColor: "#25B7D3",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 17,
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
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

  register: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },

  account: {
    color: "#ACADAD",
  },

  signup: {
    color: "#25B7D3",
    fontWeight: "700",
    marginLeft: 5,
  },
});
