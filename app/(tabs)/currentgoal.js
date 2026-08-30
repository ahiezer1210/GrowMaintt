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

const otherGoalsData = [
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

export default function SavingsGoalsScreen() {
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

  const mainGoal = {
    target: 500,
    saved: 300,
    title: "Beach trip",
    deadline: "December 30, 2026",
  };

  const progressPercentage = Math.round(
    (mainGoal.saved / mainGoal.target) * 100,
  );

  const remaining = mainGoal.target - mainGoal.saved;

  return (
    <View style={styles.screen}>
      <StatusBar
        translucent
        backgroundColor="#0b1624"
        barStyle="light-content"
      />

      <View
        style={[
          styles.header,
          {
            height: s(130),
            paddingHorizontal: s(20),
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={s(24)} color="#fff" />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            {
              fontSize: s(20),
            },
          ]}
        >
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

      <Text
        style={[
          styles.headerSubtitle,
          {
            fontSize: s(14),
            paddingHorizontal: s(20),
          },
        ]}
      >
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
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom: s(110),
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.currentGoalCard,
              {
                padding: s(20),
                borderRadius: s(16),
                marginTop: s(20),
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.targetIconCircle}>
                <MaterialCommunityIcons
                  name="bullseye-arrow"
                  size={s(28)}
                  color="#0b1624"
                />
              </View>

              <View style={styles.cardTitles}>
                <Text
                  style={[
                    styles.cardStatus,
                    {
                      fontSize: s(12),
                    },
                  ]}
                >
                  Main goal
                </Text>

                <Text
                  style={[
                    styles.cardGoalTitle,
                    {
                      fontSize: s(16),
                    },
                  ]}
                >
                  {mainGoal.title}
                </Text>
              </View>
            </View>
            <View style={styles.amountsRow}>
              <View>
                <Text
                  style={[
                    styles.amountLabel,
                    {
                      fontSize: s(12),
                    },
                  ]}
                >
                  Goal
                </Text>

                <Text
                  style={[
                    styles.amountValue,
                    {
                      fontSize: s(18),
                    },
                  ]}
                >
                  ${mainGoal.target}
                </Text>
              </View>

              <View style={styles.verticalDivider} />

              <View>
                <Text
                  style={[
                    styles.amountLabel,
                    {
                      fontSize: s(12),
                    },
                  ]}
                >
                  Saved
                </Text>

                <Text
                  style={[
                    styles.amountValue,
                    {
                      fontSize: s(18),
                    },
                  ]}
                >
                  ${mainGoal.saved}
                </Text>
              </View>
            </View>

            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBarFilled,
                  {
                    width: `${progressPercentage}%`,
                  },
                ]}
              />

              <View
                style={[
                  styles.progressBarRemaining,
                  {
                    width: `${100 - progressPercentage}%`,
                  },
                ]}
              />
            </View>
            <View style={styles.progressDetailsRow}>
              <View style={styles.detailItem}>
                <MaterialCommunityIcons
                  name="bullseye-arrow"
                  size={s(16)}
                  color="#0b1624"
                />

                <Text
                  style={[
                    styles.detailText,
                    {
                      fontSize: s(12),
                    },
                  ]}
                >
                  {progressPercentage}% Completed
                </Text>
              </View>

              <View style={styles.detailItem}>
                <MaterialCommunityIcons
                  name="cash-minus"
                  size={s(16)}
                  color="#0b1624"
                />

                <Text
                  style={[
                    styles.detailText,
                    {
                      fontSize: s(12),
                    },
                  ]}
                >
                  ${remaining} left
                </Text>
              </View>
            </View>
            <View style={styles.deadlineContainer}>
              <MaterialCommunityIcons
                name="calendar-outline"
                size={s(16)}
                color="#0b1624"
              />

              <Text
                style={[
                  styles.deadlineText,
                  {
                    fontSize: s(12),
                  },
                ]}
              >
                Deadline:{" "}
                <Text style={styles.deadlineBold}>{mainGoal.deadline}</Text>
              </Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="bullseye-arrow"
              size={s(20)}
              color="#0b1624"
            />

            <Text
              style={[
                styles.sectionTitle,
                {
                  fontSize: s(20),
                },
              ]}
            >
              My other goals
            </Text>
          </View>

          {otherGoalsData.map((item) => {
            const progress = Math.round((item.saved / item.objective) * 100);

            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.goalItemContainer,
                  {
                    paddingVertical: s(10),
                    paddingHorizontal: s(16),
                  },
                ]}
              >
                <View
                  style={[
                    styles.goalIconBox,
                    {
                      width: s(46),
                      height: s(46),
                      borderRadius: s(12),
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={s(24)}
                    color="#fff"
                  />
                </View>

                <View style={styles.goalTextContent}>
                  <Text
                    style={[
                      styles.goalItemTitle,
                      {
                        fontSize: s(16),
                      },
                    ]}
                  >
                    {item.title}
                  </Text>

                  <Text
                    style={[
                      styles.goalItemSubtitle,
                      {
                        fontSize: s(12),
                      },
                    ]}
                  >
                    Goal: ${item.objective}
                  </Text>
                </View>

                <View style={styles.goalAmountContent}>
                  <Text
                    style={[
                      styles.goalItemAmount,
                      {
                        fontSize: s(16),
                      },
                    ]}
                  >
                    ${item.saved}
                  </Text>

                  <Text
                    style={[
                      styles.goalItemPercentage,
                      {
                        fontSize: s(12),
                      },
                    ]}
                  >
                    {progress}%
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
                borderRadius: s(24),
                marginTop: s(30),
                height: s(48),
              },
            ]}
          >
            <Text
              style={[
                styles.createButtonText,
                {
                  fontSize: s(14),
                },
              ]}
            >
              Create New Goal
            </Text>
          </TouchableOpacity>
        </ScrollView>
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
          <TouchableOpacity key={icon} style={styles.navButton}>
            <MaterialCommunityIcons
              name={icon}
              size={s(index === 2 ? 28 : 24)}
              color={index === "#fff"}
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
    backgroundColor: "#0b1624",
  },

  header: {
    width: "100%",
    backgroundColor: "#0b1624",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: StatusBar.currentHeight,
  },

  backButton: {
    width: 46,
    height: 46,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    flex: 1,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },

  bellButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#d7f3e8",
    alignItems: "center",
    justifyContent: "center",
  },

  headerSubtitle: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },

  main: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    overflow: "hidden",
    marginTop: -10,
  },

  scrollContent: {
    padding: 20,
  },

  currentGoalCard: {
    backgroundColor: "#25B7D3",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 30,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  targetIconCircle: {
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

  cardStatus: {
    color: "#0b1624",
    opacity: 0.8,
    marginBottom: 2,
  },

  cardGoalTitle: {
    color: "#0b1624",
    fontWeight: "bold",
  },

  amountsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },

  verticalDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#0b1624",
    opacity: 0.3,
  },

  amountLabel: {
    color: "#0b1624",
    opacity: 0.7,
    marginBottom: 2,
  },

  amountValue: {
    color: "#0b1624",
    fontWeight: "bold",
  },

  progressBarContainer: {
    flexDirection: "row",
    height: 8,
    borderRadius: 4,
    marginVertical: 15,
    overflow: "hidden",
  },

  progressBarFilled: {
    backgroundColor: "#0b1624",
  },

  progressBarRemaining: {
    backgroundColor: "#e0f7fa",
  },

  progressDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  detailText: {
    color: "#0b1624",
    marginLeft: 5,
  },

  deadlineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    borderTopWidth: 1,
    borderTopColor: "rgba(11,24,38,0.1)",
    paddingTop: 10,
  },

  deadlineText: {
    color: "#0b1624",
    marginLeft: 5,
  },

  deadlineBold: {
    fontWeight: "bold",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  sectionTitle: {
    color: "#0b1624",
    fontWeight: "bold",
    marginLeft: 10,
  },

  goalItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  goalIconBox: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#25B7D3",
  },

  goalTextContent: {
    flex: 1,
    paddingHorizontal: 15,
  },

  goalItemTitle: {
    color: "#0b1624",
    fontWeight: "bold",
    marginBottom: 2,
  },

  goalItemSubtitle: {
    color: "#6b7280",
  },

  goalAmountContent: {
    alignItems: "flex-end",
    marginRight: 10,
  },

  goalItemAmount: {
    color: "#0b1624",
    fontWeight: "bold",
  },

  goalItemPercentage: {
    color: "#06b6d4",
  },

  createButton: {
    backgroundColor: "#0b1624",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },

  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  bottomBar: {
    width: "100%",
    backgroundColor: "#25B7D3",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  navButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
