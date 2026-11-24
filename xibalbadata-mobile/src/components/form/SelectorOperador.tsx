import SelectBuscable from './SelectBuscable';
import type { Operador } from '../../api/types';

type Props = {
  operadores: Operador[];
  valor: Operador | null;
  onCambio: (o: Operador) => void;
  error?: string;
  ayuda?: string;
  cargando?: boolean;
};

export default function SelectorOperador({ operadores, valor, onCambio, error, ayuda, cargando }: Props) {
  return (
    <SelectBuscable
      etiqueta="Operador"
      obligatorio
      elementos={operadores}
      seleccionado={valor}
      onSeleccionar={onCambio}
      claveDe={(o) => String(o.id_o)}
      tituloDe={(o) => o.o_nombre}
      subtituloDe={(o) => o.o_matricula ?? o.o_correo}
      placeholder="Seleccionar operador"
      error={error}
      ayuda={ayuda}
      cargando={cargando}
    />
  );
}
