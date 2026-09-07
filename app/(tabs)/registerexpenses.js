import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

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

export default function Registerexpenses() {
  const { width, height } = useWindowDimensions();
  const scale = Math.min(width / 390, height / 844);
  const s = (value) => Math.round(value * scale);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [isRecurrent, setIsRecurrent] = useState(false);

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
        <TouchableOpacity
          style={[styles.backButton, { width: s(35) }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={s(25)} color="#FFFFFF" />
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
          <Ionicons name="notifications-outline" size={s(25)} color="#081023" />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Amount</Text>

        <TextInput
          style={styles.input}
          placeholder="Eje. $5"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          placeholderTextColor="#ACADAD"
        />

        <Text style={styles.label}>Category</Text>

        <TextInput
          style={styles.input}
          placeholder="Eje. Transport"
          value={category}
          onChangeText={setCategory}
          placeholderTextColor="#ACADAD"
        />

        <Text style={styles.label}>Date</Text>

        <TextInput
          style={styles.date}
          placeholder="23 June 2026"
          value={date}
          onChangeText={setDate}
          placeholderTextColor="#ACADAD"
        />

        <Text style={styles.label}>Description (optional)</Text>

        <TextInput
          style={styles.input}
          placeholder="Eje. Go out with friends"
          value={description}
          onChangeText={setDescription}
          placeholderTextColor="#ACADAD"
        />

        <Text style={styles.label}>It's a recurring expense?</Text>

        <View style={styles.optionsContainer}>
          <Text style={styles.recurrentText}>
            Activa la opción si es{"\n"}recurrente
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
            },
          ]}
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
          <Text style={[styles.buttonText, { fontSize: s(17) }]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
