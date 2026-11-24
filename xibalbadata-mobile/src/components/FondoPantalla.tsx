import type { ReactNode } from 'react';
import { ImageBackground, StyleSheet, type ViewStyle } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colores } from '../theme';

const FONDO = require('../../assets/images/fondo_iitca.png');

type Props = {
  children: ReactNode;
  style?: ViewStyle;
  /** 'light' para pantallas sin encabezado (texto de la barra de estado sobre la foto azul). */
  barraEstado?: 'light' | 'dark';
};

/** Fondo de la app: foto aérea del IITCA teñida de azul. */
export default function FondoPantalla({ children, style, barraEstado = 'light' }: Props) {
  return (
    <ImageBackground source={FONDO} style={[styles.fondo, style]} resizeMode="cover">
      <StatusBar style={barraEstado} />
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: colores.fondo },
});
