import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";

export default function ExpenseManagement() {
  const { width, height } = useWindowDimensions();

  const isSmallScreen = width < 360;
  const isMediumScreen = width >= 360 && width < 600;
  const isTablet = width >= 600;

  const scale = isSmallScreen
    ? 0.85
    : isMediumScreen
      ? 1
      : isTablet
        ? 1.18
        : 1.25;

  const s = (value) => Math.round(value * scale);

  const horizontalPadding = isSmallScreen ? 16 : isMediumScreen ? 20 : 35;

  const weeklyExpenses = [
    {
      name: "Food",
      amount: "$20",
      icon: "fast-food-outline",
    },
    {
      name: "transport",
      amount: "$10",
      icon: "bus-outline",
    },
    {
      name: "Basic services",
      amount: "$20",
      icon: "business-outline",
    },
  ];

  const unnecesaryExpenses = [
    {
      name: "Coffee and drinks",
      amount: "$5",
      icon: "cafe-outline",
    },
  ];

  const scheduledExpenses = [
    {
      name: "Light",
      date: "10 July",
      amount: "$18",
      icon: "bulb-outline",
    },
    {
      name: "Water",
      date: "15 July",
      amount: "$12",
      icon: "water-outline",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={[
            styles.header,
            {
              height: s(110),
              paddingHorizontal: horizontalPadding,
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
              styles.headertitle,
              {
                fontSize: s(24),
                lineHeight: s(26),
              },
            ]}
          >
            Expense{"\n"}Management
          </Text>

          <TouchableOpacity
            style={[
              styles.notification,
              {
                width: s(34),
                height: s(34),
                borderRadius: s(17),
              },
            ]}
            onPress={() => router.push("/notifications")}
          >
            <Ionicons
              name="notifications-outline"
              size={s(22)}
              color="#0E2738"
            />
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.card,
            {
              borderTopLeftRadius: s(35),
              borderTopRightRadius: s(35),
            },
          ]}
        >
          <ScrollView
            style={styles.whiteScroll}
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingHorizontal: horizontalPadding,
                paddingTop: s(20),
                paddingBottom: s(110), 
              },
            ]}
            showsVerticalScrollIndicator={false}
            alwaysBounceVertical={true}
            overScrollMode="always"
          >
            <View style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons
                  name="card-outline"
                  size={s(28)}
                  color="#0E2738"
                />
                <Text style={[styles.sectiontitle, { fontSize: s(22) }]}>
                  Weekly expenses
                </Text>
              </View>
              <View style={styles.line} />
              {weeklyExpenses.map((expense, index) => (
                <ExpenseItem
                  key={index}
                  name={expense.name}
                  amount={expense.amount}
                  icon={expense.icon}
                  s={s}
                />
              ))}
            </View>

            <View style={[styles.section, { marginTop: s(15) }]}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons
                  name="coins-outline"
                  size={s(28)}
                  color="#0E2738"
                />
                <Text style={[styles.sectiontitle, { fontSize: s(22) }]}>
                  Unnecesary expenses
                </Text>
              </View>
              <View style={styles.line} />
              {unnecesaryExpenses.map((expense, index) => (
                <ExpenseItem
                  key={index}
                  name={expense.name}
                  amount={expense.amount}
                  icon={expense.icon}
                  s={s}
                />
              ))}
            </View>

            <View style={[styles.section, { marginTop: s(15) }]}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons
                  name="calendar-outline"
                  size={s(28)}
                  color="#0E2738"
                />
                <Text style={[styles.sectiontitle, { fontSize: s(22) }]}>
                  Scheduled expenses
                </Text>
              </View>
              <View style={styles.line} />
              {scheduledExpenses.map((expense, index) => (
                <ScheduledExpense
                  key={index}
                  name={expense.name}
                  date={expense.date}
                  amount={expense.amount}
                  icon={expense.icon}
                  s={s}
                />
              ))}
            </View>
          </ScrollView>

          <View
            style={[
              styles.bottomBar,
              {
                height: s(65),
                borderTopLeftRadius: s(78),
              },
            ]}
          >
            <TouchableOpacity onPress={() => router.push("/home")}>
              <Ionicons
                name="home-outline"
                size={s(27)}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/historial")}>
              <Ionicons
                name="bar-chart-outline"
                size={s(27)}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/ExpensesManagement")}
            >
              <Ionicons
                name="swap-horizontal-outline"
                size={s(27)}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/currentgoal")}>
              <Ionicons
                name="layers-outline"
                size={s(27)}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/Profile")}>
              <Ionicons
                name="person-outline"
                size={s(27)}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ExpenseItem({ name, amount, icon, s }) {
  return (
    <View style={[styles.expenseRow, { minHeight: s(46), marginVertical: s(4) }]}>
      <View
        style={[
          styles.expenseIcon,
          {
            width: s(42),
            height: s(38),
            borderRadius: s(14),
          },
        ]}
      >
        <Ionicons name={icon} size={s(24)} color="#FFFFFF" />
      </View>
      <Text style={[styles.expensename, { fontSize: s(15), marginLeft: s(10) }]}>
        {name}
      </Text>
      <Text style={[styles.amount, { fontSize: s(15), minWidth: s(45) }]}>
        {amount}
      </Text>
    </View>
  );
}

function ScheduledExpense({ name, date, amount, icon, s }) {
  return (
    <View style={[styles.expenseRow, { minHeight: s(46), marginVertical: s(4) }]}>
      <View
        style={[
          styles.expenseIcon,
          {
            width: s(42),
            height: s(38),
            borderRadius: s(14),
          },
        ]}
      >
        <Ionicons name={icon} size={s(24)} color="#FFFFFF" />
      </View>
      <Text style={[styles.expensename, { fontSize: s(15), marginLeft: s(10) }]}>
        {name}
      </Text>
      <Text style={[styles.date, { fontSize: s(12), marginRight: s(15) }]}>
        {date}
      </Text>
      <Text style={[styles.amount, { fontSize: s(15), minWidth: s(45) }]}>
        {amount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#081023",
  },
  header: {
    width: "100%",
    backgroundColor: "#081023",
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headertitle: {
    flex: 1,
    color: "#FFFFFF",
    fontWeight: "600",
    textAlign: "center",
  },
  notification: {
    backgroundColor: "#D8F2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    overflow: "hidden", 
  },
  whiteScroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 35,
  },
  sectiontitle: {
    color: "#172128",
    fontWeight: "600",
    marginLeft: 8,
  },
  line: {
    height: 1,
    backgroundColor: "#E0E0E0",
    width: "100%",
    marginTop: 8,
    marginBottom: 8,
  },
  expenseRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  expenseIcon: {
    backgroundColor: "#25B5D1",
    justifyContent: "center",
    alignItems: "center",
  },
  expensename: {
    flex: 1,
    color: "#26313b",
    fontWeight: "400",
  },
  amount: {
    color: "#25B7D3",
    fontWeight: "700",
    textAlign: "right",
  },
  date: {
    color: "#25B7D3",
    fontWeight: "500",
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
});