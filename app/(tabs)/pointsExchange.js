import { Ionicons } from "@expo/vector-icons";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
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
export default function pointExchange() {
    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.header}>

                <TouchableOpacity>
                    <Ionicons
                        name="arrow-back"
                        size={23}
                        color="white"
                    />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    Redeem your points!
                </Text>

                <TouchableOpacity>
                    <Ionicons
                        name="notifications-outline"
                        size={23}
                        color="white"
                    />
                </TouchableOpacity>

            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.pointsCard}>
                    <Text style={styles.smallTitle}>Available points</Text>
                    <Text style={styles.points}>400.0</Text>

                    <View style={styles.pointsInfo}>

                        <View>
                            <Text style={styles.infoTitle}>
                                Next points goal
                            </Text>
                            <Text style={styles.infoNumber}>
                                500.0
                            </Text>
                        </View>

                        <View style={styles.separator} />

                        <View>
                            <Text style={styles.infoTitle}>
                                Redeemed points
                            </Text>
                            <Text style={styles.usedPoints}>
                                -1000.0
                            </Text>
                        </View>

                    </View>

                    <View style={styles.progressContainer}>

                        <View style={styles.progressBar}>
                            <View style={styles.progress} />
                        </View>

                        <Text style={styles.progressText}>
                            30%
                        </Text>

                        <Text style={styles.goal}>
                            10,000
                        </Text>
                    </View>

                    <Text style={styles.goalText}>
                        30% of your goal, ¡You´re making progress!
                    </Text>
                </View>

                <View style={styles.content}>

                    <Text style={styles.sectionTitle}>¡Rewards!</Text>

                    {rewards.map((item, index) => (
                        <View style={styles.reward} key={index}>
                            <View style={styles.iconCircle}>
                                <Ionicons
                                    name={item.icon}
                                    size={23}
                                    color="white"
                                />
                            </View>

                            <View style={styles.rewardName}>

                                <Text style={styles.rewardTitle}>
                                    {item.title}
                                </Text>
                                <Text style={styles.store}>{item.store}</Text>
                            </View>

                            <View style={styles.rewardDescription}>

                                <Text style={styles.description}>
                                    {item.description}
                                </Text>
                            </View>

                            <Text style={styles.rewardPoints}>
                                {item.points}
                            </Text>
                        </View>

                    ))}
                    <Text style={styles.sectionTitle}>
                        ¡Big reward!
                    </Text>

                    <View style={styles.reward}>
                        <View style={styles.iconCircle}>
                            <Ionicons
                                name="restaurant-outline"
                                size={23}
                                color="white"
                            />
                        </View>

                        <View style={styles.rewardName}>
                            <Text style={styles.rewardTitle}>Food</Text>
                            <Text style={styles.store}>Don Li</Text>
                        </View>

                        <View style={styles.rewardDescription}>
                            <Text style={styles.description}>
                                Free shushi order
                            </Text>
                        </View>

                        <Text style={styles.rewardPoints}>
                            -500.0 points
                        </Text>

                    </View>
                </View>
        </ScrollView>
    </SafeAreaView >
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7f7f7"
    },

    scroll: {
        flex: 1,
        backgroundColor: "#f7f7f7",
    },
    header: {
        height: 58,
        backgroundColor: "#242424",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 18,
    },
    headerTitle: {
        color: "white",
        fontSize: 15,
        fontWeight: "bold",
    },
    pointsCard: {
        backgroundColor: "white",
        marginHorizontal: 22,
        marginTop: 10,
        borderRadius: 10,
        padding: 14,
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
        fontSize: 8,
        color: "#555",
    },
    infoNumber: {
        fontSize: 13,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 3,
    },
    usedPoints: {
        fontSize: 13,
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
        height: 8,
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
        fontSize: 6,
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
        fontSize: 8,
        marginTop: 7,
        color: "#444",
    },
    content: {
        paddingHorizontal: 14,
        paddingTop: 12,
        paddingBottom: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 12,
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
        width: 70,
        paddingLeft: 7,
    },
    rewardTitle: {
        fontSize: 9,
        fontWeight: "bold",
    },
    store: {
        fontSize: 7,
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
        fontSize: 7,
        color: "#555",
    },
    rewardPoints: {
        width: 67,
        fontSize: 8,
        color: "#24b3ce",
        textAlign: "right",
    },
    bottomBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 55,
        backgroundColor: "#24b3ce",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
})