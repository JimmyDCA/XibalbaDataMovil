import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import TarjetaDesplegable, { Opcion } from '../components/TarjetaDesplegable';

export default function InicioAdministrador() {
  const router = useRouter();
  const { usuario } = useAuth();

  const crearOpciones = (base: string): Opcion[] => [
    { titulo: 'Operación', icono: 'water-outline', onPress: () => router.push(`${base}/operacion` as any) },
    { titulo: 'Pozos', icono: 'location-outline', onPress: () => router.push(`${base}/pozos` as any) },
    { titulo: 'Mantenimiento', icono: 'construct-outline', onPress: () => router.push(`${base}/mantenimiento` as any) },
    { titulo: 'Alertas', icono: 'notifications-outline', onPress: () => router.push(`${base}/alertas` as any) },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.encabezado}>
        <Text style={styles.saludo}>Hola,</Text>
        <Text style={styles.nombre}>{usuario?.nombre}</Text>
      </View>

      <TarjetaDesplegable
        titulo="Gestión de datos"
        icono="create-outline"
        opciones={crearOpciones('/admin/gestion')}
      />
      <TarjetaDesplegable
        titulo="Visualización"
        icono="stats-chart-outline"
        color="#81c784"
        opciones={crearOpciones('/admin/visualizacion')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1f2a', padding: 16, gap: 16 },
  encabezado: { paddingHorizontal: 4 },
  saludo: { color: '#9bb8c7', fontSize: 14 },
  nombre: { color: '#fff', fontSize: 22, fontWeight: '700' },
});