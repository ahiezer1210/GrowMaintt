import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";

export default function LoginScreen() {

  const [showPassword, setShowPassword] = useState(false);

  return (

    <View style={styles.container}>


      <View style={styles.header}>

        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />

        <Text style={styles.title}>
          Sign In
        </Text>

      </View>

      <View style={styles.card}>

        <Text style={styles.label}>
          Email or Username
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#ACADAD"
        />

        <Text style={styles.label}>
          Password
        </Text>

        <View style={styles.passwordBox}>

          <TextInput
            style={styles.password}
            placeholder="Enter your password"
            placeholderTextColor="#ACADAD"
            secureTextEntry={!showPassword}
          />

          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.show}>
              {showPassword ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>

        </View>

        <TouchableOpacity>
          <Text style={styles.forgot}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>
            Sign In
          </Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.or}>
            Or
          </Text>
          <View style={styles.line} />
        </View>


        <TouchableOpacity style={styles.microsoftButton}>

          <Image
            source={require("../../assets/images/microsoft.jpeg")}
            style={styles.microsoftIcon}
          />

          <Text style={styles.microsoftText}>
            Continue with Microsoft
          </Text>

        </TouchableOpacity>

        <View style={styles.register}>
          <Text style={styles.account}>
            Don't have an account?
          </Text>

          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={styles.signup}>
              Sign Up
            </Text>
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