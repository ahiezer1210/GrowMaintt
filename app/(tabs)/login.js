import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
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
import { getDeviceId } from "../../utils/device";
import { getRealDeviceInfo } from "../../utils/deviceInfo";

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { width } = useWindowDimensions();

  const small = width < 360;
  const tablet = width >= 600;
  const horizontalPadding = tablet ? 50 : small ? 18 : 25;

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Incomplete fields", "Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      const user = credential.user;
      const userRef = doc(db, "Users", user.uid);
      const userSnapshot = await getDoc(userRef);

      if (!userSnapshot.exists()) {
        await setDoc(userRef, {
          points: 0,
          createdAt: serverTimestamp(),
        });
      }
      const deviceId = await getDeviceId();
      const { deviceName, location } = await getRealDeviceInfo();
      const devicesRef = collection(db, "Users", user.uid, "devices");
      const deviceRef = doc(db, "Users", user.uid, "devices", deviceId);
      const deviceSnapshot = await getDoc(deviceRef);

      if (deviceSnapshot.exists()) {
        await setDoc(
          deviceRef,
          {
            deviceName,
            location,
            lastLoginAt: serverTimestamp(),
          },
          { merge: true },
        );

        router.replace("/home");
        return;
      }

      const devicesSnapshot = await getDocs(devicesRef);
      const isFirstDevice = devicesSnapshot.empty;

      await setDoc(deviceRef, {
        deviceId,
        deviceName,
        location,
        firstLoginAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        trusted: isFirstDevice,
        primary: isFirstDevice,
      });

      if (isFirstDevice) {
        const userRef = doc(db, "Users", user.uid);
        await setDoc(
          userRef,
          {
            primaryDeviceId: deviceId,
          },
          { merge: true },
        );
      } else {
        const alertsRef = collection(db, "Users", user.uid, "securityAlerts");
        await addDoc(alertsRef, {
          uid: user.uid,
          deviceId,
          deviceName,
          location,
          type: "login_attempt",
          status: "pending",
          read: false,
          createdAt: serverTimestamp(),
        });
      }

      router.replace("/home");
    } catch (error) {
      let message = "Unable to sign in. Please try again.";

      switch (error.code) {
        case "auth/invalid-email":
          message = "The email address is not valid.";
          break;
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          message = "Incorrect email or password.";
          break;
        case "auth/too-many-requests":
          message = "Too many attempts. Please try again later.";
          break;
        case "permission-denied":
          message = "You do not have permission to access this data.";
          break;
      }

      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#081023" />

      <View style={styles.header}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Sign In</Text>
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

            <TouchableOpacity onPress={() => router.push("/forgotpassword")}>
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

            <View style={styles.register}>
              <Text style={styles.account}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={styles.signup}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
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
    paddingTop: 55,
    paddingBottom: 30,
    backgroundColor: "#081023",
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
    paddingBottom: 180,
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
    marginBottom: 12,
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
    marginBottom: 25,
  },

  button: {
    height: 55,
    backgroundColor: "#25B7D3",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 17,
  },

  register: {
    flexDirection: "row",
    justifyContent: "center",
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