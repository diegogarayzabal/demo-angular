<?php
include("a.php");
$datos=null;
$listado=array();

if ($request->accion=='abm') {
	$vdatos=json_decode($request->datos);
	$datos=get_object_vars($vdatos);
	extract($datos);
	$tipo=$request->tipo;
	if ($tipo==1) {
		if ($id>0) $sql="UPDATE areas set nombre='$nombre' where area_id=$id";
		if ($id==0) $sql="INSERT INTO areas (nombre) values ('$nombre')";
        f_abrir($sql);
		f_actualizar_version('parametros_empresa');
		$valores_retorno['actualizar_parametros']=true;
	}
	if ($tipo==2) {
		if ($id>0) $sql="UPDATE estados_casos set nombre='$nombre' where estado_id=$id";
		if ($id==0) $sql="INSERT INTO estados_casos (nombre) values ('$nombre')";
        f_abrir($sql);
		f_actualizar_version('parametros_empresa');
		$valores_retorno['actualizar_parametros']=true;
	}
} else if ($request->accion=='traer_parametros') {
	$lista=f_traer_datos_tabla("configuracion","");
	$datos=$lista[0];
} else if ($request->accion=='parametros_abm') {
	$vdatos=json_decode($request->datos);
	$datos=get_object_vars($vdatos);
	extract($datos);
	f_abrir("UPDATE configuracion SET mail_Host='$mail_Host',mail_Port=$mail_Port,mail_Username='$mail_Username',mail_Password='$mail_Password',mail_setFrom_mail='$mail_setFrom_mail',mail_setFrom_nombre='$mail_setFrom_nombre' ");
	$lista=f_traer_datos_tabla("configuracion","");
	$datos=$lista[0];
}


exit('{"valores_retorno":'.json_encode($valores_retorno).'
,"datos":'.json_encode($datos).'
,"listado":'.json_encode($listado).'
}');

?>