import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";

const mainGoal = {
  title: "Beach trip",
  target: 500,
  saved: 300,
  deadline: "December 30, 2026",
};

const otherGoals = [
  { id: "1", icon: "laptop", title: "New laptop", objective: 800, saved: 320 },
  { id: "2", icon: "book-open-variant", title: "Studies", objective: 1000, saved: 150 },
  { id: "3", icon: "airplane", title: "Trip", objective: 2400, saved: 1200 },
];

const navIcons = [
  "home-outline",
  "chart-box-outline",
  "swap-horizontal",
  "layers-outline",
  "account-outline",
];

export default function SavingsGoalsScreen() {
  const { width, height } = useWindowDimensions();
  const scale = Math.min(width / 390, height / 844);
  const s = (v: number) => Math.round(v * scale);

  const progress = Math.round((mainGoal.saved / mainGoal.target) * 100);
  const remaining = mainGoal.target - mainGoal.saved;

  return (
    <View style={styles.screen}>
      <StatusBar
        translucent
        backgroundColor="#0b1624"
        barStyle="light-content"
      />

      <View style={[styles.header, { height: s(130) }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={s(24)} color="#fff" />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { fontSize: s(20) }]}>
          Savings Goals
        </Text>

        <TouchableOpacity style={styles.bellButton}>
          <MaterialCommunityIcons
            name="bell-outline"
            size={s(20)}
            color="#428574"
          />
        </TouchableOpacity>
      </View>

      <Text style={[styles.subtitle, { fontSize: s(14) }]}>
        Organize your goals and achieve your dreams.
      </Text>

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
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: s(20),
            paddingBottom: s(120),
          }}
        >
          <View
            style={[
              styles.mainGoal,
              {
                padding: s(20),
                borderRadius: s(16),
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.goalIconCircle}>
                <MaterialCommunityIcons
                  name="bullseye-arrow"
                  size={s(28)}
                  color="#0b1624"
                />
              </View>

              <View style={styles.cardTitles}>
                <Text style={[styles.status, { fontSize: s(12) }]}>
                  Main goal
                </Text>

                <Text style={[styles.cardTitle, { fontSize: s(16) }]}>
                  {mainGoal.title}
                </Text>
              </View>
            </View>

            <View style={styles.amounts}>
              <View>
                <Text style={[styles.label, { fontSize: s(12) }]}>
                  Goal
                </Text>
                <Text style={[styles.amount, { fontSize: s(18) }]}>
                  ${mainGoal.target}
                </Text>
              </View>

              <View style={styles.divider} />

              <View>
                <Text style={[styles.label, { fontSize: s(12) }]}>
                  Saved
                </Text>
                <Text style={[styles.amount, { fontSize: s(18) }]}>
                  ${mainGoal.saved}
                </Text>
              </View>
            </View>

            <View style={styles.progressBar}>
              <View
                style={[styles.progressDone, { width: `${progress}%` }]}
              />
              <View
                style={[
                  styles.progressLeft,
                  { width: `${100 - progress}%` },
                ]}
              />
            </View>

            <View style={styles.progressInfo}>
              <View style={styles.info}>
                <MaterialCommunityIcons
                  name="bullseye-arrow"
                  size={s(16)}
                  color="#0b1624"
                />
                <Text style={[styles.infoText, { fontSize: s(12) }]}>
                  {progress}% Completed
                </Text>
              </View>

              <View style={styles.info}>
                <MaterialCommunityIcons
                  name="cash-minus"
                  size={s(16)}
                  color="#0b1624"
                />
                <Text style={[styles.infoText, { fontSize: s(12) }]}>
                  ${remaining} left
                </Text>
              </View>
            </View>

            <View style={styles.deadline}>
              <MaterialCommunityIcons
                name="calendar-outline"
                size={s(16)}
                color="#0b1624"
              />
              <Text style={[styles.deadlineText, { fontSize: s(12) }]}>
                Deadline:{" "}
                <Text style={styles.bold}>{mainGoal.deadline}</Text>
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <MaterialCommunityIcons
              name="bullseye-arrow"
              size={s(20)}
              color="#0b1624"
            />
            <Text style={[styles.sectionTitle, { fontSize: s(20) }]}>
              My other goals
            </Text>
          </View>

          {otherGoals.map((goal) => {
            const percentage = Math.round(
              (goal.saved / goal.objective) * 100
            );

            return (
              <TouchableOpacity
                key={goal.id}
                style={[
                  styles.goalItem,
                  {
                    padding: s(10),
                    paddingHorizontal: s(16),
                  },
                ]}
              >
                <View
                  style={[
                    styles.goalIcon,
                    {
                      width: s(46),
                      height: s(46),
                      borderRadius: s(12),
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={goal.icon}
                    size={s(24)}
                    color="#fff"
                  />
                </View>

                <View style={styles.goalInfo}>
                  <Text style={[styles.goalName, { fontSize: s(16) }]}>
                    {goal.title}
                  </Text>

                  <Text
                    style={[styles.goalObjective, { fontSize: s(12) }]}
                  >
                    Goal: ${goal.objective}
                  </Text>
                </View>

                <View style={styles.goalAmount}>
                  <Text style={[styles.saved, { fontSize: s(16) }]}>
                    ${goal.saved}
                  </Text>

                  <Text style={[styles.percentage, { fontSize: s(12) }]}>
                    {percentage}%
                  </Text>
                </View>

                <MaterialCommunityIcons
                  name="chevron-right"
                  size={s(24)}
                  color="#0b1624"
                />
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            style={[
              styles.createButton,
              {
                height: s(48),
                borderRadius: s(24),
                marginTop: s(15),
              },
            ]}
          >
            <Text style={[styles.createText, { fontSize: s(14) }]}>
              Create New Goal
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={[styles.navbar, { height: s(95) }]}>
        {navIcons.map((icon, index) => (
          <TouchableOpacity key={icon} style={styles.navButton}>
            <MaterialCommunityIcons
              name={icon}
              size={s(index === 2 ? 28 : 24)}
              color={index === 0 ? "#fff" : "#a3e6f5"}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    backgroundColor: "#0b1624",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: StatusBar.currentHeight,
  },

  backButton: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    flex: 1,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

  bellButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#d7f3e8",
    alignItems: "center",
    justifyContent: "center",
  },

  subtitle: {
    color: "#fff",
    backgroundColor: "#0b1624",
    textAlign: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  main: {
    flex: 1,
    backgroundColor: "#fff",
    overflow: "hidden",
    marginTop: -10,
  },

  mainGoal: {
    backgroundColor: "#25B7D3",
    marginTop: 20,
    marginBottom: 30,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  goalIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  sectionTitle: {
    color: "#0b1624",
    fontWeight: "bold",
    marginLeft: 10,
  },

  goalItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
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
    color: "#06b6d4",
  },

  createButton: {
    width: "100%",
    backgroundColor: "#0b1624",
    alignItems: "center",
    justifyContent: "center",
  },

  createText: {
    color: "#fff",
    fontWeight: "bold",
  },

  navbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#25B7D3",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopLeftRadius: 50,
  },

  navButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});