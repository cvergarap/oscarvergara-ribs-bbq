import { useEffect, useRef } from 'react'
import type { InfoAgotado } from './Formulario'

type Props = { info: InfoAgotado | null; onCerrar: () => void }

const BOTONES_REDES: { clave: keyof InfoAgotado['redes']; texto: string }[] = [
  { clave: 'instagram', texto: 'Síguenos en Instagram' },
  { clave: 'facebook', texto: 'Síguenos en Facebook' },
  { clave: 'tiktok', texto: 'Síguenos en TikTok' },
]

/** Popup llamativo cuando el pedido llega con el cupo agotado (se registró como sobrepedido). */
export function ModalAgotado({ info, onCerrar }: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialogo = ref.current
    if (!dialogo) return
    if (info && !dialogo.open) dialogo.showModal()
    if (!info && dialogo.open) dialogo.close()
  }, [info])

  const redes = info ? BOTONES_REDES.filter((b) => info.redes[b.clave]) : []
  const primerNombre = info?.nombre.split(' ')[0] ?? ''

  return (
    <dialog
      ref={ref}
      onClose={onCerrar}
      aria-labelledby="titulo-agotado"
      aria-describedby="texto-agotado"
      className="m-auto w-[calc(100%-2rem)] max-w-md overflow-hidden rounded-3xl border-4 border-impacto bg-fondo p-0 text-claro shadow-[0_0_60px_rgba(239,114,36,0.55)] backdrop:bg-black/80 backdrop:backdrop-blur-sm"
    >
      {info && (
        <div className="relative p-6 text-center sm:p-8">
          <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-promo via-impacto to-promo" />
          <img
            src="/logo-ribs-bbq-recorte.jpg"
            alt=""
            className="mx-auto h-20 w-auto"
            width={309}
            height={240}
          />
          <p className="mt-3 inline-block rounded-full bg-promo px-4 py-1 text-xs font-bold tracking-widest uppercase">
            Cupos agotados
          </p>
          <h2 id="titulo-agotado" className="mt-3 font-titulo text-5xl leading-none tracking-wide text-impacto sm:text-6xl">
            ¡Volaron las costillas!
          </h2>

          <div id="texto-agotado" className="mt-4 space-y-3 text-arena">
            <p className="text-lg">
              {primerNombre ? <strong className="text-claro">{primerNombre}, </strong> : null}
              llegaste justo cuando el último plato encontró dueño. Lo sentimos de verdad: esta jornada
              se agotó.
            </p>
            {info.aceptaPublicidad ? (
              <p>
                <strong className="text-claro">Ya estás en nuestra lista VIP.</strong> Serás de los
                primeros en saber cuándo volvemos a encender la parrilla.
              </p>
            ) : (
              <p>
                La próxima tanda también se va a ir rápido.{' '}
                <strong className="text-claro">Síguenos y entérate primero</strong> de la próxima
                apertura para asegurar tu plato.
              </p>
            )}
          </div>

          {redes.length > 0 && (
            <div className="mt-6 space-y-3">
              {redes.map((b) => (
                <a
                  key={b.clave}
                  href={info.redes[b.clave]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-12 w-full items-center justify-center rounded-full bg-impacto px-6 font-bold text-fondo transition hover:brightness-110"
                >
                  {b.texto}
                </a>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={onCerrar}
            className="mt-4 min-h-12 w-full rounded-full border-2 border-claro/60 px-6 font-semibold transition hover:bg-claro/10"
          >
            ¡Entendido, nos vemos en la próxima!
          </button>
        </div>
      )}
    </dialog>
  )
}
