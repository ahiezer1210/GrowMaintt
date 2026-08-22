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

import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

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
  cyan: "#25B7D3",
  dark: "#081023",
  white: "#FFFFFF",
  gray: "#ACADAD",
  textDark: "#0A3438",
};

const NAV = [
  ["home-outline", "ion"],
  ["bar-chart-outline", "ion"],
  ["swap-horizontal", "material"],
  ["layers-outline", "material"],
  ["person-outline", "ion"],
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

  const small = width < 360;

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
            "users",
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

      const selectedImage =
        result.assets[0].uri;

      setPhotoURL(selectedImage);
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
          "We need access to your camera to take a profile picture."
        );

        return;
      }

      const result =
        await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

      if (result.canceled) {
        return;
      }

      const selectedImage =
        result.assets[0].uri;

      setPhotoURL(selectedImage);
    } catch (error) {
      console.log(
        "Error taking photo:",
        error
      );

      Alert.alert(
        "Error",
        "Unable to take the photo."
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
      await getDownloadURL(imageRef);

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

      let finalPhotoURL = photoURL;

      if (
        photoURL &&
        (
          photoURL.startsWith("file://") ||
          photoURL.startsWith("content://")
        )
      ) {
        finalPhotoURL =
          await uploadPhoto(photoURL);
      }

      const userRef = doc(
        db,
        "users",
        user.uid
      );

      await setDoc(
        userRef,
        {
          username: username.trim(),
          phone: phone.trim(),
          email: email.trim(),
          photoURL:
            finalPhotoURL || null,
          notifications:
            notifications,
          darkMode:
            darkMode,
          updatedAt:
            new Date(),
        },
        {
          merge: true,
        }
      );

      setPhotoURL(finalPhotoURL);

      Alert.alert(
        "Profile Updated",
        "Your profile has been updated successfully."
      );
    } catch (error) {
      console.log(
        "Error updating profile:",
        error
      );

      Alert.alert(
        "Error",
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: small
                ? 18
                : width > 430
                ? 34
                : 25,
            },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <TouchableOpacity>
              <Ionicons
                name="arrow-back"
                size={23}
                color={COLORS.white}
              />
            </TouchableOpacity>

            <Text
              style={styles.headerTitle}
            >
              Edit My Profile
            </Text>

            <TouchableOpacity
              style={
                styles.headerNotification
              }
            >
              <Ionicons
                name="notifications-outline"
                size={20}
                color={COLORS.dark}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.profileCard}>
            <View
              style={styles.photoContainer}
            >
              {photoURL ? (
                <Image
                  source={{
                    uri: photoURL,
                  }}
                  style={
                    styles.profileImage
                  }
                />
              ) : (
                <View
                  style={
                    styles.profilePlaceholder
                  }
                >
                  <Ionicons
                    name="person"
                    size={35}
                    color={COLORS.gray}
                  />
                </View>
              )}

              <TouchableOpacity
                style={
                  styles.cameraButton
                }
                onPress={changePhoto}
              >
                <Ionicons
                  name="camera-outline"
                  size={14}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.name}>
              {username || "User"}
            </Text>

            <Text style={styles.id}>
              ID:{" "}
              {user?.uid?.slice(0, 8) ||
                "00000000"}
            </Text>

            <View style={styles.section}>
              <Text
                style={
                  styles.sectionTitle
                }
              >
                Account{"\n"}
                Settings
              </Text>

              <Text style={styles.label}>
                Username
              </Text>

              <TextInput
                style={styles.input}
                value={username}
                onChangeText={
                  setUsername
                }
                placeholder="Username"
                placeholderTextColor="#777"
              />

              <Text style={styles.label}>
                Phone Number
              </Text>

              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={
                  setPhone
                }
                placeholder="+503 0000 0000"
                placeholderTextColor="#777"
                keyboardType="phone-pad"
              />

              <Text style={styles.label}>
                Email Address
              </Text>

              <TextInput
                style={styles.input}
                value={email}
                onChangeText={
                  setEmail
                }
                placeholder="email@gmail.com"
                placeholderTextColor="#777"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <View
                style={styles.optionRow}
              >
                <Text
                  style={
                    styles.optionText
                  }
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
                  style={
                    styles.optionText
                  }
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
                    style={
                      styles.updateText
                    }
                  >
                    Update Profile
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <BottomNav small={small} />
      </View>
    </SafeAreaView>
  );
}

function BottomNav({ small }) {
  return (
    <View
      style={[
        styles.bottom,
        {
          height: small ? 85 : 100,
          borderTopLeftRadius: small
            ? 45
            : 65,
        },
      ]}
    >
      {NAV.map(
        ([icon, type], index) => (
          <TouchableOpacity
            key={index}
            style={styles.navItem}
          >
            {type === "ion" ? (
              <Ionicons
                name={icon}
                size={small ? 25 : 31}
                color={
                  index === 4
                    ? COLORS.dark
                    : COLORS.white
                }
              />
            ) : (
              <MaterialCommunityIcons
                name={icon}
                size={small ? 28 : 34}
                color={COLORS.white}
              />
            )}
          </TouchableOpacity>
        )
      )}
    </View>
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

  scrollContent: {
    paddingBottom: 125,
  },

  header: {
    height: 85,
    paddingHorizontal: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },

  headerNotification: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.cyan,
    alignItems: "center",
    justifyContent: "center",
  },

  profileCard: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    minHeight: 600,
    paddingTop: 58,
    paddingHorizontal: 0,
  },

  photoContainer: {
    position: "absolute",
    top: -28,
    alignSelf: "center",
  },

  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: COLORS.white,
  },

  profilePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#172037",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.white,
  },

  cameraButton: {
    position: "absolute",
    right: -1,
    bottom: 1,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.cyan,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.white,
  },

  name: {
    textAlign: "center",
    color: COLORS.textDark,
    fontSize: 14,
    fontWeight: "700",
  },

  id: {
    textAlign: "center",
    color: "#777",
    fontSize: 8,
    marginTop: 2,
  },

  section: {
    marginTop: 12,
    paddingHorizontal: 22,
  },

  sectionTitle: {
    color: COLORS.textDark,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 13,
    lineHeight: 14,
  },

  label: {
    color: COLORS.textDark,
    fontSize: 9,
    fontWeight: "500",
    marginBottom: 5,
  },

  input: {
    height: 35,
    backgroundColor: "#B3B3B3",
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 10,
    color: "#333",
    marginBottom: 13,
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
    marginBottom: 7,
  },

  optionText: {
    color: COLORS.textDark,
    fontSize: 9,
    fontWeight: "500",
  },

  updateButton: {
    alignSelf: "center",
    width: 103,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.dark,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  updateButtonDisabled: {
    opacity: 0.7,
  },

  updateText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: "500",
  },

  bottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.cyan,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});