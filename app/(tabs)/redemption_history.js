import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
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
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";
import { useAppSettings } from "../../context/Appsettings";
import { auth, db } from "../../firebaseConfig";

export default function Redemptionhistory() {
    const { t } = useAppSettings();

    const { width } = useWindowDimensions();

    const isSmallScreen = width < 360;
    const isMediumScreen = width >= 360 && width < 600;
    const isTablet = width >= 600;

    const scale = isSmallScreen
        ? 0.85
        : isMediumScreen
            ? 1
            : isTablet
                ? 1.15
                : 1.25;

    const horizontalPadding = isSmallScreen
        ? 10
        : isMediumScreen
            ? 14
            : isTablet
                ? 30
                : 45;

    const s = (value) => Math.round(value * scale);

    const [filter, setfilter] = useState("Todos");
    const [canjes, setCanjes] = useState([]);

    useEffect(() => {
        const user = auth.currentUser;

        if (!user) {
            setCanjes([]);
            return;
        }

        const redeemedQuery = query(
            collection(db, "Redeemed"),
            where("userId", "==", user.uid)
        );

        const unsubscribe = onSnapshot(
            redeemedQuery,
            (snapshot) => {
                const redeemed = snapshot.docs.map((item) => {
                    const data = item.data();

                    let redeemedDate = null;

                    if (data.redeemedAt?.toDate) {
                        redeemedDate = data.redeemedAt.toDate();
                    } else if (data.redeemedAt) {
                        redeemedDate = new Date(data.redeemedAt);
                    }

                    return {
                        id: item.id,
                        rewardId: data.rewardId || "",
                        store: data.store || "",
                        title: data.title || "",
                        points: typeof data.points === "number"
                            ? data.points
                            : 0,
                        code: data.code || "",
                        date: redeemedDate,
                        state: "Complete",
                        icon: "pricetag-outline",
                    };
                });

                redeemed.sort((a, b) => {
                    if (!a.date) return 1;
                    if (!b.date) return -1;
                    return b.date.getTime() - a.date.getTime();
                });

                setCanjes(redeemed);
            },
            (error) => {
                console.log(
                    "Error getting redemption history:",
                    error
                );
                setCanjes([]);
            }
        );

        return () => unsubscribe();
    }, []);

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

    const getRewardTitle = (canje) => {
        const translatedReward =
            rewardTranslations[canje.rewardId];

        if (translatedReward?.title) {
            return translatedReward.title;
        }

        return canje.title;
    };

    const getTypeLabel = (canje) => {
        const title = getRewardTitle(canje);

        switch (canje.rewardId) {
            case "hilasal":
                return `${canje.store} ${title}`;
            case "dollarcity":
                return `${canje.store} ${title}`;
            case "groupq":
                return `${canje.store} ${title}`;
            case "microsoft":
                return `${canje.store} ${title}`;
            case "neveria":
                return `${canje.store} ${title}`;
            case "donli":
                return `${canje.store} ${title}`;
            default:
                return canje.store || title;
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "";
        }

        return date.toLocaleDateString(
            t.language === "es" ? "es-SV" : "en-US",
            {
                month: "long",
                day: "numeric",
                year: "numeric",
            }
        );
    };

    const canjesFiltrados =
        filter === "Todos"
            ? canjes
            : canjes.filter(
                (canje) => canje.state === filter
            );

    const getStateLabel = (state) => {
        switch (state) {
            case "Complete":
                return t.complete;
            case "In process":
                return t.inProcess;
            case "Canceled":
                return t.canceled;
            default:
                return state;
        }
    };

    const showDetail = (canje) => {
        const rewardTitle = getRewardTitle(canje);
        const date = formatDate(canje.date);

        Alert.alert(
            getTypeLabel(canje),
            `${t.date}: ${date}\n\n` +
            `${t.reward}: ${rewardTitle}\n\n` +
            `${t.pointsUsed}: ${canje.points}\n\n` +
            `${t.state}: ${getStateLabel(canje.state)}\n\n` +
            `${t.code}: ${canje.code}`,
            [
                {
                    text: t.close,
                },
            ]
        );
    };

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

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="#071426"
            />

            <View
                style={[
                    styles.header,
                    {
                        height: s(118),
                        paddingHorizontal: isSmallScreen
                            ? s(18)
                            : isTablet
                                ? s(45)
                                : s(25),
                    },
                ]}
            >
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => router.push("/pointsExchange")}
                >
                    <MaterialCommunityIcons
                        name="arrow-left"
                        size={s(35)}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>

                <Text
                    style={[
                        styles.headerTitle,
                        {
                            fontSize: s(25),
                            lineHeight: s(29),
                            transform: [
                                {
                                    translateY: s(7),
                                },
                            ],
                        },
                    ]}
                >
                    {t.redemptionHistory}
                </Text>

                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() =>
                        router.push({
                            pathname: "/notifications",
                            params: {
                                from: "/redemption_history",
                            },
                        })
                    }
                >
                    <MaterialCommunityIcons
                        name="bell-circle-outline"
                        size={s(35)}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>
            </View>

            <View
                style={[
                    styles.card,
                    {
                        borderTopLeftRadius: s(45),
                        borderTopRightRadius: s(45),
                    },
                ]}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[
                        styles.scrollContent,
                        {
                            paddingHorizontal: horizontalPadding,
                            paddingTop: s(30),
                            paddingBottom: s(100),
                        },
                    ]}
                >
                    <View
                        style={[
                            styles.resumen,
                            {
                                height: s(105),
                                borderRadius: s(7),
                                marginBottom: s(25),
                                paddingTop: s(5),
                                marginTop: -s(20),
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.resumenTitleGeneral,
                                {
                                    fontSize: s(15),
                                    marginBottom: s(3),
                                },
                            ]}
                        >
                            {t.summaryOfYourExchanges}
                        </Text>

                        <View
                            style={[
                                styles.resumenContent,
                                {
                                    marginTop: -s(5),
                                },
                            ]}
                        >
                            <View
                                style={[
                                    styles.giftContainer,
                                    {
                                        width: s(90),
                                        marginTop: -s(10),
                                    },
                                ]}
                            >
                                <Ionicons
                                    name="gift-outline"
                                    size={s(80)}
                                    color="#081023"
                                />
                            </View>

                            <View style={styles.resumenItem}>
                                <Ionicons
                                    name="star-outline"
                                    size={s(25)}
                                    color="#081023"
                                />

                                <Text
                                    style={[
                                        styles.resumenTitle,
                                        {
                                            fontSize: s(11),
                                            marginTop: s(2),
                                        },
                                    ]}
                                >
                                    {t.benefits}
                                </Text>

                                <Text
                                    style={[
                                        styles.resumenValor,
                                        {
                                            fontSize: s(15),
                                            marginTop: s(2),
                                        },
                                    ]}
                                >
                                    {canjes.length}
                                </Text>
                            </View>

                            <View style={styles.resumenItem}>
                                <Ionicons
                                    name="wallet-outline"
                                    size={s(25)}
                                    color="#081023"
                                />

                                <Text
                                    style={[
                                        styles.resumenTitle,
                                        {
                                            fontSize: s(11),
                                            marginTop: s(2),
                                        },
                                    ]}
                                >
                                    {t.totalRedeemed}
                                </Text>

                                <Text
                                    style={[
                                        styles.resumenValor,
                                        {
                                            fontSize: s(15),
                                            marginTop: s(2),
                                        },
                                    ]}
                                >
                                    {canjes
                                        .reduce(
                                            (total, canje) =>
                                                total +
                                                canje.points,
                                            0
                                        )
                                        .toFixed(1)}
                                </Text>
                            </View>

                            <View style={styles.resumenItem}>
                                <Ionicons
                                    name="pricetag-outline"
                                    size={s(25)}
                                    color="#081023"
                                />

                                <Text
                                    style={[
                                        styles.resumenTitle,
                                        {
                                            fontSize: s(11),
                                            marginTop: s(2),
                                        },
                                    ]}
                                >
                                    {t.exchanges}
                                </Text>

                                <Text
                                    style={[
                                        styles.resumenValor,
                                        {
                                            fontSize: s(15),
                                            marginTop: s(2),
                                        },
                                    ]}
                                >
                                    {canjes.length}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View
                        style={[
                            styles.filters,
                            {
                                height: s(55),
                                borderRadius: s(7),
                                marginBottom: s(20),
                            },
                        ]}
                    >
                        <Filter
                            text={t.all}
                            icon="list-outline"
                            active={filter === "Todos"}
                            onPress={() => setfilter("Todos")}
                            scale={scale}
                        />

                        <Filter
                            text={t.complete}
                            icon="time-outline"
                            active={filter === "Complete"}
                            onPress={() => setfilter("Complete")}
                            scale={scale}
                        />

                        <Filter
                            text={t.inProcess}
                            icon="checkmark-circle-outline"
                            active={filter === "In process"}
                            onPress={() => setfilter("In process")}
                            scale={scale}
                        />

                        <Filter
                            text={t.canceled}
                            icon="close-circle-outline"
                            active={filter === "Canceled"}
                            onPress={() => setfilter("Canceled")}
                            scale={scale}
                        />
                    </View>

                    <View
                        style={[
                            styles.list,
                            {
                                gap: s(12),
                            },
                        ]}
                    >
                        {canjesFiltrados.length === 0 ? (
                            <View style={styles.sinCanjes}>
                                <Ionicons
                                    name="document-text-outline"
                                    size={45}
                                    color="#ACADAD"
                                />

                                <Text style={styles.sinCanjesText}>
                                    {t.noRedemptionsInCategory}
                                </Text>
                            </View>
                        ) : (
                            canjesFiltrados.map((canje) => (
                                <TouchableOpacity
                                    key={canje.id}
                                    style={[
                                        styles.canje,
                                        {
                                            minHeight: s(75),
                                            borderRadius: s(10),
                                            paddingHorizontal: s(7),
                                            paddingVertical: s(8),
                                        },
                                    ]}
                                    onPress={() =>
                                        showDetail(canje)
                                    }
                                    activeOpacity={0.7}
                                >
                                    <View
                                        style={[
                                            styles.canjeIcon,
                                            {
                                                width: s(45),
                                                height: s(45),
                                                marginRight: s(4),
                                            },
                                        ]}
                                    >
                                        <Ionicons
                                            name={canje.icon}
                                            size={s(27)}
                                            color="#081823"
                                        />
                                    </View>

                                    <View style={styles.canjeInfo}>
                                        <View
                                            style={[
                                                styles.tipoContainer,
                                                {
                                                    borderRadius: s(12),
                                                    paddingHorizontal: s(10),
                                                    paddingVertical: s(3),
                                                    marginBottom: s(5),
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.tipo,
                                                    {
                                                        fontSize: s(12),
                                                    },
                                                ]}
                                            >
                                                {getTypeLabel(canje)}
                                            </Text>
                                        </View>

                                        <Text
                                            style={[
                                                styles.date,
                                                {
                                                    fontSize: s(12),
                                                },
                                            ]}
                                        >
                                            {t.redeemedOn}{" "}
                                            {formatDate(canje.date)}.
                                        </Text>
                                    </View>

                                    <View
                                        style={[
                                            styles.canjeRight,
                                            {
                                                marginLeft: s(5),
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.discount,
                                                {
                                                    fontSize: s(9),
                                                    marginBottom: s(2),
                                                },
                                            ]}
                                        >
                                            {canje.points} pts
                                        </Text>

                                        <Ionicons
                                            name="chevron-forward"
                                            size={s(20)}
                                            color="#081823"
                                        />
                                    </View>
                                </TouchableOpacity>
                            ))
                        )}
                    </View>
                </ScrollView>
            </View>

            <View
                style={[
                    styles.bottomBar,
                    {
                        height: s(65),
                        borderTopLeftRadius: s(78),
                    },
                ]}
            >
                {navItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.navItem}
                        onPress={() => router.push(item.route)}
                    >
                        <MaterialCommunityIcons
                            name={item.icon}
                            size={s(
                                item.icon === "swap-horizontal"
                                    ? 37
                                    : 35
                            )}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

function Filter({
    text,
    icon,
    active,
    onPress,
    scale,
}) {
    const s = (value) => Math.round(value * scale);

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
                size={s(14)}
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
        backgroundColor: "#071426",
    },

    header: {
        backgroundColor: "#071426",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    headerButton: {
        width: 35,
        alignItems: "center",
        justifyContent: "center",
    },

    headerTitle: {
        flex: 1,
        color: "#FFFFFF",
        fontWeight: "700",
        textAlign: "center",
    },

    card: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 45,
        borderTopRightRadius: 45,
        overflow: "hidden",
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
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#25B5D1",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingHorizontal: 5,
    },

    navItem: {
        flex: 1,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
});