import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ManualScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState('home');
  const [hasNotification, setHasNotification] = useState(true);

  // Escalas responsivas basadas en el ancho y alto de pantalla
  const scale = width / 375;
  const verticalScale = height / 812;

  const handleNotificationPress = () => {
    setHasNotification(false);
    Alert.alert('Notificaciones', 'No tienes nuevas notificaciones pendientes.');
  };

  const handleNavPress = (screenName, tabKey) => {
    setActiveTab(tabKey);
    if (navigation && screenName) {
      navigation.navigate(screenName);
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor="#071426" barStyle="light-content" />

      {/* Header Fijo */}
      <View style={[styles.header, { height: Math.max(65, height * 0.09) }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => (navigation?.goBack ? navigation.goBack() : null)}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="arrow-left" size={28 * scale} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { fontSize: 20 * scale }]}>
            User Manual
          </Text>
          <Text style={[styles.headerSubtitle, { fontSize: 12 * scale }]}>
            Everything you need to know
          </Text>
        </View>

        <TouchableOpacity
          style={styles.bellButton}
          onPress={handleNotificationPress}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name={hasNotification ? 'bell-badge-outline' : 'bell-outline'}
            size={22 * scale}
            color="#397468"
          />
        </TouchableOpacity>
      </View>

      {/* Main Content Area - Estática sin Scroll */}
      <View style={styles.main}>
        <View style={styles.content}>
          <Text style={[styles.mainTitle, { fontSize: 20 * scale }]}>
            What is GrowMait?
          </Text>

          <View style={styles.introBox}>
            <Text style={[styles.introText, { fontSize: 11.5 * scale, lineHeight: 15 * scale }]}>
              GrowMait is your ally to keep control of your finances,
              expenses and savings. Everything in one simple, easy
              and secure place.
            </Text>
          </View>

          {/* Lista de Secciones Distribuidas */}
          <View style={styles.sectionsContainer}>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { fontSize: 13.5 * scale }]}>1. Home</Text>
              <Text style={[styles.sectionText, { fontSize: 10.5 * scale }]}>
                Know your balance, recent activity and get a quick summary of your finances.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { fontSize: 13.5 * scale }]}>2. Add Expense</Text>
              <Text style={[styles.sectionText, { fontSize: 10.5 * scale }]}>
                Register your daily expenses and classify them by category.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { fontSize: 13.5 * scale }]}>3. Reports</Text>
              <Text style={[styles.sectionText, { fontSize: 10.5 * scale }]}>
                Visualize your income, expenses and savings with charts and statistics.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { fontSize: 13.5 * scale }]}>4. Savings</Text>
              <Text style={[styles.sectionText, { fontSize: 10.5 * scale }]}>
                Create savings goals, contribute regularly and reach your objectives.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { fontSize: 13.5 * scale }]}>5. Transactions</Text>
              <Text style={[styles.sectionText, { fontSize: 10.5 * scale }]}>
                Review the history of all your financial movements in detail.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { fontSize: 13.5 * scale }]}>6. Settings</Text>
              <Text style={[styles.sectionText, { fontSize: 10.5 * scale }]}>
                Manage your account preferences and configuration.
              </Text>
            </View>
          </View>

          {/* Tips */}
          <View style={styles.tipsHeader}>
            <MaterialCommunityIcons
              name="lightbulb-outline"
              size={22 * scale}
              color="#071426"
            />
            <Text style={[styles.tipsTitle, { fontSize: 17 * scale }]}>
              Useful Tips
            </Text>
          </View>

          <View style={styles.tip}>
            <MaterialCommunityIcons
              name="shield-check-outline"
              size={28 * scale}
              color="#071426"
            />
            <View style={styles.tipContent}>
              <Text style={[styles.tipTitle, { fontSize: 13 * scale }]}>
                Keep your data safe
              </Text>
              <Text style={[styles.tipDescription, { fontSize: 10 * scale }]}>
                Do not share your password or sign in on shared devices.
              </Text>
            </View>
          </View>

          <View style={styles.tip}>
            <MaterialCommunityIcons
              name="bullseye-arrow"
              size={28 * scale}
              color="#071426"
            />
            <View style={styles.tipContent}>
              <Text style={[styles.tipTitle, { fontSize: 13 * scale }]}>
                Set realistic goals
              </Text>
              <Text style={[styles.tipDescription, { fontSize: 10 * scale }]}>
                Start with small goals and increase them little by little.
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom Navigation Bar Fijo */}
        <SafeAreaView edges={['bottom']} style={styles.bottomBarContainer}>
          <View style={[styles.bottomBar, { height: Math.max(60, height * 0.075) }]}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => handleNavPress('Home', 'home')}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="home-outline"
                size={26 * scale}
                color={activeTab === 'home' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButton}
              onPress={() => handleNavPress('Reports', 'reports')}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="chart-box-outline"
                size={26 * scale}
                color={activeTab === 'reports' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButton}
              onPress={() => handleNavPress('Transactions', 'transactions')}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="swap-horizontal"
                size={28 * scale}
                color={activeTab === 'transactions' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButton}
              onPress={() => handleNavPress('Savings', 'savings')}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="layers-outline"
                size={26 * scale}
                color={activeTab === 'savings' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButton}
              onPress={() => handleNavPress('Profile', 'profile')}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="account-outline"
                size={26 * scale}
                color={activeTab === 'profile' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)'}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#071426',
  },
  header: {
    width: '100%',
    backgroundColor: '#071426',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#FFFFFF',
    marginTop: 1,
  },
  bellButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E2F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 42,
    borderTopRightRadius: 42,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 8,
    justifyContent: 'space-between',
  },
  mainTitle: {
    textAlign: 'center',
    color: '#263B3D',
    fontWeight: '800',
    marginBottom: 4,
  },
  introBox: {
    backgroundColor: '#2BB3CA',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 4,
  },
  introText: {
    color: '#073246',
    textAlign: 'center',
    fontWeight: '700',
  },
  sectionsContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: '#42B7C8',
    paddingVertical: 2,
  },
  sectionTitle: {
    color: '#111111',
    fontWeight: '800',
  },
  sectionText: {
    color: '#222222',
    lineHeight: 13,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 2,
  },
  tipsTitle: {
    color: '#071426',
    fontWeight: '800',
    marginLeft: 6,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#42B7C8',
    paddingVertical: 2,
  },
  tipContent: {
    flex: 1,
    marginLeft: 8,
  },
  tipTitle: {
    color: '#111111',
    fontWeight: '800',
  },
  tipDescription: {
    color: '#42AFC1',
    lineHeight: 12,
  },
  bottomBarContainer: {
    backgroundColor: '#2BB3CA',
    borderTopLeftRadius: 70,
  },
  bottomBar: {
    width: '100%',
    backgroundColor: '#2BB3CA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopLeftRadius: 70,
  },
  navButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});