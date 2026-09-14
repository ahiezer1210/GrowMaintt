import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

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
  ["card-outline", "Register\nexpenses", "ion", "/registerexpenses"],
  ["book-outline", "Register\ngoals", "ion", "/registergoals"],
  ["trending-up-outline", "Investments", "ion", "/investments"],
  ["hand-coin-outline", "Points\nExchange", "material", "/pointsExchange"],
];

const NAV = [
  ["home-outline", "/home"],
  ["chart-box-outline", "/historial"],
  ["swap-horizontal", "/expensesManagement"],
  ["layers-outline", "/currentgoal"],
  ["account-outline", "/profile"],
];

const getField = (item, fields) => {
  for (const field of fields) {
    if (
      item &&
      item[field] !== undefined &&
      item[field] !== null
    ) {
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
    const cleanValue = value.trim();

    const match = cleanValue.match(
      /^([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})$/
    );

    if (match) {
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

      const month = months[match[1].toLowerCase()];

      if (month !== undefined) {
        const date = new Date(
          Number(match[3]),
          month,
          Number(match[2])
        );

        return isNaN(date.getTime()) ? null : date;
      }
    }

    const date = new Date(cleanValue);

    if (!isNaN(date.getTime())) {
      return date;
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
    (field) =>
      data[field] !== undefined &&
      data[field] !== null
  );

  const hasAmount = possibleAmountFields.some(
    (field) =>
      data[field] !== undefined &&
      data[field] !== null
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

  return {
    category: String(category),
    amount: Number(amount) || 0,
    date,
    dateText,
    type,
  };
};

const isInPeriod = (record, period) => {
  if (!record.date) {
    return false;
  }

  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  if (period === "Daily") {
    const endOfToday = new Date(startOfToday);

    endOfToday.setDate(
      endOfToday.getDate() + 1
    );

    return (
      record.date >= startOfToday &&
      record.date < endOfToday
    );
  }

  if (period === "Weekly") {
    const startOfWeek = new Date(startOfToday);

    const currentDay =
      startOfWeek.getDay();

    const difference =
      currentDay === 0
        ? 6
        : currentDay - 1;

    startOfWeek.setDate(
      startOfWeek.getDate() - difference
    );

    const endOfWeek = new Date(startOfWeek);

    endOfWeek.setDate(
      endOfWeek.getDate() + 7
    );

    return (
      record.date >= startOfWeek &&
      record.date < endOfWeek
    );
  }

  if (period === "Monthly") {
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const startOfNextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );

    return (
      record.date >= startOfMonth &&
      record.date < startOfNextMonth
    );
  }

  return false;
};

const formatMoney = (amount) => {
  const number = Number(amount) || 0;

  return `$${number.toFixed(2)}`;
};

const getIcon = (category, type) => {
  const value = String(
    category || ""
  ).toLowerCase();

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
  const { selectedPeriods } =
    usePeriods();

  const [period, setPeriod] =
    useState("Monthly");

  const [hasNotification, setHasNotification] =
    useState(false);

  const [username, setUsername] =
    useState("User");

  const [profilePhoto, setProfilePhoto] =
    useState(null);

  const [records, setRecords] =
    useState([]);

  const { width } =
    useWindowDimensions();

  const isSmallScreen = width < 360;
  const isMediumScreen =
    width >= 360 && width < 600;
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
    ? 18
    : isMediumScreen
    ? 25
    : isTablet
    ? 45
    : 60;

  const s = (size) =>
    Math.round(size * scale);

  const availablePeriods =
    selectedPeriods.map(
      (item) =>
        item.charAt(0).toUpperCase() +
        item.slice(1)
    );

  useEffect(() => {
    if (
      availablePeriods.length > 0 &&
      !availablePeriods.includes(period)
    ) {
      setPeriod(
        availablePeriods[0]
      );
    }
  }, [selectedPeriods]);

  useEffect(() => {
    const user =
      auth.currentUser;

    if (!user) {
      setUsername("User");
      setProfilePhoto(null);
      return;
    }

    const loadUserData =
      async () => {
        try {
          const userRef = doc(
            db,
            "Users",
            user.uid
          );

          const userSnap =
            await getDoc(userRef);

          if (
            userSnap.exists()
          ) {
            const userData =
              userSnap.data();

            setUsername(
              userData.username ||
                "User"
            );

            setProfilePhoto(
              userData.identityDocumentUrl ||
                null
            );
          } else {
            setUsername("User");
            setProfilePhoto(null);
          }
        } catch (error) {
          console.log(
            "Error loading user data:",
            error
          );
        }
      };

    loadUserData();
  }, []);

  useEffect(() => {
    const user =
      auth.currentUser;

    if (!user) {
      setRecords([]);
      return;
    }

    const expensesRef =
      collection(
        db,
        "Registro de gastos"
      );

    const savingsRef =
      collection(
        db,
        "Ahorros"
      );

    let expensesRecords = [];
    let savingsRecords = [];

    const updateRecords =
      () => {
        const allRecords = [
          ...expensesRecords,
          ...savingsRecords,
        ].sort((a, b) => {
          if (
            !a.date &&
            !b.date
          ) {
            return 0;
          }

          if (!a.date) {
            return 1;
          }

          if (!b.date) {
            return -1;
          }

          return (
            b.date.getTime() -
            a.date.getTime()
          );
        });

        setRecords(
          allRecords
        );
      };

    const unsubscribeExpenses =
      onSnapshot(
        expensesRef,
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
                documentData.createdAt?.toDate
                  ? documentData.createdAt.toDate()
                  : convertDate(
                      documentData.date
                    );

              expensesRecords.push({
                category:
                  documentData.category ||
                  "Other",
                amount:
                  Number(
                    documentData.amount
                  ) || 0,
                date:
                  expenseDate,
                dateText:
                  documentData.date ||
                  "No date",
                type:
                  "Expense",
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
      );

    const unsubscribeSavings =
      onSnapshot(
        savingsRef,
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

              items.forEach(
                (item) => {
                  savingsRecords.push(
                    normalizeRecord(
                      item,
                      "Savings"
                    )
                  );
                }
              );
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
      );

    return () => {
      unsubscribeExpenses();
      unsubscribeSavings();
    };
  }, []);

  useEffect(() => {
    const user =
      auth.currentUser;

    if (!user) {
      setHasNotification(false);
      return;
    }

    const alertsRef =
      collection(
        db,
        "Users",
        user.uid,
        "securityAlerts"
      );

    const unsubscribe =
      onSnapshot(
        alertsRef,
        (snapshot) => {
          const hasUnread =
            snapshot.docs.some(
              (item) =>
                item.data()
                  .read !== true
            );

          setHasNotification(
            hasUnread
          );
        },
        () => {
          setHasNotification(false);
        }
      );

    return unsubscribe;
  }, []);

  const filteredRecords =
    records.filter(
      (record) =>
        isInPeriod(
          record,
          period
        )
    );

  const totalSavings =
    filteredRecords
      .filter(
        (record) =>
          record.type ===
          "Savings"
      )
      .reduce(
        (total, record) =>
          total +
          Math.abs(
            record.amount
          ),
        0
      );

  const totalExpenses =
    filteredRecords
      .filter(
        (record) =>
          record.type ===
          "Expense"
      )
      .reduce(
        (total, record) =>
          total +
          Math.abs(
            record.amount
          ),
        0
      );

  const totalMoney =
    totalSavings +
    totalExpenses;

  const savingsPercentage =
    totalMoney > 0
      ? Math.round(
          (totalSavings /
            totalMoney) *
            100
        )
      : 0;

  return (
    <SafeAreaView
      style={styles.safe}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={
          COLORS.dark
        }
      />

      <View style={styles.app}>
        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
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
            profilePhoto={
              profilePhoto
            }
          />

          <Balance
            savings={
              totalSavings
            }
            expenses={
              totalExpenses
            }
            small={isSmallScreen}
            scale={scale}
            s={s}
          />

          <Savings
            savings={
              totalSavings
            }
            percentage={
              savingsPercentage
            }
            scale={scale}
            s={s}
          />

          <Actions
            scale={scale}
            s={s}
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
                    setPeriod(
                      item
                    )
                  }
                  style={[
                    styles.filter,
                    {
                      borderRadius:
                        s(25),
                      minHeight:
                        s(45),
                    },
                    period ===
                      item &&
                      styles.activeFilter,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      {
                        fontSize:
                          s(15),
                      },
                      period ===
                        item &&
                        styles.activeFilterText,
                    ]}
                  >
                    {item}
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
                color={
                  COLORS.gray
                }
              />

              <Text
                style={[
                  styles.emptyText,
                  {
                    fontSize:
                      s(15),
                    marginTop:
                      s(10),
                  },
                ]}
              >
                No records for this period
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

function Header({
  small,
  scale,
  s,
  hasNotification,
  username,
  profilePhoto,
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
          router.push(
            "/Profile"
          )
        }
      >
        {profilePhoto ? (
          <Image
            source={{
              uri: profilePhoto,
            }}
            style={
              styles.profileImage
            }
            resizeMode="cover"
          />
        ) : null}
      </TouchableOpacity>

      <View
        style={styles.welcome}
      >
        <Text
          style={[
            styles.hello,
            {
              fontSize:
                s(24),
            },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          Hello, {username}!
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
          Welcome back
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
          router.push(
            "/notifications"
          )
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
                borderRadius:
                  s(5),
                borderWidth:
                  s(2),
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
        title="Available Balance"
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
        title="Expenses"
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
      style={
        styles.balanceItem
      }
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
          color={
            COLORS.white
          }
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
                fontSize:
                  s(15),
              },
            ]}
          >
            {percentage}% Saved
          </Text>
        </View>

        <Text
          style={[
            styles.goalAmount,
            {
              fontSize:
                s(15),
              right: s(28),
            },
          ]}
        >
          {formatMoney(
            savings
          )}
        </Text>
      </View>

      <Text
        style={[
          styles.goalText,
          {
            fontSize:
              s(17),
            marginTop: s(9),
          },
        ]}
      >
        Savings
      </Text>
    </View>
  );
}

function Actions({
  scale,
  s,
}) {
  return (
    <View
      style={[
        styles.actions,
        {
          borderRadius: s(38),
          padding: s(20),
          marginBottom: s(34),
        },
      ]}
    >
      {ACTIONS.map(
        ([
          icon,
          text,
          type,
          route,
        ]) => (
          <TouchableOpacity
            key={text}
            style={[
              styles.action,
              {
                height:
                  s(84),
                borderRadius:
                  s(24),
                marginBottom:
                  s(12),
              },
            ]}
            onPress={() =>
              router.push(
                route
              )
            }
          >
            <View
              style={[
                styles.actionIcon,
                {
                  width:
                    s(38),
                  height:
                    s(38),
                  borderRadius:
                    s(19),
                  marginBottom:
                    s(5),
                },
              ]}
            >
              {type ===
              "ion" ? (
                <Ionicons
                  name={icon}
                  size={
                    s(27)
                  }
                  color={
                    COLORS.cyan
                  }
                />
              ) : (
                <MaterialCommunityIcons
                  name={icon}
                  size={
                    s(29)
                  }
                  color={
                    COLORS.cyan
                  }
                />
              )}
            </View>

            <Text
              style={[
                styles.actionText,
                {
                  fontSize:
                    s(14),
                },
              ]}
            >
              {text}
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
}) {
  const icon = getIcon(
    data.category,
    data.type
  );

  const amount =
    data.type === "Expense"
      ? `-${formatMoney(
          Math.abs(
            data.amount
          )
        )}`
      : `+${formatMoney(
          Math.abs(
            data.amount
          )
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
          color={
            COLORS.white
          }
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
          {data.dateText}
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
        {data.type}
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
            onPress={() =>
              router.push(route)
            }
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name={icon}
              size={
                icon === "swap-horizontal"
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
    backgroundColor:
      COLORS.dark,
  },

  app: {
    flex: 1,
    backgroundColor:
      COLORS.dark,
  },

  content: {
    flexGrow: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  profile: {
    backgroundColor:
      "#172037",
    overflow: "hidden",
  },

  profileImage: {
    width: "100%",
    height: "100%",
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
    justifyContent:
      "center",
    position: "relative",
  },

  notificationDot: {
    position: "absolute",
    backgroundColor:
      "#FF3B30",
    borderColor:
      COLORS.cyan,
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
    backgroundColor:
      COLORS.gray,
  },

  savings: {
    width: "100%",
  },

  progress: {
    backgroundColor:
      COLORS.darkCyan,
    overflow: "hidden",
    justifyContent:
      "center",
  },

  progressFill: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor:
      COLORS.cyan,
    justifyContent:
      "center",
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
    backgroundColor:
      COLORS.cyan,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent:
      "space-between",
  },

  action: {
    width: "48%",
    backgroundColor:
      COLORS.white,
    alignItems: "center",
    justifyContent:
      "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },

  actionIcon: {
    backgroundColor:
      COLORS.lightCyan,
    alignItems: "center",
    justifyContent:
      "center",
  },

  actionText: {
    color: COLORS.dark,
    textAlign: "center",
    fontWeight: "600",
  },

  filters: {
    backgroundColor:
      COLORS.white,
    flexDirection: "row",
  },

  filter: {
    flex: 1,
    alignItems: "center",
    justifyContent:
      "center",
  },

  activeFilter: {
    backgroundColor:
      COLORS.cyan,
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
    backgroundColor:
      COLORS.cyan,
    alignItems: "center",
    justifyContent:
      "center",
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
    backgroundColor:
      COLORS.darkCyan,
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
    justifyContent:
      "center",
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