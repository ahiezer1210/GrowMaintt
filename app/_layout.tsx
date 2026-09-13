import { Stack } from 'expo-router';

import { PeriodProvider } from '../context/PeriodContext';

export default function RootLayout() {
  return (
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
  );
}