# Propuesta: Landing de pedidos RIBS BBQ (Fase 1)

## Por qué
Hoy los pedidos se registran a mano en una hoja de cálculo. Se necesita una página
llamativa donde el cliente vea el producto y haga su pedido en un minuto, y que el
pedido quede registrado automáticamente en Google Sheets.

## Qué cambia
- Landing de una sola página: logo, 4 fotos del producto, formulario de pedido en el
  centro, testimonios y galería de clientes al final.
- Contador regresivo hasta la fecha límite de pedidos (parametrizable).
- Cupo máximo de pedidos por jornada (parametrizable, valor inicial: 20).
- Registro automático de cada pedido en Google Sheets mediante Google Apps Script.
- Tras enviar, el cliente continúa por WhatsApp, donde se confirma el pago.

## Parámetros iniciales (editables en la pestaña "Config" de la hoja)
| Parámetro      | Valor inicial               |
|----------------|-----------------------------|
| cupo_maximo    | 20 pedidos                  |
| fecha_cierre   | 2026-11-13 12:00 (Colombia) |
| fecha_entrega  | 2026-11-14                  |
| precio_plato   | 30000 COP (referencia)      |
| pedidos_abiertos | SI                        |

## Columnas de la hoja "Pedidos"
N.º, Nombre completo, Teléfono de contacto, Dirección de entrega, Municipio,
Cantidad de platos, Estado del pago, ¿Envió pantallazo?

Las dos últimas las llena el negocio; la web las crea como "Pendiente" y "No".

## Fuera de alcance (fases siguientes)
- Automatización de WhatsApp (Fase 2).
- Pagos en línea y datos de pago en la web (el pago se confirma por WhatsApp).
- Panel de administración (se administra desde Google Sheets).
- Eventos en Google Calendar por entrega (Fase 1b, ver tasks.md sección 7).

## Supuestos por confirmar
- El cupo cuenta pedidos (filas), no platos.
- Una sola receta: el formulario no pide salsa.
- Lista de municipios con cobertura: [POR DEFINIR].
- Número de WhatsApp del negocio para el enlace de confirmación: [POR CONFIRMAR].

## Impacto
- Capacidades nuevas: `landing`, `pedidos`.
- Sistemas: Lovable (frontend y publicación), Google Sheets + Apps Script (backend).
