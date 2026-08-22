import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const COLORS = {
  cyan: "#25B7D3",
  dark: "#081023",
  white: "#FFFFFF",
  gray: "#ACADAD",
  lightCyan: "#E9F9FC",
  darkCyan: "#173448",
};

const DATA = {
  Daily: {
    balance: "$7,783.00",
    expenses: "-$127.40",
    goal: "500",
    progress: 35,
    transactions: [
      ["cart-outline", "Groceries", "10:30 - Today", "Expense", "-$45.00"],
      ["bus-outline", "Transport", "08:15 - Today", "Expense", "-$32.40"],
      ["cash-outline", "Payment", "07:30 - Today", "Income", "$250.00"],
    ],
  },
  Weekly: {
    balance: "$7,783.00",
    expenses: "-$487.60",
    goal: "2,500",
    progress: 45,
    transactions: [
      ["bag-outline", "Purchases", "17:00 - April 24", "Expense", "-$100.00"],
      ["restaurant-outline", "Food", "13:20 - April 23", "Expense", "-$87.60"],
      ["cash-outline", "Salary", "09:00 - April 21", "Income", "$1,000.00"],
    ],
  },
  Monthly: {
    balance: "$7,783.00",
    expenses: "-$1,187.40",
    goal: "10,000",
    progress: 30,
    transactions: [
      ["cash-outline", "Salary", "18:27 - April 30", "Monthly", "$4,000.00"],
      ["bag-outline", "Purchases", "17:00 - April 24", "Expense", "-$100.00"],
      ["home-outline", "Rent", "08:30 - April 15", "Rent", "-$674.40"],
    ],
  },
};

const ACTIONS = [
  ["card-outline", "Expense\nManagement", "ion"],
  ["book-outline", "User\nManual", "ion"],
  ["trending-up-outline", "Investments", "ion"],
  ["swap-horizontal", "Points\nExchange", "material"],
];

const NAV = [
  ["home-outline", "ion"],
  ["bar-chart-outline", "ion"],
  ["swap-horizontal", "material"],
  ["layers-outline", "material"],
  ["person-outline", "ion"],
];

export default function App() {
  const [period, setPeriod] = useState("Monthly");
  const { width } = useWindowDimensions();

  const small = width < 360;
  const scale = small ? 0.88 : width > 430 ? 1.08 : 1;
  const data = DATA[period];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.dark} />

      <View style={styles.app}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            { paddingHorizontal: small ? 18 : width > 430 ? 34 : 25 },
          ]}
        >
          <Header small={small} scale={scale} />
          <Balance data={data} small={small} scale={scale} />
          <Savings data={data} scale={scale} />
          <Actions scale={scale} />

          <View style={styles.filters}>
            {["Daily", "Weekly", "Monthly"].map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setPeriod(item)}
                style={[
                  styles.filter,
                  period === item && styles.activeFilter,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    small && { fontSize: 13 },
                    period === item && styles.activeFilterText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {data.transactions.map((item, index) => (
            <Transaction key={index} data={item} small={small} />
          ))}
        </ScrollView>

        <BottomNav small={small} />
      </View>
    </SafeAreaView>
  );
}

function Header({ small, scale }) {
  const size = small ? 55 : 68;

  return (
    <View style={styles.header}>
      <View
        style={[
          styles.profile,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      />

      <View style={styles.welcome}>
        <Text
          style={[styles.hello, { fontSize: 24 * scale }]}
          numberOfLines={1}
        >
          Hello, User!
        </Text>
        <Text style={styles.welcomeText}>Welcome back</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.notification,
          { width: small ? 44 : 52, height: small ? 44 : 52 },
        ]}
      >
        <Ionicons
          name="notifications-outline"
          size={small ? 24 : 29}
          color={COLORS.white}
        />
      </TouchableOpacity>
    </View>
  );
}

function Balance({ data, small, scale }) {
  return (
    <View style={styles.balance}>
      <BalanceItem
        icon="wallet-outline"
        title="Available Balance"
        value={data.balance}
        size={29 * scale}
        small={small}
      />

      <View style={[styles.divider, { height: small ? 55 : 70 }]} />

      <BalanceItem
        icon="receipt-outline"
        title="Expenses"
        value={data.expenses}
        size={28 * scale}
        expense
        small={small}
      />
    </View>
  );
}

function BalanceItem({ icon, title, value, size, expense, small }) {
  return (
    <View style={styles.balanceItem}>
      <View style={styles.titleRow}>
        <Ionicons
          name={icon}
          size={small ? 16 : 18}
          color={COLORS.white}
        />
        <Text style={[styles.balanceTitle, small && { fontSize: 12 }]}>
          {title}
        </Text>
      </View>

      <Text
        style={[
          expense ? styles.expense : styles.balanceValue,
          { fontSize: size },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {value}
      </Text>
    </View>
  );
}

function Savings({ data, scale }) {
  return (
    <View style={styles.savings}>
      <View style={styles.progress}>
        <View
          style={[
            styles.progressFill,
            { width: `${data.progress}%` },
          ]}
        >
          <Text style={[styles.progressText, { fontSize: 15 * scale }]}>
            {data.progress}%
          </Text>
        </View>

        <Text style={[styles.goalAmount, { fontSize: 15 * scale }]}>
          {data.goal}
        </Text>
      </View>

      <Text style={[styles.goalText, { fontSize: 17 * scale }]}>
        Savings Goal
      </Text>
    </View>
  );
}

function Actions({ scale }) {
  return (
    <View style={styles.actions}>
      {ACTIONS.map(([icon, text, type]) => (
        <TouchableOpacity key={text} style={styles.action}>
          <View
            style={[
              styles.actionIcon,
              {
                width: 38 * scale,
                height: 38 * scale,
                borderRadius: 19 * scale,
              },
            ]}
          >
            {type === "ion" ? (
              <Ionicons
                name={icon}
                size={27 * scale}
                color={COLORS.cyan}
              />
            ) : (
              <MaterialCommunityIcons
                name={icon}
                size={29 * scale}
                color={COLORS.cyan}
              />
            )}
          </View>

          <Text style={[styles.actionText, { fontSize: 14 * scale }]}>
            {text}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function Transaction({ data, small }) {
  const [icon, title, date, type, amount] = data;
  const negative = amount.startsWith("-");

  return (
    <View style={styles.transaction}>
      <View
        style={[
          styles.transactionIcon,
          {
            width: small ? 50 : 62,
            height: small ? 50 : 62,
            borderRadius: small ? 25 : 31,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={small ? 24 : 30}
          color={COLORS.white}
        />
      </View>

      <View
        style={[
          styles.transactionInfo,
          { width: small ? 82 : 112 },
        ]}
      >
        <Text
          style={[styles.transactionTitle, small && { fontSize: 15 }]}
          numberOfLines={1}
        >
          {title}
        </Text>

        <Text
          style={[styles.transactionDate, small && { fontSize: 9 }]}
          numberOfLines={1}
        >
          {date}
        </Text>
      </View>

      <View style={[styles.transactionDivider, small && { height: 42 }]} />

      <Text
        style={[
          styles.transactionType,
          small && { fontSize: 10, width: 48 },
        ]}
        numberOfLines={1}
      >
        {type}
      </Text>

      <View style={[styles.transactionDivider, small && { height: 42 }]} />

      <Text
        style={[
          styles.amount,
          negative && styles.negative,
          small && { fontSize: 11 },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {amount}
      </Text>
    </View>
  );
}

function BottomNav({ small }) {
  return (
    <View
      style={[
        styles.bottom,
        {
          height: small ? 85 : 100,
          borderTopLeftRadius: small ? 45 : 65,
        },
      ]}
    >
      {NAV.map(([icon, type], index) => (
        <TouchableOpacity key={index} style={styles.navItem}>
          {type === "ion" ? (
            <Ionicons
              name={icon}
              size={small ? 25 : 31}
              color={COLORS.white}
            />
          ) : (
            <MaterialCommunityIcons
              name={icon}
              size={small ? 28 : 34}
              color={COLORS.white}
            />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },

  app: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },

  content: {
    paddingTop: 24,
    paddingBottom: 125,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 34,
  },

  profile: {
    backgroundColor: "#172037",
    marginRight: 14,
  },

  welcome: {
    flex: 1,
    minWidth: 0,
  },

  hello: {
    color: COLORS.white,
    fontWeight: "700",
  },

  welcomeText: {
    color: COLORS.white,
    fontSize: 15,
    marginTop: 2,
  },

  notification: {
    borderRadius: 30,
    backgroundColor: COLORS.cyan,
    alignItems: "center",
    justifyContent: "center",
  },

  balance: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },

  balanceItem: {
    flex: 1,
    minWidth: 0,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },

  balanceTitle: {
    color: COLORS.white,
    fontSize: 14,
    marginLeft: 6,
  },

  balanceValue: {
    color: COLORS.white,
    fontWeight: "700",
  },

  expense: {
    color: COLORS.cyan,
    fontWeight: "700",
  },

  divider: {
    width: 2,
    backgroundColor: COLORS.gray,
    marginHorizontal: 12,
  },

  savings: {
    marginBottom: 34,
  },

  progress: {
    height: 45,
    borderRadius: 25,
    backgroundColor: COLORS.darkCyan,
    overflow: "hidden",
    justifyContent: "center",
  },

  progressFill: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: COLORS.cyan,
    borderRadius: 25,
    justifyContent: "center",
    paddingLeft: 25,
  },

  progressText: {
    color: COLORS.white,
  },

  goalAmount: {
    color: COLORS.white,
    position: "absolute",
    right: 28,
  },

  goalText: {
    color: COLORS.white,
    marginTop: 9,
  },

  actions: {
    backgroundColor: COLORS.cyan,
    borderRadius: 38,
    padding: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 34,
  },

  action: {
    width: "48%",
    height: 84,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },

  actionIcon: {
    backgroundColor: COLORS.lightCyan,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },

  actionText: {
    color: COLORS.dark,
    textAlign: "center",
    fontWeight: "600",
  },

  filters: {
    height: 55,
    borderRadius: 30,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    padding: 5,
    marginBottom: 28,
  },

  filter: {
    flex: 1,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },

  activeFilter: {
    backgroundColor: COLORS.cyan,
  },

  filterText: {
    color: COLORS.dark,
    fontSize: 15,
  },

  activeFilterText: {
    fontWeight: "600",
  },

  transaction: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  transactionIcon: {
    backgroundColor: COLORS.cyan,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  transactionInfo: {
    minWidth: 0,
  },

  transactionTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },

  transactionDate: {
    color: COLORS.cyan,
    fontSize: 11,
  },

  transactionDivider: {
    width: 2,
    height: 52,
    backgroundColor: COLORS.darkCyan,
    marginHorizontal: 8,
  },

  transactionType: {
    color: COLORS.white,
    fontSize: 13,
    width: 62,
  },

  amount: {
    flex: 1,
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "right",
  },

  negative: {
    color: COLORS.cyan,
  },

  bottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.cyan,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});