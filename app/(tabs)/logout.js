import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { signOut } from "firebase/auth";
import { useLayoutEffect } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useAppSettings } from "../../context/Appsettings";
import { auth } from "../../firebaseConfig.js";

const COLORS = {
  cyan: "#25B5D1",
  white: "#FFFFFF",
  blueIcon: "#1464E8",
};

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
    route: "/expensesManagement",
  },
  {
    icon: "layers-outline",
    route: "/currentgoal",
  },
  {
    icon: "account-outline",
    route: "/profile",
  },
];

export default function LogoutScreen({ navigation }) {
  const { t, colors } = useAppSettings();

  const { width } = useWindowDimensions();

  const { from } = useLocalSearchParams();

  const small = width < 350;
  const tablet = width >= 600;

  const scale = (value, tabletValue) =>
    tablet
      ? (tabletValue ?? value * 1.35)
      : small
      ? value * 0.9
      : value;

  const ui = {
    header: tablet ? 125 : small ? 100 : 118,
    title: scale(25, 30),
    icon: scale(35, 35),
    circle: scale(160, 190),
    arrow: scale(57, 67),
    buttonW: scale(225, 280),
    buttonH: scale(54, 60),
    text: scale(17, 19),
    question: scale(24, 28),
    description: scale(15, 17),
  };

  useLayoutEffect(() => {
    const hideTabs = {
      headerShown: false,
      tabBarStyle: { display: "none" },
      tabBarVisible: false,
    };

    navigation?.setOptions(hideTabs);

    navigation?.getParent()?.setOptions({
      tabBarStyle: { display: "none" },
    });
  }, [navigation]);

  const abrirNotificaciones = () => {
    router.push({
      pathname: "/notifications",
      params: {
        from: "/logout",
      },
    });
  };

  const volver = () => {
    const origen = Array.isArray(from) ? from[0] : from;

    if (origen === "/profile") {
      router.push("/profile");
    } else if (origen === "/settings") {
      router.push("/settings");
    } else {
      router.push("/settings");
    }
  };

  const logout = () => {
    Alert.alert(
      t.logOut,
      t.logOutConfirmation,
      [
        {
          text: t.cancel,
          style: "cancel",
        },
        {
          text: t.logOut,
          onPress: async () => {
            try {
              await signOut(auth);
              router.replace("/login");
            } catch (error) {
              Alert.alert(
                t.error,
                t.couldNotLogOut
              );
            }
          },
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  const logoutEverywhere = () => {
    router.push("/logoutalldevices");
  };

  const button = (text, onPress) => (
    <TouchableOpacity
      style={[
        styles.button,
        {
          width: ui.buttonW,
          height: ui.buttonH,
          borderRadius: ui.buttonH / 2,
          backgroundColor: COLORS.cyan,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.buttonText,
          {
            fontSize: ui.text,
            color: COLORS.white,
          },
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.primaryBackground,
        },
      ]}
    >
      <StatusBar
        translucent
        backgroundColor={colors.header}
        barStyle="light-content"
      />

      <View
        style={[
          styles.app,
          {
            backgroundColor: colors.primaryBackground,
          },
        ]}
      >
        <View
          style={[
            styles.header,
            {
              height:
                118 *
                (small
                  ? 0.85
                  : tablet
                  ? 1.15
                  : 1),
              paddingHorizontal: small
                ? 18
                : tablet
                ? 45
                : 25,
              backgroundColor: colors.header,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.back,
              {
                transform: [
                  {
                    translateY:
                      4 *
                      (small
                        ? 0.85
                        : tablet
                        ? 1.15
                        : 1),
                  },
                ],
              },
            ]}
            onPress={volver}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={
                35 *
                (small
                  ? 0.85
                  : tablet
                  ? 1.15
                  : 1)
              }
              color={colors.white}
            />
          </TouchableOpacity>

          <Text
            style={[
              styles.headerTitle,
              {
                fontSize:
                  25 *
                  (small
                    ? 0.85
                    : tablet
                    ? 1.15
                    : 1),
                transform: [
                  {
                    translateX:
                      4 *
                      (small
                        ? 0.85
                        : tablet
                        ? 1.15
                        : 1),
                  },
                  {
                    translateY:
                      1 *
                      (small
                        ? 0.85
                        : tablet
                        ? 1.15
                        : 1),
                  },
                ],
                color: colors.white,
              },
            ]}
          >
            {t.logOut}
          </Text>

          <TouchableOpacity
            style={[
              styles.headerBell,
              {
                transform: [
                  {
                    translateY:
                      4 *
                      (small
                        ? 0.85
                        : tablet
                        ? 1.15
                        : 1),
                  },
                ],
              },
            ]}
            onPress={abrirNotificaciones}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="bell-circle-outline"
              size={
                35 *
                (small
                  ? 0.85
                  : tablet
                  ? 1.15
                  : 1)
              }
              color={colors.white}
            />
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.main,
            {
              backgroundColor: colors.background,
              borderTopLeftRadius:
                tablet ? 55 : small ? 35 : 45,
              borderTopRightRadius:
                tablet ? 55 : small ? 35 : 45,
            },
          ]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.content,
              {
                width: tablet ? "85%" : "100%",
                maxWidth: tablet ? 700 : undefined,
                paddingHorizontal: tablet
                  ? 0
                  : small
                  ? 22
                  : 30,
                paddingTop: tablet
                  ? 35
                  : small
                  ? 20
                  : 28,
                paddingBottom: 100,
                gap: tablet
                  ? 24
                  : small
                  ? 15
                  : 20,
              },
            ]}
          >
            <View
              style={[
                styles.circle,
                {
                  width: ui.circle,
                  height: ui.circle,
                  borderRadius: ui.circle / 2,
                },
              ]}
            >
              <View
                style={[
                  styles.door,
                  {
                    width: tablet ? 80 : 67,
                    height: tablet ? 117 : 98,
                  },
                ]}
              >
                <View
                  style={[
                    styles.doorInside,
                    {
                      width:
                        tablet
                          ? 68
                          : small
                          ? 48
                          : 57,
                      height:
                        tablet
                          ? 102
                          : small
                          ? 73
                          : 86,
                    },
                  ]}
                />
              </View>

              <MaterialCommunityIcons
                name="arrow-right-bold"
                size={ui.arrow}
                color={COLORS.blueIcon}
                style={styles.arrow}
              />
            </View>

            <Text
              style={[
                styles.question,
                {
                  fontSize: ui.question,
                  lineHeight:
                    tablet
                      ? 34
                      : small
                      ? 25
                      : 29,
                  color: colors.text,
                },
              ]}
            >
              {t.areYouSureLogOut}
            </Text>

            <Text
              style={[
                styles.description,
                {
                  fontSize: ui.description,
                  lineHeight:
                    tablet
                      ? 24
                      : small
                      ? 19
                      : 21,
                  width:
                    tablet
                      ? "100%"
                      : small
                      ? "92%"
                      : "90%",
                  color: colors.text,
                },
              ]}
            >
              {t.loggedOutDescription}
            </Text>

            {button(t.logOut, logout)}

            <Text
              style={[
                styles.everywhere,
                {
                  fontSize: small
                    ? 14
                    : tablet
                    ? 17
                    : 15,
                  lineHeight: small
                    ? 19
                    : tablet
                    ? 24
                    : 21,
                  color: colors.text,
                },
              ]}
            >
              {t.orLogOutAllDevices}
            </Text>

            {button(
              t.logOutEverywhere,
              logoutEverywhere
            )}
          </ScrollView>
        </View>

        <View
          style={[
            styles.bottomBar,
            {
              height:
                65 *
                (small
                  ? 0.85
                  : tablet
                  ? 1.15
                  : 1),
              borderTopLeftRadius:
                78 *
                (small
                  ? 0.85
                  : tablet
                  ? 1.15
                  : 1),
              backgroundColor: colors.nav,
            },
          ]}
        >
          {navItems.map((item) => (
            <TouchableOpacity
              key={item.route}
              style={styles.navItem}
              activeOpacity={0.8}
              onPress={() => router.push(item.route)}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={
                  item.icon === "swap-horizontal"
                    ? 37 *
                      (small
                        ? 0.85
                        : tablet
                        ? 1.15
                        : 1)
                    : 35 *
                      (small
                        ? 0.85
                        : tablet
                        ? 1.15
                        : 1)
                }
                color={colors.white}
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
  },

  app: {
    flex: 1,
  },

  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  back: {
    width: 30,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  headerTitle: {
    fontWeight: "700",
  },

  headerBell: {
    justifyContent: "center",
  },

  main: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
  },

  content: {
    alignItems: "center",
    alignSelf: "center",
  },

  circle: {
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    shadowColor: "#1464E8",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.13,
    shadowRadius: 10,
    elevation: 5,
  },

  door: {
    backgroundColor: "#FFF",
    borderRadius: 9,
    position: "absolute",
    left: "27%",
    justifyContent: "center",
  },

  doorInside: {
    backgroundColor: "#1464E8",
    borderRadius: 7,
    position: "absolute",
    left: "15%",
    top: "12%",
  },

  arrow: {
    position: "absolute",
    right: "11%",
    top: "35%",
  },

  question: {
    width: "100%",
    textAlign: "center",
    fontWeight: "800",
  },

  description: {
    textAlign: "left",
  },

  button: {
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    fontWeight: "700",
  },

  everywhere: {
    width: "100%",
    textAlign: "center",
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
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