<?php
$JSON = file_get_contents("php://input");
$request = json_decode($JSON);
include("a_cabecera.php");
include("_incluir_funciones.php");
$_SESSION['conexion']=f_abrir_conexion();
$t=f_abrir("SELECT * FROM configuracion");
if ($r=f_reg($t)) {
    $_SESSION['empresa_mail']=$r["mail_setFrom_nombre"];
    $_SESSION['mail_host']=$r["mail_Host"];
    $_SESSION['mail_puerto']=floatval($r["mail_Port"]);
    $_SESSION['mail_usuario']=$r["mail_Username"];
    $_SESSION['mail_password']=$r["mail_Password"];
    $_SESSION['mail_cuenta']=$r["mail_Host"];
    $_SESSION['mail_SMTPSecure']=true;
}
$_SESSION['permitidos']=array();

error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);
if(!$JSON){exit('{"r":0,"mensaje":"Error Json","datos":{"text":"Error al recibir datos."}}');}
$parametros_acceso=$request->parametros_acceso;
$login_empresa=$parametros_acceso->login_empresa;
$login_usuario=$parametros_acceso->login_usuario;
$login_codigo=$parametros_acceso->login_codigo;
$appVersion=$parametros_acceso->appVersion;
$appVersion_comprobada=$parametros_acceso->appVersion_comprobada;
$verificar_actualizacion=$parametros_acceso->verificar_actualizacion;
$login_sesion=$parametros_acceso->login_sesion;

$valores_retorno=null;
$valores_retorno['texto']="";
$valores_retorno['actualizar_parametros']=0;
$valores_retorno['sesiones_activas']=0;
$_SESSION['provincias'] = [
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

f_abrir("DELETE FROM usuarios_logueados WHERE ultimo_acceso < (NOW() - INTERVAL 20 MINUTE)");


$tusr=f_abrir("SELECT * from usuarios_logueados where usuario=$login_usuario and sesion=$login_sesion and codigo_generado=$login_codigo");
if ($rlogueo=f_reg($tusr)){
    f_abrir("UPDATE usuarios_logueados SET ultimo_acceso = NOW() where sesion=$login_sesion");
	$_SESSION['login_usuario']=$login_usuario;
    $_SESSION['permitidos']=f_permitidos($login_usuario);
    $valores_retorno['sesiones_activas']=f_cantidadregistros("SELECT sesion FROM usuarios_logueados where usuario=$login_usuario");
}

if ($verificar_actualizacion) {
	$t=f_abrir("select * from opciones order by version desc");
	$r=f_reg($t);
    if ($r["version"]>$appVersion_comprobada) {$valores_retorno['actualizar_parametros']=1;}
    if (!$valores_retorno['actualizar_parametros']==0 && $parametros_acceso->version_personas<$rlogueo['personas_version']) $valores_retorno['actualizar_parametros']=2;
    if (!$valores_retorno['actualizar_parametros']==0 && $parametros_acceso->version_permisos<$rlogueo['permisos_version']) $valores_retorno['actualizar_parametros']=3;
    if (!$valores_retorno['actualizar_parametros']==0 && $parametros_acceso->version_parametros_empresa<$rlogueo['parametros_empresa_version']) $valores_retorno['actualizar_parametros']=4;

}
