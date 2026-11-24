import Storage from 'expo-sqlite/kv-store';

/** Lectura/escritura de JSON en el almacén local (persiste entre reinicios de la app). */
export async function leerJSON<T>(clave: string, porDefecto: T): Promise<T> {
  try {
    const valor = await Storage.getItem(clave);
    return valor ? (JSON.parse(valor) as T) : porDefecto;
  } catch {
    return porDefecto;
  }
}

export async function guardarJSON(clave: string, valor: unknown) {
  await Storage.setItem(clave, JSON.stringify(valor));
}
