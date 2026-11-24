import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { SincronizacionProvider } from '../offline/SincronizacionContext';
import { encabezadoStack, fuentes } from '../theme';

// Mantiene el splash visible hasta tener fuentes y sesión listas.
SplashScreen.preventAutoHideAsync();

function RootNavigator({ fuentesListas }: { fuentesListas: boolean }) {
  const { usuario, cargando } = useAuth();
  const listo = fuentesListas && !cargando;

  useEffect(() => {
    if (listo) SplashScreen.hideAsync();
  }, [listo]);

  if (!listo) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!usuario}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="captura/operacion" options={{ ...encabezadoStack, title: 'Captura de operación' }} />
        <Stack.Screen name="captura/mantenimiento" options={{ ...encabezadoStack, title: 'Mantenimiento' }} />
        <Stack.Screen name="captura/alertas" options={{ ...encabezadoStack, title: 'Nueva alerta' }} />
        <Stack.Screen name="envios" options={{ ...encabezadoStack, title: 'Envíos pendientes' }} />
      </Stack.Protected>
      <Stack.Protected guard={!usuario}>
        <Stack.Screen name="login" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const [cargadas, error] = useFonts({
    [fuentes.book]: require('../../assets/fonts/garet/Garet-Book.ttf'),
    [fuentes.heavy]: require('../../assets/fonts/garet/Garet-Heavy.ttf'),
  });

  return (
    <AuthProvider>
      <SincronizacionProvider>
        {/* Si las fuentes fallan, la app sigue con la fuente del sistema. */}
        <RootNavigator fuentesListas={cargadas || !!error} />
      </SincronizacionProvider>
    </AuthProvider>
  );
}
