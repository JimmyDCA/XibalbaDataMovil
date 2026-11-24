import type { SeccionConfig } from '../campos';

/** Pozo, tipo de alerta y operador se manejan aparte en la pantalla (vienen de catálogos). */
export const seccionesAlerta: SeccionConfig[] = [
  {
    titulo: 'Detalle',
    campos: [
      { tipo: 'texto', clave: 'al_comentarios', etiqueta: 'Observaciones', multilinea: true },
    ],
  },
];
