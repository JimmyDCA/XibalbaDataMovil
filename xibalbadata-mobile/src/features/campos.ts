/**
 * Configuración declarativa de los campos de captura.
 * Un solo lugar define etiqueta, tipo, rango y opciones; de ahí salen el render,
 * la validación y el JSON que se envía al backend.
 */

type Base = { clave: string; etiqueta: string; obligatorio?: boolean };

export type CampoConfig =
  | (Base & { tipo: 'texto'; multilinea?: boolean })
  | (Base & {
      tipo: 'numero';
      unidad?: string;
      min?: number;
      max?: number;
      /** false = solo enteros. */
      decimal: boolean;
      /** Máximo de decimales permitidos (ej. 0.01 → 2). */
      decimales?: number;
    })
  /** Opciones fijas. `numerico` envía el valor como número (columna entera en el backend). */
  | (Base & { tipo: 'opciones'; opciones: readonly string[]; numerico?: boolean; unidad?: string })
  /** Número de serie: solo dígitos, se envía como número entero. */
  | (Base & { tipo: 'serie' });

export type SeccionConfig = { titulo: string; campos: CampoConfig[] };

export type Valores = Record<string, string>;
export type Errores = Record<string, string>;

export const SI_NO = ['Si', 'No'] as const;

/** Texto de ayuda bajo el campo: unidad y rango permitido. */
export function ayudaCampo(c: CampoConfig): string | undefined {
  if (c.tipo === 'numero') {
    const partes: string[] = [];
    if (c.unidad) partes.push(c.unidad);
    if (c.min !== undefined && c.max !== undefined) partes.push(`${c.min} – ${c.max}`);
    else if (c.min !== undefined) partes.push(`mín. ${c.min}`);
    if (!c.decimal) partes.push('entero');
    return partes.join(' · ') || undefined;
  }
  if (c.tipo === 'serie') return 'Solo números';
  if (c.tipo === 'opciones' && c.unidad) return c.unidad;
  return undefined;
}

/** Acepta coma o punto como separador decimal. */
export const normalizarNumero = (texto: string) => texto.trim().replace(',', '.');

export function validarCampo(c: CampoConfig, crudo: string | undefined): string | undefined {
  const valor = (crudo ?? '').trim();
  if (!valor) return c.obligatorio ? 'Campo obligatorio' : undefined;

  if (c.tipo === 'serie') {
    if (!/^\d+$/.test(valor)) return 'Solo se permiten números (sin letras ni guiones)';
    if (valor.length > 15) return 'Máximo 15 dígitos';
    return undefined;
  }

  if (c.tipo === 'numero') {
    const n = normalizarNumero(valor);
    const patron = c.decimal ? /^-?\d+(\.\d+)?$/ : /^-?\d+$/;
    if (!patron.test(n)) return c.decimal ? 'Número no válido' : 'Debe ser un número entero';
    const num = Number(n);
    if (c.min !== undefined && num < c.min) return `Mínimo ${c.min}`;
    if (c.max !== undefined && num > c.max) return `Máximo ${c.max}`;
    if (c.decimales !== undefined) {
      const dec = n.split('.')[1];
      if (dec && dec.length > c.decimales) return `Máximo ${c.decimales} decimales`;
    }
  }
  return undefined;
}

export function validarSecciones(secciones: SeccionConfig[], valores: Valores): Errores {
  const errores: Errores = {};
  for (const s of secciones) {
    for (const c of s.campos) {
      const e = validarCampo(c, valores[c.clave]);
      if (e) errores[c.clave] = e;
    }
  }
  return errores;
}

/** Convierte los textos capturados al tipo que espera el backend (vacío → null). */
export function construirPayload(secciones: SeccionConfig[], valores: Valores): Record<string, string | number | null> {
  const payload: Record<string, string | number | null> = {};
  for (const s of secciones) {
    for (const c of s.campos) {
      const valor = (valores[c.clave] ?? '').trim();
      if (!valor) { payload[c.clave] = null; continue; }
      if (c.tipo === 'numero') payload[c.clave] = Number(normalizarNumero(valor));
      else if (c.tipo === 'serie') payload[c.clave] = Number(valor);
      else if (c.tipo === 'opciones' && c.numerico) payload[c.clave] = Number(valor);
      else payload[c.clave] = valor;
    }
  }
  return payload;
}
