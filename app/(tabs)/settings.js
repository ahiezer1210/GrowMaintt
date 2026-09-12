import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const OPTIONS = [
  ["shield-checkmark-outline", "Backup and synchronization", "backup"],
  ["key-outline", "Change password", "newPassword"],
  ["cash-outline", "Expense control period", "Expensecontrolperiod"],
  ["phone-portrait-outline", "Linked devices", "linkeddevices"],
  ["log-out-outline", "Log out", "signout"],
  ["close-outline", "Delete account", "deleteaccount"],
];

const NAV_ITEMS = [
  {
    icon: "home-outline",
    key: "home",
    route: "/home",
  },
  {
    icon: "chart-box-outline",
    key: "reports",
    route: "/historial",
  },
  {
    icon: "swap-horizontal",
    key: "expenses",
    route: "/expensesManagement",
  },
  {
    icon: "layers-outline",
    key: "savings",
    route: "/currentgoal",
  },
  {
    icon: "account-outline",
    key: "profile",
    route: "/profile",
  },
];

export default function SettingsScreen() {
  const [selectedTheme, setSelectedTheme] = useState("light");

  const { width } = useWindowDimensions();

  const small = width < 350;
  const tablet = width >= 600;

  const handleOptionPress = (route) => {
    router.push(`/${route}`);
  };

  const abrirNotificaciones = () => {
    router.push({
      pathname: "/notifications",
      params: {
        from: "/settings",
      },
    });
  };

  return (
    <SafeAreaView
      edges={["top"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.topRow}>
          <TouchableOpacity
            onPress={() => router.push("/profile")}
            activeOpacity={0.7}
            style={styles.backButton}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={35}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <Text
            style={[
              styles.headerTitle,
              {
                fontSize:
                  25 * (small ? 0.85 : tablet ? 1.15 : 1),
                transform: [
                  {
                    translateX:
                      7 * (small ? 0.85 : tablet ? 1.15 : 1),
                  },
                  {
                    translateY:
                      1 * (small ? 0.85 : tablet ? 1.15 : 1),
                  },
                ],
              },
            ]}
          >
            Settings
          </Text>

          <TouchableOpacity
            onPress={abrirNotificaciones}
            activeOpacity={0.7}
            style={styles.notificationBadge}
          >
            <MaterialCommunityIcons
              name="bell-circle-outline"
              size={35}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.themesContainer}>
          <TouchableOpacity
            style={styles.themeOption}
            onPress={() => setSelectedTheme("light")}
            activeOpacity={0.8}
          >
            <Ionicons
              name="sunny-outline"
              size={38}
              color="#FFFFFF"
            />

            <View
              style={[
                styles.radioButton,
                selectedTheme === "light" &&
                  styles.radioActive,
              ]}
            />

            <Text style={styles.themeLabel}>
              Light theme
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.themeOption}
            onPress={() => setSelectedTheme("dark")}
            activeOpacity={0.8}
          >
            <Ionicons
              name="moon-outline"
              size={38}
              color="#FFFFFF"
            />

            <View
              style={[
                styles.radioButton,
                selectedTheme === "dark" &&
                  styles.radioActive,
              ]}
            />

            <Text style={styles.themeLabel}>
              Dark theme
            </Text>
          </TouchableOpacity>
        </View>
      </View>

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
                <Ionicons
                  name={icon}
                  size={22}
                  color="#FFFFFF"
                />
              </View>

              <Text style={styles.optionText}>
                {text}
              </Text>

              <Ionicons
                name="chevron-forward"
                size={22}
                color="#0D1B2A"
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomNavContainer}>
          <SafeAreaView
            edges={["bottom"]}
            style={styles.bottomNavSafeArea}
          >
            <View style={styles.bottomTabBar}>
              {NAV_ITEMS.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={styles.tabItem}
                  activeOpacity={0.7}
                  onPress={() => router.push(item.route)}
                >
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={
                      item.icon === "swap-horizontal"
                        ? 37
                        : 35
                    }
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
              ))}
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
    paddingHorizontal: 25,
    paddingTop: 6,
    paddingBottom: 14,
    backgroundColor: "#071426",
  },

  topRow: {
    height: 118,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  backButton: {
    width: 30,
    height: 48,
    justifyContent: "center",
    alignItems: "flex-start",
    transform: [{ translateY: 4 }],
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#FFFFFF",
    fontWeight: "700",
  },

  notificationBadge: {
    width: 35,
    height: 48,
    justifyContent: "center",
    alignItems: "flex-end",
    transform: [{ translateY: 4 }],
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
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    overflow: "hidden",
    justifyContent: "space-between",
  },

  optionsList: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 16,
    justifyContent: "space-between",
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
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
    backgroundColor: "#25B5D1",
    borderTopLeftRadius: 78,
  },

  bottomTabBar: {
    height: 65,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#25B5D1",
    borderTopLeftRadius: 78,
  },

  tabItem: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});