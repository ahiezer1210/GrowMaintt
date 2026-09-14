import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import {
    collection,
    doc,
    increment,
    writeBatch,
} from "firebase/firestore";

import {auth, db } from "../../firebaseConfig";

export default function RegisterInvestment() {
    const { width } = useWindowDimensions();

    const [investmentName, setInvestmentName] = useState("");
    const [amount, setAmount] = useState("");
    const [type, setType] = useState("");
    const [date, setDate] = useState("");

    const isSmallScreen = width < 360;
    const isMediumScreen = width >= 360 && width < 600;
    const isTablet = width >= 600;
    const isLargeScreen = width >= 900;

    const scale = isSmallScreen
        ? 0.85
        : isMediumScreen
            ? 1
            : isTablet
                ? 1.15
                : 1.25;

    const horizontalPadding = isSmallScreen
        ? 18
        : isMediumScreen
            ? 25
            : isTablet
                ? 45
                : 60;

    const registrarInversion = async () => {
        if (!investmentName || !amount || !type || !date) {
            alert("Please complete all the fields.");
            return;
        }

        const investmentAmount = Number(amount);

        if (isNaN(investmentAmount) || investmentAmount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        const points = Math.floor(investmentAmount);

        try {
            const user = auth.currentUser;

            if (!user) {
                alert("You must be logged in.");
                return;
            }

            const userRef = doc(db, "Users", user.uid);

            const investmentRef = doc(collection(db, "investments"));

            const batch = writeBatch(db);

            batch.set(investmentRef, {
                userId: user.uid,
                name: investmentName,
                amount: investmentAmount,
                type: type,
                date: date,
                points: points,
            });

            batch.set(
                userRef,
                {
                    points: increment(points),
                },
                { merge: true }
            );

            await batch.commit();

            alert(
                `Investment registered successfully!\nYou earned ${points} points.`
            );

            setInvestmentName("");
            setAmount("");
            setType("");
            setDate("");

        } catch (error) {
            console.log(error);
            alert("There was an error registering the investment.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>

            <View style={[
                styles.header,
                {
                    paddingHorizontal: horizontalPadding,
                    height: 150 * scale,
                },
            ]}>

                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons
                        name="arrow-back"
                        size={25 * scale}
                        color="white"
                    />
                </TouchableOpacity>

                <Text style={[
                    styles.headerTitle,
                    {
                        fontSize: 21 * scale,

                    }
                ]}>
                    Register Investment
                </Text>

                <TouchableOpacity onPress={() => router.push("/notifications")}>
                    <Ionicons
                        name="notifications-outline"
                        size={25 * scale}
                        color="white"
                    />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: horizontalPadding,
                    paddingBottom: 30,
                }}>
                <View style={styles.titleContainer}>
                    <Text style={[
                        styles.title,
                        {
                            fontSize: 23 * scale
                        },
                    ]}> Register your investment</Text>

                    <Text style={[
                        styles.subtitle,
                        {
                            fontSize: 14 * scale
                        },
                    ]}> Enter the information about your investment</Text>
                </View>

                <View style={styles.form}>
                    <Text style={
                        styles.label
                    }> Investment name</Text>


                    <TextInput
                        style={styles.input}
                        placeholder="Example:savign investment"
                        placeholderTextColor={"#999"}
                        value={investmentName}
                        onChangeText={setInvestmentName}
                    />

                    <Text style={styles.label}> Amount</Text>

                    <View style={styles.amountContainer}>
                        <Text style={styles.dollar}>$</Text>

                        <TextInput
                            style={styles.amountInput}
                            placeholder="0.00"
                            placeholderTextColor="#999"
                            keyboardType="decimal-pad"
                            value={amount}
                            onChangeText={setAmount}
                        />
                    </View>

                    <Text style={styles.label}>
                        Investment type
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Example: Business, savings..."
                        placeholderTextColor="#999"
                        value={type}
                        onChangeText={setType}
                    />

                    <Text style={styles.label}>
                        Date
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="DD/MM/YYYY"
                        placeholderTextColor="#999"
                        value={date}
                        onChangeText={setDate}
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={registrarInversion}
                    >
                        <Ionicons
                            name="checkmark-circle-outline"
                            size={23}
                            color="white"
                        />

                        <Text style={styles.buttonText}>
                            Register investment
                        </Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>

            <View
                style={[
                    styles.bottomBar,
                    { height: 70 * scale },
                ]}
            >
                <TouchableOpacity onPress={() => router.push("/home")}>
                    <Ionicons
                        name="home-outline"
                        size={27 * scale}
                        color="white"
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/historial")}>
                    <Ionicons
                        name="bar-chart-outline"
                        size={27 * scale}
                        color="white"
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push("/expensesManagement")}
                >
                    <Ionicons
                        name="swap-horizontal-outline"
                        size={27 * scale}
                        color="white"
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push("/currentgoal")}
                >
                    <Ionicons
                        name="layers-outline"
                        size={27 * scale}
                        color="white"
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/profile")}>
                    <Ionicons
                        name="person-outline"
                        size={27 * scale}
                        color="white"
                    />
                </TouchableOpacity>


            </View>
        </SafeAreaView >
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },

    header: {
        backgroundColor: "#081023",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: -40,
    },

    headerTitle: {
        color: "white",
        fontWeight: "bold",
        marginTop: 20,
    },

    titleContainer: {
        marginTop: 30,
        marginBottom: 20,
    },

    title: {
        color: "#081023",
        fontWeight: "bold",
        marginTop: -20,
    },

    subtitle: {
        color: "#ACADAD",
        marginTop: 7,
    },

    form: {
        backgroundColor: "white",
        borderRadius: 25,
        padding: 20,
        marginBottom: 20,
    },

    label: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#081023",
        marginBottom: 7,
        marginTop: 12,
    },

    input: {
        height: 50,
        borderWidth: 1,
        borderColor: "#D5D5D5",
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 14,
        color: "#081023",
        backgroundColor: "#FAFAFA",
    },

    amountContainer: {
        height: 50,
        borderWidth: 1,
        borderColor: "#D5D5D5",
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FAFAFA",
    },

    dollar: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#24B3CE",
        marginLeft: 15,
    },

    amountInput: {
        flex: 1,
        height: 50,
        paddingHorizontal: 10,
        fontSize: 15,
        color: "#081023",
    },

    button: {
        height: 52,
        backgroundColor: "#24B3CE",
        borderRadius: 15,
        marginTop: 25,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
    },

    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },

    bottomBar: {
        backgroundColor: "#24B6D1",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginBottom: -30,
    },
});