import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function SignOutScreen() {
  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          onPress: () => router.replace("/login"),
        },
      ]
    );
  };

  const handleAllDevices = () => {
    Alert.alert(
      "Sign Out Everywhere",
      "Are you sure you want to sign out on all your devices?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Go",
          onPress: () => router.replace("/login"),
        },
      ]
    );
  };

  return (
    <View style={styles.screen}>

      {/* BLUE HEADER */}

      <View style={styles.blueHeader}>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={34}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Sign Out
        </Text>

        <TouchableOpacity style={styles.headerButton}>
          <Ionicons
            name="notifications-outline"
            size={32}
            color="#D7FFF8"
          />
        </TouchableOpacity>

      </View>

    

      <View style={styles.whiteSection}>

        <View style={styles.content}>

          

          <View style={styles.illustrationCircle}>

            <View style={styles.doorContainer}>

              <View style={styles.whiteDoor}>
                <View style={styles.keyhole} />
              </View>

              <View style={styles.blueDoor} />

              <View style={styles.arrowCircle}>
                <Ionicons
                  name="arrow-forward"
                  size={32}
                  color="#FFFFFF"
                />
              </View>

            </View>

          </View>

        

          <Text style={styles.question}>
            Are you sure you want to
            {"\n"}
            sign out?
          </Text>


          <Text style={styles.description}>
            You will be signed out of this device.
            {"\n"}
            To access your account again, you will
            {"\n"}
            need to sign in again.
          </Text>

          

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleSignOut}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              Sign Out
            </Text>
          </TouchableOpacity>

    

          <Text style={styles.otherDevices}>
            Or sign out on all your devices
          </Text>

          

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleAllDevices}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              Go
            </Text>
          </TouchableOpacity>

        </View>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  screen: {
    flex: 1,
    backgroundColor: "#FFFDF8",
  },

  

  blueHeader: {
    height: 270,
    backgroundColor: "#081023",

    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",

    paddingTop: 45,
    paddingHorizontal: 22,

    borderBottomLeftRadius: 55,
    borderBottomRightRadius: 55,
  },

  headerButton: {
    width: 50,
    height: 50,

    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 7,
  },

  

  whiteSection: {
    flex: 1,

    backgroundColor: "#FFFDF8",

    marginTop: -55,

    borderTopLeftRadius: 55,
    borderTopRightRadius: 55,

    overflow: "hidden",
  },

  content: {
    flex: 1,

    alignItems: "center",

    paddingTop: 27,
    paddingHorizontal: 25,
  },

  

  illustrationCircle: {
    width: 140,
    height: 140,

    borderRadius: 70,

    backgroundColor: "#E5F6FA",

    alignItems: "center",
    justifyContent: "center",
  },

  doorContainer: {
    width: 105,
    height: 105,

    position: "relative",
  },

  whiteDoor: {
    position: "absolute",

    left: 4,
    top: 5,

    width: 68,
    height: 91,

    backgroundColor: "#FFFFFF",

    borderWidth: 4,
    borderColor: "#C8D5DA",

    borderRadius: 10,

    alignItems: "center",
    justifyContent: "center",

    zIndex: 3,
  },

  keyhole: {
    width: 11,
    height: 19,

    borderRadius: 8,

    backgroundColor: "#081023",
  },

  blueDoor: {
    position: "absolute",

    right: 2,
    top: 14,

    width: 56,
    height: 86,

    backgroundColor: "#27A9D4",

    borderRadius: 8,
  },

  arrowCircle: {
    position: "absolute",

    right: -13,
    top: 34,

    width: 56,
    height: 56,

    borderRadius: 28,
   
    backgroundColor: "#27A9D4",

    alignItems: "center",
    justifyContent: "center",

    zIndex: 5,
  },

  

  question: {
    color: "#081023",

    fontSize: 21,
    lineHeight: 27,

    fontWeight: "800",

    textAlign: "center",

    marginTop: 16,
  },

  description: {
    color: "#858585",

    fontSize: 13,
    lineHeight: 18,

    textAlign: "center",

    marginTop: 10,
  },

  

  actionButton: {
    width: "88%",
    height: 48,

    backgroundColor: "#27A9D4",

    borderRadius: 26,

    alignItems: "center",
    justifyContent: "center",

    marginTop: 14,
  },

  buttonText: {
    color: "#FFFFFF",

    fontSize: 17,

    fontWeight: "800",
  },

  otherDevices: {
    color: "#858585",

    fontSize: 13,

    textAlign: "center",

    marginTop: 10,
  },

});