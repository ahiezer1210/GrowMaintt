import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";22  
import { Ionicons } from "@expo/vector-icons";

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

  const totalSaved = movements.reduce(
    (total, movement) => total + movement.savings,
    0
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
      <View style={styles.blackHeader}>
        <Text style={styles.headerTitle}>Savings History</Text>
      </View>

      <View style={styles.whitePanel}>
        <View style={styles.blueCard}>
          <View style={styles.walletBox}>
            <Ionicons
              name="wallet-outline"
              size={48}
              color="#172B3A"
            />
          </View>

          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>The Power of Saving</Text>

            <Text style={styles.totalSaved}>
              ${totalSaved.toFixed(2)}
            </Text>

            <Text style={styles.keepSaving}>
              Keep saving!
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Movements</Text>
          <Text style={styles.sectionTitle}>Round-up</Text>
        </View>

        <FlatList
          data={visibleMovements}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.movement}>
              <View style={styles.movementIcon}>
                <Ionicons
                  name={getIcon(item.type)}
                  size={34}
                  color="#172B3A"
                />
              </View>

              <Text style={styles.movementName}>
                {item.name}
              </Text>

              <Text style={styles.movementAmount}>
                + ${item.savings.toFixed(2)}
              </Text>
            </View>
          )}
        />

        <TouchableOpacity
          style={styles.seeAll}
          onPress={() => setShowAll(!showAll)}
          activeOpacity={0.7}
        >
          <Text style={styles.seeAllText}>
            {showAll ? "Show less" : "See all"}
          </Text>

          <Ionicons
            name={showAll ? "chevron-up" : "arrow-forward"}
            size={22}
            color="#172B3A"
          />
        </TouchableOpacity>

        <View style={styles.bottomTotal}>
          <Text style={styles.bottomText}>
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
    backgroundColor: "#DDE2E3",
  },

  blackHeader: {
    height: 205,
    backgroundColor: "#050505",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 42,
    paddingHorizontal: 28,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },

  whitePanel: {
    flex: 1,
    backgroundColor: "#FAFAF7",
    marginTop: -38,
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    paddingHorizontal: 22,
    paddingTop: 28,
    overflow: "hidden",
  },

  blueCard: {
    height: 108,
    backgroundColor: "#20A9D8",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
  },

  walletBox: {
    width: 82,
    height: 82,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  cardInfo: {
    flex: 1,
  },

  cardTitle: {
    color: "#172B3A",
    fontSize: 15,
    fontWeight: "700",
  },

  totalSaved: {
    color: "#172B3A",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 2,
  },

  keepSaving: {
    color: "#172B3A",
    fontSize: 13,
    marginTop: 1,
  },

  divider: {
    height: 1,
    backgroundColor: "#D9D9D9",
    marginTop: 18,
    marginBottom: 14,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 2,
    marginBottom: 3,
  },

  sectionTitle: {
    color: "#222222",
    fontSize: 17,
    fontWeight: "700",
  },

  list: {
    paddingBottom: 0,
  },

  movement: {
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  movementIcon: {
    width: 58,
    height: 58,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  movementName: {
    flex: 1,
    color: "#222222",
    fontSize: 15,
    fontWeight: "600",
  },

  movementAmount: {
    color: "#172B3A",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
  },

  seeAll: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingVertical: 10,
    paddingRight: 4,
  },

  seeAllText: {
    color: "#172B3A",
    fontSize: 15,
    fontWeight: "500",
    marginRight: 4,
  },

  bottomTotal: {
    height: 42,
    backgroundColor: "#55C9D5",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  bottomText: {
    color: "#172B3A",
    fontSize: 15,
    fontWeight: "700",
  },
});