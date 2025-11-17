<?php
include("a.php");
$rlogueo['personas_version']=-1;
$rlogueo['mercaderias_version']=-1;
$login_sesion=$request->login_sesion;

$actualizaciones=array();
$ultima_version=0;

$version_permisos=0;
$menu=array(); $menu_opciones=array();
$usuarios_todos = array();
$appVersion_comprobada=0;

$menus=array();
$permisos=array();

//traigo el detalle de los módulos habilitados a la empresa con los valores de configuración correspondientes en cada caso.

$t=f_abrir("select * from usuario_empresa where usuario=$login_usuario");
if ($r=f_reg($t)) { $version_permisos=floatval($r["version"]); }

$t=f_abrir("SELECT * from opciones");
while ($r=f_reg($t)){
	extract($r);
	if ($appVersion_comprobada<$version) $appVersion_comprobada=floatval($version);
	array_push($menu_opciones,array("opcion_id"=>$nombre,"version"=>floatval($version),"celular"=>false ));
}

$t=f_abrir("SELECT * from usuarios order by usuario");
while ($r=f_reg($t)){
	array_push($usuarios_todos, array("id" => floatval($r['usuario_id']), "cuil" => floatval($r['cuit']), "nombre" => $r['usuario'] ));
}

for ($a=0;$a<f_count($menu_opciones);$a++) {
	//estos son los adaptados a celular
	if (f_in($menu_opciones[$a]["opcion_id"],['pedidos_nuevo','remitos_ventas_preparar','listas_precios','mercaderias_lotes','recordatorios','autorizaciones','SQL','gerencial_resumen_mensual','config_usuarios'])) $menu_opciones[$a]["celular"]=true;
}


//GESTIÓN COMERCIAL
$submenu1=array();
	$submenu2=array();
	array_push($submenu1,array("opcion"=>'visitas_nueva',"nombre"=>'Nueva Visita',"imagen"=>'ctacte.svg',"celular"=>false,"submenu2"=>$submenu2,"actualizar"=>1) );
	$submenu2=array();
	array_push($submenu1,array("opcion"=>'visitas',"nombre"=>'Visitas',"imagen"=>'ctacte.svg',"celular"=>false,"submenu2"=>$submenu2,"actualizar"=>1) );
	$submenu2=array();
	array_push($submenu1,array("opcion"=>'casos_nuevo',"nombre"=>'Nuevo Caso',"imagen"=>'ctacte.svg',"celular"=>false,"submenu2"=>$submenu2,"actualizar"=>1) );
	$submenu2=array();
	array_push($submenu1,array("opcion"=>'casos',"nombre"=>'Gestión de Casos',"imagen"=>'ctacte.svg',"celular"=>false,"submenu2"=>$submenu2,"actualizar"=>1) );

array_push($menus,array("nombre"=>'Gestión Estudio',"imagen"=>'tienda.svg',"submenu1"=>$submenu1) );
//UTILIDADES
$submenu1=array();
	$submenu2=array();
	array_push($submenu1,array("opcion"=>'recordatorios',"nombre"=>'Recordatorios',"imagen"=>'recordatorios.svg',"celular"=>true,"submenu2"=>$submenu2,"actualizar"=>1) );
	$submenu2=array();
	array_push($submenu1,array("opcion"=>'personas',"nombre"=>'Personas',"imagen"=>'persona.svg',"celular"=>false,"submenu2"=>$submenu2,"actualizar"=>1) );
array_push($menus,array("nombre"=>'Utilidades',"imagen"=>'herramientas.svg',"submenu1"=>$submenu1) );
//CONFIGURACION
$submenu1=array();
	$submenu2=array();
	array_push($submenu1,array("opcion"=>'configuracion',"nombre"=>'Sistema',"imagen"=>'.svg',"celular"=>false,"submenu2"=>$submenu2,"actualizar"=>1) );
	$submenu2=array();
	array_push($submenu1,array("opcion"=>'config_usuarios',"nombre"=>'Usuarios',"imagen"=>'persona_contacto.svg',"celular"=>true,"submenu2"=>$submenu2,"actualizar"=>1) );
array_push($menus,array("nombre"=>'Configuración',"imagen"=>'configuracion.svg',"submenu1"=>$submenu1) );

array_push($permisos,array("id"=>'casos_nuevo',"nombre"=>'Casos - Ingresar uno nuevo',"opciones"=>['casos_nuevo'],"restringido"=>false) );
array_push($permisos,array("id"=>'casos_ver',"nombre"=>'Casos - Ver',"opciones"=>['casos'],"restringido"=>false) );
array_push($permisos,array("id"=>'casos_modificar_datos',"nombre"=>'Casos - Modificar datos',"opciones"=>['casos'],"restringido"=>false) );
array_push($permisos,array("id"=>'casos_notas_agregar',"nombre"=>'Casos - Agregar Notas',"opciones"=>['casos'],"restringido"=>false) );
array_push($permisos,array("id"=>'casos_estado_cambiar',"nombre"=>'Casos - Cambiar Estado',"opciones"=>['casos'],"restringido"=>false) );
array_push($permisos,array("id"=>'configuracion_administrar',"nombre"=>'Configurar el sistema',"opciones"=>['configuracion'],"restringido"=>false) );
array_push($permisos,array("id"=>'config_usuarios_administrar',"nombre"=>'Usuarios - Administrar',"opciones"=>['config_usuarios'],"restringido"=>false) );
array_push($permisos,array("id"=>'personas_abm',"nombre"=>'Personas - Administrar',"opciones"=>['personas'],"restringido"=>false) );
array_push($permisos,array("id"=>'personas_ver',"nombre"=>'Personas - Ver',"opciones"=>['personas'],"restringido"=>false) );
array_push($permisos,array("id"=>'visitas_nueva',"nombre"=>'Visitas - Registrar una nueva',"opciones"=>['visitas_nueva'],"restringido"=>false) );
array_push($permisos,array("id"=>'visitas_ver',"nombre"=>'Visitas - Consultar',"opciones"=>['visitas'],"restringido"=>false) );

$ConsultaPadronAfip=array();
$ConsultaPadronAfip["certificado"]='konsultisas_55aef1791f40f116.crt';
$ConsultaPadronAfip["clave"]='ClavePrivadaKonsulti2022.key';
$ConsultaPadronAfip["empresa_cuit"]=30716431564;


exit('{"valores_retorno":'.json_encode($valores_retorno).'
	,"ConsultaPadronAfip":'.json_encode($ConsultaPadronAfip).'
	,"permitidos":'.json_encode($_SESSION['permitidos']).'
	,"menu_opciones":'.json_encode($menu_opciones).'
	,"actualizaciones":'.json_encode($actualizaciones).'
	,"usuario_preferencias":'.json_encode(f_usuario_preferencias($login_usuario)).'
	,"appVersion_comprobada":'.$appVersion_comprobada.'
	,"usuarios_todos":'.json_encode($usuarios_todos).'
	,"usuario_administrador":'.floatval($_SESSION['usuario_administrador']).'
	,"version_permisos":'.$version_permisos.'
	,"menus":'.json_encode($menus).'
	,"permisos":'.json_encode($permisos).'
}');
?>

