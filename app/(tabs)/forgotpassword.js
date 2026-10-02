import { MaterialCommunityIcons } from "@expo/vector-icons";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { auth } from "../../firebaseConfig";

export default function RecuperarContrasena({ navigation }) {
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

  const s = (value) => Math.round(value * scale);

  const [correo, setCorreo] = useState("");
  const [cargando, setCargando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const recuperarContrasena = async () => {
    const email = correo.trim();

    if (!email) {
      Alert.alert(
        "Empty field",
        "Please enter your email again."
      );
      return;
    }

    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoCorreo.test(email)) {
      Alert.alert(
        "Incorrect email",
        "Please enter a valid email."
      );
      return;
    }

    try {
      setCargando(true);

      await sendPasswordResetEmail(auth, email);

      setEnviado(true);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        Alert.alert(
          "Email not found",
          "We couldn't find an account with that email."
        );
      } else if (error.code === "auth/invalid-email") {
        Alert.alert(
          "Incorrect email",
          "The email entered is incorrect."
        );
      } else if (error.code === "auth/too-many-requests") {
        Alert.alert(
          "Too many attempts",
          "Please wait a few minutes before trying again."
        );
      } else if (
        error.code === "auth/network-request-failed"
      ) {
        Alert.alert(
          "No connection",
          "Could not connect to Firebase. Check your Internet connection."
        );
      } else {
        Alert.alert(
          "Error",
          "The recovery email couldn't be sent. Please try again."
        );
      }
    } finally {
      setCargando(false);
    }
  };

  const volverAIntentar = () => {
    setCorreo("");
    setEnviado(false);
  };

  return (
    <SafeAreaView
      style={styles.safe}
      edges={["left", "right"]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="#071426"
      />

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
              height: s(118),
              paddingHorizontal: horizontalPadding,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.botonRegresar,
              {
                left: s(15),
                top: s(34),
                width: s(55),
                height: s(55),
              },
            ]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={s(35)}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <Text
            style={[
              styles.titulo,
              {
                fontSize: s(25),
                lineHeight: s(29),
              },
            ]}
          >
            Password
            {"\n"}
            Recovery
          </Text>
        </View>

      
        <View
          style={[
            styles.whiteContainer,
            {
              borderTopLeftRadius: s(45),
              borderTopRightRadius: s(45),
            },
          ]}
        >
          <ScrollView
            style={styles.whiteScroll}
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingHorizontal: horizontalPadding,
                paddingTop: s(40),
                paddingBottom: s(250),
              },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            alwaysBounceVertical={true}
            overScrollMode="always"
          >
            <View
              style={[
                styles.iconContainer,
                {
                  height: s(155),
                  marginBottom: s(10),
                },
              ]}
            >
              <MaterialCommunityIcons
                name="lock-reset"
                size={s(125)}
                color="#252833"
              />

              <View
                style={[
                  styles.checkCircle,
                  {
                    top: s(8),
                    width: s(45),
                    height: s(45),
                    borderRadius: s(23),
                    borderWidth: s(5),
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="check"
                  size={s(21)}
                  color="#FFFFFF"
                />
              </View>
            </View>

            {!enviado ? (
              <>
                <Text
                  style={[
                    styles.label,
                    {
                      fontSize: s(17),
                      marginBottom: s(10),
                    },
                  ]}
                >
                  User or email
                </Text>

                <TextInput
                  style={[
                    styles.input,
                    {
                      height: s(58),
                      borderRadius: s(18),
                      paddingHorizontal: s(18),
                      fontSize: s(16),
                    },
                  ]}
                  value={correo}
                  onChangeText={setCorreo}
                  placeholder="Enter your email"
                  placeholderTextColor="#A8ADB5"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!cargando}
                />

                <Text
                  style={[
                    styles.descripcion,
                    {
                      fontSize: s(14),
                      marginTop: s(22),
                      marginBottom: s(25),
                    },
                  ]}
                >
                  A link will be sent to your email
                </Text>

                <TouchableOpacity
                  style={[
                    styles.botonSiguiente,
                    {
                      height: s(58),
                      borderRadius: s(30),
                      marginTop: s(10),
                    },
                    cargando &&
                      styles.botonDeshabilitado,
                  ]}
                  onPress={recuperarContrasena}
                  disabled={cargando}
                >
                  {cargando ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text
                      style={[
                        styles.textoSiguiente,
                        {
                          fontSize: s(18),
                        },
                      ]}
                    >
                      Next
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.botonIntentar,
                    {
                      paddingVertical: s(12),
                    },
                  ]}
                  onPress={() => navigation.goBack()}
                  disabled={cargando}
                >
                  <Text
                    style={[
                      styles.textoIntentar,
                      {
                        fontSize: s(15),
                      },
                    ]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <View
                style={[
                  styles.confirmacion,
                  {
                    paddingTop: s(5),
                  },
                ]}
              >
                <View
                  style={[
                    styles.checkGrande,
                    {
                      width: s(90),
                      height: s(90),
                      borderRadius: s(45),
                      marginBottom: s(18),
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="email-check-outline"
                    size={s(55)}
                    color="#38BDF8"
                  />
                </View>

                <Text
                  style={[
                    styles.tituloConfirmacion,
                    {
                      fontSize: s(25),
                      marginBottom: s(12),
                    },
                  ]}
                >
                  Email sent!
                </Text>

                <Text
                  style={[
                    styles.mensajeConfirmacion,
                    {
                      fontSize: s(15),
                      lineHeight: s(22),
                    },
                  ]}
                >
                  We've sent a link to recover your password to:
                </Text>

                <Text
                  style={[
                    styles.correoConfirmacion,
                    {
                      fontSize: s(16),
                      marginTop: s(8),
                      marginBottom: s(12),
                    },
                  ]}
                >
                  {correo}
                </Text>

                <Text
                  style={[
                    styles.mensajePequeno,
                    {
                      fontSize: s(13),
                      lineHeight: s(19),
                      marginBottom: s(15),
                    },
                  ]}
                >
                  Check your inbox and also the spam folder.
                </Text>

                <TouchableOpacity
                  style={styles.botonSiguiente}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={styles.textoSiguiente}>
                    Back to login
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.botonIntentar}
                  onPress={volverAIntentar}
                >
                  <Text style={styles.textoIntentar}>
                    Use another email.
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#071426",
  },

  header: {
    height: 118,
    backgroundColor: "#071426",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 25,
  },

  botonRegresar: {
    position: "absolute",
    left: 15,
    top: 34,
    width: 55,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    elevation: 10,
  },

  titulo: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    transform: [
      {
        translateX: 5,
      },
      {
        translateY: 5,
      },
    ],
  },

  whiteContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    overflow: "hidden",
  },

  whiteScroll: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 250,
  },

  iconContainer: {
    height: 155,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  checkCircle: {
    position: "absolute",
    right: "25%",
    top: 8,
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#252833",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 5,
    borderColor: "#FFFFFF",
  },

  label: {
    fontSize: 17,
    color: "#555B66",
    fontWeight: "600",
    marginBottom: 10,
  },

  input: {
    height: 58,
    borderWidth: 1.5,
    borderColor: "#C8CCD5",
    borderRadius: 18,
    paddingHorizontal: 18,
    fontSize: 16,
    color: "#252833",
    backgroundColor: "#FFFFFF",
  },

  descripcion: {
    textAlign: "center",
    color: "#777C86",
    fontSize: 14,
    marginTop: 22,
    marginBottom: 25,
  },

  botonIntentar: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },

  textoIntentar: {
    color: "#777C86",
    fontSize: 15,
    fontWeight: "500",
  },

  botonSiguiente: {
    height: 58,
    backgroundColor: "#45C4E8",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  botonDeshabilitado: {
    opacity: 0.7,
  },

  textoSiguiente: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  confirmacion: {
    alignItems: "center",
    paddingTop: 5,
  },

  checkGrande: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#E8F9FD",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  tituloConfirmacion: {
    fontSize: 25,
    fontWeight: "700",
    color: "#252833",
    marginBottom: 12,
  },

  mensajeConfirmacion: {
    textAlign: "center",
    color: "#707680",
    fontSize: 15,
    lineHeight: 22,
  },

  correoConfirmacion: {
    color: "#252833",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 12,
    textAlign: "center",
  },

  mensajePequeno: {
    textAlign: "center",
    color: "#8A8F98",
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 15,
  },
});