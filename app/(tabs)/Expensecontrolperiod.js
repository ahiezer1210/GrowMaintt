import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
  const [selectedPeriods, setSelectedPeriods] = useState([]);

  const togglePeriod = (id) => {
    setSelectedPeriods((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const selectAll = () => {
    setSelectedPeriods(
      selectedPeriods.length === periods.length
        ? []
        : periods.map((period) => period.id),
    );
  };

  const allSelected = selectedPeriods.length === periods.length;

  const savePeriod = () => {
    console.log("Selected periods:", selectedPeriods);
    router.back();
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={25} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.title}> Expenses control period</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.instruction}>Choose when you want to</Text>

        <Text style={styles.instruction}> review your expenses.</Text>
        <Text style={styles.subtitle}> Select one or more options</Text>

        <View style={styles.options}>
          {periods.map((period) => {
            const selected = selectedPeriods.includes(period.id);
            return (
              <TouchableOpacity
                key={period.id}
                style={[styles.option, selected && styles.optionSelected]}
                onPress={() => togglePeriod(period.id)}
                activeOpacity={0.8}
              >
                <View
                  style={[styles.iconBox, selected && styles.iconBoxSelected]}
                >
                  <Ionicons
                    name={period.icon}
                    size={23}
                    color={selected ? "#FFFFFF" : "#25B7D3"}
                  />
                </View>
                <View style={styles.optionInfo}>
                  <Text
                    style={[
                      styles.optionTitle,
                      selected && styles.optionTitleSelected,
                    ]}
                  >
                    {period.title}
                  </Text>

                  <Text
                    style={[
                      styles.optionDescription,
                      selected && styles.optionDescriptionSelected,
                    ]}
                  >
                    {period.description}
                  </Text>
                </View>
                <View
                  style={[styles.checkbox, selected && styles.checkboxSelected]}
                >
                  {selected && (
                    <Ionicons name="checkmark" size={15} color="#FFFFFF" />
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
          style={styles.saveButton}
          onPress={savePeriod}
          activeOpacity={0.8}
        >
          <Text style={styles.saveText}>Save period</Text>
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
    width: 35,
    height: 35,
    justifyContent: "center",
    marginBottom: 15,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "700",
  },

  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 55,
    borderTopRightRadius: 55,
    paddingHorizontal: 30,
    paddingTop: 50,
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
