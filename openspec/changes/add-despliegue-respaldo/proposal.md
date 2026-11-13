# Propuesta: Despliegue con respaldo y CI/CD

## Por qué
La web de pedidos es el único canal de venta en línea. Si el proveedor de hosting
suspende el sitio (por términos de uso, límites del plan gratis o una caída), se pierden
ventas en plena jornada. Se necesita poder pasar a otro proveedor en minutos y sin
cambiar el enlace que ya tienen los clientes.

## Qué cambia
- El frontend se publica en **dos proveedores a la vez** (primario y respaldo en caliente),
  desde el mismo repositorio y con cada push a `main`.
- Un **dominio propio** con DNS administrado por el negocio. Cambiar de proveedor es
  cambiar un registro DNS, no el enlace.
- Lovable queda como **respaldo de emergencia** (URL `*.lovable.app`, distinta del dominio).
- El build es un sitio estático (Vite → `dist/`), sin funciones de servidor del proveedor,
  para que funcione igual en cualquiera.

## Comparación de proveedores (verificar precios y términos vigentes al contratar)
| Proveedor | Plan gratis y uso comercial | Ventajas | Desventajas |
|---|---|---|---|
| **Cloudflare Pages** | Gratis; permite uso comercial | Ancho de banda de sitios estáticos sin cobro, CDN global, DNS gratis en la misma cuenta | Límite mensual de builds en el plan gratis; Cloudflare está empujando Workers como sucesor de Pages |
| **Netlify** | Gratis; permite uso comercial | Despliegue muy simple, vistas previas por PR, lee el mismo archivo `_redirects` que Cloudflare | El plan gratis tiene un tope de uso mensual; al agotarlo, el sitio puede pausarse hasta el siguiente ciclo |
| **Vercel Hobby** | **No permite uso comercial** | Muy buena integración con Git | Un sitio que vende puede ser suspendido por incumplir los términos. Un respaldo no lo vuelve aceptable |
| **Vercel Pro** | Pago mensual por usuario | Permite uso comercial, soporte y límites altos | Costo fijo para un emprendimiento pequeño |
| **Lovable** | Incluido con la cuenta; dominio propio en plan pago | Cero configuración, ya está donde se construye | Depende de la misma herramienta de construcción; poco control |
| GitHub Pages | Gratis | Simple | Sus términos excluyen sitios principalmente comerciales; no recomendado |

## Recomendación
- **Primario:** Cloudflare Pages (gratis, uso comercial, sin cobro por tráfico).
- **Respaldo en caliente:** Netlify, que también se actualiza con cada push.
- **Emergencia:** publicación de Lovable.
- **Vercel:** solo con plan Pro. No se usa Vercel Hobby ni como respaldo.

## Decisiones confirmadas con el dueño
- 2026-11-12: el proveedor primario es **Cloudflare Pages**.
- 2026-11-12: la cuenta de GitHub es `cvergarap`. Este repositorio
  (`cvergarap/oscarvergara-ribs-bbq`) guarda specs, docs y Apps Script; el frontend vive
  en un repositorio aparte de la misma cuenta, creado y sincronizado por Lovable.
- 2026-11-12: CD de nivel 1 (integración Git de Cloudflare Pages). GitHub Actions queda
  para después.

## Decisiones por confirmar con el dueño
1. Dominio a comprar (ej.: `ribsbbq.co`) y en qué registrador. Sin dominio propio, la
   conmutación obliga a repartir un enlace nuevo a los clientes.
2. Visibilidad del repositorio del frontend (se recomienda privado; Cloudflare Pages
   funciona con repositorios privados).

## Fuera de alcance
- Alta disponibilidad del backend: Apps Script y Google Sheets siguen siendo un solo
  punto. Si Google falla, ningún frontend puede registrar pedidos; el plan B es recibir
  pedidos por WhatsApp.
- Conmutación automática por chequeo de salud (se hace a mano, en minutos).

## Impacto
- Capacidad nueva: `despliegue`.
- Sistemas: GitHub, Cloudflare (Pages + DNS), Netlify, Lovable, registrador de dominio.
