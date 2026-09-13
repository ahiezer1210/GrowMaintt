import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

export default function ExpenseManagement() {
  const { width, height } = useWindowDimensions();

  const tablet = width >= 600;
  const landscape = width > height;

  const scale = tablet
    ? landscape
      ? Math.min(width / 700, height / 430) * 1.15
      : Math.min(width / 520, height / 760) * 1.15
    : Math.min(width / 330, height / 700);

  const safeScale = Math.max(scale, 1);
  const size = (value) => Math.round(value * safeScale);

  const weeklyExpenses = [
    {
      name: "Food",
      amount: "$20",
      icon: "fast-food-outline",
    },
    {
      name: "Transport",
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
    <View style={styles.container}>

      {/* HEADER */}
      <View
        style={[
          styles.header,
          {
            height: size(130),
            paddingHorizontal: size(15),
            marginTop: size(30),
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={35 * safeScale}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text
            style={[
              styles.headertitle,
              {
                fontSize: size(25),
              },
            ]}
            numberOfLines={2}
          >
            Expense Management
          </Text>
        </View>

        <TouchableOpacity
          style={styles.headerBell}
          onPress={() =>
            router.push({
              pathname: "/notifications",
              params: {
                from: "/ExpensesManagement",
              },
            })
          }
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="bell-circle-outline"
            size={35 * safeScale}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      {/* WHITE CARD */}
      <ScrollView
        style={[
          styles.content,
          {
            borderTopLeftRadius: size(35),
            borderTopRightRadius: size(35),
            paddingHorizontal: size(20),
          },
        ]}
        contentContainerStyle={{
          paddingTop: size(12),
          paddingBottom: size(100),
        }}
        showsVerticalScrollIndicator={false}
      >

        {/* WEEKLY EXPENSES */}
        <View
          style={[
            styles.section,
            {
              marginBottom: size(10),
            },
          ]}
        >
          <View
            style={[
              styles.sectionTitleContainer,
              {
                height: size(35),
              },
            ]}
          >
            <Ionicons
              name="card-outline"
              size={size(30)}
              color="#0E2738"
            />

            <Text
              style={[
                styles.sectiontitle,
                {
                  fontSize: size(24),
                  marginLeft: size(6),
                },
              ]}
            >
              Weekly expenses
            </Text>
          </View>

          <View
            style={[
              styles.line,
              {
                marginTop: size(12),
                marginBottom: size(5),
              },
            ]}
          />

          {weeklyExpenses.map((expense, index) => (
            <ExpenseItem
              key={index}
              name={expense.name}
              amount={expense.amount}
              icon={expense.icon}
              size={size}
            />
          ))}
        </View>

        {/* UNNECESSARY EXPENSES */}
        <View
          style={[
            styles.section,
            {
              marginBottom: size(10),
            },
          ]}
        >
          <View
            style={[
              styles.sectionTitleContainer,
              {
                height: size(35),
              },
            ]}
          >
            <Ionicons
              name="coins-outline"
              size={size(30)}
              color="#0E2738"
            />

            <Text
              style={[
                styles.sectiontitle,
                {
                  fontSize: size(24),
                  marginLeft: size(6),
                },
              ]}
            >
              Unnecessary expenses
            </Text>
          </View>

          <View
            style={[
              styles.line,
              {
                marginTop: size(12),
                marginBottom: size(5),
              },
            ]}
          />

          {unnecesaryExpenses.map((expense, index) => (
            <ExpenseItem
              key={index}
              name={expense.name}
              amount={expense.amount}
              icon={expense.icon}
              size={size}
            />
          ))}
        </View>

        {/* SCHEDULED EXPENSES */}
        <View
          style={[
            styles.section,
            {
              marginBottom: size(10),
            },
          ]}
        >
          <View
            style={[
              styles.sectionTitleContainer,
              {
                height: size(35),
              },
            ]}
          >
            <Ionicons
              name="calendar-outline"
              size={size(30)}
              color="#0E2738"
            />

            <Text
              style={[
                styles.sectiontitle,
                {
                  fontSize: size(24),
                  marginLeft: size(6),
                },
              ]}
            >
              Scheduled expenses
            </Text>
          </View>

          <View
            style={[
              styles.line,
              {
                marginTop: size(12),
                marginBottom: size(5),
              },
            ]}
          />

          {scheduledExpenses.map((expense, index) => (
            <ScheduledExpense
              key={index}
              name={expense.name}
              date={expense.date}
              amount={expense.amount}
              icon={expense.icon}
              size={size}
            />
          ))}
        </View>
      </ScrollView>

      {/* BOTTOM NAVIGATION */}
      <BottomNav scale={safeScale} />
    </View>
  );
}

function ExpenseItem({ name, amount, icon, size }) {
  return (
    <View
      style={[
        styles.expenseRow,
        {
          minHeight: size(45),
        },
      ]}
    >
      <View
        style={[
          styles.expenseIcon,
          {
            width: size(45),
            height: size(40),
            borderRadius: size(16),
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={size(28)}
          color="#FFFFFF"
        />
      </View>

      <Text
        style={[
          styles.expensename,
          {
            marginLeft: size(9),
            fontSize: size(15),
          },
        ]}
      >
        {name}
      </Text>

      <Text
        style={[
          styles.amount,
          {
            fontSize: size(14),
            minWidth: size(35),
          },
        ]}
      >
        {amount}
      </Text>
    </View>
  );
}

function ScheduledExpense({
  name,
  date,
  amount,
  icon,
  size,
}) {
  return (
    <View
      style={[
        styles.expenseRow,
        {
          minHeight: size(45),
        },
      ]}
    >
      <View
        style={[
          styles.expenseIcon,
          {
            width: size(45),
            height: size(40),
            borderRadius: size(16),
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={size(28)}
          color="#FFFFFF"
        />
      </View>

      <Text
        style={[
          styles.expensename,
          {
            marginLeft: size(9),
            fontSize: size(15),
          },
        ]}
      >
        {name}
      </Text>

      <Text
        style={[
          styles.date,
          {
            fontSize: size(11),
            marginRight: size(18),
          },
        ]}
      >
        {date}
      </Text>

      <Text
        style={[
          styles.amount,
          {
            fontSize: size(14),
            minWidth: size(35),
          },
        ]}
      >
        {amount}
      </Text>
    </View>
  );
}

function BottomNav({ scale }) {
  const NAV = [
    ["home-outline", "/home"],
    ["chart-box-outline", "/historial"],
    ["swap-horizontal", "/expensesManagement"],
    ["layers-outline", "/currentgoal"],
    ["account-outline", "/profile"],
  ];

  return (
    <View
      style={[
        styles.bottomBar,
        {
          height: 65 * scale,
          borderTopLeftRadius: 78 * scale,
        },
      ]}
    >
      {NAV.map(([icon, route], index) => (
        <TouchableOpacity
          key={index}
          style={styles.navItem}
          onPress={() => router.push(route)}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name={icon}
            size={
              icon === "swap-horizontal"
                ? 37 * scale
                : 35 * scale
            }
            color="#FFFFFF"
          />
        </TouchableOpacity>
      ))}
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
    backgroundColor: "#081023",
  },

  backButton: {
    width: 50,
    justifyContent: "center",
  },

  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  headertitle: {
    color: "#FFFFFF",
    fontWeight: "400",
    textAlign: "center",
  },

  headerBell: {
    width: 50,
    justifyContent: "center",
    alignItems: "flex-end",
  },

  content: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },

  section: {},

  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  sectiontitle: {
    color: "#172128",
    fontWeight: "400",
  },

  line: {
    height: 1,
    backgroundColor: "#777777",
    width: "100%",
  },

  expenseRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  expenseIcon: {
    backgroundColor: "#24B6D1",
    justifyContent: "center",
    alignItems: "center",
  },

  expensename: {
    flex: 1,
    color: "#26313B",
    fontWeight: "400",
  },

  amount: {
    color: "#0066FF",
    fontWeight: "700",
    textAlign: "right",
  },

  date: {
    color: "#0066FF",
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#25B7D3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    overflow: "hidden",
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});