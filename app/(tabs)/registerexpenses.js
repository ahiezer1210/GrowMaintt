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
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useAppSettings } from "../../context/Appsettings";
import { auth, db } from "../../firebaseConfig";

export default function Registerexpenses() {
  const { width } = useWindowDimensions();
  const { t, colors } = useAppSettings();

  const isDarkTheme =
    colors.background?.toLowerCase() !== "#ffffff" &&
    colors.background?.toLowerCase() !== "#fff" &&
    colors.background?.toLowerCase() !== "#f5f5f5" &&
    colors.background?.toLowerCase() !== "#f4f4f4" &&
    colors.background?.toLowerCase() !== "#f3f4f5";

  const isSmallScreen = width < 380;
  const isTablet = width >= 768;

  const scale = (size) =>
    size * (isSmallScreen ? 0.85 : isTablet ? 1.15 : 1);

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

  const saveExpense = async () => {
    if (!amount || !category || !date || !expenseType) {
      Alert.alert(t.error, t.enterExpenseAmount);
      return;
    }

    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert(t.error, t.invalidAmount);
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      Alert.alert(t.error, t.noAuthenticatedUser);
      return;
    }

    try {
      const roundedAmount = Math.ceil(numericAmount);
      const savingsAmount = roundedAmount - numericAmount;

      await addDoc(collection(db, "Registro de gastos"), {
        userId: user.uid,
        amount: numericAmount,
        roundedAmount,
        category,
        expenseType,
        date,
        createdAt: serverTimestamp(),
      });

      if (savingsAmount > 0) {
        await addDoc(collection(db, "Ahorros"), {
          userId: user.uid,
          amount: savingsAmount,
          source: "Expense rounding",
          expenseAmount: numericAmount,
          roundedAmount,
          date,
          createdAt: serverTimestamp(),
        });

        await setDoc(
          doc(db, "Notificaciones", `${user.uid}_Savings`),
          {
            userId: user.uid,
            type: "Savings",
            title: t.savingsGenerated,
            message: `${t.savedFromPurchase} $${savingsAmount.toFixed(
              2
            )} ${t.fromYourPurchase}`,
            amount: savingsAmount,
            read: false,
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );
      }

      Alert.alert(
        t.expenseRegistered,
        savingsAmount > 0
          ? `${t.expenseSavedSuccessfully}\n$${savingsAmount.toFixed(
              2
            )} ${t.addedToSavings}`
          : t.expenseSavedSuccessfully
      );

      setAmount("");
      setCategory("");
      setExpenseType("");
      setDate("");
    } catch (error) {
      console.error(error);
      Alert.alert(t.error, t.expenseCouldNotBeSaved);
    }
  };

  const cancelExpenses = () => {
    setAmount("");
    setCategory("");
    setExpenseType("");
    setDate("");
    router.replace("/home");
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.header}
      />

      <KeyboardAvoidingView
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
          },
        ]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          style={[
            styles.header,
            {
              height: scale(118),
              paddingHorizontal: isSmallScreen
                ? scale(18)
                : isTablet
                ? scale(45)
                : scale(25),
              backgroundColor: colors.header,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => router.push("/home")}
            style={styles.headerButton}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={scale(35)}
              color={colors.white}
            />
          </TouchableOpacity>

          <Text
            style={[
              styles.headerTitle,
              {
                fontSize: scale(25),
                lineHeight: scale(29),
                transform: [
                  {
                    translateX: scale(7),
                  },
                  {
                    translateY: scale(7),
                  },
                ],
                color: colors.white,
              },
            ]}
          >
            {t.registerExpenses}
          </Text>

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/notifications",
                params: {
                  from: "/registerexpenses",
                },
              })
            }
            style={styles.headerButton}
          >
            <MaterialCommunityIcons
              name="bell-circle-outline"
              size={scale(35)}
              color={colors.white}
            />
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.cardContainer,
            {
              backgroundColor: colors.background,
            },
          ]}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingTop: scale(30),
                paddingBottom: scale(100),
              },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <Text
              style={[
                styles.label,
                {
                  fontSize: scale(17),
                  marginBottom: scale(8),
                  color: colors.text,
                },
              ]}
            >
              {t.amount}
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  height: scale(52),
                  fontSize: scale(16),
                  paddingHorizontal: scale(15),
                  backgroundColor: isDarkTheme
                    ? colors.primaryBackground
                    : "#FFFFFF",
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder={t.amountPlaceholder}
              placeholderTextColor="#8A8A8A"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />

            <Text
              style={[
                styles.label,
                {
                  fontSize: scale(17),
                  marginTop: scale(20),
                  marginBottom: scale(8),
                  color: colors.text,
                },
              ]}
            >
              {t.category}
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  height: scale(52),
                  fontSize: scale(16),
                  paddingHorizontal: scale(15),
                  backgroundColor: isDarkTheme
                    ? colors.primaryBackground
                    : "#FFFFFF",
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder={t.categoryPlaceholder}
              placeholderTextColor="#8A8A8A"
              value={category}
              onChangeText={setCategory}
            />

            <Text
              style={[
                styles.label,
                {
                  fontSize: scale(17),
                  marginTop: scale(20),
                  marginBottom: scale(8),
                  color: colors.text,
                },
              ]}
            >
              {t.expenseType}
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  height: scale(52),
                  fontSize: scale(16),
                  paddingHorizontal: scale(15),
                  backgroundColor: isDarkTheme
                    ? colors.primaryBackground
                    : "#FFFFFF",
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder={t.expenseTypePlaceholder}
              placeholderTextColor="#8A8A8A"
              value={expenseType}
              onChangeText={setExpenseType}
            />

            <Text
              style={[
                styles.label,
                {
                  fontSize: scale(17),
                  marginTop: scale(20),
                  marginBottom: scale(8),
                  color: colors.text,
                },
              ]}
            >
              {t.date}
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  height: scale(52),
                  fontSize: scale(16),
                  paddingHorizontal: scale(15),
                  backgroundColor: isDarkTheme
                    ? colors.primaryBackground
                    : "#FFFFFF",
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder={t.datePlaceholder}
              placeholderTextColor="#8A8A8A"
              value={date}
              onChangeText={setDate}
            />

            <TouchableOpacity
              style={[
                styles.saveButton,
                {
                  height: scale(54),
                  marginTop: scale(30),
                  backgroundColor: "#25B5D1",
                },
              ]}
              onPress={saveExpense}
            >
              <Text
                style={[
                  styles.saveButtonText,
                  {
                    fontSize: scale(18),
                  },
                ]}
              >
                {t.registerExpense}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.cancelButton,
                {
                  height: scale(54),
                  marginTop: scale(15),
                  backgroundColor: isDarkTheme
                    ? "#25B5D1"
                    : "#071426",
                },
              ]}
              onPress={cancelExpenses}
            >
              <Text
                style={[
                  styles.cancelButtonText,
                  {
                    fontSize: scale(18),
                  },
                ]}
              >
                {t.cancel}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View
          style={[
            styles.bottomNav,
            {
              height: scale(65),
              borderTopLeftRadius: scale(78),
              backgroundColor: colors.nav,
            },
          ]}
        >
          {navItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.navItem}
              onPress={() => router.push(item.route)}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={scale(
                  item.icon === "swap-horizontal" ? 37 : 35
                )}
                color={colors.white}
              />
            </TouchableOpacity>
          ))}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerButton: {
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontWeight: "700",
    textAlign: "center",
  },

  cardContainer: {
    flex: 1,
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    overflow: "hidden",
  },

  scrollContent: {
    paddingHorizontal: 25,
  },

  label: {
    fontWeight: "700",
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 12,
  },

  saveButton: {
    width: "100%",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  cancelButton: {
    width: "100%",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  cancelButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
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