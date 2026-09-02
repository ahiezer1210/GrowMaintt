import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const SecurityAlertScreen = () => {
  const { width, height } = useWindowDimensions();
  const isSmallScreen = width < true;
  const isShortScreen = height < 700;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B1C2D" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon
            name="chevron-back"
            size={isSmallScreen ? 22 : 24}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Security Alert</Text>

        <View style={styles.headerRight}>
          <View style={styles.checkCircle}>
            <Icon
              name="notifications"
              size={isSmallScreen ? 24 : 26}
              color="#FFFFFF"
            />
          </View>
        </View>
      </View>

      <View
        style={[
          styles.content,
          isSmallScreen && styles.contentSmall,
          isShortScreen && styles.contentShort,
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            isSmallScreen && styles.iconContainerSmall,
          ]}
        >
          <View
            style={[
              styles.outerCircle,
              isSmallScreen && styles.outerCircleSmall,
            ]}
          >
            <View
              style={[
                styles.warningTriangle,
                isSmallScreen && styles.warningTriangleSmall,
              ]}
            >
              <Text
                style={[
                  styles.exclamation,
                  isSmallScreen && styles.exclamationSmall,
                ]}
              >
                !
              </Text>
            </View>
          </View>

          <View style={[styles.decorLine, styles.lineTopLeft]} />
          <View style={[styles.decorLine, styles.lineTopRight]} />
          <View style={[styles.decorLine, styles.lineBottomLeft]} />
          <View style={[styles.decorLine, styles.lineBottomRight]} />
        </View>

        <Text
          style={[styles.mainTitle, isSmallScreen && styles.mainTitleSmall]}
        >
          New Login Attempt
        </Text>

        <View style={styles.infoRow}>
          <MaterialIcons
            name="smartphone"
            size={isSmallScreen ? 65 : 75}
            color="#333"
          />

          <View style={styles.infoTextContainer}>
            <Text style={[styles.infoLabel, isSmallScreen && styles.textSmall]}>
              Device
            </Text>

            <Text style={[styles.infoValue, isSmallScreen && styles.textSmall]}>
              Samsung Galaxy A06
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Icon
            name="location-outline"
            size={isSmallScreen ? 27 : 30}
            color="#333"
          />

          <Text
            style={[
              styles.locationText,
              isSmallScreen && styles.locationTextSmall,
            ]}
          >
            San Salvador, El Salvador
          </Text>
        </View>

        <Text style={[styles.question, isSmallScreen && styles.questionSmall]}>
          Was this you?
        </Text>

        <TouchableOpacity
          style={[styles.primaryButton, isSmallScreen && styles.buttonSmall]}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.primaryButtonText,
              isSmallScreen && styles.buttonTextSmall,
            ]}
          >
            Yes, It Was Me
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, isSmallScreen && styles.buttonSmall]}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.secondaryButtonText,
              isSmallScreen && styles.buttonTextSmall,
            ]}
          >
            No, It Was Not Me
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon
            name="home-outline"
            size={isSmallScreen ? 22 : 24}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Icon
            name="bar-chart-outline"
            size={isSmallScreen ? 22 : 24}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Icon
            name="swap-horizontal-outline"
            size={isSmallScreen ? 22 : 24}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Icon
            name="library-outline"
            size={isSmallScreen ? 22 : 24}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Icon
            name="person-outline"
            size={isSmallScreen ? 22 : 24}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1C2D",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#0B1C2D",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  headerRight: {
    width: 40,
    alignItems: "flex-end",
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    alignItems: "center",
  },
  contentSmall: {
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  contentShort: {
    paddingTop: 12,
  },
  iconContainer: {
    width: 160,
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  iconContainerSmall: {
    width: 135,
    height: 135,
    marginBottom: 15,
  },
  outerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#E8F0FE",
    justifyContent: "center",
    alignItems: "center",
  },
  outerCircleSmall: {
    width: 115,
    height: 115,
    borderRadius: 58,
  },
  warningTriangle: {
    width: 72,
    height: 72,
    backgroundColor: "#2B6CE5",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "0deg" }],
  },
  warningTriangleSmall: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  exclamation: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "bold",
  },
  exclamationSmall: {
    fontSize: 36,
  },
  decorLine: {
    position: "absolute",
    width: 16,
    height: 3,
    backgroundColor: "#2B6CE5",
    borderRadius: 2,
  },
  lineTopLeft: {
    top: 18,
    left: 12,
    transform: [{ rotate: "-40deg" }],
  },
  lineTopRight: {
    top: 18,
    right: 12,
    transform: [{ rotate: "40deg" }],
  },
  lineBottomLeft: {
    bottom: 22,
    left: 12,
    transform: [{ rotate: "40deg" }],
  },
  lineBottomRight: {
    bottom: 22,
    right: 12,
    transform: [{ rotate: "-40deg" }],
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 28,
    textAlign: "center",
  },
  mainTitleSmall: {
    fontSize: 19,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 18,
    paddingHorizontal: 8,
  },
  infoTextContainer: {
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 13,
    color: "#666",
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  textSmall: {
    fontSize: 13,
  },
  locationText: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "500",
    color: "#1A1A1A",
    paddingLeft: 12,
  },
  locationTextSmall: {
    fontSize: 13,
    marginLeft: 8,
    paddingLeft: 8,
  },
  question: {
    fontSize: 16,
    color: "#555",
    marginTop: 12,
    marginBottom: 24,
  },
  questionSmall: {
    fontSize: 13,
    marginTop: 8,
    marginBottom: 16,
  },
  primaryButton: {
    width: "65%",
    backgroundColor: "#0B1C2D",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 14,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    width: "65%",
    backgroundColor: "#0B1C2D",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#0B1C2D",
  },
  buttonSmall: {
    paddingVertical: 13,
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextSmall: {
    fontSize: 14,
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#00B4D8",
    paddingVertical: 14,
    paddingBottom: 20,
    justifyContent: "space-around",
    alignItems: "center",
    borderTopLeftRadius: 65,
    borderTopRightRadius: 0,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    padding: 8,
  },
});

export default SecurityAlertScreen;
