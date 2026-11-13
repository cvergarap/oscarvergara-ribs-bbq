import { useEffect, useState } from 'react'

type Props = {
  fechaCierre: Date
  desfaseReloj: number
  onVencido: () => void
}

function partes(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return {
    dias: Math.floor(s / 86400),
    horas: Math.floor((s % 86400) / 3600),
    minutos: Math.floor((s % 3600) / 60),
    segundos: s % 60,
  }
}

export function Contador({ fechaCierre, desfaseReloj, onVencido }: Props) {
  const calcular = () => fechaCierre.getTime() - (Date.now() + desfaseReloj)
  const [restante, setRestante] = useState(calcular)

  useEffect(() => {
    const id = window.setInterval(() => {
      const ms = fechaCierre.getTime() - (Date.now() + desfaseReloj)
      setRestante(ms)
      if (ms <= 0) {
        window.clearInterval(id)
        onVencido()
      }
    }, 1000)
    return () => window.clearInterval(id)
  }, [fechaCierre, desfaseReloj, onVencido])

  const { dias, horas, minutos, segundos } = partes(restante)
  const bloques = [
    { valor: dias, etiqueta: 'días' },
    { valor: horas, etiqueta: 'horas' },
    { valor: minutos, etiqueta: 'min' },
    { valor: segundos, etiqueta: 'seg' },
  ]

  return (
    <div role="timer" aria-label="Tiempo restante para pedir">
      <p className="mb-2 text-sm font-medium tracking-wide text-apoyo-3 uppercase">
        Los pedidos cierran en
      </p>
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {bloques.map((b) => (
          <div
            key={b.etiqueta}
            className="rounded-xl border border-apoyo-2 bg-apoyo-2/40 px-1 py-2 text-center"
          >
            <span className="block font-titulo text-4xl leading-none text-claro tabular-nums sm:text-5xl">
              {String(b.valor).padStart(2, '0')}
            </span>
            <span className="mt-1 block text-xs text-apoyo-3">{b.etiqueta}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
