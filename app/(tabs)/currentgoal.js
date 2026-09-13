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
import { useState } from "react";
import {
  Alert,
  Button,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { auth, db } from "../../firebaseConfig";

const mainGoal = {
  title: "Beach trip",
  target: 500,
  saved: 300,
  deadline: "December 30, 2026",
};

const otherGoals = [
  {
    id: "1",
    icon: "laptop",
    title: "New laptop",
    objective: 800,
    saved: 320,
  },
  {
    id: "2",
    icon: "book-open-variant",
    title: "Studies",
    objective: 1000,
    saved: 150,
  },
  {
    id: "3",
    icon: "airplane",
    title: "Trip",
    objective: 2400,
    saved: 1200,
  },
];

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

export default function SavingsGoalsScreen() {
  const { width, height } = useWindowDimensions();
  const s = (size) => (width / 390) * size;
  const isLargeScreen = width >= 768;

  const [mainGoal, setMainGoal] = useState(null);
export default function SavingsGoalsScreen({ navigation }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [goal, setGoal] = useState("");
  const [amount, setAmount] = useState("");
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

  const { width } = useWindowDimensions();

  const small = width < 350;
  const tablet = width >= 600;

  const scale = (value, tabletValue) =>
    tablet
      ? tabletValue ?? value * 1.35
      : small
        ? value * 0.9
        : value;

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
  const progress = Math.round(
    (mainGoal.saved / mainGoal.target) * 100
  );

  const remaining = mainGoal.target - mainGoal.saved;

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
      const available = Math.max(0, target - current);

      Alert.alert(
        "Amount too high",
        `You can add up to $${available.toFixed(2)} to complete this goal.`
      );
      return;
    }

    try {
      setAddingMoney(true);

      await updateDoc(
        doc(db, "Metas de Ahorro", selectedGoal.id),
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
        backgroundColor="#0b1624"
        translucent
        backgroundColor="#071426"
        barStyle="light-content"
      />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={s(25)}
            color="#fff"
          />
        </TouchableOpacity>
      <View style={styles.app}>
        <View
          style={[
            styles.header,
            {
              height:
                118 *
                (small
                  ? 0.85
                  : tablet
                    ? 1.15
                    : 1),
              paddingHorizontal: small
                ? 18
                : tablet
                  ? 45
                  : 25,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.back,
              {
                transform: [
                  {
                    translateY:
                      4 *
                      (small
                        ? 0.85
                        : tablet
                          ? 1.15
                          : 1),
                  },
                ],
              },
            ]}
            onPress={() =>
              navigation?.goBack() ?? router.back()
            }
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={
                35 *
                (small
                  ? 0.85
                  : tablet
                    ? 1.15
                    : 1)
              }
              color="#FFFFFF"
            />
          </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            { fontSize: s(22) },
          ]}
        >
          Savings Goals
        </Text>
      </View>
          <Text
            style={[
              styles.headerTitle,
              {
                fontSize:
                  25 *
                  (small
                    ? 0.85
                    : tablet
                      ? 1.15
                      : 1),
                transform: [
                  {
                    translateX:
                      7 *
                      (small
                        ? 0.85
                        : tablet
                          ? 1.15
                          : 1),
                  },
                  {
                    translateY:
                      1 *
                      (small
                        ? 0.85
                        : tablet
                          ? 1.15
                          : 1),
                  },
                ],
              },
            ]}
          >
            Savings Goals
          </Text>

          <TouchableOpacity
            style={[
              styles.headerBell,
              {
                transform: [
                  {
                    translateY:
                      4 *
                      (small
                        ? 0.85
                        : tablet
                          ? 1.15
                          : 1),
                  },
                ],
              },
            ]}
            onPress={abrirNotificaciones}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="bell-circle-outline"
              size={
                35 *
                (small
                  ? 0.85
                  : tablet
                    ? 1.15
                    : 1)
              }
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {!hasGoals ? (
          <View style={styles.noGoalsContainer}>
            <Text
              style={[
                styles.noGoalsText,
                { fontSize: s(16) },
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
                onPress={() => toggleGoal(mainGoal.id)}
              >
                <View style={styles.mainGoalCard}>
                  <View style={styles.mainGoalHeader}>
                    <View>
                      <Text
                        style={[
                          styles.mainGoalLabel,
                          { fontSize: s(13) },
                        ]}
                      >
                        MAIN GOAL
                      </Text>

                      <Text
                        style={[
                          styles.mainGoalTitle,
                          { fontSize: s(27) },
                        ]}
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
        <View style={styles.subtitleContainer}>
          <Text
            style={[
              styles.subtitle,
              {
                fontSize: scale(14, 17),
              },
            ]}
          >
            Organize your goals and achieve your dreams.
          </Text>
        </View>

        <View
          style={[
            styles.main,
            {
              borderTopLeftRadius:
                tablet ? 55 : small ? 35 : 45,
              borderTopRightRadius:
                tablet ? 55 : small ? 35 : 45,
            },
          ]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.content,
              {
                width: tablet ? "85%" : "100%",
                maxWidth: tablet ? 700 : undefined,
                paddingHorizontal: tablet
                  ? 0
                  : small
                    ? 22
                    : 30,
                paddingTop: tablet
                  ? 35
                  : small
                    ? 20
                    : 28,
                paddingBottom: 100,
                gap: tablet
                  ? 24
                  : small
                    ? 15
                    : 20,
              },
            ]}
          >
            <View
              style={[
                styles.mainGoal,
                {
                  padding: scale(20, 25),
                  borderRadius: scale(16, 20),
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.goalIconCircle,
                    {
                      width: scale(50, 60),
                      height: scale(50, 60),
                      borderRadius: scale(25, 30),
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="bullseye-arrow"
                    size={scale(28, 34)}
                    color="#0b1624"
                  />
                </View>

                  <View style={styles.amountRow}>
                    <View>
                      <Text
                        style={[
                          styles.amountLabel,
                          { fontSize: s(12) },
                        ]}
                      >
                        SAVED
                      </Text>
                <View style={styles.cardTitles}>
                  <Text
                    style={[
                      styles.status,
                      {
                        fontSize: scale(12, 15),
                      },
                    ]}
                  >
                    Main goal
                  </Text>

                      <Text
                        style={[
                          styles.savedAmount,
                          { fontSize: s(24) },
                        ]}
                      >
                        ${mainSaved.toFixed(2)}
                      </Text>
                    </View>
                  <Text
                    style={[
                      styles.cardTitle,
                      {
                        fontSize: scale(16, 20),
                      },
                    ]}
                  >
                    {mainGoal.title}
                  </Text>
                </View>
              </View>

              <View style={styles.amounts}>
                <View>
                  <Text
                    style={[
                      styles.label,
                      {
                        fontSize: scale(12, 15),
                      },
                    ]}
                  >
                    Goal
                  </Text>

                  <Text
                    style={[
                      styles.amount,
                      {
                        fontSize: scale(18, 22),
                      },
                    ]}
                  >
                    ${mainGoal.target}
                  </Text>
                </View>

                    <View style={styles.targetContainer}>
                      <Text
                        style={[
                          styles.amountLabel,
                          { fontSize: s(12) },
                        ]}
                      >
                        TARGET
                      </Text>

                      <Text
                        style={[
                          styles.targetAmount,
                          { fontSize: s(18) },
                        ]}
                      >
                        ${mainTarget.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                <View style={styles.divider} />

                <View>
                  <Text
                    style={[
                      styles.label,
                      {
                        fontSize: scale(12, 15),
                      },
                    ]}
                  >
                    Saved
                  </Text>

                  <Text
                    style={[
                      styles.amount,
                      {
                        fontSize: scale(18, 22),
                      },
                    ]}
                  >
                    ${mainGoal.saved}
                  </Text>
                </View>
              </View>

                  <View style={styles.progressBackground}>
                    <View
                      style={[
                        styles.progressBar,
                        {
                          width: `${progress}%`,
                        },
                      ]}
                    />
                  </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressDone,
                    {
                      width: `${progress}%`,
                    },
                  ]}
                />

                <View
                  style={[
                    styles.progressLeft,
                    {
                      width: `${100 - progress}%`,
                    },
                  ]}
                />
              </View>

                  <View style={styles.progressInfo}>
                    <Text
                      style={[
                        styles.progressText,
                        { fontSize: s(12) },
                      ]}
                    >
                      {progress}% completed
                    </Text>

                    <Text
                      style={[
                        styles.progressText,
                        { fontSize: s(12) },
                      ]}
                    >
                      ${remaining.toFixed(2)} left
                    </Text>
                  </View>
              <View style={styles.progressInfo}>
                <View style={styles.info}>
                  <MaterialCommunityIcons
                    name="bullseye-arrow"
                    size={scale(16, 19)}
                    color="#0b1624"
                  />

                  <Text
                    style={[
                      styles.infoText,
                      {
                        fontSize: scale(12, 15),
                      },
                    ]}
                  >
                    {progress}% Completed
                  </Text>
                </View>

                  <Text
                    style={[
                      styles.deadline,
                      { fontSize: s(12) },
                    ]}
                  >
                    Deadline:{" "}
                    {mainGoal.endDate || "No deadline"}
                  </Text>

                  {expandedGoal === mainGoal.id && (
                    <View style={styles.expandedContent}>
                      <Text
                        style={[
                          styles.descriptionTitle,
                          { fontSize: s(14) },
                        ]}
                      >
                        Description
                      </Text>

                      <Text
                        style={[
                          styles.descriptionText,
                          { fontSize: s(13) },
                        ]}
                      >
                        {mainGoal.description ||
                          "No description"}
                      </Text>

                      <Text
                        style={[
                          styles.addMoneyTitle,
                          { fontSize: s(14) },
                        ]}
                      >
                        Add amount
                      </Text>

                      <TextInput
                        style={[
                          styles.addMoneyInput,
                          { fontSize: s(14) },
                        ]}
                        placeholder="Enter amount"
                        placeholderTextColor="#999"
                        keyboardType="decimal-pad"
                        value={abono}
                        onChangeText={setAbono}
                      />

                      <TouchableOpacity
                        style={styles.addMoneyButton}
                        onPress={() =>
                          handleAddMoney(mainGoal)
                        }
                        disabled={addingMoney}
                      >
                        <Text
                          style={[
                            styles.addMoneyButtonText,
                            { fontSize: s(14) },
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
                    { fontSize: s(19) },
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
                <View style={styles.info}>
                  <MaterialCommunityIcons
                    name="cash-minus"
                    size={scale(16, 19)}
                    color="#0b1624"
                  />

                  <Text
                    style={[
                      styles.infoText,
                      {
                        fontSize: scale(12, 15),
                      },
                    ]}
                  >
                    ${remaining} left
                  </Text>
                </View>
              </View>

              <View style={styles.deadline}>
                <MaterialCommunityIcons
                  name="calendar-outline"
                  size={scale(16, 19)}
                  color="#0b1624"
                />

                <Text
                  style={[
                    styles.deadlineText,
                    {
                      fontSize: scale(12, 15),
                    },
                  ]}
                >
                  Deadline:{" "}
                  <Text style={styles.bold}>
                    {mainGoal.deadline}
                  </Text>
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <MaterialCommunityIcons
                name="bullseye-arrow"
                size={scale(20, 24)}
                color="#0b1624"
              />

              <Text
                style={[
                  styles.sectionTitle,
                  {
                    fontSize: scale(20, 24),
                  },
                ]}
              >
                My other goals
              </Text>
            </View>

            {[...otherGoals, ...savedgoal].map((goal) => {
              const percentage = Math.round(
                (goal.saved / goal.objective) * 100
              );

                  return (
                    <TouchableOpacity
                      key={goal.id}
                      activeOpacity={0.9}
                      onPress={() => toggleGoal(goal.id)}
                    >
                      <View
                        style={[
                          styles.otherGoalCard,
                          expandedGoal === goal.id &&
                            styles.expandedOtherGoal,
                        ]}
                      >
                        <View style={styles.otherGoalTop}>
                          <View
                            style={styles.goalIconContainer}
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
              return (
                <TouchableOpacity
                  key={goal.id}
                  style={[
                    styles.goalItem,
                    {
                      padding: scale(10, 13),
                      paddingHorizontal: scale(16, 20),
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.goalIcon,
                      {
                        width: scale(46, 55),
                        height: scale(46, 55),
                        borderRadius: scale(12, 15),
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={goal.icon}
                      size={scale(24, 29)}
                      color="#FFFFFF"
                    />
                  </View>

                          <View
                            style={styles.otherGoalInfo}
                          >
                            <Text
                              style={[
                                styles.otherGoalTitle,
                                { fontSize: s(16) },
                              ]}
                            >
                              {goal.goalName}
                            </Text>
                  <View style={styles.goalInfo}>
                    <Text
                      style={[
                        styles.goalName,
                        {
                          fontSize: scale(16, 20),
                        },
                      ]}
                    >
                      {goal.title}
                    </Text>

                            <Text
                              style={[
                                styles.otherGoalAmount,
                                { fontSize: s(13) },
                              ]}
                            >
                              ${saved.toFixed(2)} / $
                              {target.toFixed(2)}
                            </Text>
                          </View>
                    <Text
                      style={[
                        styles.goalObjective,
                        {
                          fontSize: scale(12, 15),
                        },
                      ]}
                    >
                      Goal: ${goal.objective}
                    </Text>
                  </View>

                  <View style={styles.goalAmount}>
                    <Text
                      style={[
                        styles.saved,
                        {
                          fontSize: scale(16, 20),
                        },
                      ]}
                    >
                      ${goal.saved}
                    </Text>

                    <Text
                      style={[
                        styles.percentage,
                        {
                          fontSize: scale(12, 15),
                        },
                      ]}
                    >
                      {percentage}%
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
                          style={
                            styles.otherProgressBackground
                          }
                        >
                          <View
                            style={[
                              styles.otherProgressBar,
                              {
                                width: `${goalProgress}%`,
                              },
                            ]}
                          />
                        </View>

                        {expandedGoal === goal.id && (
                          <View
                            style={styles.expandedContent}
                          >
                            <Text
                              style={[
                                styles.descriptionTitle,
                                { fontSize: s(14) },
                              ]}
                            >
                              Description
                            </Text>

                            <Text
                              style={[
                                styles.descriptionText,
                                { fontSize: s(13) },
                              ]}
                            >
                              {goal.description ||
                                "No description"}
                            </Text>

                            <Text
                              style={[
                                styles.addMoneyTitle,
                                { fontSize: s(14) },
                              ]}
                            >
                              Add amount
                            </Text>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={scale(24, 29)}
                    color="#0b1624"
                  />
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={[
                styles.createButton,
                {
                  height: scale(48, 58),
                  borderRadius: scale(24, 29),
                  marginTop: scale(15, 18),
                },
              ]}
              onPress={() => setMostrarFormulario(true)}
            >
              <Text
                style={[
                  styles.createText,
                  {
                    fontSize: scale(14, 17),
                  },
                ]}
              >
                Create New Goal
              </Text>
            </TouchableOpacity>

            {mostrarFormulario && (
              <View style={styles.form}>
                <Text style={styles.formTitle}>
                  New Goal
                </Text>

                            <TextInput
                              style={[
                                styles.addMoneyInput,
                                { fontSize: s(14) },
                              ]}
                              placeholder="Enter amount"
                              placeholderTextColor="#999"
                              keyboardType="decimal-pad"
                              value={abono}
                              onChangeText={setAbono}
                            />

                            <TouchableOpacity
                              style={
                                styles.addMoneyButton
                              }
                              onPress={() =>
                                handleAddMoney(goal)
                              }
                              disabled={addingMoney}
                            >
                              <Text
                                style={[
                                  styles.addMoneyButtonText,
                                  { fontSize: s(14) },
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
                <TextInput
                  style={styles.input}
                  placeholder="Buy a laptop"
                  value={goal}
                  onChangeText={setGoal}
                />

                <TextInput
                  style={styles.input}
                  placeholder="$300"
                  value={amount}
                  onChangeText={setAmount}
                />

                <Button
                  title="Save Goal"
                  onPress={savegoal}
                />
              </View>
            )}
          </ScrollView>
        </View>

        <View
          style={[
            styles.bottomBar,
            {
              height:
                65 *
                (small
                  ? 0.85
                  : tablet
                    ? 1.15
                    : 1),
              borderTopLeftRadius:
                78 *
                (small
                  ? 0.85
                  : tablet
                    ? 1.15
                    : 1),
            },
          ]}
        >
          {navItems.map((item) => (
            <TouchableOpacity
              key={item.route}
              style={styles.navItem}
              activeOpacity={0.8}
              onPress={() => router.push(item.route)}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={
                  item.icon === "swap-horizontal"
                    ? 37 *
                      (small
                        ? 0.85
                        : tablet
                          ? 1.15
                          : 1)
                    : 35 *
                      (small
                        ? 0.85
                        : tablet
                          ? 1.15
                          : 1)
                }
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
    backgroundColor: "#0b1624",
    backgroundColor: "#FFF",
  },

  app: {
    flex: 1,
    backgroundColor: "#071426",
  },

  header: {
    height: 90,
    width: "100%",
    backgroundColor: "#071426",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#0b1624",
    justifyContent: "space-between",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
  back: {
    width: 30,
    alignItems: "flex-start",
    justifyContent: "center",
    marginRight: 10,
  },

  headerTitle: {
    color: "#fff",
    fontWeight: "bold",
    color: "#FFF",
    fontWeight: "700",
  },

  scrollContent: {
    backgroundColor: "#fff",
    minHeight: "100%",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    padding: 20,
    paddingBottom: 40,
  headerBell: {
    justifyContent: "center",
  },

  subtitleContainer: {
    width: "100%",
    backgroundColor: "#071426",
    alignItems: "center",
  },

  subtitle: {
    color: "#FFFFFF",
    textAlign: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  main: {
    flex: 1,
    width: "100%",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },

  content: {
    alignItems: "center",
    alignSelf: "center",
  },

  mainGoalCard: {
  mainGoal: {
    width: "100%",
    backgroundColor: "#25B7D3",
    borderRadius: 25,
    padding: 22,
    marginBottom: 30,
    marginBottom: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  mainGoalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  mainGoalLabel: {
    color: "rgba(255,255,255,0.75)",
    fontWeight: "bold",
    marginBottom: 4,
  goalIconCircle: {
    backgroundColor: "rgba(255,255,255,0.8)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },

  cardTitles: {
    flex: 1,
  },

  status: {
    color: "#0b1624",
    opacity: 0.8,
  },

  mainGoalTitle: {
    color: "#fff",
    fontWeight: "bold",
  },

  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 25,
  },

  amountLabel: {
    color: "rgba(255,255,255,0.75)",
    fontWeight: "bold",
  },

  savedAmount: {
    color: "#fff",
    fontWeight: "bold",
    marginTop: 3,
  },

  targetContainer: {
    alignItems: "flex-end",
  },

  targetAmount: {
    color: "#fff",
    fontWeight: "bold",
    marginTop: 3,
  },

  progressBackground: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.35)",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 20,
  },

  progressBar: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
  },

  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  progressText: {
    color: "#fff",
  },

  deadline: {
    color: "rgba(255,255,255,0.85)",
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(11,24,38,0.1)",
  },

  deadlineText: {
    color: "#0b1624",
    marginLeft: 5,
  },

  bold: {
    fontWeight: "bold",
  },

  section: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },

  sectionTitle: {
    color: "#0b1624",
    fontWeight: "bold",
    marginBottom: 15,
  },

  otherGoalCard: {
    backgroundColor: "#f2f2f2",
    borderRadius: 18,
    padding: 16,
    marginBottom: 15,
  },

  expandedOtherGoal: {
    backgroundColor: "#f2f2f2",
  },

  otherGoalTop: {
  goalItem: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },

  goalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#fff",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 0,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  goalIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  otherGoalInfo: {
    flex: 1,
  },

  otherGoalTitle: {
    color: "#0b1624",
    fontWeight: "bold",
    marginBottom: 4,
  },

  otherGoalAmount: {
    color: "#6b7280",
  },

  otherProgressBackground: {
    height: 6,
    backgroundColor: "#d8d8d8",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 13,
  },

  otherProgressBar: {
    height: "100%",
    backgroundColor: "#25B7D3",
    borderRadius: 10,
  },

  expandedContent: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(11,24,38,0.15)",
  },

  descriptionTitle: {
    fontWeight: "bold",
    color: "#0b1624",
    marginBottom: 5,
  },

  descriptionText: {
    color: "#4b5563",
    marginBottom: 15,
  },

  addMoneyTitle: {
    fontWeight: "bold",
    color: "#0b1624",
    marginBottom: 8,
  },

  addMoneyInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 12,
    color: "#0b1624",
    marginBottom: 10,
  percentage: {
    color: "#0b1624",
  },

  addMoneyButton: {
    backgroundColor: "#0b1624",
    borderRadius: 20,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },

  addMoneyButtonText: {
    color: "#fff",
  createText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  noGoalsContainer: {
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
    paddingVertical: 30,
  },

  noGoalsText: {
    color: "#6b7280",
    fontWeight: "bold",
  },

  form: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d9e5e8",
    width: "100%",
  },

  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0b1624",
  },

  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 13,
    marginBottom: 15,
    fontSize: 14,
    color: "#0b1624",
  },
});