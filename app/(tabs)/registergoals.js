import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { auth, db } from "../../firebaseConfig.js";

export default function SavingsGoal() {
  const { width, height } = useWindowDimensions();

  const isSmallScreen = width < 360;
  const isMediumScreen = width >= 360 && width < 600;
  const isTablet = width >= 600;
  const isLargeScreen = width >= 900;

  const scale = isSmallScreen
    ? 0.85
    : isMediumScreen
    ? 1
    : isLargeScreen
    ? 1.25
    : isTablet
    ? 1.15
    : 1;

  const horizontalPadding = isSmallScreen
    ? 18
    : isMediumScreen
    ? 25
    : isLargeScreen
    ? 60
    : isTablet
    ? 45
    : 25;

  const s = (value) => Math.round(value * scale);

  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [frequency, setFrequency] = useState("");
  const [savingAmount, setSavingAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isMainGoal, setIsMainGoal] = useState(false);
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setGoalName("");
    setTargetAmount("");
    setFrequency("");
    setSavingAmount("");
    setStartDate("");
    setEndDate("");
    setIsMainGoal(false);
  };

  const cancelGoal = () => {
    resetForm();
    router.replace("/home");
  };

  const parseDate = (value) => {
    if (!value || !value.trim()) {
      return null;
    }

    const text = value.trim();

    const namedDate = text.match(
      /^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/
    );

    if (namedDate) {
      const months = {
        january: 0,
        february: 1,
        march: 2,
        april: 3,
        may: 4,
        june: 5,
        july: 6,
        august: 7,
        september: 8,
        october: 9,
        november: 10,
        december: 11,
      };

      const monthName = namedDate[1].toLowerCase();
      const month = months[monthName];
      const day = Number(namedDate[2]);
      const year = Number(namedDate[3]);

      if (month === undefined) {
        return null;
      }

      const date = new Date(year, month, day);

      if (
        date.getFullYear() !== year ||
        date.getMonth() !== month ||
        date.getDate() !== day
      ) {
        return null;
      }

      return date;
    }

    const numericDate = text.match(
      /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/
    );

    if (numericDate) {
      const month = Number(numericDate[1]) - 1;
      const day = Number(numericDate[2]);

      let year = Number(numericDate[3]);

      if (year < 100) {
        year += 2000;
      }

      const date = new Date(year, month, day);

      if (
        date.getFullYear() !== year ||
        date.getMonth() !== month ||
        date.getDate() !== day
      ) {
        return null;
      }

      return date;
    }

    return null;
  };

  const calculateSavingValues = (
    target,
    selectedFrequency,
    start,
    end
  ) => {
    const cleanTarget = String(target)
      .replace("$", "")
      .replace(",", ".")
      .trim();

    const amount = Number(cleanTarget);

    if (!amount || amount <= 0) {
      return null;
    }

    if (!selectedFrequency) {
      return null;
    }

    const startDateValue = parseDate(start);
    const endDateValue = parseDate(end);

    if (!startDateValue || !endDateValue) {
      return null;
    }

    if (endDateValue <= startDateValue) {
      return null;
    }

    if (selectedFrequency === "daily") {
      const difference =
        endDateValue.getTime() -
        startDateValue.getTime();

      const days = Math.round(
        difference / (1000 * 60 * 60 * 24)
      );

      if (days <= 0) {
        return null;
      }

      return {
        amount: amount / days,
        periods: days,
        unit: "day",
      };
    }

    if (selectedFrequency === "monthly") {
      const months =
        (endDateValue.getFullYear() -
          startDateValue.getFullYear()) *
          12 +
        (endDateValue.getMonth() -
          startDateValue.getMonth());

      if (months <= 0) {
        return null;
      }

      return {
        amount: amount / months,
        periods: months,
        unit: "month",
      };
    }

    return null;
  };

  useEffect(() => {
    const result = calculateSavingValues(
      targetAmount,
      frequency,
      startDate,
      endDate
    );

    if (result) {
      setSavingAmount(result.amount.toFixed(2));
    } else {
      setSavingAmount("");
    }
  }, [
    targetAmount,
    frequency,
    startDate,
    endDate,
  ]);

  const handleCalculate = () => {
    const result = calculateSavingValues(
      targetAmount,
      frequency,
      startDate,
      endDate
    );

    if (!result) {
      Alert.alert(
        "Error",
        "Please enter a valid amount, frequency and dates."
      );
      return;
    }

    setSavingAmount(result.amount.toFixed(2));

    Alert.alert(
      "Saving calculation",
      `You need to save $${result.amount.toFixed(
        2
      )} per ${result.unit} for ${
        result.periods
      } ${result.unit}${
        result.periods !== 1 ? "s" : ""
      }.`
    );
  };

  const saveGoal = async () => {
    if (!goalName.trim()) {
      Alert.alert(
        "Error",
        "Please enter the goal name."
      );
      return;
    }

    if (!targetAmount.trim()) {
      Alert.alert(
        "Error",
        "Please enter the target amount."
      );
      return;
    }

    if (!frequency) {
      Alert.alert(
        "Error",
        "Please select the saving frequency."
      );
      return;
    }

    if (!startDate.trim()) {
      Alert.alert(
        "Error",
        "Please enter the start date."
      );
      return;
    }

    if (!endDate.trim()) {
      Alert.alert(
        "Error",
        "Please enter the end date."
      );
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      Alert.alert(
        "Error",
        "There is no authenticated user."
      );
      return;
    }

    const amountNumber = Number(
      targetAmount
        .replace("$", "")
        .replace(",", ".")
        .trim()
    );

    if (
      isNaN(amountNumber) ||
      amountNumber <= 0
    ) {
      Alert.alert(
        "Error",
        "The target amount is not valid."
      );
      return;
    }

    const result = calculateSavingValues(
      targetAmount,
      frequency,
      startDate,
      endDate
    );

    if (!result) {
      Alert.alert(
        "Error",
        "Please check the frequency and dates."
      );
      return;
    }

    try {
      setSaving(true);

      if (isMainGoal) {
        const mainGoalsQuery = query(
          collection(db, "Metas de Ahorro"),
          where("uid", "==", user.uid),
          where("isMainGoal", "==", true)
        );

        const mainGoalsSnapshot =
          await getDocs(mainGoalsQuery);

        if (mainGoalsSnapshot.size >= 3) {
          Alert.alert(
            "Maximum reached",
            "You can have a maximum of 3 main goals."
          );
          setSaving(false);
          return;
        }
      }

      await addDoc(
        collection(db, "Metas de Ahorro"),
        {
          uid: user.uid,
          goalName: goalName.trim(),
          targetAmount: amountNumber,
          savingFrequency: frequency,
          savingAmount: result.amount,
          calculatedSavingAmount: result.amount,
          periods: result.periods,
          startDate: startDate.trim(),
          endDate: endDate.trim(),
          currentSavings: 0,
          isMainGoal: isMainGoal,
          status: "active",
          createdAt: serverTimestamp(),
        }
      );

      resetForm();

      Alert.alert(
        "Goal Registered",
        "Your savings goal was saved successfully."
      );
    } catch (error) {
      console.log(
        "ERROR SAVING GOAL:",
        error
      );

      Alert.alert(
        "Error",
        "The savings goal could not be saved. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          {
            paddingTop: s(55),
            paddingBottom: s(30),
            paddingHorizontal: horizontalPadding,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.backButton,
            {
              width: s(35),
            },
          ]}
          onPress={() => router.back()}
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
              fontSize: s(28),
              marginLeft: s(25),
            },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
        >
          Register savings goal
        </Text>

        <TouchableOpacity
          style={[
            styles.notificationButton,
            {
              width: s(34),
              height: s(34),
              borderRadius: s(18),
            },
          ]}
        >
          <Ionicons
            name="notifications-outline"
            size={s(25)}
            color="#081023"
          />
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.card,
          {
            borderTopLeftRadius: s(35),
            borderTopRightRadius: s(35),
            paddingHorizontal: horizontalPadding,
            paddingTop: s(25),
          },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: s(30),
          }}
          keyboardShouldPersistTaps="handled"
        >
          <Text
            style={[
              styles.label,
              {
                fontSize: s(14),
                marginBottom: s(10),
              },
            ]}
          >
            Goal name
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                height: s(48),
                borderRadius: s(15),
                paddingHorizontal: s(18),
                marginBottom: s(22),
              },
            ]}
            placeholder="E.g. Buy a new phone"
            value={goalName}
            onChangeText={setGoalName}
            placeholderTextColor="#ACADAD"
          />

          <Text
            style={[
              styles.label,
              {
                fontSize: s(14),
                marginBottom: s(10),
              },
            ]}
          >
            Target amount
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                height: s(48),
                borderRadius: s(15),
                paddingHorizontal: s(18),
                marginBottom: s(22),
              },
            ]}
            placeholder="E.g. $300.00"
            keyboardType="numeric"
            value={targetAmount}
            onChangeText={setTargetAmount}
            placeholderTextColor="#ACADAD"
          />

          <View
            style={[
              styles.mainGoalContainer,
              {
                marginBottom: s(22),
              },
            ]}
          >
            <Text
              style={[
                styles.mainGoalText,
                {
                  fontSize: s(14),
                },
              ]}
            >
              Main goal
            </Text>

            <Switch
              value={isMainGoal}
              onValueChange={setIsMainGoal}
              trackColor={{
                false: "#D9D9D9",
                true: "#25B7D3",
              }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#D9D9D9"
            />
          </View>

          <Text
            style={[
              styles.label,
              {
                fontSize: s(14),
                marginBottom: s(10),
              },
            ]}
          >
            Saving frequency
          </Text>

          <View
            style={[
              styles.typeContainer,
              {
                marginBottom: s(17),
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.typeButton,
                {
                  height: s(42),
                  borderRadius: s(13),
                  marginHorizontal: s(3),
                },
                frequency === "daily" &&
                  styles.typeButtonActive,
              ]}
              onPress={() =>
                setFrequency("daily")
              }
            >
              <Text
                style={[
                  styles.typeText,
                  {
                    fontSize: s(12),
                  },
                  frequency === "daily" &&
                    styles.typeTextActive,
                ]}
              >
                Daily
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                {
                  height: s(42),
                  borderRadius: s(13),
                  marginHorizontal: s(3),
                },
                frequency === "monthly" &&
                  styles.typeButtonActive,
              ]}
              onPress={() =>
                setFrequency("monthly")
              }
            >
              <Text
                style={[
                  styles.typeText,
                  {
                    fontSize: s(12),
                  },
                  frequency === "monthly" &&
                    styles.typeTextActive,
                ]}
              >
                Monthly
              </Text>
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.label,
              {
                fontSize: s(14),
                marginBottom: s(10),
              },
            ]}
          >
            Amount to save
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                height: s(48),
                borderRadius: s(15),
                paddingHorizontal: s(18),
                marginBottom: s(22),
              },
            ]}
            placeholder="Calculated automatically"
            value={savingAmount}
            editable={false}
            selectTextOnFocus={false}
            placeholderTextColor="#ACADAD"
          />

          <Text
            style={[
              styles.roundingInfo,
              {
                fontSize: s(12),
                lineHeight: s(17),
                marginTop: -s(12),
                marginBottom: s(15),
              },
            ]}
          >
            The amount is calculated according to
            your target, frequency and saving dates.
          </Text>

          <TouchableOpacity
            style={[
              styles.calculateButton,
              {
                height: s(40),
                borderRadius: s(18),
                marginBottom: s(17),
              },
            ]}
            onPress={handleCalculate}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  fontSize: s(15),
                },
              ]}
            >
              Calculate saving
            </Text>
          </TouchableOpacity>

          <Text
            style={[
              styles.label,
              {
                fontSize: s(14),
                marginBottom: s(10),
              },
            ]}
          >
            Start date
          </Text>

          <TextInput
            style={[
              styles.date,
              {
                height: s(48),
                borderRadius: s(15),
                paddingHorizontal: s(18),
                marginBottom: s(22),
              },
            ]}
            placeholder="June 23, 2026"
            value={startDate}
            onChangeText={setStartDate}
            placeholderTextColor="#ACADAD"
          />

          <Text
            style={[
              styles.label,
              {
                fontSize: s(14),
                marginBottom: s(10),
              },
            ]}
          >
            End date
          </Text>

          <TextInput
            style={[
              styles.date,
              {
                height: s(48),
                borderRadius: s(15),
                paddingHorizontal: s(18),
                marginBottom: s(22),
              },
            ]}
            placeholder="December 23, 2026"
            value={endDate}
            onChangeText={setEndDate}
            placeholderTextColor="#ACADAD"
          />

          {savingAmount &&
            Number(
              savingAmount.replace(",", ".")
            ) > 0 && (
              <View
                style={[
                  styles.calculationContainer,
                  {
                    borderRadius: s(15),
                    padding: s(15),
                    marginBottom: s(5),
                  },
                ]}
              >
                <Text
                  style={[
                    styles.calculationTitle,
                    {
                      fontSize: s(13),
                    },
                  ]}
                >
                  Recommended saving
                </Text>

                <Text
                  style={[
                    styles.calculationAmount,
                    {
                      fontSize: s(24),
                      marginTop: s(3),
                    },
                  ]}
                >
                  $
                  {Number(
                    savingAmount.replace(
                      ",",
                      "."
                    )
                  ).toFixed(2)}
                </Text>

                <Text
                  style={[
                    styles.calculationText,
                    {
                      fontSize: s(12),
                    },
                  ]}
                >
                  per{" "}
                  {frequency === "daily"
                    ? "day"
                    : "month"}
                </Text>
              </View>
            )}

          <TouchableOpacity
            style={[
              styles.button,
              {
                height: s(48),
                marginTop: s(15),
                borderRadius: s(18),
                opacity: saving ? 0.6 : 1,
              },
            ]}
            onPress={saveGoal}
            disabled={saving}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  fontSize: s(17),
                },
              ]}
            >
              {saving
                ? "Saving..."
                : "Save goal"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              {
                height: s(34),
                marginTop: s(15),
                borderRadius: s(18),
              },
            ]}
            onPress={cancelGoal}
            disabled={saving}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  fontSize: s(17),
                },
              ]}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </ScrollView>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  backButton: {
    alignItems: "flex-start",
    marginLeft: 10,
  },

  title: {
    color: "#FFFFFF",
    fontWeight: "600",
    flex: 1,
  },

  notificationButton: {
    backgroundColor: "#E0F5E7",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  label: {
    color: "#081023",
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#F3F4F5",
    borderWidth: 1,
    borderColor: "#000000",
  },

  date: {
    backgroundColor: "#F3F4F5",
    borderWidth: 1,
    borderColor: "#000000",
  },

  mainGoalContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  mainGoalText: {
    color: "#081023",
    fontWeight: "600",
  },

  roundingInfo: {
    color: "#ACADAD",
  },

  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  typeButton: {
    flex: 1,
    backgroundColor: "#F3F4F5",
    borderWidth: 1,
    borderColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },

  typeButtonActive: {
    backgroundColor: "#25B7D3",
    borderColor: "#25B7D3",
  },

  typeText: {
    color: "#081023",
    fontWeight: "600",
  },

  typeTextActive: {
    color: "#FFFFFF",
  },

  calculateButton: {
    backgroundColor: "#081023",
    justifyContent: "center",
    alignItems: "center",
  },

  calculationContainer: {
    backgroundColor: "#F3F4F5",
  },

  calculationTitle: {
    color: "#081023",
    fontWeight: "600",
  },

  calculationAmount: {
    color: "#25B7D3",
    fontWeight: "700",
  },

  calculationText: {
    color: "#ACADAD",
  },

  button: {
    backgroundColor: "#25B7D3",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});