import React, { useState } from "react";
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function LoginScreen() {

    const [showPassword, setShowPassword] = useState(false);

    return (

        <View style={styles.container}>


            <View style={styles.header}>

                <Text style={styles.title}>
                    Register
                </Text>

            </View>

            <View style={styles.card}>

                <Text style={styles.label}>
                    Username
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter your username"
                    placeholderTextColor="#ACADAD"
                />

                <Text style={styles.label}>
                    E-mail
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter your E-mail"
                    placeholderTextColor="#ACADAD"
                />

                <Text style={styles.label}>
                    Password
                </Text>

                <View style={styles.passwordBox}>

                    <TextInput
                        style={styles.password}
                        placeholder="Enter your password"
                        placeholderTextColor="#ACADAD"
                        secureTextEntry={!showPassword}
                    />

                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Text style={styles.show}>
                            {showPassword ? "Hide" : "Show"}
                        </Text>
                    </TouchableOpacity>

                </View>

                <Text style={styles.label}>
                    Confirm Password
                </Text>

                <View style={styles.passwordBox}>

                    <TextInput
                        style={styles.password}
                        placeholder="Enter your password"
                        placeholderTextColor="#ACADAD"
                        secureTextEntry={!showPassword}
                    />

                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Text style={styles.show}>
                            {showPassword ? "Hide" : "Show"}
                        </Text>
                    </TouchableOpacity>

                </View>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>
                        Next
                    </Text>
                </TouchableOpacity>

                <View style={styles.divider}>
                    <View style={styles.line} />
                    <Text style={styles.or}>
                        Or
                    </Text>
                    <View style={styles.line} />
                </View>


                <TouchableOpacity style={styles.microsoftButton}>

                    <Image
                        source={require("../../assets/images/Microsoft.png")}
                        style={styles.microsoftIcon}
                    />

                    <Text style={styles.microsoftText}>
                        Continue with Microsoft
                    </Text>

                </TouchableOpacity>
            </View>

        </View>

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
        paddingHorizontal: 30,
        paddingTop: 25,
    },

    label: {
        color: "#081023",
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 10,
    },

    input: {
        height: 48,
        backgroundColor: "#F3F4F5",
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "#000000",
        paddingHorizontal: 18,
        marginBottom: 22,
    },

    passwordBox: {
        height: 48,
        backgroundColor: "#F3F4F5",
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "#000000",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 18,
        marginBottom: 22,
    },

    password: {
        flex: 1,
    },

    show: {
        color: "#25B7D3",
        fontWeight: "700",
    },

    button: {
        height: 48,
        backgroundColor: "#25B7D3",
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
    },

    buttonText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 17,
    },

    divider: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 30,
    },

    line: {
        flex: 1,
        height: 1,
        backgroundColor: "#ACADAD",
    },

    or: {
        marginHorizontal: 12,
        color: "#ACADAD",
    },

    microsoftButton: {
        height: 55,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#ACADAD",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    microsoftIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },

    microsoftText: {
        color: "#081023",
        fontWeight: "600",
    },


});
