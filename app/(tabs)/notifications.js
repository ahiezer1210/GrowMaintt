import React, { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const notifications = [
  {
    id: 1,
    category: 'Savings',
    title: 'Savings reminder',
    description: 'You rounded up $0.40 on your last purchase. Keep it up!',
    time: '20:00',
    date: 'July 10',
    icon: 'cash-multiple',
  },
  {
    id: 2,
    category: 'Investment',
    title: 'Investment notice',
    description: 'Congratulations! You reached the minimum amount to invest',
    time: '17:00',
    date: 'July 7',
    icon: 'finance',
  },
  {
    id: 3,
    category: 'Rewards',
    title: 'Rewards update',
    description: 'You earned 10 points for saving for 10 days in a row',
    time: '00:00',
    date: 'June 3',
    icon: 'medal-outline',
  },
  {
    id: 4,
    category: 'Security',
    title: 'Security alert',
    description: 'Your account was accessed from another device',
    time: '7:00',
    date: 'May 3',
    icon: 'shield-check-outline',
  },
];

const categories = [
  'All',
  'Savings',
  'Investment',
  'Rewards',
  'Security',
];

export default function NotificacionesScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [unreadIds, setUnreadIds] = useState([1, 2, 3, 4]);
  const [activeTab, setActiveTab] = useState('home');

  const filteredNotifications =
    selectedCategory === 'All'
      ? notifications
      : notifications.filter(
          (notification) => notification.category === selectedCategory
        );

  const handleNotificationPress = (id) => {
    setUnreadIds((prev) => prev.filter((unreadId) => unreadId !== id));
  };

  const handleNavPress = (tabName, screenName) => {
    setActiveTab(tabName);
    if (navigation && screenName) {
      navigation.navigate(screenName);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#081023" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => (navigation?.goBack ? navigation.goBack() : null)}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={28}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Notifications</Text>

        {unreadIds.length > 0 && <View style={styles.headerDot} />}
      </View>

      {/* Main Container */}
      <View style={styles.content}>
        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.notificationsContainer}>
          {filteredNotifications.map((notification) => {
            const isUnread = unreadIds.includes(notification.id);
            return (
              <TouchableOpacity
                key={notification.id}
                style={styles.notification}
                onPress={() => handleNotificationPress(notification.id)}
                activeOpacity={0.8}
              >
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons
                    name={notification.icon}
                    size={26}
                    color="#172D3D"
                  />
                </View>

                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>
                    {notification.title}
                  </Text>

                  <Text style={styles.notificationDescription}>
                    {notification.description}
                  </Text>

                  <View style={styles.dateContainer}>
                    <Text style={styles.time}>{notification.time}</Text>
                    <Text style={styles.date}>{notification.date}</Text>
                  </View>
                </View>

                {isUnread && <View style={styles.notificationDot} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Bottom Bar Integrada al Borde Inferior */}
        <SafeAreaView edges={['bottom']} style={styles.bottomBarContainer}>
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => handleNavPress('home', 'Home')}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="home-outline"
                size={35}
                color={activeTab === 'home' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => handleNavPress('reports', 'Reports')}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="chart-box-outline"
                size={35}
                color={activeTab === 'reports' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => handleNavPress('swap', 'Transactions')}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="swap-horizontal"
                size={37}
                color={activeTab === 'swap' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => handleNavPress('layers', 'Savings')}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="layers-outline"
                size={35}
                color={activeTab === 'layers' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => handleNavPress('account', 'Profile')}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="account-outline"
                size={35}
                color={activeTab === 'account' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)'}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#081023',
  },

  header: {
    height: 100,
    backgroundColor: '#081023',
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },

  backButton: {
    position: 'absolute',
    left: 24,
    top: 45,
    zIndex: 10,
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '700',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    top: 40,
  },

  headerDot: {
    position: 'absolute',
    right: 30,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#27B4D0',
    top: 45,
  },

  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingTop: 20,
    overflow: 'hidden',
  },

  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 15,
  },

  categoryButton: {
    height: 35,
    paddingHorizontal: 10,
    borderRadius: 9,
    backgroundColor: '#E5E9F3',
    justifyContent: 'center',
    alignItems: 'center',
  },

  categoryButtonActive: {
    backgroundColor: '#27B4D0',
  },

  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#172D3D',
  },

  categoryTextActive: {
    color: '#FFFFFF',
  },

  notificationsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'space-evenly',
  },

  notification: {
    minHeight: 76,
    backgroundColor: '#F4F4F4',
    borderRadius: 13,
    paddingVertical: 12,
    paddingHorizontal: 11,
    flexDirection: 'row',
    position: 'relative',
  },

  iconContainer: {
    width: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 7,
  },

  notificationContent: {
    flex: 1,
    paddingRight: 15,
  },

  notificationTitle: {
    color: '#172D3D',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 3,
  },

  notificationDescription: {
    color: '#6D7580',
    fontSize: 9,
    lineHeight: 12,
    paddingRight: 5,
  },

  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  },

  time: {
    color: '#172D3D',
    fontSize: 8,
    marginRight: 3,
  },

  date: {
    color: '#172D3D',
    fontSize: 8,
  },

  notificationDot: {
    position: 'absolute',
    left: 11,
    top: 12,
    width: 7,
    height: 7,
    borderRadius: 10,
    backgroundColor: '#27B4D0',
  },

  bottomBarContainer: {
    backgroundColor: '#25B5D1',
    borderTopLeftRadius: 78,
  },

  bottomBar: {
    width: '100%',
    height: 65,
    backgroundColor: '#25B5D1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopLeftRadius: 78,
  },

  navItem: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});