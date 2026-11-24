import SelectBuscable from './SelectBuscable';
import type { Pozo } from '../../api/types';

type Props = {
  pozos: Pozo[];
  valor: Pozo | null;
  onCambio: (p: Pozo) => void;
  error?: string;
  cargando?: boolean;
};

export default function SelectorPozo({ pozos, valor, onCambio, error, cargando }: Props) {
  return (
    <SelectBuscable
      etiqueta="Pozo"
      obligatorio
      elementos={pozos}
      seleccionado={valor}
      onSeleccionar={onCambio}
      claveDe={(p) => String(p.id_lp)}
      tituloDe={(p) => p.l_poz_clave}
      subtituloDe={(p) => p.lp_Nombre}
      placeholder="Buscar clave o nombre del pozo"
      error={error}
      cargando={cargando}
    />
  );
}
