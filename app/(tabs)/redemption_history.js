import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { router } from "expo-router";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";

export default function Redemptionhistory() {
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
    const canjes = [
        {
            id: "1",
            tipo: "Hilasal discount",
            date: "May 10, 2026",
            discount: "-$20.00",
            state: "Complete",
            icon: "pricetag-outline",
        },

        {
            id: "2",
            tipo: "Partner stores",
            date: "April 28, 2026",
            discount: "-$10.00",
            state: "Complete",
            icon: "pricetag-outline",
        },

        {
            id: "3",
            tipo: "Hilasal discount",
            date: "July 5, 2026",
            discount: "-$5.00",
            state: "In process",
            icon: "pricetag-outline",
        },

        {
            id: "4",
            tipo: "Partner stores",
            date: "March 20, 2026",
            discount: "-$1.99",
            state: "Canceled",
            icon: "pricetag-outline",
        },
    ]

    const canjesFiltrados =
        filter === "Todos"
            ? canjes
            : canjes.filter((canje) => canje.state === filter);

    const showDetail = (canje) => {
        Alert.alert(
            canje.tipo,
            `Date: ${canje.date}\n\n` +
            `Discount: ${canje.discount}\n\n` +
            `State: ${canje.state}\n\n`,
            [
                {
                    text: "Cerrar",
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.header,
                    {
                        paddingTop: s(55),
                        paddingBottom: s(60),
                        paddingHorizontal: horizontalPadding,
                    },
                ]}
            >
                <Text
                    style={[
                        styles.title,
                        {
                            fontSize: s(28),
                        },
                    ]}
                >
                    Redemption History
                </Text>
            </View>

            <View
                style={[
                    styles.card,
                    {
                        borderTopLeftRadius: s(35),
                        borderTopRightRadius: s(35),
                        paddingTop: s(25),
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
                            paddingBottom: s(30),
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
                            Summary of your exchanges
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
                                    Benefits
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
                                    12
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
                                    Total redeemed
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

                                    $10.00
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
                                    Exchanges
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
                                    5
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
                            text="Todos"
                            icon="list-outline"
                            active={filter === "Todos"}
                            onPress={() => setfilter("Todos")}
                            scale={scale}
                        />

                        <Filter
                            text="Complete"
                            icon="time-outline"
                            active={filter === "Complete"}
                            onPress={() => setfilter("Complete")}
                            scale={scale}
                        />

                        <Filter
                            text="In process"
                            icon="checkmark-circle-outline"
                            active={filter === "In process"}
                            onPress={() => setfilter("In process")}
                            scale={scale}
                        />

                        <Filter
                            text="Canceled"
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
                                    No hay canjes en esta categoria
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
                                    onPress={() => showDetail(canje)}
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
                                                {canje.tipo}
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
                                            redeemed on {canje.date}.
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
                                            {canje.discount}
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
                        height: s(70),
                    },
                ]}
            >
                <TouchableOpacity onPress={() => router.push("/home")}>
                    <Ionicons
                        name="home-outline"
                        size={s(27)}
                        color={"#FFFFFF"}
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/historial")}>
                    <Ionicons
                        name="bar-chart-outline"
                        size={s(27)}
                        color={"#FFFFFF"}
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/expensesManagement")}>
                    <Ionicons
                        name="swap-horizontal-outline"
                        size={s(27)}
                        color={"#FFFFFF"}
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/currentgoal")}>
                    <Ionicons
                        name="layers-outline"
                        size={s(27)}
                        color={"#FFFFFF"}
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/profile")}>
                    <Ionicons
                        name="person-outline"
                        size={s(27)}
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