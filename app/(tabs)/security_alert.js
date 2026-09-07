import { router, useLocalSearchParams } from "expo-router";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
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
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { auth, db } from "../../firebaseConfig";

export default function SecurityAlertScreen() {
  const { width, height } = useWindowDimensions();
  const { id } = useLocalSearchParams();

  const small = width < 350;
  const short = height < 700;

  const [loading, setLoading] = useState(false);
  const [loadingAlert, setLoadingAlert] = useState(true);
  const [deviceName, setDeviceName] = useState("Unknown device");
  const [location, setLocation] = useState("Unknown location");

  useEffect(() => {
    const loadAlert = async () => {
      try {
        const user = auth.currentUser;

        if (!user || !id) return;

        const ref = doc(db, "Users", user.uid, "securityAlerts", String(id));

        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) {
          Alert.alert(
            "Alert not found",
            "This security alert no longer exists.",
            [{ text: "OK", onPress: () => router.back() }],
          );
          return;
        }

        const data = snapshot.data();
        setDeviceName(data.deviceName || "Unknown device");
        setLocation(data.location || "Unknown location");
      } catch (error) {
        console.log("Error loading alert:", error);
        Alert.alert("Error", "Could not load the security alert.");
      } finally {
        setLoadingAlert(false);
      }
    };

    loadAlert();
  }, [id]);

  const respond = async (response) => {
    if (loading || !id) return;

    setLoading(true);

    try {
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Sesión requerida", "Debes iniciar sesión para continuar.");
        return;
      }

      const alertRef = doc(db, "Users", user.uid, "securityAlerts", String(id));

      await updateDoc(alertRef, {
        status: response,
        read: true,
        respondedAt: serverTimestamp(),
      });

      if (response === "recognized") {
        const alertSnapshot = await getDoc(alertRef);
        const data = alertSnapshot.data();

        if (data?.deviceId) {
          const deviceRef = doc(
            db,
            "Users",
            user.uid,
            "devices",
            data.deviceId,
          );

          await updateDoc(deviceRef, {
            trusted: true,
          });
        }

        Alert.alert(
          "Login confirmado",
          "Este dispositivo ha sido reconocido correctamente.",
          [{ text: "OK", onPress: () => router.back() }],
        );
      } else {
        Alert.alert(
          "Login no reconocido",
          "La alerta de seguridad fue registrada.",
          [{ text: "OK", onPress: () => router.back() }],
        );
      }
    } catch (error) {
      console.log("Error:", error);
      Alert.alert("Error", "No se pudo procesar tu respuesta.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingAlert) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0B1C2D" />
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#2B6CE5" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B1C2D" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Icon name="chevron-back" size={small ? 22 : 24} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Security Alert</Text>

        <TouchableOpacity
          style={styles.checkCircle}
          onPress={() => router.push("/notifications")}
        >
          <Icon name="notifications" size={small ? 24 : 26} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.content,
          small && styles.contentSmall,
          short && styles.contentShort,
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <View style={[styles.iconContainer, small && styles.iconSmall]}>
            <View style={[styles.outerCircle, small && styles.outerSmall]}>
              <View style={[styles.warning, small && styles.warningSmall]}>
                <Text
                  style={[styles.exclamation, small && styles.exclamationSmall]}
                >
                  !
                </Text>
              </View>
            </View>

            <View style={[styles.line, styles.topLeft]} />
            <View style={[styles.line, styles.topRight]} />
            <View style={[styles.line, styles.bottomLeft]} />
            <View style={[styles.line, styles.bottomRight]} />
          </View>

          <Text style={[styles.mainTitle, small && styles.mainTitleSmall]}>
            New Login Attempt
          </Text>

          <View style={styles.infoRow}>
            <MaterialIcons
              name="smartphone"
              size={small ? 65 : 75}
              color="#333"
            />

            <View style={styles.infoText}>
              <Text style={[styles.label, small && styles.textSmall]}>
                Device
              </Text>
              <Text style={[styles.value, small && styles.textSmall]}>
                {deviceName}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="location-outline" size={small ? 27 : 30} color="#333" />
            <Text style={[styles.location, small && styles.locationSmall]}>
              {location}
            </Text>
          </View>

          <Text style={[styles.question, small && styles.questionSmall]}>
            Was this you?
          </Text>

          <TouchableOpacity
            style={[styles.button, small && styles.buttonSmall]}
            disabled={loading}
            onPress={() => respond("recognized")}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text
                style={[styles.buttonText, small && styles.buttonTextSmall]}
              >
                Yes, It Was Me
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, small && styles.buttonSmall]}
            disabled={loading}
            onPress={() => respond("not_recognized")}
          >
            <Text style={[styles.buttonText, small && styles.buttonTextSmall]}>
              No, It Was Not Me
            </Text>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>

      <View style={styles.bottomNav}>
        {[
          ["home-outline", "/home"],
          ["bar-chart-outline", "/reports"],
          ["swap-horizontal-outline", "/transactions"],
          ["layers-outline", "/notifications"],
          ["person-outline", "/profile"],
        ].map(([icon, route]) => (
          <TouchableOpacity
            key={route}
            style={styles.navItem}
            onPress={() => router.push(route)}
          >
            <Icon name={icon} size={small ? 22 : 24} color="#FFF" />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1C2D",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#0B1C2D",
  },
  back: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  contentSmall: {
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  contentShort: {
    paddingTop: 12,
  },
  scroll: {
    alignItems: "center",
    paddingBottom: 30,
  },
  iconContainer: {
    width: 160,
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  iconSmall: {
    width: 135,
    height: 135,
    marginBottom: 15,
  },
  outerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#E8F0FE",
    justifyContent: "center",
    alignItems: "center",
  },
  outerSmall: {
    width: 115,
    height: 115,
    borderRadius: 58,
  },
  warning: {
    width: 72,
    height: 72,
    backgroundColor: "#2B6CE5",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  warningSmall: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  exclamation: {
    color: "#FFF",
    fontSize: 42,
    fontWeight: "bold",
  },
  exclamationSmall: {
    fontSize: 36,
  },
  line: {
    position: "absolute",
    width: 16,
    height: 3,
    backgroundColor: "#2B6CE5",
    borderRadius: 2,
  },
  topLeft: {
    top: 18,
    left: 12,
    transform: [{ rotate: "-40deg" }],
  },
  topRight: {
    top: 18,
    right: 12,
    transform: [{ rotate: "40deg" }],
  },
  bottomLeft: {
    bottom: 22,
    left: 12,
    transform: [{ rotate: "40deg" }],
  },
  bottomRight: {
    bottom: 22,
    right: 12,
    transform: [{ rotate: "-40deg" }],
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 28,
    textAlign: "center",
  },
  mainTitleSmall: {
    fontSize: 19,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 18,
    paddingHorizontal: 8,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
  },
  label: {
    fontSize: 13,
    color: "#666",
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  textSmall: {
    fontSize: 13,
  },
  location: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "500",
    color: "#1A1A1A",
    paddingLeft: 12,
  },
  locationSmall: {
    fontSize: 13,
    marginLeft: 8,
    paddingLeft: 8,
  },
  question: {
    fontSize: 16,
    color: "#555",
    marginTop: 12,
    marginBottom: 24,
  },
  questionSmall: {
    fontSize: 13,
    marginTop: 8,
    marginBottom: 16,
  },
  button: {
    width: "65%",
    backgroundColor: "#0B1C2D",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 14,
  },
  buttonSmall: {
    paddingVertical: 13,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextSmall: {
    fontSize: 14,
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#00B4D8",
    paddingVertical: 14,
    paddingBottom: 20,
    justifyContent: "space-around",
    alignItems: "center",
    borderTopLeftRadius: 65,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    padding: 8,
  },
  loading: {
    flex: 1,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
});
