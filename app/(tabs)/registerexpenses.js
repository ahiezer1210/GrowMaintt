import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { auth, db } from "../../firebaseConfig.js";

const COLORS = {
  blue: "#081023",
  cyan: "#25B7D3",
  gray: "#ACADAD",
  white: "#FFFFFF",
};

export default function Registerexpenses() {
  const { width } = useWindowDimensions();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [expenseType, setExpenseType] = useState("");
  const [isRecurrent, setIsRecurrent] = useState(false);
  const [saving, setSaving] = useState(false);

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

  const resetForm = () => {
    setAmount("");
    setCategory("");
    setDate("");
    setDescription("");
    setExpenseType("");
    setIsRecurrent(false);
  };

  const cancelExpenses = () => {
    resetForm();
    router.replace("/home");
  };

  const saveExpenses = async () => {
    if (!amount.trim()) {
      Alert.alert("Error", "Please enter the expense amount.");
      return;
    }

    if (!category.trim()) {
      Alert.alert("Error", "Please enter the category.");
      return;
    }

    if (!date.trim()) {
      Alert.alert("Error", "Please enter the date.");
      return;
    }

    if (!expenseType) {
      Alert.alert("Error", "Please select the expense type.");
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "There is no authenticated user.");
      return;
    }

    const amountNumber = Number(amount.replace(",", "."));

    if (isNaN(amountNumber) || amountNumber <= 0) {
      Alert.alert("Error", "The entered amount is not valid.");
      return;
    }

    try {
      setSaving(true);

      const roundedAmount = Math.ceil(amountNumber);

      const savingsAmount = Number(
        (roundedAmount - amountNumber).toFixed(2)
      );

      const expenseRef = await addDoc(
        collection(db, "Registro de gastos"),
        {
          uid: user.uid,
          amount: amountNumber,
          category: category.trim(),
          date: date.trim(),
          description: description.trim(),
          roundingAmount: roundedAmount,
          savingsGenerated: savingsAmount,
          expenseType: expenseType,
          isRecurrent: isRecurrent,
          createdAt: serverTimestamp(),
        }
      );

      if (savingsAmount > 0) {
        await addDoc(
          collection(db, "Ahorros"),
          {
            uid: user.uid,
            amount: savingsAmount,
            originalAmount: amountNumber,
            roundingAmount: roundedAmount,
            expenseId: expenseRef.id,
            category: category.trim(),
            date: date.trim(),
            description: description.trim(),
            source: "rounding",
            createdAt: serverTimestamp(),
          }
        );

        const notificationRef = doc(
          db,
          "Notificaciones",
          `${user.uid}_Savings`
        );

        const savingsNotification = {
          id: `${expenseRef.id}_saving`,
          uid: user.uid,
          type: "saving_completed",
          category: "Savings",
          title: "Savings completed",
          message: `You saved $${savingsAmount.toFixed(
            2
          )} from your purchase.`,
          amount: savingsAmount,
          expenseId: expenseRef.id,
          read: false,
          createdAt: Timestamp.now(),
        };

        await setDoc(
          notificationRef,
          {
            uid: user.uid,
            category: "Savings",
            notifications: arrayUnion(savingsNotification),
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }

      resetForm();

      Alert.alert(
        "Expense Registered",
        savingsAmount > 0
          ? `Expense saved successfully.\n\nExpense: $${amountNumber.toFixed(
              2
            )}\nRounded to: $${roundedAmount.toFixed(
              2
            )}\nSavings generated: $${savingsAmount.toFixed(2)}`
          : "Expense saved successfully.\n\nNo savings were generated because the amount was already a whole number.",
        [
          {
            text: "OK",
          },
        ]
      );
    } catch (error) {
      console.log("ERROR SAVING EXPENSE:", error);

      Alert.alert(
        "Error",
        "The expense could not be saved. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.blue}
      />

      <View style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* HEADER */}
          <View
            style={[
              styles.header,
              {
                height:
                  118 *
                  (isSmallScreen
                    ? 0.85
                    : isTablet
                    ? 1.15
                    : 1),
                paddingHorizontal: isSmallScreen
                  ? 18
                  : isTablet
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
                        (isSmallScreen
                          ? 0.85
                          : isTablet
                          ? 1.15
                          : 1),
                    },
                  ],
                },
              ]}
              onPress={() => router.push("/home")}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={
                  35 *
                  (isSmallScreen
                    ? 0.85
                    : isTablet
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
                    (isSmallScreen
                      ? 0.85
                      : isTablet
                      ? 1.15
                      : 1),
                  transform: [
                    {
                      translateX:
                        7 *
                        (isSmallScreen
                          ? 0.85
                          : isTablet
                          ? 1.15
                          : 1),
                    },
                    {
                      translateY:
                        1 *
                        (isSmallScreen
                          ? 0.85
                          : isTablet
                          ? 1.15
                          : 1),
                    },
                  ],
                },
              ]}
            >
              Register expenses
            </Text>

            <TouchableOpacity
              style={[
                styles.headerBell,
                {
                  transform: [
                    {
                      translateY:
                        4 *
                        (isSmallScreen
                          ? 0.85
                          : isTablet
                          ? 1.15
                          : 1),
                    },
                  ],
                },
              ]}
              onPress={() =>
                router.push({
                  pathname: "/notifications",
                  params: {
                    from: "/registerexpenses",
                  },
                })
              }
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="bell-circle-outline"
                size={
                  35 *
                  (isSmallScreen
                    ? 0.85
                    : isTablet
                    ? 1.15
                    : 1)
                }
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          {/* CONTENIDO */}
          <View style={styles.cardContainer}>
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={[
                styles.scrollContent,
                {
                  paddingHorizontal: horizontalPadding,
                  paddingBottom: isSmallScreen ? 100 : 110,
                },
              ]}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              nestedScrollEnabled={true}
            >
              <Text
                style={[
                  styles.label,
                  {
                    fontSize: Math.round(14 * scale),
                    marginBottom: Math.round(10 * scale),
                  },
                ]}
              >
                Amount
              </Text>

              <TextInput
                style={[
                  styles.input,
                  {
                    height: Math.round(48 * scale),
                    borderRadius: Math.round(15 * scale),
                    paddingHorizontal: Math.round(18 * scale),
                    marginBottom: Math.round(22 * scale),
                    fontSize: Math.round(14 * scale),
                  },
                ]}
                placeholder="E.g. $4.60"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                placeholderTextColor={COLORS.gray}
              />

              <Text
                style={[
                  styles.roundingInfo,
                  {
                    fontSize: Math.round(12 * scale),
                    marginBottom: Math.round(22 * scale),
                    lineHeight: Math.round(17 * scale),
                  },
                ]}
              >
                The amount will be automatically rounded up to generate savings.
              </Text>

              <Text
                style={[
                  styles.label,
                  {
                    fontSize: Math.round(14 * scale),
                    marginBottom: Math.round(10 * scale),
                  },
                ]}
              >
                Category
              </Text>

              <TextInput
                style={[
                  styles.input,
                  {
                    height: Math.round(48 * scale),
                    borderRadius: Math.round(15 * scale),
                    paddingHorizontal: Math.round(18 * scale),
                    marginBottom: Math.round(22 * scale),
                    fontSize: Math.round(14 * scale),
                  },
                ]}
                placeholder="E.g. Transport"
                value={category}
                onChangeText={setCategory}
                placeholderTextColor={COLORS.gray}
              />

              <Text
                style={[
                  styles.label,
                  {
                    fontSize: Math.round(14 * scale),
                    marginBottom: Math.round(10 * scale),
                  },
                ]}
              >
                Date
              </Text>

              <TextInput
                style={[
                  styles.input,
                  {
                    height: Math.round(48 * scale),
                    borderRadius: Math.round(15 * scale),
                    paddingHorizontal: Math.round(18 * scale),
                    marginBottom: Math.round(22 * scale),
                    fontSize: Math.round(14 * scale),
                  },
                ]}
                placeholder="June 23, 2026"
                value={date}
                onChangeText={setDate}
                placeholderTextColor={COLORS.gray}
              />

              <Text
                style={[
                  styles.label,
                  {
                    fontSize: Math.round(14 * scale),
                    marginBottom: Math.round(10 * scale),
                  },
                ]}
              >
                Description (optional)
              </Text>

              <TextInput
                style={[
                  styles.input,
                  {
                    height: Math.round(48 * scale),
                    borderRadius: Math.round(15 * scale),
                    paddingHorizontal: Math.round(18 * scale),
                    marginBottom: Math.round(22 * scale),
                    fontSize: Math.round(14 * scale),
                  },
                ]}
                placeholder="E.g. Going out with friends"
                value={description}
                onChangeText={setDescription}
                placeholderTextColor={COLORS.gray}
              />

              <Text
                style={[
                  styles.label,
                  {
                    fontSize: Math.round(14 * scale),
                    marginBottom: Math.round(10 * scale),
                  },
                ]}
              >
                Expense type
              </Text>

              <View
                style={[
                  styles.typeContainer,
                  {
                    marginBottom: Math.round(17 * scale),
                  },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    {
                      height: Math.round(42 * scale),
                      borderRadius: Math.round(13 * scale),
                    },
                    expenseType === "weekly" &&
                      styles.typeButtonActive,
                  ]}
                  onPress={() => setExpenseType("weekly")}
                >
                  <Text
                    style={[
                      styles.typeText,
                      {
                        fontSize: Math.round(12 * scale),
                      },
                      expenseType === "weekly" &&
                        styles.typeTextActive,
                    ]}
                  >
                    Weekly
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    {
                      height: Math.round(42 * scale),
                      borderRadius: Math.round(13 * scale),
                    },
                    expenseType === "unnecessary" &&
                      styles.typeButtonActive,
                  ]}
                  onPress={() =>
                    setExpenseType("unnecessary")
                  }
                >
                  <Text
                    style={[
                      styles.typeText,
                      {
                        fontSize: Math.round(12 * scale),
                      },
                      expenseType === "unnecessary" &&
                        styles.typeTextActive,
                    ]}
                  >
                    Unnecessary
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    {
                      height: Math.round(42 * scale),
                      borderRadius: Math.round(13 * scale),
                    },
                    expenseType === "monthly" &&
                      styles.typeButtonActive,
                  ]}
                  onPress={() => setExpenseType("monthly")}
                >
                  <Text
                    style={[
                      styles.typeText,
                      {
                        fontSize: Math.round(12 * scale),
                      },
                      expenseType === "monthly" &&
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
                    fontSize: Math.round(14 * scale),
                    marginBottom: Math.round(10 * scale),
                  },
                ]}
              >
                It's a recurring expense?
              </Text>

              <View
                style={[
                  styles.optionsContainer,
                  {
                    height: Math.round(40 * scale),
                    borderRadius: Math.round(13 * scale),
                    paddingHorizontal: Math.round(8 * scale),
                    marginBottom: Math.round(17 * scale),
                  },
                ]}
              >
                <Text
                  style={[
                    styles.recurrentText,
                    {
                      fontSize: Math.round(13 * scale),
                    },
                  ]}
                >
                  Activate the option if it is{"\n"}recurring
                </Text>

                <Switch
                  value={isRecurrent}
                  onValueChange={setIsRecurrent}
                  trackColor={{
                    false: "#BDBDBD",
                    true: "#168AFF",
                  }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    height: Math.round(50 * scale),
                    borderRadius: Math.round(25 * scale),
                    marginTop: Math.round(15 * scale),
                    opacity: saving ? 0.6 : 1,
                  },
                ]}
                onPress={saveExpenses}
                disabled={saving}
              >
                <Text
                  style={[
                    styles.buttonText,
                    {
                      fontSize: Math.round(17 * scale),
                    },
                  ]}
                >
                  {saving ? "Saving..." : "Save expenses"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    height: Math.round(50 * scale),
                    borderRadius: Math.round(25 * scale),
                    marginTop: Math.round(12 * scale),
                  },
                ]}
                onPress={cancelExpenses}
                disabled={saving}
              >
                <Text
                  style={[
                    styles.buttonText,
                    {
                      fontSize: Math.round(17 * scale),
                    },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <View
                style={{
                  height: Math.round(80 * scale),
                }}
              />
            </ScrollView>
          </View>

          {/* NAVBAR */}
          <View
            style={[
              styles.bottomBar,
              {
                height:
                  65 *
                  (isSmallScreen
                    ? 0.85
                    : isTablet
                    ? 1.15
                    : 1),
                borderTopLeftRadius:
                  78 *
                  (isSmallScreen
                    ? 0.85
                    : isTablet
                    ? 1.15
                    : 1),
              },
            ]}
          >
            <TouchableOpacity
              style={styles.navItem}
              activeOpacity={0.8}
              onPress={() => router.push("/home")}
            >
              <MaterialCommunityIcons
                name="home-outline"
                size={
                  35 *
                  (isSmallScreen
                    ? 0.85
                    : isTablet
                    ? 1.15
                    : 1)
                }
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              activeOpacity={0.8}
              onPress={() => router.push("/historial")}
            >
              <MaterialCommunityIcons
                name="chart-box-outline"
                size={
                  35 *
                  (isSmallScreen
                    ? 0.85
                    : isTablet
                    ? 1.15
                    : 1)
                }
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              activeOpacity={0.8}
              onPress={() => router.push("/expensesManagement")}
            >
              <MaterialCommunityIcons
                name="swap-horizontal"
                size={
                  37 *
                  (isSmallScreen
                    ? 0.85
                    : isTablet
                    ? 1.15
                    : 1)
                }
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              activeOpacity={0.8}
              onPress={() => router.push("/currentgoal")}
            >
              <MaterialCommunityIcons
                name="layers-outline"
                size={
                  35 *
                  (isSmallScreen
                    ? 0.85
                    : isTablet
                    ? 1.15
                    : 1)
                }
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              activeOpacity={0.8}
              onPress={() => router.push("/profile")}
            >
              <MaterialCommunityIcons
                name="account-outline"
                size={
                  35 *
                  (isSmallScreen
                    ? 0.85
                    : isTablet
                    ? 1.15
                    : 1)
                }
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.blue,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.blue,
  },

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
    color: "#FFFFFF",
    fontWeight: "700",
  },

  headerBell: {
    justifyContent: "center",
  },

  cardContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    overflow: "hidden",
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingTop: 30,
  },

  label: {
    color: COLORS.blue,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#F3F4F5",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#000000",
    color: COLORS.blue,
  },

  roundingInfo: {
    color: COLORS.gray,
    marginTop: -12,
  },

  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  typeButton: {
    flex: 1,
    backgroundColor: "#F3F4F5",
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 3,
  },

  typeButtonActive: {
    backgroundColor: COLORS.cyan,
    borderColor: COLORS.cyan,
  },

  typeText: {
    color: COLORS.blue,
    fontWeight: "600",
  },

  typeTextActive: {
    color: COLORS.white,
  },

  optionsContainer: {
    backgroundColor: "#F3F4F5",
    borderRadius: 13,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },

  recurrentText: {
    color: COLORS.blue,
  },

  button: {
    backgroundColor: COLORS.cyan,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },

  buttonText: {
    color: COLORS.white,
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