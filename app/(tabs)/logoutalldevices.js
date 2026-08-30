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

export default function LogoutDevices() {
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

  return (
    <View style={styles.screen}>
      <StatusBar
        translucent
        backgroundColor={"#071426"}
        barStyle="light-content"
      />

      <View
        style={[
          styles.header,
          {
            height: s(115),
            paddingHorizontal: s(17),
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={s(22)}
            color={"#FFFF"}
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            {
              fontSize: s(19),
              lineHeight: s(23),
            },
          ]}
        >
          Log out on all your{"\n"}devices
        </Text>

        <View
          style={[
            styles.bellButton,
            {
              width: s(30),
              height: s(30),
              borderRadius: s(15),
            },
          ]}
        >
          <MaterialCommunityIcons
            name="bell-outline"
            size={s(19)}
            color={"#397468"}
          />
        </View>
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
        <View style={styles.content}>
          <Image
            source={require("../../assets/images/Screenshot 2026-08-28 21253461.png")}
            style={{
              width: s(210),
              height: s(210),
            }}
            resizeMode="contain"
          />

          <Text
            style={[
              styles.description,
              {
                fontSize: s(14),
                lineHeight: s(20),
              },
            ]}
          >
            You will be signed out on all the{"\n"}
            devices you are logged into.
          </Text>

          <Text
            style={[
              styles.question,
              {
                fontSize: s(25),
              },
            ]}
          >
            Do you want to continue?
          </Text>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  width: s(190),
                  height: s(36),
                  borderRadius: s(22),
                },
              ]}
              onPress={() => {}}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    fontSize: s(14),
                  },
                ]}
              >
                Continue
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  width: s(190),
                  height: s(36),
                  borderRadius: s(22),
                  marginTop: s(12),
                },
              ]}
              onPress={() => router.back()}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    fontSize: s(13),
                  },
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[
            styles.bottomBar,
            {
              height: s(95),
              borderTopLeftRadius: s(60),
            },
          ]}
        >
          {navIcons.map((icon, index) => (
            <TouchableOpacity key={icon} style={styles.navButton}>
              <MaterialCommunityIcons
                name={icon}
                size={s(index === 2 ? 30 : 26)}
                color={"#FFFF"}
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
    backgroundColor: "#071426",
  },

  header: {
    width: "100%",
    backgroundColor: "#071426",
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
    color: "#FFFF",
    fontWeight: "505",
    textAlign: "center",
  },

  bellButton: {
    backgroundColor: "#E2F5E9",
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
    paddingTop: 40,
  },

  description: {
    color: "#071426",
    textAlign: "center",
    marginTop: 20,
  },

  question: {
    color: "#071426",
    textAlign: "center",
    fontWeight: "710",
    marginTop: 25,
  },

  buttonsContainer: {
    alignItems: "center",
    marginTop: 40,
  },

  actionButton: {
    backgroundColor: "#071426",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFF",
    fontWeight: "505",
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
    paddingTop: 20,
  },
});
