const ZONA = 'America/Bogota'

const pesos = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

export function formatoPesos(valor: number): string {
  return pesos.format(valor)
}

/** "sábado 14 de noviembre" a partir de "2026-11-14". */
export function formatoDia(fecha: string | null): string {
  if (!fecha) return ''
  const d = new Date(`${fecha}T12:00:00-05:00`)
  if (isNaN(d.getTime())) return fecha
  const texto = d.toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: ZONA,
  })
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

/** "13 de noviembre, 12:00 p. m." */
export function formatoFechaHora(fecha: Date | null): string {
  if (!fecha) return ''
  return fecha.toLocaleString('es-CO', {
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: ZONA,
  })
}

/** "Tradicional x2, Picante x1" */
export function textoSalsas(salsas: Record<string, number>): string {
  return Object.entries(salsas)
    .filter(([, n]) => n > 0)
    .map(([nombre, n]) => `${nombre} x${n}`)
    .join(', ')
}
