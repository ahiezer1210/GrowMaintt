import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import { router } from "expo-router";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { auth, db } from "../../firebaseConfig.js";

export default function Devices() {
  const { width, height } = useWindowDimensions();

  const [devices, setDevices] = useState([]);
  const [currentDeviceId, setCurrentDeviceId] = useState(null);

  const isSmallScreen = width < 360;
  const isMediumScreen = width >= 360 && width < 600;
  const isTablet = width >= 600;
  const isLargeScreen = width >= 900;

  const scale = isSmallScreen
    ? 0.85
    : isMediumScreen
    ? 1
    : isLargeScreen
    ? 1.25
    : isTablet
    ? 1.15
    : 1;

  const horizontalPadding = isSmallScreen
    ? 18
    : isMediumScreen
    ? 25
    : isLargeScreen
    ? 60
    : isTablet
    ? 45
    : 25;

  const s = (size) => Math.round(size * scale);

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

  useEffect(() => {
    let unsubscribeAuth;
    let unsubscribeDevices;

    const registerDevice = async (user) => {
      try {
        let deviceId = await AsyncStorage.getItem(
          "growmaint_device_id"
        );

        if (!deviceId) {
          deviceId =
            `${Date.now()}-${Math.random()
              .toString(36)
              .substring(2, 12)}`;

          await AsyncStorage.setItem(
            "growmaint_device_id",
            deviceId
          );
        }

        setCurrentDeviceId(deviceId);

        let deviceName =
          Device.deviceName ||
          Device.modelName ||
          "My device";

        let deviceType = "phone";

        if (Platform.OS === "web") {
          deviceType = "desktop";
          deviceName = "Web Browser";
        } else if (
          Device.deviceType === Device.DeviceType.TABLET
        ) {
          deviceType = "tablet";
        } else if (
          Device.deviceType === Device.DeviceType.DESKTOP
        ) {
          deviceType = "desktop";
        }

        const systemName =
          Device.osName || Platform.OS;

        const deviceRef = doc(
          db,
          "Dispositivos Vinculados",
          user.uid,
          "linkedDevices",
          deviceId
        );

        await setDoc(
          deviceRef,
          {
            deviceId,
            deviceName,
            deviceType,
            systemName,
            modelName: Device.modelName || "",
            osVersion: Device.osVersion || "",
            lastActive: serverTimestamp(),
          },
          { merge: true }
        );

        const devicesRef = collection(
          db,
          "Dispositivos Vinculados",
          user.uid,
          "linkedDevices"
        );

        unsubscribeDevices = onSnapshot(
          devicesRef,
          (snapshot) => {
            const deviceList = snapshot.docs.map(
              (item) => ({
                id: item.id,
                ...item.data(),
              })
            );

            deviceList.sort((a, b) => {
              if (a.id === deviceId) return -1;
              if (b.id === deviceId) return 1;

              const dateA =
                a.lastActive?.toDate
                  ? a.lastActive.toDate()
                  : new Date(0);

              const dateB =
                b.lastActive?.toDate
                  ? b.lastActive.toDate()
                  : new Date(0);

              return dateB - dateA;
            });

            setDevices(deviceList);
          },
          (error) => {
            console.log(
              "Error loading linked devices:",
              error
            );

            Alert.alert(
              "Error",
              "The linked devices could not be loaded."
            );
          }
        );
      } catch (error) {
        console.log(
          "Error registering device:",
          error
        );

        Alert.alert(
          "Error",
          "The device could not be registered."
        );
      }
    };

    unsubscribeAuth = onAuthStateChanged(
      auth,
      async (user) => {
        if (!user) {
          setDevices([]);
          setCurrentDeviceId(null);
          return;
        }

        await registerDevice(user);
      }
    );

    return () => {
      if (unsubscribeAuth) {
        unsubscribeAuth();
      }

      if (unsubscribeDevices) {
        unsubscribeDevices();
      }
    };
  }, []);

  const getDeviceIcon = (device) => {
    if (device.deviceType === "desktop") {
      return "laptop-outline";
    }

    if (device.deviceType === "tablet") {
      return "tablet-portrait-outline";
    }

    return "phone-portrait-outline";
  };

  const getDeviceName = (device) => {
    if (device.id === currentDeviceId) {
      return "My device";
    }

    if (device.deviceName) {
      return device.deviceName;
    }

    return "Unknown device";
  };

  const getDeviceDetails = (device) => {
    const location = "El Salvador";

    if (device.deviceType === "desktop") {
      return `${location}\n${
        device.systemName || "Desktop"
      }`;
    }

    const model =
      device.modelName ||
      device.systemName ||
      "Mobile device";

    return `${model}\n${location}`;
  };

  const getDeviceStatus = (device) => {
    if (device.id === currentDeviceId) {
      return {
        active: true,
        text: "Active now",
      };
    }

    if (!device.lastActive?.toDate) {
      return {
        active: false,
        text: "Last active: unknown",
      };
    }

    const lastActive = device.lastActive.toDate();
    const now = new Date();

    const difference = now - lastActive;

    const minutes = Math.floor(
      difference / 60000
    );

    const hours = Math.floor(
      difference / 3600000
    );

    const days = Math.floor(
      difference / 86400000
    );

    if (minutes < 1) {
      return {
        active: false,
        text: "Last active: just now",
      };
    }

    if (minutes < 60) {
      return {
        active: false,
        text: `Last active: ${minutes} min ago`,
      };
    }

    if (hours < 24) {
      return {
        active: false,
        text: `Last active: ${hours}h ago`,
      };
    }

    if (days === 1) {
      return {
        active: false,
        text: "Last active: yesterday",
      };
    }

    return {
      active: false,
      text: `Last active: ${days} days ago`,
    };
  };

  const unlinkDevice = (device) => {
    if (device.id === currentDeviceId) {
      Alert.alert(
        "Current device",
        "You cannot unlink the device you are currently using."
      );

      return;
    }

    Alert.alert(
      "Unlink device",
      `Are you sure you want to unlink ${getDeviceName(
        device
      )}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Unlink",
          style: "destructive",
          onPress: async () => {
            try {
              const user = auth.currentUser;

              if (!user) {
                return;
              }

              await deleteDoc(
                doc(
                  db,
                  "Dispositivos Vinculados",
                  user.uid,
                  "linkedDevices",
                  device.id
                )
              );
            } catch (error) {
              console.log(
                "Error unlinking device:",
                error
              );

              Alert.alert(
                "Error",
                "The device could not be unlinked."
              );
            }
          },
        },
      ]
    );
  };

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
              transform: [
                {
                  translateY: s(4),
                },
                {
                  translateX: -s(4),
                },
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
              fontSize: s(25),
              lineHeight: s(23),
              transform: [
                {
                  translateX: s(4),
                },
                {
                  translateY: s(14),
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
                {
                  translateY: s(3),
                },
              ],
            },
          ]}
          onPress={abrirNotificaciones}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="bell-circle-outline"
            size={s(35)}
            color="#FFFFFF"
          />
        </TouchableOpacity>
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
        <ScrollView
          style={styles.content}
          contentContainerStyle={[
            styles.contentContainer,
            {
              paddingHorizontal: horizontalPadding,
              paddingTop: s(15),
              paddingBottom: s(90),
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={[
              styles.sectionTitle,
              {
                fontSize: s(18),
                marginBottom: s(15),
              },
            ]}
          >
            Devices
          </Text>

          {devices.map((device) => {
            const status =
              getDeviceStatus(device);

            return (
              <View
                key={device.id}
                style={[
                  styles.deviceCard,
                  {
                    minHeight: s(110),
                    padding: s(16),
                    borderRadius: s(20),
                    marginBottom: s(14),
                  },
                ]}
              >
                <View
                  style={[
                    styles.deviceIcon,
                    {
                      width: s(55),
                      height: s(55),
                      borderRadius: s(16),
                      marginRight: s(14),
                    },
                  ]}
                >
                  <Ionicons
                    name={getDeviceIcon(device)}
                    size={s(28)}
                    color="#3A7AFE"
                  />
                </View>

                <View style={styles.deviceInfo}>
                  <Text
                    style={[
                      styles.deviceName,
                      {
                        fontSize: s(16),
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {getDeviceName(device)}
                  </Text>

                  <Text
                    style={[
                      styles.deviceDetails,
                      {
                        fontSize: s(13),
                        lineHeight: s(18),
                        marginTop: s(3),
                      },
                    ]}
                  >
                    {getDeviceDetails(device)}
                  </Text>

                  <View
                    style={[
                      styles.status,
                      {
                        marginTop: s(4),
                      },
                    ]}
                  >
                    <View
                      style={[
                        status.active
                          ? styles.activeDot
                          : styles.dot,
                        {
                          width: s(7),
                          height: s(7),
                          borderRadius: s(4),
                          marginRight: s(6),
                        },
                      ]}
                    />

                    <Text
                      style={[
                        status.active
                          ? styles.activeText
                          : styles.lastActive,
                        {
                          fontSize: s(12),
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {status.text}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.unlinkButton,
                    {
                      paddingVertical: s(9),
                      paddingHorizontal: s(12),
                      borderRadius: s(10),
                      marginLeft: s(8),
                    },
                    device.id ===
                      currentDeviceId && {
                      opacity: 0.35,
                    },
                  ]}
                  onPress={() =>
                    unlinkDevice(device)
                  }
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.unlinkText,
                      {
                        fontSize: s(12),
                      },
                    ]}
                  >
                    Unlink
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}

          <View
            style={[
              styles.infoCard,
              {
                borderRadius: s(18),
                padding: s(16),
                marginTop: s(8),
              },
            ]}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={s(25)}
              color="#3A7AFE"
            />

            <View
              style={[
                styles.infoTextContainer,
                {
                  marginLeft: s(12),
                },
              ]}
            >
              <Text
                style={[
                  styles.infoTitle,
                  {
                    fontSize: s(14),
                    marginBottom: s(5),
                  },
                ]}
              >
                Keep your account secure
              </Text>

              <Text
                style={[
                  styles.infoText,
                  {
                    fontSize: s(12),
                    lineHeight: s(18),
                  },
                ]}
              >
                If you don't recognize a device,
                unlink it to protect your account.
              </Text>
            </View>
          </View>
        </ScrollView>

        <View
          style={[
            styles.bottomBar,
            {
              height: s(65),
              borderTopLeftRadius: s(78),
            },
          ]}
        >
          {navItems.map((item) => (
            <TouchableOpacity
              key={item.icon}
              style={styles.navButton}
              onPress={() =>
                router.push(item.route)
              }
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={s(35)}
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
    backgroundColor: "#071426",
    flexDirection: "row",
    alignItems: "center",
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
    paddingBottom: 90,
  },

  sectionTitle: {
    fontWeight: "700",
    color: "#222",
  },

  deviceCard: {
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  deviceIcon: {
    backgroundColor: "#EEF4FF",
    justifyContent: "center",
    alignItems: "center",
  },

  deviceInfo: {
    flex: 1,
    minWidth: 0,
  },

  deviceName: {
    fontWeight: "700",
    color: "#222",
  },

  deviceDetails: {
    color: "#777",
  },

  status: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0,
  },

  dot: {
    backgroundColor: "#999",
  },

  activeDot: {
    backgroundColor: "#25B7D3",
  },

  activeText: {
    color: "#259E8C",
    fontWeight: "600",
  },

  lastActive: {
    color: "#030101",
  },

  unlinkButton: {
    backgroundColor: "#FFF1F1",
  },

  unlinkText: {
    color: "#081023",
    fontWeight: "700",
  },

  infoCard: {
    backgroundColor: "#EEF4FF",
    flexDirection: "row",
  },

  infoTextContainer: {
    flex: 1,
  },

  infoTitle: {
    fontWeight: "700",
    color: "#222",
  },

  infoText: {
    color: "#666",
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