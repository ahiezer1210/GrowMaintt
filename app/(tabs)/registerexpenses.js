import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import { useAppSettings } from "../../context/Appsettings";
import { auth, db } from "../../firebaseConfig";

export default function Registerexpenses() {
  const { width } = useWindowDimensions();
  const { colors } = useAppSettings();

  const isDarkTheme = colors.background === "#121212";

  const small = width < 350;
  const tablet = width >= 600;

  const hs = small ? 0.85 : tablet ? 1.15 : 1;

  const scale = (size) => size * hs;

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [expenseType, setExpenseType] = useState("");
  const [date, setDate] = useState("");

  const navItems = [
    { icon: "home-outline", route: "/home" },
    { icon: "chart-box-outline", route: "/historial" },
    { icon: "swap-horizontal", route: "/expensesManagement" },
    { icon: "layers-outline", route: "/currentgoal" },
    { icon: "account-outline", route: "/profile" },
  ];

  // Vuelve al Home que ya existe en la pila (no apila otro Home)
  const goHome = () => {
    router.replace("/home");
  };

  const saveExpense = async () => {
    if (!amount || !category || !expenseType || !date) {
      Alert.alert("Error", "Please complete all fields.");
      return;
    }

    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount.");
      return;
    }

    try {
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Error", "There is no authenticated user.");
        return;
      }

      const roundedAmount = Math.ceil(numericAmount);
      const savings = roundedAmount - numericAmount;

      // Se guarda "uid" (lo que lee Home) y "userId" (por compatibilidad)
      await addDoc(collection(db, "Registro de gastos"), {
        uid: user.uid,
        userId: user.uid,
        amount: numericAmount,
        roundedAmount,
        category,
        expenseType,
        date,
        createdAt: serverTimestamp(),
      });

      if (savings > 0) {
        await addDoc(collection(db, "Ahorros"), {
          uid: user.uid,
          userId: user.uid,
          amount: savings,
          source: "Expense rounding",
          createdAt: serverTimestamp(),
        });
      }

      const notificationRef = doc(db, "Notificaciones", `${user.uid}_Savings`);

      await setDoc(
        notificationRef,
        {
          userId: user.uid,
          category: "Savings",
          title: "New savings",
          message: `You saved $${savings.toFixed(
            2
          )} by rounding up your expense.`,
          read: false,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      Alert.alert("Success", "Expense registered successfully.");

      setAmount("");
      setCategory("");
      setExpenseType("");
      setDate("");
    } catch (error) {
      console.error("Error saving expense:", error);

      Alert.alert("Error", "The expense could not be saved.");
    }
  };

  const cancelExpenses = () => {
    setAmount("");
    setCategory("");
    setExpenseType("");
    setDate("");

    goHome();
  };

  const abrirNotificaciones = () => {
    router.push({
      pathname: "/notifications",
      params: {
        from: "/registerexpenses",
      },
    });
  };

  return (
    <View
      style={[styles.screen, { backgroundColor: colors.primaryBackground }]}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDarkTheme ? "light-content" : "dark-content"}
      />

      <View
        style={[styles.app, { backgroundColor: colors.primaryBackground }]}
      >
        {/* HEADER */}
        <View
          style={[
            styles.header,
            {
              height: 118 * hs,
              paddingHorizontal: small ? 18 : tablet ? 45 : 25,
              backgroundColor: colors.header,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.back,
              { transform: [{ translateY: 4 * hs }] },
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
            Register Expenses
          </Text>

          <TouchableOpacity
            style={[
              styles.headerBell,
              { transform: [{ translateY: 4 * hs }] },
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

        {/* MAIN */}
        <View
          style={[
            styles.main,
            {
              backgroundColor: colors.background,
              borderTopLeftRadius: tablet ? 55 : small ? 35 : 45,
              borderTopRightRadius: tablet ? 55 : small ? 35 : 45,
            },
          ]}
        >
          <KeyboardAvoidingView
            style={styles.keyboard}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <ScrollView
              contentContainerStyle={[
                styles.scrollContent,
                {
                  paddingHorizontal: scale(24),
                  paddingTop: scale(30),
                  paddingBottom: scale(100),
                },
              ]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text
                style={[
                  styles.label,
                  { color: colors.text, fontSize: scale(16) },
                ]}
              >
                Amount
              </Text>

              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: colors.border,
                    backgroundColor: colors.card,
                    fontSize: scale(16),
                  },
                ]}
                value={amount}
                onChangeText={setAmount}
                placeholder="$0.00"
                placeholderTextColor={colors.secondaryText}
                keyboardType="decimal-pad"
              />

              <Text
                style={[
                  styles.label,
                  { color: colors.text, fontSize: scale(16) },
                ]}
              >
                Category
              </Text>

              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: colors.border,
                    backgroundColor: colors.card,
                    fontSize: scale(16),
                  },
                ]}
                value={category}
                onChangeText={setCategory}
                placeholder="E.g. Food"
                placeholderTextColor={colors.secondaryText}
              />

              <Text
                style={[
                  styles.label,
                  { color: colors.text, fontSize: scale(16) },
                ]}
              >
                Expense Type
              </Text>

              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: colors.border,
                    backgroundColor: colors.card,
                    fontSize: scale(16),
                  },
                ]}
                value={expenseType}
                onChangeText={setExpenseType}
                placeholder="E.g. Necessary"
                placeholderTextColor={colors.secondaryText}
              />

              <Text
                style={[
                  styles.label,
                  { color: colors.text, fontSize: scale(16) },
                ]}
              >
                Date
              </Text>

              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: colors.border,
                    backgroundColor: colors.card,
                    fontSize: scale(16),
                  },
                ]}
                value={date}
                onChangeText={setDate}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={colors.secondaryText}
              />

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  {
                    width: scale(225),
                    height: scale(54),
                    borderRadius: scale(27),
                    backgroundColor: "#25B5D1",
                    marginTop: scale(15),
                  },
                ]}
                onPress={saveExpense}
                activeOpacity={0.8}
              >
                <Text style={[styles.saveButtonText, { fontSize: scale(17) }]}>
                  Save
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  {
                    width: scale(225),
                    height: scale(54),
                    borderRadius: scale(27),
                    backgroundColor: isDarkTheme ? "#2A2A2A" : "#E5E5E5",
                    marginTop: scale(12),
                  },
                ]}
                onPress={cancelExpenses}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.cancelButtonText,
                    { color: colors.text, fontSize: scale(17) },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>

        {/* BOTTOM NAV */}
        <View
          style={[
            styles.bottomBar,
            {
              height: 65 * hs,
              borderTopLeftRadius: 78 * hs,
              backgroundColor: colors.nav,
            },
          ]}
        >
          {navItems.map((item) => (
            <TouchableOpacity
              key={item.route}
              style={styles.navItem}
              activeOpacity={0.8}
              onPress={() =>
                item.route === "/home" ? goHome() : router.push(item.route)
              }
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={(item.icon === "swap-horizontal" ? 37 : 35) * hs}
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
    fontWeight: "700",
    textAlign: "center",
    flex: 1,
  },

  headerBell: {
    justifyContent: "center",
  },

  main: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
  },

  keyboard: {
    flex: 1,
  },

  scrollContent: {
    alignItems: "center",
  },

  label: {
    width: "100%",
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 10,
  },

  input: {
    width: "100%",
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  saveButton: {
    alignItems: "center",
    justifyContent: "center",
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  cancelButton: {
    alignItems: "center",
    justifyContent: "center",
  },

  cancelButtonText: {
    fontWeight: "700",
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