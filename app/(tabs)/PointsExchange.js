import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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
export default function PointExchange() {
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
                <TouchableOpacity onPress={() => router.push("/notifications")}>
                    <Ionicons
                        name="notifications-outline"
                        size={23}
                        color="white"
                    />
                </TouchableOpacity>
            </View>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={{
                    paddingBottom: 10,
                    flexGrow: 1,
                }}
                showsVerticalScrollIndicator={false}>
                <View style={styles.pointsCard}>
                    <View style={styles.pointsheader}>
                        <Text style={styles.smallTitle}>Available points</Text>
                        <Text style={styles.points}>400.0</Text>
                    </View>
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
            <View style={styles.bottomBar}>
                <TouchableOpacity onPress={() => router.push("/home")}>
                    <Ionicons
                        name="home-outline"
                        size={27}
                        color={"#FFFFFF"}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/historial")}>
                    <Ionicons
                        name="bar-chart-outline"
                        size={27}
                        color={"#FFFFFF"}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/ExpensesManagement")}>
                    <Ionicons
                        name="swap-horizontal-outline"
                        size={27}
                        color={"#FFFFFF"}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons
                        name="layers-outline"
                        size={27}
                        color={"#FFFFFF"}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/Profile")}>
                    <Ionicons
                        name="person-outline"
                        size={27}
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
        backgroundColor: "#081023"
    },
    pointsheader: {
        backgroundColor: "#ffffff",
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 18,
        height: 75,
        marginTop: 3,
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
        marginTop: 20
    },
    headerTitle: {
        color: "white",
        fontSize: 21,
        fontWeight: "bold",
    },
    pointsCard: {
        backgroundColor: "#081023",
        padding: 14,
        marginTop: 5,
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