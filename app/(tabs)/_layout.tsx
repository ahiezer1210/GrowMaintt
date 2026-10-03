import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: "none", // ← Esto oculta completamente el footer
        },
      }}
    >
      <Tabs.Screen name="/historial" />
      <Tabs.Screen name="/expensesmanagement" />
      <Tabs.Screen name="/currentgoal" />
      <Tabs.Screen name="/profile" />
    </Tabs>
  );
}