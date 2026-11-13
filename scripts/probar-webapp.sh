#!/usr/bin/env bash
# Pruebas del Web App de pedidos (tarea 3.6 de add-landing-pedidos).
#
# Uso:
#   ./scripts/probar-webapp.sh "https://script.google.com/macros/s/XXXX/exec" "NombreMunicipio"
#
# Requiere: curl. ATENCIÓN: el caso "válido" registra una fila real en "Pedidos";
# borrarla antes de abrir la jornada. Los datos son ficticios.

set -u
URL="${1:?Falta la URL /exec del Web App}"
MUNICIPIO="${2:?Falta un municipio activo de la pestaña Municipios}"

# Apps Script responde con una redirección 302; curl -L la sigue con GET, que es lo esperado.
post() {
  curl -sS -L -H 'Content-Type: text/plain;charset=utf-8' --data "$1" "$URL"
  echo
}

cuerpo() {
  # $1 nombre, $2 telefono, $3 salsas JSON, $4 honeypot
  printf '{"nombre":"%s","telefono":"%s","direccion":"Calle de prueba 1 # 2-3","municipio":"%s","salsas":%s,"acepta_datos":true,"sitio_web":"%s"}' \
    "$1" "$2" "$MUNICIPIO" "$3" "$4"
}

echo "== 1. Estado de la jornada (GET)"
curl -sS -L "$URL"; echo

echo "== 2. Teléfono inválido -> DATOS_INVALIDOS"
post "$(cuerpo 'Prueba Telefono' '12345' '{"Tradicional":1}' '')"

echo "== 3. Salsa inexistente -> DATOS_INVALIDOS"
post "$(cuerpo 'Prueba Salsa' '3001234567' '{"Mostaza":1}' '')"

echo "== 4. Cantidad mayor que max_por_pedido -> DATOS_INVALIDOS"
post "$(cuerpo 'Prueba Cantidad' '3001234567' '{"Tradicional":99}' '')"

echo "== 5. Honeypot lleno -> ok:true, numero 0, sin fila nueva"
post "$(cuerpo 'Bot' '3001234567' '{"Tradicional":1}' 'http://spam')"

echo "== 6. Intento de fórmula -> se guarda como texto (revisar la hoja)"
post "$(cuerpo '=1+1 Prueba Formula' '3001234567' '{"Tradicional":1}' '')"

echo "== 7. Pedido válido -> ok:true con número"
post "$(cuerpo 'Prueba Valida' '3001234567' '{"Tradicional":2,"Picante":1}' '')"

echo
echo "Pruebas manuales pendientes en la hoja:"
echo " - Cupo lleno: poner cupo_maximo igual a los platos usados y repetir el caso 7."
echo " - Fecha vencida: poner fecha_cierre en el pasado y repetir el caso 7."
echo " - Borrar las filas de prueba al terminar."
