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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth, db } from "../../firebaseConfig";

const categories = ["All", "Savings", "Investment", "Rewards", "Security"];

export default function NotificationsScreen() {
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
      "securityAlerts",
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
              createdAt: alert.createdAt?.toMillis?.() || 0,
            };
          })
          .sort((a, b) => b.createdAt - a.createdAt);

        setNotifications(data);
      },
      () => setNotifications([]),
    );
  }, []);

  const filtered =
    selectedCategory === "All"
      ? notifications
      : notifications.filter(
          (item) => item.category === selectedCategory,
        );

  const unreadCount = notifications.filter(
    (item) => item.unread,
  ).length;

  const openNotification = async (notification) => {
    if (notification.category !== "Security") return;

    try {
      const user = auth.currentUser;

      if (!user) return;

      const ref = doc(
        db,
        "Users",
        user.uid,
        "securityAlerts",
        notification.alertId,
      );

      await updateDoc(ref, { read: true });

      router.push({
        pathname: "/security_alert",
        params: {
          id: notification.alertId,
        },
      });
    } catch (error) {
      console.log("Error opening notification:", error);
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

    const [icon, title, description] =
      info[selectedCategory];

    return (
      <View style={styles.empty}>
        <View style={styles.emptyIcon}>
          <MaterialCommunityIcons
            name={icon}
            size={38}
            color="#ACADAD"
          />
        </View>

        <Text style={styles.emptyTitle}>{title}</Text>
        <Text style={styles.emptyText}>{description}</Text>
      </View>
    );
  };

  const nav = (tab, route) => {
    setActiveTab(tab);
    router.push(route);
  };

  const volver = () => {
<<<<<<< HEAD
    if (from) {
      router.replace(from);
    } else {
      router.replace("/home");
=======
    if (from === "/profile") {
      router.push("/profile");
    } else if (from === "/settings") {
      router.push("/settings");
    } else if (from === "/linkeddevices") {
      router.push("/linkeddevices");
    } else if (from === "/logoutalldevices") {
      router.push("/logoutalldevices");
    } else if (from === "/signout") {
      router.push("/signout");
    } else {
      router.push("/home");
>>>>>>> 09e8728d8833f2d2b7132f974edb63ae2f3ee20e
    }
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "left", "right"]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="#071426"
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.back}
          onPress={volver}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={35}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Notifications
        </Text>

        {unreadCount > 0 && (
          <View style={styles.headerDot} />
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.categories}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.category,
                selectedCategory === category &&
                  styles.categoryActive,
              ]}
<<<<<<< HEAD
              onPress={() => setSelectedCategory(category)}
=======
              onPress={() =>
                setSelectedCategory(category)
              }
>>>>>>> 09e8728d8833f2d2b7132f974edb63ae2f3ee20e
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category &&
                    styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {filtered.length === 0
            ? emptyState()
            : filtered.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.notification}
                  onPress={() =>
                    openNotification(item)
                  }
                  activeOpacity={0.8}
                >
                  <View style={styles.icon}>
                    <MaterialCommunityIcons
                      name={item.icon}
                      size={26}
                      color="#172D3D"
                    />
                  </View>

<<<<<<< HEAD
                  <View style={styles.notificationContent}>
                    <Text style={styles.title}>{item.title}</Text>
=======
                  <View
                    style={styles.notificationContent}
                  >
                    <Text style={styles.title}>
                      {item.title}
                    </Text>
>>>>>>> 09e8728d8833f2d2b7132f974edb63ae2f3ee20e

                    <Text style={styles.description}>
                      {item.description}
                    </Text>

                    <View style={styles.dateRow}>
                      <Text style={styles.time}>
                        {item.time}
                      </Text>

                      <Text style={styles.date}>
                        {item.date}
                      </Text>
                    </View>
                  </View>

                  {item.unread && (
<<<<<<< HEAD
                    <View style={styles.notificationDot} />
=======
                    <View
                      style={styles.notificationDot}
                    />
>>>>>>> 09e8728d8833f2d2b7132f974edb63ae2f3ee20e
                  )}
                </TouchableOpacity>
              ))}
        </ScrollView>

        <SafeAreaView
          edges={["bottom"]}
          style={styles.bottomContainer}
        >
          <View style={styles.bottomBar}>
            {[
              ["home", "/home", "home-outline", 35],
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
            ].map(([tab, route, icon, size]) => (
              <TouchableOpacity
                key={tab}
                style={styles.navItem}
                onPress={() => nav(tab, route)}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name={icon}
                  size={size}
<<<<<<< HEAD
                  color={
                    activeTab === tab
                      ? "#FFFFFF"
                      : "rgba(255,255,255,0.6)"
                  }
=======
                  color="#FFFFFF"
>>>>>>> 09e8728d8833f2d2b7132f974edb63ae2f3ee20e
                />
              </TouchableOpacity>
            ))}
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
    width: 30,
    alignItems: "flex-start",
    justifyContent: "center",
    transform: [{ translateY: 4 }],
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "700",
    transform: [
<<<<<<< HEAD
      { translateX: -5},
=======
      { translateX: -5 },
>>>>>>> 09e8728d8833f2d2b7132f974edb63ae2f3ee20e
      { translateY: 1 },
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