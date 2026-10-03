import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    collection,
    doc,
    increment,
    serverTimestamp,
    writeBatch,
} from "firebase/firestore";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppSettings } from "../../context/Appsettings";
import { auth, db } from "../../firebaseConfig";

export default function RegisterInvestment() {
    const { width } = useWindowDimensions();
    const { t, colors } = useAppSettings();

    const [investmentName, setInvestmentName] = useState("");
    const [amount, setAmount] = useState("");
    const [type, setType] = useState("");
    const [date, setDate] = useState("");

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
        ? 18
        : isMediumScreen
            ? 25
            : isTablet
                ? 45
                : 60;

    const s = (value) => Math.round(value * scale);

    const isDarkTheme =
        colors.background?.toLowerCase() === "#081023" ||
        colors.background?.toLowerCase() === "#071426" ||
        colors.primaryBackground?.toLowerCase() === "#081023" ||
        colors.primaryBackground?.toLowerCase() === "#071426";

    const registrarInversion = async () => {
        if (!investmentName || !amount || !type || !date) {
            alert(t.completeAllFields);
            return;
        }

        const investmentAmount = Number(
            amount.replace(",", ".")
        );

        if (
            isNaN(investmentAmount) ||
            investmentAmount <= 0
        ) {
            alert(t.validAmount);
            return;
        }

        const points = Math.floor(investmentAmount);

        try {
            const user = auth.currentUser;

            if (!user) {
                alert(t.mustBeLoggedIn);
                return;
            }

            const userRef = doc(
                db,
                "Users",
                user.uid
            );

            const investmentRef = doc(
                collection(db, "investments")
            );

            const pointsRef = doc(
                collection(db, "Points")
            );

            const batch = writeBatch(db);

            batch.set(investmentRef, {
                userId: user.uid,
                name: investmentName,
                amount: investmentAmount,
                type: type,
                date: date,
                points: points,
            });

            batch.set(pointsRef, {
                userId: user.uid,
                points: points,
                source: "investment",
                investmentId: investmentRef.id,
                createdAt: serverTimestamp(),
            });

            batch.set(
                userRef,
                {
                    points: increment(points),
                },
                {
                    merge: true,
                }
            );

            await batch.commit();

            alert(
                `${t.investmentRegistered}\n${t.pointsEarned} ${points} ${t.points}`
            );

            setInvestmentName("");
            setAmount("");
            setType("");
            setDate("");
        } catch (error) {
            console.log(error);
            alert(t.investmentRegistrationError);
        }
    };

    return (
        <SafeAreaView
            style={[
                styles.container,
                {
                    backgroundColor: colors.header,
                },
            ]}
        >
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={
                    Platform.OS === "ios"
                        ? "padding"
                        : "height"
                }
            >
                {/* HEADER IGUAL AL LOGOUT */}
                <View
                    style={[
                        styles.header,
                        {
                            height:
                                118 *
                                (isSmallScreen
                                    ? 0.85
                                    : isTablet
                                        ? 1.15
                                        : 1),
                            paddingHorizontal:
                                isSmallScreen
                                    ? 18
                                    : isTablet
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
                                            (isSmallScreen
                                                ? 0.85
                                                : isTablet
                                                    ? 1.15
                                                    : 1),
                                    },
                                ],
                            },
                        ]}
                        onPress={() =>
                            router.push("/settings")
                        }
                        activeOpacity={0.7}
                    >
                        <MaterialCommunityIcons
                            name="arrow-left"
                            size={
                                35 *
                                (isSmallScreen
                                    ? 0.85
                                    : isTablet
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
                                    (isSmallScreen
                                        ? 0.85
                                        : isTablet
                                            ? 1.15
                                            : 1),
                                transform: [
                                    {
                                        translateX:
                                            4 *
                                            (isSmallScreen
                                                ? 0.85
                                                : isTablet
                                                    ? 1.15
                                                    : 1),
                                    },
                                    {
                                        translateY:
                                            1 *
                                            (isSmallScreen
                                                ? 0.85
                                                : isTablet
                                                    ? 1.15
                                                    : 1),
                                    },
                                ],
                                color: colors.white,
                            },
                        ]}
                    >
                        {t.registerInvestment}
                    </Text>

                    <TouchableOpacity
                        style={[
                            styles.headerBell,
                            {
                                transform: [
                                    {
                                        translateY:
                                            4 *
                                            (isSmallScreen
                                                ? 0.85
                                                : isTablet
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
                                    from: "/registerinvestments",
                                },
                            })
                        }
                        activeOpacity={0.7}
                    >
                        <MaterialCommunityIcons
                            name="bell-circle-outline"
                            size={
                                35 *
                                (isSmallScreen
                                    ? 0.85
                                    : isTablet
                                        ? 1.15
                                        : 1)
                            }
                            color={colors.white}
                        />
                    </TouchableOpacity>
                </View>

                {/* CONTENEDOR EXTERIOR */}
                <View
                    style={[
                        styles.mainWrapper,
                        {
                            backgroundColor:
                                colors.header,
                        },
                    ]}
                >
                    {/* CARD BLANCA CON CURVA */}
                    <View
                        style={[
                            styles.main,
                            {
                                backgroundColor:
                                    colors.background,
                                borderTopLeftRadius:
                                    isTablet
                                        ? 55
                                        : isSmallScreen
                                            ? 35
                                            : 45,
                                borderTopRightRadius:
                                    isTablet
                                        ? 55
                                        : isSmallScreen
                                            ? 35
                                            : 45,
                            },
                        ]}
                    >
                        <ScrollView
                            showsVerticalScrollIndicator={
                                false
                            }
                            contentContainerStyle={[
                                styles.scrollContent,
                                {
                                    paddingHorizontal:
                                        horizontalPadding,
                                    paddingBottom: s(100),
                                },
                            ]}
                            keyboardShouldPersistTaps="handled"
                        >
                            <View
                                style={
                                    styles.titleContainer
                                }
                            >
                                <Text
                                    style={[
                                        styles.title,
                                        {
                                            fontSize: s(23),
                                            color:
                                                colors.text,
                                        },
                                    ]}
                                >
                                    {
                                        t.registerYourInvestment
                                    }
                                </Text>

                                <Text
                                    style={[
                                        styles.subtitle,
                                        {
                                            fontSize: s(14),
                                            color:
                                                colors.secondaryText,
                                        },
                                    ]}
                                >
                                    {
                                        t.investmentInformation
                                    }
                                </Text>
                            </View>

                            <View
                                style={[
                                    styles.form,
                                    {
                                        backgroundColor:
                                            colors.background,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.label,
                                        {
                                            color:
                                                colors.text,
                                        },
                                    ]}
                                >
                                    {t.investmentName}
                                </Text>

                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            borderColor:
                                                colors.border,
                                            color:
                                                colors.text,
                                            backgroundColor:
                                                isDarkTheme
                                                    ? colors.primaryBackground
                                                    : "#FAFAFA",
                                        },
                                    ]}
                                    placeholder={
                                        t.investmentNamePlaceholder
                                    }
                                    placeholderTextColor="#999"
                                    value={
                                        investmentName
                                    }
                                    onChangeText={
                                        setInvestmentName
                                    }
                                />

                                <Text
                                    style={[
                                        styles.label,
                                        {
                                            color:
                                                colors.text,
                                        },
                                    ]}
                                >
                                    {t.amount}
                                </Text>

                                <View
                                    style={[
                                        styles.amountContainer,
                                        {
                                            borderColor:
                                                colors.border,
                                            backgroundColor:
                                                isDarkTheme
                                                    ? colors.primaryBackground
                                                    : "#FAFAFA",
                                        },
                                    ]}
                                >
                                    <Text
                                        style={
                                            styles.dollar
                                        }
                                    >
                                        $
                                    </Text>

                                    <TextInput
                                        style={[
                                            styles.amountInput,
                                            {
                                                color:
                                                    colors.text,
                                            },
                                        ]}
                                        placeholder="0.00"
                                        placeholderTextColor="#999"
                                        keyboardType="decimal-pad"
                                        value={amount}
                                        onChangeText={
                                            setAmount
                                        }
                                    />
                                </View>

                                <Text
                                    style={[
                                        styles.label,
                                        {
                                            color:
                                                colors.text,
                                        },
                                    ]}
                                >
                                    {t.investmentType}
                                </Text>

                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            borderColor:
                                                colors.border,
                                            color:
                                                colors.text,
                                            backgroundColor:
                                                isDarkTheme
                                                    ? colors.primaryBackground
                                                    : "#FAFAFA",
                                        },
                                    ]}
                                    placeholder={
                                        t.investmentTypePlaceholder
                                    }
                                    placeholderTextColor="#999"
                                    value={type}
                                    onChangeText={setType}
                                />

                                <Text
                                    style={[
                                        styles.label,
                                        {
                                            color:
                                                colors.text,
                                        },
                                    ]}
                                >
                                    {t.date}
                                </Text>

                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            borderColor:
                                                colors.border,
                                            color:
                                                colors.text,
                                            backgroundColor:
                                                isDarkTheme
                                                    ? colors.primaryBackground
                                                    : "#FAFAFA",
                                        },
                                    ]}
                                    placeholder={
                                        t.datePlaceholder
                                    }
                                    placeholderTextColor="#999"
                                    value={date}
                                    onChangeText={setDate}
                                />

                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        {
                                            height: s(52),
                                            borderRadius:
                                                s(15),
                                            marginTop:
                                                s(25),
                                        },
                                    ]}
                                    onPress={
                                        registrarInversion
                                    }
                                >
                                    <MaterialCommunityIcons
                                        name="check-circle-outline"
                                        size={s(23)}
                                        color="white"
                                    />

                                    <Text
                                        style={[
                                            styles.buttonText,
                                            {
                                                fontSize:
                                                    s(16),
                                            },
                                        ]}
                                    >
                                        {
                                            t.registerInvestmentButton
                                        }
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>

                {/* NAVBAR IGUAL AL LOGOUT */}
                <View
                    style={[
                        styles.bottomBar,
                        {
                            height:
                                65 *
                                (isSmallScreen
                                    ? 0.85
                                    : isTablet
                                        ? 1.15
                                        : 1),
                            borderTopLeftRadius:
                                78 *
                                (isSmallScreen
                                    ? 0.85
                                    : isTablet
                                        ? 1.15
                                        : 1),
                            backgroundColor:
                                colors.nav,
                        },
                    ]}
                >
                    <TouchableOpacity
                        style={styles.navItem}
                        activeOpacity={0.8}
                        onPress={() =>
                            router.push("/home")
                        }
                    >
                        <MaterialCommunityIcons
                            name="home-outline"
                            size={
                                35 *
                                (isSmallScreen
                                    ? 0.85
                                    : isTablet
                                        ? 1.15
                                        : 1)
                            }
                            color={colors.white}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.navItem}
                        activeOpacity={0.8}
                        onPress={() =>
                            router.push("/historial")
                        }
                    >
                        <MaterialCommunityIcons
                            name="chart-box-outline"
                            size={
                                35 *
                                (isSmallScreen
                                    ? 0.85
                                    : isTablet
                                        ? 1.15
                                        : 1)
                            }
                            color={colors.white}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.navItem}
                        activeOpacity={0.8}
                        onPress={() =>
                            router.push(
                                "/expensesManagement"
                            )
                        }
                    >
                        <MaterialCommunityIcons
                            name="swap-horizontal"
                            size={
                                37 *
                                (isSmallScreen
                                    ? 0.85
                                    : isTablet
                                        ? 1.15
                                        : 1)
                            }
                            color={colors.white}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.navItem}
                        activeOpacity={0.8}
                        onPress={() =>
                            router.push(
                                "/currentgoal"
                            )
                        }
                    >
                        <MaterialCommunityIcons
                            name="layers-outline"
                            size={
                                35 *
                                (isSmallScreen
                                    ? 0.85
                                    : isTablet
                                        ? 1.15
                                        : 1)
                            }
                            color={colors.white}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.navItem}
                        activeOpacity={0.8}
                        onPress={() =>
                            router.push("/profile")
                        }
                    >
                        <MaterialCommunityIcons
                            name="account-outline"
                            size={
                                35 *
                                (isSmallScreen
                                    ? 0.85
                                    : isTablet
                                        ? 1.15
                                        : 1)
                            }
                            color={colors.white}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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

    mainWrapper: {
        flex: 1,
        width: "100%",
        overflow: "hidden",
    },

    main: {
        flex: 1,
        width: "100%",
        overflow: "hidden",
        borderTopLeftRadius: 45,
        borderTopRightRadius: 45,
    },

    scrollContent: {
        flexGrow: 1,
        paddingTop: 0,
    },

    titleContainer: {
        marginTop: 30,
        marginBottom: 20,
    },

    title: {
        color: "#081023",
        fontWeight: "bold",
    },

    subtitle: {
        color: "#ACADAD",
        marginTop: 7,
    },

    form: {
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
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
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