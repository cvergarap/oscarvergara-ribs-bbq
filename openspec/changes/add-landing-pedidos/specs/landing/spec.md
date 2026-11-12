# Delta para Landing

## ADDED Requirements

### Requirement: Estructura de la página
La landing MUST mostrar, en este orden: cabecera con el logo, portada, cuatro fotos
del producto, formulario de pedido, testimonios y galería de clientes.

#### Scenario: Visita desde celular
- **WHEN** un visitante abre la página en un celular
- **THEN** ve el logo y la portada sin desplazarse horizontalmente
- **AND** el formulario queda a mitad de página, después de las fotos

#### Scenario: Acceso directo al formulario
- **WHEN** el visitante toca el botón "Hacer mi pedido"
- **THEN** la página se desplaza hasta el formulario

### Requirement: Identidad de marca
La landing MUST usar la paleta oficial de RIBS BBQ: fondo #2F1C15, color de impacto
#EF7224 y texto claro #FDEED6.

#### Scenario: Colores aplicados
- **WHEN** se carga la página
- **THEN** el fondo principal es #2F1C15 y los botones de acción usan #EF7224

### Requirement: Contador de fecha límite
La landing MUST mostrar un contador regresivo hasta `fecha_cierre`, valor leído de la
configuración y no escrito en el código.

#### Scenario: Pedidos abiertos
- **WHEN** la fecha actual es anterior a `fecha_cierre`
- **THEN** se muestran días, horas, minutos y segundos restantes

#### Scenario: Fecha vencida
- **WHEN** la fecha actual es igual o posterior a `fecha_cierre`
- **THEN** el formulario se oculta
- **AND** se muestra el mensaje de pedidos cerrados hasta la próxima apertura

#### Scenario: Cambio de fecha
- **WHEN** el negocio cambia `fecha_cierre` en la pestaña "Config"
- **THEN** el contador usa la nueva fecha en la siguiente carga, sin volver a publicar la web

### Requirement: Cupos visibles
La landing MUST mostrar cuántos cupos quedan en la jornada.

#### Scenario: Cupo agotado
- **WHEN** los cupos restantes son 0
- **THEN** el formulario se oculta y se muestra el mensaje de cupo agotado

### Requirement: Testimonios y galería ampliables
La landing MUST permitir agregar testimonios y fotos de clientes de forma progresiva.

#### Scenario: Sin contenido todavía
- **WHEN** aún no hay testimonios cargados
- **THEN** la sección no muestra tarjetas vacías ni texto de relleno
