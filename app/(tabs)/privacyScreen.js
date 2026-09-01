import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";

export default function PrivacyScreen({ navigation }) {
  const { height } = useWindowDimensions();

  const scale = (size) => {
    const baseHeight = 800;
    return Math.round(size * (height / baseHeight));
  };

  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor="#071426" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={34} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Privacy Policy</Text>

          <Text style={styles.headerSubtitle}>Everything you need to know</Text>
        </View>

        <View style={styles.bellButton}>
          <MaterialCommunityIcons
            name="bell-outline"
            size={27}
            color="#397468"
          />
        </View>
      </View>

      <View style={styles.main}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            {
              paddingBottom: scale(25),
            },
          ]}
        >
          <Text style={styles.mainTitle}>Your Privacy Matters</Text>

          <View style={styles.banner}>
            <Text style={styles.bannerTitle}>Your Privacy is Important</Text>

            <Text style={styles.bannerSubtitle}>
              At GrowMaint, we protect your information and give you
              transparency about how we use it.
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.iconWrapper}>
              <Feather name="user" size={25} color="#071426" />
            </View>

            <View style={styles.textWrapper}>
              <Text style={styles.sectionTitle}>
                What information do we collect?
              </Text>

              <Text style={styles.sectionText}>
                We collect information that you provide directly, such as your
                contact details and account information.
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <View style={styles.iconWrapper}>
              <Feather name="search" size={25} color="#071426" />
            </View>

            <View style={styles.textWrapper}>
              <Text style={styles.sectionTitle}>
                How do we use your information?
              </Text>

              <Text style={styles.sectionText}>
                We use your information to provide and improve our services,
                personalize your experience, and comply with our legal
                obligations.
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <View style={styles.iconWrapper}>
              <Feather name="lock" size={25} color="#071426" />
            </View>

            <View style={styles.textWrapper}>
              <Text style={styles.sectionTitle}>
                How do we protect your data?
              </Text>

              <Text style={styles.sectionText}>
                We implement technical and organizational measures to protect
                your data against unauthorized access, loss, or misuse.
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <View style={styles.iconWrapper}>
              <Feather name="users" size={25} color="#071426" />
            </View>

            <View style={styles.textWrapper}>
              <Text style={styles.sectionTitle}>
                Who do we share your information with?
              </Text>

              <Text style={styles.sectionText}>
                We do not share your personal information with third parties,
                except when necessary to provide the service or when legally
                required.
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <View style={styles.iconWrapper}>
              <MaterialCommunityIcons
                name="scale-balance"
                size={26}
                color="#071426"
              />
            </View>

            <View style={styles.textWrapper}>
              <Text style={styles.sectionTitle}>Your rights</Text>

              <Text style={styles.sectionText}>
                You have the right to access, correct, delete, or limit the use
                of your personal information. You can exercise your rights at
                any time.
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.navButton}>
            <MaterialCommunityIcons
              name="home-outline"
              size={32}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton}>
            <MaterialCommunityIcons
              name="chart-box-outline"
              size={32}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton}>
            <MaterialCommunityIcons
              name="swap-horizontal"
              size={34}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton}>
            <MaterialCommunityIcons
              name="layers-outline"
              size={32}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton}>
            <MaterialCommunityIcons
              name="account-outline"
              size={32}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#071426",
  },

  header: {
    height: 105,
    width: "100%",
    backgroundColor: "#071426",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
  },

  backButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
  },

  headerCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "800",
  },

  headerSubtitle: {
    color: "#FFFFFF",
    fontSize: 13,
    marginTop: 3,
  },

  bellButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#E2F5E9",
    alignItems: "center",
    justifyContent: "center",
  },

  main: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 42,
    borderTopRightRadius: 42,
    overflow: "hidden",
  },

  content: {
    paddingHorizontal: 25,
    paddingTop: 22,
  },

  mainTitle: {
    textAlign: "center",
    color: "#263B3D",
    fontSize: 23,
    fontWeight: "800",
    marginBottom: 13,
  },

  banner: {
    backgroundColor: "#2BB3CA",
    borderRadius: 15,
    paddingHorizontal: 17,
    paddingVertical: 14,
    marginBottom: 12,
    alignItems: "center",
  },

  bannerTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 5,
  },

  bannerSubtitle: {
    color: "#FFFFFF",
    fontSize: 12,
    lineHeight: 17,
    textAlign: "center",
  },

  section: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 11,
  },

  iconWrapper: {
    width: 38,
    alignItems: "center",
    justifyContent: "flex-start",
    marginRight: 9,
    marginTop: 2,
  },

  textWrapper: {
    flex: 1,
  },

  sectionTitle: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 19,
    marginBottom: 4,
  },

  sectionText: {
    color: "#555555",
    fontSize: 12,
    lineHeight: 17,
  },

  divider: {
    height: 1.5,
    backgroundColor: "#42B7C8",
    marginLeft: 47,
  },

  bottomBar: {
    height: 78,
    width: "100%",
    backgroundColor: "#2BB3CA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopLeftRadius: 70,
  },

  navButton: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
