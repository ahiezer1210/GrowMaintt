import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Devices() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.top}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>

          <Text style={styles.title}>Linked devices</Text>

          <View style={{ width: 28 }} />
        </View>
      </View>

      <View style={styles.curve} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Your devices</Text>

        <View style={styles.deviceCard}>
          <View style={styles.deviceIcon}>
            <Ionicons name="phone-portrait-outline" size={28} color="#3A7AFE" />
          </View>

          <View style={styles.deviceInfo}>
            <Text style={styles.deviceName}>My device</Text>

            <Text style={styles.deviceDetails}>
              Samsung A06{"\n"}El Salvador
            </Text>

            <View style={styles.status}>
              <View style={styles.activeDot} />
              <Text style={styles.activeText}>Active now</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.unlinkButton}>
            <Text style={styles.unlinkText}>Unlink</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.deviceCard}>
          <View style={styles.deviceIcon}>
            <Ionicons name="laptop-outline" size={28} color="#3A7AFE" />
          </View>

          <View style={styles.deviceInfo}>
            <Text style={styles.deviceName}>Windows 11</Text>

            <Text style={styles.deviceDetails}>
              El Salvador{"\n"}Chrome · Windows
            </Text>

            <View style={styles.status}>
              <View style={styles.dot} />
              <Text style={styles.lastActive}>Last active: yesterday</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.unlinkButton}>
            <Text style={styles.unlinkText}>Unlink</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.deviceCard}>
          <View style={styles.deviceIcon}>
            <Ionicons name="phone-portrait-outline" size={28} color="#3A7AFE" />
          </View>

          <View style={styles.deviceInfo}>
            <Text style={styles.deviceName}>Samsung Galaxy A06</Text>

            <Text style={styles.deviceDetails}>
              Sign in: 12/01{"\n"}El Salvador
            </Text>

            <View style={styles.status}>
              <View style={styles.dot} />
              <Text style={styles.lastActive}>Last active: 3 months ago</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.unlinkButton}>
            <Text style={styles.unlinkText}>Unlink</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="shield-checkmark-outline" size={25} color="#3A7AFE" />

          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Keep your account secure</Text>

            <Text style={styles.infoText}>
              If you don't recognize a device, unlink it to protect your
              account.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    height: 190,
    backgroundColor: "#081023",
    paddingTop: 55,
    paddingHorizontal: 24,
  },

  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    color: "white",
    fontSize: 27,
    fontWeight: "700",
  },

  curve: {
    position: "absolute",
    top: 165,
    width: "100%",
    height: 75,
    backgroundColor: "#F7F9FC",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },

  content: {
    flex: 1,
  },

  contentContainer: {
    padding: 20,
    paddingTop: 15,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    marginBottom: 15,
  },

  deviceCard: {
    minHeight: 110,
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  deviceIcon: {
    width: 55,
    height: 55,
    borderRadius: 16,
    backgroundColor: "#EEF4FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  deviceInfo: {
    flex: 1,
  },

  deviceName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
  },

  deviceDetails: {
    fontSize: 13,
    color: "#777",
    lineHeight: 18,
    marginTop: 3,
  },

  status: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#999",
    marginRight: 6,
  },

  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#25B7D3",
    marginRight: 6,
  },

  activeText: {
    fontSize: 12,
    color: "#259e8c",
    fontWeight: "600",
  },

  lastActive: {
    fontSize: 12,
    color: "#030101",
  },

  unlinkButton: {
    backgroundColor: "#FFF1F1",
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginLeft: 8,
  },

  unlinkText: {
    color: "#081023",
    fontSize: 12,
    fontWeight: "700",
  },

  infoCard: {
    backgroundColor: "#EEF4FF",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    marginTop: 8,
  },

  infoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#222",
    marginBottom: 5,
  },

  infoText: {
    fontSize: 12,
    lineHeight: 18,
    color: "#666",
  },
});
