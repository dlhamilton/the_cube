import { Tabs } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { useWindowDimensions } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const DESKTOP_BREAKPOINT = 768;

const screens = [
  { name: 'index', title: 'Home', icon: 'house.fill' as const },
  { name: 'cube', title: 'Cube', icon: 'cube.fill' as const },
  { name: 'history', title: 'History', icon: 'clock.fill' as const },
  { name: 'profile', title: 'Profile', icon: 'person.fill' as const },
  { name: 'settings', title: 'Settings', icon: 'gearshape.fill' as const },
];

function TabsLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        tabBarButton: HapticTab,
      }}
    >
      {screens.map((screen) => (
        <Tabs.Screen
          key={screen.name}
          name={screen.name}
          options={{
            title: screen.title,
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name={screen.icon} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

function DrawerLayout() {
  const colorScheme = useColorScheme();

  return (
    <Drawer
      screenOptions={{
        drawerType: 'permanent',
        drawerStyle: { width: 240 },
        headerShown: true,
        drawerActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      }}
    >
      {screens.map((screen) => (
        <Drawer.Screen
          key={screen.name}
          name={screen.name}
          options={{
            title: screen.title,
            drawerIcon: ({ color }) => (
              <IconSymbol size={24} name={screen.icon} color={color} />
            ),
          }}
        />
      ))}
    </Drawer>
  );
}

export default function AppLayout() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= DESKTOP_BREAKPOINT;

  return isDesktop ? <DrawerLayout /> : <TabsLayout />;
}
