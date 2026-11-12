# Diseño técnico

## Arquitectura
```
Cliente (navegador)
   |  GET  estado  -> cupos restantes, fecha de cierre, precio
   |  POST pedido  -> datos del formulario
   v
Google Apps Script (Web App, se ejecuta como el dueño de la hoja)
   v
Google Sheets: pestaña "Pedidos" + pestaña "Config"
```

- Frontend: Lovable (React + Tailwind), publicado desde Lovable.
  Vercel Hobby no admite uso comercial, por eso no se usa en esta fase.
- Backend: un solo Apps Script desplegado como Web App.
- Configuración: pestaña "Config" (clave / valor). El negocio cambia cupo y fechas
  sin tocar código.

## Decisiones
1. **La hoja nunca se comparte públicamente.** Solo el script la lee y escribe.
   El script se despliega con "Ejecutar como: yo" y "Acceso: cualquier usuario".
2. **El cupo y la fecha se validan en el servidor**, no solo en la página. La página
   muestra el contador, pero quien decide si el pedido entra es el script.
3. **LockService** al escribir, para que dos pedidos simultáneos no superen el cupo.
4. **N.º consecutivo** lo asigna el script, no el cliente.
5. **Sin secretos en el frontend.** La URL del Web App es pública por naturaleza;
   por eso toda validación vive en el script.

## Seguridad
- Validar tipo, longitud y formato de cada campo en el script.
- Teléfono: 10 dígitos, empieza por 3. Cantidad: entero entre 1 y `max_por_pedido`.
- Neutralizar inyección de fórmulas: si un texto empieza por `=`, `+`, `-` o `@`,
  anteponer `'` antes de guardar.
- Campo trampa (honeypot) oculto: si llega con contenido, descartar en silencio.
- El GET de estado devuelve solo cupos restantes, fechas y precio. Nunca datos de clientes.
- Aviso de tratamiento de datos (Ley 1581 de 2012) con casilla de aceptación obligatoria.

## Marca
| Uso                  | Color     |
|----------------------|-----------|
| Fondo principal      | #2F1C15   |
| Color de impacto     | #EF7224   |
| Títulos y texto claro| #FDEED6   |
| Fondos secundarios   | #F3D8B7   |
| Promociones          | #B7502B   |
| Apoyo                | #9A4B24, #733E21, #E1B78A |
