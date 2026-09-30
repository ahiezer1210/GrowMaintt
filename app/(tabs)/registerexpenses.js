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
import { auth, db } from "../../firebaseConfig";

export default function Registerexpenses() {
  const { width } = useWindowDimensions();

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
      Alert.alert("Error", "Please complete all fields.");
      return;
    }

    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount.");
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "No user is currently logged in.");
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
            title: "New savings",
            message: `You saved $${savingsAmount.toFixed(
              2
            )} by rounding up your expense.`,
            amount: savingsAmount,
            read: false,
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );
      }

      Alert.alert(
        "Expense registered",
        savingsAmount > 0
          ? `Expense registered successfully.\n$${savingsAmount.toFixed(
              2
            )} was added to your savings.`
          : "Expense registered successfully."
      );

      setAmount("");
      setCategory("");
      setExpenseType("");
      setDate("");
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        "There was a problem registering the expense."
      );
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#071426"
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* HEADER */}
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
              color="#FFFFFF"
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
              },
            ]}
          >
            Register
            {"\n"}
            expenses
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
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {/* CONTENT */}
        <View style={styles.cardContainer}>
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
                },
              ]}
            >
              Amount
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  height: scale(52),
                  fontSize: scale(16),
                  paddingHorizontal: scale(15),
                },
              ]}
              placeholder="Enter amount"
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
                },
              ]}
            >
              Category
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  height: scale(52),
                  fontSize: scale(16),
                  paddingHorizontal: scale(15),
                },
              ]}
              placeholder="Enter category"
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
                },
              ]}
            >
              Expense type
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  height: scale(52),
                  fontSize: scale(16),
                  paddingHorizontal: scale(15),
                },
              ]}
              placeholder="Necessary or unnecessary"
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
                },
              ]}
            >
              Date
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  height: scale(52),
                  fontSize: scale(16),
                  paddingHorizontal: scale(15),
                },
              ]}
              placeholder="MM/DD/YYYY"
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
                Register expense
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.cancelButton,
                {
                  height: scale(54),
                  marginTop: scale(15),
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
                Cancel
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* BOTTOM NAVBAR */}
        <View
          style={[
            styles.bottomNav,
            {
              height: scale(65),
              borderTopLeftRadius: scale(78),
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
                color="#FFFFFF"
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
    backgroundColor: "#071426",
  },

  container: {
    flex: 1,
    backgroundColor: "#071426",
  },

  header: {
    backgroundColor: "#071426",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerButton: {
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontWeight: "700",
    textAlign: "center",
  },

  cardContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    overflow: "hidden",
  },

  scrollContent: {
    paddingHorizontal: 25,
  },

  label: {
    color: "#071426",
    fontWeight: "700",
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#D5D5D5",
    borderRadius: 12,
    color: "#071426",
    backgroundColor: "#FFFFFF",
  },

  saveButton: {
    width: "100%",
    backgroundColor: "#25B5D1",
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
    backgroundColor: "#071426",
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