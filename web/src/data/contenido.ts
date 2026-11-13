/**
 * Contenido que se agrega de forma progresiva. Las secciones con listas vacías no se
 * muestran (sin tarjetas vacías ni texto de relleno).
 *
 * Fotos: guardar los archivos en web/public/fotos/ y agregar aquí la ruta.
 * Solo fotos reales del producto, sin texto encima.
 */

export type Foto = { src: string; alt: string }
export type Testimonio = { nombre: string; municipio?: string; texto: string }

/** 4 fotos del producto. Ej.: { src: '/fotos/costillas-1.jpg', alt: 'Costillas BBQ con papas' } */
export const fotosProducto: Foto[] = []

export const testimonios: Testimonio[] = []

/** Fotos de clientes, con su autorización. */
export const galeriaClientes: Foto[] = []
