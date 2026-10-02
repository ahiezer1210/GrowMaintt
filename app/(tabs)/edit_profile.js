import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import { router } from "expo-router";

import * as ImagePicker from "expo-image-picker";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import {
  onAuthStateChanged,
  sendEmailVerification,
  updateEmail,
} from "firebase/auth";

import { useAppSettings } from "../../context/Appsettings";
import { auth, db } from "../../firebaseConfig";

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

  const { t } = useAppSettings();

  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [originalUsername, setOriginalUsername] = useState("");
  const [originalPhone, setOriginalPhone] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [originalPhotoURL, setOriginalPhotoURL] = useState(null);

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

            const savedUsername =
              data.username || "";

            const savedPhone =
              data.phone || "";

            const savedEmail =
              data.email ||
              currentUser.email ||
              "";

            const savedPhotoURL =
              data.photoURL || null;

            setUsername(savedUsername);
            setPhone(savedPhone);
            setEmail(savedEmail);
            setPhotoURL(savedPhotoURL);

            setOriginalUsername(savedUsername);
            setOriginalPhone(savedPhone);
            setOriginalEmail(savedEmail);
            setOriginalPhotoURL(savedPhotoURL);
          } else {
            const currentEmail =
              currentUser.email || "";

            setEmail(currentEmail);
            setOriginalEmail(currentEmail);
          }
        } catch (error) {
          console.log(
            "Error loading profile:",
            error
          );

          Alert.alert(
            t.error,
            t.unableToLoadProfile
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
          t.permissionRequired,
          t.galleryPermission
        );

        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.5,
          base64: true,
        });

      if (result.canceled) {
        return;
      }

      const asset = result.assets[0];

      if (!asset.base64) {
        Alert.alert(
          t.error,
          t.unableToProcessImage
        );

        return;
      }

      const imageBase64 =
        `data:image/jpeg;base64,${asset.base64}`;

      setPhotoURL(imageBase64);
    } catch (error) {
      console.log(
        "Error selecting image:",
        error
      );

      Alert.alert(
        t.error,
        t.unableToSelectImage
      );
    }
  };

  const takePhoto = async () => {
    try {
      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          t.permissionRequired,
          `${t.cameraPermissionStatus} ${permission.status}`
        );

        return;
      }

      const result =
        await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.5,
          base64: true,
        });

      if (result.canceled) {
        return;
      }

      const asset = result.assets[0];

      if (!asset.base64) {
        Alert.alert(
          t.error,
          t.unableToProcessPhoto
        );

        return;
      }

      const imageBase64 =
        `data:image/jpeg;base64,${asset.base64}`;

      setPhotoURL(imageBase64);
    } catch (error) {
      console.log(
        "Camera error:",
        error
      );

      Alert.alert(
        t.error,
        t.unableToTakePhoto
      );
    }
  };

  const deletePhoto = () => {
    if (!photoURL) {
      Alert.alert(
        t.noProfilePicture,
        t.noProfilePictureMessage
      );

      return;
    }

    Alert.alert(
      t.deleteProfilePicture,
      t.deleteProfilePictureMessage,
      [
        {
          text: t.cancel,
          style: "cancel",
        },
        {
          text: t.delete,
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
      t.profilePicture,
      t.whatWouldYouLikeToDo,
      [
        {
          text: t.takePhoto,
          onPress: takePhoto,
        },
        {
          text: t.chooseFromGallery,
          onPress: selectFromGallery,
        },
        {
          text: t.deletePhoto,
          onPress: deletePhoto,
          style: "destructive",
        },
        {
          text: t.cancel,
          style: "cancel",
        },
      ]
    );
  };

  const createSecurityAlert = async ({
    type,
    title,
    message,
    extraData = {},
  }) => {
    try {
      if (!user) return;

      await addDoc(
        collection(
          db,
          "Users",
          user.uid,
          "securityAlerts"
        ),
        {
          uid: user.uid,
          type,
          title,
          message,
          read: false,
          createdAt: serverTimestamp(),
          ...extraData,
        }
      );
    } catch (error) {
      console.log(
        "Error creating security alert:",
        error
      );
    }
  };

  const updateProfile = async () => {
    if (!user) {
      Alert.alert(
        t.error,
        t.noAuthenticatedUser
      );

      return;
    }

    if (!username.trim()) {
      Alert.alert(
        t.requiredField,
        t.enterUsername
      );

      return;
    }

    if (!phone.trim()) {
      Alert.alert(
        t.requiredField,
        t.enterPhone
      );

      return;
    }

    if (!email.trim()) {
      Alert.alert(
        t.requiredField,
        t.enterEmail
      );

      return;
    }

    const newUsername =
      username.trim();

    const newPhone =
      phone.trim();

    const newEmail =
      email.trim();

    const oldEmail =
      (
        originalEmail ||
        user.email ||
        ""
      ).trim();

    const usernameChanged =
      newUsername !==
      originalUsername.trim();

    const phoneChanged =
      newPhone !==
      originalPhone.trim();

    const emailChanged =
      newEmail.toLowerCase() !==
      oldEmail.toLowerCase();

    const photoChanged =
      photoURL !== originalPhotoURL;

    const anyProfileChange =
      usernameChanged ||
      phoneChanged ||
      emailChanged ||
      photoChanged;

    try {
      setSaving(true);

      if (emailChanged) {
        try {
          await updateEmail(
            user,
            newEmail
          );

          await sendEmailVerification(
            user
          );
        } catch (error) {
          console.log(
            "Error updating authentication email:",
            error
          );

          if (
            error?.code ===
            "auth/requires-recent-login"
          ) {
            Alert.alert(
              t.recentLoginRequired,
              t.recentLoginMessage
            );
          } else if (
            error?.code ===
            "auth/email-already-in-use"
          ) {
            Alert.alert(
              t.emailAlreadyInUse,
              t.emailAlreadyInUseMessage
            );
          } else if (
            error?.code ===
            "auth/invalid-email"
          ) {
            Alert.alert(
              t.invalidEmail,
              t.invalidEmailMessage
            );
          } else {
            Alert.alert(
              t.emailUpdateError,
              error?.message ||
                t.emailUpdateErrorMessage
            );
          }

          return;
        }
      }

      const userRef = doc(
        db,
        "Users",
        user.uid
      );

      await setDoc(
        userRef,
        {
          username: newUsername,
          phone: newPhone,
          email: newEmail,
          photoURL: photoURL || null,
          updatedAt: serverTimestamp(),
        },
        {
          merge: true,
        }
      );

      if (
        usernameChanged ||
        photoChanged
      ) {
        await createSecurityAlert({
          type: "profile_change",
          title:
            t.profileInformationUpdated,
          message:
            t.profileInformationUpdatedMessage,
        });
      }

      if (emailChanged) {
        await createSecurityAlert({
          type: "email_change",
          title:
            t.emailAddressChanged,
          message:
            t.emailAddressChangedMessage,
          extraData: {
            newEmail,
          },
        });
      }

      if (phoneChanged) {
        await createSecurityAlert({
          type: "phone_change",
          title:
            t.phoneNumberChanged,
          message:
            t.phoneNumberChangedMessage,
          extraData: {
            phone: newPhone,
          },
        });
      }

      setOriginalUsername(
        newUsername
      );

      setOriginalPhone(
        newPhone
      );

      setOriginalEmail(
        newEmail
      );

      setOriginalPhotoURL(
        photoURL
      );

      if (emailChanged) {
        Alert.alert(
          t.profileUpdated,
          t.emailVerificationMessage
        );
      } else if (anyProfileChange) {
        Alert.alert(
          t.profileUpdated,
          t.profileUpdatedMessage
        );
      } else {
        Alert.alert(
          t.settingsSaved,
          t.settingsSavedMessage
        );
      }
    } catch (error) {
      console.log(
        "Error:",
        error
      );

      Alert.alert(
        t.error,
        error?.message ||
          t.unableToSaveChanges
      );
    } finally {
      setSaving(false);
    }
  };

  const abrirNotificaciones = () => {
    router.push({
      pathname: "/notifications",
      params: {
        from: "/profile",
      },
    });
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
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={
            Platform.OS === "ios"
              ? "padding"
              : "height"
          }
        >
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

                paddingHorizontal:
                  isSmall
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

                  position: "absolute",
                  left: 0,
                  right: 0,
                  textAlign: "center",

                  transform: [
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
              {t.editMyProfile}
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
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="bell-circle-outline"
                size={35 * scale}
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

                <View
                  style={styles.photoContainer}
                >
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
                    onPress={
                      changePhoto
                    }
                  >
                    <MaterialCommunityIcons
                      name="camera-outline"
                      size={
                        16 * scale
                      }
                      color={
                        COLORS.white
                      }
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
                  {username ||
                    t.user}
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

                <View
                  style={styles.section}
                >
                  <Text
                    style={[
                      styles.sectionTitle,
                      {
                        fontSize:
                          21 * scale,
                      },
                    ]}
                  >
                    {
                      t.accountSettings
                    }
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
                    {t.username}
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
                    placeholder={
                      t.username
                    }
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
                    {t.phoneNumber}
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
                    onChangeText={
                      setPhone
                    }
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
                    {t.emailAddress}
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
                    onChangeText={
                      setEmail
                    }
                    placeholder="email@gmail.com"
                    placeholderTextColor="#777"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />

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
                        {
                          t.updateProfile
                        }
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>

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
          {NAV.map(
            (item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.navItem}
                activeOpacity={0.7}
                onPress={() =>
                  router.push(
                    item.route
                  )
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
                  color={
                    COLORS.white
                  }
                />
              </TouchableOpacity>
            )
          )}
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
    alignItems: "center",
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