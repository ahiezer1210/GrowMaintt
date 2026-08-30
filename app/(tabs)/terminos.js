import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
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

const COLORS = {
  blue: "#081023",
  cyan: "#25B7D3",
  gray: "#ACADAD",
  white: "#FFFFFF",
};

export default function TermsScreen() {
  const { width, height } = useWindowDimensions();

  const [accepted, setAccepted] = useState(false);


  const isSmallScreen = width < 350;

  const horizontalPadding = width < 380 ? 20 : 28;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.blue}
      />

      <View style={styles.container}>

     
        <View style={styles.header}>

          
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={28}
              color={COLORS.white}
            />
          </TouchableOpacity>

       
          <Text
            style={[
              styles.headerTitle,
              isSmallScreen && styles.headerTitleSmall,
            ]}
          >
            Terms & Conditions
          </Text>

         
          <TouchableOpacity
            style={styles.profileButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name="person-outline"
              size={22}
              color={COLORS.blue}
            />
          </TouchableOpacity>

        </View>


        <View style={styles.main}>

          
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingHorizontal: horizontalPadding,
              },
            ]}
            showsVerticalScrollIndicator={false}
          >

           

            <Text
              style={[
                styles.intro,
                isSmallScreen && styles.textSmall,
              ]}
            >
              By using our application, you expressly agree to
              these Terms and Conditions. We recommend reading
              them carefully before getting started.
            </Text>


           
            <Text style={styles.heading}>
              1. User Requirements and Account
            </Text>

            <Text style={styles.paragraph}>
              • Age and Accuracy: You must be at least 18 years
              old to use GrowMaint and agree to provide accurate
              and up-to-date information.
            </Text>

            <Text style={styles.paragraph}>
              • Security: You are solely responsible for
              maintaining the confidentiality of your account
              and password, as well as all activities carried
              out through your account.
            </Text>


           

            <Text style={styles.heading}>
              2. Permitted Use of the Platform
            </Text>

            <Text style={styles.paragraph}>
              • Purpose: GrowMaint is a tool designed exclusively
              to help you manage your personal finances.
            </Text>

            <Text style={styles.paragraph}>
              • Prohibitions: It is strictly prohibited to use
              the platform for illegal, fraudulent, or
              unauthorized activities.
            </Text>


            

            <Text style={styles.heading}>
              3. Limitation of Liability
            </Text>

            <Text style={styles.paragraph}>
              • Exclusion of Damages: GrowMaint is not responsible
              for direct or indirect damages resulting from the
              use of the application, except where applicable
              law requires otherwise.
            </Text>


           
            <Text style={styles.heading}>
              4. Changes and Updates
            </Text>

            <Text style={styles.paragraph}>
              • Changes: We reserve the right to update these
              terms at any time. We will notify you of important
              changes directly within the application.
            </Text>

          </ScrollView>


          
          <View
            style={[
              styles.bottom,
              {
                paddingHorizontal: horizontalPadding,
              },
            ]}
          >

            

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setAccepted(!accepted)}
              activeOpacity={0.7}
            >

              <View
                style={[
                  styles.checkbox,
                  accepted && styles.checkboxChecked,
                ]}
              >
                {accepted && (
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color={COLORS.white}
                  />
                )}
              </View>

              <Text style={styles.checkboxText}>
                I accept all terms and conditions
              </Text>

            </TouchableOpacity>


            

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setAccepted(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>
                Accept
              </Text>
            </TouchableOpacity>


            

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setAccepted(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>
                Reject
              </Text>
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
    backgroundColor: COLORS.white,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  header: {
    height: 170,
    backgroundColor: COLORS.blue,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    position: "relative",

    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  backButton: {
    position: "absolute",
    left: 28,
    top: 65,

    width: 42,
    height: 42,

    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color: COLORS.white,

    fontSize: 23,
    fontWeight: "700",

    textAlign: "center",
  },

  headerTitleSmall: {
    fontSize: 20,
  },

  profileButton: {
    position: "absolute",
    right: 28,
    top: 58,

    width: 48,
    height: 48,

    borderRadius: 24,

    backgroundColor: COLORS.cyan,

    alignItems: "center",
    justifyContent: "center",
  },

  main: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingTop: 30,
    paddingBottom: 25,
  },

  intro: {
    color: COLORS.blue,

    fontSize: 16,
    lineHeight: 23,

    fontWeight: "400",

    textAlign: "left",

    marginBottom: 12,
  },

  textSmall: {
    fontSize: 15,
    lineHeight: 21,
  },

  heading: {
    color: COLORS.blue,

    fontSize: 17,
    lineHeight: 24,

    fontWeight: "800",

    marginTop: 10,
    marginBottom: 3,

    textAlign: "left",
  },

  paragraph: {
    color: COLORS.blue,

    fontSize: 16,
    lineHeight: 23,

    fontWeight: "400",

    textAlign: "left",

    marginBottom: 7,

    width: "100%",
  },


  bottom: {
    backgroundColor: COLORS.white,

    paddingTop: 8,
    paddingBottom: 18,

    alignItems: "center",
  },

  checkboxRow: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 12,
  },

  checkbox: {
    width: 24,
    height: 24,

    borderWidth: 1.5,
    borderColor: COLORS.gray,

    borderRadius: 3,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 10,
  },

  checkboxChecked: {
    backgroundColor: COLORS.cyan,
    borderColor: COLORS.cyan,
  },

  checkboxText: {
    color: COLORS.blue,

    fontSize: 13,

    textAlign: "left",
  },

  actionButton: {
    width: 205,
    height: 53,

    borderRadius: 28,

    backgroundColor: COLORS.cyan,

    alignItems: "center",
    justifyContent: "center",

    marginTop: 7,
  },

  buttonText: {
    color: COLORS.white,

    fontSize: 17,

    fontWeight: "700",
  },

});