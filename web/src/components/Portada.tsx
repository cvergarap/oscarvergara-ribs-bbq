import { jornada } from '../config/jornada'
import { formatoEntrega, formatoFechaHora, formatoPesos } from '../lib/formato'
import type { Estado } from '../lib/tipos'
import { Contador } from './Contador'

type Props = {
  estado: Estado
  abierto: boolean
  onVencido: () => void
}

export function Portada({ estado, abierto, onVencido }: Props) {
  const unidad = estado.tipoCupo === 'pedidos' ? 'cupos' : 'platos'

  return (
    <section id="inicio" className="mx-auto max-w-5xl px-4 pt-6 pb-10 md:grid md:grid-cols-2 md:items-center md:gap-10 md:pt-12">
      <img
        src="/logo-ribs-bbq.jpg"
        alt=""
        className="mx-auto -my-6 w-full max-w-sm md:order-2 md:max-w-md"
        width={1024}
        height={1024}
      />

      <div>
        <span className="inline-block rounded-full bg-promo px-3 py-1 text-xs font-semibold tracking-wide text-claro uppercase">
          Edición limitada
        </span>
        <h1 className="mt-3 font-titulo text-6xl leading-none tracking-wide text-claro sm:text-7xl">
          Costillas BBQ
        </h1>
        <p className="mt-3 text-lg text-arena">{jornada.producto}.</p>
        <p className="mt-4 font-titulo text-5xl tracking-wide text-impacto">
          {formatoPesos(estado.precioPlato)}
          <span className="ml-2 font-texto text-base font-medium text-apoyo-3">por plato</span>
        </p>

        {estado.fechaEntrega && (
          <p className="mt-2 text-arena">
            Entrega: <strong className="text-claro">{formatoEntrega(estado.fechaEntrega, estado.horaEntrega)}</strong>
          </p>
        )}

        <div className="mt-6">
          {abierto && estado.fechaCierre ? (
            <>
              <Contador
                fechaCierre={estado.fechaCierre}
                desfaseReloj={estado.desfaseReloj}
                onVencido={onVencido}
              />
              <p className="mt-2 text-sm text-apoyo-3">
                Cierre: {formatoFechaHora(estado.fechaCierre)} (hora de Colombia)
              </p>
            </>
          ) : null}

          {estado.cuposRestantes !== null && abierto && (
            <p className="mt-4 text-lg font-semibold text-claro">
              Quedan <span className="text-impacto">{estado.cuposRestantes}</span> {unidad}
            </p>
          )}
        </div>

        {abierto && (
          <a
            href="#pedido"
            className="mt-6 flex min-h-12 w-full items-center justify-center rounded-full bg-impacto px-6 text-lg font-bold text-fondo transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-claro sm:w-auto sm:inline-flex"
          >
            Hacer mi pedido
          </a>
        )}
      </div>
    </section>
  )
}
