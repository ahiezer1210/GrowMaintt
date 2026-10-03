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
    const { t, colors } = useAppSettings();

    const isDarkTheme =
        colors.background?.toLowerCase() === "#081023" ||
        colors.background?.toLowerCase() === "#071426" ||
        colors.primaryBackground?.toLowerCase() === "#081023" ||
        colors.primaryBackground?.toLowerCase() === "#071426";

    const { width } = useWindowDimensions();

    const small = width < 350;
    const tablet = width >= 600;

    const scale = small
        ? 0.85
        : tablet
            ? 1.15
            : 1;

    const horizontalPadding = small
        ? 10
        : tablet
            ? 30
            : 14;

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
                        points:
                            typeof data.points === "number"
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

                    return (
                        b.date.getTime() -
                        a.date.getTime()
                    );
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
            case "dollarcity":
            case "groupq":
            case "microsoft":
            case "neveria":
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
            t.language === "es"
                ? "es-SV"
                : "en-US",
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
                (canje) =>
                    canje.state === filter
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
        const rewardTitle =
            getRewardTitle(canje);

        const date = formatDate(canje.date);

        Alert.alert(
            getTypeLabel(canje),
            `${t.date}: ${date}\n\n` +
                `${t.reward}: ${rewardTitle}\n\n` +
                `${t.pointsUsed}: ${canje.points}\n\n` +
                `${t.state}: ${getStateLabel(
                    canje.state
                )}\n\n` +
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
        <View
            style={[
                styles.container,
                {
                    backgroundColor:
                        colors.primaryBackground,
                },
            ]}
        >
            <StatusBar
                translucent
                barStyle="light-content"
                backgroundColor={colors.header}
            />

            {/* HEADER */}
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
                        backgroundColor:
                            colors.header,
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
                        router.push(
                            "/pointsExchange"
                        )
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
                        color={colors.white}
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
                                        4 *
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
                            color: colors.white,
                        },
                    ]}
                >
                    {t.redemptionHistory}
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
                    onPress={() =>
                        router.push({
                            pathname:
                                "/notifications",
                            params: {
                                from:
                                    "/redemption_history",
                            },
                        })
                    }
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
                        color={colors.white}
                    />
                </TouchableOpacity>
            </View>

            {/* MAIN */}
            <View
                style={[
                    styles.card,
                    {
                        backgroundColor:
                            colors.background,
                        borderTopLeftRadius:
                            tablet
                                ? 55
                                : small
                                    ? 35
                                    : 45,
                        borderTopRightRadius:
                            tablet
                                ? 55
                                : small
                                    ? 35
                                    : 45,
                    },
                ]}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[
                        styles.scrollContent,
                        {
                            paddingHorizontal:
                                horizontalPadding,
                            paddingTop: s(30),
                            paddingBottom: s(100),
                        },
                    ]}
                >
                    {/* CARD RESUMEN */}
                    <View
                        style={[
                            styles.resumen,
                            {
                                height: s(105),
                                borderRadius: s(20),
                                marginBottom: s(25),
                                paddingTop: s(-2),
                                marginTop: -s(20),
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.resumenTitleGeneral,
                                {
                                    color: "#081023",
                                    fontSize: s(15),
                                    marginBottom: s(3),
                                },
                            ]}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            minimumFontScale={0.8}
                        >
                            {
                                t.summaryOfYourExchanges
                            }
                        </Text>

                        <View
                            style={[
                                styles.resumenContent,
                                {
                                    marginTop:
                                        -s(5),
                                },
                            ]}
                        >
                            {/* GIFT */}
                            <View
                                style={[
                                    styles.giftContainer,
                                    {
                                        width:
                                            s(65),
                                        marginTop:
                                            -s(5),
                                    },
                                ]}
                            >
                                <Ionicons
                                    name="gift-outline"
                                    size={s(55)}
                                    color="#081023"
                                />
                            </View>

                            {/* BENEFITS */}
                            <View
                                style={
                                    styles.resumenItem
                                }
                            >
                                <Ionicons
                                    name="star-outline"
                                    size={s(22)}
                                    color="#081023"
                                />

                                <Text
                                    style={[
                                        styles.resumenTitle,
                                        {
                                            color:
                                                "#081023",
                                            fontSize:
                                                s(
                                                    10
                                                ),
                                            marginTop:
                                                s(
                                                    1
                                                ),
                                        },
                                    ]}
                                    numberOfLines={
                                        2
                                    }
                                    adjustsFontSizeToFit
                                    minimumFontScale={
                                        0.75
                                    }
                                >
                                    {t.benefits}
                                </Text>

                                <Text
                                    style={[
                                        styles.resumenValor,
                                        {
                                            color:
                                                "#081023",
                                            fontSize:
                                                s(
                                                    14
                                                ),
                                            marginTop:
                                                s(
                                                    1
                                                ),
                                        },
                                    ]}
                                >
                                    {
                                        canjes.length
                                    }
                                </Text>
                            </View>

                            {/* TOTAL REDEEMED */}
                            <View
                                style={
                                    styles.resumenItem
                                }
                            >
                                <Ionicons
                                    name="wallet-outline"
                                    size={s(22)}
                                    color="#081023"
                                />

                                <Text
                                    style={[
                                        styles.resumenTitle,
                                        {
                                            color:
                                                "#081023",
                                            fontSize:
                                                s(
                                                    10
                                                ),
                                            marginTop:
                                                s(
                                                    1
                                                ),
                                        },
                                    ]}
                                    numberOfLines={
                                        2
                                    }
                                    adjustsFontSizeToFit
                                    minimumFontScale={
                                        0.75
                                    }
                                >
                                    {
                                        t.totalRedeemed
                                    }
                                </Text>

                                <Text
                                    style={[
                                        styles.resumenValor,
                                        {
                                            color:
                                                "#081023",
                                            fontSize:
                                                s(
                                                    14
                                                ),
                                            marginTop:
                                                s(
                                                    1
                                                ),
                                        },
                                    ]}
                                >
                                    {canjes
                                        .reduce(
                                            (
                                                total,
                                                canje
                                            ) =>
                                                total +
                                                canje.points,
                                            0
                                        )
                                        .toFixed(
                                            1
                                        )}
                                </Text>
                            </View>

                            {/* EXCHANGES */}
                            <View
                                style={
                                    styles.resumenItem
                                }
                            >
                                <Ionicons
                                    name="pricetag-outline"
                                    size={s(22)}
                                    color="#081023"
                                />

                                <Text
                                    style={[
                                        styles.resumenTitle,
                                        {
                                            color:
                                                "#081023",
                                            fontSize:
                                                s(
                                                    10
                                                ),
                                            marginTop:
                                                s(
                                                    1
                                                ),
                                        },
                                    ]}
                                    numberOfLines={
                                        2
                                    }
                                    adjustsFontSizeToFit
                                    minimumFontScale={
                                        0.75
                                    }
                                >
                                    {t.exchanges}
                                </Text>

                                <Text
                                    style={[
                                        styles.resumenValor,
                                        {
                                            color:
                                                "#081023",
                                            fontSize:
                                                s(
                                                    14
                                                ),
                                            marginTop:
                                                s(
                                                    1
                                                ),
                                        },
                                    ]}
                                >
                                    {
                                        canjes.length
                                    }
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* FILTERS */}
                    <View
                        style={[
                            styles.filters,
                            {
                                backgroundColor:
                                    isDarkTheme
                                        ? colors.primaryBackground
                                        : colors.background,
                                borderColor:
                                    colors.border,
                                height: s(55),
                                borderRadius: s(7),
                                marginBottom:
                                    s(20),
                            },
                        ]}
                    >
                        <Filter
                            text={t.all}
                            icon="list-outline"
                            active={
                                filter ===
                                "Todos"
                            }
                            onPress={() =>
                                setfilter(
                                    "Todos"
                                )
                            }
                            scale={scale}
                            colors={colors}
                            isDarkTheme={
                                isDarkTheme
                            }
                        />

                        <Filter
                            text={t.complete}
                            icon="time-outline"
                            active={
                                filter ===
                                "Complete"
                            }
                            onPress={() =>
                                setfilter(
                                    "Complete"
                                )
                            }
                            scale={scale}
                            colors={colors}
                            isDarkTheme={
                                isDarkTheme
                            }
                        />

                        <Filter
                            text={t.inProcess}
                            icon="checkmark-circle-outline"
                            active={
                                filter ===
                                "In process"
                            }
                            onPress={() =>
                                setfilter(
                                    "In process"
                                )
                            }
                            scale={scale}
                            colors={colors}
                            isDarkTheme={
                                isDarkTheme
                            }
                        />

                        <Filter
                            text={t.canceled}
                            icon="close-circle-outline"
                            active={
                                filter ===
                                "Canceled"
                            }
                            onPress={() =>
                                setfilter(
                                    "Canceled"
                                )
                            }
                            scale={scale}
                            colors={colors}
                            isDarkTheme={
                                isDarkTheme
                            }
                        />
                    </View>

                    {/* LIST */}
                    <View
                        style={[
                            styles.list,
                            {
                                gap: s(12),
                            },
                        ]}
                    >
                        {canjesFiltrados.length ===
                        0 ? (
                            <View
                                style={
                                    styles.sinCanjes
                                }
                            >
                                <Ionicons
                                    name="document-text-outline"
                                    size={45}
                                    color="#ACADAD"
                                />

                                <Text
                                    style={[
                                        styles.sinCanjesText,
                                        {
                                            color:
                                                colors.secondaryText,
                                        },
                                    ]}
                                >
                                    {
                                        t.noRedemptionsInCategory
                                    }
                                </Text>
                            </View>
                        ) : (
                            canjesFiltrados.map(
                                (canje) => (
                                    <TouchableOpacity
                                        key={
                                            canje.id
                                        }
                                        style={[
                                            styles.canje,
                                            {
                                                backgroundColor:
                                                    isDarkTheme
                                                        ? colors.primaryBackground
                                                        : colors.background,
                                                borderColor:
                                                    colors.border,
                                                minHeight:
                                                    s(
                                                        75
                                                    ),
                                                borderRadius:
                                                    s(
                                                        10
                                                    ),
                                                paddingHorizontal:
                                                    s(
                                                        7
                                                    ),
                                                paddingVertical:
                                                    s(
                                                        8
                                                    ),
                                            },
                                        ]}
                                        onPress={() =>
                                            showDetail(
                                                canje
                                            )
                                        }
                                        activeOpacity={
                                            0.7
                                        }
                                    >
                                        <View
                                            style={[
                                                styles.canjeIcon,
                                                {
                                                    width:
                                                        s(
                                                            45
                                                        ),
                                                    height:
                                                        s(
                                                            45
                                                        ),
                                                    marginRight:
                                                        s(
                                                            4
                                                        ),
                                                },
                                            ]}
                                        >
                                            <Ionicons
                                                name={
                                                    canje.icon
                                                }
                                                size={s(
                                                    27
                                                )}
                                                color={
                                                    colors.icon
                                                }
                                            />
                                        </View>

                                        <View
                                            style={
                                                styles.canjeInfo
                                            }
                                        >
                                            <View
                                                style={[
                                                    styles.tipoContainer,
                                                    {
                                                        borderRadius:
                                                            s(
                                                                12
                                                            ),
                                                        paddingHorizontal:
                                                            s(
                                                                10
                                                            ),
                                                        paddingVertical:
                                                            s(
                                                                3
                                                            ),
                                                        marginBottom:
                                                            s(
                                                                5
                                                            ),
                                                    },
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.tipo,
                                                        {
                                                            color:
                                                                "#081023",
                                                            fontSize:
                                                                s(
                                                                    12
                                                                ),
                                                        },
                                                    ]}
                                                >
                                                    {getTypeLabel(
                                                        canje
                                                    )}
                                                </Text>
                                            </View>

                                            <Text
                                                style={[
                                                    styles.date,
                                                    {
                                                        color:
                                                            colors.text,
                                                        fontSize:
                                                            s(
                                                                12
                                                            ),
                                                    },
                                                ]}
                                            >
                                                {
                                                    t.redeemedOn
                                                }{" "}
                                                {formatDate(
                                                    canje.date
                                                )}
                                                .
                                            </Text>
                                        </View>

                                        <View
                                            style={[
                                                styles.canjeRight,
                                                {
                                                    marginLeft:
                                                        s(
                                                            5
                                                        ),
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.discount,
                                                    {
                                                        color:
                                                            colors.text,
                                                        fontSize:
                                                            s(
                                                                9
                                                            ),
                                                        marginBottom:
                                                            s(
                                                                2
                                                            ),
                                                    },
                                                ]}
                                            >
                                                {
                                                    canje.points
                                                }{" "}
                                                pts
                                            </Text>

                                            <Ionicons
                                                name="chevron-forward"
                                                size={s(
                                                    20
                                                )}
                                                color={
                                                    colors.icon
                                                }
                                            />
                                        </View>
                                    </TouchableOpacity>
                                )
                            )
                        )}
                    </View>
                </ScrollView>
            </View>

            {/* BOTTOM NAV */}
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
                        backgroundColor:
                            colors.nav,
                    },
                ]}
            >
                {navItems.map((item) => (
                    <TouchableOpacity
                        key={item.route}
                        style={styles.navItem}
                        activeOpacity={0.8}
                        onPress={() =>
                            router.push(
                                item.route
                            )
                        }
                    >
                        <MaterialCommunityIcons
                            name={item.icon}
                            size={
                                item.icon ===
                                    "swap-horizontal"
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
                            color={
                                colors.white
                            }
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
    colors,
}) {
    const s = (value) =>
        Math.round(value * scale);

    return (
        <TouchableOpacity
            style={[
                styles.filter,
                active &&
                    styles.filterActive,
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Ionicons
                name={icon}
                size={s(14)}
                color={
                    active
                        ? "#081823"
                        : colors.icon
                }
            />

            <Text
                style={[
                    styles.filterText,
                    {
                        color: active
                            ? "#081823"
                            : colors.text,
                    },
                ]}
            >
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
        width: "100%",
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
        flex: 1,
        fontWeight: "700",
        textAlign: "center",
    },

    headerBell: {
        justifyContent: "center",
    },

    card: {
        flex: 1,
        width: "100%",
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
        borderTopLeftRadius: 45,
        borderTopRightRadius: 45,
    },

    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 30,
    },

    resumen: {
        height: 105,
        backgroundColor: "#25B7D3",
        borderRadius: 20,
        marginBottom: 25,
        paddingTop: 5,
        marginTop: -20,
    },

    resumenTitleGeneral: {
        fontSize: 15,
        color: "#081023",
        fontWeight: "700",
        marginBottom: 3,
        textAlign: "center",
    },

    resumenContent: {
        flex: 1,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 8,
        marginTop: -5,
    },

    resumenItem: {
        flex: 1,
        minWidth: 0,
        alignItems: "center",
        justifyContent: "center",
    },

    giftContainer: {
        width: 65,
        alignItems: "center",
        justifyContent: "center",
        marginTop: -5,
    },

    resumenTitle: {
        fontSize: 10,
        color: "#081023",
        fontWeight: "600",
        marginTop: 1,
        textAlign: "center",
        maxWidth: "100%",
    },

    resumenValor: {
        fontSize: 14,
        color: "#081023",
        fontWeight: "700",
        marginTop: 1,
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