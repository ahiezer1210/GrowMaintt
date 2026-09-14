import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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
            title: "Edit Profile",
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
            route: "/logout?from=/profile"
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
                    activeOpacity={0.7}
                >
                    <MaterialCommunityIcons
                        name="arrow-left"
                        size={35 * scale}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>

                <Text
                    style={[
                        styles.title,
                        {
                            fontSize: 25 * scale,
                        },
                    ]}
                >
                    Profile
                </Text>

                <TouchableOpacity
                    style={styles.notificationButton}
                    onPress={abrirNotificaciones}
                    activeOpacity={0.7}
                >
                    <MaterialCommunityIcons
                        name="bell-circle-outline"
                        size={35 * scale}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>

            </View>

            <View
                style={[
                    styles.content,
                    {
                        marginTop: isTablet ? 70 : 40,
                    },
                ]}
            >

                <View
                    style={[
                        styles.imageContainer,
                        {
                            width: isTablet ? 120 : 90,
                            height: isTablet ? 120 : 90,
                            borderRadius: isTablet ? 60 : 45,
                            top: -40,
                        },
                    ]}
                >
                    <Image
                        source={require("../../assets/images/Image.jpg")}
                        style={styles.logo}
                    />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    contentContainerStyle={[
                        styles.scrollContent,
                        {
                            paddingHorizontal: horizontalPadding,
                            paddingBottom: 30,
                        },
                    ]}
                >

                    <Text
                        style={[
                            styles.name,
                            {
                                fontSize: isTablet ? 28 : 18,
                                marginTop: isTablet ? 80 : 60,
                                marginRight: isTablet ? 40 : 20,
                            },
                        ]}
                    >
                        Diana Cardoza
                    </Text>

                    <View
                        style={[
                            styles.optionsContainer,
                            {
                                paddingHorizontal: horizontalPadding,
                            },
                        ]}
                    >

                        {menuOptions.map((option, index) => (

                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.opttion,
                                    {
                                        minHeight: isTablet
                                            ? 98 * scale
                                            : 60 * scale,
                                        marginBottom: 18 * scale,
                                        marginRight: isTablet
                                            ? 380 * scale
                                            : 120 * scale,
                                    },
                                ]}
                                onPress={() => {
                                    if (option.route) {
                                        router.push(option.route);
                                    }
                                }}
                                activeOpacity={0.7}
                            >

                                <View
                                    style={[
                                        styles.iconContainer,
                                        {
                                            backgroundColor: option.color,
                                            width: isTablet
                                                ? 70 * scale
                                                : 45 * scale,
                                            height: isTablet
                                                ? 70 * scale
                                                : 45 * scale,
                                            borderRadius: 12 * scale,
                                            marginRight: 16 * scale,
                                        },
                                    ]}
                                >
                                    <Ionicons
                                        name={option.icon}
                                        size={25 * scale}
                                        color="#FFFFFF"
                                    />
                                </View>

                                <Text
                                    style={[
                                        styles.optionText,
                                        {
                                            fontSize: isTablet
                                                ? 20 * scale
                                                : 16 * scale,
                                            lineHeight: 28 * scale,
                                        },
                                    ]}
                                >
                                    {option.title}
                                </Text>

                            </TouchableOpacity>

                        ))}

                    </View>

                </ScrollView>

            </View>

            <View
                style={[
                    styles.bottomBar,
                    {
                        height: isSmallScreen
                            ? 60
                            : isTablet
                                ? 65 * scale
                                : 65,
                        borderTopLeftRadius: 78 * scale,
                    },
                ]}
            >

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => router.push("/home")}
                    activeOpacity={0.7}
                >
                    <MaterialCommunityIcons
                        name="home-outline"
                        size={35 * scale}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => router.push("/historial")}
                    activeOpacity={0.7}
                >
                    <MaterialCommunityIcons
                        name="chart-box-outline"
                        size={35 * scale}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => router.push("/expensesManagement")}
                    activeOpacity={0.7}
                >
                    <MaterialCommunityIcons
                        name="swap-horizontal"
                        size={37 * scale}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => router.push("/currentgoal")}
                    activeOpacity={0.7}
                >
                    <MaterialCommunityIcons
                        name="layers-outline"
                        size={35 * scale}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => router.push("/profile")}
                    activeOpacity={0.7}
                >
                    <MaterialCommunityIcons
                        name="account-outline"
                        size={35 * scale}
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
        paddingTop: 0,
    },

    header: {
        height: 75,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#081023",
        marginTop: -10,
    },

    backButton: {
        width: 45,
        height: 45,
        alignItems: "center",
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
        width: 45,
        height: 45,
        alignItems: "center",
        justifyContent: "center",
    },

    imageContainer: {
        position: "absolute",
        top: -40,
        overflow: "hidden",
        borderWidth: 3,
        borderColor: "#0e2738",
        zIndex: 10,
        elevation: 10,
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
        width: "100%",
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
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: 65,
        backgroundColor: "#25B5D1",
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