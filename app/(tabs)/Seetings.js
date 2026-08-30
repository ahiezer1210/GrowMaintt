import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const options = [
  ["shield-checkmark-outline", "Backup and synchronization"],
  ["key-outline", "Change password"],
  ["cash-outline", "Expense control period"],
  ["phone-portrait-outline", "Log out"],
  ["close-outline", "Delete account"],
];

export default function Settings() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.top}>
          <Ionicons name="arrow-back" size={28} color="white" />
          <Text style={styles.title}>Settings</Text>
          <Ionicons name="notifications-outline" size={25} color="white" />
        </View>
        <View style={styles.themes}>
          <TouchableOpacity style={styles.theme}>
            <Ionicons name="sunny-outline" size={50} color="white" />
            <View style={[styles.radio, styles.active]} />
            <Text style={styles.themeText}>Light theme</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.theme}>
            <Ionicons name="moon-outline" size={50} color="white" />
            <View style={styles.radio} />
            <Text style={styles.themeText}>Dark Theme</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        {options.map(([icon, text]) => (
          <TouchableOpacity style={styles.option} key={text}>
            <View style={styles.circle}>
              <Ionicons name={icon} size={26} color="White" />
            </View>

            <Text style={styles.text}>{text}</Text>

            <Ionicons name="chevron-forward" size={26} color="#172334" />
          </TouchableOpacity>
        ))}

        <View style={styles.nav}>
          <Ionicons name="home-outline" size={30} color="white" />
          <Ionicons name="bar-chart-outline" size={30} color="white" />
          <Ionicons name="swap-horizontal-outline" size={30} color="white" />
          <Ionicons name="layers-outline" size={30} color="white" />
          <Ionicons name="person-outline" size={30} color="white" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111C2E",
  },

  header: {
    height: 210,
    padding: 25,
  },

  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    color: "white",
    fontSize: 25,
  },

  themes: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
  },

  theme: {
    alignItems: "center",
  },

  radio: {
    width: 18,
    height: 18,
    borderRadius: 20,
    backgroundColor: "#D9DDE0",
    marginVertical: 8,
  },

  active: {
    backgroundColor: "#25B7D3",
  },

  themeText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },

  card: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 20,
    paddingTop: 14,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    height: 75,
    gap: 20,
  },

  circle: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: "#25B7D3",
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    flex: 1,
    fontSize: 20,
    color: "#3E464C",
  },

  nav: {
    position: "absolute",
    height: 100,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "#25B7D3",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopLeftRadius: 80,
  },
});
