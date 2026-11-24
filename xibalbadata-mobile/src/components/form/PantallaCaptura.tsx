import type { ReactNode } from 'react';
import {
  View, Text, ScrollView, Pressable, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FondoPantalla from '../FondoPantalla';
import { colores, fuentes, radios, superficies, tipografia } from '../../theme';
import { useSincronizacion } from '../../offline/SincronizacionContext';

type Props = {
  children: ReactNode;
  onGuardar: () => void;
  guardando: boolean;
  /** Mensajes informativos arriba del formulario (ej. catálogos sin actualizar). */
  avisos?: (string | false | null | undefined)[];
};

/** Contenedor común de las pantallas de captura: fondo, avisos de conexión y botón Guardar fijo abajo. */
export default function PantallaCaptura({ children, onGuardar, guardando, avisos = [] }: Props) {
  const { conectado } = useSincronizacion();
  const mensajes = [
    !conectado && 'Sin señal: la captura se guardará en el teléfono y se enviará al recuperar la conexión.',
    ...avisos,
  ].filter(Boolean) as string[];

  return (
    <FondoPantalla barraEstado="dark">
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
          <ScrollView
            contentContainerStyle={styles.contenido}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            {mensajes.map((m) => (
              <View key={m} style={styles.aviso}>
                <Ionicons name="information-circle" size={20} color={colores.aviso} />
                <Text style={styles.avisoTexto}>{m}</Text>
              </View>
            ))}
            {children}
          </ScrollView>

          <View style={styles.pie}>
            <Pressable
              style={({ pressed }) => [
                superficies.botonPrimario,
                (pressed || guardando) && { backgroundColor: colores.primarioPresionado },
              ]}
              onPress={onGuardar}
              disabled={guardando}
              accessibilityRole="button"
            >
              {guardando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="save" size={22} color="#fff" />
                  <Text style={[tipografia.boton, { fontSize: 17 }]}>Guardar captura</Text>
                </>
              )}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </FondoPantalla>
  );
}

const styles = StyleSheet.create({
  contenido: { padding: 16, gap: 20, paddingBottom: 32 },
  aviso: {
    flexDirection: 'row', gap: 8, alignItems: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: radios.menu, padding: 12,
    borderWidth: 1, borderColor: 'rgba(255,213,79,0.6)',
  },
  avisoTexto: { flex: 1, fontFamily: fuentes.book, color: colores.aviso, fontSize: 14, lineHeight: 20 },
  pie: {
    padding: 16, paddingTop: 12, backgroundColor: colores.superficie,
    borderTopWidth: 1, borderTopColor: colores.divisor,
  },
});
