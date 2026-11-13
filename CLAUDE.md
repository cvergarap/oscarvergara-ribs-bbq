# Contexto del proyecto: RIBS BBQ - Web de pedidos

Resumen de lo acordado. Léelo antes de cualquier tarea. Última actualización: 2026-11-12.

## Qué es
Landing de pedidos para RIBS BBQ (costillas barbecue). El cliente ve el producto y llena
un formulario. Idioma del proyecto: español.
- **Hoy (MVP, modo WhatsApp):** el formulario arma el pedido y lo abre en WhatsApp.
- **Después (modo completo):** el pedido queda registrado en Google Sheets vía Apps Script.

## Fuente de verdad
- `openspec/changes/add-landing-pedidos/`: landing y pedidos (`proposal.md`, `design.md`,
  `tasks.md`, `specs/landing/spec.md`, `specs/pedidos/spec.md`).
- `openspec/changes/add-despliegue-respaldo/`: hosting, respaldo y CI/CD.
- Seguir `tasks.md` en orden y marcar cada tarea al terminarla.
- Todo cambio nuevo empieza como propuesta en `openspec/changes/<nombre>/`.

## Estructura del repositorio
```
web/          Frontend: React + Vite + TypeScript + Tailwind (se publica en Cloudflare Pages)
apps-script/  Backend en Google Apps Script (Code.gs + appsscript.json), en pausa
openspec/     Especificaciones, diseño y tareas
docs/         Guías: configuracion-git, despliegue-cloudflare, despliegue-apps-script, lovable-prompt
scripts/      probar-webapp.sh (pruebas del Web App)
assets/       Logo y recursos de marca
```

## Decisiones tomadas

### Frontend
- React + Vite + TypeScript + Tailwind en `web/`, mobile-first (base 360 px).
- Lovable en pausa (no se pudo activar la cuenta). Si se retoma: `docs/lovable-prompt.md`.
- Fuente de datos intercambiable (`web/src/lib/fuenteDatos.ts`):
  - **Modo WhatsApp** (activo): la jornada sale de `web/src/config/jornada.ts`
    (fechas, precio, máximo por pedido, salsas con descripción, municipios, abierto/cerrado).
    Sin cupos restantes ni número de pedido. Los datos del cliente solo van a WhatsApp.
  - **Modo completo**: se activa con `VITE_APPS_SCRIPT_URL`, sin cambiar la interfaz.
    Escrito pero no probado contra un backend real.
- Variables públicas en `web/.env` (sí se sube; nunca secretos). Las variables de
  Cloudflare Pages tienen prioridad. `.env.local` queda fuera de Git.
  - `VITE_WHATSAPP_NUMERO` (formato `57XXXXXXXXXX`). Sin él, la web muestra "Pedidos cerrados".
  - `VITE_APPS_SCRIPT_URL` (vacío = modo WhatsApp).
- Fotos, testimonios y galería de clientes en `web/src/data/contenido.ts`. Las secciones
  vacías no se muestran.

### Hosting y despliegue
- **Cloudflare Pages** como primario (confirmado), CD de nivel 1 con integración Git:
  root `web`, `npm run build`, salida `dist`, `NODE_VERSION=20`. Guía: `docs/despliegue-cloudflare.md`.
- Propuesto, sin confirmar: Netlify como respaldo en caliente, Lovable para emergencias,
  dominio propio con DNS en Cloudflare (dominio pendiente de compra).
- Vercel solo con plan Pro: Hobby no admite uso comercial.

### Backend (en pausa)
- Google Apps Script como Web App, ejecutado como el dueño de la hoja.
  Código listo en `apps-script/Code.gs`; guía en `docs/despliegue-apps-script.md`.
- La cuenta de Google puede cambiar: la web solo conoce `VITE_APPS_SCRIPT_URL`.
- Pestañas: "Pedidos", "Config" (clave/valor), "Salsas" (Nombre, Descripción, Activa) y
  "Municipios" (Nombre, Activo). `configurarHoja()` las crea sin borrar datos.
- Columnas de "Pedidos" (el script las ubica por nombre): N.º, Nombre completo,
  Teléfono de contacto, Dirección de entrega, Municipio, Cantidad de platos, Salsas,
  Estado del pago, ¿Envió pantallazo?, Fecha del pedido.
  "Estado del pago" nace en "Pendiente" y "¿Envió pantallazo?" en "No".
- Claves de "Config": cupo_maximo (20), tipo_cupo (`platos`/`pedidos`), max_por_pedido,
  fecha_apertura, fecha_cierre, fecha_entrega, precio_plato, pedidos_abiertos, whatsapp_numero.
  El cupo cuenta solo pedidos desde `fecha_apertura`.

### Negocio
- Titular de la licencia: Oscar Vergara. Derechos reservados.
- El cupo cuenta platos por defecto; límite y modo parametrizables.
- Tres salsas (Tradicional, Dulce, Picante), parametrizables con descripción; el cliente
  elige salsa por plato.
- El pago se confirma por WhatsApp. La web no muestra ni recibe datos de pago.
- Automatización de WhatsApp: Fase 2, fuera de alcance.

## Datos de referencia (del flyer, no definitivos)
- Producto: costillas BBQ de 570 g aprox. + 120 g de papas a la francesa rizadas.
- Precio: $30.000 COP.
- Jornada confirmada por el dueño (en `web/src/config/jornada.ts`): cierre 13 de
  noviembre de 2026 a las 12:00 (Colombia), entrega 14 de noviembre a las 14:00.
- Número de WhatsApp configurado en `web/.env`.
- Municipios con cobertura: Pereira y Dosquebradas (desplegable, sin opción "Otro").
- WhatsApp: en celular `wa.me`; en computador `whatsapp://send`, WhatsApp Web o copiar pedido.
- Las descripciones de las salsas en `jornada.ts` son provisionales.

## Marca
Logo: `assets/marca/logo-ribs-bbq.jpg` (copia en `web/public/`). Falta versión PNG con
fondo transparente.
| Uso                   | Color   |
|-----------------------|---------|
| Fondo principal       | #2F1C15 |
| Color de impacto      | #EF7224 |
| Títulos y texto claro | #FDEED6 |
| Fondos secundarios    | #F3D8B7 |
| Promociones           | #B7502B |
| Apoyo                 | #9A4B24, #733E21, #E1B78A |

Estructura de la landing: cabecera con logo, portada con contador, 4 fotos del producto,
formulario en el centro, testimonios y galería de clientes al final.

## Pendientes (preguntar al dueño antes de asumir)
1. Descripciones reales de las salsas.
2. Fotos reales del producto, sin texto encima.
3. Dominio propio.
4. ¿El repositorio pasa a privado? Si sí, ajustar la sección de seguridad del README.
5. ¿Netlify como respaldo en caliente?
6. Cuándo sale de pausa Google Sheets y Apps Script.

## Reglas obligatorias
- Git: configuración siempre local, nunca `--global`. Ver `docs/configuracion-git.md`.
  Antes del primer commit en cualquier clon, verificar con `git config --local --list`.
- Nunca subir datos de clientes (nombres, teléfonos, direcciones) ni exportaciones de la hoja.
- Nunca subir contraseñas, tokens ni llaves. `web/.env` es solo para valores públicos.
- La hoja de Google no se comparte con "cualquier persona con el enlace".
- En modo completo, toda validación de pedidos se hace en el servidor (Apps Script):
  cupo, fecha, formato, saneo contra inyección de fórmulas, honeypot y LockService.
  La validación del navegador es solo ayuda para el cliente.
- Pedir confirmación antes de `git push` y antes de borrar archivos.

## Siguiente paso
1. Web publicada en https://oscarvergara-ribs-bbq.pages.dev (Cloudflare Pages, cuenta del
   negocio). Cada push a `main` vuelve a publicar.
2. Hacer un pedido real desde celular (tarea 6.2).
3. Luego: tareas 1.3 (contenido), 5 (pruebas) y 6 (publicación) de
   `openspec/changes/add-landing-pedidos/tasks.md`.
