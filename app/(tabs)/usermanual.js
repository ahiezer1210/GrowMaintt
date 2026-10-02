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

import { useAppSettings } from "../../context/Appsettings";

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
  const { t, colors } = useAppSettings();

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
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.primaryBackground,
        },
      ]}
    >
      <StatusBar
        translucent
        backgroundColor={colors.header}
        barStyle="light-content"
      />

      <View
        style={[
          styles.app,
          {
            backgroundColor: colors.primaryBackground,
          },
        ]}
      >
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
              backgroundColor: colors.header,
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
            onPress={() => router.replace("/settings")}
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
              color={colors.white}
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
                color: colors.white,
              },
            ]}
          >
            {t.usermanual}
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
              color={colors.white}
            />
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.main,
            {
              backgroundColor: colors.background,
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
                      color: colors.text,
                    },
                  ]}
                >
                  {t.whatIsGrowMait}
                </Text>

                <View
                  style={[
                    styles.titleLine,
                    {
                      backgroundColor: "#25B7D3",
                    },
                  ]}
                />
              </View>

              <View
                style={[
                  styles.introBox,
                  {
                    backgroundColor: "#25B7D3",
                  },
                ]}
              >
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

                        color: "#081023",
                      },
                    ]}
                  >
                    {t.growMaitDescription}
                  </Text>
                </View>
              </View>

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
                        color: colors.text,
                      },
                    ]}
                  >
                    {t.exploreGrowMait}
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
                        color: colors.secondaryText,
                      },
                    ]}
                  >
                    {t.everythingYouCanDo}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.sectionsContainer,
                  tablet && styles.sectionsGrid,
                ]}
              >
                {[
                  {
                    number: "01",
                    title: t.homeSection,
                    icon: "home-outline",
                    description: t.homeSectionDescription,
                  },
                  {
                    number: "02",
                    title: t.addExpenseSection,
                    icon: "plus-circle-outline",
                    description: t.addExpenseSectionDescription,
                  },
                  {
                    number: "03",
                    title: t.reportsSection,
                    icon: "chart-box-outline",
                    description: t.reportsSectionDescription,
                  },
                  {
                    number: "04",
                    title: t.savingsSection,
                    icon: "piggy-bank-outline",
                    description: t.savingsSectionDescription,
                  },
                  {
                    number: "05",
                    title: t.transactionsSection,
                    icon: "swap-horizontal",
                    description: t.transactionsSectionDescription,
                  },
                  {
                    number: "06",
                    title: t.settingsSection,
                    icon: "cog-outline",
                    description: t.settingsSectionDescription,
                  },
                ].map((item) => (
                  <View
                    key={item.number}
                    style={[
                      styles.sectionCard,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                        shadowColor: colors.text,
                      },
                      tablet && styles.sectionCardTablet,
                    ]}
                  >
                    <View style={styles.numberContainer}>
                      <Text
                        style={[
                          styles.numberText,
                          {
                            color: colors.secondaryText,
                          },
                        ]}
                      >
                        {item.number}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.sectionIcon,
                        {
                          backgroundColor:
                            colors.background === "#FFFFFF"
                              ? "#EAF9FC"
                              : "#12283C",
                        },
                      ]}
                    >
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
                            color: colors.text,
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

                            color: colors.secondaryText,
                          },
                        ]}
                      >
                        {item.description}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.tipsHeader}>
                <View
                  style={[
                    styles.tipsIcon,
                    {
                      backgroundColor: colors.text,
                    },
                  ]}
                >
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
                    color={colors.background}
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
                        color: colors.text,
                      },
                    ]}
                  >
                    {t.usefulTips}
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
                        color: colors.secondaryText,
                      },
                    ]}
                  >
                    {t.smallActionsBetterHabits}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.tipsContainer,
                  tablet && styles.tipsGrid,
                ]}
              >
                <View
                  style={[
                    styles.tipCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                    tablet && styles.tipCardTablet,
                  ]}
                >
                  <View
                    style={[
                      styles.tipIconContainer,
                      {
                        backgroundColor: colors.background,
                      },
                    ]}
                  >
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
                      color={colors.text}
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
                          color: colors.text,
                        },
                      ]}
                    >
                      {t.keepDataSafe}
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

                          color: "#25B7D3",
                        },
                      ]}
                    >
                      {t.keepDataSafeDescription}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.tipCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                    tablet && styles.tipCardTablet,
                  ]}
                >
                  <View
                    style={[
                      styles.tipIconContainer,
                      {
                        backgroundColor: colors.background,
                      },
                    ]}
                  >
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
                      color={colors.text}
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
                          color: colors.text,
                        },
                      ]}
                    >
                      {t.setRealisticGoals}
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

                          color: "#25B7D3",
                        },
                      ]}
                    >
                      {t.setRealisticGoalsDescription}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

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

              backgroundColor: colors.nav,
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
                color={colors.white}
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
  },

  app: {
    flex: 1,
  },

  header: {
    width: "100%",
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
    fontWeight: "700",
  },

  headerBell: {
    justifyContent: "center",
  },

  main: {
    flex: 1,
    width: "100%",
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

  titleContainer: {
    alignItems: "center",
    marginBottom: 18,
  },

  mainTitle: {
    fontWeight: "900",
    textAlign: "center",
  },

  titleLine: {
    width: 42,
    height: 4,
    borderRadius: 5,
    marginTop: 8,
  },

  introBox: {
    width: "100%",
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
    fontWeight: "700",
  },

  sectionHeader: {
    width: "100%",
    marginBottom: 13,
  },

  sectionHeading: {
    fontWeight: "900",
  },

  sectionSubheading: {
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
    borderWidth: 1,
    borderRadius: 18,
    marginBottom: 12,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
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
    fontSize: 11,
    fontWeight: "800",
  },

  sectionIcon: {
    width: 49,
    height: 49,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },

  sectionInfo: {
    flex: 1,
    paddingRight: 12,
  },

  sectionTitle: {
    fontWeight: "800",
    marginBottom: 4,
  },

  sectionText: {
    fontWeight: "400",
  },

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
    justifyContent: "center",
    alignItems: "center",
    marginRight: 11,
  },

  tipsTitle: {
    fontWeight: "900",
  },

  tipsSubtitle: {
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
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
  },

  tipCardTablet: {
    width: "48.8%",
  },

  tipIconContainer: {
    width: 49,
    height: 49,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  tipContent: {
    flex: 1,
  },

  tipTitle: {
    fontWeight: "800",
    marginBottom: 3,
  },

  tipDescription: {
    fontWeight: "600",
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
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