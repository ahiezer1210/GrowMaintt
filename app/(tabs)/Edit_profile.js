import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Image,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export default function editeProfile() {
    const [username, setUsername] = useState("");
    const [telephone, setTelephone] = useState("");
    const [email, setEmail] = useState("");
    const [profileImage, setProfileImage]= useState(
        require("../../assets/images/Image.jpg")
    );
    const [notifications, setNotifications] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const editedProfile = async () => {
        if (!username || !telephone || !email) {
            Alert.alert("Incomplete fields");
            return;
        }

        Alert.alert("Success", "Your profile has been updated")
    };

    const changeProfileImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if(!permission.granted){
            Alert.alert(
                "Permission required",
                "You need to allow access to your photos."
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if(!result.canceled){
            setProfileImage(result.assets[0].uri);
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons
                        name="arrow-back"
                        size={25}
                        color="#ffffff"
                    />
                </TouchableOpacity>
                <Text style={styles.title}>Edit profile</Text>

                <TouchableOpacity style={styles.notificationButton}>
                    <Ionicons
                        name="notifications-outline"
                        size={22}
                        color="#081023"
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.imageContainer}>

                <TouchableOpacity onPress={changeProfileImage}>
                <Image
                    source={profileImage}
                    style={styles.profileImage}
                />
                </TouchableOpacity>

                <Text style={styles.name}>Diana Cardoza</Text>

                <Text style={styles.userID}>ID: 25030024</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Account settings</Text>

                <Text style={styles.label}>Username</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Diana Cardoza"
                    value={username}
                    onChangeText={setUsername}
                    placeholderTextColor="#ACADAD"
                />

                <Text style={styles.label}>Telephone</Text>

                <TextInput
                    style={styles.input}
                    placeholder="+503 7883 1422"
                    keyboardType="phone-pad"
                    value={telephone}
                    onChangeText={setTelephone}
                    placeholderTextColor="#ACADAD"
                />

                <Text style={styles.label}>Email</Text>

                <TextInput
                    style={styles.input}
                    placeholder="dianacardoza@gmail.com"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholderTextColor="#ACADAD"
                />


                <View style={styles.optionsContainer}>

                    <Text style={styles.label}>Pop-up notifications</Text>
                   
                    <Switch
                        value={notifications}
                        onValueChange={setNotifications}
                        trackColor={{
                            false: "#bdbdbd",
                            true: "#168aff"
                        }}
                        thumbColor="#ffffff"
                    />
                </View>


                <View style={styles.optionsContainer}>
                    <Text style={styles.label}>Dark Mode </Text>

                    <Switch
                        value={darkMode}
                        onValueChange={setDarkMode}
                        trackColor={{
                            false: "#bdbdbd",
                            true: "#168aff"
                        }}
                        thumbColor="#ffffff"
                    />
                </View>


                <TouchableOpacity style={styles.button} onPress={editedProfile}>
                    <Text style={styles.buttonText}>Update profile</Text>
                </TouchableOpacity>


            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#081023",
        marginTop:10,

    },

    header: {
        paddingTop: 40,
        paddingBottom: -30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    sectionTitle:{
        fontSize:20,
        marginTop: 10,

    },

    imageContainer:{
        position: "adsolute",
        alignItems: "center",
        top: 8,
        left: 0,
        right: 0,
        zIndex: 10,
    },

    profileImage:{
        width:100,
        height:100,
        borderRadius: 50,
    },

    name: {
        color: "#081023",
        fontSize: 20,
        marginTop: 6,
        fontWeight: "bold"
    },

    userID: {
        color: "#081023",
        fontSize: 15,
        marginTop: 2,
    },

    backButton: {
        width: 35,
        alignItems: "flex-start",
        marginLeft: 10,

    },

    title: {
        color: "#FFFFFF",
        fontSize: 28,
        fontWeight: "600",
        flex: 1,
        marginLeft: 75,

    },

    notificationButton: {
        width: 34,
        height: 34,
        borderRadius: 18,
        backgroundColor: "#E0F5E7",
        justifyContent: "center",
        alignItems: "center",
    },

    card: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        paddingHorizontal: 22,
        paddingTop: 65,
        marginTop:-60,
    },

    label: {
        color: "#081023",
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 10,
    },

    input: {
        height: 45,
        backgroundColor: "#F3F4F5",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#000000",
        paddingHorizontal: 14,
        marginBottom: 10,
    },


    optionsContainer: {
        flexDirection: "row",
        marginBottom: 10,
        height: 55,
        backgroundColor: "#f3f4f5",
        borderRadius: 12,
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
        marginTop: 8,

    },


    button: {
        height: 40,
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


});
