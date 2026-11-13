# Tareas

## 1. Decisiones
- [x] 1.0 Elegir proveedor primario: Cloudflare Pages
- [x] 1.1 Confirmar cuenta de GitHub (`cvergarap`) y nivel de CD (nivel 1)
- [ ] 1.2 Comprar el dominio y delegar su DNS a Cloudflare (pendiente)

## 2. Hoy: salida a producción (nivel 1)
- [ ] 2.0 Crear la cuenta de Lovable (la crea el dueño)
- [ ] 2.1 Conectar Lovable con la cuenta de GitHub `cvergarap` (crea el repositorio del frontend, privado)
- [ ] 2.2 Publicar desde Lovable como respaldo de emergencia
- [ ] 2.3 Crear proyecto en Cloudflare Pages desde el repositorio: `npm run build`, `dist`, `VITE_APPS_SCRIPT_URL`
- [ ] 2.4 Crear sitio en Netlify desde el mismo repositorio, con la misma configuración
- [ ] 2.5 Agregar el dominio como dominio personalizado en ambos; `www` apuntando a Cloudflare Pages con TTL 60 s
- [ ] 2.6 Hacer un pedido de prueba por cada URL (pages.dev, netlify.app, lovable.app y dominio)

## 3. Respaldo verificado
- [ ] 3.1 Ensayar el runbook de conmutación de design.md: pasar a Netlify y volver
- [ ] 3.2 Anotar el tiempo real de conmutación

## 4. CI/CD (nivel 2)
- [ ] 4.1 Agregar `.nvmrc` y `public/_redirects` al frontend
- [ ] 4.2 Crear `.github/workflows/deploy.yml` según design.md
- [ ] 4.3 Cargar secretos y la variable en GitHub
- [ ] 4.4 Desactivar los builds automáticos en los paneles de Cloudflare y Netlify
- [ ] 4.5 Probar un push con build roto y verificar que no se publica
