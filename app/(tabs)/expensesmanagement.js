import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useAppSettings } from "../../context/Appsettings";
import { auth, db } from "../../firebaseConfig.js";

export default function ExpenseManagement() {
  const { colors, t } = useAppSettings();
  const { width, height } = useWindowDimensions();

  const isSmallScreen = width < 360;
  const isMediumScreen = width >= 360 && width < 600;
  const isTablet = width >= 600;
  const isLargeScreen = width >= 900;

  const scale = isSmallScreen
    ? 0.85
    : isMediumScreen
    ? 1
    : isTablet
    ? 1.15
    : isLargeScreen
    ? 1.25
    : 1;

  const horizontalPadding = isSmallScreen
    ? 16
    : isMediumScreen
    ? 20
    : isTablet
    ? 35
    : 45;

  const s = (value) => Math.round(value * scale);

  const [expenses, setExpenses] = useState([]);
  const [savings, setSavings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      setLoading(false);
      return;
    }

    const expensesQuery = query(
      collection(db, "Registro de gastos"),
      orderBy("createdAt", "desc")
    );

    const unsubscribeExpenses = onSnapshot(
      expensesQuery,
      (snapshot) => {
        const data = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((expense) => expense.uid === user.uid);

        setExpenses(data);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );

    const savingsQuery = query(collection(db, "Ahorros"));

    const unsubscribeSavings = onSnapshot(
      savingsQuery,
      (snapshot) => {
        const data = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((saving) => saving.uid === user.uid);

        setSavings(data);
      }
    );

    return () => {
      unsubscribeExpenses();
      unsubscribeSavings();
    };
  }, []);

  const weeklyExpenses = expenses.filter(
    (expense) =>
      String(expense.expenseType || "").toLowerCase() === "weekly"
  );

  const unnecessaryExpenses = expenses.filter(
    (expense) =>
      String(expense.expenseType || "").toLowerCase() === "unnecessary"
  );

  const scheduledExpenses = expenses.filter(
    (expense) =>
      String(expense.expenseType || "").toLowerCase() === "monthly" ||
      expense.isRecurrent === true
  );

  const formatAmount = (amount) => {
    const numericAmount = Number(amount) || 0;
    return `$${numericAmount.toFixed(2)}`;
  };

  const getIcon = (category) => {
    const value = String(category || "").toLowerCase();

    if (value.includes("food") || value.includes("comida")) {
      return "fast-food-outline";
    }

    if (
      value.includes("transport") ||
      value.includes("transporte") ||
      value.includes("bus")
    ) {
      return "bus-outline";
    }

    if (
      value.includes("light") ||
      value.includes("electric") ||
      value.includes("electricity") ||
      value.includes("luz")
    ) {
      return "bulb-outline";
    }

    if (value.includes("water") || value.includes("agua")) {
      return "water-outline";
    }

    if (
      value.includes("coffee") ||
      value.includes("drink") ||
      value.includes("cafe")
    ) {
      return "cafe-outline";
    }

    if (
      value.includes("service") ||
      value.includes("servicio")
    ) {
      return "business-outline";
    }

    return "wallet-outline";
  };

  const formatDate = (date) => {
    if (!date) return "";

    if (typeof date === "string") {
      return date;
    }

    if (date?.toDate) {
      return date.toDate().toLocaleDateString(
        t.expenseManagement === "Gestión de gastos"
          ? "es-ES"
          : "en-US",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      );
    }

    return "";
  };

  const toggleExpense = (section, id) => {
    const expenseId = `${section}-${id}`;

    setSelectedExpense((current) =>
      current === expenseId ? null : expenseId
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.primaryBackground,
        },
      ]}
    >
      <View
        style={[
          styles.header,
          {
            height: s(118),
            paddingHorizontal: horizontalPadding,
            backgroundColor: colors.primaryBackground,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.backButton,
            {
              left: s(15),
              top: s(34),
            },
          ]}
          onPress={() => router.replace("/home")}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={s(30)}
            color={colors.white}
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            {
              fontSize: s(25),
              lineHeight: s(29),
              color: colors.white,
            },
          ]}
        >
          {t.expenseManagement}
        </Text>

        <TouchableOpacity
          style={[
            styles.notification,
            {
              right: s(15),
              top: s(34),
              backgroundColor: colors.input,
            },
          ]}
          onPress={() =>
            router.push({
              pathname: "/notifications",
              params: {
                from: "/expensesmanagement",
              },
            })
          }
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="bell-circle-outline"
            size={s(32)}
            color={colors.white}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={[
          styles.content,
          {
            backgroundColor: colors.background,
          },
        ]}
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingTop: s(20),
          paddingBottom: s(90),
        }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={colors.icon}
            />

            <Text
              style={[
                styles.loadingText,
                {
                  color: colors.secondaryText,
                  fontSize: s(15),
                },
              ]}
            >
              {t.loadingExpenses}
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                <MaterialCommunityIcons
                  name="card-outline"
                  size={s(26)}
                  color={colors.icon}
                />

                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color: colors.text,
                      fontSize: s(20),
                    },
                  ]}
                >
                  {t.weeklyExpenses}
                </Text>

                <View
                  style={[
                    styles.line,
                    {
                      backgroundColor:
                        colors.secondaryText,
                    },
                  ]}
                />
              </View>

              {weeklyExpenses.length === 0 ? (
                <Text
                  style={[
                    styles.emptyText,
                    {
                      color: colors.secondaryText,
                      fontSize: s(14),
                    },
                  ]}
                >
                  {t.noWeeklyExpenses}
                </Text>
              ) : (
                weeklyExpenses.map((expense) => (
                  <ExpenseItem
                    key={expense.id}
                    expense={expense}
                    section="weekly"
                    selectedExpense={selectedExpense}
                    toggleExpense={toggleExpense}
                    formatAmount={formatAmount}
                    formatDate={formatDate}
                    getIcon={getIcon}
                    colors={colors}
                    t={t}
                    s={s}
                  />
                ))
              )}
            </View>

            <View style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                <MaterialCommunityIcons
                  name="coins-outline"
                  size={s(26)}
                  color={colors.icon}
                />

                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color: colors.text,
                      fontSize: s(20),
                    },
                  ]}
                >
                  {t.unnecessaryExpenses}
                </Text>

                <View
                  style={[
                    styles.line,
                    {
                      backgroundColor:
                        colors.secondaryText,
                    },
                  ]}
                />
              </View>

              {unnecessaryExpenses.length === 0 ? (
                <Text
                  style={[
                    styles.emptyText,
                    {
                      color: colors.secondaryText,
                      fontSize: s(14),
                    },
                  ]}
                >
                  {t.noUnnecessaryExpenses}
                </Text>
              ) : (
                unnecessaryExpenses.map((expense) => (
                  <ExpenseItem
                    key={expense.id}
                    expense={expense}
                    section="unnecessary"
                    selectedExpense={selectedExpense}
                    toggleExpense={toggleExpense}
                    formatAmount={formatAmount}
                    formatDate={formatDate}
                    getIcon={getIcon}
                    colors={colors}
                    t={t}
                    s={s}
                  />
                ))
              )}
            </View>

            <View style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                <MaterialCommunityIcons
                  name="calendar-outline"
                  size={s(26)}
                  color={colors.icon}
                />

                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color: colors.text,
                      fontSize: s(20),
                    },
                  ]}
                >
                  {t.scheduledExpenses}
                </Text>

                <View
                  style={[
                    styles.line,
                    {
                      backgroundColor:
                        colors.secondaryText,
                    },
                  ]}
                />
              </View>

              {scheduledExpenses.length === 0 ? (
                <Text
                  style={[
                    styles.emptyText,
                    {
                      color: colors.secondaryText,
                      fontSize: s(14),
                    },
                  ]}
                >
                  {t.noScheduledExpenses}
                </Text>
              ) : (
                scheduledExpenses.map((expense) => (
                  <ScheduledExpense
                    key={expense.id}
                    expense={expense}
                    selectedExpense={selectedExpense}
                    toggleExpense={toggleExpense}
                    formatAmount={formatAmount}
                    formatDate={formatDate}
                    getIcon={getIcon}
                    colors={colors}
                    t={t}
                    s={s}
                  />
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>

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
            backgroundColor: colors.nav,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/home")}
          activeOpacity={0.8}
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
            color={colors.white}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/historial")}
          activeOpacity={0.8}
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
            color={colors.white}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/expensesmanagement")}
          activeOpacity={0.8}
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
            color={colors.white}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/currentgoal")}
          activeOpacity={0.8}
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
            color={colors.white}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => router.push("/profile")}
          activeOpacity={0.8}
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
            color={colors.white}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ExpenseItem({
  expense,
  section,
  selectedExpense,
  toggleExpense,
  formatAmount,
  formatDate,
  getIcon,
  colors,
  t,
  s,
}) {
  const isSelected =
    selectedExpense === `${section}-${expense.id}`;

  return (
    <View>
      <TouchableOpacity
        style={styles.expenseRow}
        onPress={() => toggleExpense(section, expense.id)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.expenseIcon,
            {
              width: s(43),
              height: s(43),
              borderRadius: s(12),
              backgroundColor: colors.icon,
            },
          ]}
        >
          <Ionicons
            name={getIcon(expense.category)}
            size={s(23)}
            color={colors.white}
          />
        </View>

        <View style={styles.expenseInfo}>
          <Text
            style={[
              styles.expenseName,
              {
                color: colors.text,
                fontSize: s(15),
              },
            ]}
            numberOfLines={1}
          >
            {expense.description ||
              expense.category ||
              t.expenseType}
          </Text>

          <Text
            style={[
              styles.date,
              {
                color: colors.icon,
                fontSize: s(12),
              },
            ]}
          >
            {formatDate(expense.date)}
          </Text>
        </View>

        <Text
          style={[
            styles.amount,
            {
              color: colors.icon,
              fontSize: s(16),
            },
          ]}
        >
          {formatAmount(expense.amount)}
        </Text>
      </TouchableOpacity>

      {isSelected && (
        <ExpenseDetails
          expense={expense}
          formatAmount={formatAmount}
          formatDate={formatDate}
          colors={colors}
          t={t}
          s={s}
        />
      )}
    </View>
  );
}

function ScheduledExpense({
  expense,
  selectedExpense,
  toggleExpense,
  formatAmount,
  formatDate,
  getIcon,
  colors,
  t,
  s,
}) {
  const isSelected =
    selectedExpense === `scheduled-${expense.id}`;

  return (
    <View>
      <TouchableOpacity
        style={styles.expenseRow}
        onPress={() =>
          toggleExpense("scheduled", expense.id)
        }
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.expenseIcon,
            {
              width: s(43),
              height: s(43),
              borderRadius: s(12),
              backgroundColor: colors.icon,
            },
          ]}
        >
          <Ionicons
            name={getIcon(expense.category)}
            size={s(23)}
            color={colors.white}
          />
        </View>

        <View style={styles.expenseInfo}>
          <Text
            style={[
              styles.expenseName,
              {
                color: colors.text,
                fontSize: s(15),
              },
            ]}
            numberOfLines={1}
          >
            {expense.description ||
              expense.category ||
              t.expenseType}
          </Text>

          <Text
            style={[
              styles.date,
              {
                color: colors.icon,
                fontSize: s(12),
              },
            ]}
          >
            {formatDate(expense.date)}
          </Text>
        </View>

        <Text
          style={[
            styles.amount,
            {
              color: colors.icon,
              fontSize: s(16),
            },
          ]}
        >
          {formatAmount(expense.amount)}
        </Text>
      </TouchableOpacity>

      {isSelected && (
        <ExpenseDetails
          expense={expense}
          formatAmount={formatAmount}
          formatDate={formatDate}
          colors={colors}
          t={t}
          s={s}
        />
      )}
    </View>
  );
}

function ExpenseDetails({
  expense,
  formatAmount,
  formatDate,
  colors,
  t,
  s,
}) {
  return (
    <View
      style={[
        styles.detailsContainer,
        {
          backgroundColor: colors.input,
          padding: s(15),
          borderRadius: s(12),
        },
      ]}
    >
      <DetailRow
        label={t.amount}
        value={formatAmount(expense.amount)}
        colors={colors}
        s={s}
      />

      <DetailRow
        label={t.category}
        value={expense.category || t.notAvailable}
        colors={colors}
        s={s}
      />

      <DetailRow
        label={t.date}
        value={
          formatDate(expense.date) ||
          t.notAvailable
        }
        colors={colors}
        s={s}
      />

      <DetailRow
        label={t.description}
        value={
          expense.description ||
          t.notAvailable
        }
        colors={colors}
        s={s}
      />

      <DetailRow
        label={t.roundedAmount}
        value={formatAmount(expense.roundingAmount)}
        colors={colors}
        s={s}
      />

      <DetailRow
        label={t.expenseType}
        value={
          expense.expenseType ||
          t.notAvailable
        }
        colors={colors}
        s={s}
      />

      <DetailRow
        label={t.recurring}
        value={
          expense.isRecurrent
            ? t.yes
            : t.no
        }
        colors={colors}
        s={s}
      />
    </View>
  );
}

function DetailRow({
  label,
  value,
  colors,
  s,
}) {
  return (
    <View style={styles.detailRow}>
      <Text
        style={[
          styles.detailLabel,
          {
            color: colors.secondaryText,
            fontSize: s(13),
          },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.detailValue,
          {
            color: colors.text,
            fontSize: s(13),
          },
        ]}
        numberOfLines={2}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  backButton: {
    position: "absolute",
    width: 55,
    height: 55,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    elevation: 10,
  },

  headerTitle: {
    flex: 1,
    fontWeight: "700",
    textAlign: "center",
    transform: [
      {
        translateX: 3,
      },
      {
        translateY: 7,
      },
    ],
  },

  notification: {
    position: "absolute",
    width: 55,
    height: 55,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    elevation: 10,
  },

  content: {
    flex: 1,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    overflow: "hidden",
  },

  section: {
    width: "100%",
    marginBottom: 30,
  },

  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  sectionTitle: {
    fontWeight: "400",
    flexShrink: 1,
    marginLeft: 10,
  },

  line: {
    height: 1,
    flex: 1,
    marginLeft: 12,
  },

  expenseRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  expenseIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  expenseInfo: {
    flex: 1,
    marginRight: 8,
  },

  expenseName: {
    fontWeight: "400",
    marginBottom: 3,
  },

  amount: {
    fontWeight: "700",
    textAlign: "right",
  },

  date: {
    flexShrink: 1,
  },

  emptyText: {
    marginTop: 4,
    paddingLeft: 5,
  },

  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },

  loadingText: {
    marginTop: 12,
  },

  detailsContainer: {
    marginTop: 5,
    marginBottom: 10,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
  },

  detailLabel: {
    width: "40%",
    fontWeight: "600",
  },

  detailValue: {
    flex: 1,
    fontWeight: "400",
    textAlign: "right",
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

  navButton: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});