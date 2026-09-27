import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import {
    collection,
    onSnapshot,
    query,
    where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { db } from "../../firebaseConfig";

export default function Redemptionhistory() {
    const [filter, setfilter] = useState("All");
    const [canjes, setCanjes] = useState([]);

    const auth = getAuth();

    useEffect(() => {
        const user = auth.currentUser;

        if (!user) {
            setCanjes([]);
            return;
        }

        const redeemedRef = collection(db, "Redeemed");

        const redeemedQuery = query(
            redeemedRef,
            where("userId", "==", user.uid)
        );

        const unsubscribe = onSnapshot(
            redeemedQuery,
            (snapshot) => {
                const data = snapshot.docs.map((doc) => {
                    const item = doc.data();

                    let date = "Date unavailable";

                    if (item.redeemedAt?.toDate) {
                        date = item.redeemedAt.toDate().toLocaleDateString(
                            "en-US",
                            {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                            }
                        );
                    } else if (item.redeemedAt) {
                        const parsedDate = new Date(item.redeemedAt);

                        if (!isNaN(parsedDate.getTime())) {
                            date = parsedDate.toLocaleDateString(
                                "en-US",
                                {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                }
                            );
                        }
                    }

                    return {
                        id: doc.id,
                        tipo: item.title || "Reward",
                        store: item.store || "Partner stores",
                        date,
                        points: Number(item.points || 0),
                        discount: `-${Number(item.points || 0)} pts`,
                        state: item.state || "Complete",
                        code: item.code || "",
                        icon: "pricetag-outline",
                    };
                });

                data.sort((a, b) => {
                    const dateA = new Date(a.date).getTime();
                    const dateB = new Date(b.date).getTime();

                    return dateB - dateA;
                });

                setCanjes(data);
            },
            (error) => {
                console.log("Error getting redemption history:", error);
                setCanjes([]);
            }
        );

        return unsubscribe;
    }, []);

    const canjesFiltrados =
        filter === "All"
            ? canjes
            : canjes.filter((canje) => canje.state === filter);

    const totalPoints = canjes.reduce(
        (total, canje) => total + canje.points,
        0
    );

    const totalExchanges = canjes.length;

    const showDetail = (canje) => {
        Alert.alert(
            canje.tipo,
            `Store: ${canje.store}\n\n` +
            `Date: ${canje.date}\n\n` +
            `Points used: ${canje.points}\n\n` +
            `Status: ${canje.state}\n\n` +
            (canje.code ? `Code: ${canje.code}\n\n` : ""),
            [
                {
                    text: "Close",
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Redemption History</Text>
            </View>

            <View style={styles.card}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >

                    <View style={styles.resumen}>

                        <Text style={styles.resumenTitleGeneral}>
                            Summary of your exchanges
                        </Text>

                        <View style={styles.resumenContent}>

                            <View style={styles.giftContainer}>
                                <Ionicons
                                    name="gift-outline"
                                    size={80}
                                    color="#081023"
                                />
                            </View>

                            <View style={styles.resumenItem}>

                                <Ionicons
                                    name="star-outline"
                                    size={25}
                                    color="#081023"
                                />

                                <Text style={styles.resumenTitle}>
                                    Benefits
                                </Text>

                                <Text style={styles.resumenValor}>
                                    {totalExchanges}
                                </Text>

                            </View>

                            <View style={styles.resumenItem}>

                                <Ionicons
                                    name="wallet-outline"
                                    size={25}
                                    color="#081023"
                                />

                                <Text style={styles.resumenTitle}>
                                    Total redeemed
                                </Text>

                                <Text style={styles.resumenValor}>
                                    {totalPoints} pts
                                </Text>

                            </View>

                            <View style={styles.resumenItem}>

                                <Ionicons
                                    name="pricetag-outline"
                                    size={25}
                                    color="#081023"
                                />

                                <Text style={styles.resumenTitle}>
                                    Exchanges
                                </Text>

                                <Text style={styles.resumenValor}>
                                    {totalExchanges}
                                </Text>

                            </View>

                        </View>
                    </View>

                    <View style={styles.filters}>

                        <Filter
                            text="All"
                            icon="list-outline"
                            active={filter === "All"}
                            onPress={() => setfilter("All")}
                        />

                        <Filter
                            text="Complete"
                            icon="checkmark-circle-outline"
                            active={filter === "Complete"}
                            onPress={() => setfilter("Complete")}
                        />

                        <Filter
                            text="In process"
                            icon="time-outline"
                            active={filter === "In process"}
                            onPress={() => setfilter("In process")}
                        />

                        <Filter
                            text="Canceled"
                            icon="close-circle-outline"
                            active={filter === "Canceled"}
                            onPress={() => setfilter("Canceled")}
                        />

                    </View>

                    <View style={styles.list}>

                        {canjesFiltrados.length === 0 ? (
                            <View style={styles.sinCanjes}>

                                <Ionicons
                                    name="document-text-outline"
                                    size={45}
                                    color="#ACADAD"
                                />

                                <Text style={styles.sinCanjesText}>
                                    No redemptions in this category
                                </Text>

                            </View>
                        ) : (
                            canjesFiltrados.map((canje) => (
                                <TouchableOpacity
                                    key={canje.id}
                                    style={styles.canje}
                                    onPress={() => showDetail(canje)}
                                    activeOpacity={0.7}
                                >

                                    <View style={styles.canjeIcon}>

                                        <Ionicons
                                            name={canje.icon}
                                            size={27}
                                            color="#081823"
                                        />

                                    </View>

                                    <View style={styles.canjeInfo}>

                                        <View style={styles.tipoContainer}>

                                            <Text style={styles.tipo}>
                                                {canje.tipo}
                                            </Text>

                                        </View>

                                        <Text style={styles.date}>
                                            Redeemed on {canje.date}.
                                        </Text>

                                    </View>

                                    <View style={styles.canjeRight}>

                                        <Text style={styles.discount}>
                                            {canje.discount}
                                        </Text>

                                        <Ionicons
                                            name="chevron-forward"
                                            size={20}
                                            color="#081823"
                                        />

                                    </View>

                                </TouchableOpacity>
                            ))
                        )}

                    </View>

                </ScrollView>
            </View>

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

                <TouchableOpacity
                    onPress={() => router.push("/expensesManagement")}
                >
                    <Ionicons
                        name="swap-horizontal-outline"
                        size={27}
                        color={"#FFFFFF"}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push("/currentgoal")}
                >
                    <Ionicons
                        name="layers-outline"
                        size={27}
                        color={"#FFFFFF"}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push("/profile")}
                >
                    <Ionicons
                        name="person-outline"
                        size={27}
                        color={"#FFFFFF"}
                    />
                </TouchableOpacity>

            </View>
        </View>
    );
}

function Filter({
    text,
    icon,
    active,
    onPress,
}) {
    return (
        <TouchableOpacity
            style={[
                styles.filter,
                active && styles.filterActive,
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >

            <Ionicons
                name={icon}
                size={14}
                color="#081823"
            />

            <Text style={styles.filterText}>
                {text}
            </Text>

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#081023",
    },

    header: {
        alignItems: "center",
        paddingTop: 55,
        paddingBottom: 60,
    },

    title: {
        color: "#FFFFFF",
        fontSize: 28,
        fontWeight: "700",
    },

    card: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        paddingTop: 25,
    },

    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 30,
    },

    resumen: {
        height: 105,
        backgroundColor: "#25B7d3",
        borderRadius: 7,
        marginBottom: 25,
        paddingTop: 5,
        marginTop: -20,
    },

    resumenContent: {
        flex: 1,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        marginTop: -5,
    },

    resumenTitleGeneral: {
        fontSize: 15,
        color: "#081023",
        fontWeight: "700",
        marginBottom: 3,
        textAlign: "center",
    },

    resumenItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    giftContainer: {
        width: 90,
        alignItems: "center",
        justifyContent: "flex-start",
        marginTop: -10,
    },

    resumenTitle: {
        fontSize: 11,
        color: "#081023",
        fontWeight: "600",
        marginTop: 2,
        textAlign: "center",
    },

    resumenValor: {
        fontSize: 15,
        color: "#081023",
        fontWeight: "700",
        marginTop: 2,
    },

    filters: {
        height: 55,
        borderWidth: 1,
        borderColor: "#8C8C8C",
        borderRadius: 7,
        justifyContent: "space-around",
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: 2,
        marginBottom: 20,
    },

    filter: {
        height: 36,
        paddingHorizontal: 6,
        borderRadius: 13,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    filterActive: {
        backgroundColor: "#BCE8EF",
        borderWidth: 1,
        borderColor: "#081023",
    },

    filterText: {
        fontSize: 11,
        color: "#081023",
        marginLeft: 2,
    },

    list: {
        gap: 12,
    },

    canje: {
        minHeight: 75,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#6D6D6D",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 7,
        paddingVertical: 8,
    },

    canjeIcon: {
        width: 45,
        height: 45,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 4,
    },

    canjeInfo: {
        flex: 1,
        justifyContent: "center",
    },

    tipoContainer: {
        backgroundColor: "#BCE8EF",
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 3,
        alignSelf: "flex-start",
        marginBottom: 5,
    },

    tipo: {
        fontSize: 12,
        color: "#081023",
        fontWeight: "600",
    },

    date: {
        fontSize: 12,
        color: "#081023",
    },

    canjeRight: {
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 5,
    },

    discount: {
        color: "#081023",
        fontSize: 9,
        marginBottom: 2,
    },

    without: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 50,
    },

    sinCanjes: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 50,
    },

    sinCanjesText: {
        color: "#777777",
        fontSize: 13,
        marginTop: 10,
    },

    bottomBar: {
        height: 70,
        backgroundColor: "#24b6d1",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
});