<<<<<<< HEAD
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
=======
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { useEffect, useState } from "react";
>>>>>>> 349b3c5810c493ba5e5ac84cb0ac139294ec6e3a
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

const NAV = [
  ["home-outline", "ion", "/home"],
  ["bar-chart-outline", "ion", "/historial"],
  ["swap-horizontal", "material", "/ExpensesManagement"],
  ["layers-outline", "material", "/currentgoal"],
  ["person-outline", "ion", "/(tabs)/profile"],
];

export default function HistorialScreen() {
  const [showAll, setShowAll] = useState(false);
<<<<<<< HEAD
  const { width } = useWindowDimensions();
=======
  const [movements, setMovements] = useState([]);
  const [selectedMovement, setSelectedMovement] = useState(null);

  const { width, height } = useWindowDimensions();
>>>>>>> 349b3c5810c493ba5e5ac84cb0ac139294ec6e3a

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
    ? 18
    : isMediumScreen
    ? 25
    : isTablet
    ? 45
    : 60;

  const s = (size) => Math.round(size * scale);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      setMovements([]);
      return;
    }

    const savingsRef = collection(db, "Ahorros");

    const savingsQuery = query(
      savingsRef,
      orderBy("createdAt", "desc")
    );

    const unsubscribeSavings = onSnapshot(
      savingsQuery,
      (snapshot) => {
        const savingsData = snapshot.docs
          .map((document) => ({
            id: document.id,
            ...document.data(),
          }))
          .filter((saving) => saving.uid === user.uid);

        const expensesRef = collection(db, "Registro de gastos");

        const unsubscribeExpenses = onSnapshot(
          expensesRef,
          (expenseSnapshot) => {
            const expensesData = expenseSnapshot.docs
              .map((document) => ({
                id: document.id,
                ...document.data(),
              }))
              .filter((expense) => expense.uid === user.uid);

            const combinedMovements = savingsData.map((saving) => {
              const expense = expensesData.find(
                (item) => item.id === saving.expenseId
              );

              return {
                id: saving.id,
                name:
                  saving.category ||
                  expense?.category ||
                  "Savings",
                type: getMovementType(
                  saving.category ||
                    expense?.category ||
                    ""
                ),
                savings: Number(saving.amount || 0),
                description:
                  expense?.description ||
                  saving.description ||
                  "",
                amount: Number(
                  expense?.amount ??
                    saving.originalAmount ??
                    0
                ),
                roundingAmount: Number(
                  expense?.roundingAmount ??
                    saving.roundingAmount ??
                    0
                ),
                date:
                  expense?.date ||
                  saving.date ||
                  "",
                expenseType:
                  expense?.expenseType ||
                  "",
                isRecurrent:
                  expense?.isRecurrent ||
                  false,
              };
            });

            setMovements(combinedMovements);
          },
          (error) => {
            console.log(
              "ERROR READING EXPENSES:",
              error
            );
          }
        );

        return unsubscribeExpenses;
      },
      (error) => {
        console.log(
          "ERROR READING SAVINGS:",
          error
        );
      }
    );

    return () => {
      unsubscribeSavings();
    };
  }, []);

  const totalSaved = movements.reduce(
    (total, movement) =>
      total + Number(movement.savings || 0),
    0
  );

  const visibleMovements = showAll
    ? movements
    : movements.slice(0, 6);

  const toggleMovement = (movement) => {
    if (selectedMovement?.id === movement.id) {
      setSelectedMovement(null);
    } else {
      setSelectedMovement(movement);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "coffee":
        return "cafe-outline";
      case "supermarket":
        return "cart-outline";
      case "cinema":
      case "movie":
        return "videocam-outline";
      case "restaurant":
        return "restaurant-outline";
      case "shopping":
        return "bag-handle-outline";
      default:
        return "wallet-outline";
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar
        translucent
        backgroundColor="#071426"
        barStyle="light-content"
      />

      <View
        style={[
          styles.header,
          {
            height: s(145),
            paddingHorizontal: horizontalPadding,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.backButton,
            {
              left: 18 * scale,
              top: 50 * scale,
            },
          ]}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={26 * scale} color="#FFFFFF" />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            {
              fontSize: s(24),
            },
          ]}
        >
          Savings History
        </Text>
      </View>

      <View
        style={[
          styles.whitePanel,
          {
<<<<<<< HEAD
            borderTopLeftRadius: 45 * scale,
            borderTopRightRadius: 45 * scale,
            paddingHorizontal: horizontalPadding,
            paddingTop: 28 * scale,
=======
            borderTopLeftRadius: s(45),
            borderTopRightRadius: s(45),
            paddingHorizontal: horizontalPadding,
            paddingTop: s(28),
>>>>>>> 349b3c5810c493ba5e5ac84cb0ac139294ec6e3a
          },
        ]}
      >
        <View
          style={[
            styles.blueCard,
            {
              height: s(108),
              borderRadius: s(10),
              paddingHorizontal: s(18),
            },
          ]}
        >
          <View
            style={[
              styles.walletBox,
              {
                width: s(82),
                height: s(82),
                marginRight: s(15),
              },
            ]}
          >
            <Ionicons
              name="wallet-outline"
              size={s(48)}
              color="#172B3A"
            />
          </View>

          <View style={styles.cardInfo}>
            <Text
              style={[
                styles.cardTitle,
                {
                  fontSize: s(15),
                },
              ]}
            >
              The Power of Saving
            </Text>

            <Text
              style={[
                styles.totalSaved,
                {
                  fontSize: s(24),
                },
              ]}
            >
              ${totalSaved.toFixed(2)}
            </Text>

            <Text
              style={[
                styles.keepSaving,
                {
                  fontSize: s(13),
                },
              ]}
            >
              Keep saving!
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.divider,
            {
              marginTop: s(18),
              marginBottom: s(14),
            },
          ]}
        />

        <View
          style={[
            styles.sectionHeader,
            {
              paddingHorizontal: s(2),
              marginBottom: s(3),
            },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              {
                fontSize: s(17),
              },
            ]}
          >
            Movements
          </Text>

          <Text
            style={[
              styles.sectionTitle,
              {
                fontSize: s(17),
              },
            ]}
          >
            Round-up
          </Text>
        </View>

        <FlatList
          data={visibleMovements}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.list,
            {
              paddingBottom: s(2),
            },
          ]}
          renderItem={({ item }) => {
            const isSelected =
              selectedMovement?.id === item.id;

            return (
              <View>
                <TouchableOpacity
                  style={[
                    styles.movement,
                    {
                      minHeight: s(70),
                    },
                  ]}
                  onPress={() => toggleMovement(item)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.movementIcon,
                      {
                        width: s(58),
                        height: s(58),
                        marginRight: s(12),
                      },
                    ]}
                  >
                    <Ionicons
                      name={getIcon(item.type)}
                      size={s(34)}
                      color="#172B3A"
                    />
                  </View>

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
                      styles.movementAmount,
                      {
                        fontSize: s(15),
                        marginLeft: s(8),
                      },
                    ]}
                  >
                    + ${item.savings.toFixed(2)}
                  </Text>
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
                          marginBottom: s(7),
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.detailLabel,
                          {
                            fontSize: s(13),
                          },
                        ]}
                      >
                        Description
                      </Text>

                      <Text
                        style={[
                          styles.detailValue,
                          {
                            fontSize: s(13),
                          },
                        ]}
                      >
                        {item.description || "No description"}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.detailRow,
                        {
                          marginBottom: s(7),
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.detailLabel,
                          {
                            fontSize: s(13),
                          },
                        ]}
                      >
                        Expense
                      </Text>

                      <Text
                        style={[
                          styles.detailValue,
                          {
                            fontSize: s(13),
                          },
                        ]}
                      >
                        ${item.amount.toFixed(2)}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.detailRow,
                        {
                          marginBottom: s(7),
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.detailLabel,
                          {
                            fontSize: s(13),
                          },
                        ]}
                      >
                        Round-up to
                      </Text>

                      <Text
                        style={[
                          styles.detailValue,
                          {
                            fontSize: s(13),
                          },
                        ]}
                      >
                        ${item.roundingAmount.toFixed(2)}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.detailRow,
                        {
                          marginBottom: s(7),
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.detailLabel,
                          {
                            fontSize: s(13),
                          },
                        ]}
                      >
                        Date
                      </Text>

                      <Text
                        style={[
                          styles.detailValue,
                          {
                            fontSize: s(13),
                          },
                        ]}
                      >
                        {item.date || "No date"}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text
                        style={[
                          styles.detailLabel,
                          {
                            fontSize: s(13),
                          },
                        ]}
                      >
                        Savings
                      </Text>

                      <Text
                        style={[
                          styles.detailSavings,
                          {
                            fontSize: s(13),
                          },
                        ]}
                      >
                        + ${item.savings.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
<<<<<<< HEAD

              <Text
                style={[
                  styles.movementName,
                  {
                    fontSize: 15 * scale,
                  },
                ]}
                numberOfLines={1}
              >
                {item.name}
              </Text>

              <Text
                style={[
                  styles.movementAmount,
                  {
                    fontSize: 15 * scale,
                    marginLeft: 8 * scale,
                  },
                ]}
              >
                + ${item.savings.toFixed(2)}
              </Text>
            </View>
          )}
=======
            );
          }}
>>>>>>> 349b3c5810c493ba5e5ac84cb0ac139294ec6e3a
        />

        <TouchableOpacity
          style={[
            styles.seeAll,
            {
              paddingVertical: s(10),
              paddingRight: s(4),
            },
          ]}
          onPress={() => setShowAll(!showAll)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.seeAllText,
              {
                fontSize: s(15),
                marginRight: s(4),
              },
            ]}
          >
            {showAll ? "Show less" : "See all"}
          </Text>

          <Ionicons
            name={
              showAll
                ? "chevron-up"
                : "arrow-forward"
            }
            size={s(22)}
            color="#172B3A"
          />
        </TouchableOpacity>

        <View
          style={[
            styles.bottomTotal,
            {
              height: s(42),
              borderRadius: s(8),
              marginBottom: s(8),
            },
          ]}
        >
          <Text
            style={[
              styles.bottomText,
              {
                fontSize: s(15),
              },
            ]}
          >
            Total saved: ${totalSaved.toFixed(2)}
          </Text>
        </View>
      </View>

      <BottomNav small={isSmallScreen} scale={scale} />
    </View>
  );
}

function BottomNav({ small, scale }) {
  return (
    <View
      style={[
        styles.bottom,
        {
          height: 65 * scale,
          borderTopLeftRadius: 78 * scale,
        },
      ]}
    >
      {NAV.map(([icon, type, routePath], index) => (
        <TouchableOpacity
          key={index}
          style={styles.navItem}
          onPress={() => router.push(routePath)}
          activeOpacity={0.7}
        >
          {type === "ion" ? (
            <Ionicons name={icon} size={small ? 25 : 31} color="#FFFFFF" />
          ) : (
            <MaterialCommunityIcons
              name={icon}
              size={small ? 28 : 34}
              color="#FFFFFF"
            />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

function getMovementType(category) {
  const value = category.toLowerCase();

  if (
    value.includes("coffee") ||
    value.includes("cafe")
  ) {
    return "coffee";
  }

  if (
    value.includes("supermarket") ||
    value.includes("grocery") ||
    value.includes("market")
  ) {
    return "supermarket";
  }

  if (
    value.includes("cinema") ||
    value.includes("movie")
  ) {
    return "cinema";
  }

  if (
    value.includes("restaurant") ||
    value.includes("food") ||
    value.includes("mcdonald")
  ) {
    return "restaurant";
  }

  if (
    value.includes("shopping") ||
    value.includes("amazon") ||
    value.includes("store")
  ) {
    return "shopping";
  }

  return "wallet";
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#071426",
  },

  header: {
    width: "100%",
    backgroundColor: "#071426",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontWeight: "600",
    textAlign: "center",
  },

  backButton: {
    position: "absolute",
    zIndex: 10,
    padding: 8,
  },

  whitePanel: {
    flex: 1,
    width: "100%",
    backgroundColor: "#FAFAF7",
    overflow: "hidden",
  },

  blueCard: {
    backgroundColor: "#20A9D8",
    flexDirection: "row",
    alignItems: "center",
  },

  walletBox: {
    justifyContent: "center",
    alignItems: "center",
  },

  cardInfo: {
    flex: 1,
  },

  cardTitle: {
    color: "#172B3A",
    fontWeight: "700",
  },

  totalSaved: {
    color: "#172B3A",
    fontWeight: "800",
    marginTop: 2,
  },

  keepSaving: {
    color: "#172B3A",
    marginTop: 1,
  },

  divider: {
    height: 1,
    backgroundColor: "#D9D9D9",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  sectionTitle: {
    color: "#222222",
    fontWeight: "700",
  },

  list: {
    paddingBottom: 0,
  },

  movement: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  movementIcon: {
    justifyContent: "center",
    alignItems: "center",
  },

  movementName: {
    flex: 1,
    color: "#222222",
    fontWeight: "600",
  },

  movementAmount: {
    color: "#172B3A",
    fontWeight: "600",
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

  seeAll: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  seeAllText: {
    color: "#172B3A",
    fontWeight: "500",
  },

  bottomTotal: {
    backgroundColor: "#55C9D5",
    justifyContent: "center",
    alignItems: "center",
  },

  bottomText: {
    color: "#172B3A",
    fontWeight: "700",
  },
<<<<<<< HEAD

  bottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#20A9D8",
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
=======
});
>>>>>>> 349b3c5810c493ba5e5ac84cb0ac139294ec6e3a
