import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth, db } from "../../firebaseConfig";

const categories = [
  "All",
  "Savings",
  "Investment",
  "Rewards",
  "Security",
];

export default function NotificationsScreen() {
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
    : 1.25;

  const horizontalPadding = isSmallScreen
    ? 18
    : isMediumScreen
    ? 25
    : isTablet
    ? 45
    : 60;

  const s = (value) => Math.round(value * scale);

  const { from } = useLocalSearchParams();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      setNotifications([]);
      return;
    }

    const ref = collection(
      db,
      "Users",
      user.uid,
      "securityAlerts"
    );

    return onSnapshot(
      ref,
      (snapshot) => {
        const data = snapshot.docs
          .map((item) => {
            const alert = item.data();

            const date = alert.createdAt?.toDate
              ? alert.createdAt.toDate()
              : new Date();

            return {
              id: item.id,
              alertId: item.id,
              category: "Security",
              title: "Security alert",
              description: `Your account was accessed from ${
                alert.deviceName || "another device"
              }`,
              time: date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              date: date.toLocaleDateString([], {
                month: "long",
                day: "numeric",
              }),
              icon: "shield-check-outline",
              unread: alert.read !== true,
              createdAt:
                alert.createdAt?.toMillis?.() || 0,
            };
          })
          .sort(
            (a, b) => b.createdAt - a.createdAt
          );

        setNotifications(data);
      },
      () => setNotifications([])
    );
  }, []);

  const filtered =
    selectedCategory === "All"
      ? notifications
      : notifications.filter(
          (item) =>
            item.category === selectedCategory
        );

  const unreadCount = notifications.filter(
    (item) => item.unread
  ).length;

  const openNotification = async (notification) => {
    if (notification.category !== "Security") {
      return;
    }

    try {
      const user = auth.currentUser;

      if (!user) {
        return;
      }

      const ref = doc(
        db,
        "Users",
        user.uid,
        "securityAlerts",
        notification.alertId
      );

      await updateDoc(ref, {
        read: true,
      });

      router.push({
        pathname: "/security_alert",
        params: {
          id: notification.alertId,
          category: "Security", // 👈 nuevo
          collectionName: "securityAlerts", // 👈 nuevo
        },
      });
    } catch (error) {
      console.log(
        "Error opening notification:",
        error
      );
    }
  };

  const emptyState = () => {
    const info = {
      All: [
        "bell-off-outline",
        "No notifications",
        "You don't have any notifications here yet.",
      ],

      Savings: [
        "cash-multiple",
        "No savings reminders",
        "You don't have any savings reminders yet.",
      ],

      Investment: [
        "finance",
        "No investment notices",
        "You don't have any investment notifications yet.",
      ],

      Rewards: [
        "medal-outline",
        "No rewards updates",
        "You don't have any rewards notifications yet.",
      ],

      Security: [
        "shield-check-outline",
        "No security alerts",
        "You don't have any security alerts yet.",
      ],
    };

    const [
      icon,
      title,
      description,
    ] = info[selectedCategory];

    return (
      <View style={styles.empty}>
        <View style={styles.emptyIcon}>
          <MaterialCommunityIcons
            name={icon}
            size={s(38)}
            color="#ACADAD"
          />
        </View>

        <Text style={styles.emptyTitle}>
          {title}
        </Text>

        <Text style={styles.emptyText}>
          {description}
        </Text>
      </View>
    );
  };

  const nav = (tab, route) => {
    setActiveTab(tab);
    router.push(route);
  };

  const volver = () => {
    if (from === "/backup") {
      router.push("/backup");
    } else if (from === "/privacypolicy") {
      router.push("/privacypolicy");
    } else if (from === "/terms") {
      router.push("/terms");
    } else if (from === "/expensesmanagement") {
      router.push("/expensesmanagement");
    } else if (from === "/registerexpenses") {
      router.push("/registerexpenses");
    } else if (from === "/registerinvestments") {
      router.push("/registerinvestments");
    } else if (from === "/usermanual") {
      router.push("/usermanual");
    } else if (from === "/historial") {
      router.push("/historial");
    } else if (from === "/profile") {
      router.push("/profile");
    } else if (from === "/Edit_profile") {
      router.push("/Edit_profile");
    } else if (from === "/settings") {
      router.push("/settings");
    } else if (from === "/linkeddevices") {
      router.push("/linkeddevices");
    } else if (from === "/logoutalldevices") {
      router.push("/logoutalldevices");
    } else if (from === "/logout") {
      router.push("/logout");
    } else if (from === "/currentgoal") {
      router.push("/currentgoal");
    } else if (from === "/investments") {
      router.push("/investments");
    } else if (from === "/pointsExchange") {
      router.push("/pointsExchange");
    } else if (from === "/redemption_history") {
      router.push("/redemption_history");
    } else if (from === "/expensesManagement") {
      router.push("/expensesManagement");
    } else if (from === "/expensecontrolperiod") {
      router.push("/expensecontrolperiod");
    } else if (from === "/registergoals") {
      router.push("/registergoals");
    } else if (from === "/deleteaccount") {
      router.push("/deleteaccount");
    } else if (from === "/security_alert") {
      router.push("/security_alert");
    } else {
      router.push("/home");
    }
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["left", "right"]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="#071426"
      />

      {/* HEADER */}
      <View
        style={[
          styles.header,
          {
            height: s(118),
            paddingHorizontal: horizontalPadding,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.back,
            {
              left: s(15),
              top: s(34),
              width: s(55),
              height: s(55),
            },
          ]}
          onPress={volver}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={s(35)}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            {
              fontSize: s(25),
            },
          ]}
        >
          Notifications
        </Text>

        {unreadCount > 0 && (
          <View
            style={[
              styles.headerDot,
              {
                width: s(10),
                height: s(10),
                borderRadius: s(5),
                marginLeft: s(10),
              },
            ]}
          />
        )}
      </View>

      {/* CONTENT */}
      <View
        style={[
          styles.content,
          {
            borderTopLeftRadius: s(45),
            borderTopRightRadius: s(45),
            paddingTop: s(28),
          },
        ]}
      >
        {/* CATEGORIES */}
        <View
          style={[
            styles.categories,
            {
              paddingHorizontal: s(9),
              marginBottom: s(20),
            },
          ]}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.category,
                {
                  height: s(35),
                  paddingHorizontal: s(10),
                  borderRadius: s(9),
                },
                selectedCategory === category &&
                  styles.categoryActive,
              ]}
              onPress={() =>
                setSelectedCategory(category)
              }
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    fontSize: s(10),
                  },
                  selectedCategory === category &&
                    styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* NOTIFICATIONS LIST */}
        <ScrollView
          style={[
            styles.list,
            {
              paddingHorizontal: s(16),
            },
          ]}
          contentContainerStyle={[
            styles.listContent,
            {
              paddingBottom: s(90),
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {filtered.length === 0
            ? emptyState()
            : filtered.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.notification,
                    {
                      minHeight: s(76),
                      borderRadius: s(13),
                      padding: s(11),
                      marginBottom: s(12),
                    },
                  ]}
                  onPress={() =>
                    openNotification(item)
                  }
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.icon,
                      {
                        width: s(35),
                        marginRight: s(7),
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={item.icon}
                      size={s(26)}
                      color="#172D3D"
                    />
                  </View>

                  <View
                    style={[
                      styles.notificationContent,
                      {
                        paddingRight: s(15),
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.title,
                        {
                          fontSize: s(11),
                          marginBottom: s(3),
                        },
                      ]}
                    >
                      {item.title}
                    </Text>

                    <Text
                      style={[
                        styles.description,
                        {
                          fontSize: s(9),
                          lineHeight: s(12),
                        },
                      ]}
                    >
                      {item.description}
                    </Text>

                    <View
                      style={[
                        styles.dateRow,
                        {
                          marginTop: s(4),
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.time,
                          {
                            fontSize: s(8),
                            marginRight: s(3),
                          },
                        ]}
                      >
                        {item.time}
                      </Text>

                      <Text
                        style={[
                          styles.date,
                          {
                            fontSize: s(8),
                          },
                        ]}
                      >
                        {item.date}
                      </Text>
                    </View>
                  </View>

                  {item.unread && (
                    <View
                      style={[
                        styles.notificationDot,
                        {
                          left: s(11),
                          top: s(12),
                          width: s(7),
                          height: s(7),
                          borderRadius: s(7),
                        },
                      ]}
                    />
                  )}
                </TouchableOpacity>
              ))}
        </ScrollView>

        {/* BOTTOM NAVIGATION */}
        <SafeAreaView
          edges={["bottom"]}
          style={styles.bottomContainer}
        >
          <View
            style={[
              styles.bottomBar,
              {
                height: s(65),
                borderTopLeftRadius: s(78),
              },
            ]}
          >
            {[
              [
                "home",
                "/home",
                "home-outline",
                35,
              ],
              [
                "reports",
                "/historial",
                "chart-box-outline",
                35,
              ],
              [
                "swap",
                "/expensesManagement",
                "swap-horizontal",
                37,
              ],
              [
                "layers",
                "/currentgoal",
                "layers-outline",
                35,
              ],
              [
                "account",
                "/profile",
                "account-outline",
                35,
              ],
            ].map(
              ([tab, route, icon, size]) => (
                <TouchableOpacity
                  key={tab}
                  style={styles.navItem}
                  onPress={() =>
                    nav(tab, route)
                  }
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons
                    name={icon}
                    size={s(size)}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
              )
            )}
          </View>
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#071426",
  },

  header: {
    height: 118,
    backgroundColor: "#071426",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 25,
  },

  back: {
    position: "absolute",
    left: 15,
    top: 34,
    width: 55,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    elevation: 10,
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "700",
    transform: [
      {
        translateX: 10,
      },
      {
        translateY: 1,
      },
    ],
  },

  headerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#27B4D0",
    marginLeft: 10,
  },

  content: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    paddingTop: 28,
    overflow: "hidden",
  },

  categories: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 9,
    marginBottom: 20,
  },

  category: {
    height: 35,
    paddingHorizontal: 10,
    borderRadius: 9,
    backgroundColor: "#E5E9F3",
    justifyContent: "center",
  },

  categoryActive: {
    backgroundColor: "#27B4D0",
  },

  categoryText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#172D3D",
  },

  categoryTextActive: {
    color: "#FFFFFF",
  },

  list: {
    flex: 1,
    paddingHorizontal: 16,
  },

  listContent: {
    paddingBottom: 90,
  },

  notification: {
    minHeight: 76,
    backgroundColor: "#F4F4F4",
    borderRadius: 13,
    padding: 11,
    flexDirection: "row",
    position: "relative",
    marginBottom: 12,
  },

  icon: {
    width: 35,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 7,
  },

  notificationContent: {
    flex: 1,
    paddingRight: 15,
  },

  title: {
    color: "#172D3D",
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 3,
  },

  description: {
    color: "#6D7580",
    fontSize: 9,
    lineHeight: 12,
  },

  dateRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 4,
  },

  time: {
    color: "#172D3D",
    fontSize: 8,
    marginRight: 3,
  },

  date: {
    color: "#172D3D",
    fontSize: 8,
  },

  notificationDot: {
    position: "absolute",
    left: 11,
    top: 12,
    width: 7,
    height: 7,
    borderRadius: 7,
    backgroundColor: "#27B4D0",
  },

  empty: {
    minHeight: 420,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 35,
  },

  emptyIcon: {
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: "#F1F3F5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  emptyTitle: {
    color: "#172D3D",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 6,
  },

  emptyText: {
    color: "#6D7580",
    fontSize: 11,
    textAlign: "center",
    lineHeight: 16,
  },

  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#25B5D1",
    borderTopLeftRadius: 78,
  },

  bottomBar: {
    height: 65,
    backgroundColor: "#25B5D1",
    flexDirection: "row",
    alignItems: "center",
    borderTopLeftRadius: 78,
  },

  navItem: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});