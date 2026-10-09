import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';

const headerOscuro = {
  headerShown: true,
  headerStyle: { backgroundColor: '#0b1f2a' },
  headerTintColor: '#fff',
  headerBackTitle: 'Inicio',
};

function RootNavigator() {
  const { usuario, cargando } = useAuth();

  if (cargando) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!usuario}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="operacion" options={{ ...headerOscuro, title: 'Captura de operación' }} />
        <Stack.Screen name="mantenimiento" options={{ ...headerOscuro, title: 'Mantenimiento' }} />
        <Stack.Screen name="alertas" options={{ ...headerOscuro, title: 'Alertas' }} />
        <Stack.Screen name="admin/gestion/operacion" options={{ ...headerOscuro, title: 'Gestión · Operación' }} />
        <Stack.Screen name="admin/gestion/pozos" options={{ ...headerOscuro, title: 'Gestión · Pozos' }} />
        <Stack.Screen name="admin/gestion/mantenimiento" options={{ ...headerOscuro, title: 'Gestión · Mantenimiento' }} />
        <Stack.Screen name="admin/gestion/alertas" options={{ ...headerOscuro, title: 'Gestión · Alertas' }} />
        <Stack.Screen name="admin/visualizacion/operacion" options={{ ...headerOscuro, title: 'Visualización · Operación' }} />
        <Stack.Screen name="admin/visualizacion/pozos" options={{ ...headerOscuro, title: 'Visualización · Pozos' }} />
        <Stack.Screen name="admin/visualizacion/mantenimiento" options={{ ...headerOscuro, title: 'Visualización · Mantenimiento' }} />
        <Stack.Screen name="admin/visualizacion/alertas" options={{ ...headerOscuro, title: 'Visualización · Alertas' }} />
      </Stack.Protected>
      <Stack.Protected guard={!usuario}>
        <Stack.Screen name="login" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}