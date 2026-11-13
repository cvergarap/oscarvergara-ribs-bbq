/**
 * Fuente de datos intercambiable (ver openspec/changes/add-landing-pedidos/design.md).
 * - Modo WhatsApp (APPS_SCRIPT_URL vacío): todo sale de src/config/jornada.ts y los
 *   datos del cliente no salen del navegador salvo hacia WhatsApp.
 * - Modo remoto: Google Apps Script. Contrato en design.md, decisión 8.
 */
import { APPS_SCRIPT_URL, WHATSAPP_NUMERO, jornada } from '../config/jornada'
import { textoSalsas } from './formato'
import type { Errores, Estado, MotivoCierre, Pedido, Resultado } from './tipos'
import { limpiar, normalizarTelefono, totalPlatos, validarPedido } from './validacion'

export const MODO = APPS_SCRIPT_URL ? 'remoto' : 'whatsapp'

export function obtenerEstado(): Promise<Estado> {
  return MODO === 'remoto' ? estadoRemoto() : Promise.resolve(estadoLocal())
}

export function enviarPedido(pedido: Pedido, estado: Estado): Promise<Resultado> {
  // Campo trampa lleno: se finge éxito sin hacer nada.
  if (pedido.sitioWeb) {
    return Promise.resolve({ ok: false, codigo: 'IGNORADO', mensaje: '' })
  }
  const errores = validarPedido(pedido, estado)
  if (Object.keys(errores).length) {
    return Promise.resolve({
      ok: false,
      codigo: 'DATOS_INVALIDOS',
      mensaje: 'Revisa los datos marcados.',
      errores,
    })
  }
  return MODO === 'remoto' ? pedidoRemoto(pedido, estado) : Promise.resolve(pedidoLocal(pedido, estado))
}

// ---------------------------------------------------------------------------
// Modo WhatsApp
// ---------------------------------------------------------------------------

function estadoLocal(): Estado {
  const fechaCierre = new Date(jornada.fechaCierre)
  const fechaValida = !isNaN(fechaCierre.getTime())
  let motivo: MotivoCierre | null = null
  if (!jornada.pedidosAbiertos) motivo = 'CERRADO'
  else if (!fechaValida || Date.now() >= fechaCierre.getTime()) motivo = 'FECHA_VENCIDA'
  else if (!WHATSAPP_NUMERO || jornada.salsas.length === 0) motivo = 'SIN_CONFIGURAR'

  return {
    modo: 'whatsapp',
    abierto: motivo === null,
    motivoCierre: motivo,
    fechaCierre: fechaValida ? fechaCierre : null,
    fechaEntrega: jornada.fechaEntrega || null,
    horaEntrega: jornada.horaEntrega || null,
    precioPlato: jornada.precioPlato,
    maxPorPedido: jornada.maxPorPedido,
    salsas: jornada.salsas,
    municipios: jornada.municipios,
    whatsappNumero: WHATSAPP_NUMERO,
    cuposRestantes: null,
    tipoCupo: null,
    desfaseReloj: 0,
  }
}

function pedidoLocal(p: Pedido, estado: Estado): Resultado {
  const cantidad = totalPlatos(p.salsas)
  return {
    ok: true,
    resumen: {
      numero: null,
      nombre: limpiar(p.nombre),
      telefono: normalizarTelefono(p.telefono),
      direccion: limpiar(p.direccion),
      municipio: limpiar(p.municipio),
      cantidad,
      salsasTexto: textoSalsas(p.salsas),
      total: cantidad * estado.precioPlato,
      fechaEntrega: estado.fechaEntrega,
      horaEntrega: estado.horaEntrega,
    },
  }
}

// ---------------------------------------------------------------------------
// Modo remoto (Google Apps Script). Pendiente de probar contra el backend real.
// ---------------------------------------------------------------------------

type EstadoApi = {
  ok: boolean
  abierto: boolean
  motivo_cierre: MotivoCierre | null
  tipo_cupo: 'platos' | 'pedidos'
  cupos_restantes: number
  max_por_pedido: number
  precio_plato: number
  fecha_cierre: string | null
  fecha_entrega: string | null
  /** Opcional: versiones anteriores del script no la envían. */
  hora_entrega?: string
  salsas: { nombre: string; descripcion: string }[]
  municipios: string[]
  whatsapp_numero: string
  ahora: string
}

async function estadoRemoto(): Promise<Estado> {
  const resp = await fetch(APPS_SCRIPT_URL)
  const d = (await resp.json()) as EstadoApi
  if (!d.ok) throw new Error('Estado no disponible')
  const ahoraServidor = new Date(d.ahora).getTime()
  return {
    modo: 'remoto',
    abierto: d.abierto,
    motivoCierre: d.motivo_cierre,
    fechaCierre: d.fecha_cierre ? new Date(d.fecha_cierre) : null,
    fechaEntrega: d.fecha_entrega,
    // Si la hoja aún no tiene hora_entrega, se usa la de jornada.ts.
    horaEntrega: d.hora_entrega || jornada.horaEntrega || null,
    precioPlato: d.precio_plato,
    maxPorPedido: d.max_por_pedido,
    salsas: d.salsas,
    municipios: d.municipios,
    whatsappNumero: d.whatsapp_numero || WHATSAPP_NUMERO,
    cuposRestantes: d.cupos_restantes,
    tipoCupo: d.tipo_cupo,
    desfaseReloj: isNaN(ahoraServidor) ? 0 : ahoraServidor - Date.now(),
  }
}

async function pedidoRemoto(p: Pedido, estado: Estado): Promise<Resultado> {
  const salsas = Object.fromEntries(Object.entries(p.salsas).filter(([, n]) => n > 0))
  // text/plain evita la verificación previa de CORS, que Apps Script no responde.
  const resp = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      nombre: p.nombre,
      telefono: p.telefono,
      direccion: p.direccion,
      municipio: p.municipio,
      salsas,
      acepta_datos: p.aceptaDatos,
      sitio_web: p.sitioWeb,
    }),
  })
  const d = await resp.json()
  if (!d.ok) {
    const errores: Errores = { ...d.errores }
    if (d.errores?.acepta_datos) errores.aceptaDatos = d.errores.acepta_datos
    return { ok: false, codigo: d.codigo, mensaje: d.mensaje, errores }
  }
  return {
    ok: true,
    resumen: {
      numero: d.numero,
      nombre: limpiar(p.nombre),
      telefono: normalizarTelefono(p.telefono),
      direccion: limpiar(p.direccion),
      municipio: d.resumen.municipio,
      cantidad: d.resumen.cantidad,
      salsasTexto: d.resumen.salsas,
      total: d.resumen.total,
      fechaEntrega: d.resumen.fecha_entrega ?? estado.fechaEntrega,
      horaEntrega: estado.horaEntrega,
    },
  }
}
