/** Fecha actual en ISO, igual que la envía el frontend web. */
export const ahoraISO = () => new Date().toISOString();

export const esFutura = (fecha: Date) => fecha.getTime() > Date.now();

export function formatearFecha(valor: string | Date | null | undefined) {
  if (!valor) return '—';
  const d = typeof valor === 'string' ? new Date(valor) : valor;
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}
