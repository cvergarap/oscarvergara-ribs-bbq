import { formatoDia, formatoPesos } from './formato'
import type { Resumen } from './tipos'

export function mensajePedido(r: Resumen): string {
  const encabezado =
    r.numero !== null
      ? `Hola RIBS BBQ, hice el pedido #${r.numero}:`
      : 'Hola RIBS BBQ, quiero hacer este pedido:'
  const lineas = [
    encabezado,
    `• Nombre: ${r.nombre}`,
    `• Celular: ${r.telefono}`,
    `• Dirección: ${r.direccion}, ${r.municipio}`,
    `• Platos: ${r.cantidad} (${r.salsasTexto})`,
    `• Total: ${formatoPesos(r.total)}`,
  ]
  if (r.fechaEntrega) lineas.push(`• Entrega: ${formatoDia(r.fechaEntrega)}`)
  lineas.push('Quedo atento para el pago.')
  return lineas.join('\n')
}

export function enlaceWhatsApp(numero: string, mensaje: string): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`
}

/** En celular abre la app en la misma pestaña; en computador, WhatsApp Web en otra. */
export function abrirWhatsApp(url: string): void {
  const esTactil = window.matchMedia('(pointer: coarse)').matches
  if (esTactil) {
    window.location.href = url
  } else {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}
