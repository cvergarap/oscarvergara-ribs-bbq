import { useEffect, useRef, useState, type FormEvent } from 'react'
import { PUEDE_REGISTRAR_INTERESADOS, registrarInteresado } from '../lib/fuenteDatos'
import type { Redes } from '../lib/tipos'
import { limpiar, normalizarTelefono } from '../lib/validacion'
import { FotoFinish } from './FotoFinish'

type Props = {
  abierto: boolean
  onCerrar: () => void
  redes: Redes
  onAvisoDatos: () => void
}

type Vista = 'mensaje' | 'formulario' | 'listo'
type CampoInteresado = 'nombre' | 'telefono' | 'aceptaPublicidad'

const BOTONES_REDES: { clave: keyof Redes; texto: string }[] = [
  { clave: 'instagram', texto: 'Instagram' },
  { clave: 'facebook', texto: 'Facebook' },
  { clave: 'tiktok', texto: 'TikTok' },
]

const campo =
  'mt-1 block min-h-12 w-full rounded-xl border-2 bg-claro px-4 text-base text-fondo placeholder:text-apoyo-1/60 focus:border-impacto focus:outline-none'

/**
 * Popup de pedidos cerrados (mensaje único para cualquier motivo de cierre). El botón
 * "Avísame en la próxima" cambia el contenido del mismo popup por un formulario corto.
 */
export function ModalCierre({ abierto, onCerrar, redes, onAvisoDatos }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const [vista, setVista] = useState<Vista>('mensaje')
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [acepta, setAcepta] = useState(false)
  const [sitioWeb, setSitioWeb] = useState('')
  const [errores, setErrores] = useState<Partial<Record<CampoInteresado, string>>>({})
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    const dialogo = ref.current
    if (!dialogo) return
    if (abierto && !dialogo.open) dialogo.showModal()
    if (!abierto && dialogo.open) dialogo.close()
  }, [abierto])

  // Al cerrar, el popup vuelve al mensaje (salvo que ya se haya anotado).
  const cerrar = () => {
    if (vista === 'formulario') setVista('mensaje')
    setMensaje('')
    onCerrar()
  }

  const validar = () => {
    const e: Partial<Record<CampoInteresado, string>> = {}
    const n = limpiar(nombre)
    if (n.length < 3 || n.length > 80) e.nombre = 'Escribe tu nombre.'
    if (!/^3\d{9}$/.test(normalizarTelefono(telefono))) {
      e.telefono = 'El celular debe tener 10 dígitos y empezar por 3.'
    }
    if (!acepta) e.aceptaPublicidad = 'Marca la autorización para poder avisarte.'
    return e
  }

  const enviar = async (ev: FormEvent) => {
    ev.preventDefault()
    setMensaje('')
    const e = validar()
    setErrores(e)
    if (Object.keys(e).length) return
    setEnviando(true)
    try {
      const r = await registrarInteresado({ nombre, telefono, aceptaPublicidad: acepta, sitioWeb })
      if (r.ok) {
        setVista('listo')
        return
      }
      setErrores(r.errores)
      setMensaje(r.mensaje)
    } catch {
      setMensaje('No pudimos guardar tus datos. Revisa tu conexión e intenta de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  const conRedes = BOTONES_REDES.filter((b) => redes[b.clave])
  const primerNombre = limpiar(nombre).split(' ')[0]

  return (
    <dialog
      ref={ref}
      onClose={cerrar}
      aria-labelledby="titulo-cierre"
      className="m-auto max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-md overflow-y-auto rounded-3xl border-4 border-impacto bg-fondo p-0 text-claro shadow-[0_0_60px_rgba(239,114,36,0.5)] backdrop:bg-black/80 backdrop:backdrop-blur-sm"
    >
      <div className="relative p-4 pb-6 text-center sm:p-6">
        <button
          type="button"
          onClick={cerrar}
          aria-label="Cerrar"
          className="absolute top-2 right-2 z-10 flex size-10 items-center justify-center rounded-full bg-fondo/80 text-2xl leading-none text-claro hover:bg-apoyo-2"
        >
          ×
        </button>

        <div className="overflow-hidden rounded-2xl border-2 border-apoyo-2">
          <FotoFinish />
        </div>

        <p className="mt-4 inline-block rounded-full bg-promo px-4 py-1 text-xs font-bold tracking-widest uppercase">
          Pedidos cerrados
        </p>

        {vista === 'mensaje' && (
          <>
            <h2 id="titulo-cierre" className="mt-3 font-titulo text-5xl leading-none tracking-wide text-impacto">
              ¡Te ganaron por un pelito!
            </h2>
            <div className="mt-3 space-y-2 text-arena">
              <p className="text-lg">
                Esto era una carrera de fanáticos por las últimas costillas… y la foto finish no
                miente: otro fan cruzó la meta un segundo antes que tú.
              </p>
              <p>
                Esta jornada ya tiene campeones.{' '}
                <strong className="text-claro">La revancha viene pronto: la parrilla se vuelve a prender.</strong>
              </p>
            </div>

            {PUEDE_REGISTRAR_INTERESADOS && (
              <button
                type="button"
                onClick={() => setVista('formulario')}
                className="mt-5 flex min-h-12 w-full items-center justify-center rounded-full bg-impacto px-6 text-lg font-bold text-fondo transition hover:brightness-110"
              >
                Avísame en la próxima
              </button>
            )}

            {conRedes.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-apoyo-3">O síguenos y entérate primero:</p>
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                  {conRedes.map((b) => (
                    <a
                      key={b.clave}
                      href={redes[b.clave]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-11 rounded-full border-2 border-apoyo-3 px-5 py-2 font-semibold text-claro hover:bg-claro/10"
                    >
                      {b.texto}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {vista === 'formulario' && (
          <form onSubmit={enviar} noValidate className="mt-3 text-left">
            <h2 id="titulo-cierre" className="text-center font-titulo text-4xl leading-none tracking-wide text-impacto">
              Te avisamos primero
            </h2>
            <p className="mt-1 text-center text-sm text-arena">
              Déjanos tu nombre y celular. Cuando volvamos a prender la parrilla, eres de los primeros en saber.
            </p>

            <label className="mt-4 block text-sm font-semibold" htmlFor="int-nombre">
              Tu nombre
            </label>
            <input
              id="int-nombre"
              className={`${campo} ${errores.nombre ? 'border-error' : 'border-transparent'}`}
              autoComplete="name"
              maxLength={80}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              aria-invalid={errores.nombre ? true : undefined}
              aria-describedby={errores.nombre ? 'int-nombre-error' : undefined}
            />
            {errores.nombre && (
              <p id="int-nombre-error" className="mt-1 text-sm font-semibold text-impacto">
                {errores.nombre}
              </p>
            )}

            <label className="mt-3 block text-sm font-semibold" htmlFor="int-telefono">
              Celular
            </label>
            <input
              id="int-telefono"
              type="tel"
              inputMode="numeric"
              className={`${campo} ${errores.telefono ? 'border-error' : 'border-transparent'}`}
              autoComplete="tel-national"
              placeholder="3001234567"
              maxLength={16}
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              aria-invalid={errores.telefono ? true : undefined}
              aria-describedby={errores.telefono ? 'int-telefono-error' : undefined}
            />
            {errores.telefono && (
              <p id="int-telefono-error" className="mt-1 text-sm font-semibold text-impacto">
                {errores.telefono}
              </p>
            )}

            <label className="mt-4 flex items-start gap-3 text-sm text-arena">
              <input
                type="checkbox"
                className="mt-0.5 size-5 shrink-0 accent-impacto"
                checked={acepta}
                onChange={(e) => setAcepta(e.target.checked)}
                aria-invalid={errores.aceptaPublicidad ? true : undefined}
              />
              <span>
                Autorizo a RIBS BBQ a escribirme por WhatsApp sobre nuevas aperturas y promociones
                (Ley 1581 de 2012).{' '}
                <button type="button" onClick={onAvisoDatos} className="font-semibold text-claro underline">
                  Ver aviso
                </button>
              </span>
            </label>
            {errores.aceptaPublicidad && (
              <p className="mt-1 text-sm font-semibold text-impacto">{errores.aceptaPublicidad}</p>
            )}

            {/* Campo trampa para bots: invisible para personas y lectores de pantalla. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="int-sitio-web">No llenar este campo</label>
              <input
                id="int-sitio-web"
                tabIndex={-1}
                autoComplete="off"
                value={sitioWeb}
                onChange={(e) => setSitioWeb(e.target.value)}
              />
            </div>

            {mensaje && (
              <p className="mt-3 rounded-xl bg-error/30 px-4 py-2 text-sm font-semibold" role="alert">
                {mensaje}
              </p>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="mt-5 flex min-h-12 w-full items-center justify-center rounded-full bg-impacto px-6 text-lg font-bold text-fondo transition hover:brightness-110 disabled:opacity-70"
            >
              {enviando ? 'Anotando…' : 'Anotarme'}
            </button>
            <button
              type="button"
              onClick={() => setVista('mensaje')}
              className="mt-2 min-h-11 w-full text-sm font-semibold text-apoyo-3 underline"
            >
              Volver
            </button>
          </form>
        )}

        {vista === 'listo' && (
          <div role="status">
            <h2 id="titulo-cierre" className="mt-3 font-titulo text-5xl leading-none tracking-wide text-impacto">
              ¡Listo{primerNombre ? `, ${primerNombre}` : ''}!
            </h2>
            <p className="mt-3 text-lg text-arena">
              Ya estás en la línea de salida de la próxima carrera. Te escribimos apenas volvamos a prender la parrilla.
            </p>
            <button
              type="button"
              onClick={cerrar}
              className="mt-5 min-h-12 w-full rounded-full border-2 border-claro/60 px-6 font-semibold transition hover:bg-claro/10"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </dialog>
  )
}
