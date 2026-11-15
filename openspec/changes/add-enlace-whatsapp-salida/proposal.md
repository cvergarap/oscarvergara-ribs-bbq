# Propuesta: Enlace de WhatsApp "va en camino" en cada pedido

## Por qué
La primera jornada (2026-11-13/14) vendió los 20 platos. Al despachar, el negocio escribió
a cada cliente a mano. Ya tenemos su celular en la hoja: un enlace por pedido con el mensaje
listo ahorra tiempo cuando salen los domicilios.

## Qué cambia
- Columna opcional nueva en "Pedidos": **Mensaje de salida**. Cada pedido tiene un enlace
  "📲 Va en camino" que abre WhatsApp con el cliente y este texto ya escrito:
  "¡Hola {nombre}! 🔥 Gracias por tu compra en RIBS BBQ. Tu pedido #{numero} ({platos})
  ya va en camino. ¡Buen provecho!"
- El texto se cambia en Config con la clave `mensaje_en_camino` (variables `{nombre}`,
  `{numero}`, `{platos}`), sin tocar código.
- El script pone la fórmula en cada pedido nuevo. `configurarHoja()` crea la columna, la
  clave y llena los pedidos que ya existían, sin tocar celdas con contenido.
- No aparece en los sobrepedidos ni en filas sin teléfono.

## Diseño
- El enlace lo arma la función personalizada `ENLACE_EN_CAMINO` del script, con
  `encodeURIComponent`. La primera versión usaba `ENCODEURL` de Sheets, que dañaba los emojis
  (WhatsApp mostraba "�"; visto el 2026-11-15 en el pedido #1). `configurarHoja` reemplaza
  esas fórmulas viejas.
- La fórmula solo referencia celdas de la misma fila (nombre, teléfono, N.º, cantidad) y
  la clave de Config. No copia datos del cliente dentro de la fórmula: no hay riesgo de
  inyección.
- Sirve desde ya y también lo usará el panel de pedidos (`add-panel-pedidos`).

## Impacto
- Capacidad: `pedidos`. Solo Apps Script y hoja; la web no cambia.
- Requiere publicar una **nueva versión** del Web App y ejecutar `configurarHoja` una vez.
