import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { usePeriods } from "../../context/PeriodContext.js";

const periods = [
  {
    id: "daily",
    title: "Daily",
    description: "Every day",
    icon: "today-outline",
  },
  {
    id: "weekly",
    title: "Weekly",
    description: "Once a week",
    icon: "calendar-outline",
  },
  {
    id: "monthly",
    title: "Monthly",
    description: "Once a month",
    icon: "calendar-number-outline",
  },
];

export default function Expensescreen() {
  const { width } = useWindowDimensions();

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

  const savePeriod = () => {
    setSelectedPeriods(tempSelected);
    router.back();
  };

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

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View
        style={[
          styles.header,
          {
            height: s(118),
            paddingHorizontal: isSmallScreen
              ? s(18)
              : isTablet
                ? s(45)
                : s(25),
          },
        ]}
      >
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={s(35)}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            {
              fontSize: s(25),
              lineHeight: s(29),
            },
          ]}
        >
          Expenses control period
        </Text>

        <TouchableOpacity
          style={styles.headerButton}
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
            size={s(35)}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      {/* MAIN */}
      <View
        style={[
          styles.card,
          {
            borderTopLeftRadius: s(55),
            borderTopRightRadius: s(55),
            paddingHorizontal: horizontalPadding,
            paddingTop: s(50),
          },
        ]}
      >
        <Text style={styles.instruction}>
          Choose when you want to
        </Text>

        <Text style={styles.instruction}>
          review your expenses.
        </Text>

        <Text style={styles.subtitle}>
          Select one or more options
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
                  },
                  selected && styles.optionSelected,
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
                    },
                    selected && styles.iconBoxSelected,
                  ]}
                >
                  <MaterialCommunityIcons
                    name={period.icon}
                    size={s(23)}
                    color={
                      selected
                        ? "#FFFFFF"
                        : "#25B7D3"
                    }
                  />
                </View>

                <View
                  style={[
                    styles.optionInfo,
                    {
                      marginLeft: s(14),
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.optionTitle,
                      {
                        fontSize: s(16),
                      },
                      selected &&
                        styles.optionTitleSelected,
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
                      },
                      selected &&
                        styles.optionDescriptionSelected,
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
                    },
                    selected &&
                      styles.checkboxSelected,
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
              },
              allSelected &&
                styles.optionSelected,
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
                },
                allSelected &&
                  styles.iconBoxSelected,
              ]}
            >
              <MaterialCommunityIcons
                name="layers-outline"
                size={s(23)}
                color={
                  allSelected
                    ? "#FFFFFF"
                    : "#25B7D3"
                }
              />
            </View>

            <View
              style={[
                styles.optionInfo,
                {
                  marginLeft: s(14),
                },
              ]}
            >
              <Text
                style={[
                  styles.optionTitle,
                  {
                    fontSize: s(16),
                  },
                  allSelected &&
                    styles.optionTitleSelected,
                ]}
              >
                All three
              </Text>

              <Text
                style={[
                  styles.optionDescription,
                  {
                    fontSize: s(12),
                    marginTop: s(3),
                  },
                  allSelected &&
                    styles.optionDescriptionSelected,
                ]}
              >
                Daily, weekly and monthly
              </Text>
            </View>

            <View
              style={[
                styles.checkbox,
                {
                  width: s(23),
                  height: s(23),
                  borderRadius: s(7),
                },
                allSelected &&
                  styles.checkboxSelected,
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
          <Text
            style={[
              styles.saveText,
              {
                fontSize: s(15),
              },
            ]}
          >
            Save period
          </Text>
        </TouchableOpacity>
      </View>

      {/* BOTTOM NAVBAR */}
      <View
        style={[
          styles.bottomBar,
          {
            height: s(65),
            borderTopLeftRadius: s(78),
          },
        ]}
      >
        {navItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.navItem}
            onPress={() => router.push(item.route)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={s(
                item.icon === "swap-horizontal"
                  ? 37
                  : 35
              )}
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
    backgroundColor: "#071426",
  },

  /* HEADER */
  header: {
    backgroundColor: "#071426",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerButton: {
    width: 35,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    flex: 1,
    color: "#FFFFFF",
    fontWeight: "700",
    textAlign: "center",
    transform: [{ translateY: 7 }],
  },

  /* MAIN */
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 55,
    borderTopRightRadius: 55,
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

  optionSelected: {
    backgroundColor: "#25B7D3",
    borderColor: "#25B7D3",
  },

  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: "#E8F9FC",
    justifyContent: "center",
    alignItems: "center",
  },

  iconBoxSelected: {
    backgroundColor: "rgba(255,255,255,0.2)",
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

  optionTitleSelected: {
    color: "#FFFFFF",
  },

  optionDescription: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 3,
  },

  optionDescriptionSelected: {
    color: "#FFFFFF",
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

  checkboxSelected: {
    backgroundColor: "#081023",
    borderColor: "#081023",
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

  /* BOTTOM NAVBAR */
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#25B5D1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 5,
  },

  navItem: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});