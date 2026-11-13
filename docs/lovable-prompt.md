# Prompts para Lovable

## Cómo usarlos
1. Crear la cuenta en lovable.dev y un proyecto nuevo.
2. Pegar el **Prompt 1** completo (MVP en modo WhatsApp). Es lo único necesario hoy.
3. Subir el logo (`assets/marca/logo-ribs-bbq.jpg`) desde el chat de Lovable y pegar el
   ajuste "Logo" del final.
4. Revisar la vista previa en tamaño celular (ícono de teléfono en Lovable).
5. Conectar GitHub: **Settings → GitHub → Connect**, cuenta `cvergarap`, repositorio
   **privado** (ej.: `oscarvergara-ribs-bbq-web`).
6. Configurar Cloudflare Pages con [despliegue-cloudflare.md](despliegue-cloudflare.md).

El **Prompt 2** se usa más adelante, cuando Google Sheets y Apps Script salgan de pausa.

Consejo: si algo sale mal, corrígelo con prompts cortos ("el contador no se ve en
celular, corrígelo") en lugar de repetir el prompt completo.

---

## Prompt 1: MVP en modo WhatsApp

```
Crea una landing de pedidos de una sola página para "RIBS BBQ", un emprendimiento de
costillas barbecue en Colombia. Todo el texto en español de Colombia.

STACK Y REGLAS
- React + Vite + TypeScript + Tailwind. Sitio 100 % estático: NO uses el backend de
  Lovable, ni Supabase, ni autenticación, ni base de datos.
- MOBILE-FIRST: diseña primero para 360 px de ancho. Las clases base de Tailwind son
  para celular; sm:, md: y lg: solo amplían. Sin desplazamiento horizontal.
  Controles táctiles de al menos 44 × 44 px. Campos de formulario con texto de 16 px.
- En computador (≥1280 px) el contenido se centra con un ancho máximo.

PALETA (como tokens en tailwind.config)
- fondo: #2F1C15 (fondo principal)
- impacto: #EF7224 (botones de acción, acentos)
- claro: #FDEED6 (títulos y texto sobre fondo oscuro)
- arena: #F3D8B7 (fondos secundarios, tarjetas)
- promo: #B7502B (etiquetas de promoción)
- apoyo: #9A4B24, #733E21, #E1B78A
Contraste AA en todos los textos. Tipografía: títulos en "Bebas Neue", texto en "Inter"
(Google Fonts).

CONFIGURACIÓN DE LA JORNADA
Crea src/config/jornada.ts. El negocio lo edita para cada apertura:

export const jornada = {
  pedidosAbiertos: true,
  fechaCierre: "2026-11-20T12:00:00-05:00",   // hora de Colombia
  fechaEntrega: "2026-11-21",
  precioPlato: 30000,
  maxPorPedido: 5,
  producto: "Costillas BBQ de 570 g aprox. + 120 g de papas a la francesa rizadas",
  salsas: [
    { nombre: "Tradicional", descripcion: "Nuestra BBQ clásica, ahumada." },
    { nombre: "Dulce", descripcion: "BBQ con un toque de miel." },
    { nombre: "Picante", descripcion: "BBQ con chile, para los valientes." },
  ],
  municipios: [] as string[],   // si está vacío, el municipio es texto libre
};

export const WHATSAPP_NUMERO =
  import.meta.env.VITE_WHATSAPP_NUMERO ?? "";   // formato 57XXXXXXXXXX
export const APPS_SCRIPT_URL =
  import.meta.env.VITE_APPS_SCRIPT_URL ?? "";    // vacío = modo WhatsApp

FUENTE DE DATOS INTERCAMBIABLE
Crea src/lib/fuenteDatos.ts con dos funciones que usa toda la interfaz:
- obtenerEstado(): Promise<Estado>
- enviarPedido(pedido): Promise<Resultado>
Por ahora implementa solo el modo LOCAL (APPS_SCRIPT_URL vacío):
- obtenerEstado arma el estado desde jornada.ts:
  { abierto, motivoCierre, fechaCierre, fechaEntrega, precioPlato, maxPorPedido,
    salsas, municipios, whatsappNumero, cuposRestantes: null, tipoCupo: null }
  abierto = pedidosAbiertos && ahora < fechaCierre.
  motivoCierre = "CERRADO" o "FECHA_VENCIDA" cuando aplique.
- enviarPedido valida y devuelve { ok: true, numero: null, resumen } sin enviar datos a
  ningún servidor. Luego la interfaz abre WhatsApp.
Deja los tipos preparados para un modo REMOTO futuro (cuposRestantes, tipoCupo y numero
pueden ser null; la interfaz oculta lo que venga null).

ESTRUCTURA, EN ESTE ORDEN
1. Cabecera fija con espacio para el logo y botón "Hacer mi pedido" que desplaza
   suavemente hasta el formulario.
2. Portada: título "Costillas BBQ", el texto de producto, el precio y un contador
   regresivo (días, horas, minutos, segundos) hasta fechaCierre. Si cuposRestantes no es
   null, mostrar "Quedan N platos". Botón "Hacer mi pedido".
3. Galería de 4 fotos del producto (placeholders 4:3; en celular carrusel deslizable,
   en computador cuadrícula 2 × 2). Lazy loading y texto alternativo.
4. Formulario de pedido (ver abajo).
5. Testimonios desde src/data/testimonios.ts (arreglo vacío). Si está vacío, la sección
   NO se muestra.
6. Galería de clientes desde src/data/galeria.ts (vacío). Igual: oculta si está vacía.
7. Pie con el nombre del negocio y el enlace al aviso de tratamiento de datos.

FORMULARIO
- Nombre completo (3 a 80 caracteres).
- Celular: inputMode="numeric", 10 dígitos, empieza por 3. Error junto al campo.
- Dirección de entrega (5 a 150 caracteres).
- Municipio: lista desplegable si jornada.municipios tiene elementos; si está vacía,
  campo de texto obligatorio.
- Salsas por plato: una fila por salsa con nombre, descripción y control − / N / +.
  Total de platos = suma. Mostrar "Total: N platos — $X". Mínimo 1, máximo maxPorPedido
  (y cuposRestantes si no es null).
- Casilla obligatoria: "Acepto el tratamiento de mis datos personales según la Ley 1581
  de 2012", con un modal que explique que los datos se usan solo para gestionar y
  entregar el pedido y que se envían al negocio por WhatsApp.
- Campo trampa "sitio_web": invisible para personas (fuera de pantalla, aria-hidden,
  tabIndex -1, autoComplete off; no usar display:none). Si tiene contenido, no hacer nada.
- Botón "Enviar pedido por WhatsApp" con color de impacto.
- La web NUNCA muestra ni pide datos de pago.

ENVÍO EN MODO WHATSAPP
- Tras validar, abrir https://wa.me/{whatsappNumero}?text={mensaje codificado}:
  "Hola RIBS BBQ, quiero hacer este pedido:
  • Nombre: {nombre}
  • Celular: {celular}
  • Dirección: {direccion}, {municipio}
  • Platos: {cantidad} ({Tradicional x2, Picante x1})
  • Total: {total}
  • Entrega: {fechaEntrega}
  Quedo atento para el pago."
- Usar window.location.href en celular (abre la app) y una pestaña nueva en computador.
- Mostrar después una tarjeta de resumen: "Envía el mensaje en WhatsApp para confirmar
  tu pedido", con un botón para volver a abrir WhatsApp por si no se abrió.
- Si whatsappNumero está vacío, mostrar en la vista previa un aviso visible solo en
  desarrollo: "Falta VITE_WHATSAPP_NUMERO".

ESTADOS DE CIERRE
- Si abierto es false: ocultar el formulario y mostrar "Los pedidos están cerrados.
  Te esperamos en la próxima apertura."
- Si el contador llega a cero mientras la página está abierta, ocultar el formulario
  sin recargar.

FORMATO
- Precios: Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP',
  maximumFractionDigits: 0 }).
- Fechas en hora de Colombia (America/Bogota), ej.: "sábado 21 de noviembre".

SEO Y METADATOS
- Título "RIBS BBQ | Costillas BBQ a domicilio", descripción corta, idioma "es-CO",
  etiquetas Open Graph para que el enlace se vea bien al compartirlo por WhatsApp.
```

---

## Ajustes cortos (después del Prompt 1)
- **Logo:** "Usa la imagen que subí como logo en la cabecera, con alto de 48 px en celular
  y 64 px en computador, y como imagen Open Graph."
- **Fotos:** "Reemplaza los 4 placeholders de la galería por estas fotos."
- **Revisión móvil:** "Revisa la página a 360 px y corrige cualquier desbordamiento
  horizontal o texto cortado."
- **Nueva jornada:** "En src/config/jornada.ts cambia fechaCierre a
  2026-11-27T12:00:00-05:00 y fechaEntrega a 2026-11-28."

---

## Prompt 2: modo remoto (cuando Google Sheets salga de pausa)

```
Implementa el modo REMOTO de src/lib/fuenteDatos.ts. Se activa cuando APPS_SCRIPT_URL
tiene valor; si está vacío, se sigue usando el modo local actual. No cambies la interfaz.

GET (estado)
- fetch(APPS_SCRIPT_URL) sin cabeceras personalizadas. Responde JSON:
  { ok, abierto, motivo_cierre, tipo_cupo, cupo_maximo, cupos_restantes,
    max_por_pedido, precio_plato, fecha_cierre (ISO), fecha_entrega ("AAAA-MM-DD"),
    salsas: [{ nombre, descripcion }], municipios: string[], whatsapp_numero,
    ahora (ISO) }
  motivo_cierre: null | "CERRADO" | "NO_INICIADO" | "FECHA_VENCIDA" | "CUPO_AGOTADO" |
  "SIN_CONFIGURAR".
- Mapear a los tipos existentes (snake_case → camelCase).
- Consultar al cargar y cada 60 s. Usar "ahora" para corregir el reloj del celular.
- "Quedan N platos" si tipo_cupo es "platos"; "Quedan N cupos" si es "pedidos".
- Si falla, mostrar "No pudimos cargar la información. Escríbenos por WhatsApp." y
  reintentar.

POST (registro)
- Enviar con Content-Type "text/plain;charset=utf-8" (NO application/json), para evitar
  la verificación previa de CORS que Apps Script no responde:
  body: JSON.stringify({ nombre, telefono, direccion, municipio,
    salsas: { "Tradicional": 2 }, acepta_datos: true, sitio_web })
- Éxito: { ok: true, numero, resumen: { cantidad, salsas, municipio, total,
  fecha_entrega }, cupos_restantes, whatsapp_numero } → confirmación con
  "¡Pedido #N registrado!" y el botón de WhatsApp con el número de pedido en el mensaje.
- Error: { ok: false, codigo, mensaje, errores?, cupos_restantes? } con codigo
  "DATOS_INVALIDOS" | "CUPO_AGOTADO" | "CUPO_INSUFICIENTE" | "CERRADO" | "OCUPADO" |
  "ERROR". Si hay "errores", mostrarlos junto a cada campo; si no, "mensaje" arriba del
  botón. En CUPO_AGOTADO, CUPO_INSUFICIENTE o CERRADO, volver a consultar el estado.
```
