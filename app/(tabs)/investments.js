import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useAppSettings } from "../../context/Appsettings";

export default function InversionesScreen() {
  const { width } = useWindowDimensions();
  const { colors, t } = useAppSettings();

  const isSmallScreen = width < 360;
  const isMediumScreen = width >= 360 && width < 600;
  const isTablet = width >= 600 && width < 900;

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

  const abrirNotificaciones = () => {
    router.push({
      pathname: "/notifications",
      params: {
        from: "/investments",
      },
    });
  };

  // Vuelve al Home que ya existe en la pila (no apila otro Home)
  const goHome = () => {
    router.replace("/home");
  };

  const navItems = [
    { icon: "home-outline", route: "/home" },
    { icon: "chart-box-outline", route: "/historial" },
    { icon: "swap-horizontal", route: "/expensesManagement" },
    { icon: "layers-outline", route: "/currentgoal" },
    { icon: "account-outline", route: "/profile" },
  ];

  const styles = StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.primaryBackground,
    },

    container: {
      flex: 1,
      backgroundColor: colors.primaryBackground,
    },

    header: {
      backgroundColor: colors.header,
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
      color: colors.white,
      fontWeight: "700",
    },

    content: {
      flex: 1,
      width: "100%",
      backgroundColor: colors.background,
      overflow: "hidden",
    },

    whiteScroll: {
      flex: 1,
      backgroundColor: colors.background,
    },

    scrollContent: {
      flexGrow: 1,
      paddingTop: 20,
      paddingBottom: 140,
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
      color: colors.text,
    },

    brokersText: {
      fontWeight: "400",
      color: colors.text,
    },

    subtitle: {
      fontWeight: "600",
      color: colors.text,
    },

    linkButton: {
      backgroundColor: colors.icon,
      justifyContent: "center",
      alignItems: "center",
    },

    linkText: {
      color: colors.white,
      fontWeight: "500",
    },

    bottomBar: {
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100%",
      backgroundColor: colors.nav,
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

  return (
    <SafeAreaView style={styles.safe}>
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
              transform: [{ translateY: 4 * scale }],
            },
          ]}
          onPress={goHome}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={35 * scale}
            color={colors.white}
          />
        </TouchableOpacity>

        <Text
          pointerEvents="none"
          style={[
            styles.headerTitle,
            {
              fontSize: 25 * scale,
              transform: [{ translateX: 7 * scale }, { translateY: 1 * scale }],
            },
          ]}
        >
          {t.investments}
        </Text>

        <TouchableOpacity
          style={[
            styles.headerBell,
            {
              transform: [{ translateY: 4 * scale }],
            },
          ]}
          onPress={abrirNotificaciones}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="bell-circle-outline"
            size={35 * scale}
            color={colors.white}
          />
        </TouchableOpacity>
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
        <ScrollView
          style={styles.whiteScroll}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: horizontalPadding,
            },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.investmentContent}>
            <Image
              source={require("../../assets/images/investment.png")}
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
              {t.takeNextStep}
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
                {t.goToInteractiveBrokers}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View
          style={[
            styles.bottomBar,
            {
              height: 65 * scale,
              borderTopLeftRadius: 78 * scale,
            },
          ]}
        >
          {navItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.navItem}
              onPress={() =>
                item.route === "/home" ? goHome() : router.push(item.route)
              }
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={
                  item.icon === "swap-horizontal" ? 37 * scale : 35 * scale
                }
                color={colors.white}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}