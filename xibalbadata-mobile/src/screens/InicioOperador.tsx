import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import TarjetaMenu from '../components/TarjetaMenu';

export default function InicioOperador() {
  const router = useRouter();
  const { usuario, signOut } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.encabezado}>
        <View>
          <Text style={styles.saludo}>Hola,</Text>
          <Text style={styles.nombre}>{usuario?.nombre}</Text>
        </View>
      </View>

      <View style={styles.fila}>
        <TarjetaMenu
          titulo="Captura de operación"
          icono="water-outline"
          onPress={() => router.push('/operacion')}
          style={styles.rectangular}
        />
        <TarjetaMenu
          titulo="Alertas"
          icono="notifications-outline"
          color="#ffb74d"
          onPress={() => router.push('/alertas')}
          style={styles.rectangular}
        />
      </View>

      <TarjetaMenu
        titulo="Registro de mantenimiento"
        icono="construct-outline"
        color="#ff8a80"
        onPress={() => router.push('/mantenimiento')}
        style={styles.larga}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1f2a', padding: 16, gap: 16 },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  saludo: { color: '#9bb8c7', fontSize: 14 },
  nombre: { color: '#fff', fontSize: 22, fontWeight: '700' },
  salir: { color: '#ff8a80', fontSize: 15 },
  fila: { flexDirection: 'row', gap: 16 },
  rectangular: { flex: 1, height: 250 },
  larga: { flex: 1 },
});