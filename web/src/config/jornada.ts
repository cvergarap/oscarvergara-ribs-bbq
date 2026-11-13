/**
 * Configuración de la jornada de pedidos (modo WhatsApp).
 *
 * El negocio edita este archivo para cada apertura y hace push a main:
 * Cloudflare Pages publica solo. Todo lo de aquí es público (se ve en la página).
 * Cuando el backend salga de pausa, estos valores vendrán de la pestaña "Config".
 */
export const jornada = {
  /** false cierra los pedidos de inmediato. */
  pedidosAbiertos: true,
  /** Fecha y hora límite, en hora de Colombia (-05:00). */
  fechaCierre: '2026-11-13T12:00:00-05:00',
  /** Día de entrega (AAAA-MM-DD). */
  fechaEntrega: '2026-11-14',
  /** Hora de entrega (HH:mm, 24 h, hora de Colombia). Vacío si no aplica. */
  horaEntrega: '14:00',
  precioPlato: 30000,
  maxPorPedido: 5,
  producto: 'Costillas BBQ de 570 g aprox. + 120 g de papas a la francesa rizadas',
  salsas: [
    { nombre: 'Tradicional', descripcion: 'Nuestra BBQ clásica, ahumada y equilibrada.' },
    { nombre: 'Dulce', descripcion: 'BBQ con un toque dulce, ideal para toda la familia.' },
    { nombre: 'Picante', descripcion: 'BBQ con chile, para los que les gusta el picor.' },
  ],
  /** Municipios con cobertura. Si está vacío, el cliente escribe el municipio. */
  municipios: [] as string[],
}

/** Variables públicas: se leen de web/.env o de las variables de Cloudflare Pages. */
export const WHATSAPP_NUMERO = (import.meta.env.VITE_WHATSAPP_NUMERO ?? '').replace(/\D/g, '')

/** Vacío = modo WhatsApp. Con valor = modo completo con Google Apps Script. */
export const APPS_SCRIPT_URL = (import.meta.env.VITE_APPS_SCRIPT_URL ?? '').trim()
