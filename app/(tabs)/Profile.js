import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";

import {

    Image,

    StyleSheet,

    Text,

    TouchableOpacity,

    View

} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {

    const menuOptions = [

        {

            title: "Edite Profile",

            icon: "person-outline",

            color: "#27b6d1",

            route: "/editProfile"

        },

        {

            title: "Security",

            icon: "shield-checkmark-outline",

            color: "#27b6d1",

            route: "/security"

        },

        {

            title: "Configuration",

            icon: "settings-outline",

            color: "#27b6d1",

            route: "/configuration"

        },

        {

            title: "Terms and\n Conditions",

            icon: "help-circle-outline",

            color: "#27b6d1",

            route: "/terms"

        },

        {

            title: "Log\n Out",

            icon: "log-out-outline",

            color: "#27b6d1",

            route: "/null"

        }

    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons

                        name="arrow-back"

                        size={25}

                        color="#ffffff"

                    />
                </TouchableOpacity>
                <Text style={styles.title}>Profile</Text>
                <TouchableOpacity style={styles.notificationButton}>
                    <Ionicons

                        name="notifications-outline"

                        size={22}

                        color="#081023"

                    />
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <View style={styles.imageContainer}>
                    <Image

                        source={require("../../assets/images/Image.jpg")}

                        style={styles.logo}

                    />
                </View>
                <Text style={styles.name}>Diana Cardoza</Text>
                <View style={styles.optionsContainer}>

                    {menuOptions.map((option, index) => (
                        <TouchableOpacity

                            key={index}

                            style={styles.opttion}

                            onPress={() => {

                                if (option.route) {

                                    router.push(option.route);

                                }

                            }}
                        >
                            <View

                                style={[

                                    styles.iconContainer,

                                    { backgroundColor: option.color }

                                ]}
                            >
                                <Ionicons

                                    name={option.icon}

                                    size={22}

                                    color="#FFFFFF"

                                />
                            </View>
                            <Text style={styles.optionText}>

                                {option.title}
                            </Text>
                        </TouchableOpacity>

                    ))}
                </View>
            </View>
        </SafeAreaView>

    );

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#081023",
    },

    header: {
        height: 105,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#0e2738",
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
        width: 90,
        height: 90,
        borderRadius: 45,
        position: "absolute",
        top: -25,
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
        paddingTop: 55,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        alignItems: "center",
        width:"100%"
    },

    name: {
        color: "#0e2738",
        fontSize: 18,
        marginTop: 0,
        fontWeight: "700",
    },

    optionsContainer: {
        width: "100%",
        paddingHorizontal: 30,
        marginTop: 35,
    },

    opttion: {
        width: "100%",
        minHeight:60,
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
        fontWeight: "500",
        lineHeight: 20,
    },

});

