import { fotosProducto, galeriaClientes, testimonios, type Foto } from '../data/contenido'

function Titulo({ children }: { children: string }) {
  return (
    <h2 className="font-titulo text-4xl tracking-wide text-claro sm:text-5xl">{children}</h2>
  )
}

/** Carrusel deslizable en celular, cuadrícula 2 × 2 en pantallas anchas. */
function Fotos({ fotos }: { fotos: Foto[] }) {
  return (
    <ul className="-mx-4 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0">
      {fotos.map((f) => (
        <li key={f.src} className="w-[85%] shrink-0 snap-center sm:w-auto">
          <img
            src={f.src}
            alt={f.alt}
            loading="lazy"
            className="aspect-[4/3] w-full rounded-2xl object-cover"
          />
        </li>
      ))}
    </ul>
  )
}

export function GaleriaProducto() {
  if (fotosProducto.length === 0) return null
  return (
    <section className="mx-auto max-w-5xl px-4 py-10" aria-labelledby="titulo-producto">
      <div id="titulo-producto">
        <Titulo>Así llegan</Titulo>
      </div>
      <Fotos fotos={fotosProducto} />
    </section>
  )
}

export function Testimonios() {
  if (testimonios.length === 0) return null
  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <Titulo>Lo que dicen</Titulo>
      <ul className="mt-4 grid gap-4 md:grid-cols-2">
        {testimonios.map((t, i) => (
          <li key={i} className="rounded-2xl bg-apoyo-2/40 p-5">
            <p className="text-arena">“{t.texto}”</p>
            <p className="mt-3 text-sm font-semibold text-claro">
              {t.nombre}
              {t.municipio ? <span className="font-normal text-apoyo-3"> · {t.municipio}</span> : null}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function GaleriaClientes() {
  if (galeriaClientes.length === 0) return null
  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <Titulo>Nuestros clientes</Titulo>
      <Fotos fotos={galeriaClientes} />
    </section>
  )
}

export function Pie({ onAvisoDatos }: { onAvisoDatos: () => void }) {
  return (
    <footer className="mt-10 border-t border-apoyo-2/60 px-4 py-8 text-center text-sm text-apoyo-3">
      <p className="font-titulo text-2xl tracking-wide text-claro">RIBS BBQ</p>
      <p className="mt-2">El pago se confirma por WhatsApp. Esta página no pide datos de pago.</p>
      <button
        type="button"
        onClick={onAvisoDatos}
        className="mt-3 min-h-11 underline underline-offset-4 hover:text-claro"
      >
        Tratamiento de datos personales
      </button>
      <p className="mt-2">© {new Date().getFullYear()} Oscar Vergara. Todos los derechos reservados.</p>
    </footer>
  )
}
