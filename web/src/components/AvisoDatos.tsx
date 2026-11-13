import { useEffect, useRef } from 'react'

type Props = { abierto: boolean; onCerrar: () => void }

export function AvisoDatos({ abierto, onCerrar }: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialogo = ref.current
    if (!dialogo) return
    if (abierto && !dialogo.open) dialogo.showModal()
    if (!abierto && dialogo.open) dialogo.close()
  }, [abierto])

  return (
    <dialog
      ref={ref}
      onClose={onCerrar}
      onClick={(e) => e.target === ref.current && onCerrar()}
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl bg-arena p-0 text-fondo backdrop:bg-black/70"
      aria-labelledby="titulo-aviso"
    >
      <div className="p-6">
        <h2 id="titulo-aviso" className="font-titulo text-3xl tracking-wide">
          Tratamiento de datos personales
        </h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed">
          <p>
            En cumplimiento de la Ley 1581 de 2012, RIBS BBQ usa tu nombre, celular, dirección y
            municipio únicamente para gestionar, confirmar y entregar tu pedido.
          </p>
          <p>
            Los datos se envían al negocio por WhatsApp cuando confirmas el pedido. No se venden ni se
            comparten con terceros, y esta página no pide ni guarda datos de pago.
          </p>
          <p>
            Puedes conocer, actualizar o pedir que se eliminen tus datos escribiéndonos por el mismo
            WhatsApp.
          </p>
        </div>
        <button
          type="button"
          onClick={onCerrar}
          className="mt-5 min-h-11 w-full rounded-full bg-fondo px-5 font-semibold text-claro"
        >
          Entendido
        </button>
      </div>
    </dialog>
  )
}
