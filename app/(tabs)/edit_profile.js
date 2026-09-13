import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import { router } from "expo-router";

import * as ImagePicker from "expo-image-picker";

import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import {
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

import { onAuthStateChanged } from "firebase/auth";

import { auth, db, storage } from "../../firebaseConfig";

const COLORS = {
  cyan: "#25B5D1",
  dark: "#071426",
  white: "#FFFFFF",
  gray: "#ACADAD",
  textDark: "#0A3438",
  lightGray: "#B3B3B3",
};

const NAV = [
  { icon: "home-outline", route: "/home" },
  { icon: "chart-box-outline", route: "/historial" },
  { icon: "swap-horizontal", route: "/expensesManagement" },
  { icon: "layers-outline", route: "/currentgoal" },
  { icon: "account-outline", route: "/profile" },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState(null);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { width } = useWindowDimensions();

  const isSmall = width < 360;
  const isTablet = width >= 768;

  const scale = isSmall
    ? 0.85
    : isTablet
    ? 1.15
    : 1;

  const horizontalPadding = isSmall
    ? 18
    : isTablet
    ? 45
    : 25;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        if (!currentUser) {
          setLoading(false);
          return;
        }

        setUser(currentUser);

        try {
          const userRef = doc(
            db,
            "Users",
            currentUser.uid
          );

          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data();

            setUsername(data.username || "");
            setPhone(data.phone || "");

            setEmail(
              data.email ||
                currentUser.email ||
                ""
            );

            setPhotoURL(
              data.photoURL || null
            );

            setNotifications(
              data.notifications !== undefined
                ? data.notifications
                : true
            );

            setDarkMode(
              data.darkMode !== undefined
                ? data.darkMode
                : false
            );
          } else {
            setEmail(
              currentUser.email || ""
            );
          }
        } catch (error) {
          console.log(
            "Error loading profile:",
            error
          );

          Alert.alert(
            "Error",
            "Unable to load your profile data."
          );
        }

        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const selectFromGallery = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "We need access to your gallery to change your profile picture."
        );

        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

      if (result.canceled) {
        return;
      }

      setPhotoURL(
        result.assets[0].uri
      );
    } catch (error) {
      console.log(
        "Error selecting image:",
        error
      );

      Alert.alert(
        "Error",
        "Unable to select the image."
      );
    }
  };

  const takePhoto = async () => {
    try {
      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Camera permission status: " +
            permission.status
        );

        return;
      }

      const result =
        await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

      if (result.canceled) return;

      setPhotoURL(
        result.assets[0].uri
      );
    } catch (error) {
      console.log(
        "Camera error:",
        error
      );
    }
  };

  const deletePhoto = () => {
    if (!photoURL) {
      Alert.alert(
        "No Profile Picture",
        "You do not have a profile picture to delete."
      );

      return;
    }

    Alert.alert(
      "Delete Profile Picture",
      "Are you sure you want to delete your profile picture?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setPhotoURL(null);
          },
        },
      ]
    );
  };

  const changePhoto = () => {
    Alert.alert(
      "Profile Picture",
      "What would you like to do?",
      [
        {
          text: "Take Photo",
          onPress: takePhoto,
        },
        {
          text: "Choose from Gallery",
          onPress: selectFromGallery,
        },
        {
          text: "Delete Photo",
          onPress: deletePhoto,
          style: "destructive",
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const uploadPhoto = async (uri) => {
    if (!user) {
      throw new Error(
        "No authenticated user."
      );
    }

    const response = await fetch(uri);
    const blob = await response.blob();

    const imageRef = ref(
      storage,
      `profileImages/${user.uid}.jpg`
    );

    await uploadBytes(
      imageRef,
      blob
    );

    const downloadURL =
      await getDownloadURL(
        imageRef
      );

    return downloadURL;
  };

  const updateProfile = async () => {
    if (!user) {
      Alert.alert(
        "Error",
        "No authenticated user."
      );

      return;
    }

    if (!username.trim()) {
      Alert.alert(
        "Required Field",
        "Please enter your username."
      );

      return;
    }

    if (!phone.trim()) {
      Alert.alert(
        "Required Field",
        "Please enter your phone number."
      );

      return;
    }

    if (!email.trim()) {
      Alert.alert(
        "Required Field",
        "Please enter your email address."
      );

      return;
    }

    try {
      setSaving(true);

      const userRef = doc(
        db,
        "Users",
        user.uid
      );

      await setDoc(
        userRef,
        {
          username: username.trim(),
          phone: phone.trim(),
          email: email.trim(),
          updatedAt: new Date(),
        },
        {
          merge: true,
        }
      );

      Alert.alert(
        "Profile Updated",
        "Your profile has been updated successfully."
      );
    } catch (error) {
      console.log(
        "Error:",
        error
      );

      Alert.alert(
        "Error",
        error?.message ||
          "Unable to save your changes."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={styles.loadingContainer}
      >
        <ActivityIndicator
          size="large"
          color={COLORS.cyan}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.dark}
      />

      <View style={styles.app}>

        <View
          style={[
            styles.header,
            {
              height:
                118 *
                (isSmall
                  ? 0.85
                  : isTablet
                  ? 1.15
                  : 1),
              paddingHorizontal: isSmall
                ? 18
                : isTablet
                ? 45
                : 25,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.headerButton,
              {
                transform: [
                  {
                    translateY:
                      4 *
                      (isSmall
                        ? 0.85
                        : isTablet
                        ? 1.15
                        : 1),
                  },
                ],
              },
            ]}
            onPress={() =>
              router.push("/profile")
            }
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={
                35 *
                (isSmall
                  ? 0.85
                  : isTablet
                  ? 1.15
                  : 1)
              }
              color={COLORS.white}
            />
          </TouchableOpacity>

          <Text
            style={[
              styles.headerTitle,
              {
                fontSize:
                  25 *
                  (isSmall
                    ? 0.85
                    : isTablet
                    ? 1.15
                    : 1),
                transform: [
                  {
                    translateX:
                      7 *
                      (isSmall
                        ? 0.85
                        : isTablet
                        ? 1.15
                        : 1),
                  },
                  {
                    translateY:
                      1 *
                      (isSmall
                        ? 0.85
                        : isTablet
                        ? 1.15
                        : 1),
                  },
                ],
              },
            ]}
          >
            Edit My Profile
          </Text>

          <TouchableOpacity
            style={[
              styles.notificationButton,
              {
                transform: [
                  {
                    translateY:
                      4 *
                      (isSmall
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
                pathname: "/notifications",
                params: {
                  from: "/Edit_profile",
                },
              })
            }
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="bell-circle-outline"
              size={
                35 *
                (isSmall
                  ? 0.85
                  : isTablet
                  ? 1.15
                  : 1)
              }
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.whiteContainer,
            {
              borderTopLeftRadius:
                isTablet
                  ? 55
                  : isSmall
                  ? 35
                  : 45,

              borderTopRightRadius:
                isTablet
                  ? 55
                  : isSmall
                  ? 35
                  : 45,
            },
          ]}
        >
          <ScrollView
            style={styles.whiteScroll}
            contentContainerStyle={[
              styles.profileScroll,
              {
                paddingHorizontal:
                  horizontalPadding,
                paddingBottom:
                  45 * scale,
              },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.profileCard}>

              <View style={styles.photoContainer}>
                {photoURL ? (
                  <Image
                    source={{
                      uri: photoURL,
                    }}
                    style={[
                      styles.profileImage,
                      {
                        width:
                          82 * scale,
                        height:
                          82 * scale,
                        borderRadius:
                          41 * scale,
                      },
                    ]}
                  />
                ) : (
                  <View
                    style={[
                      styles.profilePlaceholder,
                      {
                        width:
                          82 * scale,
                        height:
                          82 * scale,
                        borderRadius:
                          41 * scale,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="account"
                      size={
                        40 * scale
                      }
                      color={COLORS.gray}
                    />
                  </View>
                )}

                <TouchableOpacity
                  style={[
                    styles.cameraButton,
                    {
                      width:
                        27 * scale,
                      height:
                        27 * scale,
                      borderRadius:
                        14 * scale,
                    },
                  ]}
                  onPress={changePhoto}
                >
                  <MaterialCommunityIcons
                    name="camera-outline"
                    size={
                      16 * scale
                    }
                    color={COLORS.white}
                  />
                </TouchableOpacity>
              </View>

              <Text
                style={[
                  styles.name,
                  {
                    fontSize:
                      20 * scale,
                  },
                ]}
                numberOfLines={1}
              >
                {username || "User"}
              </Text>

              <Text
                style={[
                  styles.id,
                  {
                    fontSize:
                      11 * scale,
                  },
                ]}
              >
                ID:{" "}
                {user?.uid?.slice(
                  0,
                  8
                ) || "00000000"}
              </Text>

              <View style={styles.section}>
                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      fontSize:
                        21 * scale,
                    },
                  ]}
                >
                  Account Settings
                </Text>

                <Text
                  style={[
                    styles.label,
                    {
                      fontSize:
                        14 * scale,
                    },
                  ]}
                >
                  Username
                </Text>

                <TextInput
                  style={[
                    styles.input,
                    {
                      height:
                        48 * scale,
                      fontSize:
                        14 * scale,
                      borderRadius:
                        9 * scale,
                    },
                  ]}
                  value={username}
                  onChangeText={
                    setUsername
                  }
                  placeholder="Username"
                  placeholderTextColor="#777"
                />

                <Text
                  style={[
                    styles.label,
                    {
                      fontSize:
                        14 * scale,
                    },
                  ]}
                >
                  Phone Number
                </Text>

                <TextInput
                  style={[
                    styles.input,
                    {
                      height:
                        48 * scale,
                      fontSize:
                        14 * scale,
                      borderRadius:
                        9 * scale,
                    },
                  ]}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+503 0000 0000"
                  placeholderTextColor="#777"
                  keyboardType="phone-pad"
                />

                <Text
                  style={[
                    styles.label,
                    {
                      fontSize:
                        14 * scale,
                    },
                  ]}
                >
                  Email Address
                </Text>

                <TextInput
                  style={[
                    styles.input,
                    {
                      height:
                        48 * scale,
                      fontSize:
                        14 * scale,
                      borderRadius:
                        9 * scale,
                    },
                  ]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="email@gmail.com"
                  placeholderTextColor="#777"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <View
                  style={styles.optionRow}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        fontSize:
                          14 * scale,
                      },
                    ]}
                  >
                    Push Notifications
                  </Text>

                  <Switch
                    value={notifications}
                    onValueChange={
                      setNotifications
                    }
                    trackColor={{
                      false: "#D7D7D7",
                      true: COLORS.dark,
                    }}
                    thumbColor={
                      COLORS.white
                    }
                  />
                </View>

                <View
                  style={styles.optionRow}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        fontSize:
                          14 * scale,
                      },
                    ]}
                  >
                    Dark Mode
                  </Text>

                  <Switch
                    value={darkMode}
                    onValueChange={
                      setDarkMode
                    }
                    trackColor={{
                      false: "#D7D7D7",
                      true: COLORS.cyan,
                    }}
                    thumbColor={
                      COLORS.white
                    }
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.updateButton,
                    {
                      height:
                        48 * scale,
                      borderRadius:
                        24 * scale,
                    },
                    saving &&
                      styles.updateButtonDisabled,
                  ]}
                  onPress={
                    updateProfile
                  }
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator
                      size="small"
                      color={
                        COLORS.white
                      }
                    />
                  ) : (
                    <Text
                      style={[
                        styles.updateText,
                        {
                          fontSize:
                            14 * scale,
                        },
                      ]}
                    >
                      Update Profile
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>

        <View
          style={[
            styles.bottomBar,
            {
              height:
                65 *
                (isSmall
                  ? 0.85
                  : isTablet
                  ? 1.15
                  : 1),

              borderTopLeftRadius:
                78 *
                (isSmall
                  ? 0.85
                  : isTablet
                  ? 1.15
                  : 1),
            },
          ]}
        >
          {NAV.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.navItem}
              activeOpacity={0.7}
              onPress={() =>
                router.push(item.route)
              }
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={
                  item.icon ===
                  "swap-horizontal"
                    ? 37 *
                      (isSmall
                        ? 0.85
                        : isTablet
                        ? 1.15
                        : 1)
                    : 35 *
                      (isSmall
                        ? 0.85
                        : isTablet
                        ? 1.15
                        : 1)
                }
                color={COLORS.white}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },

  app: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.dark,
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
    width: "100%",
    backgroundColor: COLORS.dark,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerButton: {
    width: 30,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  headerTitle: {
    color: COLORS.white,
    fontWeight: "700",
  },

  notificationButton: {
    justifyContent: "center",
  },

  whiteContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    overflow: "hidden",
  },

  whiteScroll: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  profileScroll: {
    flexGrow: 1,
    paddingTop: 65,
  },

  profileCard: {
    width: "100%",
    backgroundColor: COLORS.white,
    paddingBottom: 50,
  },

  photoContainer: {
    alignSelf: "center",
    marginTop: -65,
    marginBottom: 15,
  },

  profileImage: {
    borderWidth: 2,
    borderColor: COLORS.white,
  },

  profilePlaceholder: {
    backgroundColor: "#172037",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
  },

  cameraButton: {
    position: "absolute",
    right: -2,
    bottom: 1,
    backgroundColor: COLORS.cyan,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
  },

  name: {
    textAlign: "center",
    color: COLORS.textDark,
    fontWeight: "700",
  },

  id: {
    textAlign: "center",
    color: "#777",
    marginTop: 3,
  },

  section: {
    marginTop: 30,
  },

  sectionTitle: {
    color: COLORS.textDark,
    fontWeight: "700",
    marginBottom: 22,
  },

  label: {
    color: COLORS.textDark,
    fontWeight: "600",
    marginBottom: 7,
  },

  input: {
    width: "100%",
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 15,
    color: "#333",
    marginBottom: 17,
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
    marginBottom: 8,
  },

  optionText: {
    color: COLORS.textDark,
    fontWeight: "500",
  },

  updateButton: {
    width: "60%",
    alignSelf: "center",
    backgroundColor: COLORS.dark,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },

  updateButtonDisabled: {
    opacity: 0.7,
  },

  updateText: {
    color: COLORS.white,
    fontWeight: "600",
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: COLORS.cyan,
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