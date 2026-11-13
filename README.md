# RIBS BBQ - Web de pedidos

Landing de pedidos para RIBS BBQ, un emprendimiento de costillas barbecue. El cliente
ve el producto, hace su pedido en un formulario y el pedido queda registrado
automáticamente en Google Sheets.

## Estado

En construcción. Las especificaciones y tareas están en `openspec/`. El backend
(`apps-script/Code.gs`) está escrito y pendiente de desplegar; la web se construye en Lovable.

## Alcance por fases

| Fase | Contenido | Estado |
|------|-----------|--------|
| 1    | Landing, formulario, contador de fecha límite, cupo máximo y registro en Google Sheets | En planeación |
| 1b   | Programación de entregas en Google Calendar | Pendiente |
| 2    | Automatización de WhatsApp para el manejo de pedidos | Pendiente |

## Arquitectura

```
Cliente (navegador)
   |  GET  estado  -> cupos restantes, fecha de cierre, precio
   |  POST pedido  -> datos del formulario
   v
Google Apps Script (Web App)
   v
Google Sheets: pestañas "Pedidos", "Config", "Salsas" y "Municipios"
```

- **Frontend:** Lovable (React + Tailwind), diseño mobile-first.
- **Backend:** Google Apps Script desplegado como Web App.
- **Datos:** Google Sheets. El cupo (por platos o por pedidos), las fechas, las salsas,
  los municipios y el número de WhatsApp se cambian en la hoja, sin tocar el código.
- **Pago:** se confirma por WhatsApp. La web no muestra ni recibe datos de pago.

El detalle está en `openspec/changes/add-landing-pedidos/design.md`.

## Estructura del repositorio

```
openspec/        Especificaciones, diseño técnico y tareas (OpenSpec)
apps-script/     Código del backend en Google Apps Script
assets/          Logo y recursos de marca
docs/            Guías y decisiones del proyecto
scripts/         Utilidades de prueba
```

El frontend vive en un repositorio aparte de la cuenta `cvergarap`, creado y
sincronizado por Lovable, y se publica en Cloudflare Pages.

## Guías de despliegue

- [Backend en Google Apps Script](docs/despliegue-apps-script.md)
- [Frontend en Cloudflare Pages](docs/despliegue-cloudflare.md)
- [Prompts para Lovable](docs/lovable-prompt.md)

## Cómo trabajamos

1. Todo cambio empieza como una propuesta en `openspec/changes/<nombre-del-cambio>/`.
2. La propuesta incluye `proposal.md`, `design.md`, `tasks.md` y las especificaciones.
3. Se implementa siguiendo `tasks.md` y se marca cada tarea al terminarla.

## Configuración inicial del repositorio

Antes del primer commit, cada persona debe configurar Git de forma local, nunca global.
Los pasos están en [`docs/configuracion-git.md`](docs/configuracion-git.md).

## Reglas de seguridad

Este repositorio es público. Por eso:

- No se suben datos de clientes: nombres, teléfonos, direcciones ni exportaciones de la hoja de pedidos.
- No se suben contraseñas, tokens ni llaves.
- La hoja de Google no se comparte con "cualquier persona con el enlace".
- Toda validación de pedidos se hace en el servidor (Apps Script), no solo en la página.

## Licencia y marca

Ver el archivo [`LICENSE`](LICENSE). El nombre RIBS BBQ, el logo, las fotografías y
los textos comerciales pertenecen al negocio y no están cubiertos por la licencia del código.
