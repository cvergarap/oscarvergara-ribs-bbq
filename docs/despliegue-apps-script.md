# Despliegue del backend (Google Apps Script)

Tiempo estimado: 20 minutos. Se hace con la cuenta de Google dueña de la hoja de pedidos.

## 1. Pegar el código
1. Abrir la hoja de pedidos → **Extensiones → Apps Script**.
2. Reemplazar el contenido de `Código.gs` por el de [`apps-script/Code.gs`](../apps-script/Code.gs).
3. **Configuración del proyecto** (engranaje) → marcar *Mostrar el archivo de manifiesto
   "appsscript.json" en el editor* → reemplazar su contenido por
   [`apps-script/appsscript.json`](../apps-script/appsscript.json).
4. Guardar (Ctrl + S).

## 2. Preparar la hoja
1. En el editor, elegir la función `configurarHoja` y pulsar **Ejecutar**.
2. Autorizar el acceso a la hoja con la cuenta del dueño. Google muestra
   "Google no verificó esta app": **Configuración avanzada → Ir a (proyecto)**. Es normal
   para scripts propios.
3. Resultado: pestañas "Config", "Salsas", "Municipios" e "Interesados" creadas, y en "Pedidos" se
   agregan al final las columnas que falten ("Salsas" y "Fecha del pedido").
   No se borra ni se sobrescribe nada.

## 3. Llenar la configuración
Pestaña **Config** (las fechas en texto, hora de Colombia):

| Clave | Ejemplo | Nota |
|---|---|---|
| cupo_maximo | 20 | |
| tipo_cupo | platos | `platos` o `pedidos` |
| max_por_pedido | 5 | |
| fecha_apertura | 2026-11-12 18:00 | Solo cuentan pedidos desde aquí |
| fecha_cierre | 2026-11-20 12:00 | |
| fecha_entrega | 2026-11-21 | |
| hora_entrega | 14:00 | Opcional, 24 h. Si falta, la web usa la de `web/src/config/jornada.ts` |
| precio_plato | 30000 | |
| pedidos_abiertos | SI | `NO` cierra todo al instante |
| whatsapp_numero | 57XXXXXXXXXX | Sin `+`, sin espacios |
| mensaje_en_camino | ¡Hola {nombre}! … tu pedido #{numero} ({platos}) ya va en camino… | Texto del WhatsApp de salida. `{nombre}` = primer nombre, `{numero}` = N.º, `{platos}` = "2 platos" |

Pestaña **Salsas**: escribir la descripción de cada una. Pestaña **Municipios**: un
municipio por fila con Activo = `SI`. Sin municipios o sin salsas activas, el script no
acepta pedidos.

Columna **Mensaje de salida** (en "Pedidos"): enlace "📲 Va en camino" por pedido. Al
tocarlo abre WhatsApp con el cliente y el mensaje de `mensaje_en_camino` ya escrito. El
script lo pone en cada pedido nuevo; para los pedidos que ya existían, ejecutar
`configurarHoja` una vez. No sale en los sobrepedidos.

Pestaña **Interesados** (Fecha, Nombre, Teléfono, Acepta publicidad): la llena la web
cuando alguien llega con los pedidos cerrados y pide aviso de la próxima jornada. No se
edita a mano y no afecta el cupo.

Para revisar: elegir `probarEstado` → **Ejecutar** → ver el resultado en el registro.

## 4. Publicar como Web App
1. **Implementar → Nueva implementación** → tipo **Aplicación web**.
2. Descripción: `v1`. Ejecutar como: **Yo**. Quién tiene acceso: **Cualquier usuario**.
3. **Implementar** y copiar la URL que termina en `/exec`. Esa es `VITE_APPS_SCRIPT_URL`.
4. Abrir la URL en el navegador: debe mostrar el JSON del estado.

## 5. Actualizar el código sin cambiar la URL

> **Regla de oro: "Nueva versión" sí, siempre. "Nueva implementación" nunca.**

| Botón | Qué hace | ¿URL nueva? | ¿Se usa? |
|---|---|---|---|
| Implementar → **Nueva implementación** | Crea otra aplicación web aparte | **Sí**: la web deja de conectarse | ❌ Nunca |
| Implementar → Administrar implementaciones → ✏️ → **Nueva versión** | Actualiza la aplicación web existente con el código guardado | **No**: misma URL | ✅ Siempre |

**Guardar el código (Ctrl+S) no lo publica.** Solo cambia el borrador del editor. La web
sigue usando la última versión publicada hasta hacer los pasos de abajo.

### Paso a paso (cada vez que cambie `Code.gs`)
1. Abrir la hoja real → **Extensiones → Apps Script** → archivo **Code.gs**.
2. **Ctrl+A** y **Ctrl+V** con el código nuevo de la rama `main`. Revisar que la primera
   línea sea `/**` y que al final esté la función `probarEstado`.
3. **Guardar** (Ctrl+S). Si aparece un error en rojo, no seguir.
4. **Implementar → Administrar implementaciones**.
5. A la izquierda, en **Activa**, seleccionar la implementación cuya URL es la de
   `VITE_APPS_SCRIPT_URL` en `web/.env`.
6. Clic en el **lápiz ✏️** (arriba a la derecha de "Configuración").
7. Abrir la casilla **Versión** y elegir **Nueva versión** (la primera opción de la lista).
   **Paso clave:** si se deja la versión que aparece, se vuelve a publicar la anterior.
8. **Descripción**: la versión del encabezado de `Code.gs`, por ejemplo
   `1.3.0 - Enlace va en camino`.
9. **Implementar**. El aviso debe decir **"Versión N"** con un número **mayor** que el
   anterior, y la **misma URL**. Si sigue el número anterior, no quedó: repetir desde el 4.
10. Si el cambio trae columnas o claves nuevas: elegir **`configurarHoja`** en la barra de
    arriba → **▶ Ejecutar**. No borra datos.

### Comprobar qué quedó publicado
- Abrir la URL `/exec` en el navegador y buscar el campo `"version"` (desde la 1.3.0).
- O pedirle a Claude que lo verifique: consulta el GET y envía una solicitud inválida que
  no guarda nada.

### Errores que ya nos pasaron (2026-11-15)
| Síntoma | Causa | Solución |
|---|---|---|
| Se pegó y guardó el código, pero la web sigue igual | Faltó publicar | Pasos 4 a 9 |
| El aviso dice "Se actualizó correctamente" pero muestra la misma "Versión N" | No se eligió **Nueva versión** en la casilla Versión | Repetir con el paso 7 |
| La web dejó de cargar datos después de publicar | Se usó **Nueva implementación** (URL nueva) | Publicar la nueva versión en la implementación original, o poner la URL nueva en `web/.env` |

## 6. Probar
Ver [`scripts/probar-webapp.sh`](../scripts/probar-webapp.sh). Los pedidos de prueba se
borran de la hoja antes de abrir la jornada (tarea 6.3).

## Seguridad
- La hoja sigue sin compartirse con "cualquier persona con el enlace". El acceso
  "Cualquier usuario" es al script, no a la hoja.
- La URL `/exec` es pública por naturaleza; toda validación vive en el script.
