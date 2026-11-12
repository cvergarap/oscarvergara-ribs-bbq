# Delta para Pedidos

## ADDED Requirements

### Requirement: Datos del pedido
El formulario MUST pedir: nombre completo, teléfono de contacto, dirección de entrega,
municipio y cantidad de platos.

#### Scenario: Pedido válido
- **WHEN** el cliente completa todos los campos y acepta el tratamiento de datos
- **THEN** el pedido se envía al backend

#### Scenario: Teléfono inválido
- **WHEN** el teléfono no tiene 10 dígitos o no empieza por 3
- **THEN** se muestra el error junto al campo y el pedido no se envía

### Requirement: Registro en Google Sheets
El sistema MUST guardar cada pedido aceptado como una fila nueva en la pestaña "Pedidos".

#### Scenario: Fila creada
- **WHEN** el backend acepta un pedido
- **THEN** agrega una fila con N.º consecutivo, nombre, teléfono, dirección, municipio y cantidad
- **AND** "Estado del pago" queda en "Pendiente"
- **AND** "¿Envió pantallazo?" queda en "No"

### Requirement: Cupo máximo parametrizable
El sistema MUST rechazar pedidos cuando la jornada alcance `cupo_maximo` (valor inicial: 20).

#### Scenario: Último cupo
- **WHEN** hay 19 pedidos registrados y llega uno nuevo
- **THEN** el pedido se acepta y los cupos restantes pasan a 0

#### Scenario: Cupo lleno
- **WHEN** hay 20 pedidos registrados y llega uno nuevo
- **THEN** el pedido se rechaza con el mensaje de cupo agotado
- **AND** no se agrega ninguna fila

#### Scenario: Pedidos simultáneos
- **WHEN** llegan dos pedidos al mismo tiempo y queda un solo cupo
- **THEN** solo uno se registra

#### Scenario: Cambio de cupo
- **WHEN** el negocio cambia `cupo_maximo` en la pestaña "Config"
- **THEN** el nuevo límite aplica de inmediato

### Requirement: Fecha límite validada en el servidor
El sistema MUST rechazar pedidos recibidos después de `fecha_cierre`, aunque la página
siga abierta en el navegador del cliente.

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
- **THEN** recibe solo cupos restantes, fechas y precio

### Requirement: Confirmación por WhatsApp
Tras registrar el pedido, el sistema MUST ofrecer un enlace a WhatsApp con el resumen
del pedido. La web MUST NOT mostrar datos de pago.

#### Scenario: Pedido registrado
- **WHEN** el pedido se guarda correctamente
- **THEN** se muestra el número de pedido y un botón para continuar en WhatsApp
