import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function AgeConfirmation() {
  const navIcons = [
    "home-outline",
    "chart-box-outline",
    "swap-horizontal",
    "layers-outline",
    "account-outline",
  ];

  return (
    <View style={styles.screen}>
      <StatusBar
        translucent
        backgroundColor="#0b1624"
        barStyle="light-content"
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Age Confirmation</Text>

        <View style={styles.headerSpace} />
      </View>

      <View style={styles.main}>
        <View style={styles.content}>
          <Text style={styles.messageText}>
            To Use This Application,{"\n"}
            You Must Be 18 Years Or Older.
          </Text>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
              <Text style={styles.buttonText}>I Am 18 Or Older</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.secondButton]}
              onPress={() => {}}
            >
              <Text style={styles.buttonText}>I Am Under 18</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomBar}>
          {navIcons.map((icon, index) => (
            <TouchableOpacity key={icon} style={styles.navButton}>
              <MaterialCommunityIcons
                name={icon}
                size={index === 2 ? 28 : 24}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0b1624",
  },

  header: {
    height: 115,
    paddingHorizontal: 17,
    backgroundColor: "#0b1624",
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    width: 41,
    height: 46,
    justifyContent: "center",
    alignItems: "flex-start",
  },

  headerTitle: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "bold",
    textAlign: "center",
  },

  headerSpace: {
    width: 30,
  },

  main: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    overflow: "hidden",
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  messageText: {
    color: "#0b1624",
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 40,
  },

  buttonsContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 40,
    gap: 15,
  },

  actionButton: {
    width: 240,
    height: 53,
    borderRadius: 22,
    backgroundColor: "#0b1624",
    alignItems: "center",
    justifyContent: "center",
  },

  secondButton: {
    marginTop: 14,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  bottomBar: {
    height: 85,
    backgroundColor: "#25B7D3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopLeftRadius: 50,
  },

  navButton: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
