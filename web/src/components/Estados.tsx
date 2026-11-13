import { useState } from 'react'
import { formatoEntrega, formatoPesos } from '../lib/formato'
import type { MotivoCierre, Resumen } from '../lib/tipos'
import { copiarTexto, enlacesWhatsApp, esCelular, mensajePedido } from '../lib/whatsapp'

const claseBotonVerde =
  'flex min-h-14 w-full items-center justify-center rounded-full bg-whatsapp px-6 text-lg font-bold text-fondo transition hover:brightness-105'
const claseBotonBorde =
  'flex min-h-12 w-full items-center justify-center rounded-full border-2 border-fondo px-6 font-semibold transition hover:bg-white/60'

export function Confirmacion({
  resumen,
  whatsappNumero,
  onNuevo,
}: {
  resumen: Resumen
  whatsappNumero: string
  onNuevo: () => void
}) {
  const mensaje = mensajePedido(resumen)
  const enlaces = enlacesWhatsApp(whatsappNumero, mensaje)
  const [celular] = useState(esCelular)
  const [copiado, setCopiado] = useState<'si' | 'no' | null>(null)
  const copiar = async () => setCopiado((await copiarTexto(mensaje)) ? 'si' : 'no')
  const titulo =
    resumen.numero !== null ? `¡Pedido #${resumen.numero} registrado!` : '¡Tu pedido está listo!'

  return (
    <section id="pedido" className="mx-auto max-w-5xl px-4 py-10" aria-live="polite">
      <div className="mx-auto max-w-xl rounded-3xl bg-arena p-6 text-fondo shadow-2xl sm:p-8">
        <h2 className="font-titulo text-4xl tracking-wide sm:text-5xl">{titulo}</h2>
        <p className="mt-2 text-lg">
          <strong>Envía el mensaje en WhatsApp para confirmar tu pedido</strong> y coordinar el pago.
        </p>

        <dl className="mt-5 space-y-2 rounded-2xl bg-white p-4">
          <div className="flex justify-between gap-4">
            <dt className="text-apoyo-2">Platos</dt>
            <dd className="text-right font-semibold">
              {resumen.cantidad} ({resumen.salsasTexto})
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-apoyo-2">Entrega en</dt>
            <dd className="text-right font-semibold">{resumen.municipio}</dd>
          </div>
          {resumen.fechaEntrega && (
            <div className="flex justify-between gap-4">
              <dt className="text-apoyo-2">Entrega</dt>
              <dd className="text-right font-semibold">{formatoEntrega(resumen.fechaEntrega, resumen.horaEntrega)}</dd>
            </div>
          )}
          <div className="flex justify-between gap-4 border-t border-apoyo-3 pt-2">
            <dt className="font-semibold">Total</dt>
            <dd className="font-titulo text-2xl tracking-wide text-promo">{formatoPesos(resumen.total)}</dd>
          </div>
        </dl>

        {celular ? (
          <a href={enlaces.universal} className={`mt-6 ${claseBotonVerde}`}>
            Abrir WhatsApp
          </a>
        ) : (
          <a href={enlaces.app} className={`mt-6 ${claseBotonVerde}`}>
            Abrir la aplicación de WhatsApp
          </a>
        )}

        <div className="mt-4 rounded-2xl bg-white/60 p-4 text-sm">
          <p>
            ¿No se abrió? Escríbenos al <strong>+{whatsappNumero}</strong> y pega el pedido:
          </p>
          <button type="button" onClick={copiar} className={`mt-3 ${claseBotonBorde}`}>
            {copiado === 'si' ? '¡Pedido copiado!' : 'Copiar pedido'}
          </button>
          {copiado === 'no' && (
            <p className="mt-2 font-semibold text-error" role="alert">
              No se pudo copiar. Selecciona el texto del pedido y cópialo manualmente.
            </p>
          )}
          {copiado === 'no' && (
            <pre className="mt-2 whitespace-pre-wrap rounded-xl bg-white p-3 font-texto text-xs">{mensaje}</pre>
          )}
        </div>

        <button
          type="button"
          onClick={onNuevo}
          className="mt-3 min-h-11 w-full text-sm font-semibold underline underline-offset-4"
        >
          Hacer otro pedido
        </button>
      </div>
    </section>
  )
}

const TEXTOS: Record<MotivoCierre, string> = {
  CERRADO: 'Los pedidos están cerrados. Te esperamos en la próxima apertura.',
  NO_INICIADO: 'Los pedidos aún no abren. Vuelve pronto.',
  FECHA_VENCIDA: 'Los pedidos están cerrados. Te esperamos en la próxima apertura.',
  CUPO_AGOTADO: 'Se agotaron los cupos de esta jornada. Te esperamos en la próxima apertura.',
  SIN_CONFIGURAR: 'Los pedidos están cerrados por ahora. Te esperamos en la próxima apertura.',
}

export function Cerrado({ motivo }: { motivo: MotivoCierre }) {
  return (
    <section id="pedido" className="mx-auto max-w-5xl px-4 py-10">
      <div className="mx-auto max-w-xl rounded-3xl border-2 border-apoyo-2 p-6 text-center">
        <h2 className="font-titulo text-4xl tracking-wide text-claro">
          {motivo === 'CUPO_AGOTADO' ? 'Cupos agotados' : 'Pedidos cerrados'}
        </h2>
        <p className="mt-2 text-arena">{TEXTOS[motivo]}</p>
      </div>
    </section>
  )
}

export function ErrorCarga({ onReintentar }: { onReintentar: () => void }) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <div className="mx-auto max-w-xl rounded-3xl border-2 border-apoyo-2 p-6 text-center">
        <p className="text-arena">No pudimos cargar la información. Intenta de nuevo en un momento.</p>
        <button
          type="button"
          onClick={onReintentar}
          className="mt-4 min-h-11 rounded-full bg-impacto px-6 font-semibold text-fondo"
        >
          Reintentar
        </button>
      </div>
    </section>
  )
}
