# Propuesta: Sobrepedidos registrados y base de clientes

## Por qué
Cuando se agota el cupo, hoy el formulario se oculta y no queda rastro de quién quiso
pedir. El dueño quiere medir la demanda que no alcanzó a atender y construir una base de
clientes para avisar de nuevas aperturas.

## Qué cambia
- La portada **deja de mostrar** "Quedan N platos".
- Con el cupo agotado, el formulario **sigue abierto** (solo se cierra por fecha o por
  `pedidos_abiertos = NO`). El pedido que no alcanza se **registra** en "Pedidos" con
  "Estado del pago" = `Cancelado por Sobrepedidos`, sin N.º, y no cuenta para el cupo.
- En lugar de abrir WhatsApp, la web muestra un **popup llamativo** que explica que se
  agotaron los cupos e invita a seguir las redes sociales para la próxima apertura.
- Nueva casilla **opcional** (desmarcada): autorización para recibir avisos de aperturas
  y promociones. Se guarda en la columna opcional `¿Acepta publicidad?` (`Sí`/`No`).
  Requisito de la Ley 1581 de 2012: sin autorización expresa, el dato no se usa para
  publicidad.
- Claves opcionales nuevas en "Config": `instagram_url`, `facebook_url`, `tiktok_url`
  (botones del popup) y `hora_entrega`.

## Fuera de alcance
- Envío automático de mensajes a la base de clientes (Fase 2, WhatsApp).
- Pedidos parciales: si quedan cupos pero no alcanzan para la cantidad pedida, se
  informa cuántos quedan para que el cliente ajuste (no se registra como sobrepedido).

## Impacto
- Capacidades: `pedidos` (cupo y registro), `landing` (portada, formulario, popup).
- Requiere publicar una **nueva versión** del Web App en Apps Script.
