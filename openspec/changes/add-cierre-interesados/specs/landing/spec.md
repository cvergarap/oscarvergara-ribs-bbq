# Delta para Landing

## MODIFIED Requirements

### Requirement: Pedidos cerrados
Con los pedidos cerrados, la landing MUST mostrar un popup de cierre con temática de
carrera, en tono cercano y cómico, con un único mensaje para cualquier motivo de cierre.
MUST NOT mostrar el formulario de pedido.

#### Scenario: El contador llega a cero
- **WHEN** el cliente tiene la página abierta y se cumple `fecha_cierre`
- **THEN** el formulario desaparece y se abre el popup de cierre

#### Scenario: Entra después del cierre
- **WHEN** el cliente abre la página con los pedidos cerrados
- **THEN** ve el popup de cierre; al cerrarlo queda la portada con un aviso breve y un
  botón para volver a abrirlo

## ADDED Requirements

### Requirement: Últimos minutos
Cuando falten 10 minutos o menos para el cierre, los números del contador MUST cambiar
al color de impacto y la etiqueta MUST decir "¡Últimos minutos!". MUST NOT parpadear,
sonar ni tapar contenido.
