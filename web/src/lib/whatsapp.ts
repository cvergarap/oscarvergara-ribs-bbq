import { formatoEntrega, formatoPesos } from './formato'
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
  if (r.fechaEntrega) lineas.push(`• Entrega: ${formatoEntrega(r.fechaEntrega, r.horaEntrega)}`)
  lineas.push('Quedo atento para el pago.')
  return lineas.join('\n')
}

export type EnlacesWhatsApp = {
  /** wa.me: en celular abre la app directo. */
  universal: string
  /** whatsapp://: abre WhatsApp para escritorio si está instalado. */
  app: string
  /** WhatsApp Web: requiere sesión iniciada en el navegador. */
  web: string
}

export function enlacesWhatsApp(numero: string, mensaje: string): EnlacesWhatsApp {
  const texto = encodeURIComponent(mensaje)
  return {
    universal: `https://wa.me/${numero}?text=${texto}`,
    app: `whatsapp://send?phone=${numero}&text=${texto}`,
    web: `https://web.whatsapp.com/send?phone=${numero}&text=${texto}`,
  }
}

/** Celular o tableta: ahí wa.me abre la app sin pasos intermedios. */
export function esCelular(): boolean {
  return (
    window.matchMedia('(pointer: coarse)').matches ||
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  )
}

/**
 * En celular abre la app de inmediato. En computador no abre nada solo: la pantalla de
 * confirmación ofrece elegir entre la app de escritorio y WhatsApp Web, porque wa.me en
 * computador pasa por una página intermedia que confunde al cliente.
 */
export function abrirWhatsAppSiEsCelular(enlaces: EnlacesWhatsApp): void {
  if (esCelular()) window.location.href = enlaces.universal
}

/** Copia texto al portapapeles; devuelve false si el navegador no lo permite. */
export async function copiarTexto(texto: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texto)
    return true
  } catch {
    return false
  }
}
