import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { auth, db } from "../../firebaseConfig";

export default function SecurityAlertScreen() {
  const { id } = useLocalSearchParams();
  const { width } = useWindowDimensions();

  const [alertData, setAlertData] = useState(null);
  const [loading, setLoading] = useState(true);

  const isSmall = width < 360;
  const isTablet = width >= 768;

  const scale = isSmall ? 0.85 : isTablet ? 1.15 : 1;

  useEffect(() => {
    const loadAlert = async () => {
      try {
        if (!id || !auth.currentUser) {
          setLoading(false);
          return;
        }

        const alertRef = doc(
          db,
          "Users",
          auth.currentUser.uid,
          "securityAlerts",
          id
        );

        const snap = await getDoc(alertRef);

        if (snap.exists()) {
          setAlertData({
            id: snap.id,
            ...snap.data(),
          });

          if (snap.data().read !== true) {
            await updateDoc(alertRef, {
              read: true,
              readAt: serverTimestamp(),
            });
          }
        }
      } catch (error) {
        console.log("Error cargando alerta:", error);
        Alert.alert(
          "Error",
          "No se pudo cargar la alerta de seguridad."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAlert();
  }, [id]);

  const navItems = [
    { icon: "home-outline", route: "/home" },
    { icon: "chart-box-outline", route: "/historial" },
    { icon: "swap-horizontal", route: "/expensesManagement" },
    { icon: "layers-outline", route: "/currentgoal" },
    { icon: "account-outline", route: "/profile" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#071426"
      />

      <View style={styles.container}>

        {/* HEADER */}
        <View
          style={[
            styles.header,
            {
              height: 118 * scale,
              paddingHorizontal: isSmall
                ? 18
                : isTablet
                ? 45
                : 25,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.push("/notifications")}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={35 * scale}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <Text
            style={[
              styles.headerTitle,
              {
                fontSize: 25 * scale,
                transform: [
                  {
                    translateX: 7 * scale,
                  },
                  {
                    translateY: 1 * scale,
                  },
                ],
              },
            ]}
          >
            Security Alert
          </Text>
        </View>

        {/* CONTENIDO */}
        <View
          style={[
            styles.contentCard,
            {
              borderTopLeftRadius: isTablet
                ? 55
                : isSmall
                ? 35
                : 45,
              borderTopRightRadius: isTablet
                ? 55
                : isSmall
                ? 35
                : 45,
            },
          ]}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="large"
                color="#25B5D1"
              />
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.scrollContent,
                {
                  paddingBottom: 100 * scale,
                },
              ]}
            >
              <View style={styles.alertIconContainer}>
                <MaterialCommunityIcons
                  name="shield-alert-outline"
                  size={58 * scale}
                  color="#25B5D1"
                />
              </View>

              <Text
                style={[
                  styles.alertTitle,
                  {
                    fontSize: 24 * scale,
                  },
                ]}
              >
                {alertData?.title || "Security Alert"}
              </Text>

              <Text
                style={[
                  styles.alertMessage,
                  {
                    fontSize: 16 * scale,
                  },
                ]}
              >
                {alertData?.message ||
                  "There is no additional information available for this alert."}
              </Text>

              {alertData?.createdAt && (
                <Text
                  style={[
                    styles.alertDate,
                    {
                      fontSize: 13 * scale,
                    },
                  ]}
                >
                  {alertData.createdAt?.toDate
                    ? alertData.createdAt.toDate().toLocaleString()
                    : ""}
                </Text>
              )}
            </ScrollView>
          )}
        </View>

        {/* NAVBAR */}
        <View
          style={[
            styles.bottomBar,
            {
              height: 65 * scale,
              borderTopLeftRadius: 78 * scale,
            },
          ]}
        >
          {navItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.navItem}
              activeOpacity={0.7}
              onPress={() => router.push(item.route)}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={
                  item.icon === "swap-horizontal"
                    ? 37 * scale
                    : 35 * scale
                }
                color="#FFFFFF"
              />
            </TouchableOpacity>
          ))}
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

  /* HEADER */
  header: {
    backgroundColor: "#071426",
    flexDirection: "row",
    alignItems: "center",
  },

  headerButton: {
    width: 45,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontWeight: "700",
    marginLeft: 8,
  },

  /* CARD */
  contentCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 25,
    paddingTop: 35,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  alertIconContainer: {
    width: 105,
    height: 105,
    borderRadius: 52.5,
    backgroundColor: "#EAF9FC",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 25,
  },

  alertTitle: {
    color: "#071426",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 15,
  },

  alertMessage: {
    color: "#555555",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 500,
  },

  alertDate: {
    color: "#999999",
    marginTop: 20,
    textAlign: "center",
  },

  /* NAVBAR */
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#25B5D1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    overflow: "hidden",
  },

  navItem: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});