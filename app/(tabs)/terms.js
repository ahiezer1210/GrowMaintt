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

import { useAppSettings } from "../../context/Appsettings";

const COLORS = {
  blue: "#071426",
  cyan: "#25B5D1",
  gray: "#ACADAD",
  white: "#FFFFFF",
};

export default function TermsScreen() {
  const { width } = useWindowDimensions();
  const { t, colors } = useAppSettings();

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
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: colors.primaryBackground,
        },
      ]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.header}
      />

      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.primaryBackground,
          },
        ]}
      >
        <View
          style={[
            styles.header,
            {
              height: s(118),
              paddingHorizontal: horizontalPadding,
              backgroundColor: colors.header,
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
            onPress={() => router.push("/register")}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={s(35)}
              color={colors.white}
            />
          </TouchableOpacity>

          <Text
            style={[
              styles.headerTitle,
              {
                fontSize: s(25),
                lineHeight: s(29),
                color: colors.white,
              },
            ]}
          >
            {t.termsAndConditions}
          </Text>
        </View>

        <View
          style={[
            styles.cardContainer,
            {
              backgroundColor: colors.background,
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
                  color: colors.text,
                },
              ]}
            >
              {t.termsIntro}
            </Text>

            <Text
              style={[
                styles.heading,
                {
                  fontSize: Math.round(17 * scale),
                  lineHeight: Math.round(24 * scale),
                  color: colors.text,
                },
              ]}
            >
              {t.userRequirementsAccount}
            </Text>

            <Text
              style={[
                styles.paragraph,
                {
                  fontSize: Math.round(16 * scale),
                  lineHeight: Math.round(23 * scale),
                  color: colors.text,
                },
              ]}
            >
              {t.ageAndAccuracy}
            </Text>

            <Text
              style={[
                styles.paragraph,
                {
                  fontSize: Math.round(16 * scale),
                  lineHeight: Math.round(23 * scale),
                  color: colors.text,
                },
              ]}
            >
              {t.security}
            </Text>

            <Text
              style={[
                styles.heading,
                {
                  fontSize: Math.round(17 * scale),
                  lineHeight: Math.round(24 * scale),
                  color: colors.text,
                },
              ]}
            >
              {t.permittedUsePlatform}
            </Text>

            <Text
              style={[
                styles.paragraph,
                {
                  fontSize: Math.round(16 * scale),
                  lineHeight: Math.round(23 * scale),
                  color: colors.text,
                },
              ]}
            >
              {t.purpose}
            </Text>

            <Text
              style={[
                styles.paragraph,
                {
                  fontSize: Math.round(16 * scale),
                  lineHeight: Math.round(23 * scale),
                  color: colors.text,
                },
              ]}
            >
              {t.prohibitions}
            </Text>

            <Text
              style={[
                styles.heading,
                {
                  fontSize: Math.round(17 * scale),
                  lineHeight: Math.round(24 * scale),
                  color: colors.text,
                },
              ]}
            >
              {t.limitationLiability}
            </Text>

            <Text
              style={[
                styles.paragraph,
                {
                  fontSize: Math.round(16 * scale),
                  lineHeight: Math.round(23 * scale),
                  color: colors.text,
                },
              ]}
            >
              {t.exclusionDamages}
            </Text>

            <Text
              style={[
                styles.heading,
                {
                  fontSize: Math.round(17 * scale),
                  lineHeight: Math.round(24 * scale),
                  color: colors.text,
                },
              ]}
            >
              {t.changesUpdates}
            </Text>

            <Text
              style={[
                styles.paragraph,
                {
                  fontSize: Math.round(16 * scale),
                  lineHeight: Math.round(23 * scale),
                  color: colors.text,
                },
              ]}
            >
              {t.changes}
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
                      borderColor: colors.border,
                    },
                    accepted && {
                      backgroundColor: COLORS.cyan,
                      borderColor: COLORS.cyan,
                    },
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
                      color: colors.text,
                    },
                  ]}
                >
                  {t.acceptAllTerms}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  {
                    height: buttonHeight,
                    borderRadius: buttonRadius,
                    backgroundColor: COLORS.cyan,
                  },
                ]}
                onPress={() => {
                  setAccepted(true);
                  router.push("/s.ageconfirmation");
                }}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.buttonText,
                    {
                      fontSize: Math.round(17 * scale),
                      color: COLORS.white,
                    },
                  ]}
                >
                  {t.accept}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  {
                    height: buttonHeight,
                    borderRadius: buttonRadius,
                    backgroundColor: COLORS.cyan,
                  },
                ]}
                onPress={() => router.replace("/index")}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.buttonText,
                    {
                      fontSize: Math.round(17 * scale),
                      color: COLORS.white,
                    },
                  ]}
                >
                  {t.reject}
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
  },

  container: {
    flex: 1,
  },

  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  backButton: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    elevation: 10,
  },

  headerTitle: {
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

  cardContainer: {
    flex: 1,
    overflow: "hidden",
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingTop: 30,
  },

  intro: {
    fontWeight: "400",
    textAlign: "left",
    marginBottom: 12,
  },

  heading: {
    fontWeight: "800",
    marginTop: 10,
    marginBottom: 4,
    textAlign: "left",
  },

  paragraph: {
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
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  checkboxText: {
    textAlign: "left",
  },

  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    width: "82%",
    maxWidth: 400,
  },

  buttonText: {
    fontWeight: "700",
  },
});