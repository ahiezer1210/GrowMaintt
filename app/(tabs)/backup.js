import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
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
import { useAppSettings } from "../../context/Appsettings";
import { db } from "../../firebaseConfig";

const NAV = [
  ["home-outline", "/home"],
  ["chart-box-outline", "/historial"],
  ["swap-horizontal", "/expensesManagement"],
  ["layers-outline", "/currentgoal"],
  ["account-outline", "/profile"],
];

const BACKUP_COLLECTIONS = [
  {
    name: "Registro de gastos",
    backupName: "expenses",
  },
  {
    name: "Ahorros",
    backupName: "savings",
  },
  {
    name: "Metas de Ahorro",
    backupName: "goals",
  },
  {
    name: "Puntos",
    backupName: "points",
  },
  {
    name: "Canjeos",
    backupName: "redemptions",
  },
  {
    name: "Recompensas",
    backupName: "rewards",
  },
  {
    name: "Historial de puntos",
    backupName: "pointsHistory",
  },
  {
    name: "securityAlerts",
    backupName: "securityAlerts",
  },
  {
    name: "notifications",
    backupName: "notifications",
  },
];

const USER_SUBCOLLECTIONS = [
  "Puntos",
  "Canjeos",
  "Recompensas",
  "Historial de puntos",
  "securityAlerts",
  "notifications",
];

const BackupScreen = ({ navigation }) => {
  const { colors, t, isDark } = useAppSettings();

  const { width, height } = useWindowDimensions();

  const tablet = width >= 600;
  const landscape = width > height;

  const scale = tablet
    ? landscape
      ? 1.15
      : 1
    : width < 360
    ? 0.9
    : 1;

  const [autoBackup, setAutoBackup] = useState(true);
  const [useMobileData, setUseMobileData] = useState(false);
  const [endToEndEncryption, setEndToEndEncryption] =
    useState(false);

  const [backupProgress, setBackupProgress] = useState(0);
  const [backupStatus, setBackupStatus] =
    useState("No Backup Yet");
  const [lastBackup, setLastBackup] =
    useState("--/--/----");
  const [backupSize, setBackupSize] =
    useState("0 KB");

  const [backupRunning, setBackupRunning] =
    useState(false);
  const [settingsSaving, setSettingsSaving] =
    useState(false);

  const auth = getAuth();

  const getCurrentUser = () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("No hay un usuario autenticado.");
    }

    return currentUser;
  };

  const convertForFirestore = (value) => {
    if (value === undefined || value === null) {
      return null;
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    if (
      typeof value === "object" &&
      value !== null &&
      typeof value.toDate === "function"
    ) {
      try {
        return value.toDate().toISOString();
      } catch {
        return null;
      }
    }

    if (Array.isArray(value)) {
      return value.map((item) =>
        convertForFirestore(item)
      );
    }

    if (typeof value === "object") {
      const result = {};

      Object.keys(value).forEach((key) => {
        result[key] = convertForFirestore(value[key]);
      });

      return result;
    }

    return value;
  };

  const calculateSize = (data) => {
    try {
      const json = JSON.stringify(data);
      const bytes = new Blob([json]).size;

      if (bytes < 1024) {
        return `${bytes} B`;
      }

      if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
      }

      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    } catch {
      return "0 KB";
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "--/--/----";
    }

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
      return "--/--/----";
    }

    const day = String(value.getDate()).padStart(2, "0");
    const month = String(
      value.getMonth() + 1
    ).padStart(2, "0");
    const year = value.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const getTranslatedBackupStatus = () => {
    if (backupStatus === "Backup Completed") {
      return t.backupCompleted;
    }

    if (backupStatus === "Backup Failed") {
      return t.backupFailed;
    }

    if (backupStatus === "Creating Backup") {
      return t.creatingBackup;
    }

    return t.noBackupYet;
  };

  const loadBackupSettings = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        return;
      }

      const settingsRef = doc(
        db,
        "Users",
        user.uid,
        "BackupSettings",
        "settings"
      );

      const settingsSnapshot =
        await getDoc(settingsRef);

      if (!settingsSnapshot.exists()) {
        return;
      }

      const data = settingsSnapshot.data();

      if (typeof data.autoBackup === "boolean") {
        setAutoBackup(data.autoBackup);
      }

      if (
        typeof data.useMobileData === "boolean"
      ) {
        setUseMobileData(data.useMobileData);
      }

      if (
        typeof data.endToEndEncryption ===
        "boolean"
      ) {
        setEndToEndEncryption(
          data.endToEndEncryption
        );
      }

      if (data.lastBackup) {
        setLastBackup(
          formatDate(data.lastBackup)
        );
      }

      if (data.backupSize) {
        setBackupSize(data.backupSize);
      }

      if (
        typeof data.backupProgress === "number"
      ) {
        setBackupProgress(
          data.backupProgress
        );
      }

      if (data.backupStatus) {
        setBackupStatus(data.backupStatus);
      }
    } catch (error) {
      console.log(
        "Error loading backup settings:",
        error
      );
    }
  };

  const getCollectionData = async (
    collectionName
  ) => {
    try {
      const user = auth.currentUser;

      if (!user) {
        return [];
      }

      const collectionRef = collection(
        db,
        collectionName
      );

      let snapshot;

      try {
        const userQuery = query(
          collectionRef,
          where("uid", "==", user.uid)
        );

        snapshot = await getDocs(userQuery);
      } catch {
        snapshot = await getDocs(
          collectionRef
        );
      }

      const documents = [];

      snapshot.forEach((item) => {
        const data = item.data();

        if (
          data &&
          data.uid &&
          data.uid !== user.uid
        ) {
          return;
        }

        documents.push({
          id: item.id,
          data: convertForFirestore(data),
        });
      });

      return documents;
    } catch (error) {
      console.log(
        `Error reading collection ${collectionName}:`,
        error
      );

      return [];
    }
  };

  const getUserSubcollectionData = async (
    uid,
    subcollectionName
  ) => {
    try {
      const reference = collection(
        db,
        "Users",
        uid,
        subcollectionName
      );

      const snapshot =
        await getDocs(reference);

      const documents = [];

      snapshot.forEach((item) => {
        documents.push({
          id: item.id,
          data: convertForFirestore(
            item.data()
          ),
        });
      });

      return documents;
    } catch (error) {
      console.log(
        `Error reading user subcollection ${subcollectionName}:`,
        error
      );

      return [];
    }
  };

  const saveBackupSection = async (
    uid,
    backupId,
    sectionName,
    documents
  ) => {
    const sectionRef = doc(
      db,
      "Users",
      uid,
      "Backups",
      backupId,
      "sections",
      sectionName
    );

    await setDoc(sectionRef, {
      section: sectionName,
      count: documents.length,
      documents,
      createdAt: serverTimestamp(),
    });
  };

  const updateBackupSettings = async (
    uid,
    backupData
  ) => {
    await setDoc(
      doc(
        db,
        "Users",
        uid,
        "BackupSettings",
        "settings"
      ),
      backupData,
      {
        merge: true,
      }
    );
  };

  const createBackup = async () => {
    if (backupRunning) {
      return;
    }

    try {
      const user = getCurrentUser();

      setBackupRunning(true);
      setBackupStatus("Creating Backup");
      setBackupProgress(5);

      const backupId = `${Date.now()}`;
      const backupDate =
        new Date().toISOString();

      const backupReference = doc(
        db,
        "Users",
        user.uid,
        "Backups",
        backupId
      );

      await setDoc(backupReference, {
        userId: user.uid,
        email: user.email || null,
        createdAt: serverTimestamp(),
        createdAtClient: backupDate,
        status: "creating",
        useMobileData,
        endToEndEncryption,
      });

      setBackupProgress(10);

      const profileSnapshot =
        await getDoc(
          doc(db, "Users", user.uid)
        );

      const profile =
        profileSnapshot.exists()
          ? convertForFirestore(
              profileSnapshot.data()
            )
          : {};

      await saveBackupSection(
        user.uid,
        backupId,
        "profile",
        [
          {
            id: user.uid,
            data: profile,
          },
        ]
      );

      setBackupProgress(20);

      const settingsData = {
        autoBackup,
        useMobileData,
        endToEndEncryption,
      };

      await saveBackupSection(
        user.uid,
        backupId,
        "settings",
        [
          {
            id: "settings",
            data: convertForFirestore(
              settingsData
            ),
          },
        ]
      );

      setBackupProgress(25);

      const allBackupDocuments = {
        profile: [
          {
            id: user.uid,
            data: profile,
          },
        ],
        settings: [
          {
            id: "settings",
            data: convertForFirestore(
              settingsData
            ),
          },
        ],
      };

      const totalCollections =
        BACKUP_COLLECTIONS.length;

      for (
        let i = 0;
        i < totalCollections;
        i++
      ) {
        const current =
          BACKUP_COLLECTIONS[i];

        const documents =
          await getCollectionData(
            current.name
          );

        await saveBackupSection(
          user.uid,
          backupId,
          current.backupName,
          documents
        );

        allBackupDocuments[
          current.backupName
        ] = documents;

        const progress =
          25 +
          Math.round(
            ((i + 1) /
              totalCollections) *
              55
          );

        setBackupProgress(progress);
      }

      for (
        let i = 0;
        i < USER_SUBCOLLECTIONS.length;
        i++
      ) {
        const subcollection =
          USER_SUBCOLLECTIONS[i];

        const documents =
          await getUserSubcollectionData(
            user.uid,
            subcollection
          );

        await saveBackupSection(
          user.uid,
          backupId,
          `user_${subcollection}`,
          documents
        );

        allBackupDocuments[
          `user_${subcollection}`
        ] = documents;
      }

      setBackupProgress(90);

      const finalBackupData = {
        backupId,
        userId: user.uid,
        email: user.email || null,
        profile,
        settings: settingsData,
        data: allBackupDocuments,
        createdAt: backupDate,
      };

      const calculatedSize =
        calculateSize(
          finalBackupData
        );

      await setDoc(
        backupReference,
        {
          userId: user.uid,
          email: user.email || null,
          createdAt: serverTimestamp(),
          createdAtClient: backupDate,
          status: "completed",
          size: calculatedSize,
          useMobileData,
          endToEndEncryption,
        },
        {
          merge: true,
        }
      );

      await updateBackupSettings(
        user.uid,
        {
          autoBackup,
          useMobileData,
          endToEndEncryption,
          lastBackup: backupDate,
          backupSize: calculatedSize,
          lastBackupId: backupId,
          backupProgress: 100,
          backupStatus:
            "Backup Completed",
          updatedAt: serverTimestamp(),
        }
      );

      setBackupProgress(100);
      setBackupStatus(
        "Backup Completed"
      );
      setLastBackup(
        formatDate(backupDate)
      );
      setBackupSize(
        calculatedSize
      );

      Alert.alert(
        t.backupCompleted,
        `${t.backupCompletedMessage}\n\n${t.size}: ${calculatedSize}`,
        [
          {
            text: t.ok,
          },
        ]
      );
    } catch (error) {
      console.log(
        "Backup error:",
        error
      );

      setBackupProgress(0);
      setBackupStatus(
        "Backup Failed"
      );

      const user = auth.currentUser;

      if (user) {
        try {
          await updateBackupSettings(
            user.uid,
            {
              backupProgress: 0,
              backupStatus:
                "Backup Failed",
              updatedAt:
                serverTimestamp(),
            }
          );
        } catch (settingsError) {
          console.log(
            "Error saving failed backup state:",
            settingsError
          );
        }
      }

      Alert.alert(
        t.backupError,
        t.backupErrorMessage
      );
    } finally {
      setBackupRunning(false);
    }
  };

  const saveSettings = async () => {
    if (settingsSaving) {
      return;
    }

    try {
      const user = getCurrentUser();

      setSettingsSaving(true);

      await updateBackupSettings(
        user.uid,
        {
          autoBackup,
          useMobileData,
          endToEndEncryption,
          updatedAt:
            serverTimestamp(),
        }
      );

      setSettingsSaving(false);

      Alert.alert(
        t.settingsSaved,
        t.settingsSavedMessage
      );
    } catch (error) {
      console.log(
        "Error saving backup settings:",
        error
      );

      setSettingsSaving(false);

      Alert.alert(
        t.settingsError,
        t.settingsErrorMessage
      );
    }
  };

  useEffect(() => {
    loadBackupSettings();
  }, []);

  return (
    <SafeAreaView
      edges={["top"]}
      style={[
        styles.container,
        {
          backgroundColor:
            colors.primaryBackground,
        },
      ]}
    >
      <StatusBar
        backgroundColor={
          colors.primaryBackground
        }
        barStyle="light-content"
      />

      {/* HEADER */}
      <View
        style={[
          styles.header,
          {
            backgroundColor:
              colors.header,
            height: 118 * scale,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() =>
            router.push("/settings")
          }
          activeOpacity={0.7}
          style={[
            styles.backButton,
            {
              left: 15 * scale,
              top: 34 * scale,
              width: 55 * scale,
              height: 55 * scale,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={35 * scale}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            {
              fontSize: 25 * scale,
            },
          ]}
        >
          {t.backup}
        </Text>

        <TouchableOpacity
          style={[
            styles.notification,
            {
              right: 15 * scale,
              top: 34 * scale,
              width: 55 * scale,
              height: 55 * scale,
            },
          ]}
          onPress={() =>
            router.push({
              pathname: "/notifications",
              params: {
                from: "/backup",
              },
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
        <View
          style={[
            styles.successCard,
            {
              backgroundColor:
                colors.card,
            },
          ]}
        >
          <View
            style={styles.successHeader}
          >
            <MaterialCommunityIcons
              color={colors.text}
              name={
                backupStatus ===
                "Backup Failed"
                  ? "alert-circle-outline"
                  : backupStatus ===
                    "Backup Completed"
                  ? "shield-check-outline"
                  : "cloud-upload-outline"
              }
              size={26}
            />

            <Text
              style={[
                styles.successTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              {getTranslatedBackupStatus()}
            </Text>
          </View>

          <View
            style={
              styles.progressContainer
            }
          >
            <View
              style={[
                styles.progressBarBackground,
                {
                  backgroundColor:
                    colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${backupProgress}%`,
                    backgroundColor:
                      colors.icon,
                  },
                ]}
              />
            </View>

            <Text
              style={[
                styles.progressText,
                {
                  color: colors.icon,
                },
              ]}
            >
              {backupProgress}%
            </Text>
          </View>
        </View>

        <View
          style={styles.infoCardsRow}
        >
          <View
            style={[
              styles.infoCardWhite,
              {
                backgroundColor:
                  colors.card,
              },
            ]}
          >
            <Feather
              color={colors.icon}
              name="arrow-up-right"
              size={20}
              style={styles.cardIcon}
            />

            <Text
              style={[
                styles.infoLabelDark,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              {t.lastBackup}
            </Text>

            <Text
              style={[
                styles.infoValueDark,
                {
                  color: colors.text,
                },
              ]}
            >
              {lastBackup}
            </Text>
          </View>

          <View
            style={[
              styles.infoCardBlue,
              {
                backgroundColor:
                  colors.icon,
              },
            ]}
          >
            <MaterialCommunityIcons
              color="#FFFFFF"
              name="database-outline"
              size={20}
              style={styles.cardIcon}
            />

            <Text
              style={styles.infoLabelLight}
            >
              {t.size}
            </Text>

            <Text
              style={styles.infoValueLight}
            >
              {backupSize}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.scrollContent
        }
      >
        <View
          style={[
            styles.whiteSheet,
            {
              backgroundColor:
                colors.card,
              paddingHorizontal:
                tablet ? 35 : 20,
              paddingTop:
                landscape ? 12 : 16,
            },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              {
                fontSize: 13 * scale,
                color: colors.text,
              },
            ]}
          >
            {t.backupSettings}
          </Text>

          <View
            style={[
              styles.greyDivider,
              {
                backgroundColor:
                  colors.border,
              },
            ]}
          />

          <Text
            style={[
              styles.descriptionText,
              {
                fontSize:
                  9.5 * scale,
                lineHeight:
                  13 * scale,
                color:
                  colors.secondaryText,
              },
            ]}
          >
            {t.backupDescription}
          </Text>

          <View
            style={styles.settingRow}
          >
            <Text
              style={[
                styles.settingLabel,
                {
                  fontSize:
                    11.5 * scale,
                  color: colors.text,
                },
              ]}
            >
              {t.automaticBackups}
            </Text>

            <Switch
              value={autoBackup}
              onValueChange={
                setAutoBackup
              }
              disabled={
                backupRunning
              }
              thumbColor="#FFFFFF"
              trackColor={{
                false: colors.border,
                true:
                  colors.primaryBackground,
              }}
            />
          </View>

          <View
            style={styles.settingRow}
          >
            <Text
              style={[
                styles.settingLabel,
                {
                  fontSize:
                    11.5 * scale,
                  color: colors.text,
                },
              ]}
            >
              {t.useMobileData}
            </Text>

            <Switch
              value={useMobileData}
              onValueChange={
                setUseMobileData
              }
              disabled={
                backupRunning
              }
              thumbColor="#FFFFFF"
              trackColor={{
                false: colors.border,
                true:
                  colors.primaryBackground,
              }}
            />
          </View>

          <View
            style={
              styles.encryptionSection
            }
          >
            <Text
              style={[
                styles.encryptionTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              {
                t.endToEndEncryption
              }
            </Text>

            <Text
              style={[
                styles.encryptionDescription,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >
              {
                t.encryptionDescription
              }
            </Text>

            <View
              style={styles.settingRow}
            >
              <Text
                style={[
                  styles.settingLabel,
                  {
                    fontSize:
                      11.5 * scale,
                    color: colors.text,
                  },
                ]}
              >
                {endToEndEncryption
                  ? t.enabled
                  : t.disabled}
              </Text>

              <Switch
                value={
                  endToEndEncryption
                }
                onValueChange={
                  setEndToEndEncryption
                }
                disabled={
                  backupRunning
                }
                thumbColor="#FFFFFF"
                trackColor={{
                  false:
                    colors.border,
                  true:
                    colors.primaryBackground,
                }}
              />
            </View>
          </View>

          <View
            style={[
              styles.greyDivider,
              {
                backgroundColor:
                  colors.border,
              },
            ]}
          />

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={createBackup}
            disabled={backupRunning}
            style={[
              styles.backupButton,
              {
                backgroundColor:
                  colors.primaryBackground,
                width: tablet
                  ? 300
                  : "70%",
                opacity:
                  backupRunning
                    ? 0.6
                    : 1,
              },
            ]}
          >
            <MaterialCommunityIcons
              name={
                backupRunning
                  ? "cloud-upload"
                  : backupProgress ===
                      100 &&
                    backupStatus ===
                      "Backup Completed"
                  ? "check-circle-outline"
                  : "cloud-upload-outline"
              }
              size={20}
              color="#FFFFFF"
            />

            <Text
              style={
                styles.backupButtonText
              }
            >
              {backupRunning
                ? `${t.creatingBackup}... ${backupProgress}%`
                : backupProgress ===
                    100 &&
                  backupStatus ===
                    "Backup Completed"
                ? t.performBackupAgain
                : t.performBackup}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={saveSettings}
            disabled={
              settingsSaving ||
              backupRunning
            }
            style={[
              styles.saveButton,
              {
                backgroundColor:
                  colors.icon,
                width: tablet
                  ? 300
                  : "55%",
                opacity:
                  settingsSaving ||
                  backupRunning
                    ? 0.6
                    : 1,
              },
            ]}
          >
            <Text
              style={
                styles.saveButtonText
              }
            >
              {settingsSaving
                ? t.saving
                : t.saveSettings}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* NAVBAR */}
      <View
        style={[
          styles.bottomBarContainer,
          {
            backgroundColor:
              colors.card,
          },
        ]}
      >
        <SafeAreaView
          edges={["bottom"]}
          style={styles.bottomBarWrapper}
        >
          <View
            style={[
              styles.bottomTabBar,
              {
                height: 65 * scale,
                borderTopLeftRadius:
                  78 * scale,
              },
            ]}
          >
            {NAV.map(
              ([icon, route], index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.tabItem}
                  onPress={() =>
                    router.push(route)
                  }
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name={icon}
                    size={
                      icon ===
                      "swap-horizontal"
                        ? 37 * scale
                        : 35 * scale
                    }
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
              )
            )}
          </View>
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    height: 118,
    backgroundColor: "#071426",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    position: "relative",
  },

  backButton: {
    position: "absolute",
    left: 15,
    top: 34,
    width: 55,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    elevation: 10,
  },

  headerTitle: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "700",
    textAlign: "center",
    transform: [{ translateY: 3}],
    transform: [{ translateX: -2}],
  },

  notification: {
    position: "absolute",
    right: 15,
    top: 34,
    width: 55,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    elevation: 10,
  },

  topSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },

  successCard: {
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
    borderRadius: 10,
    overflow: "hidden",
  },

  progressBarFill: {
    height: "100%",
    borderRadius: 10,
  },

  progressText: {
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
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: "48%",
    alignItems: "center",
  },

  infoCardBlue: {
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
    fontSize: 10,
  },

  infoValueDark: {
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
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
  },

  greyDivider: {
    height: 5,
    borderRadius: 10,
    marginVertical: 4,
  },

  descriptionText: {
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
    fontSize: 11.5,
    fontWeight: "500",
  },

  encryptionSection: {
    marginTop: 2,
  },

  encryptionTitle: {
    fontSize: 11.5,
    fontWeight: "700",
  },

  encryptionDescription: {
    fontSize: 9,
    lineHeight: 12,
    marginBottom: 2,
  },

  backupButton: {
    borderRadius: 20,
    paddingVertical: 9,
    paddingHorizontal: 25,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 8,
  },

  backupButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 7,
  },

  saveButton: {
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
    overflow: "hidden",
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