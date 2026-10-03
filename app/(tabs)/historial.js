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
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import { useAppSettings } from "../../context/Appsettings";
import { auth, db } from "../../firebaseConfig.js";

const NAV = [
  ["home-outline", "ion", "/home"],
  ["bar-chart-outline", "ion", "/historial"],
  ["swap-horizontal", "material", "/expensesmanagement"],
  ["layers-outline", "material", "/currentgoal"],
  ["person-outline", "ion", "/profile"],
];

export default function HistorialScreen() {
  const { colors, t } = useAppSettings();

  const [showAll, setShowAll] = useState(false);
  const [movements, setMovements] = useState([]);
  const [selectedMovement, setSelectedMovement] = useState(null);

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
    ? 18
    : isMediumScreen
    ? 25
    : isTablet
    ? 45
    : 60;

  const s = (size) => Math.round(size * scale);

  const abrirNotificaciones = () => {
    router.push({
      pathname: "/notifications",
      params: {
        from: "/historial",
      },
    });
  };

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

        const expensesRef = collection(
          db,
          "Registro de gastos"
        );

        const unsubscribeExpenses = onSnapshot(
          expensesRef,
          (expenseSnapshot) => {
            const expensesData = expenseSnapshot.docs
              .map((document) => ({
                id: document.id,
                ...document.data(),
              }))
              .filter(
                (expense) => expense.uid === user.uid
              );

            const combinedMovements = savingsData.map(
              (saving) => {
                const expense = expensesData.find(
                  (item) =>
                    item.id === saving.expenseId
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

                  savings: Number(
                    saving.amount || 0
                  ),

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
                    expense?.roundedAmount ??
                      expense?.roundingAmount ??
                      saving?.roundedAmount ??
                      saving?.roundingAmount ??
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
              }
            );

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
    <View
      style={[
        styles.screen,
        { backgroundColor: colors.primaryBackground },
      ]}
    >
      <StatusBar
        translucent
        backgroundColor={colors.primaryBackground}
        barStyle={
          colors.primaryBackground === "#FAFAF7"
            ? "dark-content"
            : "light-content"
        }
      />

      <View
        style={[
          styles.header,
          {
            height: s(145),
            paddingHorizontal: horizontalPadding,
            backgroundColor: colors.header,
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
          onPress={() => router.replace("/home")}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-back"
            size={26 * scale}
            color={colors.white}
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            {
              fontSize: s(24),
              color: colors.white,
            },
          ]}
        >
          {t.savingsHistory}
        </Text>

        <TouchableOpacity
          style={[
            styles.notificationButton,
            {
              width: 40 * scale,
              height: 40 * scale,
              borderRadius: 20 * scale,
            },
          ]}
          onPress={abrirNotificaciones}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="bell-circle-outline"
            size={35 * scale}
            color={colors.white}
          />
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.whitePanel,
          {
            borderTopLeftRadius: s(45),
            borderTopRightRadius: s(45),
            paddingHorizontal: horizontalPadding,
            paddingTop: s(28),
            backgroundColor: colors.background,
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
              backgroundColor: colors.primary,
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
              color={colors.icon}
            />
          </View>

          <View style={styles.cardInfo}>
            <Text
              style={[
                styles.cardTitle,
                {
                  fontSize: s(15),
                  color: colors.text,
                },
              ]}
            >
              {t.thePowerOfSaving}
            </Text>

            <Text
              style={[
                styles.totalSaved,
                {
                  fontSize: s(24),
                  color: colors.text,
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
                  color: colors.text,
                },
              ]}
            >
              {t.keepSaving}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.divider,
            {
              marginTop: s(18),
              marginBottom: s(14),
              backgroundColor: colors.border,
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
                color: colors.text,
              },
            ]}
          >
            {t.movements}
          </Text>

          <Text
            style={[
              styles.sectionTitle,
              {
                fontSize: s(17),
                color: colors.text,
              },
            ]}
          >
            {t.roundUp}
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
                      borderBottomColor: colors.border,
                    },
                  ]}
                  onPress={() =>
                    toggleMovement(item)
                  }
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
                      color={colors.icon}
                    />
                  </View>

                  <Text
                    style={[
                      styles.movementName,
                      {
                        fontSize: s(15),
                        color: colors.text,
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
                        color: colors.text,
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
                        backgroundColor: colors.card,
                        borderBottomColor: colors.border,
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
                            color: colors.secondaryText,
                          },
                        ]}
                      >
                        {t.description}
                      </Text>

                      <Text
                        style={[
                          styles.detailValue,
                          {
                            fontSize: s(13),
                            color: colors.text,
                          },
                        ]}
                      >
                        {item.description ||
                          t.noDescription}
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
                            color: colors.secondaryText,
                          },
                        ]}
                      >
                        {t.expense}
                      </Text>

                      <Text
                        style={[
                          styles.detailValue,
                          {
                            fontSize: s(13),
                            color: colors.text,
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
                            color: colors.secondaryText,
                          },
                        ]}
                      >
                        {t.roundUpTo}
                      </Text>

                      <Text
                        style={[
                          styles.detailValue,
                          {
                            fontSize: s(13),
                            color: colors.text,
                          },
                        ]}
                      >
                        $
                        {item.roundingAmount.toFixed(
                          2
                        )}
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
                            color: colors.secondaryText,
                          },
                        ]}
                      >
                        {t.date}
                      </Text>

                      <Text
                        style={[
                          styles.detailValue,
                          {
                            fontSize: s(13),
                            color: colors.text,
                          },
                        ]}
                      >
                        {item.date || t.noDate}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text
                        style={[
                          styles.detailLabel,
                          {
                            fontSize: s(13),
                            color: colors.secondaryText,
                          },
                        ]}
                      >
                        {t.savings}
                      </Text>

                      <Text
                        style={[
                          styles.detailSavings,
                          {
                            fontSize: s(13),
                          },
                        ]}
                      >
                        + $
                        {item.savings.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            );
          }}
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
                color: colors.text,
              },
            ]}
          >
            {showAll
              ? t.showLess
              : t.seeAll}
          </Text>

          <Ionicons
            name={
              showAll
                ? "chevron-up"
                : "arrow-forward"
            }
            size={s(22)}
            color={colors.icon}
          />
        </TouchableOpacity>

        <View
          style={[
            styles.bottomTotal,
            {
              height: s(42),
              borderRadius: s(8),
              marginBottom: s(8),
              backgroundColor: colors.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.bottomText,
              {
                fontSize: s(15),
                color: colors.text,
              },
            ]}
          >
            {t.totalSaved}: $
            {totalSaved.toFixed(2)}
          </Text>
        </View>
      </View>

      <BottomNav
        small={isSmallScreen}
        scale={scale}
        colors={colors}
      />
    </View>
  );
}

function BottomNav({ small, scale, colors }) {
  return (
    <View
      style={[
        styles.bottom,
        {
          height: 65 * scale,
          borderTopLeftRadius: 78 * scale,
          backgroundColor: colors.nav,
        },
      ]}
    >
      {NAV.map(
        ([icon, type, routePath], index) => (
          <TouchableOpacity
            key={index}
            style={styles.navItem}
            onPress={() =>
              router.push(routePath)
            }
            activeOpacity={0.7}
          >
            {type === "ion" ? (
              <Ionicons
                name={icon}
                size={small ? 25 : 31}
                color={colors.white}
              />
            ) : (
              <MaterialCommunityIcons
                name={icon}
                size={small ? 28 : 34}
                color={colors.white}
              />
            )}
          </TouchableOpacity>
        )
      )}
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
  },

  header: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontWeight: "600",
    textAlign: "center",
  },

  backButton: {
    position: "absolute",
    zIndex: 10,
    padding: 8,
  },

  notificationButton: {
    position: "absolute",
    right: 18,
    top: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  whitePanel: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
  },

  blueCard: {
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
    fontWeight: "700",
  },

  totalSaved: {
    fontWeight: "800",
    marginTop: 2,
  },

  keepSaving: {
    marginTop: 1,
  },

  divider: {
    height: 1,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontWeight: "700",
  },

  list: {
    paddingBottom: 0,
  },

  movement: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
  },

  movementIcon: {
    justifyContent: "center",
    alignItems: "center",
  },

  movementName: {
    flex: 1,
    fontWeight: "600",
  },

  movementAmount: {
    fontWeight: "600",
  },

  details: {
    borderBottomWidth: 1,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  detailLabel: {
    fontWeight: "600",
    flex: 1,
  },

  detailValue: {
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
    fontWeight: "500",
  },

  bottomTotal: {
    justifyContent: "center",
    alignItems: "center",
  },

  bottomText: {
    fontWeight: "700",
  },

  bottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
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