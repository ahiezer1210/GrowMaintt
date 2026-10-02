import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  Timestamp,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSettings } from "../../context/Appsettings";
import { auth, db } from "../../firebaseConfig";

const rewards = [
  {
    id: "hilasal",
    icon: "card-outline",
    title: "5% discount",
    store: "Hilasal",
    description: "Discount in Hilasal product",
    points: 200,
  },
  {
    id: "dollarcity",
    icon: "gift-outline",
    title: "Gift card",
    store: "Dollarcity",
    description: "Gift card of $10.00",
    points: 200,
  },
  {
    id: "groupq",
    icon: "pricetag-outline",
    title: "5% discount",
    store: "Group Q",
    description: "Cars spare parts discount",
    points: 100,
  },
  {
    id: "microsoft",
    icon: "microsoft",
    title: "5% discount",
    store: "Microsoft",
    description: "Discount on Microsoft products",
    points: 300,
  },
  {
    id: "neveria",
    icon: "ice-cream",
    title: "Free Topping",
    store: "Neveria",
    description: "Free fruits topping",
    points: 500,
  },
  {
    id: "donli",
    icon: "restaurant-outline",
    title: "Food",
    store: "Don Li",
    description: "Free sushi order",
    points: 500,
  },
];

export default function PointExchange() {
  const { width } = useWindowDimensions();
  const { colors, t } = useAppSettings();

  const isSmallScreen = width < 360;
  const isPhone = width < 600;
  const isTablet = width >= 600;
  const isLargeTablet = width >= 900;

  const scale = isSmallScreen
    ? 0.85
    : isPhone
      ? 1
      : isLargeTablet
        ? 1.35
        : 1.15;

  const horizontalPadding = isSmallScreen
    ? 18
    : isPhone
      ? 25
      : isLargeTablet
        ? 60
        : 45;

  const headerHeight = 118 * scale;
  const bottomHeight = 65 * scale;

  const [availablePoints, setAvailablePoints] = useState(0);
  const [redeemedPoints, setRedeemedPoints] = useState(0);
  const [redeemingReward, setRedeemingReward] = useState(null);

  const pointsGoal = 500;

  const progressPercentage = Math.min(
    (availablePoints / pointsGoal) * 100,
    100
  );

  const rewardTranslations = {
    hilasal: {
      title: t.rewardHilasalTitle,
      description: t.rewardHilasalDescription,
    },
    dollarcity: {
      title: t.rewardDollarcityTitle,
      description: t.rewardDollarcityDescription,
    },
    groupq: {
      title: t.rewardGroupQTitle,
      description: t.rewardGroupQDescription,
    },
    microsoft: {
      title: t.rewardMicrosoftTitle,
      description: t.rewardMicrosoftDescription,
    },
    neveria: {
      title: t.rewardNeveriaTitle,
      description: t.rewardNeveriaDescription,
    },
    donli: {
      title: t.rewardDonLiTitle,
      description: t.rewardDonLiDescription,
    },
  };

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      setAvailablePoints(0);
      setRedeemedPoints(0);
      return;
    }

    const pointsQuery = query(
      collection(db, "Points"),
      where("userId", "==", user.uid)
    );

    const redeemedQuery = query(
      collection(db, "Redeemed"),
      where("userId", "==", user.uid)
    );

    let totalPoints = 0;
    let totalRedeemed = 0;

    const updateAvailablePoints = () => {
      const available = Math.max(
        totalPoints - totalRedeemed,
        0
      );

      setAvailablePoints(available);
    };

    const unsubscribePoints = onSnapshot(
      pointsQuery,
      (snapshot) => {
        totalPoints = 0;

        snapshot.forEach((item) => {
          const data = item.data();

          if (typeof data.points === "number") {
            totalPoints += data.points;
          }
        });

        updateAvailablePoints();
      },
      (error) => {
        console.log("Error getting Points:", error);
        setAvailablePoints(0);
      }
    );

    const unsubscribeRedeemed = onSnapshot(
      redeemedQuery,
      (snapshot) => {
        totalRedeemed = 0;

        snapshot.forEach((item) => {
          const data = item.data();

          if (typeof data.points === "number") {
            totalRedeemed += data.points;
          }
        });

        setRedeemedPoints(totalRedeemed);
        updateAvailablePoints();
      },
      (error) => {
        console.log("Error getting Redeemed:", error);
        setRedeemedPoints(0);
      }
    );

    return () => {
      unsubscribePoints();
      unsubscribeRedeemed();
    };
  }, []);

  const generarCodigo = (store) => {
    const prefix = store
      .replace(/[^a-zA-Z]/g, "")
      .substring(0, 3)
      .toUpperCase();

    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let randomPart = "";

    for (let i = 0; i < 6; i++) {
      randomPart += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    return `GM-${prefix}-${randomPart}`;
  };

  const redeemReward = async (reward) => {
    const user = auth.currentUser;

    const translatedReward =
      rewardTranslations[reward.id] || {};

    const rewardTitle =
      translatedReward.title || reward.title;

    if (!user) {
      Alert.alert(
        t.sessionRequired,
        t.sessionRequiredMessage
      );
      return;
    }

    if (availablePoints < reward.points) {
      Alert.alert(
        t.notEnoughPoints,
        `${t.need} ${reward.points} ${t.pointsToRedeem}`
      );
      return;
    }

    setRedeemingReward(reward.id);

    try {
      const pointsQuery = query(
        collection(db, "Points"),
        where("userId", "==", user.uid)
      );

      const redeemedQuery = query(
        collection(db, "Redeemed"),
        where("userId", "==", user.uid)
      );

      const [
        pointsSnapshot,
        redeemedSnapshot,
      ] = await Promise.all([
        new Promise((resolve, reject) => {
          const unsubscribe = onSnapshot(
            pointsQuery,
            (snapshot) => {
              unsubscribe();
              resolve(snapshot);
            },
            (error) => {
              unsubscribe();
              reject(error);
            }
          );
        }),
        new Promise((resolve, reject) => {
          const unsubscribe = onSnapshot(
            redeemedQuery,
            (snapshot) => {
              unsubscribe();
              resolve(snapshot);
            },
            (error) => {
              unsubscribe();
              reject(error);
            }
          );
        }),
      ]);

      let totalPoints = 0;
      let totalRedeemed = 0;

      pointsSnapshot.forEach((item) => {
        const data = item.data();

        if (typeof data.points === "number") {
          totalPoints += data.points;
        }
      });

      redeemedSnapshot.forEach((item) => {
        const data = item.data();

        if (typeof data.points === "number") {
          totalRedeemed += data.points;
        }
      });

      const currentAvailablePoints = Math.max(
        totalPoints - totalRedeemed,
        0
      );

      if (currentAvailablePoints < reward.points) {
        Alert.alert(
          t.notEnoughPoints,
          t.notEnoughPointsNow
        );
        return;
      }

      const code = generarCodigo(reward.store);

      const redeemedRef = doc(
        collection(db, "Redeemed")
      );

      const rewardRef = doc(
        collection(db, "Recompensas")
      );

      const notificationRef = doc(
        db,
        "Notificaciones",
        `${user.uid}_Rewards`
      );

      const rewardNotification = {
        id: `${redeemedRef.id}_reward`,
        uid: user.uid,
        type: "reward_redeemed",
        category: "Rewards",
        title: t.rewardUnlocked,
        message: `${t.yourReward} ${rewardTitle.toLowerCase()} ${t.at} ${reward.store} ${t.isReady}. ${t.youUsed} ${reward.points} ${t.points}.`,
        rewardId: reward.id,
        rewardTitle: rewardTitle,
        store: reward.store,
        points: reward.points,
        code: code,
        redeemedId: redeemedRef.id,
        read: false,
        createdAt: Timestamp.now(),
      };

      await runTransaction(
        db,
        async (transaction) => {
          transaction.set(redeemedRef, {
            userId: user.uid,
            rewardId: reward.id,
            store: reward.store,
            title: rewardTitle,
            points: reward.points,
            code: code,
            redeemedAt: serverTimestamp(),
          });

          transaction.set(rewardRef, {
            userId: user.uid,
            rewardId: reward.id,
            store: reward.store,
            title: rewardTitle,
            description:
              translatedReward.description ||
              reward.description,
            points: reward.points,
            code: code,
            status: "active",
            redeemedAt: serverTimestamp(),
          });

          transaction.set(
            notificationRef,
            {
              uid: user.uid,
              category: "Rewards",
              notifications: arrayUnion(
                rewardNotification
              ),
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        }
      );

      Alert.alert(
        t.rewardUnlockedExclamation,
        `${t.yourReward} ${rewardTitle.toLowerCase()} ${t.at} ${reward.store} ${t.isReady}.\n\n${t.code}: ${code}\n\n${t.pointsUsed}: ${reward.points}`,
        [
          {
            text: t.ok,
          },
        ]
      );
    } catch (error) {
      console.log(
        "Error redeeming reward:",
        error
      );

      Alert.alert(
        t.somethingWentWrong,
        t.redeemRewardError
      );
    } finally {
      setRedeemingReward(null);
    }
  };

  const confirmarCanje = (reward) => {
    const translatedReward =
      rewardTranslations[reward.id] || {};

    const rewardTitle =
      translatedReward.title || reward.title;

    if (availablePoints < reward.points) {
      Alert.alert(
        t.rewardLocked,
        `${t.need} ${reward.points} ${t.pointsToUnlock}\n\n${t.currentlyHave} ${availablePoints.toFixed(
          1
        )} ${t.points}.`
      );
      return;
    }

    Alert.alert(
      t.redeemReward,
      `${t.redeem} ${reward.points} ${t.pointsFor} ${rewardTitle.toLowerCase()} ${t.at} ${reward.store}?`,
      [
        {
          text: t.cancel,
          style: "cancel",
        },
        {
          text: t.redeem,
          onPress: () => redeemReward(reward),
        },
      ]
    );
  };

  const abrirNotificaciones = () => {
    router.push({
      pathname: "/notifications",
      params: {
        from: "/pointsExchange",
      },
    });
  };

  const navItems = [
    { icon: "home-outline", route: "/home" },
    { icon: "chart-box-outline", route: "/historial" },
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

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: colors.primaryBackground,
        },
      ]}
    >
      <View
        style={[
          styles.header,
          {
            height: headerHeight,
            paddingHorizontal: horizontalPadding,
            backgroundColor: colors.header,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.backButton,
            {
              transform: [
                { translateY: 4 * scale },
              ],
            },
          ]}
          onPress={() => router.push("/home")}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={35 * scale}
            color={colors.white}
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            {
              fontSize: 25 * scale,
              lineHeight: 27 * scale,
              color: colors.white,
              transform: [
                { translateX: 7 * scale },
                { translateY: 1 * scale },
              ],
            },
          ]}
        >
          {t.redeemYour}
          {"\n"}
          {t.pointsExclamation}
        </Text>

        <TouchableOpacity
          style={[
            styles.headerBell,
            {
              transform: [
                { translateY: 4 * scale },
              ],
            },
          ]}
          onPress={abrirNotificaciones}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="bell-circle-outline"
            size={35 * scale}
            color={colors.white}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{
          paddingBottom: 100 * scale,
          flexGrow: 1,
          backgroundColor: colors.background,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.pointsCard,
            {
              paddingHorizontal: horizontalPadding,
              paddingTop: 12 * scale,
              paddingBottom: 18 * scale,
              backgroundColor: colors.primaryBackground,
            },
          ]}
        >
          <View
            style={[
              styles.pointsheader,
              {
                height: 75 * scale,
                borderRadius: 18 * scale,
                backgroundColor: colors.card,
              },
            ]}
          >
            <Text
              style={[
                styles.smallTitle,
                {
                  fontSize: 12 * scale,
                  color: colors.secondaryText,
                },
              ]}
            >
              {t.availablePoints}
            </Text>

            <Text
              style={[
                styles.points,
                {
                  fontSize: 22 * scale,
                  color: colors.text,
                },
              ]}
            >
              {availablePoints.toFixed(1)}
            </Text>
          </View>

          <View style={styles.pointsInfo}>
            <View>
              <Text
                style={[
                  styles.infoTitle,
                  {
                    fontSize: 13 * scale,
                    color: colors.white,
                  },
                ]}
              >
                {t.nextPointsGoal}
              </Text>

              <Text
                style={[
                  styles.infoNumber,
                  {
                    fontSize: 20 * scale,
                    color: colors.white,
                  },
                ]}
              >
                500.0
              </Text>
            </View>

            <View
              style={[
                styles.separator,
                {
                  height: 35 * scale,
                  backgroundColor: colors.border,
                },
              ]}
            />

            <View>
              <Text
                style={[
                  styles.infoTitle,
                  {
                    fontSize: 13 * scale,
                    color: colors.white,
                  },
                ]}
              >
                {t.redeemedPoints}
              </Text>

              <Text
                style={[
                  styles.usedPoints,
                  {
                    fontSize: 20 * scale,
                    color: colors.icon,
                  },
                ]}
              >
                {redeemedPoints.toFixed(1)}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.progressContainer,
              {
                marginTop: 15 * scale,
              },
            ]}
          >
            <View
              style={[
                styles.progressBar,
                {
                  height: 15 * scale,
                  borderRadius: 10 * scale,
                  backgroundColor: colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.progress,
                  {
                    width: `${progressPercentage}%`,
                    backgroundColor: colors.icon,
                  },
                ]}
              />
            </View>

            <Text
              style={[
                styles.progressText,
                {
                  fontSize: 10 * scale,
                  color: colors.white,
                },
              ]}
            >
              {Math.round(progressPercentage)}%
            </Text>

            <Text
              style={[
                styles.goal,
                {
                  fontSize: 8 * scale,
                  color: colors.white,
                },
              ]}
            >
              10,000
            </Text>
          </View>

          <Text
            style={[
              styles.goalText,
              {
                fontSize: 12 * scale,
                marginTop: 7 * scale,
                color: colors.white,
              },
            ]}
          >
            {Math.round(progressPercentage)}%{" "}
            {t.ofYourGoal}
          </Text>
        </View>

        <View
          style={[
            styles.content,
            {
              paddingTop: 25 * scale,
              marginTop: isTablet ? -40 : -70,
              backgroundColor: colors.background,
            },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              {
                fontSize: 22 * scale,
                color: colors.text,
              },
            ]}
          >
            {t.rewardsExclamation}
          </Text>

          {rewards.map((item) => {
            const isUnlocked =
              availablePoints >= item.points;

            const isRedeeming =
              redeemingReward === item.id;

            const translatedReward =
              rewardTranslations[item.id] || {};

            return (
              <View
                style={[
                  styles.reward,
                  {
                    minHeight: 65 * scale,
                    marginBottom: 10 * scale,
                    paddingHorizontal: 8 * scale,
                    backgroundColor: colors.card,
                    opacity: isUnlocked ? 1 : 0.55,
                  },
                ]}
                key={item.id}
              >
                <View
                  style={[
                    styles.iconCircle,
                    {
                      width: 38 * scale,
                      height: 38 * scale,
                      borderRadius: 19 * scale,
                      backgroundColor: colors.icon,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={23 * scale}
                    color={colors.white}
                  />
                </View>

                <View
                  style={[
                    styles.rewardName,
                    {
                      width: isTablet
                        ? 120 * scale
                        : 85 * scale,
                      paddingLeft: 8 * scale,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.rewardTitle,
                      {
                        fontSize: 14 * scale,
                        color: colors.text,
                      },
                    ]}
                  >
                    {translatedReward.title ||
                      item.title}
                  </Text>

                  <Text
                    style={[
                      styles.store,
                      {
                        fontSize: 13 * scale,
                        color: colors.icon,
                      },
                    ]}
                  >
                    {item.store}
                  </Text>
                </View>

                <View
                  style={[
                    styles.rewardDescription,
                    {
                      borderLeftColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.description,
                      {
                        fontSize: 13 * scale,
                        color: colors.secondaryText,
                      },
                    ]}
                  >
                    {translatedReward.description ||
                      item.description}
                  </Text>
                </View>

                <View
                  style={[
                    styles.rewardAction,
                    {
                      width: isTablet
                        ? 100 * scale
                        : 82 * scale,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.rewardPoints,
                      {
                        fontSize: 10 * scale,
                        color: colors.icon,
                      },
                    ]}
                  >
                    {item.points}.0 pts
                  </Text>

                  <TouchableOpacity
                    style={[
                      styles.redeemButton,
                      {
                        paddingVertical: 5 * scale,
                        paddingHorizontal: 7 * scale,
                        borderRadius: 7 * scale,
                        backgroundColor: colors.icon,
                      },
                      !isUnlocked && {
                        backgroundColor: colors.inactive,
                      },
                    ]}
                    onPress={() => confirmarCanje(item)}
                    disabled={isRedeeming}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.redeemButtonText,
                        {
                          fontSize: 9 * scale,
                          color: colors.white,
                        },
                      ]}
                    >
                      {isRedeeming
                        ? "..."
                        : isUnlocked
                          ? t.redeem
                          : t.locked}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          {
            height: bottomHeight,
            borderTopLeftRadius: 78 * scale,
            backgroundColor: colors.nav,
          },
        ]}
      >
        {navItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.navItem}
            onPress={() => router.push(item.route)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={
                item.icon === "swap-horizontal"
                  ? 37 * scale
                  : 35 * scale
              }
              color={colors.white}
            />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scroll: {
    flex: 1,
    backgroundColor: "transparent",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 30,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  headerBell: {
    justifyContent: "center",
  },

  headerTitle: {
    fontWeight: "700",
    textAlign: "center",
  },

  pointsheader: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    marginTop: 6,
    alignItems: "center",
    justifyContent: "flex-end",
  },

  pointsCard: {
    padding: 14,
    marginTop: 0,
    height: 300,
  },

  smallTitle: {
    textAlign: "center",
  },

  points: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 15,
  },

  pointsInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  infoTitle: {
    marginTop: 10,
  },

  infoNumber: {
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 3,
  },

  usedPoints: {
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 3,
  },

  separator: {
    width: 1,
  },

  progressContainer: {
    position: "relative",
  },

  progressBar: {
    overflow: "hidden",
  },

  progress: {
    height: "100%",
  },

  progressText: {
    position: "absolute",
    left: "12%",
    top: -1,
    fontWeight: "bold",
  },

  goal: {
    position: "absolute",
    right: 0,
    top: -12,
  },

  goalText: {
    textAlign: "center",
  },

  content: {
    width: "100%",
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    paddingHorizontal: 14,
    marginBottom: -20,
    overflow: "hidden",
  },

  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },

  reward: {
    minHeight: 58,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },

  iconCircle: {
    justifyContent: "center",
    alignItems: "center",
  },

  rewardName: {
    paddingLeft: 8,
  },

  rewardTitle: {
    fontWeight: "bold",
  },

  store: {
    marginTop: 2,
  },

  rewardDescription: {
    flex: 1,
    borderLeftWidth: 1,
    paddingLeft: 7,
    paddingRight: 4,
  },

  description: {},

  rewardAction: {
    alignItems: "flex-end",
    justifyContent: "center",
  },

  rewardPoints: {
    textAlign: "right",
    marginBottom: 4,
  },

  redeemButton: {
    alignItems: "center",
    justifyContent: "center",
  },

  redeemButtonText: {
    fontWeight: "bold",
    textAlign: "center",
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
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