import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { doc, onSnapshot } from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

import { auth, db } from "../../firebaseConfig";

import { useEffect, useState } from "react";

import { useAppSettings } from "../../context/Appsettings";

export default function Profile() {
  const { colors, t } = useAppSettings();

  const [username, setUsername] = useState("");
  const [photoURL, setPhotoURL] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeUser = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      // Si cambia el usuario, cancelamos el listener anterior
      if (unsubscribeUser) {
        unsubscribeUser();
        unsubscribeUser = null;
      }

      if (!currentUser) {
        setUsername("");
        setPhotoURL(null);
        setLoading(false);
        return;
      }

      const userRef = doc(db, "Users", currentUser.uid);

      unsubscribeUser = onSnapshot(
        userRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();

            setUsername(data.username || "");
            setPhotoURL(data.photoURL || null);
          } else {
            setUsername("");
            setPhotoURL(null);
          }

          setLoading(false);
        },
        (error) => {
          console.log("Error loading profile:", error);
          setLoading(false);
        }
      );
    });

    return () => {
      if (unsubscribeUser) {
        unsubscribeUser();
      }

      unsubscribeAuth();
    };
  }, []);

  const menuOptions = [
    {
      title: t.editProfile,
      icon: "person-outline",
      color: "#27b6d1",
      route: "/edit_profile",
    },
    {
      title: t.security,
      icon: "shield-checkmark-outline",
      color: "#27b6d1",
      route: "/privacypolicy",
    },
    {
      title: t.settings,
      icon: "settings-outline",
      color: "#27b6d1",
      route: "/settings",
    },
    {
      title: t.termsAndConditions,
      icon: "help-circle-outline",
      color: "#27b6d1",
      route: "/terms",
    },
    {
      title: t.logOut,
      icon: "log-out-outline",
      color: "#27b6d1",
      route: "/logout",
    },
  ];

  const abrirNotificaciones = () => {
    router.push({
      pathname: "/notifications",
      params: {
        from: "/profile",
      },
    });
  };

  // Va a Home reemplazando la pantalla actual.
  const goHome = () => {
    router.replace("/home");
  };

  const { width } = useWindowDimensions();

  const isSmallScreen = width < 360;
  const isMediumScreen = width >= 360 && width < 600;
  const isTablet = width >= 600;

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

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.primaryBackground },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.primaryBackground }]}
    >
      <View style={[styles.header, { backgroundColor: colors.header }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={goHome}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={35 * scale}
            color={colors.white}
          />
        </TouchableOpacity>

        <Text
          pointerEvents="none"
          style={[
            styles.title,
            {
              fontSize: 25 * scale,
              color: colors.white,
            },
          ]}
        >
          {t.profileTitle}
        </Text>

        <TouchableOpacity
          style={[
            styles.notificationButton,
            {
              width: 40 * scale,
              height: 40 * scale,
              borderRadius: 20 * scale,
            },
          ]}
          onPress={abrirNotificaciones}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="bell-circle-outline"
            size={35 * scale}
            color={colors.white}
          />
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.content,
          {
            marginTop: isTablet ? 70 : 40,
            backgroundColor: colors.background,
          },
        ]}
      >
        <View
          style={[
            styles.imageContainer,
            {
              width: isTablet ? 120 : 90,
              height: isTablet ? 120 : 90,
              borderRadius: isTablet ? 60 : 45,
              top: -40,
              borderColor: colors.border,
              backgroundColor: colors.primaryBackground,
            },
          ]}
        >
          {photoURL ? (
            <Image source={{ uri: photoURL }} style={styles.logo} />
          ) : (
            <View style={styles.placeholder}>
              <MaterialCommunityIcons
                name="account"
                size={(isTablet ? 55 : 45) * scale}
                color={colors.secondaryText}
              />
            </View>
          )}
        </View>

        <ScrollView
          style={{ width: "100%" }}
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: horizontalPadding,
              paddingBottom: 30,
            },
          ]}
        >
          <Text
            style={[
              styles.name,
              {
                fontSize: isTablet ? 28 : 18,
                marginTop: isTablet ? 80 : 60,
                marginRight: 0,
                width: "100%",
                textAlign: "center",
                color: colors.text,
              },
            ]}
            numberOfLines={1}
          >
            {username || t.user}
          </Text>

          <View
            style={[
              styles.optionsContainer,
              { paddingHorizontal: horizontalPadding },
            ]}
          >
            {menuOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.opttion,
                  {
                    minHeight: isTablet ? 98 * scale : 60 * scale,
                    marginBottom: 18 * scale,
                    marginRight: isTablet ? 380 * scale : 120 * scale,
                  },
                ]}
                onPress={() => {
                  if (option.route === "/logout") {
                    router.push({
                      pathname: "/logout",
                      params: {
                        from: "/profile",
                      },
                    });
                  } else if (option.route) {
                    router.push(option.route);
                  }
                }}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor: option.color,
                      width: isTablet ? 70 * scale : 45 * scale,
                      height: isTablet ? 70 * scale : 45 * scale,
                      borderRadius: 12 * scale,
                      marginRight: 16 * scale,
                    },
                  ]}
                >
                  <Ionicons
                    name={option.icon}
                    size={25 * scale}
                    color={colors.white}
                  />
                </View>

                <Text
                  style={[
                    styles.optionText,
                    {
                      fontSize: isTablet ? 20 * scale : 16 * scale,
                      lineHeight: 28 * scale,
                      color: colors.text,
                    },
                  ]}
                >
                  {option.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View
        style={[
          styles.bottomBar,
          {
            height: isSmallScreen ? 60 : isTablet ? 65 * scale : 65,
            borderTopLeftRadius: 78 * scale,
            backgroundColor: colors.nav,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.navItem}
          onPress={goHome}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="home-outline"
            size={35 * scale}
            color={colors.white}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/historial")}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="chart-box-outline"
            size={35 * scale}
            color={colors.white}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/expensesManagement")}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="swap-horizontal"
            size={37 * scale}
            color={colors.white}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/currentgoal")}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="layers-outline"
            size={35 * scale}
            color={colors.white}
          />
        </TouchableOpacity>

        {/* Ya estás en Perfil: no hace nada para no apilar la misma pantalla */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {}}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="account-outline"
            size={35 * scale}
            color={colors.white}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  scrollContent: {
    alignItems: "center",
    paddingBottom: 30,
    paddingTop: 0,
  },

  header: {
    height: 75,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    marginTop: -10,
  },

  backButton: {
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    elevation: 10,
  },

  title: {
    flex: 1,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 25,
    marginTop: 0,
  },

  notificationButton: {
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },

  imageContainer: {
    position: "absolute",
    top: -40,
    overflow: "hidden",
    borderWidth: 3,
    zIndex: 10,
    elevation: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  placeholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flex: 1,
    marginTop: 70,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    alignItems: "center",
    width: "100%",
  },

  name: {
    fontSize: 18,
    marginTop: 40,
    fontWeight: "700",
  },

  optionsContainer: {
    width: "100%",
    paddingHorizontal: 30,
    marginTop: 15,
  },

  opttion: {
    width: "100%",
    minHeight: 60,
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 18,
  },

  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 12,
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  optionText: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: 65,
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