<?php
include("a.php");

$actualizaciones=array();
$version_permisos=0;
$opciones=array();
$permitidos=array();
$personas=array();
$areas=array();
$estados_casos=array();

if ($request->accion=='inicial') {
	$t=f_abrir("select * from opciones order by version desc");
	$r=f_reg($t);
	
	if ($r["version"]>$appVersion_comprobada) array_push($actualizaciones, array("id"=>1,"nombre"=>"Versión del menú".$r["version"].">$appVersion_comprobada","estado"=>"Pendiente" ));
	if ($parametros_acceso->version_personas<$rlogueo['personas_version']) {
		array_push($actualizaciones, array("id"=>2,"nombre"=>"Personas","estado"=>"Pendiente" ));
	} else {
		$nro=0;
		$tp=f_abrir("SELECT actualizacion_version FROM personas ORDER BY actualizacion_version DESC limit 1");
		if ($rp=f_reg($tp)){ $nro=$rp["actualizacion_version"]; } 
		if ($parametros_acceso->version_personas<$nro) {
			array_push($actualizaciones, array("id"=>2,"nombre"=>"Personas","estado"=>"Pendiente" ));
		}
	}
	if ($parametros_acceso->version_parametros_empresa<$rlogueo['parametros_empresa_version']) array_push($actualizaciones, array("id"=>4.2,"nombre"=>"Parámetros de Configuración","estado"=>"Pendiente" ));
	if ($parametros_acceso->version_permisos<$rlogueo['permisos_version']) array_push($actualizaciones, array("id"=>6,"nombre"=>"Permisos","estado"=>"Pendiente" ));
} else if ($request->accion=='opciones') {
	$t=f_abrir("select * from opciones");
	while($r=f_reg($t)){
		extract($r);
		array_push($opciones, array("id"=>$nombre
			,"version"=>floatval($version)
		));
		if ($version>$ultima) $ultima=floatval($version);
	}
} else if ($request->accion=='permisos') {
	$permitidos=f_permitidos($login_usuario);
} else if ($request->accion=='traer') {
	$quecosa=$request->quecosa;
	if ($quecosa==2) {
		$personas=f_personas($request->personas_ultima_version);
	}
	if ($quecosa==4.2) {
		$t=f_abrir("SELECT * FROM areas");
		while ($r=f_reg($t)) {
			$areas[]=array("id"=>floatval($r["area_id"]),"nombre"=>$r["nombre"]);
		} 
		$t=f_abrir("SELECT * FROM estados_casos");
		while ($r=f_reg($t)) {
			$estados_casos[]=array("id"=>floatval($r["estado_id"]),"nombre"=>$r["nombre"]);
		} 

	}
}


exit('{"valores_retorno":'.json_encode($valores_retorno).'
	,"actualizaciones":'.json_encode($actualizaciones).'
	,"version_parametros_empresa":'.$rlogueo['parametros_empresa_version'].'
	,"version_permisos":'.$rlogueo['permisos_version'].'
	,"opciones":'.json_encode($opciones).'
	,"permitidos":'.json_encode($permitidos).'
	,"personas":'.json_encode($personas).'
	,"domicilios":'.json_encode($domicilios).'
	,"areas":'.json_encode($areas).'
	,"estados_casos":'.json_encode($estados_casos).'
}');

?>