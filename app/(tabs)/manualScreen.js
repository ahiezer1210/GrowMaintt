import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ManualScreen({ navigation }) {
  const { width, height } = useWindowDimensions();

  const [activeTab, setActiveTab] = useState('home');
  const [hasNotification, setHasNotification] = useState(true);

  
  const isTablet = width >= 700;
  const isLandscape = width > height;

  
  const scale = Math.min(Math.max(width / 375, 0.9), 1.35);

  const handleNotificationPress = () => {
    setHasNotification(false);

    Alert.alert(
      'Notifications',
      'You do not have any new notifications.'
    );
  };

  const handleNavPress = (screenName, tabKey) => {
    setActiveTab(tabKey);

    if (navigation && screenName) {
      navigation.navigate(screenName);
    }
  };

  const sections = [
    {
      number: '01',
      title: 'Home',
      icon: 'home-outline',
      description:
        'Know your balance, recent activity and get a quick summary of your finances.',
    },
    {
      number: '02',
      title: 'Add Expense',
      icon: 'plus-circle-outline',
      description:
        'Register your daily expenses and classify them by category.',
    },
    {
      number: '03',
      title: 'Reports',
      icon: 'chart-box-outline',
      description:
        'Visualize your income, expenses and savings with charts and statistics.',
    },
    {
      number: '04',
      title: 'Savings',
      icon: 'piggy-bank-outline',
      description:
        'Create savings goals, contribute regularly and reach your objectives.',
    },
    {
      number: '05',
      title: 'Transactions',
      icon: 'swap-horizontal',
      description:
        'Review the history of all your financial movements in detail.',
    },
    {
      number: '06',
      title: 'Settings',
      icon: 'cog-outline',
      description:
        'Manage your account preferences and configuration.',
    },
  ];

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <StatusBar
        backgroundColor="#081023"
        barStyle="light-content"
      />

      
      <View
        style={[
          styles.header,
          {
            height: isLandscape
              ? 70
              : isTablet
              ? 86
              : 76,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            navigation?.goBack ? navigation.goBack() : null
          }
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={28 * scale}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text
            style={[
              styles.headerTitle,
              {
                fontSize: 21 * scale,
              },
            ]}
          >
            User Manual
          </Text>

          <Text
            style={[
              styles.headerSubtitle,
              {
                fontSize: 12 * scale,
              },
            ]}
          >
            Everything you need to know
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.bellButton,
            {
              width: 42 * scale,
              height: 42 * scale,
              borderRadius: 21 * scale,
            },
          ]}
          onPress={handleNotificationPress}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name={
              hasNotification
                ? 'bell-badge-outline'
                : 'bell-outline'
            }
            size={23 * scale}
            color="#081023"
          />
        </TouchableOpacity>
      </View>

      
      <View style={styles.main}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            {
              paddingHorizontal: isTablet ? 42 : 20,
              paddingTop: isLandscape ? 18 : 24,
              paddingBottom: 30,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.innerContent,
              {
                maxWidth: isTablet ? 1050 : 700,
              },
            ]}
          >
            
            <View style={styles.titleContainer}>
              <Text
                style={[
                  styles.mainTitle,
                  {
                    fontSize: isTablet
                      ? 28
                      : 23 * scale,
                  },
                ]}
              >
                What is GrowMait?
              </Text>

              <View style={styles.titleLine} />
            </View>

            
            <View style={styles.introBox}>
              <View style={styles.introIcon}>
                <MaterialCommunityIcons
                  name="wallet-outline"
                  size={25 * scale}
                  color="#FFFFFF"
                />
              </View>

              <View style={styles.introContent}>
                <Text
                  style={[
                    styles.introText,
                    {
                      fontSize: isTablet
                        ? 16
                        : 13.5 * scale,
                      lineHeight: isTablet
                        ? 23
                        : 19 * scale,
                    },
                  ]}
                >
                  GrowMait is your ally to keep control of your
                  finances, expenses and savings. Everything in
                  one simple, easy and secure place.
                </Text>
              </View>
            </View>

            
            <View style={styles.sectionHeader}>
              <View>
                <Text
                  style={[
                    styles.sectionHeading,
                    {
                      fontSize: isTablet ? 22 : 18 * scale,
                    },
                  ]}
                >
                  Explore GrowMait
                </Text>

                <Text
                  style={[
                    styles.sectionSubheading,
                    {
                      fontSize: isTablet
                        ? 14
                        : 11.5 * scale,
                    },
                  ]}
                >
                  Everything you can do in the app
                </Text>
              </View>
            </View>

            
            <View
              style={[
                styles.sectionsContainer,
                isTablet && styles.sectionsGrid,
              ]}
            >
              {sections.map((item) => (
                <View
                  key={item.number}
                  style={[
                    styles.sectionCard,
                    isTablet && styles.sectionCardTablet,
                  ]}
                >
                  
                  <View style={styles.numberContainer}>
                    <Text style={styles.numberText}>
                      {item.number}
                    </Text>
                  </View>

                  
                  <View style={styles.sectionIcon}>
                    <MaterialCommunityIcons
                      name={item.icon}
                      size={25 * scale}
                      color="#25B7D3"
                    />
                  </View>

                  
                  <View style={styles.sectionInfo}>
                    <Text
                      style={[
                        styles.sectionTitle,
                        {
                          fontSize: isTablet
                            ? 17
                            : 14.5 * scale,
                        },
                      ]}
                    >
                      {item.title}
                    </Text>

                    <Text
                      style={[
                        styles.sectionText,
                        {
                          fontSize: isTablet
                            ? 14
                            : 11.5 * scale,
                          lineHeight: isTablet
                            ? 20
                            : 16 * scale,
                        },
                      ]}
                    >
                      {item.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* ================= TIPS HEADER ================= */}
            <View style={styles.tipsHeader}>
              <View style={styles.tipsIcon}>
                <MaterialCommunityIcons
                  name="lightbulb-on-outline"
                  size={23 * scale}
                  color="#FFFFFF"
                />
              </View>

              <View>
                <Text
                  style={[
                    styles.tipsTitle,
                    {
                      fontSize: isTablet
                        ? 22
                        : 18 * scale,
                    },
                  ]}
                >
                  Useful Tips
                </Text>

                <Text
                  style={[
                    styles.tipsSubtitle,
                    {
                      fontSize: isTablet
                        ? 14
                        : 11 * scale,
                    },
                  ]}
                >
                  Small actions for better financial habits
                </Text>
              </View>
            </View>

           
            <View
              style={[
                styles.tipsContainer,
                isTablet && styles.tipsGrid,
              ]}
            >
              
              <View
                style={[
                  styles.tipCard,
                  isTablet && styles.tipCardTablet,
                ]}
              >
                <View style={styles.tipIconContainer}>
                  <MaterialCommunityIcons
                    name="shield-check-outline"
                    size={28 * scale}
                    color="#081023"
                  />
                </View>

                <View style={styles.tipContent}>
                  <Text
                    style={[
                      styles.tipTitle,
                      {
                        fontSize: isTablet
                          ? 16
                          : 13.5 * scale,
                      },
                    ]}
                  >
                    Keep your data safe
                  </Text>

                  <Text
                    style={[
                      styles.tipDescription,
                      {
                        fontSize: isTablet
                          ? 13.5
                          : 11 * scale,
                        lineHeight: isTablet
                          ? 19
                          : 15 * scale,
                      },
                    ]}
                  >
                    Do not share your password or sign in on
                    shared devices.
                  </Text>
                </View>
              </View>

              
              <View
                style={[
                  styles.tipCard,
                  isTablet && styles.tipCardTablet,
                ]}
              >
                <View style={styles.tipIconContainer}>
                  <MaterialCommunityIcons
                    name="bullseye-arrow"
                    size={28 * scale}
                    color="#081023"
                  />
                </View>

                <View style={styles.tipContent}>
                  <Text
                    style={[
                      styles.tipTitle,
                      {
                        fontSize: isTablet
                          ? 16
                          : 13.5 * scale,
                      },
                    ]}
                  >
                    Set realistic goals
                  </Text>

                  <Text
                    style={[
                      styles.tipDescription,
                      {
                        fontSize: isTablet
                          ? 13.5
                          : 11 * scale,
                        lineHeight: isTablet
                          ? 19
                          : 15 * scale,
                      },
                    ]}
                  >
                    Start with small goals and increase them
                    little by little.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        
        <SafeAreaView
          edges={['bottom']}
          style={styles.bottomBarContainer}
        >
          <View
            style={[
              styles.bottomBar,
              {
                height: isLandscape
                  ? 58
                  : isTablet
                  ? 72
                  : 66,
              },
            ]}
          >
           
            <TouchableOpacity
              style={styles.navButton}
              onPress={() =>
                handleNavPress('Home', 'home')
              }
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="home-outline"
                size={26 * scale}
                color={
                  activeTab === 'home'
                    ? '#FFFFFF'
                    : 'rgba(255,255,255,0.55)'
                }
              />
            </TouchableOpacity>

            
            <TouchableOpacity
              style={styles.navButton}
              onPress={() =>
                handleNavPress('Reports', 'reports')
              }
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="chart-box-outline"
                size={26 * scale}
                color={
                  activeTab === 'reports'
                    ? '#FFFFFF'
                    : 'rgba(255,255,255,0.55)'
                }
              />
            </TouchableOpacity>

           
            <TouchableOpacity
              style={styles.navButton}
              onPress={() =>
                handleNavPress(
                  'Transactions',
                  'transactions'
                )
              }
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="swap-horizontal"
                size={28 * scale}
                color={
                  activeTab === 'transactions'
                    ? '#FFFFFF'
                    : 'rgba(255,255,255,0.55)'
                }
              />
            </TouchableOpacity>

            
            <TouchableOpacity
              style={styles.navButton}
              onPress={() =>
                handleNavPress('Savings', 'savings')
              }
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="layers-outline"
                size={26 * scale}
                color={
                  activeTab === 'savings'
                    ? '#FFFFFF'
                    : 'rgba(255,255,255,0.55)'
                }
              />
            </TouchableOpacity>

           
            <TouchableOpacity
              style={styles.navButton}
              onPress={() =>
                handleNavPress('Profile', 'profile')
              }
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="account-outline"
                size={26 * scale}
                color={
                  activeTab === 'profile'
                    ? '#FFFFFF'
                    : 'rgba(255,255,255,0.55)'
                }
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
    backgroundColor: '#081023',
  },

  

  header: {
    width: '100%',
    backgroundColor: '#081023',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },

  backButton: {
    width: 44,
    height: 44,
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
    letterSpacing: 0.2,
  },

  headerSubtitle: {
    color: '#ACADAD',
    marginTop: 3,
    fontWeight: '500',
  },

  bellButton: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  
  main: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,
    overflow: 'hidden',
  },

  scroll: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    alignItems: 'center',
  },

  innerContent: {
    width: '100%',
  },

 

  titleContainer: {
    alignItems: 'center',
    marginBottom: 18,
  },

  mainTitle: {
    color: '#081023',
    fontWeight: '900',
    textAlign: 'center',
  },

  titleLine: {
    width: 42,
    height: 4,
    borderRadius: 5,
    backgroundColor: '#25B7D3',
    marginTop: 8,
  },

 

  introBox: {
    width: '100%',
    backgroundColor: '#25B7D3',
    borderRadius: 20,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 26,
  },

  introIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(8,16,35,0.16)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
  },

  introContent: {
    flex: 1,
  },

  introText: {
    color: '#081023',
    fontWeight: '700',
  },

 

  sectionHeader: {
    width: '100%',
    marginBottom: 13,
  },

  sectionHeading: {
    color: '#081023',
    fontWeight: '900',
  },

  sectionSubheading: {
    color: '#ACADAD',
    marginTop: 3,
    fontWeight: '500',
  },

  

  sectionsContainer: {
    width: '100%',
  },

  sectionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  sectionCard: {
    width: '100%',
    minHeight: 96,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7EAEA',
    borderRadius: 18,
    marginBottom: 12,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',

    
    elevation: 2,

   
    shadowColor: '#081023',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.07,
    shadowRadius: 5,
  },

  sectionCardTablet: {
    width: '48.8%',
    minHeight: 125,
  },

  numberContainer: {
    position: 'absolute',
    top: 9,
    right: 11,
  },

  numberText: {
    color: '#ACADAD',
    fontSize: 11,
    fontWeight: '800',
  },

  sectionIcon: {
    width: 49,
    height: 49,
    borderRadius: 15,
    backgroundColor: '#EAF9FC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
  },

  sectionInfo: {
    flex: 1,
    paddingRight: 12,
  },

  sectionTitle: {
    color: '#081023',
    fontWeight: '800',
    marginBottom: 4,
  },

  sectionText: {
    color: '#4E5658',
    fontWeight: '400',
  },



  tipsHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 13,
  },

  tipsIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#081023',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },

  tipsTitle: {
    color: '#081023',
    fontWeight: '900',
  },

  tipsSubtitle: {
    color: '#ACADAD',
    marginTop: 2,
  },

  tipsContainer: {
    width: '100%',
  },

  tipsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  tipCard: {
    width: '100%',
    backgroundColor: '#F7F9F9',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8EBEB',
  },

  tipCardTablet: {
    width: '48.8%',
  },

  tipIconContainer: {
    width: 49,
    height: 49,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  tipContent: {
    flex: 1,
  },

  tipTitle: {
    color: '#081023',
    fontWeight: '800',
    marginBottom: 3,
  },

  tipDescription: {
    color: '#25B7D3',
    fontWeight: '600',
  },


  bottomBarContainer: {
    backgroundColor: '#25B7D3',
  },

  bottomBar: {
    width: '100%',
    backgroundColor: '#25B7D3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  navButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});