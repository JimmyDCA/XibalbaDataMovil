import { View, Text, FlatList, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FondoPantalla from '../components/FondoPantalla';
import { colores, fuentes, radios, superficies } from '../theme';
import { useSincronizacion } from '../offline/SincronizacionContext';
import { descartar, marcarParaReintento, type ElementoCola } from '../offline/cola';
import { NOMBRE_MODULO } from '../api/types';
import { formatearFecha } from '../utils/fecha';

const ICONO = {
  operacion: 'water-outline',
  mantenimiento: 'construct-outline',
  alertas: 'notifications-outline',
} as const;

function Elemento({ item, onReintentar }: { item: ElementoCola; onReintentar: () => void }) {
  const conError = item.estado === 'error';

  const confirmarDescarte = () =>
    Alert.alert(
      'Descartar captura',
      'Se eliminará del teléfono y NO se enviará. Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Descartar', style: 'destructive', onPress: () => descartar(item.idLocal) },
      ],
    );

  return (
    <View style={[styles.tarjeta, conError && styles.tarjetaError]}>
      <View style={styles.fila}>
        <Ionicons name={ICONO[item.modulo]} size={26} color={conError ? colores.peligro : colores.primario} />
        <View style={{ flex: 1 }}>
          <Text style={styles.titulo}>{NOMBRE_MODULO[item.modulo]} · {item.resumen}</Text>
          <Text style={styles.sub}>Capturado: {formatearFecha(item.creadoEn)}</Text>
          <Text style={[styles.estado, conError && { color: colores.peligro }]}>
            {conError ? 'Rechazado por el servidor' : 'Esperando señal'}
            {item.intentos > 0 ? ` · ${item.intentos} intento(s)` : ''}
          </Text>
          {item.ultimoError ? <Text style={styles.detalleError}>{item.ultimoError}</Text> : null}
        </View>
      </View>
      <View style={styles.acciones}>
        <Pressable style={({ pressed }) => [styles.boton, styles.botonSecundario, pressed && { backgroundColor: colores.superficieSuave }]} onPress={confirmarDescarte}>
          <Text style={styles.botonTextoSec}>Descartar</Text>
        </Pressable>
        {conError && (
          <Pressable style={({ pressed }) => [styles.boton, pressed && { backgroundColor: colores.primarioPresionado }]} onPress={onReintentar}>
            <Text style={styles.botonTexto}>Reintentar</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

export default function Envios() {
  const { cola, enviando, conectado, sincronizarAhora } = useSincronizacion();

  const reintentar = async (idLocal: string) => {
    await marcarParaReintento(idLocal);
    await sincronizarAhora();
  };

  return (
    <FondoPantalla barraEstado="dark">
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <FlatList
        data={cola}
        keyExtractor={(e) => e.idLocal}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={
          cola.length > 0 ? (
            <Pressable
              style={({ pressed }) => [
                superficies.botonPrimario,
                styles.botonPrincipal,
                (pressed || enviando) && { backgroundColor: colores.primarioPresionado },
                !conectado && { opacity: 0.7 },
              ]}
              onPress={() => sincronizarAhora()}
              disabled={enviando}
            >
              {enviando ? <ActivityIndicator color="#fff" /> : <Ionicons name="cloud-upload-outline" size={22} color="#fff" />}
              <Text style={styles.botonTexto}>
                {enviando ? 'Enviando…' : conectado ? 'Enviar ahora' : 'Sin señal · Intentar de todos modos'}
              </Text>
            </Pressable>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Ionicons name="checkmark-done-circle" size={64} color="#fff" />
            <Text style={styles.vacioTexto}>Todo enviado. No hay capturas pendientes.</Text>
          </View>
        }
        renderItem={({ item }) => <Elemento item={item} onReintentar={() => reintentar(item.idLocal)} />}
      />
    </SafeAreaView>
    </FondoPantalla>
  );
}

const styles = StyleSheet.create({
  lista: { padding: 16, gap: 12, flexGrow: 1 },
  tarjeta: { ...superficies.tarjetaBlanca, padding: 14, gap: 12, borderLeftWidth: 5, borderLeftColor: colores.primario },
  tarjetaError: { borderLeftColor: colores.peligro },
  fila: { flexDirection: 'row', gap: 12 },
  titulo: { fontFamily: fuentes.heavy, color: colores.primario, fontSize: 16 },
  sub: { fontFamily: fuentes.book, color: colores.textoTenue, fontSize: 12, marginTop: 2 },
  estado: { fontFamily: fuentes.heavy, color: colores.etiqueta, fontSize: 13, marginTop: 4 },
  detalleError: { fontFamily: fuentes.book, color: colores.texto, fontSize: 12, marginTop: 4 },
  acciones: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  boton: {
    backgroundColor: colores.primario, borderRadius: radios.control, minHeight: 44,
    paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center',
  },
  botonSecundario: { backgroundColor: colores.superficie, borderWidth: 1, borderColor: colores.borde },
  botonTexto: { fontFamily: fuentes.heavy, color: '#fff', fontSize: 15 },
  botonTextoSec: { fontFamily: fuentes.book, color: colores.texto, fontSize: 15 },
  botonPrincipal: { marginBottom: 4 },
  vacio: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingTop: 80 },
  vacioTexto: {
    fontFamily: fuentes.book, color: '#fff', fontSize: 17, textAlign: 'center',
    textShadowColor: 'rgb(0,2,27)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3,
  },
});
