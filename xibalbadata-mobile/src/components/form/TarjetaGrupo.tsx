import type { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { superficies, tipografia } from '../../theme';

/** Panel de vidrio fijo (no colapsable) para los datos principales del formulario. */
export default function TarjetaGrupo({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <View style={[superficies.panelVidrio, styles.panel]}>
      <Text style={[tipografia.tituloTarjeta, styles.titulo]}>{titulo}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { padding: 16, gap: 18 },
  titulo: { fontSize: 18 },
});
