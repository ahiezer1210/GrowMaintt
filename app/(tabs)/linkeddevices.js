import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

const devices = [
  {
    icon: "phone-portrait-outline",
    name: "My device",
    details: "Samsung A06\nEl Salvador",
    active: true,
    status: "Active now",
  },
  {
    icon: "laptop-outline",
    name: "Windows 11",
    details: "El Salvador\nChrome · Windows",
    active: false,
    status: "Last active: yesterday",
  },
  {
    icon: "phone-portrait-outline",
    name: "Samsung Galaxy A06",
    details: "Sign in: 12/01\nEl Salvador",
    active: false,
    status: "Last active: 3 months ago",
  },
];

export default function Devices() {
  const { width } = useWindowDimensions();

  const small = width < 350;
  const tablet = width >= 600;

  const scale = small
    ? 0.85
    : width < 600
      ? 1
      : tablet && width < 900
        ? 1.15
        : 1.25;

  const s = (value) => Math.round(value * scale);

  const horizontalPadding = small
    ? 18
    : width < 600
      ? 25
      : tablet && width < 900
        ? 45
        : 60;

  const sizes = {
    title: small ? 23 : tablet ? 30 : 27,
    icon: small ? 24 : 28,
    padding: small ? 12 : tablet ? 18 : 15,
    cardRadius: small ? 18 : 20,
  };

  const navItems = [
    {
      icon: "home-outline",
      route: "/home",
    },
    {
      icon: "chart-box-outline",
      route: "/historial",
    },
    {
      icon: "swap-horizontal",
      route: "/expensesManagement",
    },
    {
      icon: "layers-outline",
      route: "/currentgoal",
    },
    {
      icon: "account-outline",
      route: "/profile",
    },
  ];

  const abrirNotificaciones = () => {
    router.push({
      pathname: "/notifications",
      params: {
        from: "/linkeddevices",
      },
    });
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View
        style={[
          styles.header,
          small && styles.headerSmall,
          tablet && styles.headerTablet,
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
              transform: [
                { translateY: 4 * scale },
                { translateX: -4 * scale },
              ],
            },
          ]}
          onPress={() => router.push("/settings")}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={s(35)}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.title,
            {
              fontSize:
                25 * (small ? 0.85 : tablet ? 1.15 : 1),
              lineHeight:
                23 * (small ? 0.85 : tablet ? 1.15 : 1),
              transform: [
                {
                  translateX:
                    4 * (small ? 0.85 : tablet ? 1.15 : 1),
                },
                {
                  translateY:
                    14 * (small ? 0.85 : tablet ? 1.15 : 1),
                },
              ],
            },
          ]}
        >
          Linked{"\n"}Devices
        </Text>

        <TouchableOpacity
          style={[
            styles.headerBell,
            {
              transform: [
                { translateY: 3 * scale },
              ],
            },
          ]}
          onPress={abrirNotificaciones}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="bell-circle-outline"
            size={35 * scale}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      {/* CARD PRINCIPAL */}
      <View
        style={[
          styles.main,
          {
            borderTopLeftRadius: 36 * scale,
            borderTopRightRadius: 36 * scale,
          },
        ]}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={[
            styles.contentContainer,
            small && styles.contentSmall,
            tablet && styles.contentTablet,
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={[
              styles.sectionTitle,
              small && styles.sectionSmall,
            ]}
          >
            Devices
          </Text>

          {devices.map((device, index) => (
            <View
              key={index}
              style={[
                styles.deviceCard,
                {
                  padding: sizes.padding,
                  borderRadius: sizes.cardRadius,
                },
                small && styles.deviceCardSmall,
                tablet && styles.deviceCardTablet,
              ]}
            >
              <View
                style={[
                  styles.deviceIcon,
                  small && styles.deviceIconSmall,
                ]}
              >
                <Ionicons
                  name={device.icon}
                  size={sizes.icon}
                  color="#3A7AFE"
                />
              </View>

              <View style={styles.deviceInfo}>
                <Text
                  style={[
                    styles.deviceName,
                    small && styles.deviceNameSmall,
                  ]}
                  numberOfLines={1}
                >
                  {device.name}
                </Text>

                <Text
                  style={[
                    styles.deviceDetails,
                    small && styles.deviceDetailsSmall,
                  ]}
                >
                  {device.details}
                </Text>

                <View style={styles.status}>
                  <View
                    style={[
                      device.active
                        ? styles.activeDot
                        : styles.dot,
                      small && styles.dotSmall,
                    ]}
                  />

                  <Text
                    style={[
                      device.active
                        ? styles.activeText
                        : styles.lastActive,
                      small &&
                        (device.active
                          ? styles.activeTextSmall
                          : styles.lastActiveSmall),
                    ]}
                    numberOfLines={1}
                  >
                    {device.status}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.unlinkButton,
                  small && styles.unlinkButtonSmall,
                ]}
              >
                <Text
                  style={[
                    styles.unlinkText,
                    small && styles.unlinkTextSmall,
                  ]}
                >
                  Unlink
                </Text>
              </TouchableOpacity>
            </View>
          ))}

          <View
            style={[
              styles.infoCard,
              small && styles.infoCardSmall,
            ]}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={small ? 22 : 25}
              color="#3A7AFE"
            />

            <View style={styles.infoTextContainer}>
              <Text
                style={[
                  styles.infoTitle,
                  small && styles.infoTitleSmall,
                ]}
              >
                Keep your account secure
              </Text>

              <Text
                style={[
                  styles.infoText,
                  small && styles.infoTextSmall,
                ]}
              >
                If you don't recognize a device, unlink it to protect your
                account.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* NAVBAR */}
        <View
          style={[
            styles.bottomBar,
            {
              height: 65 * scale,
              borderTopLeftRadius: 78 * scale,
            },
          ]}
        >
          {navItems.map((item) => (
            <TouchableOpacity
              key={item.icon}
              style={styles.navButton}
              onPress={() => router.push(item.route)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={35 * scale}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#071426",
  },

  header: {
    width: "100%",
    height: 115,
    backgroundColor: "#071426",
    flexDirection: "row",
    alignItems: "center",
  },

  headerSmall: {
    height: 100,
  },

  headerTablet: {
    height: 132,
  },

  backButton: {
    justifyContent: "center",
    alignItems: "flex-start",
  },

  title: {
    flex: 1,
    color: "#FFFFFF",
    fontWeight: "700",
    textAlign: "center",
  },

  headerBell: {
    justifyContent: "center",
  },

  main: {
    flex: 1,
    width: "100%",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },

  content: {
    flex: 1,
  },

  contentContainer: {
    padding: 20,
    paddingTop: 15,
    paddingBottom: 90,
  },

  contentSmall: {
    padding: 14,
    paddingTop: 12,
    paddingBottom: 90,
  },

  contentTablet: {
    paddingHorizontal: 40,
    paddingTop: 20,
    paddingBottom: 100,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    marginBottom: 15,
  },

  sectionSmall: {
    fontSize: 16,
    marginBottom: 12,
  },

  deviceCard: {
    minHeight: 110,
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  deviceCardSmall: {
    minHeight: 105,
  },

  deviceCardTablet: {
    minHeight: 120,
  },

  deviceIcon: {
    width: 55,
    height: 55,
    borderRadius: 16,
    backgroundColor: "#EEF4FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  deviceIconSmall: {
    width: 48,
    height: 48,
    borderRadius: 14,
    marginRight: 10,
  },

  deviceInfo: {
    flex: 1,
    minWidth: 0,
  },

  deviceName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
  },

  deviceNameSmall: {
    fontSize: 14,
  },

  deviceDetails: {
    fontSize: 13,
    color: "#777",
    lineHeight: 18,
    marginTop: 3,
  },

  deviceDetailsSmall: {
    fontSize: 11,
    lineHeight: 16,
  },

  status: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    minWidth: 0,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#999",
    marginRight: 6,
  },

  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#25B7D3",
    marginRight: 6,
  },

  dotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },

  activeText: {
    fontSize: 12,
    color: "#259E8C",
    fontWeight: "600",
  },

  activeTextSmall: {
    fontSize: 10,
  },

  lastActive: {
    fontSize: 12,
    color: "#030101",
  },

  lastActiveSmall: {
    fontSize: 10,
  },

  unlinkButton: {
    backgroundColor: "#FFF1F1",
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginLeft: 8,
  },

  unlinkButtonSmall: {
    paddingVertical: 7,
    paddingHorizontal: 9,
    borderRadius: 9,
    marginLeft: 5,
  },

  unlinkText: {
    color: "#081023",
    fontSize: 12,
    fontWeight: "700",
  },

  unlinkTextSmall: {
    fontSize: 10,
  },

  infoCard: {
    backgroundColor: "#EEF4FF",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    marginTop: 8,
  },

  infoCardSmall: {
    padding: 13,
    borderRadius: 16,
  },

  infoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#222",
    marginBottom: 5,
  },

  infoTitleSmall: {
    fontSize: 12,
  },

  infoText: {
    fontSize: 12,
    lineHeight: 18,
    color: "#666",
  },

  infoTextSmall: {
    fontSize: 11,
    lineHeight: 16,
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

  navButton: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});