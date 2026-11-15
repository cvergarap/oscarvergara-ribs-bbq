# Ambientes: producción, desarrollo y simulado

La web no sabe qué hoja usa: solo conoce la URL `/exec` de un Apps Script. Cada ambiente
tiene su hoja, su script y su URL, y no se tocan entre sí.

```
                 CÓDIGO (GitHub): apps-script/Code.gs = única fuente de verdad
                 │                                   │
   se publica a mano (guía)              se sube con clasp (o a mano)
                 ▼                                   ▼
┌────────────── PRODUCCIÓN ──────────────┐  ┌────────────── DESARROLLO ─────────────┐
│ Hoja: oscarvergara-ribs-bbq            │  │ Hoja: RIBS BBQ - DEV (copia)          │
│ URL: …AKfycbwCCXB4…/exec               │  │ URL: …AKfycbxKZkV7…/exec              │
│ La usa: web/.env → Cloudflare (main)   │  │ La usa: web/.env.development → tu PC  │
│ Clientes reales                        │  │ Datos de prueba, se puede romper      │
└────────────────────────────────────────┘  └───────────────────────────────────────┘
```

| Comando (desde `web/`) | Modo de Vite | Archivo de variables | Backend |
|---|---|---|---|
| `npm run dev` | development | `web/.env.development` | **Hoja DEV** |
| `npm run dev:simulado` (con `npm run simulado` en otra terminal) | simulado | `web/.env.simulado` | **Simulador local** (sin Google) |
| `npm run build` (Cloudflare) | production | `web/.env` | **Hoja PROD** |

- Vite da prioridad a `.env.[modo]` sobre `.env` y `.env.local`. Por eso `npm run dev` va
  siempre a DEV, aunque `web/.env.local` esté vacío o mal.
- Para cambiar la URL solo en tu PC: `web/.env.development.local` (no se sube).
- ⚠️ `npm run preview` muestra el build de producción: **apunta a PROD**. No enviar pedidos
  ni interesados desde ahí.

## Versiones del script (2026-11-15)
| Ambiente | Versión | Nota |
|---|---|---|
| PROD | 1.3.0 | Enlace "va en camino" con el error de emojis (se corrige con 1.3.1) |
| DEV | 1.3.1 | Rama `dev` |

Para ver la versión publicada: abrir la URL `/exec` y buscar `"version"`.

## Hoja DEV
- Copia de la hoja real (Archivo → Hacer una copia), con su propio script y Web App.
- **Sin datos de clientes reales**: borrar sus filas de PEDIDOS e Interesados, para no
  escribirle a un cliente real desde las pruebas.
- No se comparte con "cualquier persona con el enlace" (misma regla que producción).

## Simulador local (`scripts/backend-simulado.js`)
Imita al Apps Script en memoria, sin Google. Sirve para probar pantallas en segundos.

```bash
cd web
npm run simulado        # terminal 1: servidor en http://localhost:5199
npm run dev:simulado    # terminal 2: la web en http://localhost:5173
```

Control desde el navegador:

| Quiero ver… | Abrir |
|---|---|
| Cierre en 90 s (contador naranja y popup) | http://localhost:5199/control?cierre=90 |
| Ya cerrado | http://localhost:5199/control?cierre=-1 |
| Esqueleto de carga (estado lento) | http://localhost:5199/control?demora=8000 |
| Cupo agotado (popup de sobrepedidos) | http://localhost:5199/control?cupo=0 |
| Cierre manual | http://localhost:5199/control?abiertos=NO |
| Error de carga ("Reintentar") | http://localhost:5199/control?error=1 |
| Qué llegó | http://localhost:5199/registro |

Recargar la web después de cambiar el control. Al detener el servidor (Ctrl+C) se borra todo.

## clasp: subir el script a DEV desde la terminal
`clasp` es la herramienta oficial de Google para Apps Script. Con ella, Claude o cualquiera
del equipo sube `apps-script/` al script de la hoja **DEV** y publica una nueva versión, sin
copiar y pegar. **Solo se conecta a DEV**: producción se sigue publicando a mano con la
guía (`docs/despliegue-apps-script.md`, sección 5).

### Configuración (una vez por PC)
Probado el 2026-11-15: push y nueva versión (@2) en DEV con la cuenta de la universidad.
La API debe estar activada **en la misma cuenta** con la que se hace `clasp login`; si no,
falla con "User has not enabled the Apps Script API".

1. Activar la API de Apps Script en tu cuenta de Google:
   https://script.google.com/home/usersettings → **API de Google Apps Script: Activada**.
2. Iniciar sesión (abre el navegador; autorizar con la cuenta dueña de la hoja DEV):
   ```bash
   npx @google/clasp@3.4.1 login
   ```
   El permiso queda en `C:\Users\<tú>\.clasprc.json`, fuera del repositorio. Nunca subirlo.
3. `apps-script/.clasp.json` guarda el ID del script DEV (no es secreto: sin permiso de la
   cuenta no sirve de nada). Se saca de la hoja DEV → Extensiones → Apps Script →
   ⚙️ Configuración del proyecto → **ID de la secuencia de comandos**.

### Uso
```bash
cd apps-script
npx @google/clasp@3.4.1 status        # qué archivos subiría (solo Code.gs y appsscript.json)
npx @google/clasp@3.4.1 push --force  # sube el código al script DEV (= guardar en el editor)
npx @google/clasp@3.4.1 update-deployment AKfycbxKZkV7A14Xoh8olpff8xoD_324OGmNpD1FBfbTZu0-Nq1GUgL_T9AQd9k4XQpfQGLaMw -d "1.3.1 - descripción"
```
- `push --force` = guardar en el editor (sin `--force`, clasp 3.4.1 responde "Skipping push"
  porque pide confirmar el reemplazo del manifiesto). `update-deployment <ID>` = **Nueva versión** de la
  implementación existente (misma URL). **Nunca** `create-deployment` (o `deploy` sin ID):
  crea una implementación nueva con otra URL.
- `apps-script/.clasp.json` apunta al script DEV y `apps-script/.claspignore` limita lo que
  se sube a `Code.gs` y `appsscript.json`.
- Si el cambio trae columnas nuevas: ejecutar `configurarHoja` en el editor de la hoja DEV.
- Comprobar: abrir la URL `/exec` de DEV y revisar `"version"`.
