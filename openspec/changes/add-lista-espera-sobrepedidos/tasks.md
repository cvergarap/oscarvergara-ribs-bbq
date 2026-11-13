# Tareas

## 1. Apps Script
- [x] 1.1 Registrar pedidos con cupo agotado como `Cancelado por Sobrepedidos`, sin N.º
- [x] 1.2 Excluir esas filas del cupo y del consecutivo
- [x] 1.3 Cupo agotado ya no cierra el formulario (solo fecha y `pedidos_abiertos`)
- [x] 1.4 Columna opcional `¿Acepta publicidad?` y claves opcionales de redes en Config
- [x] 1.5 `configurarHoja` agrega las claves y la columna que falten, sin borrar datos
- [ ] 1.6 Publicar nueva versión del Web App (lo hace el dueño)

## 2. Web
- [x] 2.1 Quitar "Quedan N platos" de la portada y el tope por cupo del selector
- [x] 2.2 Casilla opcional de publicidad y aviso de datos actualizado
- [x] 2.3 Popup de cupos agotados con redes sociales

## 3. Pruebas
- [ ] 3.1 Con `cupo_maximo` igual a lo usado, enviar un pedido: fila cancelada + popup
- [ ] 3.2 Verificar que la fila cancelada no cambia el cupo ni el N.º siguiente
