import { router } from "expo-router";
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

export default function VerificationScreen() {

  const { width } = useWindowDimensions();

  const isSmallScreen = width < 360;
  const isMediumScreen = width >= 360 && width < 600;
  const isTablet = width >= 600;

  const scale = isSmallScreen
    ? 0.85
    : isMediumScreen
      ? 1
      : isTablet
        ? 1.15
        : 1.25;

  const horizontalPadding = isSmallScreen
    ? 18
    : isMediumScreen
      ? 25
      : isTablet
        ? 45
        : 60;

  const s = (value) => Math.round(value * scale);

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
      <View
        style={[
          styles.header,
          {
            paddingTop: s(70),
            paddingHorizontal: horizontalPadding,
            paddingBottom: s(35),
          },
        ]}
      >
        <Text
          style={[
            styles.title,
            {
              fontSize: s(25),
            },
          ]}
        >
          Verification code
        </Text>
      </View>

      <View
        style={[
          styles.card,
          {
            borderTopLeftRadius: s(55),
            borderTopRightRadius: s(55),
            paddingHorizontal: horizontalPadding,
            paddingTop: s(65),
          },
        ]}
      >
        <Text
          style={[
            styles.instruction,
            {
              fontSize: s(15),
            },
          ]}
        >
          Enter the code sent to
        </Text>

        <Text
          style={[
            styles.instruction,
            {
              fontSize: s(15),
            },
          ]}
        >
          your email
        </Text>
        <View
          style={[
            styles.codeContainer,
            {
              marginTop: s(45),
              gap: s(9),
            },
          ]}
        >
          {code.map((number, index) => (
            <TextInput
              key={index}
              style={[
                styles.codeInput,
                {
                  width: s(42),
                  height: s(42),
                  borderRadius: s(22),
                  fontSize: s(20),
                },
              ]}
              value={number}
              onChangeText={(value) => handleCodeChange(value, index)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              textAlignVertical="center"
            />
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.acceptButton,
            {
              width: s(130),
              height: s(38),
              borderRadius: s(20),
              marginTop: s(65),
            },
          ]}
          onPress={acceptCode}
        >
          <Text
            style={[
              styles.acceptText,
              {
                fontSize: s(15),
              },
            ]}
          >
            Accept
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              width: s(130),
              height: s(35),
              borderRadius: s(20),
              marginTop: s(10),
            },
          ]}
          onPress={sendAgain}
        >
          <Text
            style={[
              styles.sendText,
              {
                fontSize: s(15),
              },
            ]}
          >
            Send Again
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
    backgroundColor: "#ffffff",
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
    backgroundColor: "#ffffff",
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
    backgroundColor: "#25B7D3",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  sendText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
});