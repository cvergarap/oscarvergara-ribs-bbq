// Backend simulado de RIBS BBQ: imita al Apps Script para probar pantallas sin Google.
// No guarda nada en disco ni toca ninguna hoja: todo vive en memoria mientras corre.
//
// Uso (desde web/):
//   npm run simulado        -> arranca este servidor en http://localhost:5199
//   npm run dev:simulado    -> la web en http://localhost:5173 apuntando aquí
//
// Control desde el navegador (cada parámetro es opcional):
//   http://localhost:5199/control?cierre=90      cierra en 90 segundos (negativo = ya cerró)
//   http://localhost:5199/control?demora=8000    el estado tarda 8 s (ver el esqueleto)
//   http://localhost:5199/control?cupo=0         cupo agotado (popup de sobrepedidos)
//   http://localhost:5199/control?abiertos=NO    cierre manual (pedidos_abiertos = NO)
//   http://localhost:5199/control?error=1        el estado falla (pantalla "Reintentar")
//   http://localhost:5199/control                muestra la configuración actual
//   http://localhost:5199/registro               pedidos e interesados recibidos

const http = require('http')

const PUERTO = 5199
const ahora = () => Date.now()

const conf = {
  cierre: ahora() + 30 * 60 * 1000,
  demora: 0,
  cupo: 20,
  abiertos: 'SI',
  error: false,
}
const registro = { pedidos: [], interesados: [] }
let siguiente = 1

const salsas = [
  { nombre: 'Tradicional', descripcion: 'Nuestra BBQ clásica, ahumada y equilibrada.' },
  { nombre: 'Dulce', descripcion: 'Miel y panela, para los que aman lo dulce.' },
  { nombre: 'Picante', descripcion: 'Con ají de la casa: pica rico.' },
]

function usados() {
  return registro.pedidos.filter((p) => p.numero).reduce((s, p) => s + p.cantidad, 0)
}

function estado() {
  const restantes = Math.max(0, conf.cupo - usados())
  let motivo = null
  if (conf.abiertos !== 'SI') motivo = 'CERRADO'
  else if (ahora() >= conf.cierre) motivo = 'FECHA_VENCIDA'
  return {
    ok: true,
    abierto: motivo === null,
    motivo_cierre: motivo,
    tipo_cupo: 'platos',
    cupo_maximo: conf.cupo,
    cupos_restantes: restantes,
    max_por_pedido: 5,
    precio_plato: 30000,
    fecha_cierre: new Date(conf.cierre).toISOString(),
    fecha_entrega: '2026-11-21',
    hora_entrega: '14:00',
    salsas,
    municipios: ['Pereira', 'Dosquebradas'],
    whatsapp_numero: '573218115143',
    redes: { instagram: '', facebook: '', tiktok: '' },
    version: 'simulado',
    ahora: new Date().toISOString(),
  }
}

function registrarPedido(d) {
  const e = estado()
  if (!e.abierto) return { ok: false, codigo: 'CERRADO', mensaje: 'Los pedidos están cerrados. Te esperamos en la próxima apertura.' }
  const cantidad = Object.values(d.salsas || {}).reduce((s, n) => s + (Number(n) || 0), 0)
  const errores = {}
  if (String(d.nombre || '').trim().length < 3) errores.nombre = 'Escribe tu nombre completo.'
  if (!/^3\d{9}$/.test(String(d.telefono || '').replace(/\D/g, '').replace(/^57(?=\d{10}$)/, ''))) {
    errores.telefono = 'El celular debe tener 10 dígitos y empezar por 3.'
  }
  if (String(d.direccion || '').trim().length < 5) errores.direccion = 'Escribe la dirección de entrega.'
  if (cantidad < 1 || cantidad > 5) errores.salsas = 'La cantidad de platos debe estar entre 1 y 5.'
  if (d.acepta_datos !== true) errores.acepta_datos = 'Debes aceptar el tratamiento de datos.'
  if (Object.keys(errores).length) return { ok: false, codigo: 'DATOS_INVALIDOS', mensaje: 'Revisa los datos del formulario.', errores }

  if (e.cupos_restantes <= 0) {
    registro.pedidos.push({ numero: '', cantidad, nombre: d.nombre, estado: 'Cancelado por Sobrepedidos' })
    return { ok: false, codigo: 'CUPO_AGOTADO', registrado: true, mensaje: 'Se agotaron los cupos.', redes: e.redes }
  }
  if (cantidad > e.cupos_restantes) {
    return { ok: false, codigo: 'CUPO_INSUFICIENTE', mensaje: `Solo nos quedan ${e.cupos_restantes} platos. Ajusta tu pedido.` }
  }
  const numero = siguiente++
  const texto = Object.entries(d.salsas).filter(([, n]) => n > 0).map(([s, n]) => `${s} x${n}`).join(', ')
  registro.pedidos.push({ numero, cantidad, nombre: d.nombre, estado: 'Pendiente' })
  return {
    ok: true,
    numero,
    resumen: { cantidad, salsas: texto, municipio: d.municipio, total: cantidad * 30000, fecha_entrega: e.fecha_entrega },
  }
}

function registrarInteresado(d) {
  const errores = {}
  if (String(d.nombre || '').trim().length < 3) errores.nombre = 'Escribe tu nombre.'
  if (!/^3\d{9}$/.test(String(d.telefono || '').replace(/\D/g, ''))) errores.telefono = 'El celular debe tener 10 dígitos y empezar por 3.'
  if (d.acepta_publicidad !== true) errores.aceptaPublicidad = 'Marca la autorización para poder avisarte.'
  if (Object.keys(errores).length) return { ok: false, codigo: 'DATOS_INVALIDOS', mensaje: 'Revisa los datos del formulario.', errores }
  registro.interesados.push({ nombre: d.nombre, fecha: new Date().toISOString() })
  return { ok: true, mensaje: '¡Listo! Te avisaremos de la próxima jornada.' }
}

function json(res, obj) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(obj, null, 2))
}

http
  .createServer((req, res) => {
    const u = new URL(req.url, `http://localhost:${PUERTO}`)

    if (u.pathname === '/control') {
      const p = u.searchParams
      if (p.has('cierre')) conf.cierre = ahora() + Number(p.get('cierre')) * 1000
      if (p.has('demora')) conf.demora = Math.max(0, Number(p.get('demora')) || 0)
      if (p.has('cupo')) conf.cupo = Math.max(0, Number(p.get('cupo')) || 0)
      if (p.has('abiertos')) conf.abiertos = p.get('abiertos').toUpperCase() === 'NO' ? 'NO' : 'SI'
      if (p.has('error')) conf.error = p.get('error') === '1'
      return json(res, { ...conf, cierre: new Date(conf.cierre).toISOString(), usados: usados() })
    }
    if (u.pathname === '/registro') return json(res, registro)

    if (req.method === 'POST') {
      let cuerpo = ''
      req.on('data', (c) => (cuerpo += c))
      req.on('end', () => {
        let d = {}
        try {
          d = JSON.parse(cuerpo || '{}')
        } catch {
          return json(res, { ok: false, codigo: 'DATOS_INVALIDOS', mensaje: 'Revisa los datos del formulario.' })
        }
        if (d.sitio_web) return json(res, { ok: true, numero: 0 })
        const r = d.accion === 'interesado' ? registrarInteresado(d) : registrarPedido(d)
        console.log(d.accion === 'interesado' ? 'INTERESADO' : 'PEDIDO', r.ok ? 'OK' : r.codigo)
        json(res, r)
      })
      return
    }

    setTimeout(() => {
      if (conf.error) return json(res, { ok: false, codigo: 'ERROR', mensaje: 'Error simulado.' })
      json(res, estado())
    }, conf.demora)
  })
  .listen(PUERTO, () => {
    console.log(`Backend simulado en http://localhost:${PUERTO}  (control: /control, registro: /registro)`)
  })
