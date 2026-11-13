# Interesados

## ADDED Requirements

### Requirement: Registro de interesados
Desde el popup de cierre, el cliente MAY dejar nombre y celular. El backend MUST guardar
la fila en la pestaña "Interesados" (Fecha, Nombre, Teléfono, Acepta publicidad) y MUST
NOT abrir WhatsApp ni afectar el cupo.

#### Scenario: Cliente se anota
- **WHEN** envía nombre, celular válido y la autorización marcada
- **THEN** se registra la fila y el popup confirma "¡Listo, {nombre}!"

#### Scenario: Sin autorización
- **WHEN** intenta enviar sin marcar la autorización
- **THEN** la web y el servidor rechazan el envío y piden marcarla

### Requirement: Validación en el servidor
El backend MUST validar formato de nombre y celular, honeypot, saneo contra inyección de
fórmulas y usar LockService, igual que en los pedidos.
