import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const OPTIONS = [
  { icon: "shield-checkmark-outline", label: "Backup and synchronization", route: "Backup" },
  { icon: "key-outline", label: "Change password", route: "Password" },
  { icon: "cash-outline", label: "Expense control period", route: "Expenses" },
  { icon: "phone-portrait-outline", label: "Linked devices", route: "Devices" },
  { icon: "log-out-outline", label: "Log out", route: "Logout" },
  { icon: "close-outline", label: "Delete account", route: "DeleteAccount" },
];

const NAV_ITEMS = [
  { name: "home-outline", type: "ion", key: "home", route: "Home" },
  { name: "bar-chart-outline", type: "ion", key: "reports", route: "Reports" },
  { name: "swap-horizontal", type: "material", key: "transactions", route: "Transactions" },
  { name: "layers-outline", type: "material", key: "savings", route: "Savings" },
  { name: "person-outline", type: "ion", key: "profile", route: "Profile" },
];

export default function SettingsScreen({ navigation }) {
  const [selectedTheme, setSelectedTheme] = useState("light");
  const [activeTab, setActiveTab] = useState("profile");

  const { width, height } = useWindowDimensions();

  const isLandscape = width > height;
  const baseDimension = Math.min(width, height);
  const scale = Math.max(0.85, Math.min(baseDimension / 390, 1.15));

  const s = (val) => Math.round(val * scale);

  const NAV_HEIGHT = isLandscape ? 36 : 40;

  const handleOptionPress = (route) => {
    if (navigation && route) {
      navigation.navigate(route);
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D1B2A" />

      <View
        style={[
          styles.header,
          {
            paddingTop: isLandscape ? 4 : 10,
            paddingBottom: isLandscape ? 8 : 16,
          },
        ]}
      >
        <View style={styles.topRow}>
          <TouchableOpacity
            onPress={() => (navigation?.goBack ? navigation.goBack() : null)}
            activeOpacity={0.7}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={s(24)} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { fontSize: s(22) }]}>Settings</Text>

          <TouchableOpacity
            onPress={() => navigation?.navigate("Notifications")}
            activeOpacity={0.7}
            style={styles.notificationBadge}
          >
            <Ionicons name="notifications-outline" size={s(18)} color="#0D1B2A" />
          </TouchableOpacity>
        </View>

        <View style={[styles.themesContainer, { marginTop: isLandscape ? 4 : 10 }]}>
          <TouchableOpacity
            style={styles.themeOption}
            onPress={() => setSelectedTheme("light")}
            activeOpacity={0.8}
          >
            <Ionicons name="sunny-outline" size={s(32)} color="#FFFFFF" />
            <View
              style={[
                styles.radioButton,
                { width: s(14), height: s(14), borderRadius: s(7) },
                selectedTheme === "light" && styles.radioActive,
              ]}
            />
            <Text style={[styles.themeLabel, { fontSize: s(13) }]}>Light theme</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.themeOption}
            onPress={() => setSelectedTheme("dark")}
            activeOpacity={0.8}
          >
            <Ionicons name="moon-outline" size={s(32)} color="#FFFFFF" />
            <View
              style={[
                styles.radioButton,
                { width: s(14), height: s(14), borderRadius: s(7) },
                selectedTheme === "dark" && styles.radioActive,
              ]}
            />
            <Text style={[styles.themeLabel, { fontSize: s(13) }]}>Dark theme</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contentCard}>
        {isLandscape ? (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollOptionsContainer}
            showsVerticalScrollIndicator={false}
          >
            {OPTIONS.map((item) => (
              <TouchableOpacity
                style={styles.optionRowLandscape}
                key={item.label}
                activeOpacity={0.7}
                onPress={() => handleOptionPress(item.route)}
              >
                <View style={styles.iconCircleLandscape}>
                  <Ionicons name={item.icon} size={25} color="#FFFFFF" />
                </View>
                <Text style={styles.optionTextLandscape}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={24} color="#0D1B2A" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (

          <View style={styles.optionsListVertical}>
            {OPTIONS.map((item) => (
              <TouchableOpacity
                style={styles.optionRowVertical}
                key={item.label}
                activeOpacity={0.7}
                onPress={() => handleOptionPress(item.route)}
              >
                <View
                  style={[
                    styles.iconCircleVertical,
                    { width: s(48), height: s(48), borderRadius: s(24) },
                  ]}
                >
                  <Ionicons name={item.icon} size={s(25)} color="#FFFFFF" />
                </View>
                <Text style={[styles.optionTextVertical, { fontSize: s(17.5) }]}>
                  {item.label}
                </Text>
                <Ionicons name="chevron-forward" size={s(24)} color="#0D1B2A" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <SafeAreaView edges={["bottom"]} style={styles.bottomNavSafeArea}>
          <View style={[styles.bottomTabBar, { height: NAV_HEIGHT }]}>
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
                  {item.type === "ion" ? (
                    <Ionicons
                      name={item.name}
                      size={isLandscape ? 17 : 20}
                      color={isSelected ? "#FFFFFF" : "rgba(255, 255, 255, 0.65)"}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name={item.name}
                      size={isLandscape ? 19 : 22}
                      color={isSelected ? "#FFFFFF" : "rgba(255, 255, 255, 0.65)"}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </SafeAreaView>
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
    paddingHorizontal: 22,
    backgroundColor: "#0D1B2A",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontWeight: "700",
    textAlign: "center",
  },
  notificationBadge: {
    backgroundColor: "#FFFFFF",
    width: 32,
    height: 32,
    borderRadius: 16,
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
    backgroundColor: "#C4C4C4",
    marginVertical: 4,
  },
  radioActive: {
    backgroundColor: "#23BDEE",
  },
  themeLabel: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  contentCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    justifyContent: "space-between",
    overflow: "hidden",
  },

  optionsListVertical: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 22,
    maxWidth: 680,
    width: "100%",
    alignSelf: "center",
  },
  optionRowVertical: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  iconCircleVertical: {
    backgroundColor: "#23BDEE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 18,
  },
  optionTextVertical: {
    flex: 1,
    fontWeight: "600",
    color: "#263238",
  },

  scrollOptionsContainer: {
    paddingHorizontal: 26,
    paddingVertical: 14,
    maxWidth: 680,
    width: "100%",
    alignSelf: "center",
  },
  optionRowLandscape: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 12,
  },
  iconCircleLandscape: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#23BDEE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 18,
  },
  optionTextLandscape: {
    flex: 1,
    fontSize: 17,
    fontWeight: "600",
    color: "#263238",
  },

  bottomNavSafeArea: {
    backgroundColor: "#23BDEE",
    borderTopLeftRadius: 32,
  },
  bottomTabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#23BDEE",
    borderTopLeftRadius: 32,
  },
  tabItem: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});