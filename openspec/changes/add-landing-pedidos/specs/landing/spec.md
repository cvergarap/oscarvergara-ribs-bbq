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

### Requirement: Diseño mobile-first
La landing MUST diseñarse primero para celular (ancho base de 360 px) y ampliarse
hacia tableta y computador. Los estilos base son los de celular; los puntos de quiebre
solo agregan ajustes para pantallas más anchas.

#### Scenario: Celular pequeño
- **WHEN** la página se abre en una pantalla de 360 px de ancho
- **THEN** no hay desplazamiento horizontal
- **AND** los textos se leen sin hacer zoom (mínimo 16 px en campos del formulario)
- **AND** los botones y controles táctiles miden al menos 44 × 44 px

#### Scenario: Formulario en celular
- **WHEN** el cliente toca el campo de teléfono
- **THEN** el celular abre el teclado numérico

#### Scenario: Computador
- **WHEN** la página se abre en una pantalla de 1280 px o más
- **THEN** el contenido se centra con un ancho máximo y las fotos se muestran en cuadrícula

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
La landing MUST mostrar cuántos cupos quedan en la jornada, expresados en platos o en
pedidos según `tipo_cupo`.

#### Scenario: Cupo por platos
- **WHEN** `tipo_cupo` es `platos` y quedan 7
- **THEN** se muestra "Quedan 7 platos"
- **AND** el selector de cantidad no permite más de 7 ni más de `max_por_pedido`

#### Scenario: Cupo agotado
- **WHEN** los cupos restantes son 0
- **THEN** el formulario se oculta y se muestra el mensaje de cupo agotado

### Requirement: Opciones leídas de la hoja
La landing MUST construir las opciones de salsa (con su descripción) y de municipio a
partir del estado que entrega el backend, sin listas escritas en el código.

#### Scenario: Nueva salsa
- **WHEN** el negocio agrega una salsa activa en la pestaña "Salsas"
- **THEN** aparece en el formulario en la siguiente carga, sin volver a publicar la web

### Requirement: Modo WhatsApp sin backend
Mientras `VITE_APPS_SCRIPT_URL` no esté configurada, la landing MUST funcionar sin
backend: lee la jornada (fecha de cierre, fecha de entrega, precio, máximo por pedido,
salsas, municipios, pedidos abiertos) de `src/config/jornada.ts`, valida el formulario
en el navegador y abre WhatsApp con el pedido escrito. En este modo MUST NOT mostrar
cupos restantes ni número de pedido, y los datos no salen del navegador salvo hacia
WhatsApp.

#### Scenario: Pedido en modo WhatsApp
- **WHEN** no hay URL de backend y el cliente envía un formulario válido
- **THEN** se abre `https://wa.me/<whatsapp_numero>` con nombre, celular, dirección,
  municipio, platos por salsa y total
- **AND** se muestra un resumen con el aviso "Envía el mensaje para confirmar tu pedido"

#### Scenario: Pedido desde celular
- **WHEN** el cliente envía el pedido desde un celular
- **THEN** se abre la app de WhatsApp de inmediato con `https://wa.me/...`

#### Scenario: Pedido desde computador
- **WHEN** el cliente envía el pedido desde un computador
- **THEN** no se abre nada automáticamente
- **AND** la confirmación ofrece, en este orden: "Abrir WhatsApp Web"
  (`https://web.whatsapp.com/send`, principal), "Tengo WhatsApp instalado en este
  computador" (`whatsapp://send`) y "Copiar pedido"
- **AND** WhatsApp Web es la opción principal porque la app de escritorio depende de cómo
  esté registrada en el sistema y la web no puede saber si se abrió

#### Scenario: Paso al modo completo
- **WHEN** se configura `VITE_APPS_SCRIPT_URL` y se vuelve a publicar
- **THEN** la landing usa el backend para el estado y el registro, sin cambiar la interfaz

#### Scenario: Municipios sin definir
- **WHEN** la lista de municipios de la configuración está vacía
- **THEN** el campo municipio es un texto libre obligatorio

#### Scenario: Campo trampa en modo WhatsApp
- **WHEN** el campo trampa oculto tiene contenido
- **THEN** no se abre WhatsApp

### Requirement: Testimonios y galería ampliables
La landing MUST permitir agregar testimonios y fotos de clientes de forma progresiva.

#### Scenario: Sin contenido todavía
- **WHEN** aún no hay testimonios cargados
- **THEN** la sección no muestra tarjetas vacías ni texto de relleno
