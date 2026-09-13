import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

const movements = [
  { id: "1", name: "Starbucks", type: "coffee", savings: 0.75 },
  { id: "2", name: "Supermarket", type: "supermarket", savings: 1.0 },
  { id: "3", name: "Cinema", type: "cinema", savings: 0.85 },
  { id: "4", name: "McDonald's", type: "restaurant", savings: 1.25 },
  { id: "5", name: "Walmart", type: "supermarket", savings: 1.5 },
  { id: "6", name: "Coffee Shop", type: "coffee", savings: 2.0 },
  { id: "7", name: "Netflix", type: "movie", savings: 0.65 },
  { id: "8", name: "Target", type: "supermarket", savings: 1.1 },
  { id: "9", name: "Restaurant", type: "restaurant", savings: 1.75 },
  { id: "10", name: "Amazon", type: "shopping", savings: 1.35 },
  { id: "11", name: "Shopping", type: "shopping", savings: 1.95 },
  { id: "12", name: "Bakery", type: "coffee", savings: 0.95 },
  { id: "13", name: "Grocery Store", type: "supermarket", savings: 1.4 },
  { id: "14", name: "Movie Theater", type: "cinema", savings: 1.7 },
];

export default function HistorialScreen() {
  const [showAll, setShowAll] = useState(false);
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
        : 1.25;

  const horizontalPadding = isSmallScreen
    ? 18
    : isMediumScreen
      ? 25
      : isTablet
        ? 45
        : 60;

  const totalSaved = movements.reduce(
    (total, movement) => total + movement.savings,
    0,
  );

  const visibleMovements = showAll ? movements : movements.slice(0, 6);

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
            height: 145 * scale,
            paddingHorizontal: 22 * scale,
          },
        ]}
      >
        <Text
          style={[
            styles.headerTitle,
            {
              fontSize: 24 * scale,
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
            borderTopLeftRadius: 45 * scale,
            borderTopRightRadius: 45 * scale,
            paddingHorizontal: 22 * scale,
            paddingTop: 28 * scale,
          },
        ]}
      >
        <View
          style={[
            styles.blueCard,
            {
              height: 108 * scale,
              borderRadius: 10 * scale,
              paddingHorizontal: 18 * scale,
            },
          ]}
        >
          <View
            style={[
              styles.walletBox,
              {
                width: 82 * scale,
                height: 82 * scale,
                marginRight: 15 * scale,
              },
            ]}
          >
            <Ionicons name="wallet-outline" size={48 * scale} color="#172B3A" />
          </View>

          <View style={styles.cardInfo}>
            <Text
              style={[
                styles.cardTitle,
                {
                  fontSize: 15 * scale,
                },
              ]}
            >
              The Power of Saving
            </Text>

            <Text
              style={[
                styles.totalSaved,
                {
                  fontSize: 24 * scale,
                },
              ]}
            >
              ${totalSaved.toFixed(2)}
            </Text>

            <Text
              style={[
                styles.keepSaving,
                {
                  fontSize: 13 * scale,
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
              marginTop: 18 * scale,
              marginBottom: 14 * scale,
            },
          ]}
        />

        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              {
                fontSize: 17 * scale,
              },
            ]}
          >
            Movements
          </Text>

          <Text
            style={[
              styles.sectionTitle,
              {
                fontSize: 17 * scale,
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
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View
              style={[
                styles.movement,
                {
                  height: 70 * scale,
                },
              ]}
            >
              <View
                style={[
                  styles.movementIcon,
                  {
                    width: 58 * scale,
                    height: 58 * scale,
                    marginRight: 12 * scale,
                  },
                ]}
              >
                <Ionicons
                  name={getIcon(item.type)}
                  size={34 * scale}
                  color="#172B3A"
                />
              </View>

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
                    marginLeft: 8  * scale,
                  },
                ]}
              >
                + ${item.savings.toFixed(2)}
              </Text>
            </View>
          )}
        />

        <TouchableOpacity
          style={[
            styles.seeAll,
            {
              paddingVertical: 10 * scale,
              paddingRight: 4 * scale,
            },
          ]}
          onPress={() => setShowAll(!showAll)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.seeAllText,
              {
                fontSize: 15 * scale,
                marginRight: 4 * scale,
              },
            ]}
          >
            {showAll ? "Show less" : "See all"}
          </Text>

          <Ionicons
            name={showAll ? "chevron-up" : "arrow-forward"}
            size={22 * scale}
            color="#172B3A"
          />
        </TouchableOpacity>

        <View
          style={[
            styles.bottomTotal,
            {
              height: 42 * scale,
              borderRadius: 8 * scale,
              marginBottom: 8 * scale,
            },
          ]}
        >
          <Text
            style={[
              styles.bottomText,
              {
                fontSize: 15 * scale,
              },
            ]}
          >
            Total saved: ${totalSaved.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
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
    paddingHorizontal: 2,
    marginBottom: 3,
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
});
