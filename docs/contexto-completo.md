# RIBS BBQ: contexto completo del proyecto

Respaldo integral de lo construido, decidido y aprendido hasta el **2026-11-17**. Está
escrito para que otra persona o **otro entorno de IA** pueda entender, mantener o
**replicar** la aplicación completa sin acceso a la conversación original.

> **Cómo usar este documento con otra IA:** pégalo completo como contexto inicial y pide,
> por ejemplo: *"Con este contexto, replica la aplicación RIBS BBQ: frontend React + Vite +
> TypeScript + Tailwind, backend en Google Apps Script sobre Google Sheets y despliegue en
> Cloudflare Pages. Respeta las decisiones, el diseño y las reglas obligatorias."*
> Las secciones 6 (UX/UI), 8 (contrato del backend) y 14 (pasos para replicar) son las
> más importantes para reconstruir.

## Índice
1. [El negocio y el producto](#1-el-negocio-y-el-producto)
2. [Estado actual](#2-estado-actual-2026-11-17)
3. [Decisiones finales](#3-decisiones-finales)
4. [Arquitectura](#4-arquitectura)
5. [Estructura del repositorio](#5-estructura-del-repositorio)
6. [UX/UI y diseño](#6-uxui-y-diseño)
7. [Frontend en detalle](#7-frontend-en-detalle)
8. [Backend: Google Apps Script + Google Sheets](#8-backend-google-apps-script--google-sheets)
9. [Integración con Google: publicar, ambientes y clasp](#9-integración-con-google-publicar-ambientes-y-clasp)
10. [Despliegue en Cloudflare Pages](#10-despliegue-en-cloudflare-pages)
11. [Proceso de trabajo: ramas, OpenSpec y reglas](#11-proceso-de-trabajo-ramas-openspec-y-reglas)
12. [Errores encontrados y lecciones aprendidas](#12-errores-encontrados-y-lecciones-aprendidas)
13. [Pendientes y hoja de ruta](#13-pendientes-y-hoja-de-ruta)
14. [Cómo replicar la aplicación desde cero](#14-cómo-replicar-la-aplicación-desde-cero)

---

## 1. El negocio y el producto

- **Marca:** RIBS BBQ. Venta de **costillas BBQ por jornadas** (ediciones limitadas) a
  domicilio en **Pereira y Dosquebradas** (Colombia).
- **Producto:** costillas BBQ de **570 g aprox. + 120 g de papas a la francesa rizadas**.
  Precio de referencia: **$30.000 COP** por plato.
- **Salsas:** Tradicional, Dulce y Picante. El cliente elige **salsa por plato** (ej.: 2
  Tradicional + 1 Picante). Son parametrizables (nombre, descripción, activa/inactiva).
- **Jornada:** el negocio abre pedidos con una **fecha de cierre** y una **fecha y hora de
  entrega**. Hay un **cupo** limitado (por defecto 20 platos) y un **máximo por pedido**
  (por defecto 5).
- **Pago:** se confirma por **WhatsApp** (transferencia + pantallazo). **La web nunca
  muestra ni recibe datos de pago.**
- **Titular / licencia:** Oscar Vergara. Todos los derechos reservados (`LICENSE`).
- **Idioma:** todo en **español de Colombia** (código, textos, documentación y commits).
- **Primera jornada real:** cierre 13-nov-2026 12:00, entrega 14-nov-2026 14:00. **Se
  vendieron los 20 platos** y hubo demanda que no se alcanzó a atender.

### Qué hace la aplicación (resumen funcional)
1. El cliente abre la landing (celular, mobile-first), ve el producto, el precio, la fecha
   de entrega y un **contador** hasta el cierre.
2. Llena un **formulario**: nombre, celular, dirección, municipio (desplegable), platos por
   salsa, autorización de datos (obligatoria) y autorización de publicidad (opcional).
3. El pedido se **registra en Google Sheets** (con número consecutivo) y se abre
   **WhatsApp** con el pedido escrito para que el cliente lo envíe y coordine el pago.
4. Si el **cupo se agotó**, el pedido igual se guarda como *sobrepedido* (para medir la
   demanda) y se muestra un **popup de cupos agotados** con redes sociales.
5. Cuando la **fecha de cierre** pasa, se muestra un **popup "foto finish"** (humor: "te
   ganaron por un pelito") con un formulario corto para **anotarse a la próxima jornada**
   (pestaña *Interesados*).
6. El negocio despacha desde la hoja con un **enlace de WhatsApp "va en camino"** por
   pedido (mensaje editable desde la hoja).

---

## 2. Estado actual (2026-11-17)

| Elemento | Estado |
|---|---|
| Web en producción | https://oscarvergara-ribs-bbq.pages.dev (Cloudflare Pages, rama `main`) |
| Modo de datos | **Completo** (Google Sheets vía Apps Script) desde 2026-11-13 |
| Script en PROD | **1.3.0** (tiene el error de emojis en el enlace de salida; se corrige con 1.3.1) |
| Script en DEV | **1.3.1** (rama `dev`, publicado con `clasp`) |
| Ramas | `main` = producción; `qa` = igual a `main`; `dev` = integración (adelante de `main`) |
| Acuerdo vigente | **Trabajar solo en `dev`** hasta nuevo aviso (no pasar a `qa`/`main`) |
| Siguiente gran desarrollo | **Panel de pedidos** (propuesta lista; esperando 4 respuestas del dueño) |

### Qué hay en `main` (producción) y qué solo en `dev`
| Funcionalidad | `main` | `dev` |
|---|---|---|
| Landing, formulario, registro en hoja, WhatsApp | ✅ | ✅ |
| Sobrepedidos + popup de cupos agotados + autorización de publicidad | ✅ | ✅ |
| Popup de cierre "foto finish" + registro de interesados | ✅ | ✅ |
| Contador naranja en los últimos 10 minutos | ✅ | ✅ |
| Esqueleto animado mientras carga | ✅ | ✅ |
| Enlace de WhatsApp "va en camino" en la hoja (script 1.3.x) | ❌ (pero el script 1.3.0 ya se pegó a mano en la hoja real) | ✅ 1.3.1 |
| Ambientes DEV / simulado, `clasp` | ❌ | ✅ |
| Versión del script en el GET | ❌ | ✅ |

---

## 3. Decisiones finales

Decisiones del dueño y del equipo, con su razón. **No cambiarlas sin preguntar.**

### Producto y negocio
| Decisión | Detalle | Razón |
|---|---|---|
| Cupo por **platos** (parametrizable) | `cupo_maximo` (20) y `tipo_cupo` (`platos` o `pedidos`) | El límite real es la cocina |
| Cupo cuenta desde `fecha_apertura` | Pedidos anteriores no consumen cupo | Varias jornadas en la misma hoja |
| Salsa **por plato**, 3 salsas parametrizables | Nombre, descripción, activa | Flexibilidad de menú |
| Municipios: **Pereira y Dosquebradas** | Desplegable, sin opción "Otro" | Cobertura real |
| Pago **solo por WhatsApp** | La web no pide ni muestra datos de pago | Seguridad y simplicidad |
| **Sobrepedidos registrados** | Con cupo agotado el formulario sigue abierto; el pedido se guarda **sin N.º** con "Estado del pago" = `Cancelado por Sobrepedidos`; no cuenta para el cupo | Medir demanda y armar base de clientes |
| **No mostrar cupos restantes** | Se quitó "Quedan N platos" | Decisión del dueño |
| Autorización de **publicidad** | Casilla **opcional** y separada (Ley 1581 de 2012) | Base de clientes legal |
| **Mensaje de cierre único** | Mismo popup para cualquier motivo de cierre | Decisión del dueño |
| Popup de cierre con humor: **carrera de fanáticos** | Dos personas comunes: una cruza la meta con el plato (11:59:59), el cliente llega segundo (12:00:01) | Tono cercano y cómico; las mascotas/caricaturas se descartaron porque "nadie se identifica" |
| Formulario de interesados **dentro del mismo popup** | "Avísame en la próxima" reemplaza el contenido (show/hide), sin pantalla adicional | Decisión del dueño |
| Autorización **obligatoria** para interesados | Su único fin es contactar al cliente | Ley 1581 |
| Contador: **cambio de color discreto** | Últimos 10 min: números naranja y "¡Últimos minutos!", sin parpadeo ni sonido | "Nada invasivo" |
| Carga: **esqueleto CSS**, sin caché | No se guarda ni se muestra la última respuesta | Decisión del dueño; Lottie descartado por peso (~45 KB) |

### Técnicas
| Decisión | Detalle | Razón |
|---|---|---|
| Frontend propio en `web/` | React + Vite + TS + Tailwind | Lovable no se pudo activar |
| **Cloudflare Pages** como hosting | CD nivel 1 con integración Git | Vercel Hobby no permite uso comercial |
| **Google Sheets + Apps Script** como backend | Web App "Ejecutar como: Yo", acceso "Cualquier usuario" | Gratis, el dueño ya usa Sheets |
| Fuente de datos **intercambiable** | Modo completo (Apps Script) o modo WhatsApp (respaldo, sin backend) | Plan B si el backend falla |
| La web solo conoce **una URL** | `VITE_APPS_SCRIPT_URL` | La cuenta de Google puede cambiar |
| **Toda validación en el servidor** | Cupo, fecha, formato, honeypot, saneo de fórmulas, LockService | El navegador no es confiable |
| POST con `Content-Type: text/plain` | Evita la verificación previa de CORS | Apps Script no responde preflight |
| Columnas ubicadas **por nombre** (tolerante) | Sin tildes, mayúsculas ni signos; "N°", "Nro", "No." = "N.º" | El dueño edita la hoja a mano |
| Enlace de salida con **`api.whatsapp.com/send`** | Nunca `wa.me` con emojis | `wa.me` cambia los emojis por "�" |
| Mensajes de salida **desde el celular** | En PC WhatsApp no abre la app y daña emojis | Pruebas reales del dueño |
| Script **versionado** (semver) | `VERSION` + historial en el encabezado + campo `version` en el GET | Saber qué hay publicado |
| Publicar script: **"Nueva versión"**, nunca "Nueva implementación" | La segunda cambia la URL | Errores reales (sección 12) |
| Ramas **dev → qa → main** | `main` = producción | No romper lo que está vendiendo |
| Ambientes **PROD y DEV** separados | Hoja DEV (copia sin clientes) + simulador local | Pruebas sin riesgo |
| `clasp` **solo a DEV** | PROD se publica a mano | Evitar publicar en producción por error |

---

## 4. Arquitectura

```
                     ┌──────────────────────────────────────────┐
  Cliente (celular)  │  Cloudflare Pages (estático, rama main)  │
  ─────────────────► │  React + Vite + Tailwind (web/dist)      │
                     └───────────────┬──────────────────────────┘
                                     │ fetch GET  (estado de la jornada)
                                     │ fetch POST text/plain (pedido / interesado)
                                     ▼
                     ┌──────────────────────────────────────────┐
                     │ Google Apps Script — Web App /exec       │
                     │ doGet: estado (sin datos de clientes)    │
                     │ doPost: registrar pedido o interesado    │
                     │ LockService, validación, honeypot        │
                     └───────────────┬──────────────────────────┘
                                     ▼
                     ┌──────────────────────────────────────────┐
                     │ Google Sheets (dueño del negocio)        │
                     │ Pedidos · Config · Salsas · Municipios ·  │
                     │ Interesados                              │
                     └──────────────────────────────────────────┘

  Después del registro: la web abre WhatsApp (cliente → negocio) con el pedido escrito.
  Al despachar: el negocio toca "📲 Va en camino" en la hoja (negocio → cliente).
```

### Ambientes
| Ambiente | Hoja | Script | URL `/exec` | Quién la usa |
|---|---|---|---|---|
| **PROD** | `oscarvergara-ribs-bbq` (clientes reales) | 1.3.0 | `…/s/AKfycbwCCXB4…NZPnI4A/exec` | `web/.env` → `npm run build` → Cloudflare |
| **DEV** | `RIBS BBQ - DEV` (copia, sin clientes reales) | 1.3.1 | `…/s/AKfycbxKZkV7…fQGLaMw/exec` | `web/.env.development` → `npm run dev` |
| **Simulado** | Ninguna (memoria) | — | `http://localhost:5199/exec` | `web/.env.simulado` → `npm run dev:simulado` |

Las URLs completas están en `web/.env` y `web/.env.development` (son públicas por
naturaleza; toda la seguridad está en el script).

---

## 5. Estructura del repositorio

```
.
├── CLAUDE.md                    Contexto corto obligatorio para asistentes de IA
├── LICENSE / README.md
├── apps-script/
│   ├── Code.gs                  Backend completo (≈900 líneas, versión en el encabezado)
│   ├── appsscript.json          Zona America/Bogota, V8, webapp USER_DEPLOYING / ANYONE_ANONYMOUS
│   ├── .clasp.json              scriptId del script DEV (clasp solo apunta a DEV)
│   └── .claspignore             Solo sube Code.gs y appsscript.json
├── assets/marca/logo-ribs-bbq.jpg
├── docs/
│   ├── ambientes.md             PROD / DEV / simulado y clasp
│   ├── configuracion-git.md     Git siempre con configuración local
│   ├── contexto-completo.md     ESTE documento
│   ├── despliegue-apps-script.md Hoja, Config, publicar "Nueva versión" (sección 5)
│   ├── despliegue-cloudflare.md Pages, variables, operación, rollback
│   ├── flujo-ramas.md           dev → qa → main
│   └── lovable-prompt.md        Prompts para reconstruir en Lovable (en pausa)
├── openspec/changes/            Propuestas (proposal, design, tasks, specs) por cambio
│   ├── add-landing-pedidos/     Landing y pedidos (base)
│   ├── add-despliegue-respaldo/ Hosting, respaldo y CI/CD
│   ├── add-lista-espera-sobrepedidos/
│   ├── add-cierre-interesados/
│   ├── add-carga-esqueleto/
│   ├── add-enlace-whatsapp-salida/
│   └── add-panel-pedidos/       (rama panel-pedidos, solo local, sin código)
├── scripts/
│   ├── backend-simulado.js      Imita el Apps Script en memoria (puerto 5199)
│   └── probar-webapp.sh         Pruebas con curl contra un /exec
└── web/                         Frontend (raíz del proyecto en Cloudflare)
    ├── .env                     PÚBLICO: número de WhatsApp + URL PROD (sí se sube)
    ├── .env.development         PÚBLICO: URL DEV (npm run dev)
    ├── .env.simulado            PÚBLICO: URL del simulador
    ├── .nvmrc                   Node 20
    ├── index.html               lang es-CO, fuentes, Open Graph
    ├── public/                  logo-ribs-bbq.jpg, logo-ribs-bbq-recorte.jpg
    └── src/
        ├── main.tsx, App.tsx, index.css
        ├── config/jornada.ts    Datos de la jornada para el modo WhatsApp
        ├── data/contenido.ts    Fotos, testimonios y galería (vacíos = sección oculta)
        ├── lib/                 tipos, fuenteDatos, validacion, formato, whatsapp
        └── components/          Cabecera, Portada, Contador, Formulario, Estados,
                                 ModalAgotado, ModalCierre, FotoFinish, Cargando,
                                 AvisoDatos, Secciones
```

---

## 6. UX/UI y diseño

### Principios
- **Mobile-first** (base 360 px). La mayoría de clientes entra desde WhatsApp/Instagram en
  celular. Escritorio: contenido centrado con `max-w-5xl`, tarjetas con `max-w-xl`.
- **Tono:** cercano, colombiano, con humor ligero ("¡Volaron las costillas!", "¡Te ganaron
  por un pelito!", "Calentando la parrilla…"). Tuteo.
- **Un solo objetivo por pantalla:** pedir. Botón "Hacer mi pedido" visible en cabecera
  y portada mientras los pedidos están abiertos.
- **Sin pantallas vacías:** esqueletos mientras carga; secciones sin contenido no se
  muestran.
- **Accesibilidad:** contraste alto, objetivos táctiles ≥ 44 px (`min-h-11`/`min-h-12`),
  `aria-live` en estados, `role="dialog"` nativo (`<dialog>`), foco al primer campo con
  error, `prefers-reduced-motion` respetado en todas las animaciones.

### Marca
- **Logo:** `assets/marca/logo-ribs-bbq.jpg` (copia en `web/public/`). Para la cabecera se
  usa `logo-ribs-bbq-recorte.jpg` (309×240, recortado sin margen, `object-contain`; el
  original con `scale` se cortaba). Falta versión PNG con fondo transparente.
- **Paleta (tokens de Tailwind v4 en `web/src/index.css`, bloque `@theme`):**

| Token | Hex | Uso |
|---|---|---|
| `fondo` | `#2F1C15` | Fondo principal (marrón muy oscuro) |
| `impacto` | `#EF7224` | Color de acción: botones, precio, títulos de popups |
| `claro` | `#FDEED6` | Títulos y texto sobre fondo oscuro |
| `arena` | `#F3D8B7` | Fondos secundarios (tarjeta del formulario) y texto suave |
| `promo` | `#B7502B` | Insignias ("Edición limitada", "Pedidos cerrados") |
| `apoyo-1` | `#9A4B24` | Apoyo |
| `apoyo-2` | `#733E21` | Bordes, bloques del esqueleto, texto secundario sobre arena |
| `apoyo-3` | `#E1B78A` | Etiquetas suaves, bordes de campos |
| `error` | `#8F2A10` | Errores |
| `whatsapp` | `#25D366` | Botón verde de WhatsApp |

- **Tipografía (Google Fonts en `index.html`):**
  - `font-titulo`: **Bebas Neue** (títulos grandes, precio, contador), mayúsculas
    naturales, `tracking-wide`.
  - `font-texto`: **Inter** 400/500/600/700 (todo lo demás).
- `<meta name="theme-color" content="#2F1C15">`, Open Graph con logo.

### Estructura de la landing (de arriba hacia abajo)
1. **Cabecera** fija (`sticky`, fondo con blur): logo a la izquierda; botón naranja
   "Hacer mi pedido" a la derecha (solo con pedidos abiertos y sin pedido confirmado).
2. **Portada** (`#inicio`): logo grande; insignia "EDICIÓN LIMITADA"; título "COSTILLAS
   BBQ" (Bebas, 6xl–7xl); descripción del producto; **precio** en naranja ("$ 30.000 por
   plato"); "Entrega: Sábado, 14 de noviembre, 2:00 p. m."; **contador** (4 bloques: días,
   horas, min, seg) con la etiqueta "LOS PEDIDOS CIERRAN EN" y debajo "Cierre: 13 de
   noviembre a las 12:00 p. m. (hora de Colombia)"; botón "Hacer mi pedido".
   En escritorio: dos columnas (texto | logo).
3. **Galería del producto** (4 fotos; oculta si no hay fotos).
4. **Formulario** (`#pedido`) en tarjeta color arena, o la pantalla de **confirmación**,
   o el aviso **"Pedidos cerrados"**, o el **esqueleto** mientras carga.
5. **Testimonios** y **galería de clientes** (ocultos si están vacíos).
6. **Pie:** "RIBS BBQ", "El pago se confirma por WhatsApp. Esta página no pide datos de
   pago.", enlace "Tratamiento de datos personales" y "© 2026 Oscar Vergara. Todos los
   derechos reservados."

### Formulario de pedido (tarjeta arena, texto marrón)
- Título "HAZ TU PEDIDO" y subtítulo "Llena tus datos y confirma el pago por WhatsApp."
- Campos (inputs blancos, borde `apoyo-3`, alto 48 px, foco naranja):
  1. **Nombre completo** (3–80 caracteres).
  2. **Celular** con ayuda "10 dígitos, por ejemplo 3001234567" (empieza por 3; acepta
     prefijo 57).
  3. **Dirección de entrega** con ayuda "Incluye barrio, torre o apartamento si aplica".
  4. **Municipio**: desplegable "Elige tu municipio" (Pereira, Dosquebradas).
  5. **Salsas**: "Elige la salsa de cada plato" + "Máximo 5 platos por pedido."; una fila
     por salsa (nombre en negrita + descripción) con botones redondos **−** (arena) y
     **+** (naranja) de 44 px y el contador en medio; la fila se bordea de naranja si
     tiene platos.
  6. **Total**: banda oscura "Total: N platos" + precio en naranja (Bebas).
  7. Casilla **obligatoria**: "Acepto el tratamiento de mis datos personales según la Ley
     1581 de 2012. Ver aviso".
  8. Casilla **opcional** en caja punteada: "¡Quiero ser de los primeros! Avísenme por
     WhatsApp cuando abran nuevos pedidos y de sus promociones. (Opcional)".
  9. Campo trampa oculto (honeypot) `sitio_web`.
  10. Botón grande naranja "Enviar pedido" (56 px) y nota "El pago se confirma por
      WhatsApp. Aquí no pedimos datos de pago."
- **Validación:** al primer intento muestra los errores bajo cada campo y enfoca el primero;
  después revalida mientras el cliente corrige. Mensajes: "Escribe tu nombre completo.",
  "El celular debe tener 10 dígitos y empezar por 3.", "Escribe la dirección de entrega.",
  "Elige tu municipio.", "Elige al menos un plato.", "Puedes pedir máximo N platos.",
  "Debes aceptar el tratamiento de datos.".

### Confirmación (después de registrar)
- "¡PEDIDO #N REGISTRADO!" y "**Envía el mensaje en WhatsApp para confirmar tu pedido** y
  coordinar el pago."
- Resumen blanco: Platos (cantidad y salsas), Entrega en (municipio), Entrega (fecha y
  hora), Total.
- **Celular:** botón verde "Abrir WhatsApp" (`wa.me`) y además WhatsApp se abre solo al
  confirmar.
- **PC:** botón verde "Abrir la aplicación de WhatsApp" (`whatsapp://send`) + caja "¿No se
  abrió? Escríbenos al +57… y pega el pedido:" con botón **"Copiar pedido"** (si falla,
  muestra el texto para copiar a mano). Se quitó el botón de WhatsApp Web (decisión).
- "Hacer otro pedido" (enlace subrayado).
- **Mensaje de WhatsApp del pedido** (cliente → negocio, sin emojis):
  ```
  Hola RIBS BBQ, hice el pedido #7:
  • Nombre: …
  • Celular: …
  • Dirección: …, Pereira
  • Platos: 2 (Tradicional x1, Picante x1)
  • Total: $ 60.000
  • Entrega: Sábado, 14 de noviembre, 2:00 p. m.
  Quedo atento para el pago.
  ```

### Popup de cupos agotados (`ModalAgotado`)
- `<dialog>` con borde naranja de 4 px, sombra naranja, fondo oscuro con blur; franja
  degradada arriba; logo; insignia "CUPOS AGOTADOS"; título **"¡Volaron las costillas!"**.
- Texto: "{Nombre}, llegaste justo cuando el último plato encontró dueño. Lo sentimos de
  verdad: esta jornada se agotó." + si aceptó publicidad: "**Ya estás en nuestra lista
  VIP.** Serás de los primeros en saber cuándo volvemos a encender la parrilla."; si no:
  invitación a seguir las redes.
- Botones de Instagram/Facebook/TikTok (solo los que tengan URL en Config) y "¡Entendido,
  nos vemos en la próxima!". **Al cerrarlo, el formulario se limpia** (se recrea con una
  `key` nueva) y la página sube al inicio.

### Popup de cierre (`ModalCierre` + `FotoFinish`)
- Se abre **solo, una vez**, cuando el contador llega a cero o al entrar con los pedidos
  cerrados. Al cerrarlo queda en la página el aviso "Pedidos cerrados · Esta jornada ya
  cruzó la meta. Te esperamos en la próxima apertura." con el botón "Avísame en la próxima"
  para reabrirlo.
- **Ilustración SVG "foto finish"** (320×200, colores de marca, sin librerías): tribuna con
  público, banderines, pista en perspectiva, línea de meta a cuadros, arco "META", línea
  punteada de cámara, esquinas de visor, etiqueta "● FOTO FINISH" (punto que parpadea) y
  destello al abrir.
  - **Fan 1** (ganador): jean, camiseta naranja, pelo oscuro, ojos cerrados de felicidad,
    **plato de costillas con papas en alto** (con vapor y destellos) y la **cinta de meta
    rota sobre el pecho**; etiqueta "1° 11:59:59".
  - **Fan 2** (el cliente): gorra, camiseta arena, pantaloneta, un paso **antes** de la
    línea con la mano estirada, cara de "¡nooo!", sudor detrás de la cabeza, líneas de
    velocidad y polvo; etiqueta "2° 12:00:01".
  - Tenis dibujados con suela oscura, punta y cordones (versiones anteriores tenían
    "pies indefinidos" y gotas que parecían "cachos": corregido).
  - Animaciones CSS: trote del fan 2, salto del fan 1, gotas de sudor, REC parpadeando,
    destello; todas desactivadas con `prefers-reduced-motion`.
- Texto (vista "mensaje"): insignia "PEDIDOS CERRADOS"; título **"¡Te ganaron por un
  pelito!"**; "Esto era una carrera de fanáticos por las últimas costillas… y la foto finish
  no miente: otro fan cruzó la meta un segundo antes que tú." + "Esta jornada ya tiene
  campeones. **La revancha viene pronto: la parrilla se vuelve a prender.**"; botón naranja
  **"Avísame en la próxima"**; botones de redes si existen; "×" para cerrar.
- **Vista "formulario"** (reemplaza el texto en el mismo popup): "Te avisamos primero",
  campos Tu nombre y Celular, casilla **obligatoria** "Autorizo a RIBS BBQ a escribirme por
  WhatsApp sobre nuevas aperturas y promociones (Ley 1581 de 2012). Ver aviso", honeypot,
  botón "Anotarme" ("Anotando…") y "Volver".
- **Vista "listo":** "¡Listo, {nombre}!" + "Ya estás en la línea de salida de la próxima
  carrera. Te escribimos apenas volvamos a prender la parrilla." + "Cerrar".
- En modo WhatsApp (sin backend) el botón "Avísame en la próxima" no aparece.

### Contador
- 4 bloques con borde `apoyo-2`, números Bebas `text-claro`.
- **Últimos 10 minutos:** etiqueta "¡ÚLTIMOS MINUTOS!" y números/bordes en naranja, con
  transición suave de 700 ms. Sin parpadeo ni sonido.
- Usa la **hora del servidor** (`desfaseReloj` = hora del servidor − hora del navegador):
  un reloj de celular mal configurado no adelanta ni atrasa el cierre.
- Al llegar a cero dispara `onVencido`: desaparecen contador, formulario y botones.

### Esqueleto de carga (`Cargando`)
- Mientras responde el Apps Script (3–15 s), la portada muestra lo fijo (logo, título,
  descripción) y **bloques animados** en el lugar del precio, la entrega, el contador y el
  botón; el formulario muestra "HAZ TU PEDIDO · Calentando la parrilla…" con la silueta de
  todos los campos (3 salsas).
- **Mismas alturas que el contenido real** (medido a 375 px: portada 891 px; formulario con
  3 salsas 1308 px): nada salta al llegar los datos. Ojo con el *colapso de márgenes*: los
  bloques usan contenedores con `padding` en vez de `margin`.
- Animación: aparición escalonada de arriba hacia abajo (`--i × 70 ms`), pulso suave y un
  **barrido de luz que baja** por la tarjeta. CSS puro; sin caché.

### Aviso de datos (`AvisoDatos`, Ley 1581)
Usa nombre, celular, dirección y municipio para gestionar y entregar el pedido; con cupo
agotado guarda la solicitud para medir demanda; solo con la casilla opcional usa el
celular para avisos y promociones (revocable); registro privado, no se vende ni comparte;
no pide datos de pago; derechos de conocer, actualizar o eliminar por el mismo WhatsApp.

---

## 7. Frontend en detalle

### Stack y comandos (`web/`)
- React 19, Vite 6, TypeScript 5.8, Tailwind CSS 4 (`@tailwindcss/vite`), ESLint 9. Sin
  más dependencias de ejecución (solo `react` y `react-dom`).
- Node 20 (`web/.nvmrc`).

| Comando | Qué hace |
|---|---|
| `npm run dev` | Desarrollo contra la **hoja DEV** (`.env.development`) |
| `npm run simulado` + `npm run dev:simulado` | Desarrollo contra el **simulador** local |
| `npm run build` | `tsc -b && vite build` → `dist/` (usa `.env` = **PROD**) |
| `npm run lint` | ESLint |
| `npm run preview` | Sirve el build de producción (**apunta a PROD**: no enviar datos) |

### Variables de entorno (todas públicas, nunca secretos)
| Variable | Archivo | Valor |
|---|---|---|
| `VITE_WHATSAPP_NUMERO` | `web/.env` | `573218115143` (formato 57XXXXXXXXXX; sin él la web muestra "Pedidos cerrados") |
| `VITE_APPS_SCRIPT_URL` | `web/.env` | URL `/exec` de PROD (vacío = modo WhatsApp) |
| `VITE_APPS_SCRIPT_URL` | `web/.env.development` | URL `/exec` de DEV |
| `VITE_APPS_SCRIPT_URL` | `web/.env.simulado` | `http://localhost:5199/exec` |

Prioridad de Vite: `.env.[modo].local` > `.env.[modo]` > `.env.local` > `.env`. Las
variables definidas en Cloudflare Pages tienen prioridad sobre `web/.env` en el build.

### Fuente de datos intercambiable (`lib/fuenteDatos.ts`)
- `MODO = APPS_SCRIPT_URL ? 'remoto' : 'whatsapp'`.
- `obtenerEstado()`:
  - **remoto:** GET al `/exec`, convierte la respuesta (`EstadoApi`) en `Estado`
    (incluye `desfaseReloj`, redes, `horaEntrega` con respaldo en `jornada.ts`).
  - **whatsapp:** arma el `Estado` desde `config/jornada.ts` (abierto si
    `pedidosAbiertos` y antes de `fechaCierre`; sin cupos ni número de pedido).
- `enviarPedido()`:
  - **remoto:** POST `text/plain` con `{ nombre, telefono, direccion, municipio, salsas,
    acepta_datos, acepta_publicidad, sitio_web }` → `Resultado` (ok + resumen, o error con
    `codigo`, `mensaje`, `errores`, `registrado`, `redes`).
  - **whatsapp:** solo arma el resumen local (los datos van únicamente a WhatsApp).
- `registrarInteresado()` (solo remoto): POST con `accion: 'interesado'`.
  `PUEDE_REGISTRAR_INTERESADOS = MODO === 'remoto'`.
- En modo remoto, `App` **refresca el estado cada 60 s**: los cambios en la hoja se ven sin
  publicar nada (no renombrar ni borrar pestañas o columnas).

### Tipos principales (`lib/tipos.ts`)
`Estado { modo, abierto, motivoCierre, fechaCierre, fechaEntrega, horaEntrega,
precioPlato, maxPorPedido, salsas[], municipios[], whatsappNumero, redes, cuposRestantes,
tipoCupo, desfaseReloj }` · `Pedido { nombre, telefono, direccion, municipio,
salsas: Record<string, number>, aceptaDatos, aceptaPublicidad, sitioWeb }` · `Resumen` ·
`Resultado` · `MotivoCierre = CERRADO | NO_INICIADO | FECHA_VENCIDA | CUPO_AGOTADO |
SIN_CONFIGURAR`.

### Lógica de `App.tsx` (máquina de estados de la pantalla)
```
cargando (estado = null)  → Portada con esqueleto + FormularioCargando
error de carga            → ErrorCarga ("No pudimos cargar…" + Reintentar)
abierto y sin resumen     → Formulario (key = claveFormulario)
resumen (pedido hecho)    → Confirmacion (+ abre WhatsApp en celular)
cerrado (o vencido)       → Cerrado (aviso) + ModalCierre (se abre solo una vez)
CUPO_AGOTADO al enviar    → ModalAgotado; al cerrar: claveFormulario++ (form limpio) y scroll arriba
```
`vencido` se activa cuando el contador llega a cero; el refresco de 60 s lo reinicia con la
respuesta del servidor.

### Otros módulos
- `lib/validacion.ts`: `limpiar`, `normalizarTelefono` (quita no dígitos y prefijo 57),
  `totalPlatos`, `maximoPermitido` (= `maxPorPedido`, **no** limitado por cupos),
  `validarPedido`.
- `lib/formato.ts`: `formatoPesos` ("$ 30.000"), `formatoDia`, `formatoEntrega` ("Sábado,
  14 de noviembre, 2:00 p. m.", con espacio no separable), `formatoFechaHora`,
  `textoSalsas`.
- `lib/whatsapp.ts`: `mensajePedido`, `enlacesWhatsApp` (universal `wa.me`, app
  `whatsapp://send`, web), `esCelular` (pointer coarse o user agent),
  `abrirWhatsAppSiEsCelular`, `copiarTexto`.
- `data/contenido.ts`: `fotosProducto`, `testimonios`, `galeriaClientes` (vacíos hoy).

---

## 8. Backend: Google Apps Script + Google Sheets

### Modelo de la hoja
**Pestaña `Pedidos`** (el script ubica las columnas por nombre, en cualquier orden):

| Columna | Obligatoria | Contenido |
|---|---|---|
| N.º | Sí | Consecutivo (vacío en sobrepedidos) |
| Nombre completo | Sí | |
| Teléfono de contacto | Sí | 10 dígitos, guardado como texto |
| Dirección de entrega | Sí | |
| Municipio | Sí | |
| Cantidad de platos | Sí | |
| Salsas | Sí | "Tradicional x2, Picante x1" |
| Estado del pago | Sí | Nace `Pendiente`; `Cancelado por Sobrepedidos` en sobrepedidos |
| ¿Envió pantallazo? | Sí | Nace `No` |
| Fecha del pedido | Sí | Fecha y hora |
| ¿Acepta publicidad? | Opcional | `Sí` / `No` |
| Mensaje de salida | Opcional | Fórmula con enlace "📲 Va en camino" (1.3.x) |

**Pestaña `Config`** (columnas Clave | Valor; fechas como texto `AAAA-MM-DD HH:mm`, hora de
Colombia UTC-5, 24 h):

| Clave | Ejemplo | Nota |
|---|---|---|
| `cupo_maximo` | 20 | |
| `tipo_cupo` | platos | `platos` o `pedidos` |
| `max_por_pedido` | 5 | |
| `fecha_apertura` | 2026-11-12 18:00 | Solo cuentan para el cupo los pedidos desde aquí |
| `fecha_cierre` | 2026-11-13 12:00 | |
| `fecha_entrega` | 2026-11-14 | |
| `hora_entrega` | 14:00 | Opcional |
| `precio_plato` | 30000 | |
| `pedidos_abiertos` | SI | `NO` cierra todo al instante |
| `whatsapp_numero` | 57XXXXXXXXXX | |
| `instagram_url`, `facebook_url`, `tiktok_url` | https://… | Solo https; vacío = sin botón |
| `mensaje_en_camino` | ¡Hola {nombre}! 🔥 Gracias por tu compra en RIBS BBQ. Tu pedido #{numero} ({platos}) ya va en camino. ¡Buen provecho! | Variables `{nombre}` (primer nombre), `{numero}`, `{platos}` ("2 platos") |

**Pestaña `Salsas`:** Nombre | Descripción | Activa (`SI`). **Pestaña `Municipios`:**
Nombre | Activo (`SI`). **Pestaña `Interesados`:** Fecha | Nombre | Teléfono | Acepta
publicidad. Sin salsas o municipios activos el script no acepta pedidos
(`SIN_CONFIGURAR`).

### Contrato de la API (Web App `/exec`)
**GET** → estado de la jornada (nunca datos de clientes):
```json
{ "ok": true, "abierto": false, "motivo_cierre": "FECHA_VENCIDA",
  "tipo_cupo": "platos", "cupo_maximo": 20, "cupos_restantes": 0,
  "max_por_pedido": 5, "precio_plato": 30000,
  "fecha_cierre": "2026-11-13T17:00:00.000Z", "fecha_entrega": "2026-11-14",
  "hora_entrega": "14:00",
  "salsas": [{ "nombre": "Tradicional", "descripcion": "…" }],
  "municipios": ["Pereira", "Dosquebradas"], "whatsapp_numero": "57…",
  "redes": { "instagram": "", "facebook": "", "tiktok": "" },
  "version": "1.3.1", "ahora": "2026-11-15T17:10:40.636Z" }
```
**POST pedido** (cuerpo JSON como `text/plain`):
```json
{ "nombre": "…", "telefono": "3001234567", "direccion": "…", "municipio": "Pereira",
  "salsas": { "Tradicional": 2 }, "acepta_datos": true, "acepta_publicidad": false,
  "sitio_web": "" }
```
Respuestas:
- `{ ok: true, numero, resumen: { cantidad, salsas, municipio, total, fecha_entrega },
  cupos_restantes, whatsapp_numero }`
- `{ ok: false, codigo: "CUPO_AGOTADO", registrado: true, mensaje, redes }` (se guardó como
  sobrepedido)
- `{ ok: false, codigo: "CUPO_INSUFICIENTE", mensaje: "Solo nos quedan N platos…" }`
- `{ ok: false, codigo: "CERRADO" | "DATOS_INVALIDOS" | "OCUPADO" | "ERROR", mensaje,
  errores? }`

**POST interesado:** `{ "accion": "interesado", "nombre", "telefono",
"acepta_publicidad": true, "sitio_web": "" }` → `{ ok: true, mensaje }` o
`DATOS_INVALIDOS` con `errores.{nombre, telefono, aceptaPublicidad}`.

### Reglas del servidor
- **Estado/cierre** (`cargarContexto_`): `pedidos_abiertos ≠ SI` → `CERRADO`; antes de
  `fecha_apertura` → `NO_INICIADO`; sin `fecha_cierre` o vencida → `FECHA_VENCIDA`; sin
  salsas o municipios → `SIN_CONFIGURAR`. **El cupo agotado NO cierra el formulario.**
- **Uso del cupo** (`calcularUso_`): suma platos (o pedidos) desde `fecha_apertura`,
  excluyendo filas vacías y sobrepedidos.
- **Registro** (`registrarPedido_`), siempre dentro de `LockService` (15 s):
  1. Valida (nombre 3–80, celular `^3\d{9}$` con o sin 57, dirección 5–150, municipio de la
     lista, salsas activas con enteros ≥ 0 y total 1..max, `acepta_datos === true`).
  2. Cupo agotado → fila de sobrepedido sin N.º → `CUPO_AGOTADO`.
  3. Pide más de lo que queda → `CUPO_INSUFICIENTE` (no guarda).
  4. Si no, N.º = máximo + 1, "Pendiente", "No", fecha, publicidad, fórmula de salida.
- **Seguridad:** honeypot `sitio_web` (responde ok sin guardar); `neutralizarFormula_`
  antepone `'` a textos que empiezan por `= + - @`; `limpiarTexto_` quita caracteres de
  control; cuerpo máximo 5000 caracteres; URLs de redes solo `https`; el GET no expone
  datos de clientes; la hoja **nunca** se comparte "con cualquiera que tenga el enlace".
- **Encabezados tolerantes** (`claveEncabezado_`): sin tildes, mayúsculas, signos ni
  espacios dobles; "N°", "Nº", "No.", "Nro", "Número" equivalen a "N.º". Si falta una
  columna obligatoria, el error lista los encabezados encontrados.

### Enlace "va en camino" (1.3.1)
- La columna `Mensaje de salida` tiene por fila:
  `=IF(OR(TRIM(C5)="",H5="Cancelado por Sobrepedidos"),"",HYPERLINK(ENLACE_EN_CAMINO(B5,C5,A5,F5,IFERROR(VLOOKUP("mensaje_en_camino",Config!$A:$B,2,FALSE),"")),"📲 Va en camino"))`
- `ENLACE_EN_CAMINO` es una **función personalizada** del script (`@customfunction`) que
  arma `https://api.whatsapp.com/send?phone=57…&text=…` con `encodeURIComponent`. Recibe
  la plantilla como argumento para que la hoja recalcule al editar Config.
- La fórmula solo referencia celdas (no copia datos del cliente): sin riesgo de inyección.
- `configurarHoja()` crea la columna y la clave, llena los pedidos existentes y
  **reemplaza** las fórmulas viejas de este script (las de `ENCODEURL`/`wa.me`).
- Las funciones personalizadas usan el código **guardado** en el editor (no la versión
  publicada): para cambiar los enlaces basta guardar y ejecutar `configurarHoja`.

### Funciones del script (`apps-script/Code.gs`)
`doGet`, `doPost` · `construirEstado_`, `redes_`, `cargarContexto_`, `calcularUso_` ·
`registrarPedido_`, `valoresPedido_`, `validarPedido_`, `validarSalsas_`,
`siguienteNumero_`, `escribirFila_` · `registrarInteresado_`, `obtenerHojaInteresados_` ·
`ENLACE_EN_CAMINO`, `enlaceEnCamino_`, `formulaMensajeSalida_`, `esFormulaMensajeSalida_`,
`llenarMensajesSalida_`, `letraColumna_` · `obtenerHojaPedidos_`, `claveEncabezado_`,
`mapaColumnas_`, `leerConfig_`, `leerLista_` · utilidades (`leerCuerpo_`, `responder_`,
`error_`, `limpiarTexto_`, `neutralizarFormula_`, `normalizar_`, `buscarNombre_`,
`enteroPositivo_`, `aFecha_`, `aHora_`, `urlSegura_`, `isoONulo_`, `textoFecha_`) ·
**`configurarHoja()`** (crea pestañas, columnas y claves sin borrar datos) ·
`probarEstado()` (muestra el estado en el registro).

### Versionado
Encabezado de `Code.gs` con `Versión: x.y.z (fecha)` e historial; constante `VERSION`;
el GET devuelve `version`. Historial: 1.0.0 (2026-11-12) base · 1.0.1 hora de entrega ·
1.1.0 sobrepedidos, publicidad y redes · 1.2.0 interesados · 1.3.0 enlace "va en camino" ·
1.3.1 emojis (función personalizada + `api.whatsapp.com`).

---

## 9. Integración con Google: publicar, ambientes y clasp

### Publicar el script (PROD, a mano) — `docs/despliegue-apps-script.md` sección 5
> **"Nueva versión" sí, siempre. "Nueva implementación" nunca** (crea otra URL y la web
> deja de conectarse). **Guardar (Ctrl+S) no publica.**

1. Hoja → Extensiones → Apps Script → `Code.gs` → Ctrl+A, Ctrl+V con el código de `main`.
2. Guardar.
3. Implementar → **Administrar implementaciones** → seleccionar la implementación activa
   (la URL de `web/.env`) → **✏️**.
4. **Versión → "Nueva versión"** (paso clave: si se deja la que aparece, se republica la
   anterior).
5. Descripción: la versión del encabezado (ej. `1.3.1 - Emojis mensaje de salida`).
6. Implementar → el aviso debe decir "Versión N" con N mayor y la **misma URL**.
7. Si hay columnas o claves nuevas: ejecutar `configurarHoja`.
8. Comprobar: abrir la URL `/exec` y revisar `"version"`.

Primera vez en una hoja nueva: Implementar → **Nueva implementación** → Aplicación web →
*Ejecutar como*: **Yo** · *Quién tiene acceso*: **Cualquier usuario**; autorizar
("Google no verificó esta app" → Configuración avanzada → Ir a…).

### Ambiente DEV
- Hoja `RIBS BBQ - DEV`: copia de la real (Archivo → Hacer una copia), **sin datos de
  clientes reales**, con su propio script y su propia implementación (URL distinta).
- `web/.env.development` apunta a DEV: `npm run dev` nunca escribe en PROD.

### clasp (solo DEV) — `docs/ambientes.md`
- `apps-script/.clasp.json` tiene el `scriptId` del script DEV; `.claspignore` limita a
  `Code.gs` y `appsscript.json`.
- Una vez por PC: activar la API en https://script.google.com/home/usersettings **con la
  misma cuenta** del login; luego `npx @google/clasp@3.4.1 login`.
- Uso:
  ```bash
  cd apps-script
  npx @google/clasp@3.4.1 status
  npx @google/clasp@3.4.1 push --force
  npx @google/clasp@3.4.1 update-deployment <ID de la implementación DEV> -d "x.y.z - descripción"
  ```
  `push --force` = guardar (sin `--force` responde "Skipping push"). `update-deployment
  <ID>` = Nueva versión, misma URL. **Nunca** `create-deployment`.
- Probado el 2026-11-15: push y versión @2 en DEV.

### Simulador local (`scripts/backend-simulado.js`)
Servidor Node sin dependencias en el puerto 5199 que imita GET/POST (3 salsas, cupo,
cierre, sobrepedidos, interesados, honeypot). Control por URL: `/control?cierre=90`,
`?cierre=-1`, `?demora=8000`, `?cupo=0`, `?abiertos=NO`, `?error=1`; `/registro` muestra
lo recibido. No guarda nada en disco.

---

## 10. Despliegue en Cloudflare Pages

- Proyecto de **Pages** (no Workers; en el asistente elegir "Continue to Pages") conectado
  al repositorio de GitHub con **integración Git** (CD nivel 1: cada push a `main` publica).
- Configuración del build:

| Campo | Valor |
|---|---|
| Production branch | `main` |
| Framework preset | React (Vite) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | **`web`** |
| Variable de entorno | `NODE_VERSION = 20` |

- `VITE_WHATSAPP_NUMERO` y `VITE_APPS_SCRIPT_URL` vienen de `web/.env` (se pueden
  sobrescribir en Cloudflare; si se cambian ahí: Deployments → Retry deployment).
- **Solo `main` publica:** Settings → Builds → Branch control → *Preview branch*: **None**
  (las vistas previas usarían la hoja de producción).
- **No usar "Direct Upload"** (no se puede conectar a Git después).
- Rollback: Deployments → elegir uno anterior → "Rollback to this deployment".
- Respaldo si falla el backend: dejar `VITE_APPS_SCRIPT_URL=` vacío en `web/.env` y hacer
  push → modo WhatsApp con `jornada.ts`.
- `web/wrangler.jsonc` existe en la carpeta local pero **no se usa ni se sube** (resto de
  un intento con Workers).
- Verificar una publicación: comparar el archivo `/assets/index-*.js` que sirve producción
  con el que genera `npm run build`; recarga forzada Ctrl+Shift+R.

---

## 11. Proceso de trabajo: ramas, OpenSpec y reglas

### Ramas (`docs/flujo-ramas.md`)
```
rama-de-trabajo (sale de dev) ──► dev ──► qa (pruebas locales) ──► main ──► Cloudflare
```
- Merges con `--no-ff`. PRs en GitHub (`compare/qa...dev`, `compare/main...qa`).
- Arreglo urgente: rama desde `main` → `main` → y de vuelta a `dev` y `qa`.
- **Acuerdo actual: quedarse en `dev`** (desarrollos y bugs) hasta nuevo aviso.
- Ramas existentes: `main`, `qa`, `dev`, `propuesta-popup-cierre-fechas`,
  `carga-esqueleto`, `enlace-whatsapp-hoja`, `arreglo-emoji-mensaje`, `ambientes-dev`
  (todas unidas a `dev`) y `panel-pedidos` (solo local, propuesta sin código).

### OpenSpec
Todo cambio empieza como propuesta en `openspec/changes/<nombre>/` con `proposal.md` (por
qué, qué cambia, fuera de alcance, impacto), `design.md` cuando hace falta, `tasks.md`
(marcar al terminar) y `specs/<capacidad>/spec.md` con requisitos (MUST) y escenarios
(WHEN/THEN).

### Reglas obligatorias
- Git con configuración **local**, nunca `--global` (`git config --local --list`).
- Nunca subir datos de clientes, exportaciones de la hoja, contraseñas, tokens ni llaves.
  `web/.env*` solo valores públicos. `.clasprc.json` nunca se sube.
- La hoja nunca se comparte "con cualquier persona con el enlace".
- Toda validación de pedidos en el servidor.
- **Pedir confirmación antes de `git push` y antes de borrar archivos.**
- Commits en español, con mensaje descriptivo.

---

## 12. Errores encontrados y lecciones aprendidas

| Problema | Causa | Solución / lección |
|---|---|---|
| Vercel descartado | Plan Hobby no permite uso comercial | Cloudflare Pages |
| Lovable no se pudo usar | Cuenta no activada | Frontend propio; prompts en `docs/lovable-prompt.md` |
| Cloudflare abría Workers | Asistente nuevo | "Continue to Pages"; escribir `main` a mano |
| Logo cortado en la cabecera | `scale` sobre la imagen | Imagen recortada + `object-contain` |
| "Faltan columnas" en el script | Encabezados escritos distinto (N.°) | Encabezados tolerantes |
| No se veía la hora de entrega en modo completo | Faltaba en el GET | Clave `hora_entrega` + respaldo |
| "No llegan los pedidos" | Página vieja en caché | Recarga forzada Ctrl+Shift+R |
| La web dejó de conectar tras publicar | Se usó "Nueva implementación" (URL nueva) | Siempre "Nueva versión"; o actualizar `web/.env` |
| "Se actualizó correctamente" pero seguía igual | No se eligió "Nueva versión" | Paso 4 de la guía; verificar el número |
| Interesados no se guardaban en PROD | Web publicada antes que el script | Publicar el script **antes** de unir la web a `main` |
| Emojis "�" en el WhatsApp de salida (1) | `ENCODEURL` de Sheets | Función personalizada con `encodeURIComponent` |
| Emojis "�" (2) | `wa.me` redirige y daña los emojis | `api.whatsapp.com/send` |
| En PC no abre WhatsApp y daña emojis | Limitación de WhatsApp | Enviar desde el celular; en el panel, copiar y pegar |
| WhatsApp escritorio no abría desde la web | Depende de la app de Windows | Botón `whatsapp://` + "Copiar pedido" |
| Ilustración con "cachos" y pies indefinidos | Gotas de sudor sobre la gorra; pies sin forma | Sudor detrás de la cabeza; tenis con suela |
| Mascotas del popup no convencían | "Nadie se identifica" | Dos personas comunes en una carrera |
| Página vacía 3–15 s al cargar | La web esperaba al Apps Script; Google "duerme" el script | Esqueleto con las mismas alturas |
| `clasp` "Skipping push" | Pide confirmar el manifiesto | `push --force` |
| `clasp` "API not enabled" | API activada en otra cuenta | Activar en la misma cuenta del login |
| Pruebas locales podían escribir en PROD | `.env.local` vacío caía en `web/.env` | `web/.env.development` con la URL DEV |

---

## 13. Pendientes y hoja de ruta

### Inmediato
- Publicar el script **1.3.1** en PROD (corrige los emojis de "Mensaje de salida"), cuando
  se decida salir de `dev`. Para solo corregir los enlaces de la hoja basta guardar el
  código y ejecutar `configurarHoja`.
- Borrar datos de clientes reales de la hoja DEV.
- En PROD: revisar `cupo_maximo` y salsas activas antes de la próxima jornada (se
  dejaron valores de prueba).

### Panel de pedidos (`openspec/changes/add-panel-pedidos/`, rama `panel-pedidos`)
Segunda aplicación `admin/` (misma base y marca), segundo proyecto de Cloudflare Pages
protegido con **Cloudflare Access** + **clave por rol** en Propiedades del script.
- Tarjeta por pedido: N.º, nombre, celular, dirección + "Cómo llegar" (Google Maps), platos
  por salsa, total, **switch de pago**, **switch de pantallazo**, **estado del pedido**
  (En preparación → En reparto → Entregado; Cancelado), **cancelar**, **corregir
  dirección**.
- "Salió el pedido": pasa a En reparto, abre WhatsApp con `mensaje_en_camino` (celular:
  `api.whatsapp.com`; PC: copia al portapapeles y abre el chat) y marca "Mensaje enviado".
- "Entregado" con mensaje enviado → tarjeta **gris claro e inhabilitada** (reactivable).
- Resumen (platos totales y por salsa, pagados, en reparto, entregados), filtros,
  búsqueda, pestaña de sobrepedidos, refresco cada 30 s.
- Roles: **dueños** (todo) y **repartidor** (ver dirección/platos, salida, entrega,
  WhatsApp).
- Columnas nuevas: "Estado del pedido", "Mensaje enviado" (con listas desplegables).
- **Preguntas abiertas:** ¿el repartidor ve el pago? (propuesta: no) · ¿un cancelado libera
  cupo? (propuesta: sí) · correos con acceso · ¿celular propio o del negocio?

### Otros pendientes del dueño
Descripciones reales de las salsas · fotos reales del producto (sin texto) · testimonios y
galería · dominio propio · ¿repositorio privado? · ¿Netlify como respaldo en caliente? ·
logo PNG transparente · automatización de WhatsApp (Fase 2: API oficial de Meta).

---

## 14. Cómo replicar la aplicación desde cero

1. **Repositorio:** crear repo; configurar git **local** (nombre y correo); estructura de
   la sección 5; `.gitignore` con `.env`, `.env.*` y excepciones `!web/.env`,
   `!web/.env.development`, `!web/.env.simulado`, además de `.clasprc.json`, `*.csv`,
   `*.xlsx`.
2. **Frontend:** `npm create vite@latest web -- --template react-ts`; instalar
   `tailwindcss` y `@tailwindcss/vite`; copiar los tokens `@theme` y las fuentes (sección
   6); construir los componentes de la sección 6 con la lógica de la sección 7. Scripts de
   `package.json` como en la sección 7.
3. **Hoja de Google:** crear hoja con la pestaña `Pedidos` (encabezados de la sección 8);
   Extensiones → Apps Script → pegar `Code.gs` y `appsscript.json`; ejecutar
   `configurarHoja`; llenar `Config`, `Salsas` y `Municipios`.
4. **Publicar el script** como aplicación web (sección 9, primera vez) y poner la URL
   `/exec` en `web/.env` (`VITE_APPS_SCRIPT_URL`) junto con `VITE_WHATSAPP_NUMERO`.
5. **Probar** con `scripts/probar-webapp.sh` y con la web en local (`npm run dev` contra una
   hoja DEV, o el simulador).
6. **Cloudflare Pages:** conectar el repo con integración Git, root `web`, build `npm run
   build`, salida `dist`, `NODE_VERSION=20`, rama de producción `main`, vistas previas en
   None (sección 10).
7. **Ambiente DEV:** copiar la hoja, limpiar clientes, publicar su script, poner su URL en
   `web/.env.development`; opcional `clasp` (sección 9).
8. **Proceso:** ramas dev → qa → main; OpenSpec para cada cambio; reglas de la sección 11.

### Criterios para saber que quedó igual
- En celular (375 px): portada con contador; formulario con salsas por plato; al enviar,
  número de pedido y WhatsApp abierto con el mensaje.
- Con `cupo_maximo` alcanzado: fila "Cancelado por Sobrepedidos" sin N.º y popup "¡Volaron
  las costillas!"; al cerrarlo, formulario limpio.
- Con `fecha_cierre` pasada: popup foto finish; "Avísame en la próxima" → formulario →
  fila en "Interesados".
- Últimos 10 minutos: contador naranja. Al cargar: esqueleto sin saltos.
- En la hoja: "📲 Va en camino" abre WhatsApp en el celular con el 🔥 bien.
- GET del script devuelve `version`.
