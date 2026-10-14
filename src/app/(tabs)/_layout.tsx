import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import type { BottomTabBarButtonProps } from 'expo-router/build/react-navigation/bottom-tabs/types';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View, type ColorValue } from 'react-native';

import { colors } from '@/theme/colors';

type IconName = ComponentProps<typeof Ionicons>['name'];

function tabIcon(name: IconName) {
  return function TabBarIcon({ color, size }: { color: ColorValue; size: number }) {
    return <Ionicons name={name} size={size} color={color} />;
  };
}

// Bouton rond central qui dépasse de la barre, réservé au scanner.
function ScanTabButton({ onPress, style }: BottomTabBarButtonProps) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Scanner" onPress={onPress} style={[style, styles.scanTab]}>
      <View style={styles.scanCircle}>
        <Ionicons name="scan" size={30} color={colors.onAccent} />
      </View>
    </Pressable>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        sceneStyle: { backgroundColor: colors.background },
        tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.surface },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.secondary,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Accueil', tabBarIcon: tabIcon('home-outline') }} />
      <Tabs.Screen name="brands" options={{ title: 'Marques', tabBarIcon: tabIcon('pricetags-outline') }} />
      <Tabs.Screen name="scan" options={{ title: 'Scanner', tabBarButton: ScanTabButton }} />
      <Tabs.Screen name="learn" options={{ title: 'Apprendre', tabBarIcon: tabIcon('book-outline') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profil', tabBarIcon: tabIcon('person-outline') }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  scanTab: {
    alignItems: 'center',
  },
  scanCircle: {
    width: 64,
    height: 64,
    marginTop: -24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
    borderWidth: 4,
    borderColor: colors.background,
    backgroundColor: colors.accent,
  },
});
