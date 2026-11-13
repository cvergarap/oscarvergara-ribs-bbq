# Despliegue del frontend en Cloudflare Pages (CD nivel 1)

El frontend vive en la carpeta [`web/`](../web) de este repositorio (React + Vite +
Tailwind). Lovable está en pausa; si se retoma, ver [lovable-prompt.md](lovable-prompt.md).

Precondiciones:
- Cuenta de Cloudflare (lista).
- Cambios de `web/` subidos a `main` en GitHub.
- Número de WhatsApp del negocio (formato `57XXXXXXXXXX`).
- La URL `/exec` del Apps Script **no** es necesaria para el MVP (modo WhatsApp).

## 1. Crear el proyecto
1. Cloudflare → **Workers & Pages → Create → Pages → Connect to Git**.
   (Si el asistente ofrece crear un *Worker*, buscar la pestaña o enlace **Pages**.)
2. Autorizar la app de Cloudflare en GitHub **solo para** `cvergarap/oscarvergara-ribs-bbq`
   (*Only select repositories*), no para toda la cuenta.
3. Elegir el repositorio. Nombre del proyecto: `ribs-bbq` (define `ribs-bbq.pages.dev`;
   si está ocupado, Cloudflare propone otro).

**No usar "Direct Upload"**: un proyecto creado así no se puede conectar a Git después.

## 2. Configuración del build
| Campo | Valor |
|---|---|
| Production branch | `main` |
| Framework preset | React (Vite) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| **Root directory (advanced)** | **`web`** |

Variables de entorno (*Environment variables*, en **Production** y **Preview**):

| Variable | Valor | Cuándo |
|---|---|---|
| `VITE_WHATSAPP_NUMERO` | `57XXXXXXXXXX` | Desde el MVP |
| `NODE_VERSION` | `20` | Desde el MVP |
| `VITE_APPS_SCRIPT_URL` | URL `/exec` del Apps Script | Solo al salir de pausa Google Sheets; no crearla antes |

El número también puede ir en `web/.env` (archivo público, se sube al repositorio).
Las variables de Cloudflare tienen prioridad sobre ese archivo. Las variables `VITE_*` se
incrustan al compilar: si cambias una en Cloudflare, ve a **Deployments → Retry
deployment** para que tome efecto.

Sin número de WhatsApp, la página publica igual pero muestra "Pedidos cerrados".

**Save and Deploy.** Desde ahí, cada push a `main` publica automáticamente.

Solo `main` debe publicar: en **Settings → Builds → Branch control** dejar
*Preview branch* en **None**. Las ramas `dev` y `qa` se prueban en local
(ver [flujo-ramas.md](flujo-ramas.md)).

## 3. Verificar
- Abrir `https://ribs-bbq.pages.dev` en celular y computador.
- El contador muestra la fecha de [`web/src/config/jornada.ts`](../web/src/config/jornada.ts).
- Enviar un pedido de prueba: debe abrir WhatsApp con el número del negocio y el
  mensaje completo. No enviar el mensaje, o avisar al negocio que es una prueba.

## 4. Operación diaria
| Quiero… | Hago… |
|---|---|
| Abrir una jornada nueva | Editar `fechaCierre` y `fechaEntrega` en `web/src/config/jornada.ts` y hacer push |
| Cerrar pedidos ya | `pedidosAbiertos: false` en el mismo archivo y push |
| Cambiar salsas, precio o máximo por pedido | Mismo archivo |
| Agregar fotos o testimonios | `web/src/data/contenido.ts` (fotos en `web/public/fotos/`) |
| Cambiar el WhatsApp | Variable en Cloudflare y *Retry deployment* |

## 5. Dominio propio (cuando se compre)
**Custom domains → Set up a custom domain** → `www.<dominio>`. Si el DNS del dominio ya
está en Cloudflare, el registro se crea solo. Luego, redirigir el dominio raíz a `www`.

## 6. Volver a una versión anterior
**Deployments** → elegir un despliegue anterior → **Rollback to this deployment**.

## 7. Cambio de cuenta de Google (modo completo)
La web solo conoce la URL del Apps Script. Para usar otra cuenta de Google: copiar la hoja
y el script en la cuenta nueva, desplegar ([guía](despliegue-apps-script.md)), cambiar
`VITE_APPS_SCRIPT_URL` en Cloudflare y hacer *Retry deployment*.
