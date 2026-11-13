import { useCallback, useEffect, useRef, useState } from 'react'
import { AvisoDatos } from './components/AvisoDatos'
import { FormularioCargando } from './components/Cargando'
import { Cabecera } from './components/Cabecera'
import { Cerrado, Confirmacion, ErrorCarga } from './components/Estados'
import { Formulario, type InfoAgotado } from './components/Formulario'
import { ModalAgotado } from './components/ModalAgotado'
import { ModalCierre } from './components/ModalCierre'
import { Portada } from './components/Portada'
import { GaleriaClientes, GaleriaProducto, Pie, Testimonios } from './components/Secciones'
import { MODO, obtenerEstado } from './lib/fuenteDatos'
import type { Estado, Resumen } from './lib/tipos'
import { abrirWhatsAppSiEsCelular, enlacesWhatsApp, mensajePedido } from './lib/whatsapp'

export default function App() {
  const [estado, setEstado] = useState<Estado | null>(null)
  const [falloCarga, setFalloCarga] = useState(false)
  const [vencido, setVencido] = useState(false)
  const [resumen, setResumen] = useState<Resumen | null>(null)
  const [avisoAbierto, setAvisoAbierto] = useState(false)
  const [agotado, setAgotado] = useState<InfoAgotado | null>(null)
  // Cambiar la clave vuelve a crear el formulario desde cero (campos limpios).
  const [claveFormulario, setClaveFormulario] = useState(0)
  const [cierreAbierto, setCierreAbierto] = useState(false)
  const cierreMostrado = useRef(false)

  const cargar = useCallback(async () => {
    try {
      const e = await obtenerEstado()
      setEstado(e)
      setFalloCarga(false)
      setVencido(false)
    } catch {
      setFalloCarga(true)
    }
  }, [])

  useEffect(() => {
    cargar()
    // En modo remoto, los cupos cambian con cada pedido: se consultan cada minuto.
    if (MODO !== 'remoto') return
    const id = window.setInterval(cargar, 60_000)
    return () => window.clearInterval(id)
  }, [cargar])

  const alVencer = useCallback(() => setVencido(true), [])

  const alConfirmar = (r: Resumen) => {
    setResumen(r)
    if (estado) abrirWhatsAppSiEsCelular(enlacesWhatsApp(estado.whatsappNumero, mensajePedido(r)))
    document.getElementById('pedido')?.scrollIntoView()
  }

  /** Al cerrar el popup de cupos agotados: formulario limpio y de vuelta al inicio. */
  const alCerrarAgotado = () => {
    setAgotado(null)
    setClaveFormulario((k) => k + 1)
    window.scrollTo({ top: 0 })
  }

  const abierto = !!estado && estado.abierto && !vencido

  // Popup de cierre: se abre solo una vez, al vencer el contador o al entrar con los
  // pedidos cerrados. Después se puede reabrir desde el aviso de la página.
  useEffect(() => {
    if (estado && !abierto && !resumen && !cierreMostrado.current) {
      cierreMostrado.current = true
      setCierreAbierto(true)
    }
  }, [estado, abierto, resumen])

  return (
    <>
      <Cabecera mostrarBoton={abierto && !resumen} />
      <main>
        {!falloCarga || estado ? <Portada estado={estado} abierto={abierto} onVencido={alVencer} /> : null}
        <GaleriaProducto />

        {!estado && !falloCarga && <FormularioCargando />}
        {falloCarga && !estado && <ErrorCarga onReintentar={cargar} />}
        {estado && resumen && (
          <Confirmacion
            resumen={resumen}
            whatsappNumero={estado.whatsappNumero}
            onNuevo={() => setResumen(null)}
          />
        )}
        {estado && !resumen && abierto && (
          <Formulario
            key={claveFormulario}
            estado={estado}
            onConfirmado={alConfirmar}
            onAvisoDatos={() => setAvisoAbierto(true)}
            onAgotado={setAgotado}
            onRecargarEstado={cargar}
          />
        )}
        {estado && !resumen && !abierto && <Cerrado onVerMensaje={() => setCierreAbierto(true)} />}

        <Testimonios />
        <GaleriaClientes />
      </main>
      <Pie onAvisoDatos={() => setAvisoAbierto(true)} />
      <AvisoDatos abierto={avisoAbierto} onCerrar={() => setAvisoAbierto(false)} />
      <ModalAgotado info={agotado} onCerrar={alCerrarAgotado} />
      {estado && (
        <ModalCierre
          abierto={cierreAbierto}
          onCerrar={() => setCierreAbierto(false)}
          redes={estado.redes}
          onAvisoDatos={() => setAvisoAbierto(true)}
        />
      )}

      {import.meta.env.DEV && estado && !estado.whatsappNumero && (
        <p className="fixed right-2 bottom-2 z-30 rounded bg-error px-3 py-2 text-xs text-white">
          Falta VITE_WHATSAPP_NUMERO (web/.env.local)
        </p>
      )}
    </>
  )
}
