# Delta para Pedidos

## MODIFIED Requirements

### Requirement: Cupo máximo parametrizable
El sistema MUST aceptar pedidos solo mientras no se supere `cupo_maximo` en la jornada.
Un pedido que llega con el cupo ya agotado MUST registrarse con "Estado del pago" =
`Cancelado por Sobrepedidos`, sin N.º, y MUST NOT contar para el cupo.

#### Scenario: Pedido con cupo agotado
- **WHEN** los cupos restantes son 0 y llega un pedido válido
- **THEN** se agrega una fila con los datos del cliente, sin N.º y con
  "Estado del pago" = `Cancelado por Sobrepedidos`
- **AND** la respuesta es `{ ok: false, codigo: "CUPO_AGOTADO", registrado: true }`

#### Scenario: Cupo insuficiente
- **WHEN** quedan 2 platos y llega un pedido de 3
- **THEN** se rechaza indicando cuántos platos quedan y no se agrega ninguna fila

#### Scenario: Sobrepedidos fuera del conteo
- **WHEN** hay filas con `Cancelado por Sobrepedidos`
- **THEN** no suman al cupo usado ni reciben número consecutivo

## ADDED Requirements

### Requirement: Autorización de publicidad
El formulario MUST ofrecer una casilla opcional, desmarcada por defecto, para autorizar
avisos de aperturas y promociones. El sistema MUST guardar la respuesta en
`¿Acepta publicidad?` (`Sí`/`No`) cuando esa columna exista.

#### Scenario: Cliente no autoriza
- **WHEN** el cliente no marca la casilla
- **THEN** la fila queda con `¿Acepta publicidad?` = `No` y no se usa para publicidad
