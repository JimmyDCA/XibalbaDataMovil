import { SI_NO, type SeccionConfig } from '../campos';

const MATERIAL_CABLE = ['Aluminio', 'Cobre'] as const;
const CALIBRE = ['0', '00', '000'] as const;

/** Campos de captura de mantenimiento (pozo, fecha y operador se manejan aparte en la pantalla). */
export const seccionesMantenimiento: SeccionConfig[] = [
  {
    titulo: '1. Motor',
    campos: [
      { tipo: 'opciones', clave: 'mtto_motor_tipo', etiqueta: 'Tipo de motor', opciones: ['Convencional', 'Sumergible'] },
      { tipo: 'numero', clave: 'mtto_motor_amperaje', etiqueta: 'Amperaje', unidad: 'A', min: 0, decimal: true },
      { tipo: 'serie', clave: 'mtto_motor_no_serie', etiqueta: 'No. de serie' },
      { tipo: 'numero', clave: 'mtto_motor_hp', etiqueta: 'Potencia', unidad: 'HP', min: 0, max: 150, decimal: false },
      { tipo: 'numero', clave: 'mtto_motor_kw', etiqueta: 'Potencia', unidad: 'kW', min: 0, max: 150, decimal: false },
      { tipo: 'numero', clave: 'mtto_motor_eficiencia', etiqueta: 'Eficiencia', unidad: '%', min: 0, max: 100, decimal: true },
    ],
  },
  {
    titulo: '2. Bomba y cabezal',
    campos: [
      { tipo: 'texto', clave: 'mtto_bomba_marca', etiqueta: 'Bomba: marca' },
      { tipo: 'numero', clave: 'mtto_bomba_lps', etiqueta: 'Bomba: gasto', unidad: 'L/s', min: 0, decimal: true },
      { tipo: 'numero', clave: 'mtto_bomba_rpm', etiqueta: 'Bomba: RPM', min: 0, decimal: false },
      { tipo: 'numero', clave: 'mtto_bomba_hp', etiqueta: 'Bomba: potencia', unidad: 'HP', min: 0, decimal: true },
      { tipo: 'numero', clave: 'mtto_bomba_pasos', etiqueta: 'Bomba: pasos', min: 0, decimal: false },
      { tipo: 'serie', clave: 'mtto_bomba_no_serie', etiqueta: 'Bomba: no. de serie' },
      { tipo: 'texto', clave: 'mtto_cabezal_marca', etiqueta: 'Cabezal: marca' },
      { tipo: 'numero', clave: 'mtto_cabezal_tamano', etiqueta: 'Cabezal: tamaño', min: 0, decimal: true },
      { tipo: 'serie', clave: 'mtto_cabezal_no_serie', etiqueta: 'Cabezal: no. de serie' },
      { tipo: 'opciones', clave: 'mtto_cable_bomba', etiqueta: 'Cable arrancador-bomba: material', opciones: MATERIAL_CABLE },
      { tipo: 'opciones', clave: 'mtto_calibre_bomba', etiqueta: 'Cable arrancador-bomba: calibre', opciones: CALIBRE },
      { tipo: 'numero', clave: 'mtto_longitud_bomba', etiqueta: 'Cable arrancador-bomba: longitud', unidad: 'm', min: 0, max: 30, decimal: true },
    ],
  },
  {
    titulo: '3. Equipamiento eléctrico',
    campos: [
      { tipo: 'opciones', clave: 'mtto_tablero_tipo', etiqueta: 'Tablero: tipo', opciones: ['Monofásico', 'Bifásico', 'Trifásico'] },
      { tipo: 'texto', clave: 'mtto_tablero_marca', etiqueta: 'Tablero: marca' },
      { tipo: 'serie', clave: 'mtto_tablero_no_serie', etiqueta: 'Tablero: no. de serie' },
      { tipo: 'numero', clave: 'mtto_tablero_hp', etiqueta: 'Tablero: capacidad', unidad: 'HP', min: 0, decimal: true },
      { tipo: 'numero', clave: 'mtto_tablero_voltaje', etiqueta: 'Tablero: voltaje', unidad: 'V', min: 0, decimal: false },
      { tipo: 'numero', clave: 'mtto_tablero_capacidad', etiqueta: 'Tablero: capacidad', unidad: 'A', min: 50, max: 200, decimal: false },
      { tipo: 'opciones', clave: 'mtto_trans_seco', etiqueta: 'Transformador seco', opciones: ['Elevado', 'Pedestal'] },
      { tipo: 'texto', clave: 'mtto_transformador_marca', etiqueta: 'Transformador: marca' },
      { tipo: 'opciones', clave: 'mtto_transformador_capacidad', etiqueta: 'Transformador: capacidad', unidad: 'kVA', opciones: ['120', '220', '440'], numerico: true },
      { tipo: 'opciones', clave: 'mtto_cable_transformador', etiqueta: 'Cable transformador-arrancador: material', opciones: MATERIAL_CABLE },
      { tipo: 'opciones', clave: 'mtto_calibre_arrancador', etiqueta: 'Cable transformador-arrancador: calibre', opciones: CALIBRE },
      { tipo: 'numero', clave: 'mtto_longitud_arrancador', etiqueta: 'Cable transformador-arrancador: longitud', unidad: 'm', min: 0, decimal: true },
    ],
  },
  {
    titulo: '4. Tubería y medidores',
    campos: [
      { tipo: 'opciones', clave: 'mtto_tuberia_diametro', etiqueta: 'Diámetro de tubería', unidad: 'in', opciones: ['4', '6', '8', '10', '12'], numerico: true },
      { tipo: 'numero', clave: 'mtto_tuberia_longitud', etiqueta: 'Longitud de tubería', unidad: 'm', min: 30, max: 250, decimal: false },
      { tipo: 'numero', clave: 'mtto_medidor_flujo', etiqueta: 'Medidor de flujo', unidad: 'L/s', min: 0, decimal: true },
      { tipo: 'numero', clave: 'mtto_medidor_presion', etiqueta: 'Manómetro', unidad: 'kg/cm²', min: 0, max: 10, decimal: true, decimales: 2 },
      { tipo: 'opciones', clave: 'mtto_medidor_NE', etiqueta: 'Medidor N.E.', opciones: SI_NO },
      { tipo: 'opciones', clave: 'mtto_medidor_ND', etiqueta: 'Medidor N.D.', opciones: SI_NO },
    ],
  },
  {
    titulo: '5. Instalaciones y notas',
    campos: [
      { tipo: 'opciones', clave: 'mtto_panel_solar', etiqueta: 'Panel solar', opciones: SI_NO },
      { tipo: 'opciones', clave: 'mtto_banco_baterias', etiqueta: 'Banco de baterías', opciones: SI_NO },
      { tipo: 'opciones', clave: 'mtto_sistema_tierras', etiqueta: 'Sistema de tierras', opciones: SI_NO },
      { tipo: 'opciones', clave: 'mtto_poliducto', etiqueta: 'Poliducto', opciones: SI_NO },
      { tipo: 'opciones', clave: 'mtto_sanitaria', etiqueta: 'Instalación sanitaria', opciones: SI_NO },
      { tipo: 'texto', clave: 'mtto_observaciones', etiqueta: 'Observaciones', multilinea: true },
    ],
  },
];
