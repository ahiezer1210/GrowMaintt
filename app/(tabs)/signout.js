import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useLayoutEffect } from 'react';
import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

export default function LogoutScreen({ navigation }) {
  const { width, height } = useWindowDimensions();

  const scale = Math.min(width / 390, height / 844);
  const s = (value) => Math.round(value * scale);

  useLayoutEffect(() => {
    navigation?.setOptions({
      headerShown: false,
      tabBarStyle: { display: 'none' },
      tabBarVisible: false,
    });

    const parent = navigation?.getParent();

    if (parent) {
      parent.setOptions({
        tabBarStyle: { display: 'none' },
      });
    }
  }, [navigation]);

  const goToLogin = () => {
    router.replace('/login');
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          onPress: goToLogin,
        },
      ]
    );
  };

  const handleLogoutEverywhere = () => {
    Alert.alert(
      'Log Out Everywhere',
      'Do you want to log out from all your devices?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Continue',
          onPress: goToLogin,
        },
      ]
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar
        translucent
        backgroundColor="#071426"
        barStyle="light-content"
      />

      <View style={styles.app}>

        <View
          style={[
            styles.header,
            {
              height: s(118),
              paddingHorizontal: s(18),
            },
          ]}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={s(34)}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text
              style={[
                styles.headerTitle,
                {
                  fontSize: s(25),
                },
              ]}
            >
              Log Out
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.bellButton,
              {
                width: s(45),
                height: s(45),
                borderRadius: s(23),
              },
            ]}
          >
            <MaterialCommunityIcons
              name="bell-outline"
              size={s(27)}
              color="#397468"
            />
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.main,
            {
              borderTopLeftRadius: s(45),
              borderTopRightRadius: s(45),
            },
          ]}
        >
          <View
            style={[
              styles.content,
              {
                paddingHorizontal: s(30),
              },
            ]}
          >
            <View
              style={[
                styles.logoutCircle,
                {
                  width: s(160),
                  height: s(160),
                  borderRadius: s(80),
                },
              ]}
            >
              <View
                style={[
                  styles.door,
                  {
                    width: s(67),
                    height: s(98),
                    borderRadius: s(9),
                  },
                ]}
              >
                <View
                  style={[
                    styles.doorInside,
                    {
                      width: s(57),
                      height: s(86),
                      borderRadius: s(7),
                    },
                  ]}
                />
              </View>

              <MaterialCommunityIcons
                name="arrow-right-bold"
                size={s(57)}
                color="#1464E8"
                style={styles.logoutArrow}
              />
            </View>

            <Text
              style={[
                styles.question,
                {
                  fontSize: s(24),
                  lineHeight: s(29),
                },
              ]}
            >
              Are you sure you want to
              {'\n'}
              log out?
            </Text>

            <Text
              style={[
                styles.description,
                {
                  fontSize: s(15),
                  lineHeight: s(21),
                },
              ]}
            >
              You will be logged out of this device. To access your
              account again, you will need to log in again.
            </Text>

            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  width: s(225),
                  height: s(54),
                  borderRadius: s(30),
                },
              ]}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    fontSize: s(17),
                  },
                ]}
              >
                Log Out
              </Text>
            </TouchableOpacity>

            <Text
              style={[
                styles.everywhereText,
                {
                  fontSize: s(15),
                  lineHeight: s(21),
                },
              ]}
            >
              Or log out from all your
              {'\n'}
              devices
            </Text>

            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  width: s(225),
                  height: s(54),
                  borderRadius: s(30),
                },
              ]}
              onPress={handleLogoutEverywhere}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    fontSize: s(17),
                  },
                ]}
              >
                Go
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.bottomBar,
              {
                height: s(86),
                borderTopLeftRadius: s(78),
              },
            ]}
          >
            <TouchableOpacity style={styles.navButton}>
              <MaterialCommunityIcons
                name="home-outline"
                size={s(35)}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton}>
              <MaterialCommunityIcons
                name="chart-box-outline"
                size={s(35)}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton}>
              <MaterialCommunityIcons
                name="swap-horizontal"
                size={s(37)}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton}>
              <MaterialCommunityIcons
                name="layers-outline"
                size={s(35)}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton}>
              <MaterialCommunityIcons
                name="account-outline"
                size={s(35)}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#071426',
  },

  app: {
    flex: 1,
    width: '100%',
    backgroundColor: '#071426',
  },

  header: {
    width: '100%',
    backgroundColor: '#071426',
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    width: 48,
    height: 48,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  bellButton: {
    backgroundColor: '#E2F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  main: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },

  logoutCircle: {
    backgroundColor: '#EEF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#1464E8',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.13,
    shadowRadius: 10,
    elevation: 5,
  },

  door: {
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    left: '27%',
    justifyContent: 'center',
    shadowColor: '#071426',
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.16,
    shadowRadius: 6,
    elevation: 4,
  },

  doorInside: {
    backgroundColor: '#1464E8',
    position: 'absolute',
    left: '15%',
    top: '12%',
  },

  logoutArrow: {
    position: 'absolute',
    right: '11%',
    top: '35%',
  },

  question: {
    width: '100%',
    textAlign: 'center',
    color: '#111111',
    fontWeight: '800',
  },

  description: {
    width: '100%',
    textAlign: 'left',
    color: '#111111',
    fontWeight: '400',
  },

  actionButton: {
    backgroundColor: '#071426',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  everywhereText: {
    width: '100%',
    textAlign: 'center',
    color: '#111111',
    fontWeight: '400',
  },

  bottomBar: {
  width: "100%",
  height: 65,
  backgroundColor: "#25B5D1",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-around",
  borderTopLeftRadius: 78,
  borderTopRightRadius: 0,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  overflow: "hidden",
},

  navButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});