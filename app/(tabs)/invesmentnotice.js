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
      ? Math.min(width / 700, height / 430)
      : Math.min(width / 520, height / 760)
    : Math.min(width / 330, height / 700);

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
            paddingHorizontal: size(tablet ? 25 : 17),
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.backButton,
            {
              width: size(tablet ? 50 : 41),
              height: size(tablet ? 52 : 46),
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
            size={size(tablet ? 26 : 22)}
            color="#FFFF"
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            {
              fontSize: size(tablet ? 22 : 19),
              lineHeight: size(tablet ? 27 : 23),
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
              width: size(tablet ? 36 : 30),
              height: size(tablet ? 36 : 30),
              borderRadius: size(tablet ? 18 : 15),
            },
          ]}
        >
          <MaterialCommunityIcons
            name="bell-outline"
            size={size(tablet ? 20 : 17)}
            color="#428574"
          />
        </View>
      </View>

      <View
        style={[
          styles.main,
          {
            borderTopLeftRadius: size(tablet ? 42 : 36),
            borderTopRightRadius: size(tablet ? 42 : 36),
          },
        ]}
      >
        <View
          style={[
            styles.content,
            {
              paddingTop: size(tablet ? 25 : 15),
              paddingHorizontal: tablet ? size(30) : size(15),
            },
          ]}
        >
          <Image
            source={require("../../assets/images/invest.png.png")}
            style={{
              width: size(tablet ? 300 : 240),
              height: size(tablet ? 220 : 180),
            }}
            resizeMode="contain"
          />

          <Text
            style={[
              styles.successTitle,
              {
                fontSize: size(tablet ? 30 : 25),
                marginTop: size(tablet ? 8 : 5),
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
                fontSize: size(tablet ? 18 : 16),
                lineHeight: size(tablet ? 25 : 21),
                marginTop: size(tablet ? 38 : 30),
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
                fontSize: size(tablet ? 18 : 16),
                marginTop: size(tablet ? 42 : 35),
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
                width: size(tablet ? 320 : 250),
                height: size(tablet ? 56 : 48),
                borderRadius: size(tablet ? 28 : 24),
                marginTop: size(tablet ? 24 : 18),
              },
            ]}
            activeOpacity={0.8}
            onPress={() => router.push("/investments")}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  fontSize: size(tablet ? 18 : 15),
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
              height: size(tablet ? 100 : 85),
              borderTopLeftRadius: size(tablet ? 60 : 50),
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
                size={size(index === 2 ? (tablet ? 32 : 28) : tablet ? 28 : 24)}
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
