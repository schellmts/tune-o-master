import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

const headerOptions = {
  headerStyle: { backgroundColor: '#2b2d44' },
  headerTintColor: '#fff',
  headerTitleAlign: 'center' as const,
  headerTitleStyle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 20,
  },
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        ...headerOptions,
        headerShown: false,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#FFFFFF',
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: '#26283f',
          borderTopColor: '#3d405f',
          borderTopWidth: 1,
          height: 78,
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Poppins_400Regular',
          fontSize: 13,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Afinador',
          headerTitle: 'Afinador',
          tabBarIcon: ({ color }) => <Ionicons size={20} name="mic-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="mapa"
        options={{
          title: 'Lojas',
          headerTitle: 'Lojas proximas',
          tabBarIcon: ({ color }) => <Ionicons size={20} name="map-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: 'Admin',
          headerTitle: 'Painel Admin',
          tabBarIcon: ({ color }) => <Ionicons size={20} name="options-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}
