import { Pressable, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colores, fuentes, radios, superficies } from '../theme';
import { useSincronizacion } from '../offline/SincronizacionContext';

/** Franja del inicio: capturas por enviar / con error. No se muestra si todo está enviado. */
export default function EstadoSincronizacion() {
  const router = useRouter();
  const { pendientes, errores, enviando, conectado } = useSincronizacion();
  if (pendientes === 0 && errores === 0) return null;

  const hayErrores = errores > 0;
  const color = hayErrores ? colores.peligro : colores.primario;
  const partes = [
    pendientes > 0 && `${pendientes} ${pendientes === 1 ? 'captura' : 'capturas'} por enviar`,
    hayErrores && `${errores} con error`,
  ].filter(Boolean).join(' · ');

  return (
    <Pressable
      onPress={() => router.push('/envios')}
      style={({ pressed }) => [superficies.tarjetaBlanca, styles.franja, { borderLeftColor: color }, pressed && { opacity: 0.8 }]}
      accessibilityRole="button"
    >
      {enviando ? (
        <ActivityIndicator color={color} />
      ) : (
        <Ionicons name={hayErrores ? 'alert-circle' : 'cloud-offline'} size={26} color={color} />
      )}
      <View style={{ flex: 1 }}>
        <Text style={[styles.texto, { color }]}>{partes}</Text>
        <Text style={styles.sub}>
          {enviando ? 'Enviando…' : conectado ? 'Toca para ver o enviar ahora' : 'Se enviarán al recuperar la señal'}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colores.textoTenue} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  franja: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, minHeight: 60,
    borderLeftWidth: 5, borderRadius: radios.menu,
  },
  texto: { fontFamily: fuentes.heavy, fontSize: 15 },
  sub: { fontFamily: fuentes.book, color: colores.textoTenue, fontSize: 13, marginTop: 2 },
});
