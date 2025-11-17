<?php
include("a.php");
$actualizar_id=0;

function f_ultima_actualizacion_version() {
	$nro=-1;
	$tp=f_abrir("SELECT actualizacion_version FROM personas ORDER BY actualizacion_version DESC limit 1");
	if ($rp=f_reg($tp)){ $nro=$rp["actualizacion_version"]; }
	return $nro+1;
}

if ($request->accion=='abm_persona') {
	$actualizar_id=$request->id;
	$doc_tipo=$request->doc_tipo;
	$doc_numero=$request->doc_numero;
	$nombre=$request->nombre;
	$domicilio=$request->domicilio;
	$telefono=$request->telefono;
	$correo_electronico=$request->correo_electronico;
	$ultima_actualizacion_version=f_ultima_actualizacion_version();
	if ($actualizar_id>0) {
		f_abrir("UPDATE personas SET actualizacion_version=$ultima_actualizacion_version,nombre='$nombre',domicilio='$domicilio',telefono='$telefono',correo_electronico='$correo_electronico' where persona_id=$actualizar_id");
	} else {
		$actualizar_id=f_abrir("INSERT INTO personas (doc_tipo,doc_numero,nombre,domicilio,telefono,correo_electronico,actualizacion_version) VALUES ($doc_tipo,'$doc_numero','$nombre','$domicilio','$telefono','$correo_electronico',$ultima_actualizacion_version) ");
	}
	f_actualizar_version('personas');
	$valores_retorno['actualizar_parametros']=true;
}

exit('{"valores_retorno":'.json_encode($valores_retorno).'
	,"actualizar_id":'.$actualizar_id.'
}');

?>