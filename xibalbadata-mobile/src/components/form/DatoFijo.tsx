import { Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Campo from './Campo';
import { colores, fuentes, radios } from '../../theme';

/** Valor que el usuario no puede cambiar (ej. el operador de la sesión). */
export default function DatoFijo({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <Campo etiqueta={etiqueta}>
      <View style={styles.caja}>
        <Ionicons name="person-circle" size={24} color={colores.textoSobreVidrio} />
        <Text style={styles.texto}>{valor}</Text>
      </View>
    </Campo>
  );
}

const styles = StyleSheet.create({
  caja: {
    flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 50, paddingHorizontal: 12,
    borderRadius: radios.control, backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)',
  },
  texto: { fontFamily: fuentes.heavy, color: colores.textoSobreVidrio, fontSize: 16 },
});
