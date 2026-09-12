import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Button,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

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

export default function SavingsGoalsScreen({ navigation }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [goal, setGoal] = useState("");
  const [amount, setAmount] = useState("");
  const [savedgoal, setSavedgoal] = useState([]);

  const { width } = useWindowDimensions();

  const small = width < 350;
  const tablet = width >= 600;

  const scale = (value, tabletValue) =>
    tablet
      ? tabletValue ?? value * 1.35
      : small
        ? value * 0.9
        : value;

  const progress = Math.round(
    (mainGoal.saved / mainGoal.target) * 100
  );

  const remaining = mainGoal.target - mainGoal.saved;

  const savegoal = () => {
    if (!goal || !amount) {
      return;
    }

    setSavedgoal([
      ...savedgoal,
      {
        id: Date.now().toString(),
        icon: "bullseye-arrow",
        title: goal,
        objective: Number(amount.replace("$", "")),
        saved: 0,
      },
    ]);

    setGoal("");
    setAmount("");
    setMostrarFormulario(false);
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
    <View style={styles.screen}>
      <StatusBar
        translucent
        backgroundColor="#071426"
        barStyle="light-content"
      />

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
  screen: {
    flex: 1,
    backgroundColor: "#FFF",
  },

  app: {
    flex: 1,
    backgroundColor: "#071426",
  },

  header: {
    width: "100%",
    backgroundColor: "#071426",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  back: {
    width: 30,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  headerTitle: {
    color: "#FFF",
    fontWeight: "700",
  },

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

  mainGoal: {
    width: "100%",
    backgroundColor: "#25B7D3",
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

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

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

  cardTitle: {
    color: "#0b1624",
    fontWeight: "bold",
  },

  amounts: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },

  divider: {
    width: 1,
    height: 30,
    backgroundColor: "#0b1624",
    opacity: 0.3,
  },

  label: {
    color: "#0b1624",
    opacity: 0.7,
  },

  amount: {
    color: "#0b1624",
    fontWeight: "bold",
  },

  progressBar: {
    flexDirection: "row",
    height: 8,
    borderRadius: 4,
    marginVertical: 15,
    overflow: "hidden",
  },

  progressDone: {
    backgroundColor: "#0b1624",
  },

  progressLeft: {
    backgroundColor: "#e0f7fa",
  },

  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  info: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoText: {
    color: "#0b1624",
    marginLeft: 5,
  },

  deadline: {
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
    marginLeft: 10,
  },

  goalItem: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
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
    backgroundColor: "#25B7D3",
  },

  goalInfo: {
    flex: 1,
    paddingHorizontal: 15,
  },

  goalName: {
    color: "#0b1624",
    fontWeight: "bold",
  },

  goalObjective: {
    color: "#6b7280",
  },

  goalAmount: {
    alignItems: "flex-end",
    marginRight: 10,
  },

  saved: {
    color: "#0b1624",
    fontWeight: "bold",
  },

  percentage: {
    color: "#0b1624",
  },

  createButton: {
    width: "100%",
    backgroundColor: "#0b1624",
    alignItems: "center",
    justifyContent: "center",
  },

  createText: {
    color: "#FFFFFF",
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