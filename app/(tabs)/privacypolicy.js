import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useAppSettings } from "../../context/Appsettings";

export default function PrivacyScreen() {
  const { width, height } = useWindowDimensions();
  const { t } = useAppSettings();

  const small = width < 350;
  const tablet = width >= 600;

  const scale = (value, tabletValue) =>
    tablet
      ? (tabletValue ?? value * 1.35)
      : small
      ? value * 0.9
      : value;

  const verticalScale = (size) => Math.round(size * (height / 800));

  const sectionVerticalPadding = tablet
    ? verticalScale(14)
    : verticalScale(8);

  const navItems = [
    {
      icon: "home-outline",
      route: "/home",
    },
    {
      icon: "chart-box-outline",
      route: "/historial",
    },
    {
      icon: "swap-horizontal",
      route: "/expensesManagement",
    },
    {
      icon: "layers-outline",
      route: "/currentgoal",
    },
    {
      icon: "account-outline",
      route: "/profile",
    },
  ];

  const abrirNotificaciones = () => {
    router.push({
      pathname: "/notifications",
      params: {
        from: "/privacypolicy",
      },
    });
  };

  return (
    <View style={styles.screen}>
      <StatusBar
        translucent
        backgroundColor="#071426"
        barStyle="light-content"
      />

      <View style={styles.app}>
        {/* HEADER IGUAL A LOGOUT */}
        <View
          style={[
            styles.header,
            {
              height:
                118 *
                (small
                  ? 0.85
                  : tablet
                  ? 1.15
                  : 1),
              paddingHorizontal: small
                ? 18
                : tablet
                ? 45
                : 25,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.back,
              {
                transform: [
                  {
                    translateY:
                      4 *
                      (small
                        ? 0.85
                        : tablet
                        ? 1.15
                        : 1),
                  },
                ],
              },
            ]}
            onPress={() => router.replace("/profile")} // 👈 CAMBIO
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={
                35 *
                (small
                  ? 0.85
                  : tablet
                  ? 1.15
                  : 1)
              }
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <Text
            style={[
              styles.headerTitle,
              {
                fontSize:
                  25 *
                  (small
                    ? 0.85
                    : tablet
                    ? 1.15
                    : 1),
                transform: [
                  {
                    translateX:
                      7 *
                      (small
                        ? 0.85
                        : tablet
                        ? 1.15
                        : 1),
                  },
                  {
                    translateY:
                      1 *
                      (small
                        ? 0.85
                        : tablet
                        ? 1.15
                        : 1),
                  },
                ],
              },
            ]}
          >
            {t.privacyPolicy}
          </Text>

          <TouchableOpacity
            style={[
              styles.headerBell,
              {
                transform: [
                  {
                    translateY:
                      4 *
                      (small
                        ? 0.85
                        : tablet
                        ? 1.15
                        : 1),
                  },
                ],
              },
            ]}
            onPress={abrirNotificaciones}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="bell-circle-outline"
              size={
                35 *
                (small
                  ? 0.85
                  : tablet
                  ? 1.15
                  : 1)
              }
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.main,
            {
              borderTopLeftRadius: tablet
                ? 55
                : small
                ? 35
                : 45,
              borderTopRightRadius: tablet
                ? 55
                : small
                ? 35
                : 45,
            },
          ]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.content,
              {
                width: tablet ? "85%" : "100%",
                maxWidth: tablet ? 700 : undefined,
                paddingHorizontal: tablet
                  ? 0
                  : small
                  ? 22
                  : 30,
                paddingTop: tablet
                  ? 35
                  : small
                  ? 20
                  : 28,
                paddingBottom: 100,
              },
            ]}
          >
            <View style={styles.innerContainer}>
              <Text
                style={[
                  styles.mainTitle,
                  {
                    fontSize: Math.round(
                      scale(22, 28)
                    ),
                  },
                ]}
              >
                {t.yourPrivacyMatters}
              </Text>

              <View
                style={[
                  styles.banner,
                  {
                    paddingVertical: verticalScale(14),
                    paddingHorizontal:
                      (tablet ? 40 : small ? 22 : 30) / 1.5,
                    marginBottom: verticalScale(12),
                  },
                ]}
              >
                <Text
                  style={[
                    styles.bannerTitle,
                    {
                      fontSize: Math.round(
                        scale(15, 17)
                      ),
                    },
                  ]}
                >
                  {t.yourPrivacyIsImportant}
                </Text>

                <Text
                  style={[
                    styles.bannerSubtitle,
                    {
                      fontSize: Math.round(
                        scale(12, 14)
                      ),
                      lineHeight: Math.round(
                        scale(17, 21)
                      ),
                    },
                  ]}
                >
                  {t.privacyBannerDescription}
                </Text>
              </View>

      
              <View
                style={[
                  styles.section,
                  {
                    paddingVertical:
                      sectionVerticalPadding,
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconWrapper,
                    {
                      width:
                        36 *
                        (small
                          ? 0.9
                          : tablet
                          ? 1.15
                          : 1),
                    },
                  ]}
                >
                  <Feather
                    name="user"
                    size={Math.round(
                      24 *
                      (small
                        ? 0.9
                        : tablet
                        ? 1.15
                        : 1)
                    )}
                    color="#071426"
                  />
                </View>

                <View style={styles.textWrapper}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      {
                        fontSize: Math.round(
                          scale(14, 16)
                        ),
                        lineHeight: Math.round(
                          scale(19, 22)
                        ),
                      },
                    ]}
                  >
                    {t.whatInformationCollect}
                  </Text>

                  <Text
                    style={[
                      styles.sectionText,
                      {
                        fontSize: Math.round(
                          scale(12, 14)
                        ),
                        lineHeight: Math.round(
                          scale(17, 20)
                        ),
                      },
                    ]}
                  >
                    {t.whatInformationCollectDescription}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.divider,
                  {
                    marginLeft:
                      36 *
                        (small
                          ? 0.9
                          : tablet
                          ? 1.15
                          : 1) +
                      10,
                  },
                ]}
              />

          
              <View
                style={[
                  styles.section,
                  {
                    paddingVertical:
                      sectionVerticalPadding,
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconWrapper,
                    {
                      width:
                        36 *
                        (small
                          ? 0.9
                          : tablet
                          ? 1.15
                          : 1),
                    },
                  ]}
                >
                  <Feather
                    name="search"
                    size={Math.round(
                      24 *
                      (small
                        ? 0.9
                        : tablet
                        ? 1.15
                        : 1)
                    )}
                    color="#071426"
                  />
                </View>

                <View style={styles.textWrapper}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      {
                        fontSize: Math.round(
                          scale(14, 16)
                        ),
                        lineHeight: Math.round(
                          scale(19, 22)
                        ),
                      },
                    ]}
                  >
                    {t.howUseInformation}
                  </Text>

                  <Text
                    style={[
                      styles.sectionText,
                      {
                        fontSize: Math.round(
                          scale(12, 14)
                        ),
                        lineHeight: Math.round(
                          scale(17, 20)
                        ),
                      },
                    ]}
                  >
                    {t.howUseInformationDescription}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.divider,
                  {
                    marginLeft:
                      36 *
                        (small
                          ? 0.9
                          : tablet
                          ? 1.15
                          : 1) +
                      10,
                  },
                ]}
              />

        
              <View
                style={[
                  styles.section,
                  {
                    paddingVertical:
                      sectionVerticalPadding,
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconWrapper,
                    {
                      width:
                        36 *
                        (small
                          ? 0.9
                          : tablet
                          ? 1.15
                          : 1),
                    },
                  ]}
                >
                  <Feather
                    name="lock"
                    size={Math.round(
                      24 *
                      (small
                        ? 0.9
                        : tablet
                        ? 1.15
                        : 1)
                    )}
                    color="#071426"
                  />
                </View>

                <View style={styles.textWrapper}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      {
                        fontSize: Math.round(
                          scale(14, 16)
                        ),
                        lineHeight: Math.round(
                          scale(19, 22)
                        ),
                      },
                    ]}
                  >
                    {t.howProtectData}
                  </Text>

                  <Text
                    style={[
                      styles.sectionText,
                      {
                        fontSize: Math.round(
                          scale(12, 14)
                        ),
                        lineHeight: Math.round(
                          scale(17, 20)
                        ),
                      },
                    ]}
                  >
                    {t.howProtectDataDescription}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.divider,
                  {
                    marginLeft:
                      36 *
                        (small
                          ? 0.9
                          : tablet
                          ? 1.15
                          : 1) +
                      10,
                  },
                ]}
              />

  
              <View
                style={[
                  styles.section,
                  {
                    paddingVertical:
                      sectionVerticalPadding,
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconWrapper,
                    {
                      width:
                        36 *
                        (small
                          ? 0.9
                          : tablet
                          ? 1.15
                          : 1),
                    },
                  ]}
                >
                  <Feather
                    name="users"
                    size={Math.round(
                      24 *
                      (small
                        ? 0.9
                        : tablet
                        ? 1.15
                        : 1)
                    )}
                    color="#071426"
                  />
                </View>

                <View style={styles.textWrapper}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      {
                        fontSize: Math.round(
                          scale(14, 16)
                        ),
                        lineHeight: Math.round(
                          scale(19, 22)
                        ),
                      },
                    ]}
                  >
                    {t.whoShareInformation}
                  </Text>

                  <Text
                    style={[
                      styles.sectionText,
                      {
                        fontSize: Math.round(
                          scale(12, 14)
                        ),
                        lineHeight: Math.round(
                          scale(17, 20)
                        ),
                      },
                    ]}
                  >
                    {t.whoShareInformationDescription}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.divider,
                  {
                    marginLeft:
                      36 *
                        (small
                          ? 0.9
                          : tablet
                          ? 1.15
                          : 1) +
                      10,
                  },
                ]}
              />

         
              <View
                style={[
                  styles.section,
                  {
                    paddingVertical:
                      sectionVerticalPadding,
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconWrapper,
                    {
                      width:
                        36 *
                        (small
                          ? 0.9
                          : tablet
                          ? 1.15
                          : 1),
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="scale-balance"
                    size={Math.round(
                      25 *
                      (small
                        ? 0.9
                        : tablet
                        ? 1.15
                        : 1)
                    )}
                    color="#071426"
                  />
                </View>

                <View style={styles.textWrapper}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      {
                        fontSize: Math.round(
                          scale(14, 16)
                        ),
                        lineHeight: Math.round(
                          scale(19, 22)
                        ),
                      },
                    ]}
                  >
                    {t.yourRights}
                  </Text>

                  <Text
                    style={[
                      styles.sectionText,
                      {
                        fontSize: Math.round(
                          scale(12, 14)
                        ),
                        lineHeight: Math.round(
                          scale(17, 20)
                        ),
                      },
                    ]}
                  >
                    {t.yourRightsDescription}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

       
          <View
            style={[
              styles.bottomBar,
              {
                height:
                  65 *
                  (small
                    ? 0.85
                    : tablet
                    ? 1.15
                    : 1),
                borderTopLeftRadius:
                  78 *
                  (small
                    ? 0.85
                    : tablet
                    ? 1.15
                    : 1),
              },
            ]}
          >
            {navItems.map((item) => (
              <TouchableOpacity
                key={item.route}
                style={styles.navItem}
                activeOpacity={0.8}
                onPress={() => router.push(item.route)}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={
                    item.icon === "swap-horizontal"
                      ? 37 *
                        (small
                          ? 0.85
                          : tablet
                          ? 1.15
                          : 1)
                      : 35 *
                        (small
                          ? 0.85
                          : tablet
                          ? 1.15
                          : 1)
                  }
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFF",
  },

  app: {
    flex: 1,
    backgroundColor: "#071426",
  },

  header: {
    width: "100%",
    backgroundColor: "#071426",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  back: {
    width: 30,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  headerTitle: {
    color: "#FFF",
    fontWeight: "700",
  },

  headerBell: {
    justifyContent: "center",
  },

  main: {
    flex: 1,
    width: "100%",
    backgroundColor: "#FFF",
    overflow: "hidden",
  },

  content: {
    alignItems: "center",
    alignSelf: "center",
  },

  innerContainer: {
    width: "100%",
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
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#25B5D1",
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