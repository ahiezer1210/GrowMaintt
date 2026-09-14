import { Stack } from "expo-router";
import { NavigationHistoryProvider } from "../../context/NavigationHistoryContext";
import { PeriodProvider } from "../../context/PeriodContext";

export default function RootLayout() {
  return (
    <PeriodProvider>
      <NavigationHistoryProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="modal"
            options={{ presentation: "modal" }}
          />
        </Stack>
      </NavigationHistoryProvider>
    </PeriodProvider>
  );
}