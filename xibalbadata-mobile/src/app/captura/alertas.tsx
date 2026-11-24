import { useState } from 'react';
import PantallaCaptura from '../../components/form/PantallaCaptura';
import TarjetaGrupo from '../../components/form/TarjetaGrupo';
import CamposConfig from '../../components/form/CamposConfig';
import SelectorPozo from '../../components/form/SelectorPozo';
import SelectorOperador from '../../components/form/SelectorOperador';
import SelectBuscable from '../../components/form/SelectBuscable';
import DatoFijo from '../../components/form/DatoFijo';
import { useFormulario } from '../../hooks/useFormulario';
import { useCatalogo } from '../../hooks/useCatalogo';
import { useOperadorCaptura } from '../../hooks/useOperadorCaptura';
import { useEnviarCaptura } from '../../hooks/useEnviarCaptura';
import { obtenerOperadores, obtenerPozos, obtenerTiposAlerta } from '../../api/catalogos';
import { seccionesAlerta } from '../../features/alertas/campos';
import { construirPayload } from '../../features/campos';
import { mostrarResultado } from '../../features/mostrarResultado';
import { ahoraISO } from '../../utils/fecha';
import type { AlertaTipo, Pozo } from '../../api/types';

export default function CapturaAlerta() {
  const pozos = useCatalogo(obtenerPozos);
  const operadores = useCatalogo(obtenerOperadores);
  const tipos = useCatalogo(obtenerTiposAlerta);
  // al_operador guarda el id_o.
  const operador = useOperadorCaptura(operadores.datos, true);
  const form = useFormulario(seccionesAlerta);
  const { enviar, guardando } = useEnviarCaptura();
  const [pozo, setPozo] = useState<Pozo | null>(null);
  const [tipo, setTipo] = useState<AlertaTipo | null>(null);

  const guardar = async () => {
    const op = operador.resolver();
    const extras: Record<string, string> = {};
    if (!pozo) extras.pozo = 'Selecciona el pozo';
    if (!op?.id) extras.operador = 'Selecciona el operador';
    if (!form.validar(extras) || !pozo || !op?.id) return;

    const payload = {
      idLp: pozo.id_lp,
      al_clave_de_pozo: pozo.l_poz_clave,
      al_tipo_de_alerta: tipo?.alert_tipo ?? null,
      al_operador: String(op.id),
      ...construirPayload(seccionesAlerta, form.valores),
      al_fechacap: ahoraISO(),
    };
    const r = await enviar('alertas', payload, `${pozo.l_poz_clave}${tipo ? ` · ${tipo.alert_tipo}` : ''}`);
    if (mostrarResultado(r)) {
      form.reiniciar();
      setPozo(null);
      setTipo(null);
      operador.reiniciar();
    }
  };

  return (
    <PantallaCaptura
      onGuardar={guardar}
      guardando={guardando}
      avisos={[
        (pozos.desdeCache || tipos.desdeCache) && 'Catálogos sin actualizar (usando la copia guardada en el teléfono).',
      ]}
    >
      <TarjetaGrupo titulo="Nueva alerta">
        <SelectorPozo
          pozos={pozos.datos}
          cargando={pozos.cargando}
          valor={pozo}
          onCambio={(p) => { setPozo(p); form.quitarError('pozo'); }}
          error={form.errores.pozo}
        />
        <SelectBuscable
          etiqueta="Tipo de alerta"
          elementos={tipos.datos}
          cargando={tipos.cargando}
          seleccionado={tipo}
          onSeleccionar={setTipo}
          claveDe={(t) => String(t.id_alert)}
          tituloDe={(t) => t.alert_tipo}
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
          <DatoFijo etiqueta="Operador que reporta" valor={operador.nombreSesion} />
        )}
        <CamposConfig campos={seccionesAlerta[0].campos} valores={form.valores} errores={form.errores} onCambio={form.cambiar} />
      </TarjetaGrupo>
    </PantallaCaptura>
  );
}
