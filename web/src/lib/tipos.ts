export type Salsa = { nombre: string; descripcion: string }

/** Enlaces https a redes sociales; vacío = no se muestra el botón. */
export type Redes = { instagram: string; facebook: string; tiktok: string }

export type MotivoCierre =
  | 'CERRADO'
  | 'NO_INICIADO'
  | 'FECHA_VENCIDA'
  | 'CUPO_AGOTADO'
  | 'SIN_CONFIGURAR'

export type Modo = 'whatsapp' | 'remoto'

export type Estado = {
  modo: Modo
  abierto: boolean
  motivoCierre: MotivoCierre | null
  fechaCierre: Date | null
  /** AAAA-MM-DD */
  fechaEntrega: string | null
  /** HH:mm (24 h) */
  horaEntrega: string | null
  precioPlato: number
  maxPorPedido: number
  salsas: Salsa[]
  municipios: string[]
  whatsappNumero: string
  redes: Redes
  /** null en modo WhatsApp: no hay forma de contar cupos sin backend. */
  cuposRestantes: number | null
  tipoCupo: 'platos' | 'pedidos' | null
  /** Milisegundos a sumar al reloj local para igualar el del servidor. */
  desfaseReloj: number
}

export type CampoPedido =
  | 'nombre'
  | 'telefono'
  | 'direccion'
  | 'municipio'
  | 'salsas'
  | 'aceptaDatos'

export type Pedido = {
  nombre: string
  telefono: string
  direccion: string
  municipio: string
  /** { Tradicional: 2, Picante: 1 } */
  salsas: Record<string, number>
  aceptaDatos: boolean
  /** Opcional: autoriza avisos de aperturas y promociones (Ley 1581). */
  aceptaPublicidad: boolean
  /** Campo trampa: debe llegar vacío. */
  sitioWeb: string
}

export type Resumen = {
  numero: number | null
  nombre: string
  telefono: string
  direccion: string
  municipio: string
  cantidad: number
  salsasTexto: string
  total: number
  fechaEntrega: string | null
  horaEntrega: string | null
}

export type Errores = Partial<Record<CampoPedido, string>>

export type Resultado =
  | { ok: true; resumen: Resumen }
  | { ok: false; codigo: string; mensaje: string; errores?: Errores; registrado?: boolean; redes?: Redes }
