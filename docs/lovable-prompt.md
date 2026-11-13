# Prompt inicial para Lovable

Cómo usarlo:
1. Crear el proyecto en Lovable y pegar el **Prompt 1** completo.
2. Subir el logo (`assets/marca/logo-ribs-bbq.jpg`) desde el chat de Lovable.
3. Revisar la vista previa y luego pegar el **Prompt 2** (conexión al backend).
4. Conectar GitHub (**Settings → GitHub**, cuenta `cvergarap`, repositorio privado).

Se divide en dos prompts porque Lovable responde mejor a pedidos acotados. Si algo sale
mal, se corrige con prompts cortos en lugar de repetir todo.

---

## Prompt 1: estructura y diseño

```
Crea una landing de pedidos de una sola página para "RIBS BBQ", un emprendimiento de
costillas barbecue en Colombia. Todo el texto en español de Colombia.

STACK Y REGLAS
- React + Vite + TypeScript + Tailwind. Sitio 100 % estático: sin backend de Lovable,
  sin Supabase, sin autenticación, sin base de datos.
- MOBILE-FIRST: diseña primero para 360 px de ancho. Las clases base de Tailwind son
  para celular; sm:, md: y lg: solo amplían. Sin desplazamiento horizontal.
  Controles táctiles de al menos 44 × 44 px. Campos de formulario con texto de 16 px.
- En computador (≥1280 px) el contenido se centra con ancho máximo.

PALETA (usar como tokens en tailwind.config)
- fondo: #2F1C15 (fondo principal)
- impacto: #EF7224 (botones de acción, acentos)
- claro: #FDEED6 (títulos y texto sobre fondo oscuro)
- arena: #F3D8B7 (fondos secundarios, tarjetas)
- promo: #B7502B (etiquetas de promoción)
- apoyo: #9A4B24, #733E21, #E1B78A
Asegura contraste AA en todos los textos.
Tipografía: títulos en "Bebas Neue" (Google Fonts), texto en "Inter".

ESTRUCTURA, EN ESTE ORDEN
1. Cabecera fija con el logo (lo subiré después; deja un espacio de logo) y un botón
   "Hacer mi pedido" que desplaza suavemente hasta el formulario.
2. Portada: título "Costillas BBQ", subtítulo "570 g aprox. de costillas + 120 g de papas
   rizadas", precio, contador regresivo (días, horas, minutos, segundos) y
   "Quedan N platos". Botón "Hacer mi pedido".
3. Galería de 4 fotos del producto (placeholders con proporción 4:3; en celular
   carrusel deslizable, en computador cuadrícula de 2 × 2). Imágenes con lazy loading
   y texto alternativo.
4. Formulario de pedido (ver abajo), centrado.
5. Testimonios: se leen de src/data/testimonios.ts (arreglo vacío por ahora).
   Si está vacío, la sección NO se muestra (sin tarjetas vacías ni texto de relleno).
6. Galería de clientes: igual, desde src/data/galeria.ts, oculta si está vacía.
7. Pie con el nombre del negocio y el enlace al aviso de tratamiento de datos.

FORMULARIO
- Nombre completo (3 a 80 caracteres).
- Celular: inputMode="numeric", 10 dígitos, debe empezar por 3. Error junto al campo.
- Dirección de entrega (5 a 150 caracteres).
- Municipio: lista desplegable (las opciones vendrán del backend; por ahora usa datos
  de ejemplo en un archivo src/lib/estadoEjemplo.ts).
- Salsas por plato: una fila por salsa con su nombre, su descripción corta y un control
  − / cantidad / +. El total de platos es la suma. Muestra "Total: N platos — $X".
  El total no puede superar max_por_pedido ni los cupos restantes.
- Casilla obligatoria: "Acepto el tratamiento de mis datos personales según la
  Ley 1581 de 2012" con enlace a un modal que explique que los datos se usan solo
  para gestionar y entregar el pedido.
- Campo trampa oculto llamado "sitio_web": invisible para personas (fuera de pantalla,
  aria-hidden, tabIndex -1, autoComplete off). No usar display:none.
- Botón "Enviar pedido" con color de impacto. Deshabilitado y con indicador de carga
  mientras se envía, para evitar doble envío.
- La web NUNCA muestra ni pide datos de pago. El pago se confirma por WhatsApp.

ESTADOS DE CIERRE (vienen del backend en "abierto" y "motivo_cierre")
- FECHA_VENCIDA o CERRADO o NO_INICIADO: ocultar el formulario y mostrar
  "Los pedidos están cerrados. Te esperamos en la próxima apertura."
- CUPO_AGOTADO: ocultar el formulario y mostrar "Se agotaron los cupos de esta jornada."
- SIN_CONFIGURAR: igual que cerrado.

PANTALLA DE CONFIRMACIÓN (tras un pedido exitoso)
- "¡Pedido #N registrado!", resumen (platos, salsas, municipio, total, fecha de entrega)
  y botón grande verde "Confirmar pago por WhatsApp".
- El botón abre https://wa.me/{whatsapp_numero}?text={mensaje} con el mensaje codificado:
  "Hola RIBS BBQ, hice el pedido #N: {cantidad} platos ({salsas}) para {municipio}.
  Total ${total}. A nombre de {nombre}. Quedo atento para el pago."

FORMATO
- Precios en pesos colombianos: Intl.NumberFormat('es-CO', { style: 'currency',
  currency: 'COP', maximumFractionDigits: 0 }).
- Fechas en hora de Colombia (America/Bogota).

Por ahora usa datos de ejemplo para el estado; en el siguiente paso conectaré el backend.
```

---

## Prompt 2: conexión al backend (Google Apps Script)

```
Conecta la página al backend real. Es un Google Apps Script con una sola URL.

CONFIGURACIÓN
- Crea src/config.ts:
  export const APPS_SCRIPT_URL =
    import.meta.env.VITE_APPS_SCRIPT_URL ?? "PEGAR_AQUI_LA_URL_EXEC";
  (La URL es pública; en producción la define la variable de entorno.)
- Elimina los datos de ejemplo cuando el backend responda.

GET (estado de la jornada)
- fetch(APPS_SCRIPT_URL) sin cabeceras personalizadas. Responde JSON:
  {
    ok: boolean,
    abierto: boolean,
    motivo_cierre: null | "CERRADO" | "NO_INICIADO" | "FECHA_VENCIDA" | "CUPO_AGOTADO" | "SIN_CONFIGURAR",
    tipo_cupo: "platos" | "pedidos",
    cupo_maximo: number,
    cupos_restantes: number,
    max_por_pedido: number,
    precio_plato: number,
    fecha_cierre: string | null,      // ISO 8601
    fecha_entrega: string | null,     // "AAAA-MM-DD"
    salsas: { nombre: string, descripcion: string }[],
    municipios: string[],
    whatsapp_numero: string,
    ahora: string                     // ISO, hora del servidor
  }
- Consultar al cargar y cada 60 segundos. Usar "ahora" del servidor para corregir el
  reloj del celular en el contador.
- El texto de cupos dice "Quedan N platos" si tipo_cupo es "platos" y "Quedan N cupos"
  si es "pedidos". Si es "platos", el total del formulario no puede superar
  cupos_restantes.
- Si el contador llega a cero, ocultar el formulario sin esperar al backend.
- Si el GET falla, mostrar "No pudimos cargar la información. Escríbenos por WhatsApp."
  y reintentar.

POST (registrar el pedido)
- IMPORTANTE: enviar con Content-Type "text/plain;charset=utf-8" (NO application/json)
  para evitar la verificación previa de CORS que Apps Script no responde:
  fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      nombre, telefono, direccion, municipio,
      salsas: { "Tradicional": 2, "Picante": 1 },  // solo salsas con cantidad > 0
      acepta_datos: true,
      sitio_web                                     // campo trampa
    })
  })
- Respuesta exitosa:
  { ok: true, numero: number,
    resumen: { cantidad, salsas, municipio, total, fecha_entrega },
    cupos_restantes, whatsapp_numero }
  → mostrar la pantalla de confirmación.
- Respuesta de error:
  { ok: false, codigo: "DATOS_INVALIDOS" | "CUPO_AGOTADO" | "CUPO_INSUFICIENTE" |
    "CERRADO" | "OCUPADO" | "ERROR", mensaje: string,
    errores?: { [campo]: string }, cupos_restantes?: number }
  → si hay "errores", mostrarlos junto a cada campo; si no, mostrar "mensaje" arriba
    del botón. En CUPO_AGOTADO, CUPO_INSUFICIENTE o CERRADO, volver a consultar el estado.
- El servidor es quien decide; las validaciones del navegador son solo ayuda.
```

---

## Ajustes posteriores sugeridos (prompts cortos)
- "Reemplaza el espacio del logo por la imagen que subí, con alto de 48 px en celular."
- "Cambia los placeholders de la galería por estas 4 fotos."
- "Revisa la página a 360 px y corrige cualquier desbordamiento horizontal."
