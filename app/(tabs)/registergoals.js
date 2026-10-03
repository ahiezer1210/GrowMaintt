import { MaterialCommunityIcons } from "@expo/vector-icons";
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
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSettings } from "../../context/Appsettings";
import { auth, db } from "../../firebaseConfig.js";

export default function SavingsGoal() {
  const { width } = useWindowDimensions();
  const { t, colors } = useAppSettings();

  const isDarkTheme =
    colors.background?.toLowerCase() === "#081023" ||
    colors.background?.toLowerCase() === "#071426" ||
    colors.primaryBackground?.toLowerCase() === "#081023" ||
    colors.primaryBackground?.toLowerCase() === "#071426";

  const isSpanish = t.daily === "Diario";

  const placeholderGoalName = isSpanish
    ? "Ej. Comprar un teléfono nuevo"
    : "E.g. Buy a new phone";

  const placeholderTargetAmount = isSpanish ? "Ej. $300.00" : "E.g. $300.00";

  const placeholderCalculated = isSpanish
    ? "Calculado automáticamente"
    : "Calculated automatically";

  const placeholderStartDate = isSpanish
    ? "23 de junio de 2026"
    : "June 23, 2026";

  const placeholderEndDate = isSpanish
    ? "23 de diciembre de 2026"
    : "December 23, 2026";

  const isSmallScreen = width < 350;
  const isMediumScreen = width >= 350 && width < 600;
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

  // Escala del header (igual que en logout / notifications)
  const hs = isSmallScreen ? 0.85 : isTablet ? 1.15 : 1;

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

  const headerHeight = 118 * hs;
  const bottomHeight = 65 * hs;

  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [frequency, setFrequency] = useState("");
  const [savingAmount, setSavingAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isMainGoal, setIsMainGoal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Vuelve al Home que ya existe en la pila (no apila otro Home)
  const goHome = () => {
    router.replace("/home");
  };

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
    goHome();
  };

  const abrirNotificaciones = () => {
    router.push({
      pathname: "/notifications",
      params: {
        from: "/registergoals",
      },
    });
  };

  const parseDate = (value) => {
    if (!value || !value.trim()) {
      return null;
    }

    const text = value.trim();

    const namedDate = text.match(
      /^([A-Za-zÁÉÍÓÚáéíóúÑñ]+)\s+(\d{1,2}),?\s*(\d{4})$/
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
        enero: 0,
        febrero: 1,
        marzo: 2,
        abril: 3,
        mayo: 4,
        junio: 5,
        julio: 6,
        agosto: 7,
        septiembre: 8,
        octubre: 9,
        noviembre: 10,
        diciembre: 11,
      };

      const monthName = namedDate[1]
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

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

    const numericDate = text.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);

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

  const calculateSavingValues = (target, selectedFrequency, start, end) => {
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
      const difference = endDateValue.getTime() - startDateValue.getTime();

      const days = Math.round(difference / (1000 * 60 * 60 * 24));

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
        (endDateValue.getFullYear() - startDateValue.getFullYear()) * 12 +
        (endDateValue.getMonth() - startDateValue.getMonth());

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
  }, [targetAmount, frequency, startDate, endDate]);

  const handleCalculate = () => {
    const result = calculateSavingValues(
      targetAmount,
      frequency,
      startDate,
      endDate
    );

    if (!result) {
      Alert.alert(t.error, t.validAmountFrequencyDates);
      return;
    }

    setSavingAmount(result.amount.toFixed(2));

    const unitText = result.unit === "day" ? t.perDay : t.perMonth;

    const periodText =
      result.unit === "day"
        ? result.periods === 1
          ? t.daily.toLowerCase()
          : isSpanish
          ? "días"
          : "days"
        : result.periods === 1
        ? t.monthly.toLowerCase()
        : isSpanish
        ? "meses"
        : "months";

    Alert.alert(
      t.savingCalculation,
      `${t.needToSave} $${result.amount.toFixed(2)} ${unitText} ${
        t.forPeriods
      } ${result.periods} ${periodText}.`
    );
  };

  const saveGoal = async () => {
    if (!goalName.trim()) {
      Alert.alert(t.error, t.enterGoalName);
      return;
    }

    if (!targetAmount.trim()) {
      Alert.alert(t.error, t.enterTargetAmount);
      return;
    }

    if (!frequency) {
      Alert.alert(t.error, t.selectSavingFrequency);
      return;
    }

    if (!startDate.trim()) {
      Alert.alert(t.error, t.enterStartDate);
      return;
    }

    if (!endDate.trim()) {
      Alert.alert(t.error, t.enterEndDate);
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      Alert.alert(t.error, t.noAuthenticatedUser);
      return;
    }

    const amountNumber = Number(
      targetAmount.replace("$", "").replace(",", ".").trim()
    );

    if (isNaN(amountNumber) || amountNumber <= 0) {
      Alert.alert(t.error, t.invalidTargetAmount);
      return;
    }

    const result = calculateSavingValues(
      targetAmount,
      frequency,
      startDate,
      endDate
    );

    if (!result) {
      Alert.alert(t.error, t.checkFrequencyDates);
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

        const mainGoalsSnapshot = await getDocs(mainGoalsQuery);

        if (mainGoalsSnapshot.size >= 3) {
          Alert.alert(t.maximumReached, t.maximumMainGoals);

          setSaving(false);
          return;
        }
      }

      await addDoc(collection(db, "Metas de Ahorro"), {
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
      });

      resetForm();

      Alert.alert(t.goalRegistered, t.goalSavedSuccessfully);
    } catch (error) {
      console.log("ERROR SAVING GOAL:", error);

      Alert.alert(t.error, t.goalSaveError);
    } finally {
      setSaving(false);
    }
  };

  const navItems = [
    { icon: "home-outline", route: "/home" },
    { icon: "chart-box-outline", route: "/historial" },
    { icon: "swap-horizontal", route: "/expensesManagement" },
    { icon: "layers-outline", route: "/currentgoal" },
    { icon: "account-outline", route: "/profile" },
  ];

  const inputBackground = isDarkTheme ? colors.primaryBackground : "#F3F4F5";

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.primaryBackground }]}
    >
      <StatusBar
        translucent
        backgroundColor={colors.header}
        barStyle="light-content"
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={[
            styles.header,
            {
              height: headerHeight,
              paddingHorizontal: isSmallScreen ? 18 : isTablet ? 45 : 25,
              backgroundColor: colors.header,
            },
          ]}
        >
          {/* Título primero y con pointerEvents="none": no tapa los botones */}
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
            {t.createSavingsGoals}
          </Text>

          <TouchableOpacity
            style={[
              styles.backButton,
              {
                zIndex: 10,
                elevation: 10,
                transform: [{ translateY: 4 * hs }],
              },
            ]}
            onPress={goHome}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={35 * hs}
              color={colors.white}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.headerBell,
              {
                zIndex: 10,
                elevation: 10,
                transform: [{ translateY: 4 * hs }],
              },
            ]}
            onPress={abrirNotificaciones}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="bell-circle-outline"
              size={35 * hs}
              color={colors.white}
            />
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.background,
              borderTopLeftRadius: isTablet ? 55 : isSmallScreen ? 35 : 45,
              borderTopRightRadius: isTablet ? 55 : isSmallScreen ? 35 : 45,
              paddingHorizontal: horizontalPadding,
              paddingTop: 25 * scale,
            },
          ]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 100 * scale,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <Text
              style={[
                styles.label,
                {
                  color: colors.text,
                  fontSize: s(14),
                  marginBottom: s(10),
                },
              ]}
            >
              {t.goalName}
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  height: s(48),
                  borderRadius: s(15),
                  paddingHorizontal: s(18),
                  marginBottom: s(22),
                  backgroundColor: inputBackground,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder={placeholderGoalName}
              value={goalName}
              onChangeText={setGoalName}
              placeholderTextColor="#ACADAD"
            />

            <Text
              style={[
                styles.label,
                {
                  color: colors.text,
                  fontSize: s(14),
                  marginBottom: s(10),
                },
              ]}
            >
              {t.targetAmount}
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  height: s(48),
                  borderRadius: s(15),
                  paddingHorizontal: s(18),
                  marginBottom: s(22),
                  backgroundColor: inputBackground,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder={placeholderTargetAmount}
              keyboardType="numeric"
              value={targetAmount}
              onChangeText={setTargetAmount}
              placeholderTextColor="#ACADAD"
            />

            <View
              style={[styles.mainGoalContainer, { marginBottom: s(22) }]}
            >
              <Text
                style={[
                  styles.mainGoalText,
                  { color: colors.text, fontSize: s(14) },
                ]}
              >
                {t.mainGoal}
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
                  color: colors.text,
                  fontSize: s(14),
                  marginBottom: s(10),
                },
              ]}
            >
              {t.savingFrequency}
            </Text>

            <View style={[styles.typeContainer, { marginBottom: s(17) }]}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  {
                    height: s(42),
                    borderRadius: s(13),
                    marginHorizontal: s(3),
                    backgroundColor: inputBackground,
                    borderColor: colors.border,
                  },
                  frequency === "daily" && styles.typeButtonActive,
                ]}
                onPress={() => setFrequency("daily")}
              >
                <Text
                  style={[
                    styles.typeText,
                    {
                      color: frequency === "daily" ? "#FFFFFF" : colors.text,
                      fontSize: s(12),
                    },
                  ]}
                >
                  {t.daily}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  {
                    height: s(42),
                    borderRadius: s(13),
                    marginHorizontal: s(3),
                    backgroundColor: inputBackground,
                    borderColor: colors.border,
                  },
                  frequency === "monthly" && styles.typeButtonActive,
                ]}
                onPress={() => setFrequency("monthly")}
              >
                <Text
                  style={[
                    styles.typeText,
                    {
                      color: frequency === "monthly" ? "#FFFFFF" : colors.text,
                      fontSize: s(12),
                    },
                  ]}
                >
                  {t.monthly}
                </Text>
              </TouchableOpacity>
            </View>

            <Text
              style={[
                styles.label,
                {
                  color: colors.text,
                  fontSize: s(14),
                  marginBottom: s(10),
                },
              ]}
            >
              {t.amountToSave}
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  height: s(48),
                  borderRadius: s(15),
                  paddingHorizontal: s(18),
                  marginBottom: s(22),
                  backgroundColor: inputBackground,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder={placeholderCalculated}
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
                  color: colors.secondaryText,
                },
              ]}
            >
              {t.savingAmountDescription}
            </Text>

            <TouchableOpacity
              style={[
                styles.calculateButton,
                {
                  height: s(40),
                  borderRadius: s(18),
                  marginBottom: s(17),
                  backgroundColor: isDarkTheme ? "#25B7D3" : "#081023",
                },
              ]}
              onPress={handleCalculate}
            >
              <Text style={[styles.buttonText, { fontSize: s(15) }]}>
                {t.calculateSaving}
              </Text>
            </TouchableOpacity>

            <Text
              style={[
                styles.label,
                {
                  color: colors.text,
                  fontSize: s(14),
                  marginBottom: s(10),
                },
              ]}
            >
              {t.startDate}
            </Text>

            <TextInput
              style={[
                styles.date,
                {
                  height: s(48),
                  borderRadius: s(15),
                  paddingHorizontal: s(18),
                  marginBottom: s(22),
                  backgroundColor: inputBackground,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder={placeholderStartDate}
              value={startDate}
              onChangeText={setStartDate}
              placeholderTextColor="#ACADAD"
            />

            <Text
              style={[
                styles.label,
                {
                  color: colors.text,
                  fontSize: s(14),
                  marginBottom: s(10),
                },
              ]}
            >
              {t.endDate}
            </Text>

            <TextInput
              style={[
                styles.date,
                {
                  height: s(48),
                  borderRadius: s(15),
                  paddingHorizontal: s(18),
                  marginBottom: s(22),
                  backgroundColor: inputBackground,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder={placeholderEndDate}
              value={endDate}
              onChangeText={setEndDate}
              placeholderTextColor="#ACADAD"
            />

            {savingAmount && Number(savingAmount.replace(",", ".")) > 0 && (
              <View
                style={[
                  styles.calculationContainer,
                  {
                    borderRadius: s(15),
                    padding: s(15),
                    marginBottom: s(5),
                    backgroundColor: inputBackground,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.calculationTitle,
                    { color: colors.text, fontSize: s(13) },
                  ]}
                >
                  {t.recommendedSaving}
                </Text>

                <Text
                  style={[
                    styles.calculationAmount,
                    { fontSize: s(24), marginTop: s(3) },
                  ]}
                >
                  ${Number(savingAmount.replace(",", ".")).toFixed(2)}
                </Text>

                <Text
                  style={[
                    styles.calculationText,
                    { color: colors.secondaryText, fontSize: s(12) },
                  ]}
                >
                  {frequency === "daily" ? t.perDay : t.perMonth}
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
              <Text style={[styles.buttonText, { fontSize: s(17) }]}>
                {saving ? t.saving : t.saveGoal}
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
              <Text style={[styles.buttonText, { fontSize: s(17) }]}>
                {t.cancel}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      <View
        style={[
          styles.bottomBar,
          {
            height: bottomHeight,
            borderTopLeftRadius: 78 * hs,
            backgroundColor: colors.nav,
          },
        ]}
      >
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.route}
            style={styles.navItem}
            onPress={() =>
              item.route === "/home" ? goHome() : router.push(item.route)
            }
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={(item.icon === "swap-horizontal" ? 37 : 35) * hs}
              color={colors.white}
            />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 30,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  headerTitle: {
    position: "absolute",
    left: 0,
    right: 0,
    color: "#FFFFFF",
    fontWeight: "700",
    textAlign: "center",
  },

  headerBell: {
    justifyContent: "center",
  },

  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    width: "100%",
    overflow: "hidden",
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