import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
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

const NAV_ICONS = [
  "home-outline",
  "chart-box-outline",
  "swap-horizontal",
  "layers-outline",
  "account-outline",
];

export default function LogoutScreen({ navigation }) {
  const { width } = useWindowDimensions();

  const small = width < 350;
  const tablet = width >= 600;

  const scale = (value, tabletValue) =>
    tablet ? (tabletValue ?? value * 1.35) : small ? value * 0.9 : value;

  const ui = {
    header: tablet ? 125 : small ? 100 : 118,
    title: scale(25, 30),
    icon: scale(34, 35),
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

  const logout = () =>
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log Out",
          onPress: () => router.replace("/login"),
        },
      ],
      {
        cancelable: true,
      },
    );

  const logoutEverywhere = () =>
    Alert.alert(
      "Log Out Everywhere",
      "Do you want to log out from all your devices?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Continue",
          onPress: () => router.replace("/login"),
        },
      ],
      {
        cancelable: true,
      },
    );

  const button = (text, onPress) => (
    <TouchableOpacity
      style={[
        styles.button,
        {
          width: ui.buttonW,
          height: ui.buttonH,
          borderRadius: ui.buttonH / 2,
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
          },
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <StatusBar
        translucent
        backgroundColor="#071426"
        barStyle="light-content"
      />

      <View style={styles.app}>
        <View
          style={[
            styles.header,
            {
              height: ui.header,
              paddingHorizontal: tablet ? 35 : small ? 14 : 18,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.back}
            onPress={() => navigation?.goBack()}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={ui.icon}
              color="#FFF"
            />
          </TouchableOpacity>

          <Text
            style={[
              styles.headerTitle,
              {
                fontSize: ui.title,
              },
            ]}
          >
            Log Out
          </Text>

          <TouchableOpacity
            style={[
              styles.bell,
              {
                width: tablet ? 52 : small ? 40 : 45,

                height: tablet ? 52 : small ? 40 : 45,

                borderRadius: tablet ? 26 : small ? 20 : 23,
              },
            ]}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="bell-outline"
              size={tablet ? 30 : 27}
              color="#397468"
            />
          </TouchableOpacity>
        </View>
        x
        <View
          style={[
            styles.main,
            {
              borderTopLeftRadius: tablet ? 55 : small ? 35 : 45,

              borderTopRightRadius: tablet ? 55 : small ? 35 : 45,
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

                paddingHorizontal: tablet ? 0 : small ? 22 : 30,

                paddingTop: tablet ? 35 : small ? 20 : 28,

                paddingBottom: 40,

                gap: tablet ? 24 : small ? 15 : 20,
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
                      width: tablet ? 68 : small ? 48 : 57,

                      height: tablet ? 102 : small ? 73 : 86,
                    },
                  ]}
                />
              </View>

              <MaterialCommunityIcons
                name="arrow-right-bold"
                size={ui.arrow}
                color="#1464E8"
                style={styles.arrow}
              />
            </View>

            <Text
              style={[
                styles.question,
                {
                  fontSize: ui.question,

                  lineHeight: tablet ? 34 : small ? 25 : 29,
                },
              ]}
            >
              Are you sure you want to{"\n"}log out?
            </Text>

            <Text
              style={[
                styles.description,
                {
                  fontSize: ui.description,

                  lineHeight: tablet ? 24 : small ? 19 : 21,

                  width: tablet ? "100%" : small ? "92%" : "90%",
                },
              ]}
            >
              You will be logged out of this device. To access your account
              again, you will need to log in again.
            </Text>

            {button("Log Out", logout)}

            <Text
              style={[
                styles.everywhere,
                {
                  fontSize: small ? 14 : tablet ? 17 : 15,

                  lineHeight: small ? 19 : tablet ? 24 : 21,
                },
              ]}
            >
              Or log out from all your{"\n"}devices
            </Text>

            {button("Log Out Everywhere", logoutEverywhere)}
          </ScrollView>
        </View>
        <View style={styles.bottom}>
          {NAV_ICONS.map((icon, index) => (
            <TouchableOpacity
              key={icon}
              style={[styles.navButton, tablet && styles.navTablet]}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name={icon}
                size={tablet ? 38 : index === 2 ? 37 : 35}
                color="#FFF"
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
    backgroundColor: "#FFF",
  },

  app: {
    flex: 1,
    backgroundColor: "#071426",
  },

  header: {
    width: "100%",
    backgroundColor: "#071426",
    flexDirection: "row",
    alignItems: "center",
  },

  back: {
    width: 48,
    height: 48,
    justifyContent: "center",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#FFF",
    fontWeight: "700",
  },

  bell: {
    backgroundColor: "#E2F5E9",
    alignItems: "center",
    justifyContent: "center",
  },

  main: {
    flex: 1,
    width: "100%",
    backgroundColor: "#FFF",
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
    color: "#111",
    fontWeight: "800",
  },

  description: {
    textAlign: "left",
    color: "#111",
  },

  button: {
    backgroundColor: "#071426",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "700",
  },

  everywhere: {
    width: "100%",
    textAlign: "center",
    color: "#111",
  },

  bottom: {
    width: "100%",
    height: 86,
    backgroundColor: "#25B5D1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopLeftRadius: 78,
    overflow: "hidden",
  },

  navButton: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  navTablet: {
    maxWidth: 110,
  },
});
