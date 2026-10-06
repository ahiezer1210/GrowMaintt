import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useAppSettings } from "../../context/Appsettings";
import { auth, db } from "../../firebaseConfig";

export default function SavingsGoalsScreen() {
  const { width, height } = useWindowDimensions();
  const { t, colors } = useAppSettings();

  const isSmallScreen = width < 360;
  const isMediumScreen = width >= 360 && width < 600;
  const isTablet = width >= 600;
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

  const s = (size) => size * scale;

  const [mainGoal, setMainGoal] = useState(null);
  const [savedgoal, setSavedgoal] = useState([]);
  const [expandedGoal, setExpandedGoal] = useState(null);
  const [abono, setAbono] = useState("");
  const [addingMoney, setAddingMoney] = useState(false);

  useEffect(() => {
    let unsubscribeGoals;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setMainGoal(null);
        setSavedgoal([]);
        return;
      }

      const goalsQuery = query(
        collection(db, "Metas de Ahorro"),
        where("uid", "==", user.uid)
      );

      unsubscribeGoals = onSnapshot(
        goalsQuery,
        (snapshot) => {
          const goals = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          const main = goals.find(
            (item) => item.isMainGoal === true
          );

          const others = goals.filter(
            (item) => item.isMainGoal !== true
          );

          setMainGoal(main || null);
          setSavedgoal(others);
        },
        (error) => {
          console.log("ERROR LOADING GOALS:", error);
          setMainGoal(null);
          setSavedgoal([]);
        }
      );
    });

    return () => {
      unsubscribeAuth();

      if (unsubscribeGoals) {
        unsubscribeGoals();
      }
    };
  }, []);

  const mainTarget = mainGoal
    ? Number(mainGoal.targetAmount || 0)
    : 0;

  const mainSaved = mainGoal
    ? Number(mainGoal.currentSavings || 0)
    : 0;

  const progress =
    mainTarget > 0
      ? Math.min(
          100,
          Math.round((mainSaved / mainTarget) * 100)
        )
      : 0;

  const remaining = Math.max(
    0,
    mainTarget - mainSaved
  );

  const hasGoals =
    mainGoal !== null || savedgoal.length > 0;

  const toggleGoal = (goalId) => {
    if (expandedGoal === goalId) {
      setExpandedGoal(null);
      setAbono("");
    } else {
      setExpandedGoal(goalId);
      setAbono("");
    }
  };

  const handleAddMoney = async (selectedGoal) => {
    const value = Number(abono);

    if (!abono || isNaN(value) || value <= 0) {
      Alert.alert(
        t.error || "Error",
        t.validAmount || "Please enter a valid amount."
      );
      return;
    }

    const current = Number(
      selectedGoal.currentSavings || 0
    );

    const target = Number(
      selectedGoal.targetAmount || 0
    );

    if (current + value > target) {
      const available = Math.max(
        0,
        target - current
      );

      Alert.alert(
        t.amountTooHigh || "Amount too high",
        `${t.canAddUpTo || "You can add up to"} $${available.toFixed(
          2
        )} ${t.toCompleteGoal || "to complete this goal."}`
      );
      return;
    }

    try {
      setAddingMoney(true);

      await updateDoc(
        doc(
          db,
          "Metas de Ahorro",
          selectedGoal.id
        ),
        {
          currentSavings: current + value,
        }
      );

      setAbono("");

      Alert.alert(
        t.amountAdded || "Amount added",
        t.savingsUpdated ||
          "Your savings have been updated successfully."
      );
    } catch (error) {
      console.log("ERROR ADDING MONEY:", error);

      Alert.alert(
        t.error || "Error",
        t.amountCouldNotBeAdded ||
          "The amount could not be added."
      );
    } finally {
      setAddingMoney(false);
    }
  };

  const abrirNotificaciones = () => {
    router.push({
      pathname: "/notifications",
      params: {
        from: "/currentgoal",
      },
    });
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background || "#081023",
        },
      ]}
    >
      <StatusBar
        translucent
        backgroundColor={colors.header || "#081023"}
        barStyle="light-content"
      />

      <View
        style={[
          styles.header,
          {
            height: s(145),
            paddingHorizontal: horizontalPadding,
            backgroundColor: colors.header || "#081023",
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.backButton,
            {
              left: 18 * scale,
              top: 50 * scale,
            },
          ]}
          onPress={() => router.replace("/home")}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={26 * scale}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            {
              fontSize: s(24),
            },
          ]}
          numberOfLines={1}
        >
          {t.savingsGoals || "Savings Goals"}
        </Text>

        <TouchableOpacity
          style={[
            styles.notificationButton,
            {
              width: 40 * scale,
              height: 40 * scale,
              borderRadius: 20 * scale,
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

      <View
        style={[
          styles.content,
          {
            backgroundColor: colors.background || "#FFFFFF",
            borderTopLeftRadius: 35 * scale,
            borderTopRightRadius: 35 * scale,
          },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            {
              backgroundColor:
                colors.background || "#FFFFFF",
              paddingHorizontal: horizontalPadding,
              paddingTop: s(20),
              paddingBottom: s(110),
            },
          ]}
        >
          {!hasGoals ? (
            <View
              style={[
                styles.noGoalsContainer,
                {
                  paddingVertical: s(30),
                },
              ]}
            >
              <Text
                style={[
                  styles.noGoalsText,
                  {
                    color:
                      colors.secondaryText ||
                      "#6b7280",
                    fontSize: s(16),
                  },
                ]}
              >
                {t.noGoals || "No goals"}
              </Text>
            </View>
          ) : (
            <>
              {mainGoal && (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() =>
                    toggleGoal(mainGoal.id)
                  }
                >
                  <View
                    style={[
                      styles.mainGoalCard,
                      {
                        borderRadius: s(25),
                        padding: s(22),
                        marginBottom: s(30),
                      },
                    ]}
                  >
                    <View style={styles.mainGoalHeader}>
                      <View
                        style={{
                          flex: 1,
                          marginRight: s(10),
                        }}
                      >
                        <Text
                          style={[
                            styles.mainGoalLabel,
                            {
                              fontSize: s(13),
                              marginBottom: s(4),
                            },
                          ]}
                        >
                          {t.mainGoal || "MAIN GOAL"}
                        </Text>

                        <Text
                          style={[
                            styles.mainGoalTitle,
                            {
                              fontSize: s(27),
                            },
                          ]}
                          numberOfLines={2}
                        >
                          {mainGoal.goalName}
                        </Text>
                      </View>

                      <MaterialCommunityIcons
                        name={
                          expandedGoal === mainGoal.id
                            ? "chevron-up"
                            : "chevron-down"
                        }
                        size={s(25)}
                        color="#fff"
                      />
                    </View>

                    <View
                      style={[
                        styles.amountRow,
                        {
                          marginTop: s(25),
                        },
                      ]}
                    >
                      <View>
                        <Text
                          style={[
                            styles.amountLabel,
                            {
                              fontSize: s(12),
                            },
                          ]}
                        >
                          {t.saved || "SAVED"}
                        </Text>

                        <Text
                          style={[
                            styles.savedAmount,
                            {
                              fontSize: s(24),
                              marginTop: s(3),
                            },
                          ]}
                        >
                          ${mainSaved.toFixed(2)}
                        </Text>
                      </View>

                      <View
                        style={styles.targetContainer}
                      >
                        <Text
                          style={[
                            styles.amountLabel,
                            {
                              fontSize: s(12),
                            },
                          ]}
                        >
                          {t.target || "TARGET"}
                        </Text>

                        <Text
                          style={[
                            styles.targetAmount,
                            {
                              fontSize: s(18),
                              marginTop: s(3),
                            },
                          ]}
                        >
                          ${mainTarget.toFixed(2)}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.progressBackground,
                        {
                          height: s(8),
                          borderRadius: s(10),
                          marginTop: s(20),
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.progressBar,
                          {
                            width: `${progress}%`,
                            borderRadius: s(10),
                          },
                        ]}
                      />
                    </View>

                    <View
                      style={[
                        styles.progressInfo,
                        {
                          marginTop: s(8),
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.progressText,
                          {
                            fontSize: s(12),
                          },
                        ]}
                      >
                        {progress}%{" "}
                        {t.completed || "completed"}
                      </Text>

                      <Text
                        style={[
                          styles.progressText,
                          {
                            fontSize: s(12),
                          },
                        ]}
                      >
                        ${remaining.toFixed(2)}{" "}
                        {t.left || "left"}
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.deadline,
                        {
                          fontSize: s(12),
                          marginTop: s(15),
                        },
                      ]}
                    >
                      {t.deadline || "Deadline"}:{" "}
                      {mainGoal.endDate ||
                        t.noDeadline ||
                        "No deadline"}
                    </Text>

                    {expandedGoal === mainGoal.id && (
                      <View
                        style={[
                          styles.expandedContent,
                          {
                            marginTop: s(15),
                            paddingTop: s(15),
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.descriptionTitle,
                            {
                              fontSize: s(14),
                              marginBottom: s(5),
                            },
                          ]}
                        >
                          {t.description || "Description"}
                        </Text>

                        <Text
                          style={[
                            styles.descriptionText,
                            {
                              fontSize: s(13),
                              marginBottom: s(15),
                            },
                          ]}
                        >
                          {mainGoal.description ||
                            t.noDescription ||
                            "No description"}
                        </Text>

                        <Text
                          style={[
                            styles.addMoneyTitle,
                            {
                              fontSize: s(14),
                              marginBottom: s(8),
                            },
                          ]}
                        >
                          {t.addAmount || "Add amount"}
                        </Text>

                        <TextInput
                          style={[
                            styles.addMoneyInput,
                            {
                              fontSize: s(14),
                              borderRadius: s(12),
                              padding: s(12),
                              marginBottom: s(10),
                              color:
                                colors.text ||
                                "#0b1624",
                              backgroundColor:
                                colors.card ||
                                "#fff",
                            },
                          ]}
                          placeholder={
                            t.enterAmount ||
                            "Enter amount"
                          }
                          placeholderTextColor="#999"
                          keyboardType="decimal-pad"
                          value={abono}
                          onChangeText={setAbono}
                        />

                        <TouchableOpacity
                          style={[
                            styles.addMoneyButton,
                            {
                              borderRadius: s(20),
                              height: s(42),
                            },
                          ]}
                          onPress={() =>
                            handleAddMoney(mainGoal)
                          }
                          disabled={addingMoney}
                        >
                          <Text
                            style={[
                              styles.addMoneyButtonText,
                              {
                                fontSize: s(14),
                              },
                            ]}
                          >
                            {addingMoney
                              ? t.adding || "Adding..."
                              : t.addAmount ||
                                "Add amount"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              )}

              {savedgoal.length > 0 && (
                <>
                  <Text
                    style={[
                      styles.sectionTitle,
                      {
                        color:
                          colors.text ||
                          "#0b1624",
                        fontSize: s(19),
                        marginBottom: s(15),
                      },
                    ]}
                  >
                    {t.myOtherGoals ||
                      "My other goals"}
                  </Text>

                  {savedgoal.map((goal) => {
                    const target = Number(
                      goal.targetAmount || 0
                    );

                    const saved = Number(
                      goal.currentSavings || 0
                    );

                    const goalProgress =
                      target > 0
                        ? Math.min(
                            100,
                            Math.round(
                              (saved / target) * 100
                            )
                          )
                        : 0;

                    return (
                      <TouchableOpacity
                        key={goal.id}
                        activeOpacity={0.9}
                        onPress={() =>
                          toggleGoal(goal.id)
                        }
                      >
                        <View
                          style={[
                            styles.otherGoalCard,
                            {
                              backgroundColor:
                                colors.card ||
                                colors.surface ||
                                "#f2f2f2",
                              borderRadius: s(18),
                              padding: s(16),
                              marginBottom: s(15),
                            },
                            expandedGoal === goal.id &&
                              styles.expandedOtherGoal,
                          ]}
                        >
                          <View
                            style={styles.otherGoalTop}
                          >
                            <View
                              style={[
                                styles.goalIconContainer,
                                {
                                  width: s(48),
                                  height: s(48),
                                  borderRadius: s(15),
                                  marginRight: s(13),
                                },
                              ]}
                            >
                              <MaterialCommunityIcons
                                name={
                                  goal.icon ||
                                  "wallet-outline"
                                }
                                size={s(24)}
                                color="#0b1624"
                              />
                            </View>

                            <View
                              style={styles.otherGoalInfo}
                            >
                              <Text
                                style={[
                                  styles.otherGoalTitle,
                                  {
                                    color:
                                      colors.text ||
                                      "#0b1624",
                                    fontSize: s(16),
                                    marginBottom: s(4),
                                  },
                                ]}
                                numberOfLines={2}
                              >
                                {goal.goalName}
                              </Text>

                              <Text
                                style={[
                                  styles.otherGoalAmount,
                                  {
                                    color:
                                      colors.secondaryText ||
                                      "#6b7280",
                                    fontSize: s(13),
                                  },
                                ]}
                              >
                                ${saved.toFixed(2)} / $
                                {target.toFixed(2)}
                              </Text>
                            </View>

                            <MaterialCommunityIcons
                              name={
                                expandedGoal === goal.id
                                  ? "chevron-up"
                                  : "chevron-down"
                              }
                              size={s(23)}
                              color="#0b1624"
                            />
                          </View>

                          <View
                            style={[
                              styles.otherProgressBackground,
                              {
                                height: s(6),
                                borderRadius: s(10),
                                marginTop: s(13),
                              },
                            ]}
                          >
                            <View
                              style={[
                                styles.otherProgressBar,
                                {
                                  width: `${goalProgress}%`,
                                  borderRadius: s(10),
                                },
                              ]}
                            />
                          </View>

                          {expandedGoal === goal.id && (
                            <View
                              style={[
                                styles.expandedContent,
                                {
                                  marginTop: s(15),
                                  paddingTop: s(15),
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.descriptionTitle,
                                  {
                                    color:
                                      colors.text ||
                                      "#0b1624",
                                    fontSize: s(14),
                                    marginBottom: s(5),
                                  },
                                ]}
                              >
                                {t.description ||
                                  "Description"}
                              </Text>

                              <Text
                                style={[
                                  styles.descriptionText,
                                  {
                                    color:
                                      colors.secondaryText ||
                                      "#4b5563",
                                    fontSize: s(13),
                                    marginBottom: s(15),
                                  },
                                ]}
                              >
                                {goal.description ||
                                  t.noDescription ||
                                  "No description"}
                              </Text>

                              <Text
                                style={[
                                  styles.addMoneyTitle,
                                  {
                                    color:
                                      colors.text ||
                                      "#0b1624",
                                    fontSize: s(14),
                                    marginBottom: s(8),
                                  },
                                ]}
                              >
                                {t.addAmount ||
                                  "Add amount"}
                              </Text>

                              <TextInput
                                style={[
                                  styles.addMoneyInput,
                                  {
                                    fontSize: s(14),
                                    borderRadius: s(12),
                                    padding: s(12),
                                    marginBottom: s(10),
                                    color:
                                      colors.text ||
                                      "#0b1624",
                                    backgroundColor:
                                      colors.card ||
                                      "#fff",
                                  },
                                ]}
                                placeholder={
                                  t.enterAmount ||
                                  "Enter amount"
                                }
                                placeholderTextColor="#999"
                                keyboardType="decimal-pad"
                                value={abono}
                                onChangeText={setAbono}
                              />

                              <TouchableOpacity
                                style={[
                                  styles.addMoneyButton,
                                  {
                                    borderRadius: s(20),
                                    height: s(42),
                                  },
                                ]}
                                onPress={() =>
                                  handleAddMoney(goal)
                                }
                                disabled={addingMoney}
                              >
                                <Text
                                  style={[
                                    styles.addMoneyButtonText,
                                    {
                                      fontSize: s(14),
                                    },
                                  ]}
                                >
                                  {addingMoney
                                    ? t.adding ||
                                      "Adding..."
                                    : t.addAmount ||
                                      "Add amount"}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </>
              )}
            </>
          )}
        </ScrollView>
      </View>

      <View
        style={[
          styles.bottomBar,
          {
            height: isSmallScreen
              ? 60
              : isTablet
              ? 65 * scale
              : 65,
            borderTopLeftRadius: 78 * scale,
          },
        ]}
      >
        {[
          ["home-outline", "/home"],
          ["chart-box-outline", "/historial"],
          ["swap-horizontal", "/expensesmanagement"],
          ["layers-outline", "/expensesmanagement"],
          ["account-outline", "/profile"],
        ].map(([icon, route], index) => (
          <TouchableOpacity
            key={index}
            style={styles.navItem}
            onPress={() => router.push(route)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name={icon}
              size={
                icon === "swap-horizontal"
                  ? 37 * scale
                  : 35 * scale
              }
              color="#FFFFFF"
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#081023",
  },

  header: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#081023",
  },

  backButton: {
    position: "absolute",
    zIndex: 10,
    padding: 8,
  },

  headerTitle: {
    fontWeight: "600",
    textAlign: "center",
    color: "#FFFFFF",
  },

  notificationButton: {
    position: "absolute",
    right: 18,
    top: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },

  scrollContent: {
    backgroundColor: "#FFFFFF",
    minHeight: "100%",
  },

  mainGoalCard: {
    backgroundColor: "#25B7D3",
  },

  mainGoalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  mainGoalLabel: {
    color: "rgba(255,255,255,0.75)",
    fontWeight: "bold",
  },

  mainGoalTitle: {
    color: "#fff",
    fontWeight: "bold",
  },

  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  amountLabel: {
    color: "rgba(255,255,255,0.75)",
    fontWeight: "bold",
  },

  savedAmount: {
    color: "#fff",
    fontWeight: "bold",
  },

  targetContainer: {
    alignItems: "flex-end",
  },

  targetAmount: {
    color: "#fff",
    fontWeight: "bold",
  },

  progressBackground: {
    backgroundColor: "rgba(255,255,255,0.35)",
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    backgroundColor: "#fff",
  },

  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  progressText: {
    color: "#fff",
  },

  deadline: {
    color: "rgba(255,255,255,0.85)",
  },

  sectionTitle: {
    color: "#0b1624",
    fontWeight: "bold",
  },

  otherGoalCard: {
    backgroundColor: "#f2f2f2",
  },

  expandedOtherGoal: {
    backgroundColor: "#f2f2f2",
  },

  otherGoalTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  goalIconContainer: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  otherGoalInfo: {
    flex: 1,
  },

  otherGoalTitle: {
    color: "#0b1624",
    fontWeight: "bold",
  },

  otherGoalAmount: {
    color: "#6b7280",
  },

  otherProgressBackground: {
    backgroundColor: "#d8d8d8",
    overflow: "hidden",
  },

  otherProgressBar: {
    height: "100%",
    backgroundColor: "#25B7D3",
  },

  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: "rgba(11,24,38,0.15)",
  },

  descriptionTitle: {
    fontWeight: "bold",
    color: "#0b1624",
  },

  descriptionText: {
    color: "#4b5563",
  },

  addMoneyTitle: {
    fontWeight: "bold",
    color: "#0b1624",
  },

  addMoneyInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#0b1624",
  },

  addMoneyButton: {
    backgroundColor: "#0b1624",
    alignItems: "center",
    justifyContent: "center",
  },

  addMoneyButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  noGoalsContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  noGoalsText: {
    color: "#6b7280",
    fontWeight: "bold",
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