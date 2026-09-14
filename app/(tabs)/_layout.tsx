<<<<<<< HEAD
﻿import { Stack } from "expo-router";
import { NavigationHistoryProvider } from "../../context/NavigationHistoryContext";
import { PeriodProvider } from "../../context/PeriodContext";
=======
﻿import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
>>>>>>> 349b3c5810c493ba5e5ac84cb0ac139294ec6e3a

export default function RootLayout() {
  return (
<<<<<<< HEAD
    <PeriodProvider>
      <NavigationHistoryProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        </Stack>
      </NavigationHistoryProvider>
    </PeriodProvider>
=======
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        headerShown: false,
      }}
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

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="person"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
>>>>>>> 349b3c5810c493ba5e5ac84cb0ac139294ec6e3a
  );
}