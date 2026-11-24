import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import TarjetaMenu from '../components/TarjetaMenu';
import EstadoSincronizacion from '../components/EstadoSincronizacion';
import FondoPantalla from '../components/FondoPantalla';
import Logos from '../components/Logos';
import { tipografia } from '../theme';

/** Inicio común para operador y administrador: accesos a la captura en campo. */
export default function Inicio() {
  const router = useRouter();
  const { usuario } = useAuth();

  return (
    <FondoPantalla>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={styles.contenido}>
          <Logos />

          <View style={styles.encabezado}>
            <Text style={tipografia.subtitulo}>Hola,</Text>
            <Text style={[tipografia.tituloPantalla, styles.nombre]}>{usuario?.nombre}</Text>
          </View>

          <EstadoSincronizacion />

          <View style={styles.fila}>
            <TarjetaMenu
              titulo="Operación"
              descripcion="Niveles, gasto y presión"
              icono="water-outline"
              onPress={() => router.push('/captura/operacion')}
              style={styles.cuadrada}
            />
            <TarjetaMenu
              titulo="Alertas"
              descripcion="Reportar un problema"
              icono="notifications-outline"
              onPress={() => router.push('/captura/alertas')}
              style={styles.cuadrada}
            />
          </View>

          <TarjetaMenu
            titulo="Mantenimiento"
            descripcion="Motor, bomba, equipo eléctrico y tubería"
            icono="construct-outline"
            onPress={() => router.push('/captura/mantenimiento')}
            style={styles.larga}
          />
        </ScrollView>
      </SafeAreaView>
    </FondoPantalla>
  );
}

const styles = StyleSheet.create({
  contenido: { padding: 16, gap: 20, flexGrow: 1 },
  encabezado: { alignItems: 'flex-start', gap: 2 },
  nombre: { textAlign: 'left' },
  fila: { flexDirection: 'row', gap: 16 },
  cuadrada: { flex: 1, minHeight: 200 },
  larga: { minHeight: 180 },
});
