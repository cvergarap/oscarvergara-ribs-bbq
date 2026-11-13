/**
 * RIBS BBQ - Backend de pedidos (Google Apps Script, Web App).
 *
 * Copyright (c) 2026 Oscar Vergara. Todos los derechos reservados. Ver LICENSE.
 *
 * Despliegue: script vinculado a la hoja de pedidos.
 *   Implementar > Nueva implementación > Aplicación web
 *   Ejecutar como: Yo   |   Quién tiene acceso: Cualquier usuario
 *
 * GET  -> estado de la jornada (sin datos de clientes).
 * POST -> registro de un pedido. Cuerpo JSON enviado como text/plain:
 *   { nombre, telefono, direccion, municipio, salsas: { "Tradicional": 2 },
 *     acepta_datos: true, sitio_web: "" }
 *
 * Especificación: openspec/changes/add-landing-pedidos/specs/pedidos/spec.md
 */

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

var ZONA_HORARIA = 'America/Bogota';

var HOJAS = {
  PEDIDOS: 'Pedidos',
  CONFIG: 'Config',
  SALSAS: 'Salsas',
  MUNICIPIOS: 'Municipios'
};

// Encabezados de "Pedidos". El script ubica las columnas por nombre, no por posición.
var COL = {
  NUMERO: 'N.º',
  NOMBRE: 'Nombre completo',
  TELEFONO: 'Teléfono de contacto',
  DIRECCION: 'Dirección de entrega',
  MUNICIPIO: 'Municipio',
  CANTIDAD: 'Cantidad de platos',
  SALSAS: 'Salsas',
  ESTADO_PAGO: 'Estado del pago',
  PANTALLAZO: '¿Envió pantallazo?',
  FECHA: 'Fecha del pedido'
};

var COLUMNAS_PEDIDOS = [
  COL.NUMERO, COL.NOMBRE, COL.TELEFONO, COL.DIRECCION, COL.MUNICIPIO,
  COL.CANTIDAD, COL.SALSAS, COL.ESTADO_PAGO, COL.PANTALLAZO, COL.FECHA
];

// Valores por defecto si una clave de "Config" falta o está vacía.
var CONFIG_DEFECTO = {
  cupo_maximo: 20,
  tipo_cupo: 'platos',
  max_por_pedido: 5,
  fecha_apertura: '',
  fecha_cierre: '',
  fecha_entrega: '',
  hora_entrega: '',
  precio_plato: 30000,
  pedidos_abiertos: 'NO',
  whatsapp_numero: ''
};

var LIMITES = {
  NOMBRE: { min: 3, max: 80 },
  DIRECCION: { min: 5, max: 150 },
  CUERPO_MAX: 5000
};

var MENSAJES = {
  CERRADO: 'Los pedidos están cerrados. Te esperamos en la próxima apertura.',
  CUPO_AGOTADO: 'Se agotaron los cupos de esta jornada. Te esperamos en la próxima apertura.',
  CUPO_INSUFICIENTE: 'No hay cupo para esa cantidad. Platos disponibles: ',
  DATOS_INVALIDOS: 'Revisa los datos del formulario.',
  OCUPADO: 'Estamos recibiendo muchos pedidos. Intenta de nuevo en unos segundos.',
  ERROR: 'No pudimos registrar el pedido. Intenta de nuevo o escríbenos por WhatsApp.'
};

// ---------------------------------------------------------------------------
// Puntos de entrada
// ---------------------------------------------------------------------------

function doGet() {
  try {
    return responder_(construirEstado_());
  } catch (err) {
    console.error('doGet: ' + err);
    return responder_({ ok: false, codigo: 'ERROR', mensaje: MENSAJES.ERROR });
  }
}

function doPost(e) {
  var datos;
  try {
    datos = leerCuerpo_(e);
  } catch (err) {
    return responder_(error_('DATOS_INVALIDOS', MENSAJES.DATOS_INVALIDOS));
  }

  // Honeypot: un bot llenó el campo oculto. Se responde como si todo saliera bien
  // para no darle pistas, pero no se guarda nada.
  if (datos.sitio_web) {
    return responder_({ ok: true, numero: 0 });
  }

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) {
    return responder_(error_('OCUPADO', MENSAJES.OCUPADO));
  }

  try {
    return responder_(registrarPedido_(datos));
  } catch (err) {
    console.error('doPost: ' + err);
    return responder_(error_('ERROR', MENSAJES.ERROR));
  } finally {
    lock.releaseLock();
  }
}

// ---------------------------------------------------------------------------
// Estado de la jornada
// ---------------------------------------------------------------------------

function construirEstado_() {
  var ctx = cargarContexto_();
  return {
    ok: true,
    abierto: ctx.abierto,
    motivo_cierre: ctx.motivoCierre,
    tipo_cupo: ctx.config.tipo_cupo,
    cupo_maximo: ctx.config.cupo_maximo,
    cupos_restantes: ctx.restantes,
    max_por_pedido: ctx.config.max_por_pedido,
    precio_plato: ctx.config.precio_plato,
    fecha_cierre: isoONulo_(ctx.config.fecha_cierre),
    fecha_entrega: textoFecha_(ctx.config.fecha_entrega),
    hora_entrega: ctx.config.hora_entrega,
    salsas: ctx.salsas,
    municipios: ctx.municipios.map(function (m) { return m.nombre; }),
    whatsapp_numero: ctx.config.whatsapp_numero,
    ahora: new Date().toISOString()
  };
}

/** Lee configuración, listas y uso del cupo. Solo datos agregados, nunca de clientes. */
function cargarContexto_() {
  var libro = SpreadsheetApp.getActiveSpreadsheet();
  var config = leerConfig_(libro);
  var salsas = leerLista_(libro, HOJAS.SALSAS, 'Activa', ['Nombre', 'Descripción']);
  var municipios = leerLista_(libro, HOJAS.MUNICIPIOS, 'Activo', ['Nombre']);
  var hoja = obtenerHojaPedidos_(libro);
  var uso = calcularUso_(hoja, config);

  var restantes = Math.max(0, config.cupo_maximo - uso);
  var ahora = new Date();
  var motivo = null;

  if (config.pedidos_abiertos !== 'SI') motivo = 'CERRADO';
  else if (config.fecha_apertura && ahora < config.fecha_apertura) motivo = 'NO_INICIADO';
  else if (!config.fecha_cierre || ahora >= config.fecha_cierre) motivo = 'FECHA_VENCIDA';
  else if (restantes <= 0) motivo = 'CUPO_AGOTADO';
  else if (!salsas.length || !municipios.length) motivo = 'SIN_CONFIGURAR';

  return {
    libro: libro,
    hoja: hoja,
    config: config,
    salsas: salsas.map(function (s) {
      return { nombre: s.nombre, descripcion: s['descripción'] || '' };
    }),
    municipios: municipios,
    restantes: restantes,
    abierto: motivo === null,
    motivoCierre: motivo
  };
}

/** Platos o pedidos ya usados en la jornada (desde fecha_apertura). */
function calcularUso_(hoja, config) {
  var ultima = hoja.getLastRow();
  if (ultima < 2) return 0;

  var mapa = mapaColumnas_(hoja);
  var filas = hoja.getRange(2, 1, ultima - 1, hoja.getLastColumn()).getValues();
  var iFecha = mapa[COL.FECHA];
  var iCant = mapa[COL.CANTIDAD];
  var iNum = mapa[COL.NUMERO];
  var uso = 0;

  filas.forEach(function (fila) {
    // Filas vacías o borradas a medias no cuentan.
    if (fila[iNum] === '' && fila[iCant] === '') return;
    if (config.fecha_apertura) {
      var f = fila[iFecha];
      if (!(f instanceof Date) || f < config.fecha_apertura) return;
    }
    uso += config.tipo_cupo === 'pedidos' ? 1 : (parseInt(fila[iCant], 10) || 0);
  });
  return uso;
}

// ---------------------------------------------------------------------------
// Registro del pedido (se ejecuta dentro del LockService)
// ---------------------------------------------------------------------------

function registrarPedido_(datos) {
  var ctx = cargarContexto_();

  if (!ctx.abierto) {
    if (ctx.motivoCierre === 'CUPO_AGOTADO') {
      return error_('CUPO_AGOTADO', MENSAJES.CUPO_AGOTADO);
    }
    return error_('CERRADO', MENSAJES.CERRADO);
  }

  var v = validarPedido_(datos, ctx);
  if (v.errores) {
    return { ok: false, codigo: 'DATOS_INVALIDOS', mensaje: MENSAJES.DATOS_INVALIDOS, errores: v.errores };
  }

  var consumo = ctx.config.tipo_cupo === 'pedidos' ? 1 : v.cantidad;
  if (consumo > ctx.restantes) {
    return {
      ok: false,
      codigo: 'CUPO_INSUFICIENTE',
      mensaje: MENSAJES.CUPO_INSUFICIENTE + ctx.restantes + '.',
      cupos_restantes: ctx.restantes
    };
  }

  var numero = siguienteNumero_(ctx.hoja);
  var valores = {};
  valores[COL.NUMERO] = numero;
  valores[COL.NOMBRE] = v.nombre;
  valores[COL.TELEFONO] = v.telefono;
  valores[COL.DIRECCION] = v.direccion;
  valores[COL.MUNICIPIO] = v.municipio;
  valores[COL.CANTIDAD] = v.cantidad;
  valores[COL.SALSAS] = v.salsasTexto;
  valores[COL.ESTADO_PAGO] = 'Pendiente';
  valores[COL.PANTALLAZO] = 'No';
  valores[COL.FECHA] = new Date();

  escribirFila_(ctx.hoja, valores);

  return {
    ok: true,
    numero: numero,
    resumen: {
      cantidad: v.cantidad,
      salsas: v.salsasTexto,
      municipio: v.municipio,
      total: v.cantidad * ctx.config.precio_plato,
      fecha_entrega: textoFecha_(ctx.config.fecha_entrega)
    },
    cupos_restantes: ctx.restantes - consumo,
    whatsapp_numero: ctx.config.whatsapp_numero
  };
}

function validarPedido_(d, ctx) {
  var errores = {};

  var nombre = limpiarTexto_(d.nombre);
  if (nombre.length < LIMITES.NOMBRE.min || nombre.length > LIMITES.NOMBRE.max) {
    errores.nombre = 'Escribe tu nombre completo.';
  }

  var telefono = String(d.telefono == null ? '' : d.telefono).replace(/\D/g, '');
  if (telefono.length === 12 && telefono.indexOf('57') === 0) telefono = telefono.slice(2);
  if (!/^3\d{9}$/.test(telefono)) {
    errores.telefono = 'El celular debe tener 10 dígitos y empezar por 3.';
  }

  var direccion = limpiarTexto_(d.direccion);
  if (direccion.length < LIMITES.DIRECCION.min || direccion.length > LIMITES.DIRECCION.max) {
    errores.direccion = 'Escribe la dirección de entrega.';
  }

  var municipio = buscarNombre_(ctx.municipios.map(function (m) { return m.nombre; }), d.municipio);
  if (!municipio) errores.municipio = 'No tenemos cobertura en ese municipio.';

  var salsasRes = validarSalsas_(d.salsas, ctx);
  if (salsasRes.error) errores.salsas = salsasRes.error;

  if (d.acepta_datos !== true) {
    errores.acepta_datos = 'Debes aceptar el tratamiento de datos.';
  }

  if (Object.keys(errores).length) return { errores: errores };

  return {
    nombre: neutralizarFormula_(nombre),
    telefono: telefono,
    direccion: neutralizarFormula_(direccion),
    municipio: municipio,
    cantidad: salsasRes.cantidad,
    salsasTexto: salsasRes.texto
  };
}

/** salsas: { "Tradicional": 2, "Picante": 1 }. Devuelve cantidad total y texto. */
function validarSalsas_(salsas, ctx) {
  if (!salsas || typeof salsas !== 'object' || Array.isArray(salsas)) {
    return { error: 'Elige la salsa de cada plato.' };
  }
  var activas = ctx.salsas.map(function (s) { return s.nombre; });
  var total = 0;
  var partes = [];
  var claves = Object.keys(salsas);

  if (claves.length > activas.length) return { error: 'Salsa no disponible.' };

  for (var i = 0; i < claves.length; i++) {
    var nombre = buscarNombre_(activas, claves[i]);
    if (!nombre) return { error: 'Salsa no disponible: ' + limpiarTexto_(claves[i]).slice(0, 30) };
    var n = Number(salsas[claves[i]]);
    if (!isFinite(n) || n < 0 || Math.floor(n) !== n) return { error: 'Cantidad de salsa inválida.' };
    if (n > 0) {
      total += n;
      partes.push(nombre + ' x' + n);
    }
  }

  if (total < 1 || total > ctx.config.max_por_pedido) {
    return { error: 'La cantidad de platos debe estar entre 1 y ' + ctx.config.max_por_pedido + '.' };
  }
  return { cantidad: total, texto: partes.join(', ') };
}

function siguienteNumero_(hoja) {
  var ultima = hoja.getLastRow();
  if (ultima < 2) return 1;
  var col = mapaColumnas_(hoja)[COL.NUMERO] + 1;
  var nums = hoja.getRange(2, col, ultima - 1, 1).getValues();
  var max = 0;
  nums.forEach(function (f) {
    var n = parseInt(f[0], 10);
    if (n > max) max = n;
  });
  return max + 1;
}

function escribirFila_(hoja, valores) {
  var mapa = mapaColumnas_(hoja);
  var ancho = hoja.getLastColumn();
  var fila = new Array(ancho);
  for (var i = 0; i < ancho; i++) fila[i] = '';
  Object.keys(valores).forEach(function (k) { fila[mapa[k]] = valores[k]; });

  var destino = hoja.getLastRow() + 1;
  // El teléfono se guarda como texto para que Sheets no lo convierta en número.
  hoja.getRange(destino, mapa[COL.TELEFONO] + 1).setNumberFormat('@');
  hoja.getRange(destino, 1, 1, ancho).setValues([fila]);
  SpreadsheetApp.flush();
}

// ---------------------------------------------------------------------------
// Lectura de la hoja
// ---------------------------------------------------------------------------

function obtenerHojaPedidos_(libro) {
  var hoja = libro.getSheetByName(HOJAS.PEDIDOS);
  if (!hoja) throw new Error('No existe la pestaña "' + HOJAS.PEDIDOS + '".');
  mapaColumnas_(hoja); // valida encabezados
  return hoja;
}

/**
 * Clave de comparación de un encabezado: sin tildes, mayúsculas, signos ni espacios
 * repetidos. "N.º", "N°", "No.", "Nro" y "Número" equivalen a la columna N.º.
 */
function claveEncabezado_(h) {
  var k = normalizar_(h).replace(/[¿?¡!.,:;º°ª#()]/g, ' ').replace(/\s+/g, ' ').trim();
  if (/^(n|no|nro|num|numero)( de pedido)?$/.test(k)) return 'n';
  return k;
}

/**
 * { encabezado oficial (COL): índice base 0 }. Tolera diferencias de escritura.
 * Falla si falta alguna columna obligatoria, indicando qué encabezados encontró.
 */
function mapaColumnas_(hoja) {
  var encabezados = hoja.getRange(1, 1, 1, Math.max(hoja.getLastColumn(), 1)).getValues()[0];
  var porClave = {};
  encabezados.forEach(function (h, i) {
    var k = claveEncabezado_(h);
    if (k && !(k in porClave)) porClave[k] = i; // si hay duplicados, gana el primero
  });
  var mapa = {};
  var faltan = [];
  COLUMNAS_PEDIDOS.forEach(function (c) {
    var k = claveEncabezado_(c);
    if (k in porClave) mapa[c] = porClave[k];
    else faltan.push(c);
  });
  if (faltan.length) {
    throw new Error('Faltan columnas en "Pedidos": ' + faltan.join(', ') +
      '. Encabezados encontrados: ' + encabezados.map(String).join(' | '));
  }
  return mapa;
}

function leerConfig_(libro) {
  var hoja = libro.getSheetByName(HOJAS.CONFIG);
  var crudo = {};
  if (hoja && hoja.getLastRow() >= 2) {
    hoja.getRange(2, 1, hoja.getLastRow() - 1, 2).getValues().forEach(function (f) {
      var clave = String(f[0]).trim().toLowerCase();
      if (clave) crudo[clave] = f[1];
    });
  }
  var valor = function (k) {
    return crudo[k] === undefined || crudo[k] === '' ? CONFIG_DEFECTO[k] : crudo[k];
  };

  var tipo = String(valor('tipo_cupo')).trim().toLowerCase();
  return {
    cupo_maximo: enteroPositivo_(valor('cupo_maximo'), CONFIG_DEFECTO.cupo_maximo),
    tipo_cupo: tipo === 'pedidos' ? 'pedidos' : 'platos',
    max_por_pedido: enteroPositivo_(valor('max_por_pedido'), CONFIG_DEFECTO.max_por_pedido),
    fecha_apertura: aFecha_(valor('fecha_apertura')),
    fecha_cierre: aFecha_(valor('fecha_cierre')),
    fecha_entrega: aFecha_(valor('fecha_entrega')),
    hora_entrega: aHora_(valor('hora_entrega')),
    precio_plato: enteroPositivo_(valor('precio_plato'), CONFIG_DEFECTO.precio_plato),
    pedidos_abiertos: String(valor('pedidos_abiertos')).trim().toUpperCase() === 'SI' ? 'SI' : 'NO',
    whatsapp_numero: String(valor('whatsapp_numero')).replace(/\D/g, '')
  };
}

/**
 * Lee una pestaña tipo lista (encabezados en la fila 1) y devuelve las filas activas.
 * Las claves del objeto son los encabezados en minúscula.
 */
function leerLista_(libro, nombreHoja, colActiva, columnas) {
  var hoja = libro.getSheetByName(nombreHoja);
  if (!hoja || hoja.getLastRow() < 2) return [];
  var datos = hoja.getRange(1, 1, hoja.getLastRow(), hoja.getLastColumn()).getValues();
  var enc = datos[0].map(function (h) { return String(h).trim().toLowerCase(); });
  var iActiva = enc.indexOf(colActiva.toLowerCase());
  var indices = columnas.map(function (c) { return enc.indexOf(c.toLowerCase()); });
  if (indices[0] < 0) return [];

  var vistos = {};
  var res = [];
  datos.slice(1).forEach(function (f) {
    var nombre = String(f[indices[0]]).trim();
    var activa = iActiva < 0 || String(f[iActiva]).trim().toUpperCase() === 'SI';
    if (!nombre || !activa || vistos[normalizar_(nombre)]) return;
    vistos[normalizar_(nombre)] = true;
    var item = { nombre: nombre };
    for (var i = 1; i < columnas.length; i++) {
      item[columnas[i].toLowerCase()] = indices[i] >= 0 ? String(f[indices[i]]).trim() : '';
    }
    res.push(item);
  });
  return res;
}

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

function leerCuerpo_(e) {
  var texto = e && e.postData && e.postData.contents;
  if (!texto || texto.length > LIMITES.CUERPO_MAX) throw new Error('Cuerpo inválido');
  var obj = JSON.parse(texto);
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) throw new Error('Cuerpo inválido');
  return obj;
}

function responder_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function error_(codigo, mensaje) {
  return { ok: false, codigo: codigo, mensaje: mensaje };
}

/** Quita caracteres de control, colapsa espacios y recorta. */
function limpiarTexto_(v) {
  return String(v == null ? '' : v)
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Evita que Sheets interprete el texto como fórmula. */
function neutralizarFormula_(texto) {
  return /^[=+\-@]/.test(texto) ? "'" + texto : texto;
}

/** Compara sin tildes ni mayúsculas. */
function normalizar_(v) {
  return String(v == null ? '' : v)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/\s+/g, ' ').trim();
}

/** Devuelve el nombre oficial de la lista que coincide con `valor`, o null. */
function buscarNombre_(lista, valor) {
  var buscado = normalizar_(valor);
  if (!buscado) return null;
  for (var i = 0; i < lista.length; i++) {
    if (normalizar_(lista[i]) === buscado) return lista[i];
  }
  return null;
}

function enteroPositivo_(v, defecto) {
  var n = parseInt(v, 10);
  return isFinite(n) && n > 0 ? n : defecto;
}

/**
 * Convierte un valor de "Config" en Date.
 * Acepta celdas de fecha de Sheets o texto "AAAA-MM-DD" / "AAAA-MM-DD HH:mm",
 * interpretado en hora de Colombia (UTC-5, sin horario de verano).
 */
function aFecha_(v) {
  if (v instanceof Date && !isNaN(v)) return v;
  var m = String(v == null ? '' : v).trim()
    .match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{1,2}):(\d{2}))?$/);
  if (!m) return null;
  return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], (+m[4] || 0) + 5, +m[5] || 0));
}

/**
 * Hora de entrega "HH:mm" (24 h). Acepta texto "14:00" o una celda de hora de Sheets.
 * Devuelve '' si no hay valor válido.
 */
function aHora_(v) {
  if (v instanceof Date && !isNaN(v)) return Utilities.formatDate(v, ZONA_HORARIA, 'HH:mm');
  var m = String(v == null ? '' : v).trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m || +m[1] > 23 || +m[2] > 59) return '';
  return (m[1].length === 1 ? '0' : '') + m[1] + ':' + m[2];
}

function isoONulo_(fecha) {
  return fecha ? fecha.toISOString() : null;
}

function textoFecha_(fecha) {
  return fecha ? Utilities.formatDate(fecha, ZONA_HORARIA, 'yyyy-MM-dd') : null;
}

// ---------------------------------------------------------------------------
// Preparación de la hoja (ejecutar a mano una vez desde el editor)
// ---------------------------------------------------------------------------

/**
 * Crea las pestañas "Config", "Salsas" y "Municipios" si no existen y agrega al final
 * de "Pedidos" los encabezados que falten. No borra ni sobrescribe datos existentes.
 */
function configurarHoja() {
  var libro = SpreadsheetApp.getActiveSpreadsheet();
  libro.setSpreadsheetTimeZone(ZONA_HORARIA);

  var pedidos = libro.getSheetByName(HOJAS.PEDIDOS) || libro.insertSheet(HOJAS.PEDIDOS);
  var ancho = Math.max(pedidos.getLastColumn(), 1);
  var actuales = pedidos.getRange(1, 1, 1, ancho).getValues()[0].map(claveEncabezado_);
  var faltan = COLUMNAS_PEDIDOS.filter(function (c) {
    return actuales.indexOf(claveEncabezado_(c)) < 0;
  });
  if (faltan.length) {
    var inicio = pedidos.getLastColumn() === 0 ? 1 : pedidos.getLastColumn() + 1;
    pedidos.getRange(1, inicio, 1, faltan.length).setValues([faltan]);
  }
  pedidos.setFrozenRows(1);

  if (!libro.getSheetByName(HOJAS.CONFIG)) {
    var cfg = libro.insertSheet(HOJAS.CONFIG);
    cfg.getRange(1, 1, 11, 2).setValues([
      ['Clave', 'Valor'],
      ['cupo_maximo', 20],
      ['tipo_cupo', 'platos'],
      ['max_por_pedido', 5],
      ['fecha_apertura', ''],
      ['fecha_cierre', ''],
      ['fecha_entrega', ''],
      ['hora_entrega', ''],
      ['precio_plato', 30000],
      ['pedidos_abiertos', 'NO'],
      ['whatsapp_numero', '']
    ]);
    cfg.getRange('B2:B11').setNumberFormat('@');
    cfg.setFrozenRows(1);
  }

  if (!libro.getSheetByName(HOJAS.SALSAS)) {
    var sal = libro.insertSheet(HOJAS.SALSAS);
    sal.getRange(1, 1, 4, 3).setValues([
      ['Nombre', 'Descripción', 'Activa'],
      ['Tradicional', '', 'SI'],
      ['Dulce', '', 'SI'],
      ['Picante', '', 'SI']
    ]);
    sal.setFrozenRows(1);
  }

  if (!libro.getSheetByName(HOJAS.MUNICIPIOS)) {
    var mun = libro.insertSheet(HOJAS.MUNICIPIOS);
    mun.getRange(1, 1, 1, 2).setValues([['Nombre', 'Activo']]);
    mun.setFrozenRows(1);
  }

  console.log('Hoja lista. Columnas agregadas a Pedidos: ' + (faltan.join(', ') || 'ninguna'));
}

/** Prueba rápida desde el editor: muestra el estado de la jornada en el registro. */
function probarEstado() {
  console.log(JSON.stringify(construirEstado_(), null, 2));
}
