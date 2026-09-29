import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
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

const navItems = [
  {
    icon: "home-outline",
    route: "/home",
  },
  {
    icon: "chart-box-outline",
    route: "/historial",
  },
  {
    icon: "swap-horizontal",
    route: "/expensesManagement",
  },
  {
    icon: "layers-outline",
    route: "/currentgoal",
  },
  {
    icon: "account-outline",
    route: "/profile",
  },
];

export default function ManualScreen() {
  const { width, height } = useWindowDimensions();

  const [activeTab, setActiveTab] = useState("home");

  const small = width < 350;
  const tablet = width >= 600;
  const isLandscape = width > height;

  const scale = (value, tabletValue) =>
    tablet
      ? (tabletValue ?? value * 1.15)
      : small
      ? value * 0.85
      : value;

  const abrirNotificaciones = () => {
    router.push({
      pathname: "/notifications",
      params: {
        from: "/usermanual",
      },
    });
  };

  return (
    <View style={styles.screen}>
      <StatusBar
        translucent
        backgroundColor="#071426"
        barStyle="light-content"
      />

      <View style={styles.app}>

        {/* HEADER */}
        <View
          style={[
            styles.header,
            {
              height:
                118 *
                (small
                  ? 0.85
                  : tablet
                  ? 1.15
                  : 1),
              paddingHorizontal: small
                ? 18
                : tablet
                ? 45
                : 25,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.back,
              {
                transform: [
                  {
                    translateY:
                      4 *
                      (small
                        ? 0.85
                        : tablet
                        ? 1.15
                        : 1),
                  },
                ],
              },
            ]}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              }
            }}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={
                35 *
                (small
                  ? 0.85
                  : tablet
                  ? 1.15
                  : 1)
              }
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <Text
            style={[
              styles.headerTitle,
              {
                fontSize:
                  25 *
                  (small
                    ? 0.85
                    : tablet
                    ? 1.15
                    : 1),
                transform: [
                  {
                    translateX:
                      7 *
                      (small
                        ? 0.85
                        : tablet
                        ? 1.15
                        : 1),
                  },
                  {
                    translateY:
                      1 *
                      (small
                        ? 0.85
                        : tablet
                        ? 1.15
                        : 1),
                  },
                ],
              },
            ]}
          >
            User Manual
          </Text>

          <TouchableOpacity
            style={[
              styles.headerBell,
              {
                transform: [
                  {
                    translateY:
                      4 *
                      (small
                        ? 0.85
                        : tablet
                        ? 1.15
                        : 1),
                  },
                ],
              },
            ]}
            onPress={abrirNotificaciones}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="bell-circle-outline"
              size={
                35 *
                (small
                  ? 0.85
                  : tablet
                  ? 1.15
                  : 1)
              }
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {/* MAIN */}
        <View
          style={[
            styles.main,
            {
              borderTopLeftRadius:
                tablet ? 55 : small ? 35 : 45,
              borderTopRightRadius:
                tablet ? 55 : small ? 35 : 45,
            },
          ]}
        >
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[
              styles.content,
              {
                paddingHorizontal: tablet
                  ? 42
                  : small
                  ? 20
                  : 20,

                paddingTop: isLandscape
                  ? 18
                  : tablet
                  ? 35
                  : small
                  ? 20
                  : 24,

                paddingBottom: 100,
              },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={[
                styles.innerContent,
                {
                  maxWidth: tablet ? 1050 : 700,
                },
              ]}
            >

              {/* TITLE */}
              <View style={styles.titleContainer}>
                <Text
                  style={[
                    styles.mainTitle,
                    {
                      fontSize: tablet
                        ? 28
                        : 23 *
                          (small
                            ? 0.85
                            : 1),
                    },
                  ]}
                >
                  What is GrowMait?
                </Text>

                <View style={styles.titleLine} />
              </View>

              {/* INTRO */}
              <View style={styles.introBox}>
                <View style={styles.introIcon}>
                  <MaterialCommunityIcons
                    name="wallet-outline"
                    size={
                      25 *
                      (small
                        ? 0.85
                        : tablet
                        ? 1.15
                        : 1)
                    }
                    color="#FFFFFF"
                  />
                </View>

                <View style={styles.introContent}>
                  <Text
                    style={[
                      styles.introText,
                      {
                        fontSize: tablet
                          ? 16
                          : 13.5 *
                            (small
                              ? 0.85
                              : 1),

                        lineHeight: tablet
                          ? 23
                          : 19 *
                            (small
                              ? 0.85
                              : 1),
                      },
                    ]}
                  >
                    GrowMait is your ally to keep control of your
                    finances, expenses and savings. Everything in
                    one simple, easy and secure place.
                  </Text>
                </View>
              </View>

              {/* EXPLORE */}
              <View style={styles.sectionHeader}>
                <View>
                  <Text
                    style={[
                      styles.sectionHeading,
                      {
                        fontSize: tablet
                          ? 22
                          : 18 *
                            (small
                              ? 0.85
                              : 1),
                      },
                    ]}
                  >
                    Explore GrowMait
                  </Text>

                  <Text
                    style={[
                      styles.sectionSubheading,
                      {
                        fontSize: tablet
                          ? 14
                          : 11.5 *
                            (small
                              ? 0.85
                              : 1),
                      },
                    ]}
                  >
                    Everything you can do in the app
                  </Text>
                </View>
              </View>

              {/* SECTIONS */}
              <View
                style={[
                  styles.sectionsContainer,
                  tablet && styles.sectionsGrid,
                ]}
              >
                {[
                  {
                    number: "01",
                    title: "Home",
                    icon: "home-outline",
                    description:
                      "Know your balance, recent activity and get a quick summary of your finances.",
                  },
                  {
                    number: "02",
                    title: "Add Expense",
                    icon: "plus-circle-outline",
                    description:
                      "Register your daily expenses and classify them by category.",
                  },
                  {
                    number: "03",
                    title: "Reports",
                    icon: "chart-box-outline",
                    description:
                      "Visualize your income, expenses and savings with charts and statistics.",
                  },
                  {
                    number: "04",
                    title: "Savings",
                    icon: "piggy-bank-outline",
                    description:
                      "Create savings goals, contribute regularly and reach your objectives.",
                  },
                  {
                    number: "05",
                    title: "Transactions",
                    icon: "swap-horizontal",
                    description:
                      "Review the history of all your financial movements in detail.",
                  },
                  {
                    number: "06",
                    title: "Settings",
                    icon: "cog-outline",
                    description:
                      "Manage your account preferences and configuration.",
                  },
                ].map((item) => (
                  <View
                    key={item.number}
                    style={[
                      styles.sectionCard,
                      tablet && styles.sectionCardTablet,
                    ]}
                  >
                    <View style={styles.numberContainer}>
                      <Text style={styles.numberText}>
                        {item.number}
                      </Text>
                    </View>

                    <View style={styles.sectionIcon}>
                      <MaterialCommunityIcons
                        name={item.icon}
                        size={
                          25 *
                          (small
                            ? 0.85
                            : tablet
                            ? 1.15
                            : 1)
                        }
                        color="#25B7D3"
                      />
                    </View>

                    <View style={styles.sectionInfo}>
                      <Text
                        style={[
                          styles.sectionTitle,
                          {
                            fontSize: tablet
                              ? 17
                              : 14.5 *
                                (small
                                  ? 0.85
                                  : 1),
                          },
                        ]}
                      >
                        {item.title}
                      </Text>

                      <Text
                        style={[
                          styles.sectionText,
                          {
                            fontSize: tablet
                              ? 14
                              : 11.5 *
                                (small
                                  ? 0.85
                                  : 1),

                            lineHeight: tablet
                              ? 20
                              : 16 *
                                (small
                                  ? 0.85
                                  : 1),
                          },
                        ]}
                      >
                        {item.description}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* TIPS */}
              <View style={styles.tipsHeader}>
                <View style={styles.tipsIcon}>
                  <MaterialCommunityIcons
                    name="lightbulb-on-outline"
                    size={
                      23 *
                      (small
                        ? 0.85
                        : tablet
                        ? 1.15
                        : 1)
                    }
                    color="#FFFFFF"
                  />
                </View>

                <View>
                  <Text
                    style={[
                      styles.tipsTitle,
                      {
                        fontSize: tablet
                          ? 22
                          : 18 *
                            (small
                              ? 0.85
                              : 1),
                      },
                    ]}
                  >
                    Useful Tips
                  </Text>

                  <Text
                    style={[
                      styles.tipsSubtitle,
                      {
                        fontSize: tablet
                          ? 14
                          : 11 *
                            (small
                              ? 0.85
                              : 1),
                      },
                    ]}
                  >
                    Small actions for better financial habits
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.tipsContainer,
                  tablet && styles.tipsGrid,
                ]}
              >
                {/* TIP 1 */}
                <View
                  style={[
                    styles.tipCard,
                    tablet && styles.tipCardTablet,
                  ]}
                >
                  <View style={styles.tipIconContainer}>
                    <MaterialCommunityIcons
                      name="shield-check-outline"
                      size={
                        28 *
                        (small
                          ? 0.85
                          : tablet
                          ? 1.15
                          : 1)
                      }
                      color="#081023"
                    />
                  </View>

                  <View style={styles.tipContent}>
                    <Text
                      style={[
                        styles.tipTitle,
                        {
                          fontSize: tablet
                            ? 16
                            : 13.5 *
                              (small
                                ? 0.85
                                : 1),
                        },
                      ]}
                    >
                      Keep your data safe
                    </Text>

                    <Text
                      style={[
                        styles.tipDescription,
                        {
                          fontSize: tablet
                            ? 13.5
                            : 11 *
                              (small
                                ? 0.85
                                : 1),

                          lineHeight: tablet
                            ? 19
                            : 15 *
                              (small
                                ? 0.85
                                : 1),
                        },
                      ]}
                    >
                      Do not share your password or sign in on
                      shared devices.
                    </Text>
                  </View>
                </View>

                {/* TIP 2 */}
                <View
                  style={[
                    styles.tipCard,
                    tablet && styles.tipCardTablet,
                  ]}
                >
                  <View style={styles.tipIconContainer}>
                    <MaterialCommunityIcons
                      name="bullseye-arrow"
                      size={
                        28 *
                        (small
                          ? 0.85
                          : tablet
                          ? 1.15
                          : 1)
                      }
                      color="#081023"
                    />
                  </View>

                  <View style={styles.tipContent}>
                    <Text
                      style={[
                        styles.tipTitle,
                        {
                          fontSize: tablet
                            ? 16
                            : 13.5 *
                              (small
                                ? 0.85
                                : 1),
                        },
                      ]}
                    >
                      Set realistic goals
                    </Text>

                    <Text
                      style={[
                        styles.tipDescription,
                        {
                          fontSize: tablet
                            ? 13.5
                            : 11 *
                              (small
                                ? 0.85
                                : 1),

                          lineHeight: tablet
                            ? 19
                            : 15 *
                              (small
                                ? 0.85
                                : 1),
                        },
                      ]}
                    >
                      Start with small goals and increase them
                      little by little.
                    </Text>
                  </View>
                </View>
              </View>

            </View>
          </ScrollView>
        </View>

        {/* NAVBAR - IGUAL AL LOGOUT */}
        <View
          style={[
            styles.bottomBar,
            {
              height:
                65 *
                (small
                  ? 0.85
                  : tablet
                  ? 1.15
                  : 1),

              borderTopLeftRadius:
                78 *
                (small
                  ? 0.85
                  : tablet
                  ? 1.15
                  : 1),
            },
          ]}
        >
          {navItems.map((item) => (
            <TouchableOpacity
              key={item.route}
              style={styles.navItem}
              activeOpacity={0.8}
              onPress={() => {
                setActiveTab(item.route);
                router.push(item.route);
              }}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={
                  item.icon === "swap-horizontal"
                    ? 37 *
                      (small
                        ? 0.85
                        : tablet
                        ? 1.15
                        : 1)
                    : 35 *
                      (small
                        ? 0.85
                        : tablet
                        ? 1.15
                        : 1)
                }
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
    backgroundColor: "#FFF",
  },

  app: {
    flex: 1,
    backgroundColor: "#071426",
  },

  /* HEADER */
  header: {
    width: "100%",
    backgroundColor: "#071426",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  back: {
    width: 30,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  headerTitle: {
    color: "#FFF",
    fontWeight: "700",
  },

  headerBell: {
    justifyContent: "center",
  },

  /* MAIN */
  main: {
    flex: 1,
    width: "100%",
    backgroundColor: "#FFF",
    overflow: "hidden",
  },

  scroll: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    alignItems: "center",
  },

  innerContent: {
    width: "100%",
  },

  /* TITLE */
  titleContainer: {
    alignItems: "center",
    marginBottom: 18,
  },

  mainTitle: {
    color: "#081023",
    fontWeight: "900",
    textAlign: "center",
  },

  titleLine: {
    width: 42,
    height: 4,
    borderRadius: 5,
    backgroundColor: "#25B7D3",
    marginTop: 8,
  },

  /* INTRO */
  introBox: {
    width: "100%",
    backgroundColor: "#25B7D3",
    borderRadius: 20,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 26,
  },

  introIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(8,16,35,0.16)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },

  introContent: {
    flex: 1,
  },

  introText: {
    color: "#081023",
    fontWeight: "700",
  },

  /* SECTIONS */
  sectionHeader: {
    width: "100%",
    marginBottom: 13,
  },

  sectionHeading: {
    color: "#081023",
    fontWeight: "900",
  },

  sectionSubheading: {
    color: "#ACADAD",
    marginTop: 3,
    fontWeight: "500",
  },

  sectionsContainer: {
    width: "100%",
  },

  sectionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  sectionCard: {
    width: "100%",
    minHeight: 96,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7EAEA",
    borderRadius: 18,
    marginBottom: 12,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#081023",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.07,
    shadowRadius: 5,
  },

  sectionCardTablet: {
    width: "48.8%",
    minHeight: 125,
  },

  numberContainer: {
    position: "absolute",
    top: 9,
    right: 11,
  },

  numberText: {
    color: "#ACADAD",
    fontSize: 11,
    fontWeight: "800",
  },

  sectionIcon: {
    width: 49,
    height: 49,
    borderRadius: 15,
    backgroundColor: "#EAF9FC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },

  sectionInfo: {
    flex: 1,
    paddingRight: 12,
  },

  sectionTitle: {
    color: "#081023",
    fontWeight: "800",
    marginBottom: 4,
  },

  sectionText: {
    color: "#4E5658",
    fontWeight: "400",
  },

  /* TIPS */
  tipsHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 13,
  },

  tipsIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "#081023",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 11,
  },

  tipsTitle: {
    color: "#081023",
    fontWeight: "900",
  },

  tipsSubtitle: {
    color: "#ACADAD",
    marginTop: 2,
  },

  tipsContainer: {
    width: "100%",
  },

  tipsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  tipCard: {
    width: "100%",
    backgroundColor: "#F7F9F9",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E8EBEB",
  },

  tipCardTablet: {
    width: "48.8%",
  },

  tipIconContainer: {
    width: 49,
    height: 49,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  tipContent: {
    flex: 1,
  },

  tipTitle: {
    color: "#081023",
    fontWeight: "800",
    marginBottom: 3,
  },

  tipDescription: {
    color: "#25B7D3",
    fontWeight: "600",
  },

  /* NAVBAR - IGUAL AL LOGOUT */
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#25B5D1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    overflow: "hidden",
  },

  navItem: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});