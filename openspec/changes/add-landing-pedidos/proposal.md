# Propuesta: Landing de pedidos RIBS BBQ (Fase 1)

## Por qué
Hoy los pedidos se registran a mano en una hoja de cálculo. Se necesita una página
llamativa donde el cliente vea el producto y haga su pedido en un minuto, y que el
pedido quede registrado automáticamente en Google Sheets.

## Qué cambia
- Landing de una sola página, diseñada mobile-first: logo, 4 fotos del producto, formulario de pedido en el
  centro, testimonios y galería de clientes al final.
- Contador regresivo hasta la fecha límite de pedidos (parametrizable).
- Cupo máximo por jornada (parametrizable). Por defecto cuenta platos; se puede
  cambiar a pedidos desde la configuración.
- Elección de salsa por plato. Las salsas y su descripción se administran en la hoja.
- Municipios con cobertura administrados en la hoja.
- Registro automático de cada pedido en Google Sheets mediante Google Apps Script.
- Tras enviar, el cliente continúa por WhatsApp, donde se confirma el pago.

## Parámetros iniciales (pestaña "Config", clave / valor)
| Parámetro        | Valor inicial                     | Notas |
|------------------|-----------------------------------|-------|
| cupo_maximo      | 20                                | Límite de la jornada |
| tipo_cupo        | platos                            | `platos` o `pedidos` |
| max_por_pedido   | 5                                 | Platos máximos en un pedido |
| fecha_apertura   | (fecha de la próxima apertura)    | Solo cuentan para el cupo los pedidos desde esta fecha |
| fecha_cierre     | (fecha y hora límite, Colombia)   | Referencia del flyer: 2026-11-13 12:00 |
| fecha_entrega    | (fecha de entrega)                | Referencia del flyer: 2026-11-14 |
| precio_plato     | 30000                             | COP, referencia |
| pedidos_abiertos | SI                                | `SI` o `NO`, cierre manual |
| whatsapp_numero  | (lo carga el negocio)             | Formato 57XXXXXXXXXX. No se guarda en el repositorio |

## Pestañas administrables
- **Salsas:** Nombre, Descripción, Activa (`SI`/`NO`). Valores iniciales: Tradicional,
  Dulce, Picante (las descripciones las escribe el negocio).
- **Municipios:** Nombre, Activo (`SI`/`NO`). La carga el negocio. Mientras no haya
  municipios activos, no se aceptan pedidos.

## Columnas de la hoja "Pedidos"
N.º, Nombre completo, Teléfono de contacto, Dirección de entrega, Municipio,
Cantidad de platos, Salsas, Estado del pago, ¿Envió pantallazo?, Fecha del pedido

- La web llena N.º a Salsas y Fecha del pedido.
- "Estado del pago" nace en "Pendiente" y "¿Envió pantallazo?" en "No"; las actualiza el negocio.
- "Salsas" guarda el reparto por plato, por ejemplo: `Tradicional x2, Picante x1`.
- "Fecha del pedido" la pone el servidor y sirve para contar el cupo de la jornada.

## Decisiones confirmadas con el dueño
- Titular de los derechos: Oscar Vergara.
- El cupo cuenta platos por defecto, con límite y modo parametrizables.
- Tres salsas por ahora, parametrizables con su descripción; se eligen por plato.
- Municipios en una lista de la hoja.
- Número de WhatsApp en "Config", no en el código.

## Fuera de alcance (fases siguientes)
- Automatización de WhatsApp (Fase 2).
- Pagos en línea y datos de pago en la web (el pago se confirma por WhatsApp).
- Panel de administración (se administra desde Google Sheets).
- Eventos en Google Calendar por entrega (Fase 1b, ver tasks.md sección 7).

## Impacto
- Capacidades nuevas: `landing`, `pedidos`.
- Sistemas: Lovable (frontend y publicación), Google Sheets + Apps Script (backend).
