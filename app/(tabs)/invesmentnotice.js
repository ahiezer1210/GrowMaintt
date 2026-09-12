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

  const tablet = width >= 600;
  const landscape = width > height;

  const scale = tablet
    ? landscape
      ? Math.min(width / 850, height / 500)
      : Math.min(width / 650, height / 900)
    : Math.min(width / 360, height / 780);

  const safeScale = Math.max(scale, 1);

  const size = (value) => Math.round(value * safeScale);

  const navIcons = [
    "home-outline",
    "chart-box-outline",
    "swap-horizontal",
    "layers-outline",
    "account-outline",
  ];

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
            height: size(tablet ? 125 : 115),
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
              paddingTop: size(tablet ? 20 : 15),
              paddingHorizontal: tablet ? size(30) : size(15),
            },
          ]}
        >
          <Image
            source={require("../../assets/images/invest.png.png")}
            style={{
              width: size(tablet ? 240 : 220),
              height: size(tablet ? 175 : 160),
            }}
            resizeMode="contain"
          />

          <Text
            style={[
              styles.successTitle,
              {
                fontSize: size(tablet ? 26 : 24),
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
                fontSize: size(tablet ? 16 : 15),
                lineHeight: size(tablet ? 22 : 20),
                marginTop: size(tablet ? 35 : 30),
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
                fontSize: size(tablet ? 16 : 15),
                marginTop: size(tablet ? 40 : 35),
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
                width: size(tablet ? 260 : 230),
                height: size(tablet ? 48 : 44),
                borderRadius: size(22),
                marginTop: size(tablet ? 22 : 18),
              },
            ]}
            activeOpacity={0.8}
            onPress={() => router.push("/investments")}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  fontSize: size(tablet ? 16 : 15),
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
              height: size(tablet ? 90 : 85),
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
