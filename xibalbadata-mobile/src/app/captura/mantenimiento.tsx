import { useState } from 'react';
import PantallaCaptura from '../../components/form/PantallaCaptura';
import TarjetaGrupo from '../../components/form/TarjetaGrupo';
import Seccion from '../../components/form/Seccion';
import CamposConfig from '../../components/form/CamposConfig';
import SelectorPozo from '../../components/form/SelectorPozo';
import SelectorOperador from '../../components/form/SelectorOperador';
import CampoFechaHora from '../../components/form/CampoFechaHora';
import DatoFijo from '../../components/form/DatoFijo';
import { useFormulario } from '../../hooks/useFormulario';
import { useCatalogo } from '../../hooks/useCatalogo';
import { useOperadorCaptura } from '../../hooks/useOperadorCaptura';
import { useEnviarCaptura } from '../../hooks/useEnviarCaptura';
import { obtenerOperadores, obtenerPozos } from '../../api/catalogos';
import { seccionesMantenimiento } from '../../features/mantenimiento/campos';
import { construirPayload } from '../../features/campos';
import { mostrarResultado } from '../../features/mostrarResultado';
import { esFutura } from '../../utils/fecha';
import type { Pozo } from '../../api/types';

export default function CapturaMantenimiento() {
  const pozos = useCatalogo(obtenerPozos);
  const operadores = useCatalogo(obtenerOperadores);
  // mtto_operador guarda el id_o.
  const operador = useOperadorCaptura(operadores.datos, true);
  const form = useFormulario(seccionesMantenimiento);
  const { enviar, guardando } = useEnviarCaptura();
  const [pozo, setPozo] = useState<Pozo | null>(null);
  const [fecha, setFecha] = useState(() => new Date());

  const guardar = async () => {
    const op = operador.resolver();
    const extras: Record<string, string> = {};
    if (!pozo) extras.pozo = 'Selecciona el pozo';
    if (!op?.id) extras.operador = 'Selecciona el operador';
    if (esFutura(fecha)) extras.fecha = 'La fecha no puede ser futura';
    if (!form.validar(extras) || !pozo || !op?.id) return;

    const payload = {
      mtto_clave_pozo: pozo.l_poz_clave,
      mtto_fecha_captura: fecha.toISOString(),
      mtto_operador: op.id,
      ...construirPayload(seccionesMantenimiento, form.valores),
    };
    const r = await enviar('mantenimiento', payload, pozo.l_poz_clave);
    if (mostrarResultado(r)) {
      form.reiniciar();
      setPozo(null);
      setFecha(new Date());
      operador.reiniciar();
    }
  };

  return (
    <PantallaCaptura
      onGuardar={guardar}
      guardando={guardando}
      avisos={[pozos.desdeCache && 'Lista de pozos sin actualizar (usando la copia guardada en el teléfono).']}
    >
      <TarjetaGrupo titulo="Pozo y fecha">
        <SelectorPozo
          pozos={pozos.datos}
          cargando={pozos.cargando}
          valor={pozo}
          onCambio={(p) => { setPozo(p); form.quitarError('pozo'); }}
          error={form.errores.pozo}
        />
        <CampoFechaHora
          etiqueta="Fecha de captura"
          obligatorio
          valor={fecha}
          onCambio={(d) => { setFecha(d); form.quitarError('fecha'); }}
          error={form.errores.fecha}
        />
        {operador.mostrarSelector ? (
          <SelectorOperador
            operadores={operadores.datos}
            cargando={operadores.cargando}
            valor={operador.seleccionado}
            onCambio={(o) => { operador.setSeleccionado(o); form.quitarError('operador'); }}
            error={form.errores.operador}
            ayuda={operador.sinId ? 'Tu usuario no está vinculado a un operador; selecciónalo manualmente.' : undefined}
          />
        ) : (
          <DatoFijo etiqueta="Operador" valor={operador.nombreSesion} />
        )}
      </TarjetaGrupo>

      {seccionesMantenimiento.map((s, i) => (
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
