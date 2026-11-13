# Propuesta: Esqueleto animado mientras carga la jornada

## Por qué
En modo completo, la web espera la respuesta del Apps Script antes de mostrar precio,
contador y formulario. Medido el 2026-11-13: Cloudflare entrega la página en 0,4 s, pero
el Apps Script tarda unos 3,5 s con el script activo y 10 a 15 s cuando Google lo
"despierta". Mientras tanto el centro de la página queda vacío.

## Qué cambia
- La portada muestra de inmediato lo fijo (logo, título, descripción del producto) y
  esqueletos animados en el lugar del precio, la entrega y el contador.
- En el lugar del formulario aparece una tarjeta "Haz tu pedido · Calentando la
  parrilla…" con esqueletos de los campos.
- Los esqueletos tienen las mismas alturas que el contenido real: nada salta al llegar
  los datos. Aparecen de arriba hacia abajo y un barrido de luz baja por la tarjeta.
- Animación en CSS puro, sin librerías (se descartó Lottie por su peso, ~45 KB).
- Al responder el Apps Script, los esqueletos se reemplazan por los datos reales.

## Fuera de alcance (decisión del dueño)
- No se guarda nada en caché ni se muestra la última respuesta.
- No se cambia el Apps Script.

## Impacto
- Capacidad: `landing`. Solo web; no requiere publicar el Web App.
