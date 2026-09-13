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
  ["hand-coin-outline", "Points\nExchange", "material", "/PointsExchange"],
];

const NAV = [
  ["home-outline", "ion", "/"],
  ["bar-chart-outline", "ion", "/historial"],
  ["swap-horizontal", "material", "/ExpensesManagement"],
  ["layers-outline", "material", "/currentgoal"],
  ["person-outline", "ion", "/Profile"],
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

  const small = width < 360;

  const scale =
    small
      ? 0.88
      : width > 430
        ? 1.08
        : 1;

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
                small
                  ? 18
                  : width > 430
                    ? 34
                    : 25,
            },
          ]}
        >
          <Header
            small={small}
            scale={scale}
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
            small={small}
            scale={scale}
          />

          <Savings
            savings={
              totalSavings
            }
            percentage={
              savingsPercentage
            }
            scale={scale}
          />

          <Actions
            scale={scale}
          />

          <View
            style={styles.filters}
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
                    period ===
                      item &&
                      styles.activeFilter,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      small && {
                        fontSize: 13,
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
                  small={small}
                />
              )
            )
          ) : (
            <View
              style={
                styles.emptyContainer
              }
            >
              <Ionicons
                name="receipt-outline"
                size={42}
                color={
                  COLORS.gray
                }
              />

              <Text
                style={
                  styles.emptyText
                }
              >
                No records for this period
              </Text>
            </View>
          )}
        </ScrollView>

        <BottomNav
          small={small}
          scale={scale}
        />
      </View>
    </SafeAreaView>
  );
}

function Header({
  small,
  scale,
  hasNotification,
  username,
  profilePhoto,
}) {
  const size =
    small ? 55 : 68;

  return (
    <View
      style={styles.header}
    >
      <TouchableOpacity
        style={[
          styles.profile,
          {
            width: size,
            height: size,
            borderRadius:
              size / 2,
            overflow:
              "hidden",
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
                24 * scale,
            },
          ]}
          numberOfLines={1}
        >
          Hello, {username}!
        </Text>

        <Text
          style={
            styles.welcomeText
          }
        >
          Welcome back
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.notification,
          {
            width: small
              ? 44
              : 52,
            height: small
              ? 44
              : 52,
          },
        ]}
        onPress={() =>
          router.push(
            "/notifications"
          )
        }
      >
        <Ionicons
          name="notifications-outline"
          size={
            small ? 24 : 29
          }
          color={
            COLORS.white
          }
        />

        {hasNotification && (
          <View
            style={
              styles.notificationDot
            }
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
}) {
  return (
    <View
      style={styles.balance}
    >
      <BalanceItem
        icon="wallet-outline"
        title="Available Balance"
        value={formatMoney(
          savings
        )}
        size={29 * scale}
        small={small}
      />

      <View
        style={[
          styles.divider,
          {
            height:
              small
                ? 55
                : 70,
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
}) {
  return (
    <View
      style={
        styles.balanceItem
      }
    >
      <View
        style={
          styles.titleRow
        }
      >
        <Ionicons
          name={icon}
          size={
            small ? 16 : 18
          }
          color={
            COLORS.white
          }
        />

        <Text
          style={[
            styles.balanceTitle,
            small && {
              fontSize: 12,
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
}) {
  return (
    <View
      style={styles.savings}
    >
      <View
        style={styles.progress}
      >
        <View
          style={[
            styles.progressFill,
            {
              width: `${percentage}%`,
            },
          ]}
        >
          <Text
            style={[
              styles.progressText,
              {
                fontSize:
                  15 * scale,
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
                15 * scale,
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
              17 * scale,
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
}) {
  return (
    <View
      style={styles.actions}
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
                  84 * scale,
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
                    38 * scale,
                  height:
                    38 * scale,
                  borderRadius:
                    19 * scale,
                },
              ]}
            >
              {type ===
              "ion" ? (
                <Ionicons
                  name={icon}
                  size={
                    27 * scale
                  }
                  color={
                    COLORS.cyan
                  }
                />
              ) : (
                <MaterialCommunityIcons
                  name={icon}
                  size={
                    29 * scale
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
                    14 * scale,
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
      style={
        styles.transaction
      }
    >
      <View
        style={[
          styles.transactionIcon,
          {
            width: small
              ? 50
              : 62,
            height: small
              ? 50
              : 62,
            borderRadius:
              small
                ? 25
                : 31,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={27}
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
            width: small
              ? 82
              : 112,
          },
        ]}
      >
        <Text
          style={[
            styles.transactionTitle,
            small && {
              fontSize: 15,
            },
          ]}
          numberOfLines={1}
        >
          {data.category}
        </Text>

        <Text
          style={[
            styles.transactionDate,
            small && {
              fontSize: 9,
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
          small && {
            height: 42,
          },
        ]}
      />

      <Text
        style={[
          styles.transactionType,
          small && {
            fontSize: 10,
            width: 48,
          },
        ]}
        numberOfLines={1}
      >
        {data.type}
      </Text>

      <View
        style={[
          styles.transactionDivider,
          small && {
            height: 42,
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
          small && {
            fontSize: 11,
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
}) {
  return (
    <View
      style={[
        styles.bottom,
        {
          height:
            65 * scale,
          borderTopLeftRadius:
            78 * scale,
        },
      ]}
    >
      {NAV.map(
        (
          [
            icon,
            type,
            route,
          ],
          index
        ) => (
          <TouchableOpacity
            key={index}
            style={
              styles.navItem
            }
            onPress={() =>
              router.push(
                route
              )
            }
          >
            {type ===
            "ion" ? (
              <Ionicons
                name={icon}
                size={
                  small
                    ? 25
                    : 31
                }
                color={
                  COLORS.white
                }
              />
            ) : (
              <MaterialCommunityIcons
                name={icon}
                size={
                  small
                    ? 28
                    : 34
                }
                color={
                  COLORS.white
                }
              />
            )}
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
    paddingTop: 24,
    paddingBottom: 125,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 34,
  },

  profile: {
    backgroundColor:
      "#172037",
    marginRight: 14,
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
    fontSize: 15,
    marginTop: 2,
  },

  notification: {
    borderRadius: 30,
    backgroundColor:
      COLORS.cyan,
    alignItems: "center",
    justifyContent:
      "center",
    position: "relative",
  },

  notificationDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor:
      "#FF3B30",
    borderWidth: 2,
    borderColor:
      COLORS.cyan,
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
    backgroundColor:
      COLORS.gray,
    marginHorizontal: 12,
  },

  savings: {
    marginBottom: 34,
  },

  progress: {
    height: 45,
    borderRadius: 25,
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
    borderRadius: 25,
    justifyContent:
      "center",
    paddingLeft: 25,
    minWidth: 0,
  },

  progressText: {
    color: COLORS.white,
    fontWeight: "600",
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
    backgroundColor:
      COLORS.cyan,
    borderRadius: 38,
    padding: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent:
      "space-between",
    marginBottom: 34,
  },

  action: {
    width: "48%",
    borderRadius: 24,
    backgroundColor:
      COLORS.white,
    alignItems: "center",
    justifyContent:
      "center",
    marginBottom: 12,
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
    marginBottom: 5,
  },

  actionText: {
    color: COLORS.dark,
    textAlign: "center",
    fontWeight: "600",
  },

  filters: {
    minHeight: 55,
    borderRadius: 30,
    backgroundColor:
      COLORS.white,
    flexDirection: "row",
    padding: 5,
    marginBottom: 28,
  },

  filter: {
    flex: 1,
    borderRadius: 25,
    alignItems: "center",
    justifyContent:
      "center",
    minHeight: 45,
  },

  activeFilter: {
    backgroundColor:
      COLORS.cyan,
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
    backgroundColor:
      COLORS.cyan,
    alignItems: "center",
    justifyContent:
      "center",
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
    backgroundColor:
      COLORS.darkCyan,
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

  positive: {
    color: COLORS.white,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent:
      "center",
    paddingVertical: 40,
  },

  emptyText: {
    color: COLORS.gray,
    fontSize: 15,
    marginTop: 10,
  },

  bottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor:
      COLORS.cyan,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-around",
    overflow: "hidden",
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent:
      "center",
  },
});