import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
const rewards = [
    {
        icon: "card-outline",
        title: "5% discount",
        store: "Hilasal",
        description: "Discount in Hilasal product",
        points: "-200.0 points",
    },
    {
        icon: "gift-outline",
        title: "Gift card",
        store: "Dollarcity",
        description: "Gift card of $10.00",
        points: "-200.0 points",
    },
    {
        icon: "pricetag-outline",
        title: "5% discount",
        store: "Group Q",
        description: "Cars spare parts discount",
        points: "-400.0 points",
    },
    {
        icon: "restaurant-outline",
        title: "Free Topping",
        store: "Neveria",
        description: "Free fruits topping",
        points: "-100.0 points",
    }
];
export default function PointExchange() {
    const { width } = useWindowDimensions();

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
        ? 10
        : isPhone
            ? 14
            : isLargeTablet
                ? 45
                : 30;

    const headerHeight = isSmallScreen
        ? 55
        : isPhone
            ? 65
            : isLargeTablet
                ? 100
                : 85;

    const bottomHeight = isSmallScreen
        ? 60
        : isPhone
            ? 70
            : isLargeTablet
                ? 90
                : 80;
    return (
        <SafeAreaView style={styles.container}>
            <View style={[
                styles.header,
                {
                    height: headerHeight,
                    paddingHorizontal: horizontalPadding,
                }
            ]}>
                <TouchableOpacity>
                    <Ionicons
                        name="arrow-back"
                        size={23 * scale}
                        color="white"
                    />
                </TouchableOpacity>
                <Text style={[
                    styles.headerTitle,
                    {
                        fontSize: 21 * scale,
                    },
                ]}>
                    Redeem your points!
                </Text>
                <TouchableOpacity onPress={() => router.push("/notifications")}>
                    <Ionicons
                        name="notifications-outline"
                        size={23 * scale}
                        color="white"
                    />
                </TouchableOpacity>
            </View>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={{
                    paddingBottom: 20,
                    flexGrow: 1,
                }}
                showsVerticalScrollIndicator={false}>

                <View style={[
                    styles.pointsCard,
                    {
                        paddingHorizontal: horizontalPadding,
                        paddingTop: 12 * scale,
                        paddingBottom: 18 * scale,
                    },
                ]}>
                    <View style={[
                        styles.pointsheader,
                        {
                            height: 75 * scale,
                            borderRadius: 18 * scale,
                        }
                    ]}>
                        <Text style={[
                            styles.smallTitle,
                            {
                                fontSize: 14 * scale,
                            }
                        ]}>Available points</Text>
                        <Text style={[
                            styles.points,
                            {
                                fontSize: 28 * scale,
                            }
                        ]}>400.0</Text>
                    </View>
                    <View style={styles.pointsInfo}>
                        <View>
                            <Text style={[
                                styles.infoTitle,
                                {
                                    fontSize: 15 * scale,
                                }
                            ]}>
                                Next points goal
                            </Text>
                            <Text style={[
                                styles.infoNumber,
                                {
                                    fontSize: 20 * scale,
                                }
                            ]}>
                                500.0
                            </Text>
                        </View>
                        <View style={[
                            styles.separator,
                            {
                                height: 35 * scale,
                            }
                        ]} />
                        <View>
                            <Text style={[
                                styles.infoTitle,
                                {
                                    fontSize: 15 * scale,
                                }
                                ]}>
                                Redeemed points
                            </Text>
                            <Text style={[
                                styles.usedPoints,
                                {
                                    fontSize: 20 * scale,
                                }
                                ]}>
                                -1000.0
                            </Text>
                        </View>
                    </View>
                    <View style={[
                        styles.progressContainer,
                        {
                            marginTop: 15 * scale,
                        }
                        ]}>
                        <View style={[
                            styles.progressBar,
                            {
                                height: 15 * scale,
                                borderRadius: 10 * scale,
                            }
                            ]}>
                            <View style={styles.progress} />
                        </View>
                        <Text style={[
                            styles.progressText,
                            {
                                fontSize: 13 * scale,
                            }
                            ]}>
                            30%
                        </Text>
                        <Text style={[
                            styles.goal,
                            {
                                fontSize: 8 * scale,
                            }
                            ]}>
                            10,000
                        </Text>
                    </View>
                    <Text style={[
                        styles.goalText,
                        {
                            fontSize: 14 * scale,
                            marginTop: 8 * scale,
                        }
                        ]}>
                        30% of your goal, ¡You´re making progress!
                    </Text>
                </View>
                <View style={[
                    styles.content,
                    {
                        paddingHorizontal: horizontalPadding,
                        paddingTop: 25 * scale,
                    }
                    ]}>
                    <Text style={[
                        styles.sectionTitle,
                        {
                            fontSize: 22 * scale,
                        }
                        ]}>¡Rewards!</Text>
                    {rewards.map((item, index) => (
                        <View style={[
                            styles.reward,
                            {
                                minHeight: 65 * scale,
                                marginBottom: 10 * scale,
                                paddingHorizontal: 8 * scale,
                            }
                            ]} key={index}>
                            <View style={[
                                styles.iconCircle,
                                {
                                    width: 38 * scale,
                                    height: 38 * scale,
                                    borderRadius: 19 * scale,
                                }
                                ]}>
                                <Ionicons
                                    name={item.icon}
                                    size={23 * scale}
                                    color="white"
                                />
                            </View>
                            <View style={[
                                styles.rewardName,
                                {
                                    width: isTablet
                                    ? 120 * scale
                                    : 85 * scale,
                                    paddingLeft: 8 * scale,
                                }
                                ]}>
                                <Text style={[
                                    styles.rewardTitle,
                                    {
                                        fontSize: 14 * scale,
                                    }
                                    ]}>
                                    {item.title}
                                </Text>
                                <Text style={[
                                    styles.store,
                                    {
                                        fontSize: 13 * scale,
                                    }
                                    ]}>{item.store}</Text>
                            </View>
                            <View style={styles.rewardDescription}>
                                <Text style={[
                                    styles.description,
                                    {
                                        fontSize: 13 * scale,
                                    }
                                    ]}>
                                    {item.description}
                                </Text>
                            </View>
                            <Text style={[
                                styles.rewardPoints,
                                {
                                    width: isTablet
                                    ? 100 * scale
                                    : 75 * scale,
                                    fontSize: 11 *scale,
                                }
                                ]}>
                                {item.points}
                            </Text>
                        </View>
                    ))}
                    <Text style={[
                        styles.sectionTitle,
                        {
                            fontSize: 22 * scale,
                            marginTop: 10 * scale,
                        }
                        ]}>
                        ¡Big reward!
                    </Text>
                    <View style={[
                        styles.reward,
                        {
                            minHeight: 65 * scale,
                            marginBottom: 10 * scale,
                        }
                        ]}>
                        <View style={[
                            styles.iconCircle,
                            {
                                width: 38 * scale,
                                height: 38 * scale,
                                borderRadius: 19 * scale,
                            }
                            ]}>
                            <Ionicons
                                name="restaurant-outline"
                                size={23 * scale}
                                color="white"
                            />
                        </View>
                        <View style={[
                            styles.rewardName,
                            {
                                width: isTablet
                                ? 120 * scale
                                : 85 * scale,
                            }
                            ]}>
                            <Text style={[
                                styles.rewardTitle,
                                {
                                    fontSize: 14 * scale,
                                }
                                ]}>Food</Text>
                            <Text style={[
                                styles.store,
                                {
                                    fontSize: 13 * scale,
                                }
                                ]}>Don Li</Text>
                        </View>
                        <View style={styles.rewardDescription}>
                            <Text style={[
                                styles.description,
                                {
                                    fontSize: 13 * scale,
                                }
                                ]}>
                                Free shushi order
                            </Text>
                        </View>
                        <Text style={[
                            styles.rewardPoints,
                            {
                                width: isTablet
                                ? 100 * scale
                                : 75 * scale,
                                fontSize: 11 * scale,
                            }
                            ]}>
                            -500.0 points
                        </Text>

                    </View>
                </View>
            </ScrollView>
            <View style={[
                styles.bottomBar,
                {
                    height: bottomHeight,
                }
                ]}>
                <TouchableOpacity onPress={() => router.push("/home")}>
                    <Ionicons
                        name="home-outline"
                        size={27 * scale}
                        color={"#FFFFFF"}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/historial")}>
                    <Ionicons
                        name="bar-chart-outline"
                        size={27 * scale}
                        color={"#FFFFFF"}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/ExpensesManagement")}>
                    <Ionicons
                        name="swap-horizontal-outline"
                        size={27 * scale}
                        color={"#FFFFFF"}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/currentgoal")}>
                    <Ionicons
                        name="layers-outline"
                        size={27 * scale}
                        color={"#FFFFFF"}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/Profile")}>
                    <Ionicons
                        name="person-outline"
                        size={27 * scale}
                        color={"#FFFFFF"}
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView >
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#081023"
    },
    scroll: {
        flex: 1,
        backgroundColor: "#ffffff"
    },
    pointsheader: {
        backgroundColor: "#ffffff",
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 18,
        height: 75,
        marginTop: 6,
        alignItems: "center",
        justifyContent: "flex-end"
    },
    header: {
        height: 58,
        backgroundColor: "#081023",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 18,
        marginTop: 30
    },
    headerTitle: {
        color: "white",
        fontSize: 21,
        fontWeight: "bold",
    },
    pointsCard: {
        backgroundColor: "#081023",
        padding: 14,
        marginTop: -9,
    },
    smallTitle: {
        textAlign: "center",
        fontSize: 14,
        color: "#555",
    },
    points: {
        textAlign: "center",
        fontSize: 28,
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
        fontSize: 15,
        color: "#ffffff",
    },
    infoNumber: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 3,
        color: "#ffffff"
    },
    usedPoints: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#14aeca",
        textAlign: "center",
        marginTop: 3,
    },
    separator: {
        width: 1,
        height: 30,
        backgroundColor: "#ddd",
    },
    progressContainer: {
        marginTop: 10,
        position: "relative",
    },
    progressBar: {
        height: 15,
        backgroundColor: "#eeeeee",
        borderRadius: 10,
        overflow: "hidden",
    },
    progress: {
        width: "30%",
        height: "100%",
        backgroundColor: "#29b6b1",
    },
    progressText: {
        position: "absolute",
        left: "12%",
        top: -1,
        fontSize: 13,
        color: "white",
        fontWeight: "bold",
    },
    goal: {
        position: "absolute",
        right: 0,
        top: -12,
        fontSize: 7,
    },
    goalText: {
        textAlign: "center",
        fontSize: 14,
        marginTop: 7,
        color: "#FFFFFF",
    },
    content: {
        backgroundColor: "white",
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        paddingHorizontal: 14,
        paddingTop: 30,
        margingBottom: -40,
        overflow: "hidden",
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 8,
    },
    reward: {
        backgroundColor: "white",
        minHeight: 58,
        borderRadius: 12,
        marginBottom: 7,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
    },
    iconCircle: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "#24b3ce",
        justifyContent: "center",
        alignItems: "center",
    },
    rewardName: {
        width: 85,
        paddingLeft: 8,
    },
    rewardTitle: {
        fontSize: 14,
        fontWeight: "bold",
    },
    store: {
        fontSize: 13,
        color: "#24b3ce",
        marginTop: 2,
    },
    rewardDescription: {
        flex: 1,
        borderLeftWidth: 1,
        borderLeftColor: "#ddd",
        paddingLeft: 7,
        paddingRight: 4,
    },
    description: {
        fontSize: 13,
        color: "#555",
    },
    rewardPoints: {
        width: 75,
        fontSize: 11,
        color: "#24b3ce",
        textAlign: "right",
    },
    bottomBar: {
        height: 70,
        backgroundColor: "#24b6d1",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginBottom: -30
    },
})