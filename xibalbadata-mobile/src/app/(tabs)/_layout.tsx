import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colores, fuentes } from '../../theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colores.primario,
        tabBarInactiveTintColor: colores.textoTenue,
        tabBarLabelStyle: { fontFamily: fuentes.heavy, fontSize: 12 },
        tabBarStyle: { backgroundColor: colores.superficie, borderTopColor: colores.divisor },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
