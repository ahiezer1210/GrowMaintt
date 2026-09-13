import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { useState } from "react";
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

export default function Registerexpenses() {
  const { width, height } = useWindowDimensions();
  const scale = Math.min(width / 390, height / 844);
  const s = (value) => Math.round(value * scale);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [expenseType, setExpenseType] = useState("");
  const [isRecurrent, setIsRecurrent] = useState(false);
  const [saving, setSaving] = useState(false);

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
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          {
            paddingTop: s(55),
            paddingBottom: s(30),
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.backButton, { width: s(35) }]}
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
        >
          Register expenses
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

      <View style={styles.card}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.label}>Amount</Text>

          <TextInput
            style={styles.input}
            placeholder="E.g. $4.60"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            placeholderTextColor="#ACADAD"
          />

          <Text style={styles.roundingInfo}>
            The amount will be automatically rounded up to generate savings.
          </Text>

          <Text style={styles.label}>Category</Text>

          <TextInput
            style={styles.input}
            placeholder="E.g. Transport"
            value={category}
            onChangeText={setCategory}
            placeholderTextColor="#ACADAD"
          />

          <Text style={styles.label}>Date</Text>

          <TextInput
            style={styles.date}
            placeholder="June 23, 2026"
            value={date}
            onChangeText={setDate}
            placeholderTextColor="#ACADAD"
          />

          <Text style={styles.label}>
            Description (optional)
          </Text>

          <TextInput
            style={styles.input}
            placeholder="E.g. Going out with friends"
            value={description}
            onChangeText={setDescription}
            placeholderTextColor="#ACADAD"
          />

          <Text style={styles.label}>
            Expense type
          </Text>

          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                expenseType === "weekly" &&
                  styles.typeButtonActive,
              ]}
              onPress={() => setExpenseType("weekly")}
            >
              <Text
                style={[
                  styles.typeText,
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
                expenseType === "monthly" &&
                  styles.typeButtonActive,
              ]}
              onPress={() => setExpenseType("monthly")}
            >
              <Text
                style={[
                  styles.typeText,
                  expenseType === "monthly" &&
                    styles.typeTextActive,
                ]}
              >
                Monthly
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>
            It's a recurring expense?
          </Text>

          <View style={styles.optionsContainer}>
            <Text style={styles.recurrentText}>
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
                height: s(48),
                marginTop: s(15),
                borderRadius: s(18),
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
                  fontSize: s(17),
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
                height: s(34),
                marginTop: s(15),
                borderRadius: s(18),
              },
            ]}
            onPress={cancelExpenses}
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
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 30,
    paddingTop: 25,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  label: {
    color: "#081023",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  input: {
    height: 48,
    backgroundColor: "#F3F4F5",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#000000",
    paddingHorizontal: 18,
    marginBottom: 22,
  },
  date: {
    height: 48,
    backgroundColor: "#F3F4F5",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#000000",
    paddingHorizontal: 18,
    marginBottom: 22,
  },
  roundingInfo: {
    color: "#ACADAD",
    fontSize: 12,
    marginTop: -12,
    marginBottom: 22,
  },
  optionsContainer: {
    height: 40,
    backgroundColor: "#F3F4F5",
    borderRadius: 13,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 8,
    marginBottom: 17,
  },
  recurrentText: {
    color: "#081023",
    fontSize: 13,
  },
  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 17,
  },
  typeButton: {
    flex: 1,
    height: 42,
    backgroundColor: "#F3F4F5",
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 3,
  },
  typeButtonActive: {
    backgroundColor: "#25B7D3",
    borderColor: "#25B7D3",
  },
  typeText: {
    color: "#081023",
    fontSize: 12,
    fontWeight: "600",
  },
  typeTextActive: {
    color: "#FFFFFF",
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