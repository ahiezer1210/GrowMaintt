import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

const COLORS = {
  blue: "#071426",
  cyan: "#25B5D1",
  gray: "#ACADAD",
  white: "#FFFFFF",
};

export default function TermsScreen() {
  const { width } = useWindowDimensions();

  const [accepted, setAccepted] = useState(false);

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

  const s = (value) => Math.round(value * scale);

  const buttonHeight = Math.round(50 * scale);
  const buttonRadius = buttonHeight / 2;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.blue}
      />

      <View style={styles.container}>

        {/* HEADER */}
        <View
          style={[
            styles.header,
            {
              height: s(118),
              paddingHorizontal: horizontalPadding,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.backButton,
              {
                left: s(15),
                top: s(34),
                width: s(55),
                height: s(55),
              },
            ]}
            activeOpacity={0.7}
            onPress={() => router.push("/profile")}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={s(35)}
              color={COLORS.white}
            />
          </TouchableOpacity>

          <Text
            style={[
              styles.headerTitle,
              {
                fontSize: s(25),
                lineHeight: s(29),
              },
            ]}
          >
            Terms &
            {"\n"}
            Conditions
          </Text>

          <TouchableOpacity
            style={[
              styles.headerBell,
              {
                right: s(15),
                top: s(34),
                width: s(55),
                height: s(55),
              },
            ]}
            activeOpacity={0.7}
            onPress={() =>
              router.push({
                pathname: "/notifications",
                params: {
                  from: "/terms",
                },
              })
            }
          >
            <MaterialCommunityIcons
              name="bell-circle-outline"
              size={s(35)}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>

        {/* CARD PRINCIPAL */}
        <View
          style={[
            styles.cardContainer,
            {
              borderTopLeftRadius: s(
                isTablet
                  ? 55
                  : isSmallScreen
                  ? 35
                  : 45
              ),
              borderTopRightRadius: s(
                isTablet
                  ? 55
                  : isSmallScreen
                  ? 35
                  : 45
              ),
            },
          ]}
        >
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingHorizontal: horizontalPadding,
                paddingBottom: isSmallScreen ? 35 : 100,
              },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <Text
              style={[
                styles.intro,
                {
                  fontSize: Math.round(16 * scale),
                  lineHeight: Math.round(23 * scale),
                },
              ]}
            >
              By using our application, you expressly agree to
              these Terms and Conditions. We recommend reading
              them carefully before getting started.
            </Text>

            <Text
              style={[
                styles.heading,
                {
                  fontSize: Math.round(17 * scale),
                  lineHeight: Math.round(24 * scale),
                },
              ]}
            >
              1. User Requirements and Account
            </Text>

            <Text
              style={[
                styles.paragraph,
                {
                  fontSize: Math.round(16 * scale),
                  lineHeight: Math.round(23 * scale),
                },
              ]}
            >
              • Age and Accuracy: You must be at least 18 years
              old to use GrowMaint and agree to provide accurate
              and up-to-date information.
            </Text>

            <Text
              style={[
                styles.paragraph,
                {
                  fontSize: Math.round(16 * scale),
                  lineHeight: Math.round(23 * scale),
                },
              ]}
            >
              • Security: You are solely responsible for
              maintaining the confidentiality of your account
              and password, as well as all activities carried
              out through your account.
            </Text>

            <Text
              style={[
                styles.heading,
                {
                  fontSize: Math.round(17 * scale),
                  lineHeight: Math.round(24 * scale),
                },
              ]}
            >
              2. Permitted Use of the Platform
            </Text>

            <Text
              style={[
                styles.paragraph,
                {
                  fontSize: Math.round(16 * scale),
                  lineHeight: Math.round(23 * scale),
                },
              ]}
            >
              • Purpose: GrowMaint is a tool designed exclusively
              to help you manage your personal finances.
            </Text>

            <Text
              style={[
                styles.paragraph,
                {
                  fontSize: Math.round(16 * scale),
                  lineHeight: Math.round(23 * scale),
                },
              ]}
            >
              • Prohibitions: It is strictly prohibited to use
              the platform for illegal, fraudulent, or
              unauthorized activities.
            </Text>

            <Text
              style={[
                styles.heading,
                {
                  fontSize: Math.round(17 * scale),
                  lineHeight: Math.round(24 * scale),
                },
              ]}
            >
              3. Limitation of Liability
            </Text>

            <Text
              style={[
                styles.paragraph,
                {
                  fontSize: Math.round(16 * scale),
                  lineHeight: Math.round(23 * scale),
                },
              ]}
            >
              • Exclusion of Damages: GrowMaint is not responsible
              for direct or indirect damages resulting from the
              use of the application, except where applicable
              law requires otherwise.
            </Text>

            <Text
              style={[
                styles.heading,
                {
                  fontSize: Math.round(17 * scale),
                  lineHeight: Math.round(24 * scale),
                },
              ]}
            >
              4. Changes and Updates
            </Text>

            <Text
              style={[
                styles.paragraph,
                {
                  fontSize: Math.round(16 * scale),
                  lineHeight: Math.round(23 * scale),
                },
              ]}
            >
              • Changes: We reserve the right to update these
              terms at any time. We will notify you of important
              changes directly within the application.
            </Text>

            {/* CHECKBOX */}
            <View style={styles.bottomInsideScroll}>
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setAccepted(!accepted)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkbox,
                    {
                      width: Math.round(22 * scale),
                      height: Math.round(22 * scale),
                    },
                    accepted && styles.checkboxChecked,
                  ]}
                >
                  {accepted && (
                    <Ionicons
                      name="checkmark"
                      size={Math.round(16 * scale)}
                      color={COLORS.white}
                    />
                  )}
                </View>

                <Text
                  style={[
                    styles.checkboxText,
                    {
                      fontSize: Math.round(14 * scale),
                    },
                  ]}
                >
                  I accept all terms and conditions
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  {
                    height: buttonHeight,
                    borderRadius: buttonRadius,
                  },
                ]}
                onPress={() => setAccepted(true)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.buttonText,
                    {
                      fontSize: Math.round(17 * scale),
                    },
                  ]}
                >
                  Accept
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  {
                    height: buttonHeight,
                    borderRadius: buttonRadius,
                  },
                ]}
                onPress={() => setAccepted(false)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.buttonText,
                    {
                      fontSize: Math.round(17 * scale),
                    },
                  ]}
                >
                  Reject
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* NAVBAR */}
        <View
          style={[
            styles.bottomBar,
            {
              height: s(65),
              borderTopLeftRadius: s(78),
            },
          ]}
        >
          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.8}
            onPress={() => router.push("/home")}
          >
            <MaterialCommunityIcons
              name="home-outline"
              size={s(35)}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.8}
            onPress={() => router.push("/historial")}
          >
            <MaterialCommunityIcons
              name="chart-box-outline"
              size={s(35)}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.8}
            onPress={() => router.push("/expensesManagement")}
          >
            <MaterialCommunityIcons
              name="swap-horizontal"
              size={s(37)}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.8}
            onPress={() => router.push("/currentgoal")}
          >
            <MaterialCommunityIcons
              name="layers-outline"
              size={s(35)}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.8}
            onPress={() => router.push("/profile")}
          >
            <MaterialCommunityIcons
              name="account-outline"
              size={s(35)}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.blue,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.blue,
  },

  /* HEADER */
  header: {
    width: "100%",
    backgroundColor: COLORS.blue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    elevation: 10,
  },

  headerTitle: {
    flex: 1,
    color: COLORS.white,
    fontWeight: "700",
    textAlign: "center",
    transform: [
      {
        translateX: 3,
      },
      {
        translateY: 7,
      },
    ],
  },

  headerBell: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    elevation: 10,
  },

  /* CARD */
  cardContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    overflow: "hidden",
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingTop: 30,
  },

  intro: {
    color: COLORS.blue,
    fontWeight: "400",
    textAlign: "left",
    marginBottom: 12,
  },

  heading: {
    color: COLORS.blue,
    fontWeight: "800",
    marginTop: 10,
    marginBottom: 4,
    textAlign: "left",
  },

  paragraph: {
    color: COLORS.blue,
    fontWeight: "400",
    textAlign: "left",
    marginBottom: 8,
    width: "100%",
  },

  /* CHECKBOX */
  bottomInsideScroll: {
    marginTop: 25,
    alignItems: "center",
    width: "100%",
  },

  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  checkbox: {
    borderWidth: 1.5,
    borderColor: COLORS.gray,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  checkboxChecked: {
    backgroundColor: COLORS.cyan,
    borderColor: COLORS.cyan,
  },

  checkboxText: {
    color: COLORS.blue,
    textAlign: "left",
  },

  actionButton: {
    backgroundColor: COLORS.cyan,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    width: "82%",
    maxWidth: 400,
  },

  buttonText: {
    color: COLORS.white,
    fontWeight: "700",
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