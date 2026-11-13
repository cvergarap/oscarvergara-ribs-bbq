# Diseño técnico: despliegue con respaldo

## Esquema
```
Lovable  --(sincroniza)-->  GitHub: repo del frontend (rama main)
                                 |
                 push a main     |
          +----------------------+----------------------+
          v                                             v
  Cloudflare Pages (primario)                  Netlify (respaldo en caliente)
  ribs-bbq.pages.dev                           ribs-bbq.netlify.app
          ^                                             ^
          |      DNS en Cloudflare (TTL 60 s)           |
          +------- www.<dominio>  CNAME  ---------------+
                   (apunta a uno u otro)

Ambos llaman al mismo backend:  Apps Script Web App  ->  Google Sheets
```

## Reglas para que el sitio sea portable
1. **Solo estático.** `npm run build` genera `dist/`. Nada de funciones de servidor,
   middleware ni APIs propias del proveedor.
2. **Una sola variable:** `VITE_APPS_SCRIPT_URL`. Es pública por naturaleza (va en el
   navegador), pero se configura por proveedor para no editar código al cambiarla.
3. **Página única.** Si se agregan rutas, el archivo `public/_redirects` con
   `/* /index.html 200` sirve igual en Cloudflare Pages y en Netlify.
4. **Misma versión de Node** en ambos (`.nvmrc` con `20`).
5. **Sin secretos en el repositorio.** Los tokens de despliegue van en GitHub Secrets.

## Dos niveles de CD

### Nivel 1: integración Git de cada proveedor (para hoy)
Se conecta el mismo repositorio a Cloudflare Pages y a Netlify desde sus paneles:
comando `npm run build`, carpeta `dist`, variable `VITE_APPS_SCRIPT_URL`. Cada push a
`main` despliega en los dos. No requiere código de CI. Se configura en unos 15 minutos
por proveedor.

### Nivel 2: GitHub Actions (siguiente iteración)
Un solo build, verificado una vez y publicado en los dos destinos. Si falla el build,
no se publica en ninguno. Si un destino falla, el otro sigue.
En este nivel se desactivan los builds automáticos del panel de cada proveedor.

```yaml
# .github/workflows/deploy.yml (en el repositorio del frontend)
name: deploy
on:
  push:
    branches: [main]
  workflow_dispatch:
concurrency: deploy-prod
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version-file: .nvmrc, cache: npm }
      - run: npm ci
      - run: npm run build
        env:
          VITE_APPS_SCRIPT_URL: ${{ vars.VITE_APPS_SCRIPT_URL }}
      - uses: actions/upload-artifact@v4
        with: { name: dist, path: dist }

  cloudflare:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with: { name: dist, path: dist }
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy dist --project-name=ribs-bbq --branch=main

  netlify:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with: { name: dist, path: dist }
      - run: npx --yes netlify-cli@17 deploy --prod --dir=dist --no-build
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

Secretos en GitHub (Settings → Secrets and variables → Actions):
`CLOUDFLARE_API_TOKEN` (permiso solo "Cloudflare Pages: Edit"), `CLOUDFLARE_ACCOUNT_ID`,
`NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`. Variable (no secreta): `VITE_APPS_SCRIPT_URL`.

## Conmutación (runbook)
Precondición: dominio en DNS de Cloudflare, registro `www` con TTL de 60 s y el dominio
ya agregado como dominio personalizado en **ambos** proveedores.

1. Confirmar que el respaldo responde: abrir `ribs-bbq.netlify.app` y ver el contador.
2. En el DNS, cambiar el CNAME de `www` de `ribs-bbq.pages.dev` a `ribs-bbq.netlify.app`
   y poner el proxy de Cloudflare en "solo DNS" (nube gris) para que Netlify emita su
   certificado.
3. Esperar de 1 a 5 minutos y probar desde datos móviles (otra red, otra caché DNS).
4. Si el dominio no responde a tiempo, compartir por WhatsApp el enlace directo del
   respaldo (`*.netlify.app` o `*.lovable.app`).
5. Para volver, revertir el CNAME.

Probar este runbook una vez antes de abrir la primera jornada.

Riesgo conocido: si se cae Cloudflare completo, también cae su DNS. Mitigación: el paso 4
(enlace directo). Para evitarlo del todo haría falta DNS en un tercero, que no se justifica
en esta fase.
