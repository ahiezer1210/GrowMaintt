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
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppSettings } from "../../context/Appsettings";
import { auth, db } from "../../firebaseConfig";

const categories = [
  "All",
  "Savings",
  "Investment",
  "Rewards",
  "Security",
];

const getSecurityTitle = (type, t) => {
  const titles = {
    new_device_login: t.newLoginDetected,
    login_attempt: t.loginDetected,
    password_change: t.passwordChanged,
    password_reset: t.passwordReset,
    email_change: t.emailChanged,
    phone_change: t.phoneChanged,
    profile_change: t.profileUpdated,
    device_unlinked: t.deviceUnlinked,
    suspicious_activity: t.suspiciousActivity,
  };

  return titles[type] || t.securityAlert;
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

const formatDate = (timestamp, language) => {
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

  const locale = language === "es" ? "es-ES" : "en-US";

  const date = dateObject.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const time = dateObject.toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "2-digit",
  });

  const fullDate = `${date} ${
    language === "es" ? "a las" : "at"
  } ${time}`;

  return {
    date,
    time,
    fullDate,
    createdAt: dateObject.getTime(),
  };
};

export default function NotificationsScreen() {
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams();
  const { colors, t, language } = useAppSettings();

  const isSmallScreen = width < 360;
  const isMediumScreen = width >= 360 && width < 600;
  const isTablet = width >= 600;
  const isLargeScreen = width >= 900;

  const scale = isSmallScreen
    ? 0.85
    : isMediumScreen
    ? 1
    : isLargeScreen
    ? 1.25
    : isTablet
    ? 1.15
    : 1;

  const horizontalPadding = isSmallScreen
    ? 18
    : isMediumScreen
    ? 25
    : isTablet
    ? 45
    : 60;

  const s = (value) => Math.round(value * scale);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");

  const categoryLabels = {
    All: t.all,
    Savings: t.savings,
    Investment: t.investments,
    Rewards: t.rewards,
    Security: t.security,
  };

  useEffect(() => {
    const user = auth.currentUser;

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
        const securityNotifications = snapshot.docs.map(
          (item) => {
            const alert = item.data();

            const formatted = formatDate(
              alert.createdAt,
              language
            );

            return {
              id: `security-${item.id}`,
              alertId: item.id,
              notificationId: null,
              category: "Security",
              collectionName: "securityAlerts",
              type: alert.type || "security",
              title: getSecurityTitle(
                alert.type,
                t
              ),
              description:
                alert.message ||
                alert.description ||
                t.securityEventDetected,
              deviceName:
                alert.deviceName || null,
              amount: null,
              points: null,
              store: null,
              code: null,
              rewardId: null,
              rewardTitle: null,
              redeemedId: null,
              status:
                alert.read === true
                  ? "Read"
                  : "Unread",
              unread: alert.read !== true,
              time: formatted.time,
              date: formatted.date,
              fullDate: formatted.fullDate,
              icon: getSecurityIcon(
                alert.type
              ),
              createdAt:
                formatted.createdAt,
            };
          }
        );

        setNotifications((previous) => {
          const generalNotifications =
            previous.filter(
              (item) =>
                item.category !== "Security"
            );

          return [
            ...generalNotifications,
            ...securityNotifications,
          ].sort(
            (a, b) =>
              b.createdAt - a.createdAt
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
          const data = snapshot.exists()
            ? snapshot.data()
            : {};

          const notificationArray =
            Array.isArray(data.notifications)
              ? data.notifications
              : [];

          const mappedNotifications =
            notificationArray.map(
              (notification, index) => {
                const formatted = formatDate(
                  notification.createdAt,
                  language
                );

                const notificationId =
                  notification.id ||
                  `${category.toLowerCase()}-${index}-${formatted.createdAt}`;

                return {
                  id: `notification-${snapshot.id}-${notificationId}`,
                  alertId: snapshot.id,
                  notificationId,
                  category:
                    notification.category ||
                    category,
                  collectionName:
                    "Notificaciones",
                  type:
                    notification.type ||
                    "notification",
                  title:
                    notification.title ||
                    t.newNotification,
                  description:
                    notification.message ||
                    notification.description ||
                    t.newNotificationDescription,
                  deviceName:
                    notification.deviceName ||
                    null,
                  amount:
                    notification.amount ??
                    null,
                  points:
                    notification.points ??
                    null,
                  store:
                    notification.store ||
                    null,
                  code:
                    notification.code ||
                    null,
                  rewardId:
                    notification.rewardId ||
                    null,
                  rewardTitle:
                    notification.rewardTitle ||
                    null,
                  redeemedId:
                    notification.redeemedId ||
                    null,
                  status:
                    notification.read === true
                      ? "Read"
                      : "Unread",
                  unread:
                    notification.read !== true,
                  time: formatted.time,
                  date: formatted.date,
                  fullDate:
                    formatted.fullDate,
                  icon:
                    notification.icon ||
                    getGeneralIcon(
                      notification.category ||
                        category
                    ),
                  createdAt:
                    formatted.createdAt,
                };
              }
            );

          setNotifications((previous) => {
            const otherNotifications =
              previous.filter(
                (item) =>
                  !(
                    item.collectionName ===
                      "Notificaciones" &&
                    item.category === category
                  )
              );

            return [
              ...otherNotifications,
              ...mappedNotifications,
            ].sort(
              (a, b) =>
                b.createdAt - a.createdAt
            );
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
      unsubscribers.forEach((unsubscribe) =>
        unsubscribe()
      );
    };
  }, [language, t]);

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

  const openNotification = async (
    notification
  ) => {
    const user = auth.currentUser;

    if (!user?.uid) {
      return;
    }

    try {
      if (
        notification.category === "Security"
      ) {
        const ref = doc(
          db,
          "Users",
          user.uid,
          "securityAlerts",
          notification.alertId
        );

        if (notification.unread) {
          await runTransaction(
            db,
            async (transaction) => {
              const snapshot =
                await transaction.get(ref);

              if (!snapshot.exists()) {
                return;
              }

              transaction.update(ref, {
                read: true,
              });
            }
          );
        }

        router.push({
          pathname: "/security_alert",
          params: {
            id: notification.alertId,
            category: "Security",
            collectionName:
              "securityAlerts",
          },
        });

        return;
      }

      const category =
        notification.category;

      const notificationRef = doc(
        db,
        "Notificaciones",
        `${user.uid}_${category}`
      );

      if (notification.unread) {
        await runTransaction(
          db,
          async (transaction) => {
            const snapshot =
              await transaction.get(
                notificationRef
              );

            if (!snapshot.exists()) {
              return;
            }

            const data =
              snapshot.data();

            const notificationArray =
              Array.isArray(
                data.notifications
              )
                ? data.notifications
                : [];

            const updatedNotifications =
              notificationArray.map(
                (item, index) => {
                  const itemId =
                    item.id ||
                    `${category.toLowerCase()}-${index}`;

                  if (
                    String(itemId) ===
                    String(
                      notification.notificationId
                    )
                  ) {
                    return {
                      ...item,
                      read: true,
                    };
                  }

                  return item;
                }
              );

            transaction.update(
              notificationRef,
              {
                notifications:
                  updatedNotifications,
              }
            );
          }
        );
      }

      router.push({
        pathname: "/security_alert",
        params: {
          id:
            notification.notificationId,
          category:
            notification.category,
          collectionName:
            "Notificaciones",
          parentId:
            notification.alertId,
        },
      });
    } catch (error) {
      console.log(
        "Error opening notification:",
        error
      );
    }
  };

  const markAllAsRead = async () => {
    const user = auth.currentUser;

    if (!user?.uid) {
      return;
    }

    try {
      const batch = writeBatch(db);

      const unreadSecurity =
        notifications.filter(
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

        await runTransaction(
          db,
          async (transaction) => {
            const snapshot =
              await transaction.get(
                notificationRef
              );

            if (!snapshot.exists()) {
              return;
            }

            const data =
              snapshot.data();

            const notificationArray =
              Array.isArray(
                data.notifications
              )
                ? data.notifications
                : [];

            if (
              notificationArray.length ===
              0
            ) {
              return;
            }

            const updatedNotifications =
              notificationArray.map(
                (item) => ({
                  ...item,
                  read: true,
                })
              );

            transaction.update(
              notificationRef,
              {
                notifications:
                  updatedNotifications,
              }
            );
          }
        );
      }
    } catch (error) {
      console.log(
        "Error marking notifications as read:",
        error
      );
    }
  };

  const nav = (tab, route) => {
    setActiveTab(tab);
    router.push(route);
  };

  const volver = () => {
    const from = params?.from;

    if (from === "/backup") {
      router.push("/backup");
    } else if (
      from === "/privacypolicy"
    ) {
      router.push("/privacypolicy");
    } else if (from === "/terms") {
      router.push("/terms");
    } else if (
      from === "/expensesmanagement"
    ) {
      router.push("/expensesmanagement");
    } else if (
      from === "/registerexpenses"
    ) {
      router.push("/registerexpenses");
    } else if (
      from === "/registerinvestments"
    ) {
      router.push("/registerinvestments");
    } else if (
      from === "/usermanual"
    ) {
      router.push("/usermanual");
    } else if (from === "/historial") {
      router.push("/historial");
    } else if (from === "/profile") {
      router.push("/profile");
    } else if (from === "/Edit_profile") {
      router.push("/Edit_profile");
    } else if (from === "/settings") {
      router.push("/settings");
    } else if (
      from === "/linkeddevices"
    ) {
      router.push("/linkeddevices");
    } else if (
      from === "/logoutalldevices"
    ) {
      router.push("/logoutalldevices");
    } else if (from === "/logout") {
      router.push("/logout");
    } else if (
      from === "/currentgoal"
    ) {
      router.push("/currentgoal");
    } else if (
      from === "/investments"
    ) {
      router.push("/investments");
    } else if (
      from === "/pointsExchange"
    ) {
      router.push("/pointsExchange");
    } else if (
      from === "/redemption_history"
    ) {
      router.push("/redemption_history");
    } else if (
      from === "/expensesManagement"
    ) {
      router.push("/expensesManagement");
    } else if (
      from === "/expensecontrolperiod"
    ) {
      router.push("/expensecontrolperiod");
    } else if (
      from === "/registergoals"
    ) {
      router.push("/registergoals");
    } else if (
      from === "/deleteaccount"
    ) {
      router.push("/deleteaccount");
    } else if (
      from === "/security_alert"
    ) {
      router.push("/security_alert");
    } else {
      router.push("/home");
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: colors.header,
        },
      ]}
      edges={["left", "right"]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.header}
      />

      <View
        style={[
          styles.header,
          {
            height: s(118),
            paddingHorizontal:
              horizontalPadding,
            backgroundColor:
              colors.header,
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
            color={colors.white}
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            {
              fontSize: s(25),
              color: colors.white,
            },
          ]}
        >
          {t.notifications}
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
                backgroundColor:
                  colors.icon,
              },
            ]}
          />
        )}

        <TouchableOpacity
          style={[
            styles.markButton,
            {
              right: s(12),
              top: s(34),
              width: s(42),
              height: s(55),
            },
          ]}
          onPress={markAllAsRead}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="check-all"
            size={s(24)}
            color={colors.icon}
          />
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.content,
          {
            borderTopLeftRadius: s(45),
            borderTopRightRadius: s(45),
            paddingTop: s(28),
            backgroundColor:
              colors.background,
          },
        ]}
      >
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
                  backgroundColor:
                    selectedCategory ===
                    category
                      ? colors.icon
                      : colors.input,
                },
              ]}
              onPress={() =>
                setSelectedCategory(
                  category
                )
              }
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    fontSize: s(10),
                    color:
                      selectedCategory ===
                      category
                        ? colors.white
                        : colors.secondaryText,
                  },
                ]}
              >
                {categoryLabels[category]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

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
          showsVerticalScrollIndicator={
            false
          }
        >
          {loading ? (
            <View
              style={[
                styles.empty,
                {
                  minHeight: s(420),
                },
              ]}
            >
              <View
                style={[
                  styles.emptyIcon,
                  {
                    width: s(75),
                    height: s(75),
                    borderRadius: s(38),
                    backgroundColor:
                      colors.input,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="bell-outline"
                  size={s(38)}
                  color={colors.inactive}
                />
              </View>

              <Text
                style={[
                  styles.emptyTitle,
                  {
                    fontSize: s(16),
                    color: colors.text,
                  },
                ]}
              >
                {t.loadingNotifications}
              </Text>
            </View>
          ) : filtered.length === 0 ? (
            <View
              style={[
                styles.empty,
                {
                  minHeight: s(420),
                },
              ]}
            >
              <View
                style={[
                  styles.emptyIcon,
                  {
                    width: s(75),
                    height: s(75),
                    borderRadius: s(38),
                    backgroundColor:
                      colors.input,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="bell-off-outline"
                  size={s(38)}
                  color={colors.inactive}
                />
              </View>

              <Text
                style={[
                  styles.emptyTitle,
                  {
                    fontSize: s(16),
                    color: colors.text,
                  },
                ]}
              >
                {t.noNotifications}
              </Text>

              <Text
                style={[
                  styles.emptyText,
                  {
                    color:
                      colors.secondaryText,
                    fontSize: s(11),
                    lineHeight: s(16),
                  },
                ]}
              >
                {t.noNotificationsDescription ||
                  t.newNotificationDescription}
              </Text>
            </View>
          ) : (
            filtered.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.notification,
                  {
                    minHeight: s(76),
                    borderRadius: s(13),
                    padding: s(11),
                    marginBottom: s(12),
                    backgroundColor:
                      colors.card,
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
                      backgroundColor:
                        colors.input,
                      borderRadius: s(20),
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={s(26)}
                    color={colors.icon}
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
                  <View
                    style={
                      styles.titleRow
                    }
                  >
                    <Text
                      style={[
                        styles.title,
                        {
                          fontSize: s(11),
                          marginBottom: s(3),
                          color: colors.text,
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>

                    {item.unread && (
                      <View
                        style={[
                          styles.notificationDot,
                          {
                            left: undefined,
                            right: s(2),
                            top: s(3),
                            width: s(7),
                            height: s(7),
                            borderRadius: s(7),
                            backgroundColor:
                              colors.icon,
                          },
                        ]}
                      />
                    )}
                  </View>

                  <Text
                    style={[
                      styles.description,
                      {
                        fontSize: s(9),
                        lineHeight: s(12),
                        color:
                          colors.secondaryText,
                      },
                    ]}
                    numberOfLines={2}
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
                          color:
                            colors.secondaryText,
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
                          color:
                            colors.secondaryText,
                        },
                      ]}
                    >
                      {item.date}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        <SafeAreaView
          edges={["bottom"]}
          style={[
            styles.bottomContainer,
            {
              backgroundColor:
                colors.nav,
            },
          ]}
        >
          <View
            style={[
              styles.bottomBar,
              {
                height: s(65),
                borderTopLeftRadius: s(78),
                backgroundColor:
                  colors.nav,
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
              ([
                tab,
                route,
                icon,
                size,
              ]) => (
                <TouchableOpacity
                  key={tab}
                  style={
                    styles.navItem
                  }
                  onPress={() =>
                    nav(tab, route)
                  }
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons
                    name={icon}
                    size={s(size)}
                    color={colors.white}
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

  markButton: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    elevation: 10,
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

  categoryText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#172D3D",
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

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },

  title: {
    flex: 1,
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