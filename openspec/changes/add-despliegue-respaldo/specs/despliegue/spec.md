# Delta para Despliegue

## ADDED Requirements

### Requirement: Publicación en dos proveedores
Cada cambio en `main` del repositorio del frontend MUST publicarse en el proveedor
primario y en el de respaldo, con el mismo contenido.

#### Scenario: Push a main
- **WHEN** se hace push a `main`
- **THEN** el sitio se actualiza en Cloudflare Pages y en Netlify

#### Scenario: Build fallido
- **WHEN** el build falla
- **THEN** ningún proveedor publica la versión rota y sigue en línea la anterior

### Requirement: Sitio portable
El frontend MUST ser un sitio estático sin dependencias de funciones propias de un
proveedor, y MUST leer la URL del backend de `VITE_APPS_SCRIPT_URL`.

#### Scenario: Mismo build en otro proveedor
- **WHEN** se publica la carpeta `dist/` en cualquiera de los dos proveedores
- **THEN** la página carga, consulta el estado y registra pedidos igual

### Requirement: Conmutación sin cambiar el enlace
El negocio MUST poder pasar del proveedor primario al de respaldo cambiando solo el DNS
del dominio propio.

#### Scenario: Suspensión del primario
- **WHEN** el proveedor primario suspende o pierde el sitio
- **THEN** tras cambiar el CNAME de `www`, el dominio sirve el respaldo en menos de 10 minutos
- **AND** los enlaces ya compartidos con clientes siguen funcionando

### Requirement: Uso comercial permitido
El sitio MUST publicarse solo en planes cuyos términos permitan uso comercial.

#### Scenario: Elección de plan
- **WHEN** se evalúa un proveedor o plan
- **THEN** se descarta si sus términos prohíben uso comercial (por ejemplo, Vercel Hobby)

### Requirement: Secretos fuera del repositorio
Los tokens de despliegue MUST guardarse en GitHub Secrets o en el panel del proveedor,
nunca en el repositorio.
