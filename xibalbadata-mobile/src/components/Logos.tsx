import { View, Image, StyleSheet } from 'react-native';
import { colores, radios, sombraSuave } from '../theme';

const IITCA = require('../../assets/images/iitca_logo.png');
const XIBALBA = require('../../assets/images/xibalba_logo.png');

/** Barra blanca con los logos IITCA | Xibalba (como el encabezado de la web). */
export default function Logos({ alto = 40 }: { alto?: number }) {
  return (
    <View style={styles.barra}>
      <Image source={IITCA} style={[styles.logo, { height: alto }]} resizeMode="contain" accessibilityLabel="IITCA" />
      <View style={[styles.separador, { height: alto * 0.8 }]} />
      <Image source={XIBALBA} style={[styles.logo, { height: alto }]} resizeMode="contain" accessibilityLabel="Xibalba" />
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 14,
    backgroundColor: colores.superficie, borderRadius: radios.panel,
    paddingVertical: 10, paddingHorizontal: 16, alignSelf: 'stretch',
    ...sombraSuave,
  },
  logo: { flex: 1, maxWidth: 140 },
  separador: { width: 2, backgroundColor: colores.primario },
});
