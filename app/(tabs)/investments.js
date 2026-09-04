import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    Image,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";

export default function InversionesScreen() {
  const { width, height } = useWindowDimensions();

  const isSmallScreen = width < 360;
  const isMediumScreen = width >= 360 && width < 600;
  const isTablet = width >= 600 && width < 900;
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

  const abrirInteractiveBrokers = async () => {
    await Linking.openURL("https://www.interactivebrokers.com/");
  };

  return (
    <View style={styles.container}>
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
              transform: [{ translateY: 13 * scale }],
            },
          ]}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={22 * scale}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            {
              fontSize: 25 * scale,
              transform: [
                { translateX: 2 * scale },
                { translateY: 11 * scale },
              ],
            },
          ]}
        >
          Investments
        </Text>

        <View
          style={[
            styles.headerBell,
            {
              transform: [{ translateY: 13 * scale }],
            },
          ]}
        >
          <MaterialCommunityIcons
            name="bell-circle-outline"
            size={28 * scale}
            color="#FFFFFF"
          />
        </View>
      </View>

      <View
        style={[
          styles.content,
          {
            borderTopLeftRadius: 45 * scale,
            borderTopRightRadius: 45 * scale,
          },
        ]}
      >
        <View
          style={[
            styles.investmentContent,
            {
              paddingHorizontal: horizontalPadding,
            },
          ]}
        >
          <Image
            source={require("../../assets/images/investment-circle.png")}
            style={[
              styles.investmentImage,
              {
                width: 220 * scale,
                height: 300 * scale,
                transform: [{ translateY: -70 * scale }],
              },
            ]}
          />

          <View
            style={[
              styles.logoContainer,
              {
                height: 45 * scale,
              },
            ]}
          >
            <Image
              source={require("../../assets/images/interactive-brokers.png")}
              style={[
                styles.interactiveSymbol,
                {
                  width: 75 * scale,
                  height: 55 * scale,
                  marginRight: 4 * scale,
                  transform: [
                    { translateX: -15 * scale },
                    { translateY: -120 * scale },
                  ],
                },
              ]}
            />

            <View
              style={[
                styles.logoTextContainer,
                {
                  transform: [
                    { translateX: -17 * scale },
                    { translateY: -117 * scale },
                  ],
                },
              ]}
            >
              <Text
                style={[
                  styles.interactiveText,
                  {
                    fontSize: 21 * scale,
                    lineHeight: 21 * scale,
                  },
                ]}
              >
                Interactive
              </Text>

              <Text
                style={[
                  styles.brokersText,
                  {
                    fontSize: 21 * scale,
                    lineHeight: 21 * scale,
                  },
                ]}
              >
                Brokers
              </Text>
            </View>
          </View>

          <Text
            style={[
              styles.subtitle,
              {
                fontSize: 19 * scale,
                transform: [
                  { translateX: 5 * scale },
                  { translateY: -100 * scale },
                ],
              },
            ]}
          >
            Take the next step
          </Text>

          <TouchableOpacity
            style={[
              styles.linkButton,
              {
                width: isSmallScreen
                  ? "80%"
                  : isMediumScreen
                    ? "70%"
                    : isTablet
                      ? "60%"
                      : "55%",
                height: 71 * scale,
                borderRadius: 25 * scale,
                paddingHorizontal: 30 * scale,
                transform: [
                  { translateX: 4 * scale },
                  { translateY: -100 * scale },
                ],
              },
            ]}
            onPress={abrirInteractiveBrokers}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.linkText,
                {
                  fontSize: 10 * scale,
                },
              ]}
            >
              Go to Interactive Brokers
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.bottomBar,
            {
              height: 65 * scale,
              borderTopLeftRadius: 78 * scale,
            },
          ]}
        >
          <TouchableOpacity style={styles.navItem}>
            <MaterialCommunityIcons
              name="home-outline"
              size={35 * scale}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <MaterialCommunityIcons
              name="chart-box-outline"
              size={35 * scale}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <MaterialCommunityIcons
              name="swap-horizontal"
              size={37 * scale}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <MaterialCommunityIcons
              name="layers-outline"
              size={35 * scale}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <MaterialCommunityIcons
              name="account-outline"
              size={35 * scale}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111C2E",
  },

  header: {
    backgroundColor: "#111C2E",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 30,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  headerBell: {
    justifyContent: "center",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  content: {
    flex: 1,
    width: "100%",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },

  investmentContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
  },

  investmentImage: {
    resizeMode: "contain",
  },

  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  interactiveSymbol: {
    resizeMode: "contain",
  },

  logoTextContainer: {
    justifyContent: "center",
  },

  interactiveText: {
    fontWeight: "bold",
    color: "#292929",
  },

  brokersText: {
    fontWeight: "400",
    color: "#292929",
  },

  subtitle: {
    fontWeight: "600",
    color: "#111C2E",
  },

  linkButton: {
    backgroundColor: "#25B5D1",
    justifyContent: "center",
    alignItems: "center",
  },

  linkText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },

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
