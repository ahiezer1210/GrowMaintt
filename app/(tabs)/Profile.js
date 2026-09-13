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

import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {

    const menuOptions = [
        {
            title: "Edite Profile",
            icon: "person-outline",
            color: "#27b6d1",
            route: "/Edit_profile"
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
            route: "/signout"
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

    const { width, height } = useWindowDimensions();

    const isSmallScreen = width < 360;
    const isMediumScreen = width >= 360 && width < 600;
    const isTablet = width >= 600;
    const isLargeScreen = width >= 900;

    const scale = isSmallScreen
        ? 0.85
        : isMediumScreen
            ? 1
            : isTablet
                ? 1.35
                : 1.5;

    const horizontalPadding = isSmallScreen
        ? 15
        : isMediumScreen
            ? 25
            : isTablet
                ? 60
                : 45;

    return (
        <SafeAreaView style={styles.container}>

            <View style={[
                styles.header,
                {
                    height: isSmallScreen
                        ? 80
                        : isTablet
                            ? 100
                            : 30,
                    paddingHorizontal: isSmallScreen ? 15: isTablet ? 35: 20,
                },
            ]}>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons
                        name="arrow-back"
                        size={25 * scale}
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
                    onPress={abrirNotificaciones}
                >
                    <Ionicons
                        name="notifications-outline"
                        size={22 * scale}
                        color="#081023"
                    />
                </TouchableOpacity>

            </View>

            <View style={styles.content}>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[
                        styles.scrollContent,
                        {
                            paddingHorizontal: horizontalPadding,
                        },
                    ]}
                >

                    <View style={[
                        styles.imageContainer,
                        {
                            width: isTablet ? 120 : 90 ,
                            height:  isTablet ? 120 : 90,
                            borderRadius: isTablet ? 60 :45,
                            top: 0,
                        },
                    ]}>
                        <Image
                            source={require("../../assets/images/Image.jpg")}
                            style={styles.logo}
                        />
                    </View>

                    <Text style={[
                        styles.name,
                        {
                            fontSize: 18 * scale,
                            marginTop: 100 * scale,
                        },
                    ]}>
                        Diana Cardoza
                    </Text>

                    <View style={styles.optionsContainer}>

                        {menuOptions.map((option, index) => (

                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.opttion,
                                    {
                                        minHeight: 60 * scale,
                                        marginBottom: 18 * scale,
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
                                            width: 45 * scale,
                                            height: 45 * scale,
                                            borderRadius: 12 * scale,
                                            marginRight: 15 * scale,
                                        }
                                    ]}
                                >

                                    <Ionicons
                                        name={option.icon}
                                        size={22 * scale}
                                        color="#FFFFFF"
                                    />

                                </View>

                                <Text style={[
                                    styles.optionText,
                                    {
                                        fontSize: 16 * scale,
                                        lineHeight: 20 * scale,
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
                    height: isSmallScreen
                        ? 65
                        : isTablet
                            ? 85
                            : 60,

                            marginBottom: isSmallScreen
                            ? 0
                            : isTablet
                            ? 0
                            : -30,
                }
            ]}>

                <TouchableOpacity
                    onPress={() => router.push("/home")}
                >
                    <Ionicons
                        name="home-outline"
                        size={isSmallScreen ? 24 : isTablet ? 34 : 29}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push("/historial")}
                >
                    <Ionicons
                        name="bar-chart-outline"
                        size={isSmallScreen ? 24 : isTablet ? 34 : 29}
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
                        size={isSmallScreen ? 24 : isTablet ? 34 : 29}
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
                        size={isSmallScreen ? 24 : isTablet ? 34 : 29}
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
                        size={isSmallScreen ? 24 : isTablet ? 34 : 29}
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
        height:85,
        paddingHorizontal: 18,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#081023",
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
        marginTop: 0,
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
        alignSelf: "center",
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
        paddingTop: 15,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
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
        marginTop: 15,
    },

    opttion: {
        width: "100%",
        minHeight: 70,
        alignItems: "center",
        flexDirection: "row",
        marginBottom: 25,
    },

    iconContainer: {
        width: 55,
        height: 55,
        borderRadius: 15,
        marginRight: 20,
        justifyContent: "center",
        alignItems: "center",
    },

    optionText: {
        color: "#0e2738",
        fontSize: 19,
        fontWeight: "600",
        lineHeight: 24,
    },

    bottomBar: {
        backgroundColor: "#24b6d1",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },

});

