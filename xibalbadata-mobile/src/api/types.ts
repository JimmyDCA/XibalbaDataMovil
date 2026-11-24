/** Tipos de la API. Los nombres de campo son exactamente los del JSON del backend. */

export type Pozo = {
  id_lp: number;
  l_poz_clave: string;
  lp_Nombre?: string | null;
};

export type Operador = {
  id_o: number;
  o_nombre: string;
  o_correo?: string | null;
  o_matricula?: string | null;
};

export type AlertaTipo = {
  id_alert: number;
  alert_tipo: string;
};

export type SiNo = 'Si' | 'No';

export type NuevaOperacion = {
  idLp: number;
  op_cpozo: string;
  op_operador: string; // nombre del operador (texto), igual que el web
  op_operando: SiNo | null;
  op_tiempo_op: number | null;
  op_nestatico: number | null;
  op_ndinamico: number | null;
  op_gasto: number | null;
  op_presion: number | null;
  op_observaciones: string | null;
  op_fecha_captura: string;
};

export type NuevaAlerta = {
  idLp: number;
  al_clave_de_pozo: string;
  al_tipo_de_alerta: string;
  al_operador: string; // id_o del operador como texto
  al_comentarios: string | null;
  al_fechacap: string;
};

/** Mantenimiento: muchos campos opcionales; se construye desde la configuración de campos. */
export type NuevoMantenimiento = {
  mtto_clave_pozo: string;
  mtto_fecha_captura: string;
  mtto_operador: number | null;
  [campo: `mtto_${string}`]: string | number | null;
};

export type Modulo = 'operacion' | 'mantenimiento' | 'alertas';

export const RUTA_POST: Record<Modulo, string> = {
  operacion: '/api/operacion',
  mantenimiento: '/api/mantenimiento',
  alertas: '/api/alertas_pozos',
};

export const NOMBRE_MODULO: Record<Modulo, string> = {
  operacion: 'Operación',
  mantenimiento: 'Mantenimiento',
  alertas: 'Alerta',
};
