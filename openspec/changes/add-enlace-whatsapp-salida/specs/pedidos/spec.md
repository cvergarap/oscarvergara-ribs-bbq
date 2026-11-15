# Delta para Pedidos

## ADDED Requirements

### Requirement: Enlace de WhatsApp de salida
Cada pedido registrado con N.º MUST tener en la columna "Mensaje de salida" un enlace que
abra WhatsApp con el celular del cliente y el texto de `mensaje_en_camino` (o el texto por
defecto), con `{nombre}`, `{numero}` y `{platos}` reemplazados. Los sobrepedidos MUST NOT
tenerlo.

#### Scenario: Sale un domicilio
- **WHEN** el negocio toca "📲 Va en camino" en la fila del pedido 7 de Ana, 2 platos
- **THEN** se abre WhatsApp con Ana y el texto "¡Hola Ana! … Tu pedido #7 (2 platos) ya va
  en camino…"

#### Scenario: Pedidos que ya existían
- **WHEN** se ejecuta `configurarHoja()`
- **THEN** los pedidos con N.º sin enlace lo reciben, y las celdas con contenido no cambian
