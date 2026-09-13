import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

export default function PrivacyScreen({ navigation }) {
  const { width, height } = useWindowDimensions();

  const isSmallScreen = width < 360;
  const isMediumScreen = width >= 360 && width < 600;
  const isTablet = width >= 600;

  const scale = isSmallScreen
    ? 0.85
    : isMediumScreen
    ? 1
    : isTablet
    ? 1.15
    : 1.25;

  const verticalScale = (size) => Math.round(size * (height / 800));

  const horizontalPadding = isSmallScreen
    ? 16
    : isMediumScreen
    ? 22
    : isTablet
    ? 40
    : 50;

  const sectionVerticalPadding = isTablet ? verticalScale(14) : verticalScale(8);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#071426" barStyle="light-content" />

      <View style={styles.screen}>
        {/* Header */}
        <View style={[styles.header, { height: verticalScale(95) }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={Math.round(32 * scale)}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { fontSize: Math.round(22 * scale) }]}>
              Privacy Policy
            </Text>
            <Text style={[styles.headerSubtitle, { fontSize: Math.round(12 * scale) }]}>
              Everything you need to know
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.bellButton,
              {
                width: 42 * scale,
                height: 42 * scale,
                borderRadius: (42 * scale) / 2,
              },
            ]}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="bell-outline"
              size={Math.round(24 * scale)}
              color="#397468"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.main}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.content,
              {
                paddingHorizontal: horizontalPadding,
                paddingTop: verticalScale(20),
                paddingBottom: verticalScale(20),
              },
            ]}
          >
            <View style={styles.innerContainer}>
              <Text style={[styles.mainTitle, { fontSize: Math.round(22 * scale) }]}>
                Your Privacy Matters
              </Text>

              <View
                style={[
                  styles.banner,
                  {
                    paddingVertical: verticalScale(14),
                    paddingHorizontal: horizontalPadding / 1.5,
                    marginBottom: verticalScale(12),
                  },
                ]}
              >
                <Text
                  style={[styles.bannerTitle, { fontSize: Math.round(15 * scale) }]}
                >
                  Your Privacy is Important
                </Text>
                <Text
                  style={[
                    styles.bannerSubtitle,
                    {
                      fontSize: Math.round(12 * scale),
                      lineHeight: Math.round(17 * scale),
                    },
                  ]}
                >
                  At GrowMaint, we protect your information and give you
                  transparency about how we use it.
                </Text>
              </View>

              <View style={[styles.section, { paddingVertical: sectionVerticalPadding }]}>
                <View style={[styles.iconWrapper, { width: 36 * scale }]}>
                  <Feather
                    name="user"
                    size={Math.round(24 * scale)}
                    color="#071426"
                  />
                </View>
                <View style={styles.textWrapper}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      {
                        fontSize: Math.round(14 * scale),
                        lineHeight: Math.round(19 * scale),
                      },
                    ]}
                  >
                    What information do we collect?
                  </Text>
                  <Text
                    style={[
                      styles.sectionText,
                      {
                        fontSize: Math.round(12 * scale),
                        lineHeight: Math.round(17 * scale),
                      },
                    ]}
                  >
                    We collect information that you provide directly, such as your
                    contact details and account information.
                  </Text>
                </View>
              </View>

              <View style={[styles.divider, { marginLeft: 36 * scale + 10 }]} />

              <View style={[styles.section, { paddingVertical: sectionVerticalPadding }]}>
                <View style={[styles.iconWrapper, { width: 36 * scale }]}>
                  <Feather
                    name="search"
                    size={Math.round(24 * scale)}
                    color="#071426"
                  />
                </View>
                <View style={styles.textWrapper}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      {
                        fontSize: Math.round(14 * scale),
                        lineHeight: Math.round(19 * scale),
                      },
                    ]}
                  >
                    How do we use your information?
                  </Text>
                  <Text
                    style={[
                      styles.sectionText,
                      {
                        fontSize: Math.round(12 * scale),
                        lineHeight: Math.round(17 * scale),
                      },
                    ]}
                  >
                    We use your information to provide and improve our services,
                    personalize your experience, and comply with our legal
                    obligations.
                  </Text>
                </View>
              </View>

              <View style={[styles.divider, { marginLeft: 36 * scale + 10 }]} />

              <View style={[styles.section, { paddingVertical: sectionVerticalPadding }]}>
                <View style={[styles.iconWrapper, { width: 36 * scale }]}>
                  <Feather
                    name="lock"
                    size={Math.round(24 * scale)}
                    color="#071426"
                  />
                </View>
                <View style={styles.textWrapper}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      {
                        fontSize: Math.round(14 * scale),
                        lineHeight: Math.round(19 * scale),
                      },
                    ]}
                  >
                    How do we protect your data?
                  </Text>
                  <Text
                    style={[
                      styles.sectionText,
                      {
                        fontSize: Math.round(12 * scale),
                        lineHeight: Math.round(17 * scale),
                      },
                    ]}
                  >
                    We implement technical and organizational measures to protect
                    your data against unauthorized access, loss, or misuse.
                  </Text>
                </View>
              </View>

              <View style={[styles.divider, { marginLeft: 36 * scale + 10 }]} />

              <View style={[styles.section, { paddingVertical: sectionVerticalPadding }]}>
                <View style={[styles.iconWrapper, { width: 36 * scale }]}>
                  <Feather
                    name="users"
                    size={Math.round(24 * scale)}
                    color="#071426"
                  />
                </View>
                <View style={styles.textWrapper}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      {
                        fontSize: Math.round(14 * scale),
                        lineHeight: Math.round(19 * scale),
                      },
                    ]}
                  >
                    Who do we share your information with?
                  </Text>
                  <Text
                    style={[
                      styles.sectionText,
                      {
                        fontSize: Math.round(12 * scale),
                        lineHeight: Math.round(17 * scale),
                      },
                    ]}
                  >
                    We do not share your personal information with third parties,
                    except when necessary to provide the service or when legally
                    required.
                  </Text>
                </View>
              </View>

              <View style={[styles.divider, { marginLeft: 36 * scale + 10 }]} />

              <View style={[styles.section, { paddingVertical: sectionVerticalPadding }]}>
                <View style={[styles.iconWrapper, { width: 36 * scale }]}>
                  <MaterialCommunityIcons
                    name="scale-balance"
                    size={Math.round(25 * scale)}
                    color="#071426"
                  />
                </View>
                <View style={styles.textWrapper}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      {
                        fontSize: Math.round(14 * scale),
                        lineHeight: Math.round(19 * scale),
                      },
                    ]}
                  >
                    Your rights
                  </Text>
                  <Text
                    style={[
                      styles.sectionText,
                      {
                        fontSize: Math.round(12 * scale),
                        lineHeight: Math.round(17 * scale),
                      },
                    ]}
                  >
                    You have the right to access, correct, delete, or limit the use
                    of your personal information. You can exercise your rights at
                    any time.
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={[styles.bottomBar, { height: verticalScale(72) }]}>
            <TouchableOpacity style={styles.navButton} activeOpacity={0.7}>
              <MaterialCommunityIcons
                name="home-outline"
                size={Math.round(28 * scale)}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton} activeOpacity={0.7}>
              <MaterialCommunityIcons
                name="chart-box-outline"
                size={Math.round(28 * scale)}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton} activeOpacity={0.7}>
              <MaterialCommunityIcons
                name="swap-horizontal"
                size={Math.round(30 * scale)}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton} activeOpacity={0.7}>
              <MaterialCommunityIcons
                name="layers-outline"
                size={Math.round(28 * scale)}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton} activeOpacity={0.7}>
              <MaterialCommunityIcons
                name="account-outline"
                size={Math.round(28 * scale)}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#071426",
  },

  screen: {
    flex: 1,
    backgroundColor: "#071426",
  },

  header: {
    width: "100%",
    backgroundColor: "#071426",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
  },

  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
  },

  headerCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  headerSubtitle: {
    color: "#FFFFFF",
    marginTop: 2,
  },

  bellButton: {
    backgroundColor: "#E2F5E9",
    alignItems: "center",
    justifyContent: "center",
  },

  main: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: "hidden",
  },

  content: {
    flexGrow: 1,
    justifyContent: "space-between",
  },

  innerContainer: {
    flex: 1,
    justifyContent: "space-between",
  },

  mainTitle: {
    textAlign: "center",
    color: "#263B3D",
    fontWeight: "800",
    marginBottom: 8,
  },

  banner: {
    backgroundColor: "#2BB3CA",
    borderRadius: 15,
    alignItems: "center",
  },

  bannerTitle: {
    color: "#FFFFFF",
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 4,
  },

  bannerSubtitle: {
    color: "#FFFFFF",
    textAlign: "center",
  },

  section: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  iconWrapper: {
    alignItems: "center",
    justifyContent: "flex-start",
    marginRight: 10,
    marginTop: 2,
  },

  textWrapper: {
    flex: 1,
  },

  sectionTitle: {
    color: "#111111",
    fontWeight: "800",
    marginBottom: 3,
  },

  sectionText: {
    color: "#555555",
  },

  divider: {
    height: 1.5,
    backgroundColor: "#42B7C8",
  },

  bottomBar: {
    width: "100%",
    backgroundColor: "#2BB3CA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopLeftRadius: 50,
  },

  navButton: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});