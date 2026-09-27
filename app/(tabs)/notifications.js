import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  collection,
  doc,
  onSnapshot,
  runTransaction,
  writeBatch,
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

const categories = [
  "All",
  "Savings",
  "Investment",
  "Rewards",
  "Security",
];

const getSecurityTitle = (type) => {
  const titles = {
    new_device_login: "New login detected",
    login_attempt: "Login detected",
    password_change: "Password changed",
    password_reset: "Password reset",
    email_change: "Email address changed",
    phone_change: "Phone number changed",
    profile_change: "Profile information updated",
    device_unlinked: "Device unlinked",
    suspicious_activity: "Suspicious activity detected",
  };

  return titles[type] || "Security alert";
};

const getSecurityIcon = (type) => {
  const icons = {
    new_device_login: "cellphone-check",
    login_attempt: "login-variant",
    password_change: "lock-check-outline",
    password_reset: "lock-reset",
    email_change: "email-edit-outline",
    phone_change: "phone-edit-outline",
    profile_change: "account-edit-outline",
    device_unlinked: "cellphone-remove",
    suspicious_activity: "alert-circle-outline",
  };

  return icons[type] || "shield-check-outline";
};

const getGeneralIcon = (category) => {
  const icons = {
    Savings: "cash-multiple",
    Investment: "finance",
    Rewards: "medal-outline",
  };

  return icons[category] || "bell-outline";
};

const formatDate = (timestamp) => {
  if (!timestamp) {
    return {
      date: "",
      time: "",
      fullDate: "",
      createdAt: 0,
    };
  }

  let dateObject;

  if (timestamp?.toDate) {
    dateObject = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    dateObject = timestamp;
  } else if (typeof timestamp === "number") {
    dateObject = new Date(timestamp);
  } else {
    dateObject = new Date(timestamp);
  }

  if (Number.isNaN(dateObject.getTime())) {
    return {
      date: "",
      time: "",
      fullDate: "",
      createdAt: 0,
    };
  }

  const date = dateObject.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const time = dateObject.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const fullDate = `${date} at ${time}`;

  return {
    date,
    time,
    fullDate,
    createdAt: dateObject.getTime(),
  };
};

export default function NotificationsScreen() {
  const user = auth.currentUser;
  const params = useLocalSearchParams();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribers = [];

    const securityRef = collection(
      db,
      "Users",
      user.uid,
      "securityAlerts"
    );

    const unsubscribeSecurity = onSnapshot(
      securityRef,
      (snapshot) => {
        const securityNotifications = snapshot.docs.map((item) => {
          const alert = item.data();

          const formatted = formatDate(alert.createdAt);

          return {
            id: `security-${item.id}`,
            alertId: item.id,
            notificationId: null,
            category: "Security",
            collectionName: "securityAlerts",
            type: alert.type || "security",
            title: getSecurityTitle(alert.type),
            description:
              alert.message ||
              alert.description ||
              "A security event was detected on your account.",
            deviceName: alert.deviceName || null,
            amount: null,
            points: null,
            store: null,
            code: null,
            rewardId: null,
            rewardTitle: null,
            redeemedId: null,
            status: alert.read === true ? "Read" : "Unread",
            unread: alert.read !== true,
            time: formatted.time,
            date: formatted.date,
            fullDate: formatted.fullDate,
            icon: getSecurityIcon(alert.type),
            createdAt: formatted.createdAt,
          };
        });

        setNotifications((previous) => {
          const generalNotifications = previous.filter(
            (item) => item.category !== "Security"
          );

          return [...generalNotifications, ...securityNotifications].sort(
            (a, b) => b.createdAt - a.createdAt
          );
        });

        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );

    unsubscribers.push(unsubscribeSecurity);

    const generalCategories = [
      "Savings",
      "Investment",
      "Rewards",
    ];

    generalCategories.forEach((category) => {
      const notificationRef = doc(
        db,
        "Notificaciones",
        `${user.uid}_${category}`
      );

      const unsubscribeGeneral = onSnapshot(
        notificationRef,
        (snapshot) => {
          const data = snapshot.exists() ? snapshot.data() : {};
          const notificationArray = Array.isArray(data.notifications)
            ? data.notifications
            : [];

          const mappedNotifications = notificationArray.map(
            (notification, index) => {
              const formatted = formatDate(notification.createdAt);

              const notificationId =
                notification.id ||
                `${category.toLowerCase()}-${index}-${formatted.createdAt}`;

              return {
                id: `notification-${snapshot.id}-${notificationId}`,
                alertId: snapshot.id,
                notificationId,
                category: notification.category || category,
                collectionName: "Notificaciones",
                type: notification.type || "notification",
                title: notification.title || "New notification",
                description:
                  notification.message ||
                  notification.description ||
                  "You have a new notification.",
                deviceName: notification.deviceName || null,
                amount: notification.amount ?? null,
                points: notification.points ?? null,
                store: notification.store || null,
                code: notification.code || null,
                rewardId: notification.rewardId || null,
                rewardTitle: notification.rewardTitle || null,
                redeemedId: notification.redeemedId || null,
                status:
                  notification.read === true ? "Read" : "Unread",
                unread: notification.read !== true,
                time: formatted.time,
                date: formatted.date,
                fullDate: formatted.fullDate,
                icon:
                  notification.icon ||
                  getGeneralIcon(notification.category || category),
                createdAt: formatted.createdAt,
              };
            }
          );

          setNotifications((previous) => {
            const otherNotifications = previous.filter(
              (item) =>
                !(
                  item.collectionName === "Notificaciones" &&
                  item.category === category
                )
            );

            return [
              ...otherNotifications,
              ...mappedNotifications,
            ].sort((a, b) => b.createdAt - a.createdAt);
          });

          setLoading(false);
        },
        () => {
          setLoading(false);
        }
      );

      unsubscribers.push(unsubscribeGeneral);
    });

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [user?.uid]);

  const filteredNotifications =
    selectedCategory === "All"
      ? notifications
      : notifications.filter(
          (item) => item.category === selectedCategory
        );

  const getBackRoute = () => {
    const from = params?.from;

    const routes = {
      home: "/",
      savings: "/savings",
      investment: "/investment",
      rewards: "/pointsExchange",
      profile: "/Profile",
      expenses: "/expensesManagement",
    };

    return routes[from] || "/";
  };

  const openNotification = async (notification) => {
    if (!user?.uid) return;

    try {
      if (notification.category === "Security") {
        const ref = doc(
          db,
          "Users",
          user.uid,
          "securityAlerts",
          notification.alertId
        );

        if (notification.unread) {
          await runTransaction(db, async (transaction) => {
            const snapshot = await transaction.get(ref);

            if (!snapshot.exists()) {
              return;
            }

            transaction.update(ref, {
              read: true,
            });
          });
        }

        router.push({
          pathname: "/security_alert",
          params: {
            id: notification.alertId,
            category: "Security",
            collectionName: "securityAlerts",
          },
        });

        return;
      }

      const category = notification.category;

      const notificationRef = doc(
        db,
        "Notificaciones",
        `${user.uid}_${category}`
      );

      if (notification.unread) {
        await runTransaction(db, async (transaction) => {
          const snapshot = await transaction.get(notificationRef);

          if (!snapshot.exists()) {
            return;
          }

          const data = snapshot.data();
          const notificationArray = Array.isArray(data.notifications)
            ? data.notifications
            : [];

          const updatedNotifications = notificationArray.map((item) => {
            const itemId =
              item.id ||
              `${category.toLowerCase()}-${notificationArray.indexOf(item)}`;

            if (
              String(itemId) === String(notification.notificationId)
            ) {
              return {
                ...item,
                read: true,
              };
            }

            return item;
          });

          transaction.update(notificationRef, {
            notifications: updatedNotifications,
          });
        });
      }

      router.push({
        pathname: "/security_alert",
        params: {
          id: notification.notificationId,
          category: notification.category,
          collectionName: "Notificaciones",
          parentId: notification.alertId,
        },
      });
    } catch (error) {
      console.log("Error opening notification:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!user?.uid) return;

    try {
      const batch = writeBatch(db);

      const unreadSecurity = notifications.filter(
        (item) =>
          item.category === "Security" &&
          item.unread === true
      );

      unreadSecurity.forEach((item) => {
        const ref = doc(
          db,
          "Users",
          user.uid,
          "securityAlerts",
          item.alertId
        );

        batch.update(ref, {
          read: true,
        });
      });

      if (unreadSecurity.length > 0) {
        await batch.commit();
      }

      const generalCategories = [
        "Savings",
        "Investment",
        "Rewards",
      ];

      for (const category of generalCategories) {
        const notificationRef = doc(
          db,
          "Notificaciones",
          `${user.uid}_${category}`
        );

        await runTransaction(db, async (transaction) => {
          const snapshot = await transaction.get(notificationRef);

          if (!snapshot.exists()) {
            return;
          }

          const data = snapshot.data();
          const notificationArray = Array.isArray(data.notifications)
            ? data.notifications
            : [];

          const updatedNotifications = notificationArray.map(
            (item) => ({
              ...item,
              read: true,
            })
          );

          transaction.update(notificationRef, {
            notifications: updatedNotifications,
          });
        });
      }
    } catch (error) {
      console.log("Error marking notifications as read:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#071426"
      />

      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace(getBackRoute())}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={26}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Notifications
          </Text>

          <TouchableOpacity
            style={styles.markButton}
            onPress={markAllAsRead}
          >
            <MaterialCommunityIcons
              name="check-all"
              size={23}
              color="#25B5D1"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.categoryContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScroll}
            >
              {categories.map((category) => {
                const active = selectedCategory === category;

                return (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      active && styles.categoryButtonActive,
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        active && styles.categoryTextActive,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <ScrollView
            style={styles.notificationScroll}
            contentContainerStyle={styles.notificationContent}
            showsVerticalScrollIndicator={false}
          >
            {loading ? (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons
                  name="bell-outline"
                  size={48}
                  color="#ACADAD"
                />
                <Text style={styles.emptyText}>
                  Loading notifications...
                </Text>
              </View>
            ) : filteredNotifications.length === 0 ? (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons
                  name="bell-outline"
                  size={48}
                  color="#ACADAD"
                />
                <Text style={styles.emptyText}>
                  No notifications
                </Text>
              </View>
            ) : (
              filteredNotifications.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  style={styles.notificationCard}
                  activeOpacity={0.8}
                  onPress={() =>
                    openNotification(notification)
                  }
                >
                  <View style={styles.iconContainer}>
                    <MaterialCommunityIcons
                      name={
                        notification.icon ||
                        "bell-outline"
                      }
                      size={25}
                      color="#25B5D1"
                    />
                  </View>

                  <View style={styles.notificationInfo}>
                    <View style={styles.titleRow}>
                      <Text
                        style={styles.notificationTitle}
                        numberOfLines={1}
                      >
                        {notification.title}
                      </Text>

                      {notification.unread && (
                        <View style={styles.unreadDot} />
                      )}
                    </View>

                    <Text
                      style={styles.notificationDescription}
                      numberOfLines={2}
                    >
                      {notification.description}
                    </Text>

                    <View style={styles.dateRow}>
                      <Text style={styles.dateText}>
                        {notification.date}
                      </Text>

                      <Text style={styles.timeText}>
                        {notification.time}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.bottomItem}
            onPress={() => router.replace("/")}
          >
            <MaterialCommunityIcons
              name="home-outline"
              size={25}
              color="#FFFFFF"
            />
            <Text style={styles.bottomText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bottomItem}
            onPress={() =>
              router.replace("/expensesManagement")
            }
          >
            <MaterialCommunityIcons
              name="wallet-outline"
              size={25}
              color="#FFFFFF"
            />
            <Text style={styles.bottomText}>Expenses</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bottomItem}
            onPress={() => router.replace("/notifications")}
          >
            <MaterialCommunityIcons
              name="bell"
              size={27}
              color="#FFFFFF"
            />
            <Text style={styles.bottomText}>Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bottomItem}
            onPress={() => router.replace("/Profile")}
          >
            <MaterialCommunityIcons
              name="account-outline"
              size={25}
              color="#FFFFFF"
            />
            <Text style={styles.bottomText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#071426",
  },

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
    paddingHorizontal: 24,
  },

  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },

  markButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    overflow: "hidden",
  },

  categoryContainer: {
    paddingTop: 22,
    paddingBottom: 12,
  },

  categoryScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },

  categoryButton: {
    paddingHorizontal: 18,
    height: 40,
    borderRadius: 22,
    backgroundColor: "#F1F3F4",
    alignItems: "center",
    justifyContent: "center",
  },

  categoryButtonActive: {
    backgroundColor: "#25B5D1",
  },

  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6F7378",
  },

  categoryTextActive: {
    color: "#FFFFFF",
  },

  notificationScroll: {
    flex: 1,
  },

  notificationContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    paddingTop: 8,
  },

  notificationCard: {
    minHeight: 126,
    backgroundColor: "#F7F8F9",
    borderRadius: 17,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E4F8FC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  notificationInfo: {
    flex: 1,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  notificationTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#0A3438",
  },

  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#25B5D1",
    marginLeft: 8,
  },

  notificationDescription: {
    marginTop: 7,
    fontSize: 13,
    lineHeight: 19,
    color: "#70767A",
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 9,
  },

  dateText: {
    fontSize: 11,
    color: "#9A9FA3",
  },

  timeText: {
    fontSize: 11,
    color: "#9A9FA3",
    marginLeft: 10,
  },

  emptyContainer: {
    flex: 1,
    minHeight: 400,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    marginTop: 12,
    fontSize: 15,
    color: "#ACADAD",
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 92,
    backgroundColor: "#25B5D1",
    borderTopLeftRadius: 78,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 12,
  },

  bottomItem: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 72,
  },

  bottomText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 3,
  },
});