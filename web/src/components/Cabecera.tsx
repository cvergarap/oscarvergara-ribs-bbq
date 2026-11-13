type Props = { mostrarBoton: boolean }

export function Cabecera({ mostrarBoton }: Props) {
  return (
    <header className="sticky top-0 z-20 border-b border-apoyo-2/60 bg-fondo/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 md:h-20">
        <a href="#inicio" className="block h-12 w-28 overflow-hidden md:h-16 md:w-36" aria-label="RIBS BBQ, inicio">
          {/* El logo es cuadrado con margen amplio; se recorta al centro. */}
          <img
            src="/logo-ribs-bbq.jpg"
            alt="RIBS BBQ"
            className="h-full w-full scale-[1.9] object-cover"
            width={144}
            height={64}
          />
        </a>
        {mostrarBoton && (
          <a
            href="#pedido"
            className="inline-flex min-h-11 items-center rounded-full bg-impacto px-5 font-semibold text-fondo transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-claro"
          >
            Hacer mi pedido
          </a>
        )}
      </div>
    </header>
  )
}
