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

export default function SavingsReminder() {
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
        backgroundColor={"#0b1624"}
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
          Savings{"\n"}Reminder
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
            size={s(17)}
            color={"#428574"}
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
            source={require("../../assets/images/Screenshot 2026-08-29 2030457.png")}
            style={{
              width: s(190),
              height: s(140),
            }}
            resizeMode="contain"
          />

          <Text
            style={[
              styles.successTitle,
              {
                fontSize: s(22),
              },
            ]}
          >
            Great job!
          </Text>

          <Text
            style={[
              styles.successSubtitle,
              {
                fontSize: s(13),
              },
            ]}
          >
            Today you saved
          </Text>

          <Text
            style={[
              styles.amountText,
              {
                fontSize: s(36),
              },
            ]}
          >
            $0.40
          </Text>

          <View
            style={[
              styles.cardBox,
              {
                width: Math.min(s(330), width - s(30)),
                borderRadius: s(16),
                padding: s(12),
                marginTop: s(14),
              },
            ]}
          >
            <Text
              style={[
                styles.cardLabel,
                {
                  fontSize: s(11),
                },
              ]}
            >
              Percentage of your goal
            </Text>

            <View
              style={[
                styles.progressBarBackground,
                {
                  height: s(11),
                  borderRadius: s(5),
                  marginVertical: s(8),
                },
              ]}
            >
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: "25%",
                    height: "100%",
                    borderRadius: s(5),
                  },
                ]}
              />
            </View>

            <Text
              style={[
                styles.progressHint,
                {
                  fontSize: s(10),
                },
              ]}
            >
              Keep up with your goal!
            </Text>
          </View>
          <View
            style={[
              styles.cardBox,
              styles.tipBox,
              {
                width: s(330),
                borderRadius: s(16),
                padding: s(12),
                marginTop: s(10),
              },
            ]}
          >
            <MaterialCommunityIcons
              name="star-outline"
              size={s(35)}
              color={"#0b1624"}
              style={{ marginRight: s(10) }}
            />
            <Text
              style={[
                styles.tipText,
                {
                  fontSize: s(11),
                  lineHeight: s(15),
                },
              ]}
            >
              Tip: Saving $0.40 cents a day{"\n"}will get you about $12.00{"\n"}
              in a month.{"\n"}
              <Text style={{ fontWeight: "bold" }}>
                Remember to visualize your savings!
              </Text>
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                width: Math.min(s(210), width - s(80)),
                height: s(40),
                borderRadius: s(22),
                marginTop: s(18),
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
              Go To Savings
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.bottomBar,
            {
              height: s(85),
              borderTopLeftRadius: s(50),
            },
          ]}
        >
          {navIcons.map((icon, index) => (
            <TouchableOpacity
              key={icon}
              style={[styles.navButton, width >= 600 && { maxwidth: 110 }]}
            >
              <MaterialCommunityIcons name={icon} color={"#FFFF"} />
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
    width: 41,
    height: 46,
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
    paddingTop: 15,
  },
  successTitle: {
    color: "#0b1624",
    fontWeight: "bold",
    marginTop: 5,
  },
  successSubtitle: {
    color: "#6b7280",
    marginTop: 2,
  },
  amountText: {
    color: "#0b1624",
    fontWeight: "bold",
    marginTop: 2,
  },
  cardBox: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  cardLabel: {
    color: "#6b7280",
  },
  progressBarBackground: {
    width: "100%",
    backgroundColor: "#e5e7eb",
    overflow: "hidden",
  },
  progressBarFill: {
    backgroundColor: "#0b1624",
  },
  progressHint: {
    color: "#9ca3af",
    textAlign: "right",
  },
  tipBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  tipText: {
    flex: 1,
    color: "#374151",
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
