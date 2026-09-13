import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { auth, db } from "../../firebaseConfig.js";

export default function HistorialScreen() {
  const { width, height } = useWindowDimensions();

  const isSmallScreen = width < 360;
  const isMediumScreen = width >= 360 && width < 600;
  const isTablet = width >= 600 && width < 900;
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

  const s = (size) => Math.round(size * scale);

  const [showAll, setShowAll] = useState(false);
  const [movements, setMovements] = useState([]);
  const [selectedMovement, setSelectedMovement] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      setMovements([]);
      return;
    }

    const savingsQuery = query(
      collection(db, "Ahorros"),
      orderBy("createdAt", "desc")
    );

    const unsubscribeSavings = onSnapshot(
      savingsQuery,
      (savingsSnapshot) => {
        const savingsData = savingsSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((item) => item.uid === user.uid);

        const expensesQuery = query(
          collection(db, "Registro de gastos"),
          orderBy("createdAt", "desc")
        );

        const unsubscribeExpenses = onSnapshot(
          expensesQuery,
          (expensesSnapshot) => {
            const expensesData = expensesSnapshot.docs
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
              .filter((item) => item.uid === user.uid);

            const combinedMovements = savingsData.map((saving) => {
              const matchingExpense = expensesData.find(
                (expense) =>
                  expense.id === saving.expenseId ||
                  expense.expenseId === saving.expenseId
              );

              return {
                id: saving.id,
                name:
                  saving.name ||
                  saving.category ||
                  matchingExpense?.category ||
                  "Savings",
                type:
                  saving.type ||
                  saving.category ||
                  matchingExpense?.category ||
                  "Savings",
                savings: Number(
                  saving.savings ??
                    saving.amount ??
                    saving.roundingAmount ??
                    0
                ),
                description:
                  saving.description ||
                  matchingExpense?.description ||
                  "No description",
                amount: Number(
                  matchingExpense?.amount ??
                    saving.amount ??
                    0
                ),
                roundingAmount: Number(
                  saving.roundingAmount ??
                    matchingExpense?.roundingAmount ??
                    saving.savings ??
                    0
                ),
                date:
                  saving.date ||
                  matchingExpense?.date ||
                  saving.createdAt ||
                  matchingExpense?.createdAt ||
                  null,
                expenseType:
                  saving.expenseType ||
                  matchingExpense?.expenseType ||
                  "",
                isRecurrent:
                  saving.isRecurrent ??
                  matchingExpense?.isRecurrent ??
                  false,
              };
            });

            setMovements(combinedMovements);
          },
          () => {
            setMovements(
              savingsData.map((saving) => ({
                id: saving.id,
                name: saving.name || saving.category || "Savings",
                type: saving.type || saving.category || "Savings",
                savings: Number(
                  saving.savings ??
                    saving.amount ??
                    saving.roundingAmount ??
                    0
                ),
                description:
                  saving.description || "No description",
                amount: Number(saving.amount ?? 0),
                roundingAmount: Number(
                  saving.roundingAmount ??
                    saving.savings ??
                    0
                ),
                date: saving.date || saving.createdAt || null,
                expenseType: saving.expenseType || "",
                isRecurrent: saving.isRecurrent ?? false,
              }))
            );
          }
        );

        return unsubscribeExpenses;
      },
      () => {
        setMovements([]);
      }
    );

    return () => {
      unsubscribeSavings();
    };
  }, []);

  const totalSaved = movements.reduce(
    (total, movement) => total + Number(movement.savings || 0),
    0
  );

  const visibleMovements = showAll
    ? movements
    : movements.slice(0, 6);

  const getMovementType = (movement) => {
    const value = String(
      movement.type ||
        movement.name ||
        movement.category ||
        ""
    ).toLowerCase();

    if (
      value.includes("food") ||
      value.includes("restaurant") ||
      value.includes("meal")
    ) {
      return {
        icon: "fast-food-outline",
        color: "#168AFF",
      };
    }

    if (
      value.includes("transport") ||
      value.includes("gas") ||
      value.includes("bus")
    ) {
      return {
        icon: "car-outline",
        color: "#168AFF",
      };
    }

    if (
      value.includes("shopping") ||
      value.includes("clothes") ||
      value.includes("shop")
    ) {
      return {
        icon: "bag-outline",
        color: "#168AFF",
      };
    }

    if (
      value.includes("health") ||
      value.includes("medicine")
    ) {
      return {
        icon: "medkit-outline",
        color: "#168AFF",
      };
    }

    if (
      value.includes("education") ||
      value.includes("school")
    ) {
      return {
        icon: "school-outline",
        color: "#168AFF",
      };
    }

    return {
      icon: "wallet-outline",
      color: "#168AFF",
    };
  };

  const formatDate = (value) => {
    if (!value) return "No date";

    try {
      if (value?.toDate) {
        return value.toDate().toLocaleDateString();
      }

      const date = new Date(value);

      if (Number.isNaN(date.getTime())) {
        return String(value);
      }

      return date.toLocaleDateString();
    } catch {
      return String(value);
    }
  };

  const formatAmount = (amount) => {
    return `$${Number(amount || 0).toFixed(2)}`;
  };

  const toggleMovement = (id) => {
    setSelectedMovement((current) =>
      current === id ? null : id
    );
  };

  const renderMovement = ({ item }) => {
    const movementType = getMovementType(item);
    const isSelected = selectedMovement === item.id;

    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.movementItem,
            {
              paddingVertical: s(13),
            },
          ]}
          onPress={() => toggleMovement(item.id)}
        >
          <View
            style={[
              styles.iconContainer,
              {
                width: s(42),
                height: s(42),
                borderRadius: s(12),
                marginRight: s(12),
              },
            ]}
          >
            <Ionicons
              name={movementType.icon}
              size={s(21)}
              color={movementType.color}
            />
          </View>

          <View style={styles.movementInfo}>
            <Text
              style={[
                styles.movementName,
                {
                  fontSize: s(15),
                },
              ]}
              numberOfLines={1}
            >
              {item.name}
            </Text>

            <Text
              style={[
                styles.movementDate,
                {
                  fontSize: s(12),
                  marginTop: s(3),
                },
              ]}
            >
              {formatDate(item.date)}
            </Text>
          </View>

          <View style={styles.movementAmountContainer}>
            <Text
              style={[
                styles.movementAmount,
                {
                  fontSize: s(15),
                },
              ]}
            >
              {formatAmount(item.savings)}
            </Text>

            <Ionicons
              name={
                isSelected
                  ? "chevron-up-outline"
                  : "chevron-down-outline"
              }
              size={s(17)}
              color="#777777"
              style={{
                marginTop: s(3),
              }}
            />
          </View>
        </TouchableOpacity>

        {isSelected && (
          <View
            style={[
              styles.details,
              {
                paddingHorizontal: s(12),
                paddingVertical: s(12),
              },
            ]}
          >
            <View
              style={[
                styles.detailRow,
                {
                  marginBottom: s(8),
                },
              ]}
            >
              <Text
                style={[
                  styles.detailLabel,
                  {
                    fontSize: s(12),
                  },
                ]}
              >
                Description
              </Text>

              <Text
                style={[
                  styles.detailValue,
                  {
                    fontSize: s(12),
                  },
                ]}
              >
                {item.description}
              </Text>
            </View>

            <View
              style={[
                styles.detailRow,
                {
                  marginBottom: s(8),
                },
              ]}
            >
              <Text
                style={[
                  styles.detailLabel,
                  {
                    fontSize: s(12),
                  },
                ]}
              >
                Expense
              </Text>

              <Text
                style={[
                  styles.detailValue,
                  {
                    fontSize: s(12),
                  },
                ]}
              >
                {formatAmount(item.amount)}
              </Text>
            </View>

            <View
              style={[
                styles.detailRow,
                {
                  marginBottom: s(8),
                },
              ]}
            >
              <Text
                style={[
                  styles.detailLabel,
                  {
                    fontSize: s(12),
                  },
                ]}
              >
                Round-up to
              </Text>

              <Text
                style={[
                  styles.detailValue,
                  {
                    fontSize: s(12),
                  },
                ]}
              >
                {formatAmount(
                  item.amount + item.roundingAmount
                )}
              </Text>
            </View>

            <View
              style={[
                styles.detailRow,
                {
                  marginBottom: s(8),
                },
              ]}
            >
              <Text
                style={[
                  styles.detailLabel,
                  {
                    fontSize: s(12),
                  },
                ]}
              >
                Date
              </Text>

              <Text
                style={[
                  styles.detailValue,
                  {
                    fontSize: s(12),
                  },
                ]}
              >
                {formatDate(item.date)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text
                style={[
                  styles.detailLabel,
                  {
                    fontSize: s(12),
                  },
                ]}
              >
                Savings
              </Text>

              <Text
                style={[
                  styles.detailSavings,
                  {
                    fontSize: s(12),
                  },
                ]}
              >
                {formatAmount(item.savings)}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#081023"
      />

      <View
        style={[
          styles.header,
          {
            paddingHorizontal: horizontalPadding,
            paddingTop: s(20),
            paddingBottom: s(25),
          },
        ]}
      >
        <Text
          style={[
            styles.headerTitle,
            {
              fontSize: s(25),
            },
          ]}
        >
          History
        </Text>

        <Text
          style={[
            styles.headerSubtitle,
            {
              fontSize: s(13),
              marginTop: s(5),
            },
          ]}
        >
          Track your expenses and savings
        </Text>
      </View>

      <View
        style={[
          styles.whitePanel,
          {
            paddingHorizontal: horizontalPadding,
            paddingTop: s(22),
          },
        ]}
      >
        <View
          style={[
            styles.savingsCard,
            {
              padding: s(18),
              borderRadius: s(18),
            },
          ]}
        >
          <View>
            <Text
              style={[
                styles.savingsLabel,
                {
                  fontSize: s(13),
                },
              ]}
            >
              Total Savings
            </Text>

            <Text
              style={[
                styles.savingsAmount,
                {
                  fontSize: s(30),
                  marginTop: s(4),
                },
              ]}
            >
              {formatAmount(totalSaved)}
            </Text>
          </View>

          <View
            style={[
              styles.savingsIcon,
              {
                width: s(45),
                height: s(45),
                borderRadius: s(14),
              },
            ]}
          >
            <Ionicons
              name="wallet-outline"
              size={s(23)}
              color="#FFFFFF"
            />
          </View>
        </View>

        <View
          style={[
            styles.sectionHeader,
            {
              marginTop: s(24),
              paddingHorizontal: s(2),
              marginBottom: s(3),
            },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              {
                fontSize: s(18),
              },
            ]}
          >
            Movements
          </Text>

          <Text
            style={[
              styles.sectionCount,
              {
                fontSize: s(12),
              },
            ]}
          >
            {movements.length}
          </Text>
        </View>

        <View style={styles.divider} />

        <FlatList
          data={visibleMovements}
          keyExtractor={(item) => item.id}
          renderItem={renderMovement}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: s(2),
          }}
          ListEmptyComponent={
            <View
              style={[
                styles.emptyContainer,
                {
                  paddingVertical: s(45),
                },
              ]}
            >
              <Ionicons
                name="wallet-outline"
                size={s(42)}
                color="#B3B3B3"
              />

              <Text
                style={[
                  styles.emptyText,
                  {
                    fontSize: s(14),
                    marginTop: s(12),
                  },
                ]}
              >
                No movements yet
              </Text>
            </View>
          }
          ListFooterComponent={
            movements.length > 6 ? (
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.seeAllButton,
                  {
                    paddingVertical: s(12),
                  },
                ]}
                onPress={() => setShowAll((current) => !current)}
              >
                <Text
                  style={[
                    styles.seeAllText,
                    {
                      fontSize: s(14),
                    },
                  ]}
                >
                  {showAll ? "Show less" : "See all"}
                </Text>

                <Ionicons
                  name={
                    showAll
                      ? "chevron-up-outline"
                      : "chevron-down-outline"
                  }
                  size={s(17)}
                  color="#168AFF"
                />
              </TouchableOpacity>
            ) : null
          }
        />

        <View
          style={[
            styles.bottomTotal,
            {
              paddingVertical: s(17),
            },
          ]}
        >
          <Text
            style={[
              styles.bottomTotalLabel,
              {
                fontSize: s(13),
              },
            ]}
          >
            Total saved
          </Text>

          <Text
            style={[
              styles.bottomTotalAmount,
              {
                fontSize: s(18),
              },
            ]}
          >
            {formatAmount(totalSaved)}
          </Text>
        </View>
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
    backgroundColor: "#081023",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  headerSubtitle: {
    color: "#ACADAD",
    fontWeight: "500",
  },

  whitePanel: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },

  savingsCard: {
    backgroundColor: "#168AFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  savingsLabel: {
    color: "#EAF5FF",
    fontWeight: "600",
  },

  savingsAmount: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  savingsIcon: {
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    color: "#172B3A",
    fontWeight: "700",
  },

  sectionCount: {
    color: "#777777",
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
  },

  movementItem: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  iconContainer: {
    backgroundColor: "#EEF7FF",
    justifyContent: "center",
    alignItems: "center",
  },

  movementInfo: {
    flex: 1,
    minWidth: 0,
  },

  movementName: {
    color: "#172B3A",
    fontWeight: "700",
  },

  movementDate: {
    color: "#999999",
    fontWeight: "500",
  },

  movementAmountContainer: {
    alignItems: "flex-end",
    marginLeft: 8,
  },

  movementAmount: {
    color: "#168AFF",
    fontWeight: "700",
  },

  details: {
    backgroundColor: "#F3F4F5",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  detailLabel: {
    color: "#777777",
    fontWeight: "600",
    flex: 1,
  },

  detailValue: {
    color: "#172B3A",
    fontWeight: "600",
    flex: 1.5,
    textAlign: "right",
  },

  detailSavings: {
    color: "#168AFF",
    fontWeight: "700",
    flex: 1.5,
    textAlign: "right",
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    color: "#999999",
    fontWeight: "600",
  },

  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  seeAllText: {
    color: "#168AFF",
    fontWeight: "700",
  },

  bottomTotal: {
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  bottomTotalLabel: {
    color: "#777777",
    fontWeight: "600",
  },

  bottomTotalAmount: {
    color: "#168AFF",
    fontWeight: "800",
  },
});