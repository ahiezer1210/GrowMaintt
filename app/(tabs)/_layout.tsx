import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { PeriodProvider } from "../../context/PeriodContext.js";

export default function TabLayout() {
  return (
    <PeriodProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#007AFF",
          headerShown: false,
        }}
<<<<<<< HEAD
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />

=======
<<<<<<< HEAD
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
=======
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="home"
                size={size}
                color={color}
              />
            ),
          }}
        />

>>>>>>> 09e8728d8833f2d2b7132f974edb63ae2f3ee20e
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
<<<<<<< HEAD
              <Ionicons name="person" size={size} color={color} />
=======
              <Ionicons
                name="person"
                size={size}
                color={color}
              />
>>>>>>> 09e8728d8833f2d2b7132f974edb63ae2f3ee20e
            ),
          }}
        />
      </Tabs>
    </PeriodProvider>
<<<<<<< HEAD
=======
>>>>>>> 9fea95f (fix: update settings and navigation)
>>>>>>> 09e8728d8833f2d2b7132f974edb63ae2f3ee20e
  );
}