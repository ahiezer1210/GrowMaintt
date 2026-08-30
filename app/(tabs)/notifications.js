import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const notifications = [
  {
    id: 1,
    category: "Savings",
    title: "Savings reminder",
    description: "You rounded up $0.40 on your last purchase. Keep it up!",
    time: "20:00",
    date: "July 10",
    icon: "cash-multiple",
  },
  {
    id: 2,
    category: "Investment",
    title: "Investment notice",
    description: "Congratulations! You reached the minimum amount to invest",
    time: "17:00",
    date: "July 7",
    icon: "finance",
  },
  {
    id: 3,
    category: "Rewards",
    title: "Rewards update",
    description: "You earned 10 points for saving for 10 days in a row",
    time: "00:00",
    date: "June 3",
    icon: "medal-outline",
  },
  {
    id: 4,
    category: "Security",
    title: "Security alert",
    description: "Your account was accessed from another device",
    time: "7:00",
    date: "May 3",
    icon: "shield-check-outline",
  },
];

const categories = [
  "All",
  "Savings",
  "Investment",
  "Rewards",
  "Security",
];

export default function NotificacionesScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hayNotificacionesNuevas] = useState(true);

  const filteredNotifications =
    selectedCategory === "All"
      ? notifications
      : notifications.filter(
          (notification) => notification.category === selectedCategory
        );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#081023"
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={28}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Notifications
        </Text>

        {hayNotificacionesNuevas && (
          <View style={styles.headerDot} />
        )}
      </View>

      <View style={styles.content}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.mainScroll}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
            overScrollMode="never"
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category &&
                    styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category &&
                      styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.notificationsContainer}>
            {filteredNotifications.map((notification) => (
              <View
                key={notification.id}
                style={styles.notification}
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
                    <Text style={styles.time}>
                      {notification.time}
                    </Text>

                    <Text style={styles.date}>
                      {notification.date}
                    </Text>
                  </View>
                </View>

                <View style={styles.notificationDot} />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons
            name="home-outline"
            size={35}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons
            name="chart-box-outline"
            size={35}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons
            name="swap-horizontal"
            size={37}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons
            name="layers-outline"
            size={35}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons
            name="account-outline"
            size={35}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },

  backButton: {
    position: "absolute",
    left: 24,
    top: 55,
    zIndex: 10,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "700",
    position: "absolute",
    left: 10,
    right: 0,
    textAlign: "center",
    top: 45,
  },

  headerDot: {
    position: "absolute",
    left: 45,
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: "#27B4D0",
    top: 30,
  },

  content: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginTop: -25,
  },

  mainScroll: {
    paddingBottom: 80,
  },

  categoriesContainer: {
    paddingTop: 25,
    paddingLeft: 7,
    paddingRight: 25,
    gap: 8,
  },

  categoryButton: {
    height: 35,
    paddingHorizontal: 13,
    borderRadius: 9,
    backgroundColor: "#E5E9F3",
    justifyContent: "center",
    alignItems: "center",
  },

  categoryButtonActive: {
    backgroundColor: "#27B4D0",
  },

  categoryText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#172D3D",
  },

  categoryTextActive: {
    color: "#FFFFFF",
  },

  notificationsContainer: {
    paddingTop: 32,
    paddingHorizontal: 11,
    paddingBottom: 0,
  },

  notification: {
    minHeight: 76,
    backgroundColor: "#F4F4F4",
    borderRadius: 13,
    marginBottom: 17,
    paddingVertical: 13,
    paddingHorizontal: 11,
    flexDirection: "row",
    position: "relative",
  },

  iconContainer: {
    width: 35,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 7,
  },

  notificationContent: {
    flex: 1,
    paddingRight: 15,
  },

  notificationTitle: {
    color: "#172D3D",
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 3,
  },

  notificationDescription: {
    color: "#6D7580",
    fontSize: 9,
    lineHeight: 12,
    paddingRight: 5,
  },

  dateContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 4,
  },

  time: {
    color: "#172D3D",
    fontSize: 8,
    marginRight: 3,
  },

  date: {
    color: "#172D3D",
    fontSize: 8,
  },

  notificationDot: {
    position: "absolute",
    left: 11,
    top: 12,
    width: 7,
    height: 7,
    borderRadius: 10,
    backgroundColor: "#27B4D0",
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: 65,
    backgroundColor: "#25B5D1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopLeftRadius: 78,
    overflow: "hidden",
  },

  navItem: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
