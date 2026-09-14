import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NAV = [
  ["home-outline", "/home"],
  ["chart-box-outline", "/historial"],
  ["swap-horizontal", "/expensesManagement"],
  ["layers-outline", "/currentgoal"],
  ["account-outline", "/profile"],
];

const BackupScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();

  const tablet = width >= 600;
  const landscape = width > height;
  const scale = tablet ? (landscape ? 1.15 : 1) : width < 360 ? 0.9 : 1;

  const [autoBackup, setAutoBackup] = useState(true);
  const [includeVideos, setIncludeVideos] = useState(false);
  const [useMobileData, setUseMobileData] = useState(false);
  const [endToEndEncryption, setEndToEndEncryption] = useState(false);

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <StatusBar backgroundColor="#0D1B2A" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/settings")}
          activeOpacity={0.7}
          style={styles.backButton}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={35 * scale}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Backup</Text>

        <TouchableOpacity
          style={styles.notification}
          onPress={() =>
            router.push({
              pathname: "/notifications",
              params: { from: "/backup" },
            })
          }
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="bell-circle-outline"
            size={35 * scale}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.topSection}>
        <View style={styles.successCard}>
          <View style={styles.successHeader}>
            <MaterialCommunityIcons
              color="#000000"
              name="shield-check-outline"
              size={26}
            />

            <Text style={styles.successTitle}>Backup Completed</Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: "100%" }]} />
            </View>

            <Text style={styles.progressText}>100%</Text>
          </View>
        </View>

        <View style={styles.infoCardsRow}>
          <View style={styles.infoCardWhite}>
            <Feather
              color="#23BDEE"
              name="arrow-up-right"
              size={20}
              style={styles.cardIcon}
            />

            <Text style={styles.infoLabelDark}>Last Backup</Text>
            <Text style={styles.infoValueDark}>11/10/2025</Text>
          </View>

          <View style={styles.infoCardBlue}>
            <MaterialCommunityIcons
              color="#FFFFFF"
              name="database-outline"
              size={20}
              style={styles.cardIcon}
            />

            <Text style={styles.infoLabelLight}>Size</Text>
            <Text style={styles.infoValueLight}>268 MB</Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={[
            styles.whiteSheet,
            {
              paddingHorizontal: tablet ? 35 : 20,
              paddingTop: landscape ? 12 : 16,
            },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              {
                fontSize: 13 * scale,
              },
            ]}
          >
            Backup Settings
          </Text>

          <View style={styles.greyDivider} />

          <Text
            style={[
              styles.descriptionText,
              {
                fontSize: 9.5 * scale,
                lineHeight: 13 * scale,
              },
            ]}
          >
            Save a backup of your data in the cloud To Ensure You Don't Lose
            Your Data When You Get A New Phone With Android/Apple.
          </Text>

          <View style={styles.settingRow}>
            <Text
              style={[
                styles.settingLabel,
                {
                  fontSize: 11.5 * scale,
                },
              ]}
            >
              Automatic Backups
            </Text>

            <Switch
              value={autoBackup}
              onValueChange={setAutoBackup}
              thumbColor="#FFFFFF"
              trackColor={{ false: "#E0E0E0", true: "#0D1B2A" }}
            />
          </View>

          <View style={styles.settingRow}>
            <Text
              style={[
                styles.settingLabel,
                {
                  fontSize: 11.5 * scale,
                },
              ]}
            >
              Include Videos
            </Text>

            <Switch
              value={includeVideos}
              onValueChange={setIncludeVideos}
              thumbColor="#FFFFFF"
              trackColor={{ false: "#E0E0E0", true: "#0D1B2A" }}
            />
          </View>

          <View style={styles.settingRow}>
            <Text
              style={[
                styles.settingLabel,
                {
                  fontSize: 11.5 * scale,
                },
              ]}
            >
              Use Mobile Data
            </Text>

            <Switch
              value={useMobileData}
              onValueChange={setUseMobileData}
              thumbColor="#FFFFFF"
              trackColor={{ false: "#E0E0E0", true: "#0D1B2A" }}
            />
          </View>

          <View style={styles.encryptionSection}>
            <Text style={styles.encryptionTitle}>End-to-End Encryption</Text>

            <Text style={styles.encryptionDescription}>
              For More Security, You Can Protect Your Backup With End-to-End
              Encryption
            </Text>

            <View style={styles.settingRow}>
              <Text
                style={[
                  styles.settingLabel,
                  {
                    fontSize: 11.5 * scale,
                  },
                ]}
              >
                Disabled
              </Text>

              <Switch
                value={endToEndEncryption}
                onValueChange={setEndToEndEncryption}
                thumbColor="#FFFFFF"
                trackColor={{ false: "#E0E0E0", true: "#0D1B2A" }}
              />
            </View>
          </View>

          <View style={styles.greyDivider} />

          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.saveButton,
              {
                width: tablet ? 300 : "55%",
              },
            ]}
          >
            <Text style={styles.saveButtonText}>Save Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomBarContainer}>
        <SafeAreaView edges={["bottom"]} style={styles.bottomBarWrapper}>
          <View
            style={[
              styles.bottomTabBar,
              {
                height: 65 * scale,
                borderTopLeftRadius: 78 * scale,
              },
            ]}
          >
            {NAV.map(([icon, route], index) => (
              <TouchableOpacity
                key={index}
                style={styles.tabItem}
                onPress={() => router.push(route)}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name={icon}
                  size={icon === "swap-horizontal" ? 37 * scale : 35 * scale}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            ))}
          </View>
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1B2A",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    height: 65,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },

  notification: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  topSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },

  successCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  successHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  successTitle: {
    color: "#0D1B2A",
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 8,
    flex: 1,
  },

  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressBarFill: {
    height: "100%",
    backgroundColor: "#23BDEE",
  },

  progressText: {
    color: "#23BDEE",
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 8,
  },

  infoCardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  infoCardWhite: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: "48%",
    alignItems: "center",
  },

  infoCardBlue: {
    backgroundColor: "#23BDEE",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: "48%",
    alignItems: "center",
  },

  cardIcon: {
    marginBottom: 2,
  },

  infoLabelDark: {
    color: "#546E7A",
    fontSize: 10,
  },

  infoValueDark: {
    color: "#0D1B2A",
    fontSize: 13,
    fontWeight: "700",
  },

  infoLabelLight: {
    color: "#E0F7FA",
    fontSize: 10,
  },

  infoValueLight: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  scrollContent: {
    flexGrow: 1,
  },

  whiteSheet: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },

  sectionTitle: {
    color: "#0D1B2A",
    fontSize: 13,
    fontWeight: "700",
  },

  greyDivider: {
    height: 5,
    backgroundColor: "#DCDCDC",
    borderRadius: 10,
    marginVertical: 4,
  },

  descriptionText: {
    color: "#546E7A",
    fontSize: 9.5,
    lineHeight: 13,
  },

  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 1,
  },

  settingLabel: {
    color: "#263238",
    fontSize: 11.5,
    fontWeight: "500",
  },

  encryptionSection: {
    marginTop: 2,
  },

  encryptionTitle: {
    color: "#0D1B2A",
    fontSize: 11.5,
    fontWeight: "700",
  },

  encryptionDescription: {
    color: "#546E7A",
    fontSize: 9,
    lineHeight: 12,
    marginBottom: 2,
  },

  saveButton: {
    backgroundColor: "#23BDEE",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 35,
    alignSelf: "center",
    width: "55%",
    alignItems: "center",
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  bottomBarContainer: {
    backgroundColor: "#FFFFFF",
  },

  bottomBarWrapper: {
    backgroundColor: "#25B5D1",
    borderTopLeftRadius: 78,
  },

  bottomTabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#25B5D1",
    overflow: "hidden",
  },

  tabItem: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default BackupScreen;