    
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function Redemptionhistory() {
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
                                    size={35}
                                    color="#081023"
                                />

                            </View>

                            <View style={styles.resumenItem}>

                                <Ionicons
                                    name="star-outline"
                                    size={20}
                                    color="#081023"
                                />

                                <Text style={styles.resumenTitle}>
                                    Benefits
                                </Text>

                                <Text style={styles.resumenValor}>
                                    12
                                </Text>

                            </View>

                            <View style={styles.resumenItem}>
                                <Ionicons
                                    name="wallet-outline"
                                    size={20}
                                    color="#081023"
                                />

                                <Text style={styles.resumenTitle}>
                                    Total redeemed
                                </Text>

                                <Text style={styles.resumenValor}>
                                    $10.00
                                </Text>
                            </View>

                            <View style={styles.resumenItem}>
                                <Ionicons
                                    name="pricetag-outline"
                                    size={20}
                                    color="#081023"
                                />

                                <Text style={styles.resumenTitle}>
                                    Exchanges
                                </Text>

                                <Text style={styles.resumenValor}>
                                    5
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.filters}>
                        <Filter
                            text="Todos"
                            icon="list-outline"
                            active={filter === "Todos"}
                            onPress={() => setfilter("Todos")}
                        />

                        <Filter
                            text="Complete"
                            icon="time-outline"
                            active={filter === "Complete"}
                            onPress={() => setfilter("Complete")}
                        />

                        <Filter
                            text="In process"
                            icon="checkmark-circle-outline"
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
                                    No hay canjes en esta categoria
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
                                            redeemed on {canje.date}.
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
        paddingBottom: 30,
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
    },

    resumenContent: {
        flex: 1,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
    },

    resumenTitleGeneral: {
        fontSize: 10,
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
        width: 50,
        alignItems: "center",
        justifyContent: "center",
    },

    resumenTitle: {
        fontSize: 8,
        color: "#081023",
        fontWeight: "600",
        marginTop: 2,
        textAlign: "center",
    },

    resumenValor: {
        fontSize: 11,
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
});
