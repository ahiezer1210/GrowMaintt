import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
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

  const { width, height } = useWindowDimensions();

  const isSmallScreen = width < 360;
  const isMediumScreen = width >= 360 && width < 600;
  const isTablet = width >= 600;
  const isLargeScreen = width >= 900;

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

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          {
            paddingTop: s(65),
            paddingHorizontal: horizontalPadding,
            paddingBottom: s(35),
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={[
            styles.backButton,
            {
              width: s(35),
              height: s(35),
              marginBottom: s(15),
            },
          ]}
        >
          <Ionicons
            name="arrow-back"
            size={s(25)}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.title,
            {
              fontSize: s(25),
            },
          ]}
        >
          Expenses control period
        </Text>
      </View>

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
        <Text style={styles.instruction}>Choose when you want to</Text>
        <Text style={styles.instruction}> review your expenses.</Text>
        <Text style={styles.subtitle}> Select one or more options</Text>

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
                  <Ionicons
                    name={period.icon}
                    size={s(23)}
                    color={selected ? "#FFFFFF" : "#25B7D3"}
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
                      selected && styles.optionTitleSelected,
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
                      selected && styles.optionDescriptionSelected,
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
                    selected && styles.checkboxSelected,
                  ]}
                >
                  {selected && (
                    <Ionicons
                      name="checkmark"
                      size={s(15)}
                      color="#FFFFFF"
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            style={[styles.option, allSelected && styles.optionSelected]}
            onPress={selectAll}
            activeOpacity={0.8}
          >
            <View
              style={[styles.iconBox, allSelected && styles.iconBoxSelected]}
            >
              <Ionicons
                name="layers-outline"
                size={23}
                color={allSelected ? "#FFFFFF" : "#25B7D3"}
              />
            </View>

            <View style={styles.optionInfo}>
              <Text
                style={[
                  styles.optionTitle,
                  allSelected && styles.optionTitleSelected,
                ]}
              >
                All three
              </Text>
              <Text
                style={[
                  styles.optionDescription,
                  allSelected && styles.optionDescriptionSelected,
                ]}
              >
                Daily, weekly and monthly
              </Text>
            </View>

            <View
              style={[styles.checkbox, allSelected && styles.checkboxSelected]}
            >
              {allSelected && (
                <Ionicons name="checkmark" size={15} color="#FFFFFF" />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#081023",
  },
  header: {
    paddingTop: 65,
    paddingHorizontal: 30,
    paddingBottom: 35,
  },
  backButton: {
    justifyContent: "center",
  },
  title: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
});