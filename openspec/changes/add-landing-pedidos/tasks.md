# Tareas

## 1. Preparación
- [ ] 1.1 Crear cuentas del negocio: Google, GitHub, Lovable
- [ ] 1.2 Confirmar supuestos de proposal.md (cupo por pedidos, receta única, municipios, WhatsApp)
- [ ] 1.3 Reunir contenido: logo PNG transparente y 4 fotos del producto sin texto

## 2. Google Sheets
- [ ] 2.1 Verificar encabezados de la pestaña "Pedidos" (8 columnas, en el orden acordado)
- [ ] 2.2 Crear pestaña "Config" con: cupo_maximo, fecha_cierre, fecha_entrega, precio_plato, max_por_pedido, pedidos_abiertos
- [ ] 2.3 Confirmar que la hoja NO está compartida con "cualquier persona con el enlace"

## 3. Apps Script (backend)
- [ ] 3.1 Crear el script vinculado a la hoja
- [ ] 3.2 Implementar doGet: devuelve cupos restantes, fecha de cierre, fecha de entrega, precio
- [ ] 3.3 Implementar doPost: validar campos, cupo y fecha; asignar N.º; guardar fila
- [ ] 3.4 Agregar LockService, saneo contra fórmulas y honeypot
- [ ] 3.5 Desplegar como Web App y guardar la URL
- [ ] 3.6 Probar con pedidos de prueba: válido, cupo lleno, fecha vencida, datos inválidos

## 4. Landing en Lovable
- [ ] 4.1 Generar la estructura: cabecera con logo, portada, 4 fotos, formulario, testimonios, galería, pie
- [ ] 4.2 Aplicar paleta oficial y tipografía
- [ ] 4.3 Formulario: nombre, teléfono, dirección, municipio, cantidad, aceptación de datos
- [ ] 4.4 Contador regresivo y cupos restantes leídos del backend
- [ ] 4.5 Estados de cierre: fecha vencida y cupo agotado
- [ ] 4.6 Pantalla de confirmación con botón a WhatsApp y resumen del pedido
- [ ] 4.7 Conectar el formulario con la URL del Web App

## 5. Pruebas y seguridad
- [ ] 5.1 Probar en celular (Android y iPhone) y en computador
- [ ] 5.2 Enviar dos pedidos al tiempo con un cupo restante: solo debe entrar uno
- [ ] 5.3 Intentar texto que empiece por "=" y verificar que no se ejecuta como fórmula
- [ ] 5.4 Revisar contraste y lectura con la paleta oficial

## 6. Publicación
- [ ] 6.1 Publicar desde Lovable
- [ ] 6.2 Hacer un pedido real de punta a punta
- [ ] 6.3 Borrar pedidos de prueba y abrir la jornada

## 7. Fase 1b (opcional): Google Calendar
- [ ] 7.1 Crear un evento por jornada de entrega con el listado de pedidos
