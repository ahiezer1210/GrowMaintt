import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useAppSettings } from "../../context/Appsettings";
import { usePeriods } from "../../context/PeriodContext.js";

export default function Expensescreen() {
  const { width } = useWindowDimensions();
  const { t, colors } = useAppSettings();
  const { from } = useLocalSearchParams();

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

  // Escala del header
  const hs = isSmallScreen ? 0.85 : isTablet ? 1.15 : 1;

  const horizontalPadding = isSmallScreen
    ? 18
    : isMediumScreen
    ? 25
    : isTablet
    ? 45
    : 60;

  const s = (value) => Math.round(value * scale);

  const { selectedPeriods, setSelectedPeriods } = usePeriods();
  const [tempSelected, setTempSelected] = useState(selectedPeriods);

  useEffect(() => {
    setTempSelected(selectedPeriods);
  }, [selectedPeriods]);

  const isDarkTheme =
    colors.background?.toLowerCase() === "#081023" ||
    colors.background?.toLowerCase() === "#071426" ||
    colors.primaryBackground?.toLowerCase() === "#081023" ||
    colors.primaryBackground?.toLowerCase() === "#071426";

  const periods = [
    {
      id: "daily",
      title: t.daily,
      description: t.everyDay,
      icon: "today-outline",
    },
    {
      id: "weekly",
      title: t.weekly,
      description: t.onceAWeek,
      icon: "calendar-outline",
    },
    {
      id: "monthly",
      title: t.monthly,
      description: t.onceAMonth,
      icon: "calendar-number-outline",
    },
  ];

  const togglePeriod = (id) => {
    setTempSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const selectAll = () => {
    setTempSelected(
      tempSelected.length === periods.length
        ? []
        : periods.map((period) => period.id)
    );
  };

  const allSelected = tempSelected.length === periods.length;

  const goBackToSettings = () => {
    if (from) {
      const destination = Array.isArray(from) ? from[0] : from;
      router.replace(destination);
    } else {
      router.replace("/settings");
    }
  };

  const savePeriod = () => {
    setSelectedPeriods(tempSelected);
    goBackToSettings();
  };

  const goHome = () => {
    router.replace("/home");
  };

  const navItems = [
    { icon: "home-outline", route: "/home" },
    { icon: "chart-box-outline", route: "/historial" },
    { icon: "swap-horizontal", route: "/expensesManagement" },
    { icon: "layers-outline", route: "/currentgoal" },
    { icon: "account-outline", route: "/profile" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.header }]}>
      {/* HEADER */}
      <View
        style={[
          styles.header,
          {
            height: 118 * hs,
            paddingHorizontal: isSmallScreen ? 18 : isTablet ? 45 : 25,
            backgroundColor: colors.header,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.back,
            { transform: [{ translateY: 4 * hs }] },
          ]}
          onPress={goBackToSettings}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={35 * hs}
            color={colors.white}
          />
        </TouchableOpacity>

        <Text
          pointerEvents="none"
          style={[
            styles.headerTitle,
            {
              fontSize: 25 * hs,
              transform: [{ translateX: 4 * hs }, { translateY: 1 * hs }],
              color: colors.white,
            },
          ]}
        >
          {t.expenseControlTitle}
        </Text>

        <TouchableOpacity
          style={[
            styles.headerBell,
            { transform: [{ translateY: 4 * hs }] },
          ]}
          onPress={() =>
            router.push({
              pathname: "/notifications",
              params: {
                from: "/expensecontrolperiod",
              },
            })
          }
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="bell-circle-outline"
            size={35 * hs}
            color={colors.white}
          />
        </TouchableOpacity>
      </View>

      <View style={[styles.mainWrapper, { backgroundColor: colors.header }]}>
        <View
          style={[
            styles.card,
            {
              borderTopLeftRadius: isTablet ? 55 : isSmallScreen ? 35 : 45,
              borderTopRightRadius: isTablet ? 55 : isSmallScreen ? 35 : 45,
              paddingHorizontal: horizontalPadding,
              paddingTop: s(50),
              backgroundColor: colors.background,
            },
          ]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: s(100),
            }}
          >
            <Text style={[styles.instruction, { color: colors.text }]}>
              {t.chooseWhen}
            </Text>

            <Text style={[styles.instruction, { color: colors.text }]}>
              {t.reviewExpenses}
            </Text>

            <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
              {t.selectOneOrMore}
            </Text>

            <View
              style={[
                styles.options,
                {
                  marginTop: s(30),
                  gap: s(12),
                },
              ]}
            >
              {periods.map((period) => {
                const selected = tempSelected.includes(period.id);

                return (
                  <TouchableOpacity
                    key={period.id}
                    style={[
                      styles.option,
                      {
                        minHeight: s(70),
                        borderRadius: s(20),
                        paddingHorizontal: s(15),
                        backgroundColor: selected
                          ? "#25B7D3"
                          : isDarkTheme
                          ? colors.primaryBackground
                          : "#FFFFFF",
                        borderColor: selected ? "#25B7D3" : colors.border,
                      },
                    ]}
                    onPress={() => togglePeriod(period.id)}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.iconBox,
                        {
                          width: s(45),
                          height: s(45),
                          borderRadius: s(15),
                          backgroundColor: selected
                            ? "rgba(255,255,255,0.2)"
                            : isDarkTheme
                            ? "#172037"
                            : "#E8F9FC",
                        },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={period.icon}
                        size={s(23)}
                        color={selected ? "#FFFFFF" : "#25B7D3"}
                      />
                    </View>

                    <View style={[styles.optionInfo, { marginLeft: s(14) }]}>
                      <Text
                        style={[
                          styles.optionTitle,
                          {
                            fontSize: s(16),
                            color: selected ? "#FFFFFF" : colors.text,
                          },
                        ]}
                      >
                        {period.title}
                      </Text>

                      <Text
                        style={[
                          styles.optionDescription,
                          {
                            fontSize: s(12),
                            marginTop: s(3),
                            color: selected ? "#FFFFFF" : colors.secondaryText,
                          },
                        ]}
                      >
                        {period.description}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.checkbox,
                        {
                          width: s(23),
                          height: s(23),
                          borderRadius: s(7),
                          borderColor: selected ? "#081023" : colors.border,
                          backgroundColor: selected ? "#081023" : "transparent",
                        },
                      ]}
                    >
                      {selected && (
                        <MaterialCommunityIcons
                          name="check"
                          size={s(15)}
                          color="#FFFFFF"
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity
                style={[
                  styles.option,
                  {
                    minHeight: s(70),
                    borderRadius: s(20),
                    paddingHorizontal: s(15),
                    backgroundColor: allSelected
                      ? "#25B7D3"
                      : isDarkTheme
                      ? colors.primaryBackground
                      : "#FFFFFF",
                    borderColor: allSelected ? "#25B7D3" : colors.border,
                  },
                ]}
                onPress={selectAll}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.iconBox,
                    {
                      width: s(45),
                      height: s(45),
                      borderRadius: s(15),
                      backgroundColor: allSelected
                        ? "rgba(255,255,255,0.2)"
                        : isDarkTheme
                        ? "#172037"
                        : "#E8F9FC",
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="layers-outline"
                    size={s(23)}
                    color={allSelected ? "#FFFFFF" : "#25B7D3"}
                  />
                </View>

                <View style={[styles.optionInfo, { marginLeft: s(14) }]}>
                  <Text
                    style={[
                      styles.optionTitle,
                      {
                        fontSize: s(16),
                        color: allSelected ? "#FFFFFF" : colors.text,
                      },
                    ]}
                  >
                    {t.allThree}
                  </Text>

                  <Text
                    style={[
                      styles.optionDescription,
                      {
                        fontSize: s(12),
                        marginTop: s(3),
                        color: allSelected ? "#FFFFFF" : colors.secondaryText,
                      },
                    ]}
                  >
                    {t.dailyWeeklyMonthly}
                  </Text>
                </View>

                <View
                  style={[
                    styles.checkbox,
                    {
                      width: s(23),
                      height: s(23),
                      borderRadius: s(7),
                      borderColor: allSelected ? "#081023" : colors.border,
                      backgroundColor: allSelected ? "#081023" : "transparent",
                    },
                  ]}
                >
                  {allSelected && (
                    <MaterialCommunityIcons
                      name="check"
                      size={s(15)}
                      color="#FFFFFF"
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.saveButton,
                {
                  width: s(150),
                  height: s(40),
                  borderRadius: s(20),
                  marginTop: s(30),
                },
              ]}
              onPress={savePeriod}
              activeOpacity={0.8}
            >
              <Text style={[styles.saveText, { fontSize: s(15) }]}>
                {t.savePeriod}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      <View
        style={[
          styles.bottomBar,
          {
            height: s(65),
            borderTopLeftRadius: s(78),
            backgroundColor: colors.nav,
          },
        ]}
      >
        {navItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.navItem}
            onPress={() =>
              item.route === "/home" ? goHome() : router.push(item.route)
            }
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={s(item.icon === "swap-horizontal" ? 37 : 35)}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
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
    flex: 1,
    fontWeight: "700",
    textAlign: "center",
  },

  headerBell: {
    justifyContent: "center",
  },

  mainWrapper: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
  },

  card: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
  },

  instruction: {
    color: "#081023",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },

  subtitle: {
    color: "#6B7280",
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
  },

  options: {
    marginTop: 30,
    gap: 12,
  },

  option: {
    minHeight: 70,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#D9DDE5",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: "#E8F9FC",
    justifyContent: "center",
    alignItems: "center",
  },

  optionInfo: {
    flex: 1,
    marginLeft: 14,
  },

  optionTitle: {
    color: "#081023",
    fontSize: 16,
    fontWeight: "700",
  },

  optionDescription: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 3,
  },

  checkbox: {
    width: 23,
    height: 23,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#081023",
    justifyContent: "center",
    alignItems: "center",
  },

  saveButton: {
    width: 150,
    height: 40,
    backgroundColor: "#25B7D3",
    borderRadius: 20,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },

  saveText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 5,
    overflow: "hidden",
  },

  navItem: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});