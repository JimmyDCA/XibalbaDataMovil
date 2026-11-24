import { useState } from 'react';
import { Alert } from 'react-native';
import { validarSecciones, type Errores, type SeccionConfig, type Valores } from '../features/campos';

/**
 * Estado de un formulario guiado por secciones: valores, errores y secciones abiertas.
 * `extras` permite agregar errores de campos manejados fuera de la configuración (pozo, operador, fecha).
 */
export function useFormulario(secciones: SeccionConfig[], abiertasIniciales: number[] = [0]) {
  const [valores, setValores] = useState<Valores>({});
  const [errores, setErrores] = useState<Errores>({});
  const [abiertas, setAbiertas] = useState<Set<number>>(new Set(abiertasIniciales));

  const quitarError = (clave: string) =>
    setErrores((e) => {
      if (!e[clave]) return e;
      const resto = { ...e };
      delete resto[clave];
      return resto;
    });

  const cambiar = (clave: string, valor: string) => {
    setValores((v) => ({ ...v, [clave]: valor }));
    quitarError(clave); // al corregir un campo se quita su error
  };

  const alternar = (i: number) =>
    setAbiertas((a) => {
      const n = new Set(a);
      if (n.has(i)) n.delete(i); else n.add(i);
      return n;
    });

  const erroresDeSeccion = (i: number) =>
    secciones[i].campos.filter((c) => errores[c.clave]).length;

  /** Valida todo; si hay errores abre las secciones afectadas y avisa. Devuelve true si es válido. */
  const validar = (extras: Errores = {}) => {
    const todos = { ...extras, ...validarSecciones(secciones, valores) };
    setErrores(todos);
    const claves = Object.keys(todos);
    if (claves.length === 0) return true;

    setAbiertas((a) => {
      const n = new Set(a);
      secciones.forEach((s, i) => { if (s.campos.some((c) => todos[c.clave])) n.add(i); });
      return n;
    });
    const etiquetas = new Map<string, string>(secciones.flatMap((s) => s.campos.map((c) => [c.clave, c.etiqueta] as const)));
    const lista = claves.slice(0, 5)
      .map((k) => (etiquetas.has(k) ? `• ${etiquetas.get(k)}: ${todos[k]}` : `• ${todos[k]}`))
      .join('\n');
    Alert.alert(
      claves.length === 1 ? 'Revisa 1 campo' : `Revisa ${claves.length} campos`,
      lista + (claves.length > 5 ? '\n…' : ''),
    );
    return false;
  };

  const reiniciar = () => {
    setValores({});
    setErrores({});
    setAbiertas(new Set(abiertasIniciales));
  };

  return { valores, errores, abiertas, cambiar, quitarError, alternar, erroresDeSeccion, validar, reiniciar };
}
