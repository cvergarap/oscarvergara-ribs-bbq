# Propuesta: Popup de cierre por fecha y registro de interesados

## Por qué
Cuando se cumple la fecha de cierre (`fecha_cierre`), la web oculta el formulario y
muestra una caja simple "Pedidos cerrados". Probado el 2026-11-13: el cierre funciona
(contador, formulario y envío tardío rechazado por el servidor), pero la pantalla no
aprovecha al cliente que llegó tarde. El dueño quiere una salida simpática, en tono
cercano y cómico, que además capture nombre y celular para avisar de la próxima jornada.

## Qué cambia
- **Popup de cierre** con temática de carrera ("llegó tarde a la meta"), en los colores
  de la marca. Aparece al llegar el contador a cero o al entrar con los pedidos cerrados.
  Un **único mensaje**, sin importar el motivo del cierre (fecha, `pedidos_abiertos = NO`
  o configuración incompleta). Opción visual elegida: foto finish con dos fanáticos;
  uno cruza la meta con el plato de costillas en alto (11:59:59) y el cliente llega
  segundo, con la mano estirada (12:00:01).
- Al cerrar el popup queda la portada con un aviso breve de "Pedidos cerrados" y un botón
  para volver a abrirlo.
- Botón **"Avísame en la próxima"**: el mismo popup pasa a un formulario corto (nombre,
  celular, autorización obligatoria). No abre WhatsApp: el dato queda en la hoja.
- Nueva pestaña **"Interesados"** (Fecha, Nombre, Teléfono, Acepta publicidad), creada por
  `configurarHoja()` sin borrar datos. No afecta "Pedidos" ni el cupo.
- **Contador discreto**: en los últimos 10 minutos los números pasan a color de impacto
  (#EF7224) y la etiqueta dice "¡Últimos minutos!". Sin parpadeo ni sonido.

## Fuera de alcance
- Envío automático de avisos a los interesados (Fase 2, WhatsApp).
- Registro de interesados en modo WhatsApp (sin backend): ahí el botón no se muestra.

## Impacto
- Capacidades: `landing` (popup, contador), `interesados` (nueva).
- Requiere publicar una **nueva versión** del Web App (Administrar implementaciones →
  ✏️ → Nueva versión; la URL no cambia).
- Ley 1581 de 2012: el único fin del dato es contactar al cliente, por eso la
  autorización es obligatoria para enviar el formulario.
