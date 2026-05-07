import { Tabs } from 'expo-router';
import React from 'react';
import { COLORS, FONTS } from '../../src/constants/theme';
import { Home, Settings } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.red,
        tabBarInactiveTintColor: COLORS.gray5,
        tabBarStyle: {
          backgroundColor: COLORS.black,
          borderTopWidth: 2,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontFamily: FONTS.mono,
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: 1,
        },
        headerStyle: {
          backgroundColor: COLORS.black,
          borderBottomWidth: 2,
          borderBottomColor: COLORS.border,
        },
        headerTitleStyle: {
          fontFamily: FONTS.head,
          fontWeight: '800',
          color: COLORS.white,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'NOTES',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'SETTINGS',
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
