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

export default function LogoutScreen({ navigation }) {
  const { width } = useWindowDimensions();

  const isSmallScreen = width < 350;

  useLayoutEffect(() => {
    navigation?.setOptions({
      headerShown: false,
      tabBarStyle: { display: "none" },
      tabBarVisible: false,
    });

    const parent = navigation?.getParent();

    if (parent) {
      parent.setOptions({
        tabBarStyle: { display: "none" },
      });
    }
  }, [navigation]);

  const goToLogin = () => {
    router.replace("/login");
  };

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Log Out",
        onPress: goToLogin,
      },
    ]);
  };

  const handleLogoutEverywhere = () => {
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
          onPress: goToLogin,
        },
      ],
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar
        translucent
        backgroundColor="#071426"
        barStyle="light-content"
      />

      <View style={styles.app}>
        <View style={[styles.header, isSmallScreen && styles.headerSmall]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={34}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text
              style={[
                styles.headerTitle,
                isSmallScreen && styles.headerTitleSmall,
              ]}
            >
              Log Out
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.bellButton, isSmallScreen && styles.bellButtonSmall]}
          >
            <MaterialCommunityIcons
              name="bell-outline"
              size={27}
              color="#397468"
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.main, isSmallScreen && styles.mainSmall]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.content,
              isSmallScreen && styles.contentSmall,
            ]}
          >
            <View
              style={[
                styles.logoutCircle,
                isSmallScreen && styles.logoutCircleSmall,
              ]}
            >
              <View style={[styles.door, isSmallScreen && styles.doorSmall]}>
                <View
                  style={[
                    styles.doorInside,
                    isSmallScreen && styles.doorInsideSmall,
                  ]}
                />
              </View>

              <MaterialCommunityIcons
                name="arrow-right-bold"
                size={57}
                color="#1464E8"
                style={[
                  styles.logoutArrow,
                  isSmallScreen && styles.logoutArrowSmall,
                ]}
              />
            </View>

            <Text
              style={[styles.question, isSmallScreen && styles.questionSmall]}
            >
              Are you sure you want to
              {"\n"}
              log out?
            </Text>

            <Text
              style={[
                styles.description,
                isSmallScreen && styles.descriptionSmall,
              ]}
            >
              You will be logged out of this device. To access your account
              again, you will need to log in again.
            </Text>

            <TouchableOpacity
              style={[
                styles.actionButton,
                isSmallScreen && styles.actionButtonSmall,
              ]}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.buttonText,
                  isSmallScreen && styles.buttonTextSmall,
                ]}
              >
                Log Out
              </Text>
            </TouchableOpacity>

            <Text
              style={[
                styles.everywhereText,
                isSmallScreen && styles.everywhereTextSmall,
              ]}
            >
              Or log out from all your
              {"\n"}
              devices
            </Text>

            <TouchableOpacity
              style={[
                styles.actionButton,
                isSmallScreen && styles.actionButtonSmall,
              ]}
              onPress={handleLogoutEverywhere}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.buttonText,
                  isSmallScreen && styles.buttonTextSmall,
                ]}
              >
                Go
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.bottomArea}>
          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.navButton}>
              <MaterialCommunityIcons
                name="home-outline"
                size={35}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton}>
              <MaterialCommunityIcons
                name="chart-box-outline"
                size={35}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton}>
              <MaterialCommunityIcons
                name="swap-horizontal"
                size={37}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton}>
              <MaterialCommunityIcons
                name="layers-outline"
                size={35}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton}>
              <MaterialCommunityIcons
                name="account-outline"
                size={35}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  app: {
    flex: 1,
    width: "100%",
    backgroundColor: "#071426",
  },

  header: {
    width: "100%",
    height: 118,
    paddingHorizontal: 18,
    backgroundColor: "#071426",
    flexDirection: "row",
    alignItems: "center",
  },

  headerSmall: {
    height: 100,
    paddingHorizontal: 14,
  },

  backButton: {
    width: 48,
    height: 48,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  headerCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "700",
  },

  headerTitleSmall: {
    fontSize: 22,
  },

  bellButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#E2F5E9",
    alignItems: "center",
    justifyContent: "center",
  },

  bellButtonSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  main: {
    flex: 1,
    width: "100%",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
  },

  mainSmall: {
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },

  content: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingTop: 28,
    paddingBottom: 35,
    gap: 20,
  },

  contentSmall: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 30,
    gap: 15,
  },

  logoutCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    alignSelf: "center",
    shadowColor: "#1464E8",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.13,
    shadowRadius: 10,
    elevation: 5,
  },

  logoutCircleSmall: {
    width: 135,
    height: 135,
    borderRadius: 68,
  },

  door: {
    width: 67,
    height: 98,
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
    position: "absolute",
    left: "27%",
    justifyContent: "center",
    shadowColor: "#071426",
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.16,
    shadowRadius: 6,
    elevation: 4,
  },

  doorSmall: {
    width: 57,
    height: 83,
    borderRadius: 8,
  },

  doorInside: {
    width: 57,
    height: 86,
    borderRadius: 7,
    backgroundColor: "#1464E8",
    position: "absolute",
    left: "15%",
    top: "12%",
  },

  doorInsideSmall: {
    width: 48,
    height: 73,
    borderRadius: 6,
  },

  logoutArrow: {
    position: "absolute",
    right: "11%",
    top: "35%",
  },

  logoutArrowSmall: {
    right: "10%",
    top: "34%",
  },

  question: {
    width: "100%",
    textAlign: "center",
    alignSelf: "center",
    color: "#111111",
    fontSize: 24,
    lineHeight: 29,
    fontWeight: "800",
  },

  questionSmall: {
    fontSize: 21,
    lineHeight: 25,
  },

  description: {
    width: "90%",
    alignSelf: "center",
    textAlign: "left",
    color: "#111111",
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "400",
  },

  descriptionSmall: {
    width: "92%",
    fontSize: 14,
    lineHeight: 19,
  },

  actionButton: {
    width: 225,
    height: 54,
    borderRadius: 30,
    backgroundColor: "#071426",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },

  actionButtonSmall: {
    width: 205,
    height: 50,
    borderRadius: 27,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  buttonTextSmall: {
    fontSize: 16,
  },

  everywhereText: {
    width: "100%",
    alignSelf: "center",
    textAlign: "center",
    color: "#111111",
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "400",
  },

  everywhereTextSmall: {
    fontSize: 14,
    lineHeight: 19,
  },

  bottomArea: {
    width: "100%",
    height: 86,
    backgroundColor: "#FFFFFF",
    justifyContent: "flex-end",
  },

  bottomBar: {
    width: "100%",
    height: 86,
    backgroundColor: "#25B5D1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopLeftRadius: 78,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: "hidden",
  },

  navButton: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
