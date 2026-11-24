import { SI_NO, type SeccionConfig } from '../campos';

/** Campos de captura de operación (el pozo y el operador se manejan aparte en la pantalla). */
export const seccionesOperacion: SeccionConfig[] = [
  {
    titulo: 'Estado del pozo',
    campos: [
      { tipo: 'opciones', clave: 'op_operando', etiqueta: '¿El pozo está operando?', opciones: SI_NO },
      { tipo: 'numero', clave: 'op_tiempo_op', etiqueta: 'Tiempo de operación', unidad: 'h', min: 0, max: 24, decimal: true, decimales: 1 },
    ],
  },
  {
    titulo: 'Niveles',
    campos: [
      { tipo: 'numero', clave: 'op_nestatico', etiqueta: 'Nivel estático', unidad: 'm', min: 0, max: 250, decimal: true, decimales: 1 },
      { tipo: 'numero', clave: 'op_ndinamico', etiqueta: 'Nivel dinámico', unidad: 'm', min: 0, max: 250, decimal: true, decimales: 1 },
    ],
  },
  {
    titulo: 'Hidráulica',
    campos: [
      { tipo: 'numero', clave: 'op_gasto', etiqueta: 'Gasto / Caudal', unidad: 'L/s', min: 0, decimal: true },
      { tipo: 'numero', clave: 'op_presion', etiqueta: 'Presión', unidad: 'PSI', min: 0, max: 10, decimal: true, decimales: 2 },
      { tipo: 'texto', clave: 'op_observaciones', etiqueta: 'Observaciones', multilinea: true },
    ],
  },
];
