import { View, Pressable, Text, StyleSheet } from 'react-native';
import Campo from './Campo';
import { colores, fuentes, radios } from '../../theme';

type Props = {
  etiqueta: string;
  opciones: readonly string[];
  valor: string;
  onCambio: (v: string) => void;
  obligatorio?: boolean;
  ayuda?: string;
  error?: string;
};

/** Botones para elegir una opción. Tocar la opción elegida la quita (campos opcionales). */
export default function Opciones({ etiqueta, opciones, valor, onCambio, obligatorio, ayuda, error }: Props) {
  return (
    <Campo etiqueta={etiqueta} obligatorio={obligatorio} ayuda={ayuda} error={error}>
      <View style={styles.fila}>
        {opciones.map((op) => {
          const activa = op === valor;
          return (
            <Pressable
              key={op}
              onPress={() => onCambio(activa && !obligatorio ? '' : op)}
              style={({ pressed }) => [styles.opcion, activa && styles.activa, pressed && styles.presionada]}
              accessibilityRole="radio"
              accessibilityState={{ selected: activa }}
            >
              <Text style={[styles.texto, activa && styles.textoActivo]}>{op}</Text>
            </Pressable>
          );
        })}
      </View>
    </Campo>
  );
}

const styles = StyleSheet.create({
  fila: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  opcion: {
    minHeight: 48,
    minWidth: 64,
    paddingHorizontal: 18,
    borderRadius: radios.control,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activa: { backgroundColor: colores.superficie, borderColor: colores.superficie },
  presionada: { transform: [{ scale: 0.97 }] },
  texto: { fontFamily: fuentes.book, color: colores.textoSobreVidrio, fontSize: 16 },
  textoActivo: { fontFamily: fuentes.heavy, color: colores.primario },
});
