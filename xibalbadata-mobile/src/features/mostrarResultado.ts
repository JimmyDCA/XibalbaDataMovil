import { Alert } from 'react-native';
import type { ResultadoCaptura } from '../hooks/useEnviarCaptura';

/** Mensaje al usuario después de guardar. Devuelve true si el formulario debe limpiarse. */
export function mostrarResultado(r: ResultadoCaptura | null, alAceptar?: () => void): boolean {
  if (!r) return false;
  if (r.tipo === 'enviado') {
    Alert.alert('Enviado', 'La captura se registró correctamente.', [{ text: 'OK', onPress: alAceptar }]);
  } else if (r.tipo === 'en_cola') {
    Alert.alert(
      'Guardado en el teléfono',
      'No hay conexión con el servidor. La captura se enviará automáticamente cuando haya señal.',
      [{ text: 'OK', onPress: alAceptar }],
    );
  } else {
    Alert.alert(
      'El servidor rechazó la captura',
      `${r.mensaje}\n\nQuedó guardada en "Envíos pendientes" para reintentar o descartar.`,
      [{ text: 'OK', onPress: alAceptar }],
    );
  }
  return true;
}
