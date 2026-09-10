import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { auth, db } from "../../firebaseConfig.js";

export default function LogoutDevices() {
  const { width } = useWindowDimensions();
  const [loading, setLoading] = useState(false);

  const isSmallScreen = width < 360;
  const isMediumScreen = width >= 360 && width < 600;
  const isTablet = width >= 600 && width < 900;

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

  const navItems = [
    {
      icon: "home-outline",
      route: "/home",
    },
    {
      icon: "chart-box-outline",
      route: "/historial",
    },
    {
      icon: "swap-horizontal",
      route: "/administracion-gastos",
    },
    {
      icon: "layers-outline",
      route: "/currentgoal",
    },
    {
      icon: "account-outline",
      route: "/Edit_profile",
    },
  ];

  const logoutEverywhere = async () => {
    if (loading) return;

    const user = auth.currentUser;

    if (!user) {
      Alert.alert(
        "Error",
        "No hay una sesión activa."
      );
      return;
    }

    setLoading(true);

    try {
      const uid = user.uid;

      const usersQuery = query(
        collection(db, "users"),
        where("uid", "==", uid)
      );

      const snapshot = await getDocs(usersQuery);

      if (snapshot.empty) {
        Alert.alert(
          "Error",
          "No se encontró el usuario en la base de datos."
        );
        setLoading(false);
        return;
      }

      const userDocument = snapshot.docs[0];

      await updateDoc(userDocument.ref, {
        sessionVersion: increment(1),
      });

      await signOut(auth);

      router.replace("/login");
    } catch (error) {
      console.log(
        "Error al cerrar sesión en todos los dispositivos:",
        error
      );

      Alert.alert(
        "Error",
        "No se pudieron cerrar las sesiones. Intenta nuevamente."
      );

      setLoading(false);
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
            height: s(115),
            paddingHorizontal: horizontalPadding,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.backButton,
            {
              transform: [
                { translateY: 4 * scale },
                { translateX: -4 * scale },
              ],
            },
          ]}
          onPress={() => router.push("/signout")}
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
              fontSize: s(19),
              lineHeight: s(23),
            },
          ]}
        >
          Log out on all your{"\n"}devices
        </Text>

        <TouchableOpacity
          style={[
            styles.headerBell,
            {
              transform: [{ translateY: 3 * scale }],
            },
          ]}
          onPress={() => router.push("/notifications")}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="bell-circle-outline"
            size={35 * scale}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.main,
          {
            borderTopLeftRadius: s(36),
            borderTopRightRadius: s(36),
          },
        ]}
      >
        <View
          style={[
            styles.content,
            {
              paddingTop: s(10),
              paddingHorizontal: horizontalPadding,
            },
          ]}
        >
          <Image
            source={require(
              "../../assets/images/Screenshot 2026-08-28 21253461.png"
            )}
            style={{
              width: s(210),
              height: s(210),
              marginTop: s(-17),
              transform: [{ translateX: -5 * scale }],
            }}
            resizeMode="contain"
          />

          <Text
            style={[
              styles.description,
              {
                fontSize: s(14),
                lineHeight: s(20),
                marginTop: s(20),
                transform: [{ translateY: -23 * scale }],
              },
            ]}
          >
            You will be signed out on all the{"\n"}
            devices you are logged into.
          </Text>

          <Text
            style={[
              styles.question,
              {
                fontSize: s(25),
                marginTop: s(25),
                transform: [{ translateY: -29 * scale }],
              },
            ]}
          >
            Do you want to continue?
          </Text>

          <View
            style={[
              styles.buttonsContainer,
              {
                marginTop: s(40),
                transform: [{ translateY: -45 * scale }],
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  width: s(190),
                  height: s(44),
                  borderRadius: s(22),
                  opacity: loading ? 0.6 : 1,
                },
              ]}
              onPress={logoutEverywhere}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    fontSize: s(14),
                  },
                ]}
              >
                {loading ? "Logging out..." : "Continue"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  width: s(190),
                  height: s(44),
                  borderRadius: s(22),
                  marginTop: s(12),
                },
              ]}
              onPress={() => router.back()}
              disabled={loading}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    fontSize: s(13),
                  },
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[
            styles.bottomBar,
            {
              height: 65 * scale,
              borderTopLeftRadius: 78 * scale,
            },
          ]}
        >
          {navItems.map((item) => (
            <TouchableOpacity
              key={item.icon}
              style={styles.navButton}
              onPress={() => router.push(item.route)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={35 * scale}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          ))}
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
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    justifyContent: "center",
    alignItems: "flex-start",
  },

  headerTitle: {
    flex: 1,
    color: "#FFFFFF",
    fontWeight: "700",
    textAlign: "center",
    transform: [{ translateY: 9 }],
  },

  headerBell: {
    justifyContent: "center",
  },

  main: {
    flex: 1,
    width: "100%",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },

  content: {
    flex: 1,
    alignItems: "center",
  },

  description: {
    color: "#071426",
    textAlign: "center",
  },

  question: {
    color: "#071426",
    textAlign: "center",
    fontWeight: "400",
  },

  buttonsContainer: {
    alignItems: "center",
  },

  actionButton: {
    backgroundColor: "#071426",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "505",
  },

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

  navButton: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});