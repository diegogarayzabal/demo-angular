<?php
include("a_cabecera.php");
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);

$provincias = [
    ["id" => 1, "nombre" => "Córdoba", "cuit" => 30999256712, "codigo" => 904],
    ["id" => 2, "nombre" => "Ciudad Autónoma de Buenos Aires", "cuit" => 34999032089, "codigo" => 901],
    ["id" => 3, "nombre" => "Buenos Aires", "cuit" => 30710404611, "codigo" => 902],
    ["id" => 4, "nombre" => "Santa Cruz", "cuit" => 30715200437, "codigo" => 920],
    ["id" => 5, "nombre" => "Chubut", "cuit" => 30670499584, "codigo" => 907],
    ["id" => 6, "nombre" => "Tierra del Fuego", "cuit" => 30546662434, "codigo" => 923],
    ["id" => 7, "nombre" => "Neuquén", "cuit" => 30707519092, "codigo" => 915],
    ["id" => 8, "nombre" => "La Pampa", "cuit" => 30693564855, "codigo" => 911],
    ["id" => 9, "nombre" => "Mendoza", "cuit" => 30713775505, "codigo" => 913],
    ["id" => 10, "nombre" => "San Luis", "cuit" => 30673377544, "codigo" => 919],
    ["id" => 11, "nombre" => "San Juan", "cuit" => 30999015162, "codigo" => 918],
    ["id" => 12, "nombre" => "La Rioja", "cuit" => 30671853535, "codigo" => 912],
    ["id" => 13, "nombre" => "Catamarca", "cuit" => 30668085837, "codigo" => 903],
    ["id" => 14, "nombre" => "Salta", "cuit" => 30711020264, "codigo" => 917],
    ["id" => 15, "nombre" => "Jujuy", "cuit" => 30671485706, "codigo" => 910],
    ["id" => 16, "nombre" => "Formosa", "cuit" => 30671355942, "codigo" => 909],
    ["id" => 17, "nombre" => "Chaco", "cuit" => 33999176769, "codigo" => 906],
    ["id" => 18, "nombre" => "Santiago del Estero", "cuit" => 30712516530, "codigo" => 922],
    ["id" => 19, "nombre" => "Santa Fe", "cuit" => 30655200173, "codigo" => 921],
    ["id" => 20, "nombre" => "Corrientes", "cuit" => 30709110078, "codigo" => 905],
    ["id" => 21, "nombre" => "Entre Rios", "cuit" => 30712147829, "codigo" => 908],
    ["id" => 22, "nombre" => "Misiones", "cuit" => 30672333594, "codigo" => 914],
    ["id" => 23, "nombre" => "Tucumán", "cuit" => 30675428081, "codigo" => 924],
    ["id" => 24, "nombre" => "Río Negro", "cuit" => 33658644969, "codigo" => 916]
];

$tipos_documentos = [
    ['id' => 80, 'nombre' => 'C.U.I.T.'],
    ['id' => 86, 'nombre' => 'C.U.I.L.'],
    ['id' => 91, 'nombre' => 'CI Extranjera'],
    ['id' => 96, 'nombre' => 'D.N.I.']
];

$mail_modos = [
    ['id' => 0, 'nombre' => 'Para'],
    ['id' => 1, 'nombre' => 'Con copia'],
    ['id' => 2, 'nombre' => 'Con copia oculta']
];

$MESES = [
    ['id' => 1, 'nombre' => 'Enero'], ['id' => 2, 'nombre' => 'Febrero'],
    ['id' => 3, 'nombre' => 'Marzo'], ['id' => 4, 'nombre' => 'Abril'],
    ['id' => 5, 'nombre' => 'Mayo'], ['id' => 6, 'nombre' => 'Junio'],
    ['id' => 7, 'nombre' => 'Julio'], ['id' => 8, 'nombre' => 'Agosto'],
    ['id' => 9, 'nombre' => 'Septiembre'], ['id' => 10, 'nombre' => 'Octubre'],
    ['id' => 11, 'nombre' => 'Noviembre'], ['id' => 12, 'nombre' => 'Diciembre']
];

exit('{
    "MESES":'.json_encode($MESES).',
    "mail_modos":'.json_encode($mail_modos).',
    "tipos_documentos":'.json_encode($tipos_documentos).',
    "provincias":'.json_encode($provincias).'
    }');
?>