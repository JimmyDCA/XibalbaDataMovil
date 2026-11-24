import { useMemo, useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Campo, { estilosEntrada } from './Campo';
import { colores, fuentes, radios } from '../../theme';

type Props<T> = {
  etiqueta: string;
  elementos: T[];
  seleccionado: T | null;
  onSeleccionar: (item: T) => void;
  claveDe: (item: T) => string;
  tituloDe: (item: T) => string;
  subtituloDe?: (item: T) => string | null | undefined;
  placeholder?: string;
  obligatorio?: boolean;
  error?: string;
  ayuda?: string;
  cargando?: boolean;
};

/** Selector con buscador en pantalla completa (cómodo para listas largas como pozos). */
export default function SelectBuscable<T>({
  etiqueta, elementos, seleccionado, onSeleccionar, claveDe, tituloDe, subtituloDe,
  placeholder = 'Seleccionar…', obligatorio, error, ayuda, cargando,
}: Props<T>) {
  const [abierto, setAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return elementos;
    return elementos.filter((e) =>
      `${tituloDe(e)} ${subtituloDe?.(e) ?? ''}`.toLowerCase().includes(q),
    );
  }, [busqueda, elementos, tituloDe, subtituloDe]);

  const cerrar = () => { setAbierto(false); setBusqueda(''); };

  return (
    <Campo etiqueta={etiqueta} obligatorio={obligatorio} error={error} ayuda={ayuda}>
      <Pressable
        onPress={() => setAbierto(true)}
        style={[estilosEntrada.entrada, styles.disparador, !!error && estilosEntrada.entradaError]}
        accessibilityRole="button"
      >
        <View style={{ flex: 1 }}>
          <Text style={[styles.valor, !seleccionado && styles.placeholder]} numberOfLines={1}>
            {seleccionado ? tituloDe(seleccionado) : cargando ? 'Cargando…' : placeholder}
          </Text>
          {seleccionado && subtituloDe?.(seleccionado) ? (
            <Text style={styles.subValor} numberOfLines={1}>{subtituloDe(seleccionado)}</Text>
          ) : null}
        </View>
        <Ionicons name="chevron-down" size={20} color={colores.primario} />
      </Pressable>

      <Modal visible={abierto} animationType="slide" onRequestClose={cerrar}>
        <SafeAreaView style={styles.modal} edges={['top', 'bottom']}>
          <View style={styles.cabecera}>
            <Text style={styles.titulo}>{etiqueta}</Text>
            <Pressable onPress={cerrar} hitSlop={12} accessibilityLabel="Cerrar">
              <Ionicons name="close" size={28} color="#fff" />
            </Pressable>
          </View>
          <View style={styles.cuerpo}>
          <TextInput
            style={[estilosEntrada.entrada, styles.buscador]}
            placeholder="Buscar…"
            placeholderTextColor={colores.textoTenue}
            value={busqueda}
            onChangeText={setBusqueda}
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
          <FlatList
            data={filtrados}
            keyExtractor={claveDe}
            keyboardShouldPersistTaps="handled"
            ItemSeparatorComponent={() => <View style={styles.separador} />}
            ListEmptyComponent={
              <Text style={styles.vacio}>
                {elementos.length === 0
                  ? 'No hay datos. Abre la app con conexión al menos una vez para descargar el catálogo.'
                  : 'Sin resultados'}
              </Text>
            }
            renderItem={({ item }) => {
              const activo = seleccionado !== null && claveDe(item) === claveDe(seleccionado);
              return (
                <Pressable
                  onPress={() => { onSeleccionar(item); cerrar(); }}
                  style={({ pressed }) => [styles.item, (activo || pressed) && styles.itemActivo]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.itemTitulo, activo && styles.itemTituloActivo]}>{tituloDe(item)}</Text>
                    {subtituloDe?.(item) ? <Text style={styles.itemSub}>{subtituloDe(item)}</Text> : null}
                  </View>
                  {activo && <Ionicons name="checkmark-circle" size={24} color={colores.primario} />}
                </Pressable>
              );
            }}
          />
          </View>
        </SafeAreaView>
      </Modal>
    </Campo>
  );
}

const styles = StyleSheet.create({
  disparador: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8 },
  valor: { fontFamily: fuentes.book, color: colores.primario, fontSize: 16 },
  subValor: { fontFamily: fuentes.book, color: colores.textoTenue, fontSize: 13 },
  placeholder: { color: colores.textoTenue },
  modal: { flex: 1, backgroundColor: colores.primario },
  cabecera: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, paddingHorizontal: 16,
  },
  titulo: { fontFamily: fuentes.heavy, color: '#fff', fontSize: 20 },
  cuerpo: {
    flex: 1, backgroundColor: colores.superficie, paddingHorizontal: 16, paddingTop: 12,
    borderTopLeftRadius: radios.panel, borderTopRightRadius: radios.panel,
  },
  buscador: { marginBottom: 8 },
  separador: { height: 1, backgroundColor: '#eef1f3' },
  item: {
    flexDirection: 'row', alignItems: 'center', minHeight: 56, paddingVertical: 10,
    paddingHorizontal: 8, gap: 12, borderRadius: radios.control,
  },
  itemActivo: { backgroundColor: colores.filaActiva },
  itemTitulo: { fontFamily: fuentes.book, color: colores.texto, fontSize: 17 },
  itemTituloActivo: { fontFamily: fuentes.heavy, color: colores.primario },
  itemSub: { fontFamily: fuentes.book, color: colores.textoTenue, fontSize: 14 },
  vacio: { fontFamily: fuentes.book, color: colores.textoTenue, textAlign: 'center', marginTop: 32, paddingHorizontal: 16 },
});
