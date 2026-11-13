# Flujo de ramas: dev, qa y main

Objetivo: probar todo lo nuevo sin romper lo que está en producción.

| Rama | Para qué | Dónde corre |
|---|---|---|
| `dev` | Integra todo lo nuevo. Las ramas de trabajo salen de aquí. | Local |
| `qa` | Pruebas antes de publicar. | Local (`npm run dev` o `npm run preview`) |
| `main` | Producción. Solo recibe lo que pasó por `qa`. | Cloudflare Pages: https://oscarvergara-ribs-bbq.pages.dev |

```
rama-de-trabajo ──► dev ──► qa ──► main ──► Cloudflare (producción)
   (sale de dev)          (pruebas    (cada push publica)
                           en local)
```

## Paso a paso

### 1. Empezar algo nuevo
```bash
git switch dev
git pull
git switch -c nombre-del-cambio
```
El cambio empieza como propuesta en `openspec/changes/<nombre>/`.

### 2. Terminar el cambio: pasarlo a dev
```bash
git switch dev
git merge --no-ff nombre-del-cambio
git push origin dev
```

### 3. Probar en qa (local)
```bash
git switch qa
git merge --no-ff dev
cd web
npm install
npm run dev
```
Abrir http://localhost:5173 y probar en celular (vista móvil) y computador.

**Las pruebas de qa no deben escribir en la hoja de producción.** Antes de probar,
crear `web/.env.local` (no se sube) con una de estas opciones:
- **Hoja de pruebas** (recomendado): una copia de la hoja de Google con su propio Web App.
  `VITE_APPS_SCRIPT_URL=<URL /exec de la copia>`
- **Sin backend** (solo pantallas): `VITE_APPS_SCRIPT_URL=` (vacío, modo WhatsApp).

Al terminar, dejar `web/.env.local` vacío para no confundir pruebas futuras.
```bash
git push origin qa
```

### 4. Publicar: pasar a main
Solo con las pruebas de qa aprobadas y con confirmación del dueño.
```bash
git switch main
git merge --no-ff qa
git push origin main
```
Cloudflare publica en 1 o 2 minutos. Verificar en https://oscarvergara-ribs-bbq.pages.dev
(recarga forzada: Ctrl+Shift+R).

### Si hay un cambio en Apps Script
1. Probarlo primero en el script de la **hoja de pruebas**.
2. Al pasar a `main`, copiar `apps-script/Code.gs` al script de la hoja real y publicar
   una **nueva versión** (Implementar → Administrar implementaciones → ✏️ → Nueva
   versión). Así la URL no cambia.

## Arreglo urgente en producción
```bash
git switch main
git switch -c arreglo-urgente
# corregir, probar en local
git switch main && git merge --no-ff arreglo-urgente && git push origin main
git switch dev && git merge main && git push origin dev
git switch qa && git merge main && git push origin qa
```
El arreglo vuelve a `dev` y `qa` para que no se pierda en la siguiente publicación.

## Cloudflare: solo main
Por defecto, Cloudflare Pages crea una vista previa por cada rama que recibe push, y esa
vista previa usaría la hoja de producción. Para que solo `main` publique:

**Workers & Pages → oscarvergara-ribs-bbq → Settings → Builds → Branch control**
- Production branch: `main`
- Automatic deployments: activado
- Preview branch: **None** (sin vistas previas)
- Guardar.

## Reglas
- Nunca hacer commit directo en `main`, salvo un arreglo urgente.
- Pedir confirmación antes de cualquier `git push`.
- Configuración de git siempre local (`docs/configuracion-git.md`).
