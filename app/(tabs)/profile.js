import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions
} from "react-native";
import { RollInRight } from "react-native-reanimated";

import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {

    const menuOptions = [
        {
            title: "Edite Profile",
            icon: "person-outline",
            color: "#27b6d1",
            route: "/edit_profile"
        },
        {
            title: "Security",
            icon: "shield-checkmark-outline",
            color: "#27b6d1",
            route: "/privacyScreen"
        },
        {
            title: "Settings",
            icon: "settings-outline",
            color: "#27b6d1",
            route: "/settings"
        },
        {
            title: "Terms and\n Conditions",
            icon: "help-circle-outline",
            color: "#27b6d1",
            route: "/terminos"
        },
        {
            title: "Log\n Out",
            icon: "log-out-outline",
            color: "#27b6d1",
            route: "/logout"
        }
    ];

    const abrirNotificaciones = () => {
        router.push({
            pathname: "/notifications",
            params: {
                from: "/profile",
            },
        });
    };

    const { width } = useWindowDimensions();

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

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.header}>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons
                        name="arrow-back"
                        size={25}
                        color="#ffffff"
                    />
                </TouchableOpacity>

                <Text style={[
                    styles.title,
                    {
                        fontSize: 25 * scale,
                    },
                ]}>
                    Profile
                </Text>

                <TouchableOpacity
                    style={[
                        styles.notificationButton,
                        {
                            width: 40 * scale,
                            height: 40 * scale,
                            borderRadius: 20 * scale,
                        },
                    ]}
                    onPress={() => router.push("/notifications")}
                >
                    <Ionicons
                        name="notifications-outline"
                        size={22 * scale}
                        color="#081023"
                    />
                </TouchableOpacity>

            </View>

            <View style={[
                styles.content,
                {
                    marginTop: isTablet ? 70 : 40,
                }
            ]}>

                <View style={[
                    styles.imageContainer,
                    {
                        width: isTablet ? 120 : 90,
                        height: isTablet ? 120 : 90,
                        borderRadius: isTablet ? 60 : 45,
                        top: -40,
                    },
                ]}>
                    <Image
                        source={require("../../assets/images/Image.jpg")}
                        style={styles.logo}
                    />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[
                        styles.scrollContent,
                        {
                            paddingHorizontal: horizontalPadding,
                        },
                    ]}
                >


                    <Text style={[
                        styles.name,
                        {
                            fontSize: isTablet ? 28 : 18,
                            marginTop: isTablet ? 80 : 60,
                            marginRight: isTablet ? 40 : 20,
                        },
                    ]}>
                        Diana Cardoza
                    </Text>

                    <View style={[
                        styles.optionsContainer,
                        {
                            paddingHorizontal: horizontalPadding,
                        },
                    ]}>

                        {menuOptions.map((option, index) => (

                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.opttion,
                                    {
                                        minHeight: isTablet ? 98 * scale : 60 * scale,
                                        marginBottom: 18 * scale,
                                        marginRight: isTablet ? 380 * scale : 120 * scale,

                                    },
                                ]}
                                onPress={() => {
                                    if (option.route) {
                                        router.push(option.route);
                                    }
                                }}
                            >

                                <View
                                    style={[
                                        styles.iconContainer,
                                        {
                                            backgroundColor: option.color,
                                            width: isTablet ? 70 * scale : 45 * scale,
                                            height: isTablet ? 70 * scale : 45 * scale,
                                            borderRadius: 12 * scale,
                                            marginRight: 16 * scale,
                                        }
                                    ]}
                                >

                                    <Ionicons
                                        name={option.icon}
                                        size={25 * scale}
                                        color="#FFFFFF"
                                    />

                                </View>

                                <Text style={[
                                    styles.optionText,
                                    {
                                        fontSize: isTablet ? 20 * scale : 16 * scale,
                                        lineHeight: 28 * scale,
                                    },
                                ]}>
                                    {option.title}
                                </Text>

                            </TouchableOpacity>

                        ))}

                    </View>

                </ScrollView>

            </View>

            <View style={[
                styles.bottomBar,
                {
                    height: isSmallScreen ? 60 : isTablet ? 95 : 70,
                }
            ]}>

                <TouchableOpacity
                    onPress={() => router.push("/home")}
                >
                    <Ionicons
                        name="home-outline"
                        size={isSmallScreen ? 23 : isTablet ? 32 : 27}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push("/historial")}
                >
                    <Ionicons
                        name="bar-chart-outline"
                        size={isSmallScreen ? 23 : isTablet ? 32 : 27}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() =>
                        router.push("/expensesManagement")
                    }
                >
                    <Ionicons
                        name="swap-horizontal-outline"
                        size={isSmallScreen ? 23 : isTablet ? 32 : 27}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() =>
                        router.push("/currentgoal")
                    }
                >
                    <Ionicons
                        name="layers-outline"
                        size={isSmallScreen ? 23 : isTablet ? 32 : 27}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() =>
                        router.push("/profile")
                    }
                >
                    <Ionicons
                        name="person-outline"
                        size={isSmallScreen ? 23 : isTablet ? 32 : 27}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>

            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#081023",
    },

    scrollContent: {
        alignItems: "center",
        paddingBottom: 30,
    },

    header: {
        height: 105,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#081023",
        marginTop: -30,
    },

    backButton: {
        width: 45,
        height: 45,
        alignItems: "flex-start",
        justifyContent: "center",
    },

    title: {
        flex: 1,
        textAlign: "center",
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 25,
        marginTop: 30,
    },

    notificationButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#d8f2e2",
        alignItems: "center",
        justifyContent: "center"
    },

    imageContainer: {
        position: "absolute",
        top: -40,
        overflow: "hidden",
        borderWidth: 3,
        borderColor: "#0e2738",
    },

    logo: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },

    content: {
        backgroundColor: "#FFFFFF",
        flex: 1,
        marginTop: 70,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        alignItems: "center",
        width: "100%"
    },

    name: {
        color: "#0e2738",
        fontSize: 18,
        marginTop: 40,
        fontWeight: "700",
    },

    optionsContainer: {
        width: "100%",
        paddingHorizontal: 30,
        marginTop: 15,
    },

    opttion: {
        width: "100%",
        minHeight: 60,
        alignItems: "center",
        flexDirection: "row",
        marginBottom: 18,
    },

    iconContainer: {
        width: 45,
        height: 45,
        borderRadius: 12,
        marginRight: 15,
        justifyContent: "center",
        alignItems: "center",
    },

    optionText: {
        color: "#0e2738",
        fontSize: 16,
        fontWeight: "600",
        lineHeight: 20,
    },

    bottomBar: {
        height: 70,
        backgroundColor: "#24b6d1",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginBottom: -25,
    },

});
