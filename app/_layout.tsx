import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { Syne_400Regular, Syne_700Bold, Syne_800ExtraBold } from '@expo-google-fonts/syne';
import { SpaceMono_400Regular, SpaceMono_700Bold } from '@expo-google-fonts/space-mono';
import { 
  PlayfairDisplay_400Regular, 
  PlayfairDisplay_700Bold, 
  PlayfairDisplay_800ExtraBold,
  PlayfairDisplay_900Black 
} from '@expo-google-fonts/playfair-display';
import { useDatabase } from '../src/hooks/useDatabase';
import { COLORS } from '../src/constants/theme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const dbReady = useDatabase();
  const [fontsLoaded] = useFonts({
    Syne: Syne_400Regular,
    'Syne-Bold': Syne_700Bold,
    'Syne-ExtraBold': Syne_800ExtraBold,
    'Space Mono': SpaceMono_400Regular,
    'Space Mono-Bold': SpaceMono_700Bold,
    'PlayfairDisplay-Regular': PlayfairDisplay_400Regular,
    'PlayfairDisplay-Bold': PlayfairDisplay_700Bold,
    'PlayfairDisplay-ExtraBold': PlayfairDisplay_800ExtraBold,
    'PlayfairDisplay-Black': PlayfairDisplay_900Black,
  });

  useEffect(() => {
    if (fontsLoaded && dbReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, dbReady]);

  if (!fontsLoaded || !dbReady) {
    return null;
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack screenOptions={{
        headerStyle: { backgroundColor: COLORS.black },
        headerTintColor: COLORS.red,
        headerTitleStyle: { fontFamily: 'Syne', fontWeight: '800' },
        contentStyle: { backgroundColor: COLORS.black },
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="editor/[id]" options={{ title: 'EDITOR' }} />
        <Stack.Screen name="folder/[id]" options={{ title: 'FOLDER' }} />
        <Stack.Screen name="vault" options={{ title: 'VAULT', presentation: 'modal' }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
