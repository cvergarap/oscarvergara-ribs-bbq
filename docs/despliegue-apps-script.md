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
3. Resultado: pestañas "Config", "Salsas" y "Municipios" creadas, y en "Pedidos" se
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

Pestaña **Salsas**: escribir la descripción de cada una. Pestaña **Municipios**: un
municipio por fila con Activo = `SI`. Sin municipios o sin salsas activas, el script no
acepta pedidos.

Para revisar: elegir `probarEstado` → **Ejecutar** → ver el resultado en el registro.

## 4. Publicar como Web App
1. **Implementar → Nueva implementación** → tipo **Aplicación web**.
2. Descripción: `v1`. Ejecutar como: **Yo**. Quién tiene acceso: **Cualquier usuario**.
3. **Implementar** y copiar la URL que termina en `/exec`. Esa es `VITE_APPS_SCRIPT_URL`.
4. Abrir la URL en el navegador: debe mostrar el JSON del estado.

## 5. Actualizar el código sin cambiar la URL
Una **nueva** implementación genera **otra** URL y rompe la web. Para actualizar:
**Implementar → Administrar implementaciones → lápiz (editar) → Versión: Nueva versión →
Implementar**. La URL `/exec` se mantiene.

## 6. Probar
Ver [`scripts/probar-webapp.sh`](../scripts/probar-webapp.sh). Los pedidos de prueba se
borran de la hoja antes de abrir la jornada (tarea 6.3).

## Seguridad
- La hoja sigue sin compartirse con "cualquier persona con el enlace". El acceso
  "Cualquier usuario" es al script, no a la hoja.
- La URL `/exec` es pública por naturaleza; toda validación vive en el script.
