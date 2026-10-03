import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

export default function AgeConfirmation() {
  const { width } = useWindowDimensions();

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
        backgroundColor="#071426"
        barStyle="light-content"
      />

      <View
        style={[
          styles.header,
          {
            height: 118 * scale,
            paddingHorizontal: horizontalPadding,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.backButton,
            {
              transform: [
                {
                  translateY: 4 * scale,
                },
              ],
            },
          ]}
          onPress={() => router.push("/register")}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={35 * scale}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            {
              fontSize: 25 * scale,
              transform: [
                {
                  translateX: 5 * scale,
                },
                {
                  translateY: 1 * scale,
                },
              ],
            },
          ]}
        >
          Age Confirmation
        </Text>

        <View
          style={[
            styles.headerSpace,
            {
              width: 35 * scale,
            },
          ]}
        />
      </View>

      <View
        style={[
          styles.main,
          {
            borderTopLeftRadius: s(45),
            borderTopRightRadius: s(45),
          },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
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
                  I Am Under 18
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
    backgroundColor: "#071426",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 30,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  headerTitle: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "700",
    textAlign: "center",
  },

  headerSpace: {
    alignItems: "center",
    justifyContent: "center",
  },

  main: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  messageText: {
    color: "#071426",
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
    backgroundColor: "#071426",
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