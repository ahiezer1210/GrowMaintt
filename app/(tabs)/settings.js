import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSettings } from "../../context/Appsettings";

const OPTIONS = [
  ["shield-checkmark-outline", "backup", "backup"],
  ["cash-outline", "expensecontrolperiod", "expensecontrolperiod"],
  ["phone-portrait-outline", "linkedDevices", "linkeddevices"],
  ["book-outline", "usermanual", "usermanual"],
  ["log-out-outline", "logout", "logout"],
  ["close-outline", "deleteAccount", "deleteaccount"],
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
  const {
    theme,
    language,
    isDark,
    colors,
    t,
    setTheme,
    setLanguage,
  } = useAppSettings();

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
      style={[
        styles.container,
        {
          backgroundColor: colors.primaryBackground,
        },
      ]}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.header,
          },
        ]}
      >
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
                fontSize: 25 * (small ? 0.85 : tablet ? 1.15 : 1),
                transform: [
                  {
                    translateX: 7 * (small ? 0.85 : tablet ? 1.15 : 1),
                  },
                  {
                    translateY: 1 * (small ? 0.85 : tablet ? 1.15 : 1),
                  },
                ],
              },
            ]}
          >
            {t.settings}
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
            style={[
              styles.themeOption,
              theme === "light" && styles.themeOptionActive,
            ]}
            onPress={() => setTheme("light")}
            activeOpacity={0.8}
          >
            <Ionicons name="sunny-outline" size={38} color="#FFFFFF" />

            <View
              style={[
                styles.radioButton,
                {
                  backgroundColor:
                    theme === "light"
                      ? "#23BDEE"
                      : isDark
                      ? "#5D6673"
                      : "#C4C4C4",
                },
              ]}
            />

            <Text style={styles.themeLabel}>{t.lightTheme}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.themeOption,
              theme === "dark" && styles.themeOptionActive,
            ]}
            onPress={() => setTheme("dark")}
            activeOpacity={0.8}
          >
            <Ionicons name="moon-outline" size={38} color="#FFFFFF" />

            <View
              style={[
                styles.radioButton,
                {
                  backgroundColor:
                    theme === "dark"
                      ? "#23BDEE"
                      : isDark
                      ? "#5D6673"
                      : "#C4C4C4",
                },
              ]}
            />

            <Text style={styles.themeLabel}>{t.darkTheme}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.languageContainer}>
          <TouchableOpacity
            style={[
              styles.languageButton,
              language === "en" && styles.languageButtonActive,
            ]}
            onPress={() => setLanguage("en")}
            activeOpacity={0.8}
          >
            <Ionicons
              name="language-outline"
              size={19}
              color="#FFFFFF"
            />

            <Text style={styles.languageText}>{t.english}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.languageButton,
              language === "es" && styles.languageButtonActive,
            ]}
            onPress={() => setLanguage("es")}
            activeOpacity={0.8}
          >
            <Ionicons
              name="language-outline"
              size={19}
              color="#FFFFFF"
            />

            <Text style={styles.languageText}>{t.spanish}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={[
          styles.contentCard,
          {
            backgroundColor: colors.card,
          },
        ]}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {OPTIONS.map(([icon, textKey, route]) => (
            <TouchableOpacity
              style={styles.optionRow}
              key={textKey}
              activeOpacity={0.7}
              onPress={() => handleOptionPress(route)}
            >
              <View
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor: colors.icon,
                  },
                ]}
              >
                <Ionicons name={icon} size={22} color="#FFFFFF" />
              </View>

              <Text
                style={[
                  styles.optionText,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {t[textKey]}
              </Text>

              <Ionicons
                name="chevron-forward"
                size={22}
                color={colors.chevron}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

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
                    size={item.icon === "swap-horizontal" ? 37 : 35}
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
  },

  header: {
    paddingHorizontal: 25,
    paddingTop: 6,
    paddingBottom: 14,
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
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: 10,
    columnGap: 55,
  },

  themeOption: {
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 15,
  },

  themeOptionActive: {
    backgroundColor: "rgba(35, 189, 238, 0.12)",
  },

  radioButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginVertical: 5,
  },

  themeLabel: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },

  languageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
    gap: 10,
  },

  languageButton: {
    width: 105,
    height: 38,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    gap: 6,
  },

  languageButtonActive: {
    backgroundColor: "#23BDEE",
    borderColor: "#23BDEE",
  },

  languageText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  contentCard: {
    flex: 1,
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    overflow: "hidden",
    justifyContent: "space-between",
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: "space-between",
    minHeight: 320,
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },

  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  optionText: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: "600",
  },

  bottomNavContainer: {
    backgroundColor: "transparent",
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