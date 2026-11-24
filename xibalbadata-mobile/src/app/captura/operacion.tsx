import { useState } from 'react';
import PantallaCaptura from '../../components/form/PantallaCaptura';
import TarjetaGrupo from '../../components/form/TarjetaGrupo';
import Seccion from '../../components/form/Seccion';
import CamposConfig from '../../components/form/CamposConfig';
import SelectorPozo from '../../components/form/SelectorPozo';
import SelectorOperador from '../../components/form/SelectorOperador';
import DatoFijo from '../../components/form/DatoFijo';
import { useFormulario } from '../../hooks/useFormulario';
import { useCatalogo } from '../../hooks/useCatalogo';
import { useOperadorCaptura } from '../../hooks/useOperadorCaptura';
import { useEnviarCaptura } from '../../hooks/useEnviarCaptura';
import { obtenerOperadores, obtenerPozos } from '../../api/catalogos';
import { seccionesOperacion } from '../../features/operacion/campos';
import { construirPayload } from '../../features/campos';
import { mostrarResultado } from '../../features/mostrarResultado';
import { ahoraISO } from '../../utils/fecha';
import type { Pozo } from '../../api/types';

export default function CapturaOperacion() {
  const pozos = useCatalogo(obtenerPozos);
  const operadores = useCatalogo(obtenerOperadores);
  // op_operador se guarda como nombre: el operador de la sesión siempre lo tiene.
  const operador = useOperadorCaptura(operadores.datos, false);
  const form = useFormulario(seccionesOperacion, [0, 1, 2]);
  const { enviar, guardando } = useEnviarCaptura();
  const [pozo, setPozo] = useState<Pozo | null>(null);

  const guardar = async () => {
    const op = operador.resolver();
    const extras: Record<string, string> = {};
    if (!pozo) extras.pozo = 'Selecciona el pozo';
    if (!op) extras.operador = 'Selecciona el operador';
    if (!form.validar(extras) || !pozo || !op) return;

    const payload = {
      idLp: pozo.id_lp,
      op_cpozo: pozo.l_poz_clave,
      op_operador: op.nombre,
      ...construirPayload(seccionesOperacion, form.valores),
      op_fecha_captura: ahoraISO(),
    };
    const r = await enviar('operacion', payload, pozo.l_poz_clave);
    if (mostrarResultado(r)) {
      form.reiniciar();
      setPozo(null);
      operador.reiniciar();
    }
  };

  return (
    <PantallaCaptura
      onGuardar={guardar}
      guardando={guardando}
      avisos={[pozos.desdeCache && 'Lista de pozos sin actualizar (usando la copia guardada en el teléfono).']}
    >
      <TarjetaGrupo titulo="Identificación">
        <SelectorPozo
          pozos={pozos.datos}
          cargando={pozos.cargando}
          valor={pozo}
          onCambio={(p) => { setPozo(p); form.quitarError('pozo'); }}
          error={form.errores.pozo}
        />
        {operador.mostrarSelector ? (
          <SelectorOperador
            operadores={operadores.datos}
            cargando={operadores.cargando}
            valor={operador.seleccionado}
            onCambio={(o) => { operador.setSeleccionado(o); form.quitarError('operador'); }}
            error={form.errores.operador}
          />
        ) : (
          <DatoFijo etiqueta="Operador" valor={operador.nombreSesion} />
        )}
      </TarjetaGrupo>

      {seccionesOperacion.map((s, i) => (
        <Seccion
          key={s.titulo}
          titulo={s.titulo}
          abierta={form.abiertas.has(i)}
          onAlternar={() => form.alternar(i)}
          errores={form.erroresDeSeccion(i)}
        >
          <CamposConfig campos={s.campos} valores={form.valores} errores={form.errores} onCambio={form.cambiar} />
        </Seccion>
      ))}
    </PantallaCaptura>
  );
}
