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
  const { width } = useWindowDimensions();

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

    return () => {
      unsubscribeExpenses();
    };
  }, []);

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

  const convertDate = (value) => {
    if (!value) return null;

    if (value?.toDate) {
      const date = value.toDate();

      if (isNaN(date.getTime())) {
        return null;
      }

      return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
    }

    if (value instanceof Date) {
      if (isNaN(value.getTime())) {
        return null;
      }

      return new Date(
        value.getFullYear(),
        value.getMonth(),
        value.getDate()
      );
    }

    if (typeof value === "number") {
      const date = new Date(value);

      if (isNaN(date.getTime())) {
        return null;
      }

      return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
    }

    if (typeof value === "string") {
      const cleanValue = value.trim();

      const months = {
        january: 0,
        february: 1,
        march: 2,
        april: 3,
        may: 4,
        june: 5,
        july: 6,
        august: 7,
        september: 8,
        october: 9,
        november: 10,
        december: 11,
      };

      const monthMatch = cleanValue.match(
        /^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/
      );

      if (monthMatch) {
        const month =
          months[monthMatch[1].toLowerCase()];

        if (month !== undefined) {
          const year = Number(monthMatch[3]);
          const day = Number(monthMatch[2]);

          const date = new Date(
            year,
            month,
            day
          );

          if (
            !isNaN(date.getTime()) &&
            date.getFullYear() === year &&
            date.getMonth() === month &&
            date.getDate() === day
          ) {
            return date;
          }
        }
      }

      const isoMatch = cleanValue.match(
        /^(\d{4})-(\d{1,2})-(\d{1,2})/
      );

      if (isoMatch) {
        const year = Number(isoMatch[1]);
        const month = Number(isoMatch[2]) - 1;
        const day = Number(isoMatch[3]);

        const date = new Date(
          year,
          month,
          day
        );

        if (
          !isNaN(date.getTime()) &&
          date.getFullYear() === year &&
          date.getMonth() === month &&
          date.getDate() === day
        ) {
          return date;
        }
      }

      const slashMatch = cleanValue.match(
        /^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/
      );

      if (slashMatch) {
        const first = Number(slashMatch[1]);
        const second = Number(slashMatch[2]);
        const year = Number(slashMatch[3]);

        let day;
        let month;

        if (first > 12) {
          day = first;
          month = second - 1;
        } else if (second > 12) {
          month = first - 1;
          day = second;
        } else {
          day = first;
          month = second - 1;
        }

        const date = new Date(
          year,
          month,
          day
        );

        if (
          !isNaN(date.getTime()) &&
          date.getFullYear() === year &&
          date.getMonth() === month &&
          date.getDate() === day
        ) {
          return date;
        }

        return null;
      }

      const date = new Date(cleanValue);

      if (!isNaN(date.getTime())) {
        return new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        );
      }
    }

    return null;
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

  const toggleExpense = (id) => {
    setSelectedExpense((current) =>
      current === id ? null : id
    );
  };

  const getExpenseDate = (expense) => {
    return convertDate(expense.date);
  };

  const isInCurrentWeek = (expense) => {
    const expenseDate =
      getExpenseDate(expense);

    if (!expenseDate) {
      return false;
    }

    const today = new Date();

    const currentDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const startOfWeek = new Date(
      currentDate
    );

    const currentDay =
      startOfWeek.getDay();

    const difference =
      currentDay === 0
        ? 6
        : currentDay - 1;

    startOfWeek.setDate(
      startOfWeek.getDate() -
        difference
    );

    const endOfWeek = new Date(
      startOfWeek
    );

    endOfWeek.setDate(
      endOfWeek.getDate() + 7
    );

    return (
      expenseDate.getTime() >=
        startOfWeek.getTime() &&
      expenseDate.getTime() <
        endOfWeek.getTime()
    );
  };

  const isInCurrentMonth = (expense) => {
    const expenseDate =
      getExpenseDate(expense);

    if (!expenseDate) {
      return false;
    }

    const today = new Date();

    return (
      expenseDate.getFullYear() ===
        today.getFullYear() &&
      expenseDate.getMonth() ===
        today.getMonth()
    );
  };

  const weeklyExpenses = expenses.filter(
    (expense) =>
      isInCurrentWeek(expense)
  );

  const monthlyExpenses = expenses.filter(
    (expense) =>
      isInCurrentMonth(expense)
  );

  const renderSection = (
    title,
    icon,
    sectionExpenses
  ) => (
    <View style={styles.section}>
      <View style={styles.sectionTitleContainer}>
        <MaterialCommunityIcons
          name={icon}
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
          {title}
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

      {sectionExpenses.length === 0 ? (
        <Text
          style={[
            styles.emptyText,
            {
              color: colors.secondaryText,
              fontSize: s(14),
            },
          ]}
        >
          {t.noExpensesRegistered}
        </Text>
      ) : (
        sectionExpenses.map((expense) => (
          <ExpenseItem
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
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            colors.primaryBackground,
        },
      ]}
    >
      <View
        style={[
          styles.header,
          {
            height: 118 * scale,
            paddingHorizontal:
              horizontalPadding,
            backgroundColor:
              colors.primaryBackground,
          },
        ]}
      >
        <Text
          pointerEvents="none"
          style={[
            styles.headerTitle,
            {
              fontSize: 25 * scale,
              position: "absolute",
              left: 0,
              right: 0,
              textAlign: "center",
              transform: [
                { translateY: 1 * scale },
              ],
              color: colors.white,
            },
          ]}
          numberOfLines={1}
        >
          {t.expenseManagement}
        </Text>

        <TouchableOpacity
          style={[
            styles.backButton,
            {
              zIndex: 10,
              elevation: 10,
              transform: [
                { translateY: 4 * scale },
              ],
            },
          ]}
          onPress={() =>
            router.replace("/home")
          }
          activeOpacity={0.7}
          hitSlop={{
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
          }}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={35 * scale}
            color={colors.white}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.notification,
            {
              width: 40 * scale,
              height: 40 * scale,
              borderRadius: 20 * scale,
              zIndex: 10,
              elevation: 10,
            },
          ]}
          onPress={() =>
            router.push({
              pathname: "/notifications",
              params: {
                from:
                  "/expensesmanagement",
              },
            })
          }
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="bell-circle-outline"
            size={35 * scale}
            color={colors.white}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={[
          styles.content,
          {
            backgroundColor:
              colors.background,
          },
        ]}
        contentContainerStyle={{
          paddingHorizontal:
            horizontalPadding,
          paddingTop: s(20),
          paddingBottom: s(90),
        }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View
            style={styles.loadingContainer}
          >
            <ActivityIndicator
              size="large"
              color={colors.icon}
            />

            <Text
              style={[
                styles.loadingText,
                {
                  color:
                    colors.secondaryText,
                  fontSize: s(15),
                },
              ]}
            >
              {t.loadingExpenses}
            </Text>
          </View>
        ) : (
          <>
            {renderSection(
              t.expenseHistory,
              "history",
              expenses
            )}

            {renderSection(
              t.weeklyExpenses,
              "calendar-week",
              weeklyExpenses
            )}

            {renderSection(
              t.monthlyExpenses,
              "calendar-month",
              monthlyExpenses
            )}
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
          onPress={() =>
            router.push("/home")
          }
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
          onPress={() =>
            router.push("/historial")
          }
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
          onPress={() =>
            router.push(
              "/expensesmanagement"
            )
          }
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
          onPress={() =>
            router.push("/currentgoal")
          }
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
          onPress={() =>
            router.push("/profile")
          }
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
    selectedExpense === expense.id;

  return (
    <View>
      <TouchableOpacity
        style={styles.expenseRow}
        onPress={() =>
          toggleExpense(expense.id)
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
              backgroundColor:
                colors.icon,
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
            {expense.category ||
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
  const amount =
    Number(expense.amount) || 0;

  const roundedAmount =
    Number(expense.roundedAmount) ||
    amount;

  const savings =
    roundedAmount - amount;

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
        value={
          expense.category ||
          t.notAvailable
        }
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
        label={t.roundedAmount}
        value={formatAmount(roundedAmount)}
        colors={colors}
        s={s}
      />

      <DetailRow
        label={t.savings}
        value={formatAmount(savings)}
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
        label={t.frequency}
        value={
          expense.frequency ||
          t.notAvailable
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
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 30,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  headerTitle: {
    fontWeight: "700",
  },

  notification: {
    alignItems: "center",
    justifyContent: "center",
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