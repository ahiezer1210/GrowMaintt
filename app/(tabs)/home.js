import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppSettings } from "../../context/Appsettings";
import { usePeriods } from "../../context/PeriodContext.js";
import { auth, db } from "../../firebaseConfig";

const COLORS = {
  cyan: "#25B7D3",
  dark: "#081023",
  white: "#FFFFFF",
  gray: "#ACADAD",
  lightCyan: "#E9F9FC",
  darkCyan: "#173448",
};

const ACTIONS = [
  ["card-outline", "registerExpenses", "ion", "/registerexpenses"],
  ["book-outline", "createGoals", "ion", "/registergoals"],
  ["trending-up-outline", "investments", "ion", "/investments"],
  ["hand-coin-outline", "pointsExchange", "material", "/pointsExchange"],
  ["cash-outline", "registerInvestments", "ion", "/registerinvestments"],
  ["history", "redemptionHistory", "material", "/redemption_history"],
];

const NAV = [
  ["home-outline", "/home"],
  ["chart-box-outline", "/historial"],
  ["swap-horizontal", "/expensesmanagement"],
  ["layers-outline", "/currentgoal"],
  ["account-outline", "/profile"],
];

const getField = (item, fields) => {
  for (const field of fields) {
    if (item && item[field] !== undefined && item[field] !== null) {
      return item[field];
    }
  }

  return null;
};

const convertDate = (value) => {
  if (!value) return null;

  if (value?.toDate) {
    const date = value.toDate();

    return isNaN(date.getTime()) ? null : date;
  }

  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "number") {
    const date = new Date(value);

    return isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === "string") {
    const cleanValue = value.trim().toLowerCase();

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

    let match = cleanValue.match(
      /^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/
    );

    if (match) {
      const day = Number(match[1]);
      const month = months[match[2]];
      const year = Number(match[3]);

      if (month !== undefined) {
        const date = new Date(
          year,
          month,
          day,
          0,
          0,
          0,
          0
        );

        return isNaN(date.getTime()) ? null : date;
      }
    }

    match = cleanValue.match(
      /^([a-z]+)\s+(\d{1,2}),?\s+(\d{4})$/
    );

    if (match) {
      const month = months[match[1]];
      const day = Number(match[2]);
      const year = Number(match[3]);

      if (month !== undefined) {
        const date = new Date(
          year,
          month,
          day,
          0,
          0,
          0,
          0
        );

        return isNaN(date.getTime()) ? null : date;
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
        day = second;
        month = first - 1;
      }

      const date = new Date(
        year,
        month,
        day,
        0,
        0,
        0,
        0
      );

      return isNaN(date.getTime()) ? null : date;
    }

    const parsed = new Date(value);

    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return null;
};

const getRecordsFromDocument = (data) => {
  if (!data) return [];

  const possibleArrays = [
    "records",
    "registros",
    "expenses",
    "gastos",
    "savings",
    "ahorros",
    "transactions",
    "movements",
    "items",
    "data",
  ];

  for (const field of possibleArrays) {
    if (Array.isArray(data[field])) {
      return data[field];
    }
  }

  const possibleCategoryFields = [
    "category",
    "categoria",
    "Category",
    "Categoria",
    "name",
    "nombre",
  ];

  const possibleAmountFields = [
    "amount",
    "monto",
    "Amount",
    "Monto",
    "value",
    "valor",
  ];

  const hasCategory = possibleCategoryFields.some(
    (field) => data[field] !== undefined && data[field] !== null
  );

  const hasAmount = possibleAmountFields.some(
    (field) => data[field] !== undefined && data[field] !== null
  );

  if (hasCategory || hasAmount) {
    return [data];
  }

  return [];
};

const normalizeRecord = (item, type) => {
  const category =
    getField(item, [
      "category",
      "categoria",
      "Category",
      "Categoria",
      "name",
      "nombre",
    ]) || "Other";

  const amount =
    getField(item, [
      "amount",
      "monto",
      "Amount",
      "Monto",
      "value",
      "valor",
    ]) ?? 0;

  const dateValue = getField(item, [
    "date",
    "fecha",
    "Date",
    "Fecha",
  ]);

  const createdAtValue = getField(item, [
    "createdAt",
    "timestamp",
  ]);

  const date =
    convertDate(dateValue) ||
    convertDate(createdAtValue);

  let dateText = "No date";

  if (dateValue) {
    dateText = String(dateValue);
  } else if (date) {
    dateText = date.toLocaleDateString();
  }

  const frequency = getField(item, [
    "frequency",
    "Frequency",
    "FREQUENCY",
    "period",
    "periodo",
  ]);

  return {
    category: String(category),
    amount: Number(amount) || 0,
    date,
    dateText,
    type,
    frequency: frequency
      ? String(frequency)
      : null,
  };
};

const formatMoney = (amount) => {
  const number = Number(amount) || 0;

  return `$${number.toFixed(2)}`;
};

const getIcon = (category, type) => {
  const value = String(category || "").toLowerCase();

  if (type === "Savings") {
    return "wallet-outline";
  }

  if (
    value.includes("food") ||
    value.includes("restaurant") ||
    value.includes("comida")
  ) {
    return "restaurant-outline";
  }

  if (
    value.includes("transport") ||
    value.includes("transporte") ||
    value.includes("bus") ||
    value.includes("taxi") ||
    value.includes("gas")
  ) {
    return "bus-outline";
  }

  if (
    value.includes("shopping") ||
    value.includes("purchase") ||
    value.includes("compr")
  ) {
    return "bag-outline";
  }

  if (
    value.includes("home") ||
    value.includes("rent") ||
    value.includes("house") ||
    value.includes("hogar")
  ) {
    return "home-outline";
  }

  if (
    value.includes("education") ||
    value.includes("school") ||
    value.includes("educación")
  ) {
    return "school-outline";
  }

  return "card-outline";
};

export default function App() {
  const { selectedPeriods } = usePeriods();

  const { t } = useAppSettings();

  const [period, setPeriod] = useState("Monthly");

  const [hasNotification, setHasNotification] =
    useState(false);

  const [username, setUsername] = useState("User");

  const [profilePhoto, setProfilePhoto] =
    useState(null);

  const [records, setRecords] = useState([]);

  const { width } = useWindowDimensions();

  const isSmallScreen = width < 360;
  const isMediumScreen =
    width >= 360 && width < 600;
  const isTablet = width >= 600;

  const scale = isSmallScreen
    ? 0.85
    : isMediumScreen
    ? 1
    : isTablet
    ? 1.15
    : 1;

  const horizontalPadding = isSmallScreen
    ? 18
    : isMediumScreen
    ? 25
    : isTablet
    ? 45
    : 60;

  const s = (size) =>
    Math.round(size * scale);

  const availablePeriods = selectedPeriods.map(
    (item) =>
      item.charAt(0).toUpperCase() +
      item.slice(1).toLowerCase()
  );

  useEffect(() => {
    if (
      availablePeriods.length > 0 &&
      !availablePeriods.includes(period)
    ) {
      setPeriod(availablePeriods[0]);
    }
  }, [selectedPeriods]);

  useEffect(() => {
    let listeners = [];

    const clearListeners = () => {
      listeners.forEach((unsubscribe) =>
        unsubscribe()
      );

      listeners = [];
    };

    const unsubscribeAuth =
      onAuthStateChanged(auth, (user) => {
        clearListeners();

        if (!user) {
          setUsername("User");
          setProfilePhoto(null);
          setRecords([]);
          setHasNotification(false);
          return;
        }

        const userRef = doc(
          db,
          "Users",
          user.uid
        );

        listeners.push(
          onSnapshot(
            userRef,
            (userSnap) => {
              if (userSnap.exists()) {
                const userData =
                  userSnap.data();

                setUsername(
                  userData.username || "User"
                );

                setProfilePhoto(
                  userData.photoURL || null
                );
              } else {
                setUsername("User");
                setProfilePhoto(null);
              }
            },
            (error) => {
              console.log(
                "Error loading user data:",
                error
              );
            }
          )
        );

        let expensesRecords = [];
        let savingsRecords = [];

        const updateRecords = () => {
          const allRecords = [
            ...expensesRecords,
            ...savingsRecords,
          ].sort((a, b) => {
            if (!a.date && !b.date)
              return 0;

            if (!a.date) return 1;

            if (!b.date) return -1;

            return (
              b.date.getTime() -
              a.date.getTime()
            );
          });

          setRecords(allRecords);
        };

        listeners.push(
          onSnapshot(
            collection(
              db,
              "Registro de gastos"
            ),
            (snapshot) => {
              expensesRecords = [];

              snapshot.docs.forEach(
                (document) => {
                  const documentData =
                    document.data();

                  if (
                    documentData.uid !==
                    user.uid
                  ) {
                    return;
                  }

                  const expenseDate =
                    convertDate(
                      documentData.date
                    ) ||
                    convertDate(
                      documentData.fecha
                    ) ||
                    convertDate(
                      documentData.createdAt
                    ) ||
                    convertDate(
                      documentData.timestamp
                    );

                  expensesRecords.push({
                    category:
                      documentData.category ||
                      "Other",

                    amount:
                      Number(
                        documentData.amount
                      ) || 0,

                    date: expenseDate,

                    dateText:
                      documentData.date ||
                      documentData.fecha ||
                      (expenseDate
                        ? expenseDate.toLocaleDateString()
                        : "No date"),

                    type: "Expense",

                    frequency:
                      documentData.frequency ||
                      null,
                  });
                }
              );

              updateRecords();
            },
            (error) => {
              console.log(
                "Error loading expenses:",
                error
              );
            }
          )
        );

        listeners.push(
          onSnapshot(
            collection(db, "Ahorros"),
            (snapshot) => {
              savingsRecords = [];

              snapshot.docs.forEach(
                (document) => {
                  const documentData =
                    document.data();

                  if (
                    documentData.uid !==
                    user.uid
                  ) {
                    return;
                  }

                  const items =
                    getRecordsFromDocument(
                      documentData
                    );

                  items.forEach((item) => {
                    savingsRecords.push(
                      normalizeRecord(
                        item,
                        "Savings"
                      )
                    );
                  });
                }
              );

              updateRecords();
            },
            (error) => {
              console.log(
                "Error loading savings:",
                error
              );
            }
          )
        );

        listeners.push(
          onSnapshot(
            collection(
              db,
              "Users",
              user.uid,
              "securityAlerts"
            ),
            (snapshot) => {
              const hasUnread =
                snapshot.docs.some(
                  (item) =>
                    item.data().read !==
                    true
                );

              setHasNotification(
                hasUnread
              );
            },
            () => {
              setHasNotification(false);
            }
          )
        );
      });

    return () => {
      clearListeners();
      unsubscribeAuth();
    };
  }, []);

  const selectedPeriod = String(period || "")
    .trim()
    .toLowerCase();

  const filteredRecords = records
    .filter((record) => {
      const recordPeriod = String(
        record.frequency || ""
      )
        .trim()
        .toLowerCase();

      return recordPeriod === selectedPeriod;

    })
    .sort((a, b) => {
      if (!a.date && !b.date)
        return 0;

      if (!a.date) return 1;

      if (!b.date) return -1;

      return (
        b.date.getTime() -
        a.date.getTime()
      );
    });

  const totalSavings = filteredRecords
    .filter(
      (record) =>
        record.type === "Savings"
    )
    .reduce(
      (total, record) =>
        total +
        Math.abs(record.amount),
      0
    );

  const totalExpenses = filteredRecords
    .filter(
      (record) =>
        record.type === "Expense"
    )
    .reduce(
      (total, record) =>
        total +
        Math.abs(record.amount),
      0
    );

  const totalMoney =
    totalSavings + totalExpenses;

  const savingsPercentage =
    totalMoney > 0
      ? Math.round(
          (totalSavings /
            totalMoney) *
            100
        )
      : 0;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.dark}
      />

      <View style={styles.app}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            {
              paddingHorizontal:
                horizontalPadding,
              paddingTop: s(24),
              paddingBottom: s(125),
            },
          ]}
        >
          <Header
            small={isSmallScreen}
            scale={scale}
            s={s}
            hasNotification={
              hasNotification
            }
            username={username}
            profilePhoto={profilePhoto}
            t={t}
          />

          <Balance
            savings={totalSavings}
            expenses={totalExpenses}
            small={isSmallScreen}
            scale={scale}
            s={s}
            t={t}
          />

          <Savings
            savings={totalSavings}
            percentage={
              savingsPercentage
            }
            scale={scale}
            s={s}
            t={t}
          />

          <Actions
            scale={scale}
            s={s}
            t={t}
          />

          <View
            style={[
              styles.filters,
              {
                minHeight: s(55),
                borderRadius: s(30),
                padding: s(5),
                marginBottom: s(28),
              },
            ]}
          >
            {availablePeriods.map(
              (item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() =>
                    setPeriod(item)
                  }
                  style={[
                    styles.filter,
                    {
                      borderRadius:
                        s(25),
                      minHeight: s(45),
                    },
                    period === item &&
                      styles.activeFilter,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      {
                        fontSize: s(15),
                      },
                      period === item &&
                        styles.activeFilterText,
                    ]}
                  >
                    {getPeriodLabel(
                      item,
                      t
                    )}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>

          {filteredRecords.length >
          0 ? (
            filteredRecords.map(
              (item, index) => (
                <Transaction
                  key={`${item.type}-${index}`}
                  data={item}
                  small={isSmallScreen}
                  s={s}
                  t={t}
                />
              )
            )
          ) : (
            <View
              style={[
                styles.emptyContainer,
                {
                  paddingVertical:
                    s(40),
                },
              ]}
            >
              <Ionicons
                name="receipt-outline"
                size={s(42)}
                color={COLORS.gray}
              />

              <Text
                style={[
                  styles.emptyText,
                  {
                    fontSize: s(15),
                    marginTop: s(10),
                  },
                ]}
              >
                {t.noRecordsForPeriod}
              </Text>
            </View>
          )}
        </ScrollView>

        <BottomNav
          small={isSmallScreen}
          scale={scale}
          s={s}
        />
      </View>
    </SafeAreaView>
  );
}

function getPeriodLabel(period, t) {
  if (period === "Daily")
    return t.daily;

  if (period === "Weekly")
    return t.weekly;

  if (period === "Monthly")
    return t.monthly;

  return period;
}

function Header({
  small,
  scale,
  s,
  hasNotification,
  username,
  profilePhoto,
  t,
}) {
  const size = s(68);

  return (
    <View
      style={[
        styles.header,
        {
          marginBottom: s(34),
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.profile,
          {
            width: size,
            height: size,
            borderRadius:
              size / 2,
            marginRight: s(14),
          },
        ]}
        onPress={() =>
          router.push("/profile")
        }
      >
        {profilePhoto ? (
          <Image
            source={{
              uri: profilePhoto,
            }}
            style={styles.profileImage}
            resizeMode="cover"
          />
        ) : (
          <View
            style={
              styles.profilePlaceholder
            }
          >
            <MaterialCommunityIcons
              name="account"
              size={s(36)}
              color={COLORS.gray}
            />
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.welcome}>
        <Text
          style={[
            styles.hello,
            { fontSize: s(24) },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {t.hello}, {username}!
        </Text>

        <Text
          style={[
            styles.welcomeText,
            {
              fontSize: s(15),
              marginTop: s(2),
            },
          ]}
        >
          {t.welcomeBack}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.notification,
          {
            transform: [
              {
                translateY:
                  4 * scale,
              },
            ],
          },
        ]}
        onPress={() =>
          router.push({
            pathname:
              "/notifications",
            params: {
              from: "/home",
            },
          })
        }
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name="bell-circle-outline"
          size={37 * scale}
          color={COLORS.white}
        />

        {hasNotification && (
          <View
            style={[
              styles.notificationDot,
              {
                top: s(6),
                right: s(6),
                width: s(10),
                height: s(10),
                borderRadius: s(5),
                borderWidth: s(2),
              },
            ]}
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

function Balance({
  savings,
  expenses,
  small,
  scale,
  s,
  t,
}) {
  return (
    <View
      style={[
        styles.balance,
        {
          marginBottom: s(28),
        },
      ]}
    >
      <BalanceItem
        icon="wallet-outline"
        title={
          t.availableBalance
        }
        value={formatMoney(
          savings
        )}
        size={29 * scale}
        small={small}
        s={s}
      />

      <View
        style={[
          styles.divider,
          {
            height: s(70),
            width: s(2),
            marginHorizontal: s(12),
          },
        ]}
      />

      <BalanceItem
        icon="receipt-outline"
        title={t.expenses}
        value={`-${formatMoney(
          expenses
        )}`}
        size={28 * scale}
        expense
        small={small}
        s={s}
      />
    </View>
  );
}

function BalanceItem({
  icon,
  title,
  value,
  size,
  expense,
  small,
  s,
}) {
  return (
    <View
      style={styles.balanceItem}
    >
      <View
        style={[
          styles.titleRow,
          {
            marginBottom: s(5),
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={s(18)}
          color={COLORS.white}
        />

        <Text
          style={[
            styles.balanceTitle,
            {
              fontSize: s(14),
              marginLeft: s(6),
            },
          ]}
        >
          {title}
        </Text>
      </View>

      <Text
        style={[
          expense
            ? styles.expense
            : styles.balanceValue,
          {
            fontSize: size,
          },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {value}
      </Text>
    </View>
  );
}

function Savings({
  savings,
  percentage,
  scale,
  s,
  t,
}) {
  return (
    <View
      style={[
        styles.savings,
        {
          marginBottom: s(34),
        },
      ]}
    >
      <View
        style={[
          styles.progress,
          {
            height: s(45),
            borderRadius: s(25),
          },
        ]}
      >
        <View
          style={[
            styles.progressFill,
            {
              width: `${percentage}%`,
              borderRadius: s(25),
              paddingLeft: s(25),
            },
          ]}
        >
          <Text
            style={[
              styles.progressText,
              {
                fontSize: s(15),
              },
            ]}
          >
            {percentage}%{" "}
            {t.savedPercentage}
          </Text>
        </View>

        <Text
          style={[
            styles.goalAmount,
            {
              fontSize: s(15),
              right: s(28),
            },
          ]}
        >
          {formatMoney(savings)}
        </Text>
      </View>

      <Text
        style={[
          styles.goalText,
          {
            fontSize: s(17),
            marginTop: s(9),
          },
        ]}
      >
        {t.savings}
      </Text>
    </View>
  );
}

function Actions({ scale, s, t }) {
  return (
    <View
      style={[
        styles.actions,
        {
          borderRadius: s(30),
          padding: s(12),
          marginBottom: s(34),
        },
      ]}
    >
      {ACTIONS.map(
        ([
          icon,
          translationKey,
          type,
          route,
        ]) => (
          <TouchableOpacity
            key={translationKey}
            style={[
              styles.action,
              {
                height: s(70),
                borderRadius: s(20),
                marginBottom: s(8),
              },
            ]}
            onPress={() =>
              router.push(route)
            }
          >
            <View
              style={[
                styles.actionIcon,
                {
                  width: s(30),
                  height: s(30),
                  borderRadius: s(15),
                  marginBottom: s(3),
                },
              ]}
            >
              {type === "ion" ? (
                <Ionicons
                  name={icon}
                  size={s(21)}
                  color={COLORS.cyan}
                />
              ) : (
                <MaterialCommunityIcons
                  name={icon}
                  size={s(22)}
                  color={COLORS.cyan}
                />
              )}
            </View>

            <Text
              style={[
                styles.actionText,
                {
                  fontSize: s(14),
                },
              ]}
            >
              {t[translationKey]}
            </Text>
          </TouchableOpacity>
        )
      )}
    </View>
  );
}

function Transaction({
  data,
  small,
  s,
  t,
}) {
  const icon = getIcon(
    data.category,
    data.type
  );

  const amount =
    data.type === "Expense"
      ? `-${formatMoney(
          Math.abs(data.amount)
        )}`
      : `+${formatMoney(
          Math.abs(data.amount)
        )}`;

  return (
    <View
      style={[
        styles.transaction,
        {
          marginBottom: s(22),
        },
      ]}
    >
      <View
        style={[
          styles.transactionIcon,
          {
            width: s(62),
            height: s(62),
            borderRadius: s(31),
            marginRight: s(12),
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={s(27)}
          color={COLORS.white}
          style={{
            transform: [
              {
                translateY: 1,
              },
            ],
          }}
        />
      </View>

      <View
        style={[
          styles.transactionInfo,
          {
            width: s(112),
          },
        ]}
      >
        <Text
          style={[
            styles.transactionTitle,
            {
              fontSize: s(18),
              marginBottom: s(5),
            },
          ]}
          numberOfLines={1}
        >
          {data.category}
        </Text>

        <Text
          style={[
            styles.transactionDate,
            {
              fontSize: s(11),
            },
          ]}
          numberOfLines={1}
        >
          {data.dateText ===
          "No date"
            ? t.noDate
            : data.dateText}
        </Text>
      </View>

      <View
        style={[
          styles.transactionDivider,
          {
            width: s(2),
            height: s(52),
            marginHorizontal: s(8),
          },
        ]}
      />

      <Text
        style={[
          styles.transactionType,
          {
            fontSize: s(13),
            width: s(62),
          },
        ]}
        numberOfLines={1}
      >
        {data.type ===
        "Expense"
          ? t.expense
          : t.savings}
      </Text>

      <View
        style={[
          styles.transactionDivider,
          {
            width: s(2),
            height: s(52),
            marginHorizontal: s(8),
          },
        ]}
      />

      <Text
        style={[
          styles.amount,
          data.type ===
            "Expense" &&
            styles.negative,
          data.type ===
            "Savings" &&
            styles.positive,
          {
            fontSize: s(14),
          },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {amount}
      </Text>
    </View>
  );
}

function BottomNav({
  small,
  scale,
  s,
}) {
  return (
    <View
      style={[
        styles.bottomBar,
        {
          height: 65 * scale,
          borderTopLeftRadius:
            78 * scale,
        },
      ]}
    >
      {NAV.map(
        ([icon, route], index) => (
          <TouchableOpacity
            key={index}
            style={styles.navItem}
            onPress={() => {
              if (
                route !== "/home"
              ) {
                router.push(route);
              }
            }}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name={icon}
              size={
                icon ===
                "swap-horizontal"
                  ? 37 * scale
                  : 35 * scale
              }
              color={COLORS.white}
            />
          </TouchableOpacity>
        )
      )}
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
    flexGrow: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  profile: {
    backgroundColor: "#172037",
    overflow: "hidden",
  },

  profileImage: {
    width: "100%",
    height: "100%",
  },

  profilePlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
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
  },

  notification: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  notificationDot: {
    position: "absolute",
    backgroundColor: "#FF3B30",
    borderColor: COLORS.cyan,
  },

  balance: {
    flexDirection: "row",
    alignItems: "center",
  },

  balanceItem: {
    flex: 1,
    minWidth: 0,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  balanceTitle: {
    color: COLORS.white,
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
    backgroundColor: COLORS.gray,
  },

  savings: {
    width: "100%",
  },

  progress: {
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
    justifyContent: "center",
    minWidth: 0,
  },

  progressText: {
    color: COLORS.white,
    fontWeight: "600",
  },

  goalAmount: {
    color: COLORS.white,
    position: "absolute",
  },

  goalText: {
    color: COLORS.white,
  },

  actions: {
    backgroundColor: COLORS.cyan,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  action: {
    width: "48%",
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },

  actionIcon: {
    backgroundColor: COLORS.lightCyan,
    alignItems: "center",
    justifyContent: "center",
  },

  actionText: {
    color: COLORS.dark,
    textAlign: "center",
    fontWeight: "600",
  },

  filters: {
    backgroundColor: COLORS.white,
    flexDirection: "row",
  },

  filter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  activeFilter: {
    backgroundColor: COLORS.cyan,
  },

  filterText: {
    color: COLORS.dark,
  },

  activeFilterText: {
    fontWeight: "600",
  },

  transaction: {
    flexDirection: "row",
    alignItems: "center",
  },

  transactionIcon: {
    backgroundColor: COLORS.cyan,
    alignItems: "center",
    justifyContent: "center",
  },

  transactionInfo: {
    minWidth: 0,
  },

  transactionTitle: {
    color: COLORS.white,
    fontWeight: "600",
  },

  transactionDate: {
    color: COLORS.cyan,
  },

  transactionDivider: {
    backgroundColor: COLORS.darkCyan,
  },

  transactionType: {
    color: COLORS.white,
  },

  amount: {
    flex: 1,
    color: COLORS.white,
    fontWeight: "500",
    textAlign: "right",
  },

  negative: {
    color: COLORS.cyan,
  },

  positive: {
    color: COLORS.white,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    color: COLORS.gray,
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

  navItem: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});