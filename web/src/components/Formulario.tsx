import { useState, type FormEvent, type ReactNode } from 'react'
import { enviarPedido } from '../lib/fuenteDatos'
import { formatoPesos } from '../lib/formato'
import type { CampoPedido, Errores, Estado, Resumen } from '../lib/tipos'
import { maximoPermitido, totalPlatos, validarPedido } from '../lib/validacion'

type Props = {
  estado: Estado
  onConfirmado: (resumen: Resumen) => void
  onAvisoDatos: () => void
  onRecargarEstado: () => void
}

const claseCampo =
  'mt-1 block min-h-12 w-full rounded-xl border-2 border-apoyo-3 bg-white px-4 text-base text-fondo placeholder:text-apoyo-1/70 focus:border-impacto focus:outline-none aria-[invalid=true]:border-error'

function Campo(props: { id: string; etiqueta: string; error?: string; children: ReactNode; ayuda?: string }) {
  return (
    <div>
      <label htmlFor={props.id} className="block font-semibold">
        {props.etiqueta}
      </label>
      {props.children}
      {props.ayuda && !props.error && <p className="mt-1 text-sm text-apoyo-2">{props.ayuda}</p>}
      {props.error && (
        <p id={`${props.id}-error`} className="mt-1 text-sm font-semibold text-error" role="alert">
          {props.error}
        </p>
      )}
    </div>
  )
}

export function Formulario({ estado, onConfirmado, onAvisoDatos, onRecargarEstado }: Props) {
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [direccion, setDireccion] = useState('')
  const [municipio, setMunicipio] = useState('')
  const [salsas, setSalsas] = useState<Record<string, number>>({})
  const [aceptaDatos, setAceptaDatos] = useState(false)
  const [sitioWeb, setSitioWeb] = useState('')
  const [errores, setErrores] = useState<Errores>({})
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [intentado, setIntentado] = useState(false)

  const total = totalPlatos(salsas)
  const maximo = maximoPermitido(estado)
  const pedido = { nombre, telefono, direccion, municipio, salsas, aceptaDatos, sitioWeb }

  // Tras el primer intento, los errores se actualizan mientras el cliente corrige.
  const revalidar = (cambios: Partial<typeof pedido>) => {
    if (intentado) setErrores(validarPedido({ ...pedido, ...cambios }, estado))
  }

  const cambiarSalsa = (nombreSalsa: string, delta: number) => {
    const actual = salsas[nombreSalsa] ?? 0
    const nuevo = Math.max(0, actual + delta)
    if (delta > 0 && total >= maximo) return
    const siguiente = { ...salsas, [nombreSalsa]: nuevo }
    setSalsas(siguiente)
    revalidar({ salsas: siguiente })
  }

  const enviar = async (e: FormEvent) => {
    e.preventDefault()
    if (enviando) return
    setIntentado(true)
    setMensaje('')
    const locales = validarPedido(pedido, estado)
    setErrores(locales)
    if (Object.keys(locales).length) {
      const primero = Object.keys(locales)[0] as CampoPedido
      document.getElementById(`campo-${primero}`)?.focus()
      return
    }

    setEnviando(true)
    try {
      const r = await enviarPedido(pedido, estado)
      if (r.ok) {
        onConfirmado(r.resumen)
        return
      }
      if (r.codigo === 'IGNORADO') return
      setErrores(r.errores ?? {})
      setMensaje(r.mensaje)
      if (['CUPO_AGOTADO', 'CUPO_INSUFICIENTE', 'CERRADO'].includes(r.codigo)) onRecargarEstado()
    } catch {
      setMensaje('No pudimos enviar el pedido. Revisa tu conexión e intenta de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  const invalido = (c: CampoPedido) => (errores[c] ? true : undefined)
  const describe = (c: CampoPedido) => (errores[c] ? `campo-${c}-error` : undefined)

  return (
    <section id="pedido" className="mx-auto max-w-5xl px-4 py-10" aria-labelledby="titulo-pedido">
      <div className="mx-auto max-w-xl rounded-3xl bg-arena p-5 text-fondo shadow-2xl sm:p-8">
        <h2 id="titulo-pedido" className="font-titulo text-4xl tracking-wide sm:text-5xl">
          Haz tu pedido
        </h2>
        <p className="mt-1 text-apoyo-2">
          {estado.modo === 'whatsapp'
            ? 'Llena tus datos y te llevamos a WhatsApp con el pedido listo para enviar.'
            : 'Llena tus datos y confirma el pago por WhatsApp.'}
        </p>

        <form onSubmit={enviar} noValidate className="mt-6 space-y-5">
          <Campo id="campo-nombre" etiqueta="Nombre completo" error={errores.nombre}>
            <input
              id="campo-nombre"
              name="nombre"
              autoComplete="name"
              maxLength={80}
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value)
                revalidar({ nombre: e.target.value })
              }}
              aria-invalid={invalido('nombre')}
              aria-describedby={describe('nombre')}
              className={claseCampo}
            />
          </Campo>

          <Campo id="campo-telefono" etiqueta="Celular" error={errores.telefono} ayuda="10 dígitos, por ejemplo 3001234567">
            <input
              id="campo-telefono"
              name="telefono"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              maxLength={16}
              value={telefono}
              onChange={(e) => {
                setTelefono(e.target.value)
                revalidar({ telefono: e.target.value })
              }}
              aria-invalid={invalido('telefono')}
              aria-describedby={describe('telefono')}
              className={claseCampo}
            />
          </Campo>

          <Campo id="campo-direccion" etiqueta="Dirección de entrega" error={errores.direccion} ayuda="Incluye barrio, torre o apartamento si aplica">
            <input
              id="campo-direccion"
              name="direccion"
              autoComplete="street-address"
              maxLength={150}
              value={direccion}
              onChange={(e) => {
                setDireccion(e.target.value)
                revalidar({ direccion: e.target.value })
              }}
              aria-invalid={invalido('direccion')}
              aria-describedby={describe('direccion')}
              className={claseCampo}
            />
          </Campo>

          <Campo id="campo-municipio" etiqueta="Municipio" error={errores.municipio}>
            {estado.municipios.length > 0 ? (
              <select
                id="campo-municipio"
                name="municipio"
                value={municipio}
                onChange={(e) => {
                  setMunicipio(e.target.value)
                  revalidar({ municipio: e.target.value })
                }}
                aria-invalid={invalido('municipio')}
                aria-describedby={describe('municipio')}
                className={claseCampo}
              >
                <option value="">Elige tu municipio</option>
                {estado.municipios.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id="campo-municipio"
                name="municipio"
                autoComplete="address-level2"
                maxLength={60}
                value={municipio}
                onChange={(e) => {
                  setMunicipio(e.target.value)
                  revalidar({ municipio: e.target.value })
                }}
                aria-invalid={invalido('municipio')}
                aria-describedby={describe('municipio')}
                className={claseCampo}
              />
            )}
          </Campo>

          <fieldset aria-describedby={describe('salsas')}>
            <legend className="font-semibold">Elige la salsa de cada plato</legend>
            <p className="text-sm text-apoyo-2">Máximo {maximo} platos por pedido.</p>
            <ul className="mt-3 space-y-3" id="campo-salsas" tabIndex={-1}>
              {estado.salsas.map((s) => {
                const n = salsas[s.nombre] ?? 0
                return (
                  <li
                    key={s.nombre}
                    className={`flex items-center gap-3 rounded-2xl border-2 bg-white p-3 ${n > 0 ? 'border-impacto' : 'border-transparent'}`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-bold">{s.nombre}</p>
                      {s.descripcion && <p className="text-sm text-apoyo-2">{s.descripcion}</p>}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => cambiarSalsa(s.nombre, -1)}
                        disabled={n === 0}
                        aria-label={`Quitar un plato con salsa ${s.nombre}`}
                        className="size-11 rounded-full bg-apoyo-3 text-2xl font-bold disabled:opacity-40"
                      >
                        −
                      </button>
                      <output className="w-8 text-center text-xl font-bold tabular-nums" aria-live="polite">
                        {n}
                      </output>
                      <button
                        type="button"
                        onClick={() => cambiarSalsa(s.nombre, 1)}
                        disabled={total >= maximo}
                        aria-label={`Agregar un plato con salsa ${s.nombre}`}
                        className="size-11 rounded-full bg-impacto text-2xl font-bold disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
            {errores.salsas && (
              <p id="campo-salsas-error" className="mt-2 text-sm font-semibold text-error" role="alert">
                {errores.salsas}
              </p>
            )}
          </fieldset>

          <div className="flex items-baseline justify-between rounded-2xl bg-fondo px-5 py-4 text-claro">
            <span>
              Total: <strong>{total}</strong> {total === 1 ? 'plato' : 'platos'}
            </span>
            <strong className="font-titulo text-3xl tracking-wide text-impacto">
              {formatoPesos(total * estado.precioPlato)}
            </strong>
          </div>

          <div>
            <label className="flex items-start gap-3">
              <input
                id="campo-aceptaDatos"
                type="checkbox"
                checked={aceptaDatos}
                onChange={(e) => {
                  setAceptaDatos(e.target.checked)
                  revalidar({ aceptaDatos: e.target.checked })
                }}
                aria-invalid={invalido('aceptaDatos')}
                aria-describedby={describe('aceptaDatos')}
                aria-labelledby="texto-acepta-datos"
                className="mt-0.5 size-6 shrink-0 accent-impacto"
              />
              <span id="texto-acepta-datos" className="text-sm">
                Acepto el tratamiento de mis datos personales según la Ley 1581 de 2012.{' '}
                <button type="button" onClick={onAvisoDatos} className="font-semibold underline underline-offset-2">
                  Ver aviso
                </button>
              </span>
            </label>
            {errores.aceptaDatos && (
              <p id="campo-aceptaDatos-error" className="mt-1 text-sm font-semibold text-error" role="alert">
                {errores.aceptaDatos}
              </p>
            )}
          </div>

          {/* Campo trampa para bots: invisible para personas y lectores de pantalla. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="sitio_web">No llenar este campo</label>
            <input
              id="sitio_web"
              name="sitio_web"
              tabIndex={-1}
              autoComplete="off"
              value={sitioWeb}
              onChange={(e) => setSitioWeb(e.target.value)}
            />
          </div>

          {mensaje && (
            <p className="rounded-xl bg-error/10 px-4 py-3 font-semibold text-error" role="alert">
              {mensaje}
            </p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-impacto px-6 text-lg font-bold text-fondo transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fondo disabled:opacity-60"
          >
            {enviando ? 'Enviando…' : estado.modo === 'whatsapp' ? 'Enviar pedido por WhatsApp' : 'Enviar pedido'}
          </button>
          <p className="text-center text-xs text-apoyo-2">
            El pago se confirma por WhatsApp. Aquí no pedimos datos de pago.
          </p>
        </form>
      </div>
    </section>
  )
}
