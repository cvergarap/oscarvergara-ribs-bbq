import type { Errores, Estado, Pedido } from './tipos'

/** Quita caracteres de control y espacios repetidos. */
export function limpiar(texto: string): string {
  // eslint-disable-next-line no-control-regex -- se eliminan caracteres de control a propósito
  return texto.replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim()
}

/** Deja solo dígitos y quita el prefijo 57 si viene con él. */
export function normalizarTelefono(valor: string): string {
  let t = valor.replace(/\D/g, '')
  if (t.length === 12 && t.startsWith('57')) t = t.slice(2)
  return t
}

export function totalPlatos(salsas: Record<string, number>): number {
  return Object.values(salsas).reduce((suma, n) => suma + (n > 0 ? n : 0), 0)
}

/** Máximo de platos que se pueden pedir con el estado actual. */
export function maximoPermitido(estado: Estado): number {
  const porCupo =
    estado.tipoCupo === 'platos' && estado.cuposRestantes !== null
      ? estado.cuposRestantes
      : Infinity
  return Math.max(0, Math.min(estado.maxPorPedido, porCupo))
}

/**
 * Validación del navegador. Es ayuda para el cliente: en modo completo, quien decide
 * es el servidor (Apps Script), que repite todas estas reglas.
 */
export function validarPedido(p: Pedido, estado: Estado): Errores {
  const errores: Errores = {}

  const nombre = limpiar(p.nombre)
  if (nombre.length < 3 || nombre.length > 80) errores.nombre = 'Escribe tu nombre completo.'

  if (!/^3\d{9}$/.test(normalizarTelefono(p.telefono))) {
    errores.telefono = 'El celular debe tener 10 dígitos y empezar por 3.'
  }

  const direccion = limpiar(p.direccion)
  if (direccion.length < 5 || direccion.length > 150) {
    errores.direccion = 'Escribe la dirección de entrega.'
  }

  const municipio = limpiar(p.municipio)
  if (estado.municipios.length > 0) {
    if (!estado.municipios.includes(municipio)) errores.municipio = 'Elige tu municipio.'
  } else if (municipio.length < 3 || municipio.length > 60) {
    errores.municipio = 'Escribe tu municipio.'
  }

  const total = totalPlatos(p.salsas)
  const maximo = maximoPermitido(estado)
  if (total < 1) errores.salsas = 'Elige al menos un plato.'
  else if (total > maximo) errores.salsas = `Puedes pedir máximo ${maximo} platos.`

  if (!p.aceptaDatos) errores.aceptaDatos = 'Debes aceptar el tratamiento de datos.'

  return errores
}
