import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function VerificationScreen() {
  const [code, setCode] = useState(["1", "2", "3", "4", "5", "6"]);
  const [verificationCode, setVerificationCode] = useState("123456");

  const handleCodeChange = (value, index) => {
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
  };

  const sendAgain = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();

    setVerificationCode(newCode);
    setCode(["", "", "", "", "", ""]);

    Alert.alert("New code", `Your verification code is: ${newCode}`);
  };

  const acceptCode = () => {
    const enteredCode = code.join("");

    if (enteredCode.length < 6) {
      Alert.alert(" Incomplete code", "Enter the 6 numbers");
      return;
    }

    if (enteredCode === verificationCode) {
      Alert.alert("Correct code", "Your code has been verified", [
        {
          text: "Aceptar",
          onPress: () => router.back(),
        },
      ]);
    } else {
      Alert.alert(
        "Incorrect code",
        "The email that was entered is not correct",
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Verification code</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.instruction}>Enter the code sent to</Text>

        <Text style={styles.instruction}>your email</Text>

        <View style={styles.codeContainer}>
          {code.map((number, index) => (
            <TextInput
              key={index}
              style={styles.codeInput}
              value={number}
              onChangeText={(value) => handleCodeChange(value, index)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              textAlignVertical="center"
            />
          ))}
        </View>

        <TouchableOpacity style={styles.acceptButton} onPress={acceptCode}>
          <Text style={styles.acceptText}>Accept</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sendButton} onPress={sendAgain}>
          <Text style={styles.sendText}>Send Again</Text>
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
    paddingTop: 70,
    paddingHorizontal: 30,
    paddingBottom: 35,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "700",
  },

  card: {
    flex: 1,
    backgroundColor: "#F3FFF5",
    borderTopLeftRadius: 55,
    borderTopRightRadius: 55,
    paddingHorizontal: 30,
    paddingTop: 65,
    alignItems: "center",
  },

  instruction: {
    color: "#081023",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },

  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 45,
    gap: 9,
  },

  codeInput: {
    width: 42,
    height: 42,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#081023",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 20,
    fontWeight: "600",
    color: "#081023",
    backgroundColor: "#F3FFF5",
    padding: 0,
    margin: 0,
    includeFontPadding: false,
  },

  acceptButton: {
    width: 130,
    height: 38,
    backgroundColor: "#25B7D3",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 65,
  },

  acceptText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  sendButton: {
    width: 130,
    height: 35,
    backgroundColor: "#DDF5E5",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  sendText: {
    color: "#081023",
    fontSize: 15,
    fontWeight: "600",
  },
});
