import { Ionicons } from "@expo/vector-icons";
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
  blue: "#081023",
  cyan: "#25B7D3",
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

  const buttonHeight = Math.round(50 * scale);
  const buttonRadius = buttonHeight / 2;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.blue}
      />

      <View style={styles.container}>
       
        <View style={[styles.header, { height: 160 * scale }]}>
          <TouchableOpacity
            style={[
              styles.backButton,
              {
                left: horizontalPadding,
                top: isSmallScreen ? 45 : 55,
                width: 42 * scale,
                height: 42 * scale,
              },
            ]}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={Math.round(28 * scale)}
              color={COLORS.white}
            />
          </TouchableOpacity>

          <Text
            style={[
              styles.headerTitle,
              { fontSize: Math.round(23 * scale) },
            ]}
          >
            Terms & Conditions
          </Text>

          <TouchableOpacity
            style={[
              styles.profileButton,
              {
                right: horizontalPadding,
                top: isSmallScreen ? 42 : 50,
                width: 48 * scale,
                height: 48 * scale,
                borderRadius: (48 * scale) / 2,
              },
            ]}
            activeOpacity={0.7}
          >
            <Ionicons
              name="person-outline"
              size={Math.round(22 * scale)}
              color={COLORS.blue}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.cardContainer}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingHorizontal: horizontalPadding,
                paddingBottom: isSmallScreen ? 35 : 50,
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
                    { fontSize: Math.round(14 * scale) },
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
                    { fontSize: Math.round(17 * scale) },
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
                    { fontSize: Math.round(17 * scale) },
                  ]}
                >
                  Reject
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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

  header: {
    backgroundColor: COLORS.blue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  backButton: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color: COLORS.white,
    fontWeight: "700",
    textAlign: "center",
  },

  profileButton: {
    position: "absolute",
    backgroundColor: COLORS.cyan,
    alignItems: "center",
    justifyContent: "center",
  },

  cardContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
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
});