import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    Alert,
    StyleSheet, Switch, Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions
} from "react-native";

export default function Registerexpenses() {
  const { width, height } = useWindowDimensions();
  const scle = Math.min(width / 390, height / 844);
  const s = (value) => Math.round(value * scale);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [isRecurrent, setIsRecurrent] = useState(false);

  const registeredExpenses = async () => {
    if (!amount || !category || !date) {
      Alert.alert("Incomplete fields");
      return;
    }

    const expenses = {
      amount: Number(amount),
      category: category,
      date: date,
      description: description,
      isRecurrent: isRecurrent,
    };

    console.log("Expenses recorded: ", expenses);

    Alert.alert("Success", "The expenses has been recorded");

    setAmount("");
    setCategory("");
    setDate("");
    setDescription("");
    setIsRecurrent(false);
  };

  const cancelExpenses = () => {
    setAmount("");
    setCategory("");
    setDate("");
    setDescription("");
    setIsRecurrent(false);
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
        <TouchableOpacity style={[styles.backButton, { width: s(35) }]}>
          <Ionicons name="arrow-back" size={25} color="#ffffff" />
        </TouchableOpacity>
        <Text style={[styles.title, { fontSize: s(28), marginLeft: s(25) }]}>
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
          <Ionicons name="notifications-outline" size={s(25)} color="#081023" />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Amount</Text>

        <TextInput
          style={styles.input}
          placeholder="Eje.$5"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          placeholderTextColor="#ACADAD"
        />

        <Text style={styles.label}>Category</Text>

        <TextInput
          style={styles.input}
          placeholder="Eje.Transport"
          value={category}
          onChangeText={setCategory}
          placeholderTextColor="#ACADAD"
        />

        <Text style={styles.label}>Date</Text>

        <TextInput
          style={styles.date}
          placeholder="23 june 2026 "
          value={date}
          onChangeText={setDate}
          placeholderTextColor="#ACADAD"
        />

        <Text style={styles.label}>Description(optional)</Text>

        <TextInput
          style={styles.input}
          placeholder="Eje.Go out with friends"
          value={description}
          onChangeText={setDescription}
          placeholderTextColor="#ACADAD"
        />

        <Text style={styles.label}>It´s a recurring expense?</Text>

        <View style={styles.optionsContainer}>
          <Text style={styles.recurrentText}>
            Activa la opción si es{"\n"}
            recurrente
          </Text>

          <Switch
            value={isRecurrent}
            onValueChange={setIsRecurrent}
            trackColor={{
              false: "#bdbdbd",
              true: "#168aff",
            }}
            thumbColor="#ffffff"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            {
              height: s(48),
              marginTop: s(15),
              borderRadius: s(18),
            },
          ]}
          onPress={registeredExpenses}
        >
          <Text style={[styles.buttonText, { fontSize: s(17) }]}>
            Save expenses
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
        >
          <Text style={[styles.buttonText, { fontSize: s(17) }]}>Cancele</Text>
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
    paddingTop: 55,
    paddingBottom: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  backButton: {
    width: 35,
    alignItems: "flex-start",
    marginLeft: 10,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "600",
    flex: 1,
    marginLeft: 25,
  },

  notificationButton: {
    width: 34,
    height: 34,
    borderRadius: 18,
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    marginBottom: 22,
  },

  optionsContainer: {
    flexDirection: "row",
    marginBottom: 17,
    height: 40,
    backgroundColor: "#f3f4f5",
    borderRadius: 13,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 8,
  },

  optionButton: {
    flex: 1,
    height: 48,
    backgroundColor: "#f3f4f5",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#000000",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 17,
    flexDirection: "row",
    paddingHorizontal: 8,
  },

  selectedOption: {
    backgroundColor: "#25b7d3",
    borderColor: "#25b7d3",
  },

  optionText: {
    color: "081023",
    fontSize: 16,
    fontWeight: "600",
  },

  selectedOptionText: {
    color: "#ffffff",
  },

  button: {
    height: 48,
    backgroundColor: "#25B7D3",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 17,
  },
});
