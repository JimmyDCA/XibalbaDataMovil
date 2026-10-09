import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export type Opcion = {
  titulo: string;
  icono: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

type Props = {
  titulo: string;
  icono: keyof typeof Ionicons.glyphMap;
  color?: string;
  opciones: Opcion[];
};

export default function TarjetaDesplegable({ titulo, icono, color = '#4fc3f7', opciones }: Props) {
  const [abierta, setAbierta] = useState(false);

  const alternar = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAbierta((v) => !v);
  };

  return (
    <View style={styles.tarjeta}>
      <Pressable onPress={alternar} style={styles.encabezado}>
        <Ionicons name={icono} size={30} color={color} />
        <Text style={styles.titulo}>{titulo}</Text>
        <Ionicons name={abierta ? 'chevron-up' : 'chevron-down'} size={22} color="#9bb8c7" />
      </Pressable>

      {abierta && (
        <View style={styles.lista}>
          {opciones.map((op) => (
            <Pressable
              key={op.titulo}
              onPress={op.onPress}
              style={({ pressed }) => [styles.opcion, pressed && styles.presionada]}
            >
              <Ionicons name={op.icono} size={22} color={color} />
              <Text style={styles.opcionTexto}>{op.titulo}</Text>
              <Ionicons name="chevron-forward" size={18} color="#7f9aa8" />
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 24,
    overflow: 'hidden',
  },
  encabezado: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 20 },
  titulo: { flex: 1, color: '#fff', fontSize: 19, fontWeight: '600' },
  lista: { paddingHorizontal: 12, paddingBottom: 12, gap: 8 },
  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  presionada: { opacity: 0.6 },
  opcionTexto: { flex: 1, color: '#fff', fontSize: 16 },
});