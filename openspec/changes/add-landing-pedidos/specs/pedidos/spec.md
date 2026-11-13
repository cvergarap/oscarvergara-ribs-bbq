# Delta para Pedidos

## ADDED Requirements

### Requirement: Datos del pedido
El formulario MUST pedir: nombre completo, teléfono de contacto, dirección de entrega,
municipio, cantidad de platos y la salsa de cada plato.

#### Scenario: Pedido válido
- **WHEN** el cliente completa todos los campos y acepta el tratamiento de datos
- **THEN** el pedido se envía al backend

#### Scenario: Teléfono inválido
- **WHEN** el teléfono no tiene 10 dígitos o no empieza por 3
- **THEN** se muestra el error junto al campo y el pedido no se envía

#### Scenario: Cantidad fuera de rango
- **WHEN** la cantidad de platos es menor que 1 o mayor que `max_por_pedido`
- **THEN** el pedido se rechaza con el mensaje de cantidad inválida

### Requirement: Salsas parametrizables por plato
El sistema MUST ofrecer solo las salsas activas de la pestaña "Salsas", con su
descripción, y MUST permitir repartir los platos del pedido entre ellas.

#### Scenario: Reparto de salsas
- **WHEN** el cliente pide 3 platos: 2 con salsa Tradicional y 1 con Picante
- **THEN** la columna "Salsas" guarda `Tradicional x2, Picante x1`
- **AND** "Cantidad de platos" guarda 3

#### Scenario: Salsa desactivada
- **WHEN** el negocio marca una salsa con Activa = `NO`
- **THEN** deja de ofrecerse en la siguiente carga
- **AND** el servidor rechaza pedidos que la incluyan

### Requirement: Municipios con cobertura
El sistema MUST aceptar solo municipios activos de la pestaña "Municipios".

#### Scenario: Municipio sin cobertura
- **WHEN** llega un pedido con un municipio que no está activo en la lista
- **THEN** el pedido se rechaza con el mensaje de municipio sin cobertura

#### Scenario: Lista vacía
- **WHEN** no hay municipios activos
- **THEN** el estado de la jornada indica pedidos cerrados y no se aceptan pedidos

### Requirement: Registro en Google Sheets
El sistema MUST guardar cada pedido aceptado como una fila nueva en la pestaña "Pedidos".

#### Scenario: Fila creada
- **WHEN** el backend acepta un pedido
- **THEN** agrega una fila con N.º consecutivo, nombre, teléfono, dirección, municipio,
  cantidad, salsas y fecha del pedido
- **AND** "Estado del pago" queda en "Pendiente"
- **AND** "¿Envió pantallazo?" queda en "No"

### Requirement: Cupo máximo parametrizable
El sistema MUST rechazar pedidos que superen `cupo_maximo` (valor inicial: 20) en la
jornada. `tipo_cupo` define si el cupo cuenta platos (valor inicial) o pedidos. La
jornada incluye los pedidos con fecha igual o posterior a `fecha_apertura`.

#### Scenario: Último cupo por platos
- **WHEN** `tipo_cupo` es `platos`, hay 18 platos registrados y llega un pedido de 2
- **THEN** el pedido se acepta y los cupos restantes pasan a 0

#### Scenario: Pedido mayor que el cupo restante
- **WHEN** `tipo_cupo` es `platos`, quedan 2 cupos y llega un pedido de 3 platos
- **THEN** el pedido se rechaza indicando que solo quedan 2 platos
- **AND** no se agrega ninguna fila

#### Scenario: Cupo por pedidos
- **WHEN** `tipo_cupo` es `pedidos`, hay 19 pedidos registrados y llega uno de 4 platos
- **THEN** el pedido se acepta y los cupos restantes pasan a 0

#### Scenario: Cupo lleno
- **WHEN** los cupos restantes son 0 y llega un pedido nuevo
- **THEN** el pedido se rechaza con el mensaje de cupo agotado
- **AND** no se agrega ninguna fila

#### Scenario: Pedidos simultáneos
- **WHEN** llegan dos pedidos al mismo tiempo y el cupo solo alcanza para uno
- **THEN** solo uno se registra

#### Scenario: Cambio de cupo o de modo
- **WHEN** el negocio cambia `cupo_maximo` o `tipo_cupo` en la pestaña "Config"
- **THEN** el nuevo límite aplica de inmediato

### Requirement: Fecha límite validada en el servidor
El sistema MUST rechazar pedidos recibidos después de `fecha_cierre` o con
`pedidos_abiertos` en `NO`, aunque la página siga abierta en el navegador del cliente.

#### Scenario: Envío tardío
- **WHEN** un pedido llega después de `fecha_cierre`
- **THEN** se rechaza con el mensaje de pedidos cerrados

### Requirement: Protección de datos y de la hoja
El sistema MUST validar y sanear todo dato recibido y MUST NOT exponer datos de clientes.

#### Scenario: Intento de fórmula
- **WHEN** un campo de texto empieza por "=", "+", "-" o "@"
- **THEN** se guarda como texto y no se ejecuta como fórmula

#### Scenario: Envío automatizado
- **WHEN** el campo trampa oculto llega con contenido
- **THEN** el pedido se descarta sin registrar nada

#### Scenario: Consulta de estado
- **WHEN** la página consulta el estado de la jornada
- **THEN** recibe solo cupos restantes, tipo de cupo, fechas, precio, máximo por pedido,
  salsas activas, municipios activos y el número de WhatsApp del negocio

### Requirement: Confirmación por WhatsApp
Tras registrar el pedido, el sistema MUST ofrecer un enlace a WhatsApp con el resumen
del pedido, usando `whatsapp_numero` de la pestaña "Config". La web MUST NOT mostrar
datos de pago.

#### Scenario: Pedido registrado
- **WHEN** el pedido se guarda correctamente
- **THEN** se muestra el número de pedido y un botón para continuar en WhatsApp
