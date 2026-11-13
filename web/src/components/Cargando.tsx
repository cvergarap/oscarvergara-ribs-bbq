/**
 * Esqueletos de carga mientras responde el Apps Script. Ocupan el mismo espacio que el
 * contenido real (precio, contador y formulario) para que nada salte al reemplazarlos.
 * La animación es CSS puro (ver .esq en index.css): los bloques aparecen de arriba hacia
 * abajo y un barrido de luz baja por la tarjeta. No usa caché ni respuestas anteriores.
 */
import type { CSSProperties } from 'react'

/** Bloque gris animado; `i` define el orden de aparición (de arriba hacia abajo). */
function Bloque({ className = '', i = 0 }: { className?: string; i?: number }) {
  return <div className={`esq ${className}`} style={{ '--i': i } as CSSProperties} />
}

/** Precio, entrega y contador de la portada (mismas alturas que el contenido real). */
export function PortadaCargando() {
  return (
    <div aria-hidden="true">
      <Bloque i={0} className="mt-4 h-12 w-44 rounded-xl" />
      <Bloque i={1} className="mt-2 h-5 w-64 max-w-full rounded-md" />
      <Bloque i={2} className="mt-2 h-5 w-40 rounded-md" />
      <Bloque i={3} className="mt-6 h-5 w-48 rounded-md" />
      <div className="mt-2 grid grid-cols-4 gap-2 sm:gap-3">
        {[4, 5, 6, 7].map((i) => (
          <Bloque key={i} i={i} className="h-[4.625rem] rounded-xl sm:h-[5.25rem]" />
        ))}
      </div>
      <Bloque i={8} className="mt-2 h-4 w-64 max-w-full rounded-md" />
      <Bloque i={9} className="mt-2 h-4 w-32 rounded-md" />
      <Bloque i={10} className="mt-6 h-12 w-full rounded-full sm:w-52" />
    </div>
  )
}

/** Etiqueta + campo (+ ayuda opcional), como en el formulario real. */
function CampoCargando({ i, ayuda = false }: { i: number; ayuda?: boolean }) {
  return (
    <div>
      <div className="py-1">
        <Bloque i={i} className="esq-claro h-4 w-32 rounded-md" />
      </div>
      <Bloque i={i + 1} className="esq-campo mt-1 h-12 w-full rounded-xl" />
      {ayuda && (
        <div className="pt-1 pb-1">
          <Bloque i={i + 1} className="esq-claro h-4 w-56 max-w-full rounded-md" />
        </div>
      )}
    </div>
  )
}

/** Tarjeta del formulario con sus campos (mismas alturas que el formulario real). */
export function FormularioCargando() {
  return (
    <section
      id="pedido"
      className="mx-auto max-w-5xl px-4 py-10"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="esq-tarjeta relative mx-auto max-w-xl overflow-hidden rounded-3xl bg-arena p-5 text-fondo shadow-2xl sm:p-8">
        <h2 className="font-titulo text-4xl tracking-wide sm:text-5xl">Haz tu pedido</h2>
        <p className="mt-1 min-h-12 font-semibold text-apoyo-2">Calentando la parrilla…</p>
        <span className="sr-only">Cargando la información de la jornada.</span>

        <div className="mt-6 space-y-5" aria-hidden="true">
          <CampoCargando i={1} />
          <CampoCargando i={3} ayuda />
          <CampoCargando i={5} ayuda />
          <CampoCargando i={7} />

          {/* salsas */}
          <div>
            <div className="py-1">
              <Bloque i={9} className="esq-claro h-4 w-52 rounded-md" />
            </div>
            <div className="py-0.5">
              <Bloque i={9} className="esq-claro h-4 w-40 rounded-md" />
            </div>
            {[10, 11, 12].map((i) => (
              <Bloque key={i} i={i} className="esq-campo mt-3 h-[4.5rem] w-full rounded-2xl" />
            ))}
          </div>

          {/* total, autorizaciones, botón y nota */}
          <Bloque i={13} className="h-[4.25rem] w-full rounded-2xl" />
          <Bloque i={14} className="esq-claro h-[3.75rem] w-full rounded-md" />
          <Bloque i={15} className="esq-campo h-[6.75rem] w-full rounded-2xl" />
          <Bloque i={16} className="h-14 w-full rounded-full" />
          <div className="py-2">
            <Bloque i={17} className="esq-claro mx-auto h-4 w-3/4 rounded-md" />
          </div>
        </div>
      </div>
    </section>
  )
}
