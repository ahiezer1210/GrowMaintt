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
import { auth, db } from "../../firebaseConfig";

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

const getCategoryTitle = (category) => {
  const titles = {
    Savings: "Savings",
    Investment: "Investment",
    Rewards: "Reward",
    Security: "Security Alert",
  };

  return titles[category] || "Notification";
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

const getActivity = (type) => {
  const activities = {
    saving_completed: "Saving completed",
    investment_completed: "Investment completed",
    reward_redeemed: "Reward redeemed",
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

  return activities[type] || "Notification activity";
};

const formatDate = (timestamp) => {
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

  const date = dateObject.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const time = dateObject.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return {
    date,
    time,
    fullDate: `${date} at ${time}`,
  };
};

export default function SecurityAlertScreen() {
  const params = useLocalSearchParams();

  const [alertData, setAlertData] = useState(null);
  const [loading, setLoading] = useState(true);

  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const category = Array.isArray(params?.category)
    ? params.category[0]
    : params?.category;

  const collectionName = Array.isArray(params?.collectionName)
    ? params.collectionName[0]
    : params?.collectionName;

  const parentId = Array.isArray(params?.parentId)
    ? params.parentId[0]
    : params?.parentId;

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
          const notificationCategory = category || "Savings";

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

            const foundNotification = notificationArray.find(
              (item) => String(item.id) === String(id)
            );

            if (foundNotification) {
              data = {
                ...foundNotification,
                id,
                category:
                  foundNotification.category || notificationCategory,
              };

              if (foundNotification.read !== true) {
                await runTransaction(db, async (transaction) => {
                  const currentSnapshot = await transaction.get(
                    notificationRef
                  );

                  if (!currentSnapshot.exists()) {
                    return;
                  }

                  const currentData = currentSnapshot.data();

                  const currentNotifications = Array.isArray(
                    currentData.notifications
                  )
                    ? currentData.notifications
                    : [];

                  const updatedNotifications =
                    currentNotifications.map((item) => {
                      if (String(item.id) === String(id)) {
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
            }
          }
        }

        setAlertData(data);
      } catch (error) {
        console.log("Error loading notification:", error);
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
      "A notification was generated for your account."
    );
  };

  const getDisplayDate = () => {
    if (alertData?.createdAt) {
      const formatted = formatDate(alertData.createdAt);

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
      const formatted = formatDate(alertData.createdAt);

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
      return alertData?.title || getSecurityTitle(alertData?.type);
    }

    return alertData?.title || getCategoryTitle(alertData?.category);
  };

  const getIcon = () => {
    if (alertData?.category === "Security") {
      return getSecurityIcon(alertData?.type);
    }

    return alertData?.icon || getCategoryIcon(alertData?.category);
  };

  const getActivityName = () => {
    return getActivity(alertData?.type);
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

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#071426" />

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#25B5D1" />
        </View>
      </SafeAreaView>
    );
  }

  if (!alertData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#071426" />

        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={26}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Security Alert</Text>

            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.content}>
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="bell-off-outline"
                size={52}
                color="#ACADAD"
              />

              <Text style={styles.emptyTitle}>Notification not found</Text>

              <Text style={styles.emptyText}>
                This notification could not be found.
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
      <StatusBar barStyle="light-content" backgroundColor="#071426" />

      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={26}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Security Alert</Text>

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
              color="#25B5D1"
            />
          </View>

          <Text style={styles.title}>{getTitle()}</Text>

          <Text style={styles.description}>{getDescription()}</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <MaterialCommunityIcons
                  name="shape-outline"
                  size={21}
                  color="#25B5D1"
                />
              </View>

              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Category</Text>

                <Text style={styles.infoValue}>
                  {getCategoryTitle(alertData.category)}
                </Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <MaterialCommunityIcons
                  name="calendar-outline"
                  size={21}
                  color="#25B5D1"
                />
              </View>

              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Date</Text>

                <Text style={styles.infoValue}>
                  {getDisplayDate() || "Not available"}
                </Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={21}
                  color="#25B5D1"
                />
              </View>

              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Time</Text>

                <Text style={styles.infoValue}>
                  {getDisplayTime() || "Not available"}
                </Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <MaterialCommunityIcons
                  name="information-outline"
                  size={21}
                  color="#25B5D1"
                />
              </View>

              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Activity</Text>

                <Text style={styles.infoValue}>{getActivityName()}</Text>
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
                      color="#25B5D1"
                    />
                  </View>

                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Amount</Text>

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
                      color="#25B5D1"
                    />
                  </View>

                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Points used</Text>

                    <Text style={styles.infoValue}>{points}</Text>
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
                      color="#25B5D1"
                    />
                  </View>

                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Store</Text>

                    <Text style={styles.infoValue}>{alertData.store}</Text>
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
                      color="#25B5D1"
                    />
                  </View>

                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Code</Text>

                    <Text style={styles.infoValue}>{alertData.code}</Text>
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
                      color="#25B5D1"
                    />
                  </View>

                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Device</Text>

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
            onPress={() => router.replace("/home")}
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
            onPress={() => router.replace("/expensesManagement")}
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
            <MaterialCommunityIcons name="bell" size={27} color="#FFFFFF" />
            <Text style={styles.bottomText}>Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bottomItem}
            onPress={() => router.replace("/profile")}
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

  loadingContainer: {
    flex: 1,
    backgroundColor: "#071426",
    alignItems: "center",
    justifyContent: "center",
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

  headerSpacer: {
    width: 44,
    height: 44,
  },

  content: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
    backgroundColor: "#E4F8FC",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 23,
    fontWeight: "700",
    color: "#0A3438",
    textAlign: "center",
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    color: "#70767A",
    textAlign: "center",
    marginTop: 10,
    maxWidth: 330,
  },

  infoCard: {
    width: "100%",
    backgroundColor: "#F7F8F9",
    borderRadius: 18,
    marginTop: 28,
    paddingHorizontal: 18,
    paddingVertical: 6,
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
    backgroundColor: "#E4F8FC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  infoTextContainer: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 11,
    color: "#9A9FA3",
    marginBottom: 3,
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0A3438",
  },

  separator: {
    height: 1,
    backgroundColor: "#E5E7E8",
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
    color: "#0A3438",
    marginTop: 16,
  },

  emptyText: {
    fontSize: 14,
    color: "#ACADAD",
    textAlign: "center",
    marginTop: 8,
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