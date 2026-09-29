import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

export default function AgeConfirmation() {
  const { width, height } = useWindowDimensions();

  const isSmallScreen = width < 360;
  const isMediumScreen = width >= 360 && width < 600;
  const isTablet = width >= 600;
  const isLargeScreen = width >= 900;

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
  return (
    <View style={styles.screen}>
      <StatusBar
        translucent
        backgroundColor="#0b1624"
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
              width: s(41),
              height: s(46),
            },
          ]}
          onPress={() => router.push("/register")}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={s(22)}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            {
              fontSize: s(19),
            },
          ]}
        >
          Age Confirmation
        </Text>

        <View style={styles.headerSpace} />
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
              paddingHorizontal: horizontalPadding,
            },
          ]}
        >
          <Text
            style={[
              styles.messageText,
              {
                fontSize: s(20),
                lineHeight: s(24),
                marginBottom: s(40),
              },
            ]}
          >
            To Use This Application,{"\n"}
            You Must Be 18 Years Or Older.
          </Text>

          <View
            style={[
              styles.buttonsContainer,
              {
                marginTop: s(40),
                gap: s(15),
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  width: s(240),
                  height: s(53),
                  borderRadius: s(22),
                },
              ]}
              onPress={() => router.push("/verificationage")}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    fontSize: s(14),
                  },
                ]}
              >
                I Am 18 Or Older
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.secondButton,
                {
                  width: s(240),
                  height: s(53),
                  borderRadius: s(22),
                  marginTop: s(14),
                },
              ]}
              onPress={() => router.push("/login")}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    fontSize: s(14),
                  },
                ]}
              >
                I Am Under 18
              </Text>
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
    backgroundColor: "#0b1624",
  },

  header: {
    height: 115,
    paddingHorizontal: 17,
    backgroundColor: "#0b1624",
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    width: 41,
    height: 46,
    justifyContent: "center",
    alignItems: "flex-start",
  },

  headerTitle: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "bold",
    textAlign: "center",
  },

  headerSpace: {
    width: 30,
  },

  main: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    overflow: "hidden",
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  messageText: {
    color: "#0b1624",
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 40,
  },

  buttonsContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 40,
    gap: 15,
  },

  actionButton: {
    width: 240,
    height: 53,
    borderRadius: 22,
    backgroundColor: "#0b1624",
    alignItems: "center",
    justifyContent: "center",
  },

  secondButton: {
    marginTop: 14,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});