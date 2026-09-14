import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../../firebaseConfig";

export default function VerifyAge() {
  const [documentUri, setDocumentUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingPhoto, setLoadingPhoto] = useState(true);
  const [refreshKey, setRefreshKey] = useState(Date.now());

  useEffect(() => {
    loadSavedPhoto();
  }, []);

  const loadSavedPhoto = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        setLoadingPhoto(false);
        return;
      }

      const userRef = doc(db, "Users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();

        if (data.identityDocumentUrl) {
          setDocumentUri(data.identityDocumentUrl);
          setRefreshKey(Date.now());
        }
      }
    } catch (error) {
      console.log("Error cargando documento:", error);
    } finally {
      setLoadingPhoto(false);
    }
  };

  const takePhoto = async () => {
    try {
      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.2,
        base64: true,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const asset = result.assets[0];

        if (asset.base64) {
          const newPhotoUrl =
            `data:image/jpeg;base64,${asset.base64}`;

          setDocumentUri(newPhotoUrl);
          setRefreshKey(Date.now());
        }
      }
    } catch (error) {
      console.log("Error tomando foto:", error);
    }
  };

  const saveDocument = async () => {
    const user = auth.currentUser;

    if (!user || !documentUri) {
      return;
    }

    try {
      setLoading(true);

      const userRef = doc(db, "Users", user.uid);

      await setDoc(
        userRef,
        {
          identityDocumentUrl: documentUri,
          identityDocumentUpdatedAt: new Date(),
        },
        {
          merge: true,
        }
      );

      setRefreshKey(Date.now());

      await loadSavedPhoto();

      router.replace("/(tabs)/home");
    } catch (error) {
      console.log("Error guardando documento:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar
        translucent
        backgroundColor="#0b1624"
        barStyle="light-content"
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/S.Ageconfirmation")}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={22}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Identity Verification
        </Text>

        <View style={{ width: 30 }} />
      </View>

      <View style={styles.main}>
        <Text style={styles.title}>
          Scan your identity document
        </Text>

        <Text style={styles.subtitle}>
          Take a clear photo of your ID card to
          verify that you are 18 years old or older.
        </Text>

        {loadingPhoto ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color="#25B7D3"
            />
          </View>
        ) : !documentUri ? (
          <TouchableOpacity
            style={styles.scanButton}
            onPress={takePhoto}
          >
            <MaterialCommunityIcons
              name="camera"
              size={32}
              color="#FFFFFF"
            />

            <Text style={styles.scanText}>
              Scan Document
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            <Image
              key={refreshKey}
              source={{ uri: documentUri }}
              style={styles.preview}
            />

            <TouchableOpacity
              style={styles.retakeButton}
              onPress={takePhoto}
              disabled={loading}
            >
              <Text style={styles.retakeText}>
                Retake Photo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={saveDocument}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />
              ) : (
                <Text style={styles.continueText}>
                  Continue
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0b1624",
  },

  header: {
    height: 115,
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    width: 41,
    height: 46,
    justifyContent: "center",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "bold",
  },

  main: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0b1624",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 15,
    fontSize: 15,
    textAlign: "center",
    color: "#555",
    lineHeight: 22,
  },

  loadingContainer: {
    marginTop: 90,
  },

  scanButton: {
    marginTop: 50,
    width: 220,
    height: 220,
    borderRadius: 20,
    backgroundColor: "#25B7D3",
    justifyContent: "center",
    alignItems: "center",
  },

  scanText: {
    color: "#FFFFFF",
    fontWeight: "600",
    marginTop: 10,
  },

  preview: {
    width: 320,
    height: 220,
    borderRadius: 15,
    marginTop: 40,
  },

  retakeButton: {
    marginTop: 20,
  },

  retakeText: {
    color: "#25B7D3",
    fontWeight: "600",
  },

  continueButton: {
    marginTop: 30,
    width: 240,
    height: 55,
    borderRadius: 22,
    backgroundColor: "#0b1624",
    justifyContent: "center",
    alignItems: "center",
  },

  continueText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});