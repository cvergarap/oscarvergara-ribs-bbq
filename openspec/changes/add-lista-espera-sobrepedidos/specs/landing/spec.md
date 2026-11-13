# Delta para Landing

## MODIFIED Requirements

### Requirement: Cupos visibles
La landing MUST NOT mostrar los cupos restantes. El formulario permanece abierto con el
cupo agotado; solo la fecha de cierre o `pedidos_abiertos = NO` lo cierran.

## ADDED Requirements

### Requirement: Popup de cupos agotados
Cuando el backend responde `CUPO_AGOTADO`, la landing MUST mostrar un popup llamativo,
con texto persuasivo, que lamente el agotamiento e invite a seguir las redes sociales
para la próxima apertura. MUST NOT abrir WhatsApp.

#### Scenario: Cliente llega tarde
- **WHEN** el cliente envía un pedido y el cupo ya está agotado
- **THEN** ve el popup con su nombre, botones a las redes configuradas y "Entendido"
- **AND** si autorizó publicidad, el popup confirma que le avisarán de la próxima apertura
