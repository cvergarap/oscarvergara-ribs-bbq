# Despliegue del frontend en Cloudflare Pages (CD nivel 1)

Precondiciones:
- Cuenta de Cloudflare (lista).
- Repositorio del frontend creado por Lovable en la cuenta de GitHub `cvergarap`
  (Opción A: repositorio aparte de este).
- URL `/exec` del Apps Script ([guía](despliegue-apps-script.md)).

## 1. Crear el proyecto
1. Cloudflare → **Workers & Pages → Create → Pages → Connect to Git**.
2. Autorizar la app de Cloudflare en GitHub **solo para el repositorio del frontend**
   (*Only select repositories*), no para toda la cuenta.
3. Elegir el repositorio. Nombre del proyecto: `ribs-bbq` (define `ribs-bbq.pages.dev`).

## 2. Configuración del build
| Campo | Valor |
|---|---|
| Production branch | `main` |
| Framework preset | React (Vite) |
| Build command | `npm run build` |
| Build output directory | `dist` |

Variables de entorno (*Environment variables*, en **Production** y **Preview**):

| Variable | Valor |
|---|---|
| `VITE_APPS_SCRIPT_URL` | URL `/exec` del Apps Script |
| `NODE_VERSION` | `20` |

**Save and Deploy.** Desde ahí, cada push a `main` (incluidos los cambios hechos en
Lovable) publica automáticamente.

## 3. Verificar
- Abrir `https://ribs-bbq.pages.dev` en celular y computador.
- El contador y los cupos deben venir del backend (cambiar `cupo_maximo` en Config y
  recargar).
- Hacer un pedido de prueba y borrarlo de la hoja.

## 4. Dominio propio (cuando se compre)
**Custom domains → Set up a custom domain** → `www.<dominio>`. Si el DNS del dominio ya
está en Cloudflare, el registro se crea solo. Luego, redirigir el dominio raíz a `www`.

## 5. Volver a una versión anterior
**Deployments** → elegir un despliegue anterior → **Rollback to this deployment**.
Es la forma más rápida de deshacer un cambio roto.
