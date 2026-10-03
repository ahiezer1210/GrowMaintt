import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppSettings } from "../../context/Appsettings";
import { auth, db } from "../../firebaseConfig";

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

const getCategoryTitle = (category, t) => {
  const titles = {
    Savings: t.savings,
    Investment: t.investments,
    Rewards: t.rewards,
    Security: t.securityAlert,
  };

  return titles[category] || t.notifications;
};

const getCategoryIcon = (category) => {
  const icons = {
    Savings: "piggy-bank-outline",
    Investment: "chart-line",
    Rewards: "gift-outline",
    Security: "shield-check-outline",
  };

  return icons[category] || "bell-outline";
};

const getActivity = (type, t) => {
  const activities = {
    saving_completed: t.savingCompleted,
    investment_completed: t.investmentCompleted,
    reward_redeemed: t.rewardRedeemed,
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

  return activities[type] || t.notificationActivity;
};

const formatDate = (timestamp, language) => {
  if (!timestamp) {
    return {
      date: "",
      time: "",
      fullDate: "",
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

  return {
    date,
    time,
    fullDate: `${date} ${
      language === "es" ? "a las" : "at"
    } ${time}`,
  };
};

export default function SecurityAlertScreen() {
  const params = useLocalSearchParams();
  const { colors, t, language } = useAppSettings();

  const [alertData, setAlertData] = useState(null);
  const [loading, setLoading] = useState(true);

  const id = Array.isArray(params?.id)
    ? params.id[0]
    : params?.id;

  const category = Array.isArray(params?.category)
    ? params.category[0]
    : params?.category;

  const collectionName = Array.isArray(
    params?.collectionName
  )
    ? params.collectionName[0]
    : params?.collectionName;

  useEffect(() => {
    const loadNotification = async () => {
      const user = auth.currentUser;

      if (!user?.uid || !id) {
        setLoading(false);
        return;
      }

      try {
        let data = null;

        if (
          category === "Security" ||
          collectionName === "securityAlerts"
        ) {
          const alertRef = doc(
            db,
            "Users",
            user.uid,
            "securityAlerts",
            id
          );

          const snapshot = await getDoc(alertRef);

          if (snapshot.exists()) {
            data = {
              ...snapshot.data(),
              id: snapshot.id,
              category: "Security",
            };

            if (snapshot.data()?.read !== true) {
              await updateDoc(alertRef, {
                read: true,
                readAt: serverTimestamp(),
              });
            }
          }
        } else {
          const notificationCategory =
            category || "Savings";

          const notificationRef = doc(
            db,
            "Notificaciones",
            `${user.uid}_${notificationCategory}`
          );

          const snapshot = await getDoc(notificationRef);

          if (snapshot.exists()) {
            const parentData = snapshot.data();

            const notificationArray = Array.isArray(
              parentData.notifications
            )
              ? parentData.notifications
              : [];

            const foundNotification =
              notificationArray.find(
                (item) =>
                  String(item.id) === String(id)
              );

            if (foundNotification) {
              data = {
                ...foundNotification,
                id,
                category:
                  foundNotification.category ||
                  notificationCategory,
              };

              if (foundNotification.read !== true) {
                await runTransaction(
                  db,
                  async (transaction) => {
                    const currentSnapshot =
                      await transaction.get(
                        notificationRef
                      );

                    if (!currentSnapshot.exists()) {
                      return;
                    }

                    const currentData =
                      currentSnapshot.data();

                    const currentNotifications =
                      Array.isArray(
                        currentData.notifications
                      )
                        ? currentData.notifications
                        : [];

                    const updatedNotifications =
                      currentNotifications.map(
                        (item) => {
                          if (
                            String(item.id) ===
                            String(id)
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
            }
          }
        }

        setAlertData(data);
      } catch (error) {
        console.log(
          "Error loading notification:",
          error
        );
        setAlertData(null);
      } finally {
        setLoading(false);
      }
    };

    loadNotification();
  }, [id, category, collectionName]);

  const getDescription = () => {
    return (
      alertData?.message ||
      alertData?.description ||
      t.newNotificationDescription
    );
  };

  const getDisplayDate = () => {
    if (alertData?.createdAt) {
      const formatted = formatDate(
        alertData.createdAt,
        language
      );

      if (formatted.date) {
        return formatted.date;
      }
    }

    if (alertData?.date) {
      return alertData.date;
    }

    return "";
  };

  const getDisplayTime = () => {
    if (alertData?.createdAt) {
      const formatted = formatDate(
        alertData.createdAt,
        language
      );

      if (formatted.time) {
        return formatted.time;
      }
    }

    if (alertData?.time) {
      return alertData.time;
    }

    return "";
  };

  const getTitle = () => {
    if (alertData?.category === "Security") {
      return (
        alertData?.title ||
        getSecurityTitle(alertData?.type, t)
      );
    }

    return (
      alertData?.title ||
      getCategoryTitle(alertData?.category, t)
    );
  };

  const getIcon = () => {
    if (alertData?.category === "Security") {
      return getSecurityIcon(alertData?.type);
    }

    return (
      alertData?.icon ||
      getCategoryIcon(alertData?.category)
    );
  };

  const getActivityName = () => {
    return getActivity(alertData?.type, t);
  };

  const getAmount = () => {
    if (
      alertData?.amount === null ||
      alertData?.amount === undefined ||
      alertData?.amount === ""
    ) {
      return null;
    }

    return String(alertData.amount);
  };

  const getPoints = () => {
    if (
      alertData?.points === null ||
      alertData?.points === undefined ||
      alertData?.points === ""
    ) {
      return null;
    }

    return String(alertData.points);
  };

  const goBack = () => {
    router.replace("/notifications");
  };

  const styles = createStyles(colors);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.header}
        />

        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={colors.icon}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (!alertData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.header}
        />

        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={goBack}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={26}
                color={colors.white}
              />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>
              {t.securityAlert}
            </Text>

            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.content}>
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="bell-off-outline"
                size={52}
                color={colors.inactive}
              />

              <Text style={styles.emptyTitle}>
                {t.notificationNotFound}
              </Text>

              <Text style={styles.emptyText}>
                {t.notificationCouldNotBeFound}
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const amount = getAmount();
  const points = getPoints();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.header}
      />

      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={goBack}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={26}
              color={colors.white}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            {t.securityAlert}
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons
              name={getIcon()}
              size={38}
              color={colors.icon}
            />
          </View>

          <Text style={styles.title}>
            {getTitle()}
          </Text>

          <Text style={styles.description}>
            {getDescription()}
          </Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <MaterialCommunityIcons
                  name="shape-outline"
                  size={21}
                  color={colors.icon}
                />
              </View>

              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>
                  {t.category}
                </Text>

                <Text style={styles.infoValue}>
                  {getCategoryTitle(
                    alertData.category,
                    t
                  )}
                </Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <MaterialCommunityIcons
                  name="calendar-outline"
                  size={21}
                  color={colors.icon}
                />
              </View>

              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>
                  {t.date}
                </Text>

                <Text style={styles.infoValue}>
                  {getDisplayDate() ||
                    t.notAvailable}
                </Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={21}
                  color={colors.icon}
                />
              </View>

              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>
                  {t.time}
                </Text>

                <Text style={styles.infoValue}>
                  {getDisplayTime() ||
                    t.notAvailable}
                </Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <MaterialCommunityIcons
                  name="information-outline"
                  size={21}
                  color={colors.icon}
                />
              </View>

              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>
                  {t.activity}
                </Text>

                <Text style={styles.infoValue}>
                  {getActivityName()}
                </Text>
              </View>
            </View>

            {amount !== null && (
              <>
                <View style={styles.separator} />

                <View style={styles.infoRow}>
                  <View style={styles.infoIcon}>
                    <MaterialCommunityIcons
                      name="cash"
                      size={21}
                      color={colors.icon}
                    />
                  </View>

                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>
                      {t.amount}
                    </Text>

                    <Text style={styles.infoValue}>
                      ${Number(amount).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </>
            )}

            {points !== null && (
              <>
                <View style={styles.separator} />

                <View style={styles.infoRow}>
                  <View style={styles.infoIcon}>
                    <MaterialCommunityIcons
                      name="star-outline"
                      size={21}
                      color={colors.icon}
                    />
                  </View>

                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>
                      {t.pointsUsed}
                    </Text>

                    <Text style={styles.infoValue}>
                      {points}
                    </Text>
                  </View>
                </View>
              </>
            )}

            {alertData?.store && (
              <>
                <View style={styles.separator} />

                <View style={styles.infoRow}>
                  <View style={styles.infoIcon}>
                    <MaterialCommunityIcons
                      name="store-outline"
                      size={21}
                      color={colors.icon}
                    />
                  </View>

                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>
                      {t.store}
                    </Text>

                    <Text style={styles.infoValue}>
                      {alertData.store}
                    </Text>
                  </View>
                </View>
              </>
            )}

            {alertData?.code && (
              <>
                <View style={styles.separator} />

                <View style={styles.infoRow}>
                  <View style={styles.infoIcon}>
                    <MaterialCommunityIcons
                      name="ticket-confirmation-outline"
                      size={21}
                      color={colors.icon}
                    />
                  </View>

                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>
                      {t.code}
                    </Text>

                    <Text style={styles.infoValue}>
                      {alertData.code}
                    </Text>
                  </View>
                </View>
              </>
            )}

            {alertData?.deviceName && (
              <>
                <View style={styles.separator} />

                <View style={styles.infoRow}>
                  <View style={styles.infoIcon}>
                    <MaterialCommunityIcons
                      name="cellphone"
                      size={21}
                      color={colors.icon}
                    />
                  </View>

                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>
                      {t.device}
                    </Text>

                    <Text style={styles.infoValue}>
                      {alertData.deviceName}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.bottomItem}
            onPress={() => router.replace("/")}
          >
            <MaterialCommunityIcons
              name="home-outline"
              size={25}
              color={colors.white}
            />

            <Text style={styles.bottomText}>
              {t.home}
            </Text>
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
              color={colors.white}
            />

            <Text style={styles.bottomText}>
              {t.expenses}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bottomItem}
            onPress={() =>
              router.replace("/notifications")
            }
          >
            <MaterialCommunityIcons
              name="bell"
              size={27}
              color={colors.white}
            />

            <Text style={styles.bottomText}>
              {t.notifications}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bottomItem}
            onPress={() =>
              router.replace("/Profile")
            }
          >
            <MaterialCommunityIcons
              name="account-outline"
              size={25}
              color={colors.white}
            />

            <Text style={styles.bottomText}>
              {t.profile}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.header,
    },

    container: {
      flex: 1,
      backgroundColor: colors.header,
    },

    loadingContainer: {
      flex: 1,
      backgroundColor: colors.header,
      alignItems: "center",
      justifyContent: "center",
    },

    header: {
      height: 118,
      backgroundColor: colors.header,
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
      color: colors.white,
      fontSize: 24,
      fontWeight: "700",
      transform: [
        { translateX: 5 },
        { translateY: -3 },
      ],
    },

    headerSpacer: {
      width: 44,
      height: 44,
    },

    content: {
      flex: 1,
      backgroundColor: colors.background,
      borderTopLeftRadius: 45,
      borderTopRightRadius: 45,
    },

    scrollContent: {
      paddingHorizontal: 24,
      paddingTop: 34,
      paddingBottom: 125,
      alignItems: "center",
    },

    iconCircle: {
      width: 82,
      height: 82,
      borderRadius: 41,
      backgroundColor: colors.input,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },

    title: {
      fontSize: 23,
      fontWeight: "700",
      color: colors.text,
      textAlign: "center",
    },

    description: {
      fontSize: 14,
      lineHeight: 21,
      color: colors.secondaryText,
      textAlign: "center",
      marginTop: 10,
      maxWidth: 330,
    },

    infoCard: {
      width: "100%",
      backgroundColor: colors.card,
      borderRadius: 18,
      marginTop: 28,
      paddingHorizontal: 18,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: colors.border,
    },

    infoRow: {
      minHeight: 68,
      flexDirection: "row",
      alignItems: "center",
    },

    infoIcon: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: colors.input,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 13,
    },

    infoTextContainer: {
      flex: 1,
    },

    infoLabel: {
      fontSize: 11,
      color: colors.secondaryText,
      marginBottom: 3,
    },

    infoValue: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },

    separator: {
      height: 1,
      backgroundColor: colors.border,
      marginLeft: 55,
    },

    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 30,
    },

    emptyTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginTop: 16,
    },

    emptyText: {
      fontSize: 14,
      color: colors.inactive,
      textAlign: "center",
      marginTop: 8,
    },

    bottomBar: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 92,
      backgroundColor: colors.nav,
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
      color: colors.white,
      fontSize: 11,
      fontWeight: "600",
      marginTop: 3,
    },
  });