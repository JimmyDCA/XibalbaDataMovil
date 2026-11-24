import type { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colores, fuentes, superficies, tipografia } from '../../theme';

type Props = {
  etiqueta: string;
  obligatorio?: boolean;
  ayuda?: string;
  error?: string;
  children: ReactNode;
};

/** Envoltura común: etiqueta (blanca, Heavy, mayúsculas), control, ayuda y error. */
export default function Campo({ etiqueta, obligatorio, ayuda, error, children }: Props) {
  return (
    <View style={styles.campo}>
      <Text style={tipografia.etiquetaFormulario}>
        {etiqueta}
        {obligatorio && <Text style={styles.obligatorio}> *</Text>}
      </Text>
      {children}
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : ayuda ? (
        <Text style={styles.ayuda}>{ayuda}</Text>
      ) : null}
    </View>
  );
}

export const estilosEntrada = StyleSheet.create({
  entrada: {
    ...superficies.entrada,
    color: colores.primario,
    fontFamily: fuentes.book,
    fontSize: 16,
  },
  entradaError: { borderColor: colores.peligro, borderWidth: 2 },
  texto: { fontFamily: fuentes.book, fontSize: 16, color: colores.primario },
});

const styles = StyleSheet.create({
  campo: { gap: 6 },
  obligatorio: { color: colores.aviso },
  ayuda: { fontFamily: fuentes.book, color: colores.textoSobreVidrioSuave, fontSize: 12 },
  error: { fontFamily: fuentes.heavy, color: colores.aviso, fontSize: 13 },
});
