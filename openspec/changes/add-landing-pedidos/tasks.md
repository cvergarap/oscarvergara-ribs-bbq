# Tareas

## 1. Preparación
- [ ] 1.1 Crear cuentas del negocio: Google, GitHub, Lovable
- [x] 1.2 Confirmar supuestos de proposal.md (cupo por platos parametrizable, 3 salsas parametrizables, municipios y WhatsApp en la hoja)
- [ ] 1.3 Reunir contenido: logo PNG transparente y 4 fotos del producto sin texto
- [x] 1.4 Configurar Git de forma local según docs/configuracion-git.md y verificar con `git config --local --list`

## 2. Google Sheets
- [x] 2.1 Ajustar encabezados de la pestaña "Pedidos" (10 columnas: se agregan "Salsas" y "Fecha del pedido")
- [x] 2.2 Crear pestaña "Config" con: cupo_maximo, tipo_cupo, max_por_pedido, fecha_apertura, fecha_cierre, fecha_entrega, precio_plato, pedidos_abiertos, whatsapp_numero
- [ ] 2.3 Confirmar que la hoja NO está compartida con "cualquier persona con el enlace"
- [x] 2.4 Crear pestaña "Salsas" (Nombre, Descripción, Activa) con Tradicional, Dulce y Picante
- [x] 2.5 Crear pestaña "Municipios" (Nombre, Activo) y cargar los municipios con cobertura (Pereira, Dosquebradas)

## 3. Apps Script (backend)
- [x] 3.1 Crear el script vinculado a la hoja
- [x] 3.2 Implementar doGet: devuelve cupos restantes, tipo de cupo, fechas, precio, salsas, municipios y WhatsApp
- [x] 3.3 Implementar doPost: validar campos, salsas, municipio, cupo y fecha; asignar N.º; guardar fila
- [x] 3.4 Agregar LockService, saneo contra fórmulas y honeypot
- [x] 3.5 Desplegar como Web App y guardar la URL (2026-11-13)
- [ ] 3.6 Probar con pedidos de prueba: válido ✓, datos inválidos ✓, honeypot ✓, fórmula ✓; faltan cupo lleno y fecha vencida

## 4. Landing (construida en `web/`; Lovable en pausa)
- [x] 4.1 Generar la estructura en modo mobile-first (base 360 px): cabecera con logo, portada, 4 fotos, formulario, testimonios, galería, pie
- [x] 4.2 Aplicar paleta oficial y tipografía
- [x] 4.3 Formulario: nombre, teléfono, dirección, municipio, cantidad, salsa por plato, aceptación de datos
- [ ] 4.4 Contador regresivo y cupos restantes leídos del backend
- [x] 4.5 Estados de cierre: fecha vencida y cupo agotado
- [x] 4.6 Pantalla de confirmación con botón a WhatsApp y resumen del pedido
- [ ] 4.7 Conectar el formulario con la URL del Web App (en pausa junto con Google Sheets)
- [x] 4.8 Modo WhatsApp sin backend: jornada en `src/config/jornada.ts`, envío por wa.me

## 5. Pruebas y seguridad
- [ ] 5.1 Probar en celular (Android y iPhone) y en computador
- [ ] 5.2 Enviar dos pedidos al tiempo con un cupo restante: solo debe entrar uno
- [x] 5.3 Intentar texto que empiece por "=" y verificar que no se ejecuta como fórmula
- [ ] 5.4 Revisar contraste y lectura con la paleta oficial

## 6. Publicación
- [x] 6.1 Publicar en Cloudflare Pages: https://oscarvergara-ribs-bbq.pages.dev (Lovable en pausa)
- [ ] 6.2 Hacer un pedido real de punta a punta
- [ ] 6.3 Borrar pedidos de prueba y abrir la jornada

## 7. Fase 1b (opcional): Google Calendar
- [ ] 7.1 Crear un evento por jornada de entrega con el listado de pedidos
