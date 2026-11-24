import type { ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet, LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colores, fuentes, superficies, tipografia } from '../../theme';

type Props = {
  titulo: string;
  abierta: boolean;
  onAlternar: () => void;
  /** Número de campos con error dentro de la sección (se muestra aunque esté cerrada). */
  errores?: number;
  children: ReactNode;
};

/** Panel de vidrio colapsable para agrupar campos. */
export default function Seccion({ titulo, abierta, onAlternar, errores = 0, children }: Props) {
  const alternar = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onAlternar();
  };

  return (
    <View style={[superficies.panelVidrio, errores > 0 && styles.conError]}>
      <Pressable onPress={alternar} style={styles.encabezado} accessibilityRole="button">
        <Text style={[tipografia.tituloTarjeta, styles.titulo]}>{titulo}</Text>
        {errores > 0 && (
          <View style={styles.insignia}>
            <Text style={styles.insigniaTexto}>{errores}</Text>
          </View>
        )}
        <Ionicons name={abierta ? 'chevron-up' : 'chevron-down'} size={22} color={colores.textoSobreVidrio} />
      </Pressable>
      {abierta && <View style={styles.contenido}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  conError: { borderColor: colores.peligro, borderTopColor: colores.peligro, borderLeftColor: colores.peligro, borderRightColor: colores.peligro, borderBottomColor: colores.peligro, borderWidth: 2 },
  encabezado: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, minHeight: 56 },
  titulo: { flex: 1, fontSize: 18 },
  insignia: {
    backgroundColor: colores.peligro, borderRadius: 12, minWidth: 24, height: 24,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6,
  },
  insigniaTexto: { fontFamily: fuentes.heavy, color: '#fff', fontSize: 13 },
  contenido: { paddingHorizontal: 16, paddingBottom: 18, gap: 18 },
});
