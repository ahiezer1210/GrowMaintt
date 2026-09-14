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
import { auth, db } from "../../firebaseConfig";

export default function SavingsGoalsScreen() {
  const { width, height } = useWindowDimensions();

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
        "Invalid amount",
        "Please enter a valid amount."
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
        "Amount too high",
        `You can add up to $${available.toFixed(2)} to complete this goal.`
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
        "Amount added",
        "Your savings have been updated successfully."
      );
    } catch (error) {
      console.log("ERROR ADDING MONEY:", error);

      Alert.alert(
        "Error",
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
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#081023"
      />

      {/* HEADER */}
      <View
        style={[
          styles.header,
          {
            paddingHorizontal: horizontalPadding,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
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
          numberOfLines={1}
        >
          Savings Goals
        </Text>

        <TouchableOpacity
          style={styles.notificationButton}
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

      {/* CARD BLANCA */}
      <View
        style={[
          styles.content,
          {
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
                    fontSize: s(16),
                  },
                ]}
              >
                No goals
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
                          MAIN GOAL
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
                          SAVED
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
                          TARGET
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
                        {progress}% completed
                      </Text>

                      <Text
                        style={[
                          styles.progressText,
                          {
                            fontSize: s(12),
                          },
                        ]}
                      >
                        ${remaining.toFixed(2)} left
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
                      Deadline:{" "}
                      {mainGoal.endDate || "No deadline"}
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
                          Description
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
                          Add amount
                        </Text>

                        <TextInput
                          style={[
                            styles.addMoneyInput,
                            {
                              fontSize: s(14),
                              borderRadius: s(12),
                              padding: s(12),
                              marginBottom: s(10),
                            },
                          ]}
                          placeholder="Enter amount"
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
                              ? "Adding..."
                              : "Add amount"}
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
                        fontSize: s(19),
                        marginBottom: s(15),
                      },
                    ]}
                  >
                    My other goals
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
                                    fontSize: s(14),
                                    marginBottom: s(5),
                                  },
                                ]}
                              >
                                Description
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
                                {goal.description ||
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
                                Add amount
                              </Text>

                              <TextInput
                                style={[
                                  styles.addMoneyInput,
                                  {
                                    fontSize: s(14),
                                    borderRadius: s(12),
                                    padding: s(12),
                                    marginBottom: s(10),
                                  },
                                ]}
                                placeholder="Enter amount"
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
                                    ? "Adding..."
                                    : "Add amount"}
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

      {/* NAVBAR */}
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
          ["swap-horizontal", "/expensesManagement"],
          ["layers-outline", "/currentgoal"],
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
    height: 75,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#081023",
  },

  backButton: {
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 25,
  },

  notificationButton: {
    width: 45,
    height: 45,
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