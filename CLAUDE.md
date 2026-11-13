# Contexto del proyecto: RIBS BBQ - Web de pedidos

Este archivo resume lo acordado en la fase de planeación. Léelo antes de cualquier tarea.

## Qué es
Landing de pedidos para RIBS BBQ (costillas barbecue). El cliente ve el producto, llena
un formulario y el pedido queda registrado en Google Sheets. Idioma del proyecto: español.

## Fuente de verdad
- Especificaciones y tareas: `openspec/changes/add-landing-pedidos/`
  (`proposal.md`, `design.md`, `tasks.md`, `specs/landing/spec.md`, `specs/pedidos/spec.md`).
- Seguir `tasks.md` en orden y marcar cada tarea al terminarla.
- Todo cambio nuevo empieza como propuesta en `openspec/changes/<nombre>/`.

## Decisiones tomadas
- Frontend en Lovable (React + Tailwind), sincronizado a un repositorio aparte de la cuenta
  `cvergarap`, creado por Lovable. Este repositorio guarda specs, docs y Apps Script.
- CD de nivel 1: integración Git de Cloudflare Pages. Dominio propio: pendiente.
- Hosting: **Cloudflare Pages** como primario (confirmado). Propuesto en
  `openspec/changes/add-despliegue-respaldo/`: Netlify como respaldo en caliente,
  Lovable para emergencias, dominio propio y DNS en Cloudflare.
  Vercel solo con plan Pro: Hobby no admite uso comercial.
- Backend: Google Apps Script como Web App, ejecutado como el dueño de la hoja.
- Datos: Google Sheets. Pestaña "Pedidos" (ya existe) y pestaña "Config" (por crear).
- Columnas de "Pedidos": N.º, Nombre completo, Teléfono de contacto, Dirección de entrega,
  Municipio, Cantidad de platos, Estado del pago, ¿Envió pantallazo?
- La web llena las seis primeras; "Estado del pago" nace en "Pendiente" y
  "¿Envió pantallazo?" en "No".
- Cupo máximo parametrizable (valor inicial: 20) hasta la próxima apertura de pedidos.
- Contador regresivo por fecha límite parametrizable.
- El pago se confirma por WhatsApp. La web no muestra ni recibe datos de pago.
- Automatización de WhatsApp: Fase 2, fuera de alcance por ahora.
- Licencia: derechos reservados (el dueño quiere proteger el proyecto).

## Datos de referencia (del flyer, no definitivos)
- Producto: costillas BBQ de 570 g aprox. + 120 g de papas a la francesa rizadas.
- Precio: $30.000 COP.
- Jornada de referencia: pedidos hasta el 13 de noviembre de 2026 al mediodía,
  entregas el 14 de noviembre de 2026. Esa jornada ya no se alcanza con la web;
  las fechas reales se cargan en "Config" para la siguiente apertura.

## Marca
Logo: `assets/marca/logo-ribs-bbq.jpg` (falta versión PNG con fondo transparente).
| Uso                   | Color   |
|-----------------------|---------|
| Fondo principal       | #2F1C15 |
| Color de impacto      | #EF7224 |
| Títulos y texto claro | #FDEED6 |
| Fondos secundarios    | #F3D8B7 |
| Promociones           | #B7502B |
| Apoyo                 | #9A4B24, #733E21, #E1B78A |

Estructura de la landing: cabecera con logo, portada, 4 fotos del producto, formulario
en el centro, testimonios y galería de clientes al final.

## Decisiones confirmadas con el dueño (2026-11-12)
1. Titular de la licencia: Oscar Vergara.
2. El cupo cuenta platos por defecto. `cupo_maximo` y `tipo_cupo` (`platos`/`pedidos`)
   se editan en "Config".
3. Tres salsas (tradicional, dulce, picante), parametrizables con descripción en la
   pestaña "Salsas"; el cliente elige salsa por plato.
4. Municipios en la pestaña "Municipios"; los carga el negocio.
5. WhatsApp en "Config" (`whatsapp_numero`); no se guarda en el repositorio.
6. La web es mobile-first (base 360 px).

## Pendientes por decidir (preguntar al dueño antes de asumir)
1. Fotos reales del producto, sin texto encima.
2. ¿El repositorio pasa a privado? Si sí, ajustar la sección de seguridad del README.

## Reglas obligatorias
- Git: configuración siempre local, nunca `--global`. Ver `docs/configuracion-git.md`.
  Antes del primer commit en cualquier clon, verificar con `git config --local --list`.
- Nunca subir datos de clientes (nombres, teléfonos, direcciones) ni exportaciones de la hoja.
- Nunca subir contraseñas, tokens ni llaves.
- La hoja de Google no se comparte con "cualquier persona con el enlace".
- Toda validación de pedidos se hace en el servidor (Apps Script): cupo, fecha, formato,
  saneo contra inyección de fórmulas, honeypot y LockService.
- Pedir confirmación antes de `git push` y antes de borrar archivos.

## Siguiente paso
Tarea 3 de `tasks.md`: crear `apps-script/Code.gs` con `doGet` (estado de la jornada)
y `doPost` (registro del pedido), según `specs/pedidos/spec.md` y `design.md`.
