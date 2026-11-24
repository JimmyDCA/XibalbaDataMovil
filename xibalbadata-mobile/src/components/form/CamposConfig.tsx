import Entrada from './Entrada';
import Opciones from './Opciones';
import { ayudaCampo, type CampoConfig, type Errores, type Valores } from '../../features/campos';

type Props = {
  campos: CampoConfig[];
  valores: Valores;
  errores: Errores;
  onCambio: (clave: string, valor: string) => void;
};

/** Pinta una lista de campos a partir de su configuración. */
export default function CamposConfig({ campos, valores, errores, onCambio }: Props) {
  return (
    <>
      {campos.map((c) => {
        const comun = {
          etiqueta: c.etiqueta,
          obligatorio: c.obligatorio,
          ayuda: ayudaCampo(c),
          error: errores[c.clave],
          valor: valores[c.clave] ?? '',
          onCambio: (v: string) => onCambio(c.clave, v),
        };
        switch (c.tipo) {
          case 'opciones':
            return <Opciones key={c.clave} {...comun} opciones={c.opciones} />;
          case 'numero':
            return <Entrada key={c.clave} {...comun} teclado={c.decimal ? 'decimal-pad' : 'number-pad'} />;
          case 'serie':
            return <Entrada key={c.clave} {...comun} teclado="number-pad" />;
          case 'texto':
            return <Entrada key={c.clave} {...comun} multilinea={c.multilinea} />;
        }
      })}
    </>
  );
}
