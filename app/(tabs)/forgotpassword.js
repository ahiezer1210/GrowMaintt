import { MaterialCommunityIcons } from "@expo/vector-icons";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../../firebaseConfig";

export default function RecuperarContrasena({ navigation }) {
  const [correo, setCorreo] = useState("");
  const [cargando, setCargando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const recuperarContrasena = async () => {
    const email = correo.trim();

    if (!email) {
      Alert.alert(
        "Campo vacío",
        "Por favor, ingresa tu correo electrónico."
      );
      return;
    }

    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoCorreo.test(email)) {
      Alert.alert(
        "Correo inválido",
        "Ingresa un correo electrónico válido."
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
          "Correo no encontrado",
          "No encontramos una cuenta asociada a este correo."
        );
      } else if (error.code === "auth/invalid-email") {
        Alert.alert(
          "Correo inválido",
          "El correo electrónico ingresado no es válido."
        );
      } else if (error.code === "auth/too-many-requests") {
        Alert.alert(
          "Demasiados intentos",
          "Espera unos minutos antes de volver a intentarlo."
        );
      } else if (error.code === "auth/network-request-failed") {
        Alert.alert(
          "Sin conexión",
          "No se pudo conectar con Firebase. Verifica tu conexión a Internet."
        );
      } else {
        Alert.alert(
          "Error",
          "No se pudo enviar el correo de recuperación. Intenta nuevamente."
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.botonRegresar}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={26}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <Text style={styles.titulo}>
          Recuperar{"\n"}Contraseña
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="lock-reset"
            size={125}
            color="#252833"
          />

          <View style={styles.checkCircle}>
            <MaterialCommunityIcons
              name="check"
              size={21}
              color="#FFFFFF"
            />
          </View>
        </View>

        {!enviado ? (
          <>
            <Text style={styles.label}>Usuario o Correo</Text>

            <TextInput
              style={styles.input}
              value={correo}
              onChangeText={setCorreo}
              placeholder="Ingresa tu correo"
              placeholderTextColor="#A8ADB5"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!cargando}
            />

            <Text style={styles.descripcion}>
              Se le enviará un enlace a su correo
            </Text>

            <TouchableOpacity
              style={[
                styles.botonSiguiente,
                cargando && styles.botonDeshabilitado,
              ]}
              onPress={recuperarContrasena}
              disabled={cargando}
            >
              {cargando ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.textoSiguiente}>
                  Siguiente
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botonIntentar}
              onPress={() => navigation.goBack()}
              disabled={cargando}
            >
              <Text style={styles.textoIntentar}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.confirmacion}>
            <View style={styles.checkGrande}>
              <MaterialCommunityIcons
                name="email-check-outline"
                size={55}
                color="#38BDF8"
              />
            </View>

            <Text style={styles.tituloConfirmacion}>
              ¡Correo enviado!
            </Text>

            <Text style={styles.mensajeConfirmacion}>
              Hemos enviado un enlace para recuperar tu
              contraseña a:
            </Text>

            <Text style={styles.correoConfirmacion}>
              {correo}
            </Text>

            <Text style={styles.mensajePequeno}>
              Revisa tu bandeja de entrada y también la
              carpeta de spam.
            </Text>

            <TouchableOpacity
              style={styles.botonSiguiente}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.textoSiguiente}>
                Volver al inicio
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botonIntentar}
              onPress={volverAIntentar}
            >
              <Text style={styles.textoIntentar}>
                Usar otro correo
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
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

  botonRegresar: {
    position: "absolute",
    left: 25,
    top: 55,
    width: 45,
    height: 45,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
  },

  titulo: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 40,
  },

  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 30,
    paddingTop: 40,
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