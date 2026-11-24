import { Pressable, Text, StyleSheet, View, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colores, superficies, tipografia } from '../theme';

type Props = {
  titulo: string;
  descripcion?: string;
  icono: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  style?: ViewStyle;
};

/** Tarjeta de menú de vidrio con ícono en círculo blanco. */
export default function TarjetaMenu({ titulo, descripcion, icono, onPress, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        superficies.panelVidrio,
        styles.tarjeta,
        pressed && styles.presionada,
        style,
      ]}
      accessibilityRole="button"
    >
      <View style={styles.circulo}>
        <Ionicons name={icono} size={38} color={colores.primario} />
      </View>
      <Text style={[tipografia.tituloTarjeta, styles.titulo]}>{titulo}</Text>
      {descripcion ? <Text style={[tipografia.pequeno, styles.descripcion]}>{descripcion}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: { padding: 16, alignItems: 'center', justifyContent: 'center', gap: 10 },
  presionada: { transform: [{ translateY: -3 }], backgroundColor: 'rgba(0,54,97,0.8)' },
  circulo: {
    width: 76, height: 76, borderRadius: 38,
    backgroundColor: colores.superficie, borderWidth: 2, borderColor: colores.superficie,
    alignItems: 'center', justifyContent: 'center',
  },
  titulo: { textAlign: 'center', fontSize: 18 },
  descripcion: { textAlign: 'center', fontSize: 13 },
});
