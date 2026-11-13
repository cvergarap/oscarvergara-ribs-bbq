type Props = { mostrarBoton: boolean }

export function Cabecera({ mostrarBoton }: Props) {
  return (
    <header className="sticky top-0 z-20 border-b border-apoyo-2/60 bg-fondo/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 md:h-20">
        <a href="#inicio" className="block shrink-0" aria-label="RIBS BBQ, inicio">
          {/* Versión recortada del logo (sin margen), completa y sin deformar. */}
          <img
            src="/logo-ribs-bbq-recorte.jpg"
            alt="RIBS BBQ"
            className="h-12 w-auto object-contain md:h-16"
            width={309}
            height={240}
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
