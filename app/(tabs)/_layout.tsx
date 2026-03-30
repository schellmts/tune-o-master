import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
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
          tabBarIcon: ({ color }) => <Ionicons size={20} name="mic-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: 'Admin',
          tabBarIcon: ({ color }) => <Ionicons size={20} name="options-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}
