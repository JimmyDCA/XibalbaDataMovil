import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  titulo: string;
  icono: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  color?: string;
  style?: ViewStyle;
};

export default function TarjetaMenu({ titulo, icono, onPress, color = '#4fc3f7', style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.tarjeta, pressed && styles.presionada, style]}
    >
      <Ionicons name={icono} size={44} color={color} />
      <Text style={styles.titulo}>{titulo}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  presionada: { opacity: 0.7, transform: [{ scale: 0.98 }] },
  titulo: { color: '#fff', fontSize: 17, fontWeight: '600', textAlign: 'center' },
});