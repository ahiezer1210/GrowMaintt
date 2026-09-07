import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

export default function InvestmentReminder() {
  const { width, height } = useWindowDimensions();

  const scale = Math.min(width / 390, height / 844);

  const s = (value) => Math.round(value * scale);

  const navIcons = [
    "home-outline",
    "chart-box-outline",
    "swap-horizontal",
    "layers-outline",
    "account-outline",
  ];

  const safeScale = Math.max(scale, 0.75);

  const size = (value) => Math.round(value * safeScale);

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
            height: size(115),
            paddingHorizontal: size(17),
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.backButton,
            {
              width: size(41),
              height: size(46),
            },
          ]}
          activeOpacity={0.7}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            }
          }}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={size(22)}
            color="#FFFF"
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            {
              fontSize: size(19),
              lineHeight: size(23),
            },
          ]}
          numberOfLines={2}
        >
          Investment{"\n"}Reminder
        </Text>

        <View
          style={[
            styles.bellButton,
            {
              width: size(30),
              height: size(30),
              borderRadius: size(15),
            },
          ]}
        >
          <MaterialCommunityIcons
            name="bell-outline"
            size={size(17)}
            color="#428574"
          />
        </View>
      </View>

      <View
        style={[
          styles.main,
          {
            borderTopLeftRadius: size(36),
            borderTopRightRadius: size(36),
          },
        ]}
      >
        <View
          style={[
            styles.content,
            {
              paddingTop: size(15),
            },
          ]}
        >
          <Image
            source={require("../../assets/images/invest.png.png")}
            style={{
              width: size(190),
              height: size(140),
            }}
            resizeMode="contain"
          />

          <Text
            style={[
              styles.successTitle,
              {
                fontSize: size(22),
                marginTop: size(5),
              },
            ]}
            adjustsFontSizeToFit
            minimumFontScale={0.85}
            numberOfLines={1}
          >
            You can start investing!
          </Text>

          <Text
            style={[
              styles.successSubtitle,
              {
                fontSize: size(13),
                marginTop: size(30),
              },
            ]}
            adjustsFontSizeToFit
            minimumFontScale={0.85}
            numberOfLines={2}
          >
            You have reached the minimum amount{"\n"}
            to start investing.
          </Text>

          <Text
            style={[
              styles.investQuestion,
              {
                fontSize: size(13),
                marginTop: size(35),
              },
            ]}
            adjustsFontSizeToFit
            minimumFontScale={0.85}
            numberOfLines={1}
          >
            Would you like to try it?
          </Text>

          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                width: size(210),
                height: size(40),
                borderRadius: size(22),
                marginTop: size(18),
              },
            ]}
            activeOpacity={0.8}
            onPress={() => {
            }}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  fontSize: size(14),
                },
              ]}
            >
              Go
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.bottomBar,
            {
              height: size(85),
              borderTopLeftRadius: size(50),
            },
          ]}
        >
          {navIcons.map((icon, index) => (
            <TouchableOpacity
              key={icon}
              style={styles.navButton}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={icon}
                size={size(index === 2 ? 28 : 24)}
                color="#FFFF"
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
    backgroundColor: "#0b1624",
  },

  header: {
    width: "100%",
    backgroundColor: "#0b1624",
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    justifyContent: "center",
    alignItems: "flex-start",
  },

  headerTitle: {
    flex: 1,
    color: "#FFFF",
    fontWeight: "bold",
    textAlign: "center",
  },

  bellButton: {
    backgroundColor: "#d7f3e8",
    alignItems: "center",
    justifyContent: "center",
  },

  main: {
    flex: 1,
    width: "100%",
    backgroundColor: "#FFFF",
    overflow: "hidden",
  },

  content: {
    flex: 1,
    alignItems: "center",
  },

  successTitle: {
    color: "#0b1624",
    fontWeight: "bold",
    textAlign: "center",
  },

  successSubtitle: {
    color: "#6b7280",
    textAlign: "center",
  },

  investQuestion: {
    color: "#0b1624",
    textAlign: "center",
  },

  actionButton: {
    backgroundColor: "#0b1624",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFF",
    fontWeight: "600",
  },

  bottomBar: {
    width: "100%",
    backgroundColor: "#25B7D3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  navButton: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});