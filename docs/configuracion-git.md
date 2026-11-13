# Configuración inicial de Git

Regla del proyecto: esta configuración se hace una sola vez, justo después de clonar
y antes del primer commit. Siempre local, nunca con `--global`.

## Pasos

```bash
# 1. Remoto con el usuario dueño del proyecto
git remote set-url origin https://USUARIO@github.com/USUARIO/REPOSITORIO.git

# 2. Identidad local
git config user.name "Nombre"
git config user.email "correo-de-esa-cuenta@ejemplo.com"

# 3. Credenciales separadas por repositorio
git config credential.useHttpPath true

# 4. Verificación
git config --local --list
```

Para este repositorio, el paso 1 es:

```bash
git remote set-url origin https://cvergarap@github.com/cvergarap/oscarvergara-ribs-bbq.git
```

## Criterio de verificación

El resultado del paso 4 debe incluir estas cuatro líneas. Si falta alguna, no se hace
el primer commit.

```
remote.origin.url=https://USUARIO@github.com/USUARIO/REPOSITORIO.git
user.name=...
user.email=...
credential.usehttppath=true
```

## Por qué

- **Usuario en el remoto:** Git pide las credenciales de esa cuenta y no reutiliza las de otra.
- **Identidad local:** los commits quedan con el nombre y correo correctos del proyecto.
- **Credenciales por repositorio:** evita errores 403 por mezclar cuentas.
