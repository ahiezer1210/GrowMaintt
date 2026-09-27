import { Stack } from 'expo-router';
import { AppSettingsProvider } from "../context/Appsettings";
import { PeriodProvider } from '../context/PeriodContext';

export default function RootLayout() {
  return (
    <AppSettingsProvider>
      <PeriodProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="modal"
            options={{ presentation: 'modal' }}
          />
        </Stack>
      </PeriodProvider>
    </AppSettingsProvider>
  );
}