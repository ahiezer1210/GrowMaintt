import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const OPTIONS = [
  ["shield-checkmark-outline", "Backup and synchronization", "Backup"],
  ["key-outline", "Change password", "Password"],
  ["cash-outline", "Expense control period", "Expenses"],
  ["phone-portrait-outline", "Linked devices", "Devices"],
  ["log-out-outline", "Log out", "Logout"],
  ["close-outline", "Delete account", "DeleteAccount"],
];

const NAV_ITEMS = [
  { name: "home-outline", key: "home", route: "Home" },
  { name: "bar-chart-outline", key: "reports", route: "Reports" },
  { name: "swap-horizontal-outline", key: "transactions", route: "Transactions" },
  { name: "layers-outline", key: "savings", route: "Savings" },
  { name: "person-outline", key: "profile", route: "Profile" },
];

export default function SettingsScreen({ navigation }) {
  const [selectedTheme, setSelectedTheme] = useState("light");
  const [activeTab, setActiveTab] = useState("profile");

  const handleOptionPress = (route) => {
    if (navigation && route) {
      navigation.navigate(route);
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.topRow}>
          <TouchableOpacity
            onPress={() => (navigation?.goBack ? navigation.goBack() : null)}
            activeOpacity={0.7}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Settings</Text>

          <TouchableOpacity
            onPress={() => navigation?.navigate("Notifications")}
            activeOpacity={0.7}
            style={styles.notificationBadge}
          >
            <Ionicons name="notifications-outline" size={18} color="#0D1B2A" />
          </TouchableOpacity>
        </View>

        {/* Themes */}
        <View style={styles.themesContainer}>
          <TouchableOpacity
            style={styles.themeOption}
            onPress={() => setSelectedTheme("light")}
            activeOpacity={0.8}
          >
            <Ionicons name="sunny-outline" size={38} color="#FFFFFF" />
            <View
              style={[
                styles.radioButton,
                selectedTheme === "light" && styles.radioActive,
              ]}
            />
            <Text style={styles.themeLabel}>Light theme</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.themeOption}
            onPress={() => setSelectedTheme("dark")}
            activeOpacity={0.8}
          >
            <Ionicons name="moon-outline" size={38} color="#FFFFFF" />
            <View
              style={[
                styles.radioButton,
                selectedTheme === "dark" && styles.radioActive,
              ]}
            />
            <Text style={styles.themeLabel}>Dark theme</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenedor Blanco Ajustado */}
      <View style={styles.contentCard}>
        <View style={styles.optionsList}>
          {OPTIONS.map(([icon, text, route]) => (
            <TouchableOpacity
              style={styles.optionRow}
              key={text}
              activeOpacity={0.7}
              onPress={() => handleOptionPress(route)}
            >
              <View style={styles.iconCircle}>
                <Ionicons name={icon} size={22} color="#FFFFFF" />
              </View>

              <Text style={styles.optionText}>{text}</Text>

              <Ionicons name="chevron-forward" size={24} color="#0D1B2A" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Navegación Celeste */}
        <View style={styles.bottomNavContainer}>
          <SafeAreaView edges={["bottom"]} style={styles.bottomNavSafeArea}>
            <View style={styles.bottomTabBar}>
              {NAV_ITEMS.map((item) => {
                const isSelected = activeTab === item.key;
                return (
                  <TouchableOpacity
                    key={item.key}
                    style={styles.tabItem}
                    activeOpacity={0.7}
                    onPress={() => {
                      setActiveTab(item.key);
                      if (navigation && item.route) {
                        navigation.navigate(item.route);
                      }
                    }}
                  >
                    <Ionicons
                      name={item.name}
                      size={26}
                      color={
                        isSelected ? "#FFFFFF" : "rgba(255, 255, 255, 0.65)"
                      }
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </SafeAreaView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1B2A",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 14,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  notificationBadge: {
    backgroundColor: "#FFFFFF",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  themesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  themeOption: {
    alignItems: "center",
  },
  radioButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#C4C4C4",
    marginVertical: 5,
  },
  radioActive: {
    backgroundColor: "#23BDEE",
  },
  themeLabel: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  contentCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    justifyContent: "space-between",
  },
  optionsList: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 12,
    justifyContent: "space-evenly",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#23BDEE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  optionText: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: "600",
    color: "#263238",
  },
  bottomNavContainer: {
    backgroundColor: "#FFFFFF",
  },
  bottomNavSafeArea: {
    backgroundColor: "#23BDEE",
    borderTopLeftRadius: 35,
  },
  bottomTabBar: {
    height: 55,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#23BDEE",
    borderTopLeftRadius: 35,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});