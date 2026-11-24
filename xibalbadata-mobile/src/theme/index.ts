import { Platform, StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

/**
 * Sistema de diseño de XibalbaData (replicado de la web).
 * Solo existen dos pesos de fuente: Garet-Book (normal) y Garet-Heavy (negrita).
 * Con fuentes propias NO usar fontWeight: para negrita se cambia la familia a `fuentes.heavy`.
 */

export const colores = {
  primario: '#004982',
  primarioPresionado: '#003661',
  primarioOscuro: '#00243f',
  foco: '#00bcd4',

  textoSobreVidrio: '#ffffff',
  textoSobreVidrioSuave: 'rgba(255,255,255,0.8)',
  texto: '#333333',
  textoFuerte: '#0f172a',
  textoTenue: '#64748b',
  etiqueta: '#334155',

  borde: '#cbd5e1',
  divisor: '#e2e8f0',
  filaActiva: '#e0ecf7',
  superficie: '#ffffff',
  superficieSuave: '#f8fafc',

  exito: '#28a745',
  peligro: '#dc3545',
  aviso: '#ffd54f',

  /** Vidrio: azul translúcido sin blur (el blur es costoso en Android y sobre el fondo se ve casi igual). */
  vidrio: 'rgba(0,73,130,0.6)',
  vidrioClaro: 'rgba(255,255,255,0.15)',
  bordeVidrio: 'rgba(255,255,255,0.4)',
  bordeVidrioSuave: 'rgba(255,255,255,0.15)',
  overlay: 'rgba(0,0,0,0.4)',
  /** Color de respaldo mientras carga la imagen de fondo. */
  fondo: '#0b2a4a',
} as const;

export const fuentes = {
  book: 'Garet-Book',
  heavy: 'Garet-Heavy',
} as const;

export const radios = { panel: 12, menu: 8, control: 6 } as const;

export const espacios = { campo: 18, entreTarjetas: 20, panel: 16, pantalla: 16 } as const;

/** Sombra característica de paneles y botones (6,6 · blur 12 · rgba(4,4,48,0.6)). */
export const sombra: ViewStyle = Platform.select<ViewStyle>({
  ios: { shadowColor: 'rgb(4,4,48)', shadowOffset: { width: 6, height: 6 }, shadowOpacity: 0.6, shadowRadius: 6 },
  default: { elevation: 6, shadowColor: 'rgb(4,4,48)' },
});

export const sombraSuave: ViewStyle = Platform.select<ViewStyle>({
  ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8 },
  default: { elevation: 2 },
});

/** Estilos de texto reutilizables. */
export const tipografia = StyleSheet.create({
  tituloPantalla: {
    fontFamily: fuentes.book, fontSize: 28, color: colores.textoSobreVidrio, textAlign: 'center',
    textShadowColor: 'rgb(0,2,27)', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 4,
  },
  tituloTarjeta: { fontFamily: fuentes.heavy, fontSize: 20, color: colores.textoSobreVidrio },
  subtitulo: { fontFamily: fuentes.book, fontSize: 18, color: colores.textoSobreVidrio },
  cuerpo: { fontFamily: fuentes.book, fontSize: 16, lineHeight: 24, color: colores.textoSobreVidrio },
  cuerpoHeavy: { fontFamily: fuentes.heavy, fontSize: 16, color: colores.textoSobreVidrio },
  etiquetaFormulario: {
    fontFamily: fuentes.heavy, fontSize: 13, color: colores.textoSobreVidrio,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  pequeno: { fontFamily: fuentes.book, fontSize: 12, color: colores.textoSobreVidrioSuave },
  boton: { fontFamily: fuentes.heavy, fontSize: 16, color: '#ffffff' },
}) satisfies Record<string, TextStyle>;

/** Estilos de contenedores reutilizables. */
export const superficies = StyleSheet.create({
  /** Panel de vidrio con la luz entrando por arriba a la izquierda. */
  panelVidrio: {
    backgroundColor: colores.vidrio,
    borderRadius: radios.panel,
    borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1,
    borderTopColor: colores.bordeVidrio, borderLeftColor: colores.bordeVidrio,
    borderRightColor: colores.bordeVidrioSuave, borderBottomColor: colores.bordeVidrioSuave,
    ...sombra,
  },
  tarjetaBlanca: {
    backgroundColor: colores.superficie,
    borderRadius: radios.panel,
    borderWidth: 1,
    borderColor: colores.divisor,
    ...sombraSuave,
  },
  botonPrimario: {
    backgroundColor: colores.primario,
    borderRadius: radios.control,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    minHeight: 52,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    ...sombra,
  },
  botonOutline: {
    backgroundColor: 'transparent',
    borderRadius: radios.control,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    minHeight: 44,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  entrada: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: radios.control,
    borderWidth: 1,
    borderColor: colores.borde,
    minHeight: 50,
    paddingHorizontal: 12,
  },
});

/** Opciones de encabezado del Stack: AppBar blanco con título azul. */
export const encabezadoStack = {
  headerShown: true,
  headerStyle: { backgroundColor: colores.superficie },
  headerTintColor: colores.primario,
  headerTitleStyle: { fontFamily: fuentes.heavy, fontSize: 18, color: colores.primario },
  headerBackTitleStyle: { fontFamily: fuentes.book },
  headerBackTitle: 'Inicio',
  headerShadowVisible: true,
} as const;
