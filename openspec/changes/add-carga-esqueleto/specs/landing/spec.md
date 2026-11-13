# Delta para Landing

## ADDED Requirements

### Requirement: Carga sin pantalla vacía
Mientras llega el estado de la jornada, la landing MUST mostrar la portada fija y
esqueletos animados del precio, la entrega, el contador y el formulario, con las mismas
alturas que el contenido real. MUST NOT usar caché ni respuestas anteriores.

#### Scenario: El Apps Script tarda en responder
- **WHEN** el cliente abre la página y el Apps Script aún no responde
- **THEN** ve la portada y los esqueletos animados con "Calentando la parrilla…"
- **AND** al llegar la respuesta, los esqueletos se reemplazan sin que la página salte

#### Scenario: Movimiento reducido
- **WHEN** el sistema del cliente pide reducir el movimiento
- **THEN** los esqueletos se muestran sin animación
