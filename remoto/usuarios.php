<?php
include("a.php");

$usuarios_todos=array();
$usuarios=array();
$modulos = array();
$permitidos=array();

if ($request->accion=='inicial') {
	$t=f_abrir("select * from usuarios order by usuario");
	while ($r=f_reg($t)){
		array_push($usuarios_todos, array("id" => floatval($r['usuario_id'])
			,"cuil"=>floatval($r['cuit'])
			,"nombre"=>$r['usuario']
		));
		if (f_cantidadregistros("SELECT * FROM usuario_empresa where usuario=".$r["usuario_id"])>0) {
			array_push($usuarios, array("id"=>floatval($r['usuario_id'])
				,"cuil"=>floatval($r['cuit'])
				,"orden"=>""
				,"nombre"=>$r['usuario']
				,"mail"=>f_usuario($r['usuario_id'],"mail")
				,"tildado"=>false
			));
		}
	}
} else if ($request->accion=='agregar') {
	$id=$request->id;
	f_abrir("INSERT into usuario_empresa (usuario) values ($id)");
} else if ($request->accion=='eliminar') {
	$id=$request->id;
	f_abrir("DELETE from permitidos where usuario=$id");
	f_abrir("DELETE from usuario_empresa where usuario=$id");
} else if ($request->accion=='permisos') {
	$in_usuarios=$request->usuarios_in;
	$t=f_abrir("SELECT * from permitidos where usuario in ($in_usuarios)");
	while ($r=f_reg($t)){
		array_push($permitidos, array("id"=>floatval($r['permitido_id']),"usuario"=>floatval($r['usuario']),"permiso"=>$r['permiso'] ));
	}
	$eliminar_in=$request->eliminar_in;
	if ($eliminar_in!='') f_abrir("DELETE from permitidos where permiso IN ($eliminar_in)");
} else if ($request->accion=='traer_permisos_usuario') {
	$t=f_abrir("SELECT DISTINCT permiso from permitidos where usuario=".$request->usuario);
	while ($r=f_reg($t)){
		array_push($permitidos,$r['permiso']);
	}
} else if ($request->accion=='permisos_guardar') {
	$actualizar=array();
	$permitidos=json_decode($request->permitidos);
	for($m=0;$m<f_count($permitidos);$m++){
		$p=$permitidos[$m];
		$usuario=$p->usuario;
		$permisos=$p->permisos;
		for ($a=0;$a<f_count($permisos);$a++) {
			$permiso_autorizacion=$permisos[$a];
			$permitido_id=$permiso_autorizacion->permitido_id;
			$permiso=$permiso_autorizacion->permiso;
			$permitido=$permiso_autorizacion->permitido;
			$nuevo_permitido=$permiso_autorizacion->nuevo_permitido;
			if ($permitido_id>0 && !$nuevo_permitido) {
				if ($ids_borrar!="") $ids_borrar.=",";
				$ids_borrar.=$permitido_id;
				f_abrir("DELETE FROM permitidos where usuario=$usuario and permiso='$permiso'");
				$estaba=false;for ($per=0;$per<f_count($actualizar);$per++) {if ($actualizar[$per]==$usuario) $estaba=true;}if (!$estaba) array_push($actualizar,$usuario);
			} else if ($permitido_id==0 && $nuevo_permitido) {
				f_abrir("DELETE FROM permitidos WHERE usuario=$usuario and permiso='$permiso'");
				f_abrir("INSERT INTO permitidos (usuario,permiso) values ($usuario,'$permiso')");
				$estaba=false;for ($per=0;$per<f_count($actualizar);$per++) {if ($actualizar[$per]==$usuario) $estaba=true;}if (!$estaba) array_push($actualizar,$usuario);
			}
		}
	}
	for ($per=0;$per<f_count($actualizar);$per++) {
		$usuario=$actualizar[$per];
		f_actualizar_version('permisos',$usuario);
		if ($usuario==$login_usuario) $valores_retorno['actualizar_parametros']=true;
	}
} else if ($request->accion=='guardar_preferencias') {
	$preferencias=json_decode($request->preferencias);
	$preferencia_conciliacion_filtrar_desde_conciliado=0; if ($preferencias->conciliacion_filtrar_desde_conciliado) $preferencia_conciliacion_filtrar_desde_conciliado=1;
	$preferencia_conciliacion_dias_atras=$preferencias->conciliacion_dias_atras;
	$preferencia_cuenta_individual_solo_pendientes=0; if ($preferencias->cuenta_individual_solo_pendientes) $preferencia_cuenta_individual_solo_pendientes=1;
	$preferencia_cuenta_individual_orden_ascendente=0; if ($preferencias->cuenta_individual_orden_ascendente) $preferencia_cuenta_individual_orden_ascendente=1;
	$preferencia_cuenta_individual_mostrar_dias_factura_venta=0; if ($preferencias->cuenta_individual_mostrar_dias_factura_venta) $preferencia_cuenta_individual_mostrar_dias_factura_venta=1;
	$preferencia_menu_estilo=$preferencias->menu_estilo;
	$preferencia_guardar_usuario=0; if ($preferencias->guardar_usuario) $preferencia_guardar_usuario=1;
	$preferencia_ctacte_agrupar=0; if ($preferencias->ctacte_agrupar) $preferencia_ctacte_agrupar=1;
	$preferencia_preguntar_recarga=0; if ($preferencias->preguntar_recarga) $preferencia_preguntar_recarga=1;
	f_abrir("UPDATE usuarios set preferencia_conciliacion_filtrar_desde_conciliado=$preferencia_conciliacion_filtrar_desde_conciliado,preferencia_conciliacion_dias_atras=$preferencia_conciliacion_dias_atras,preferencia_cuenta_individual_solo_pendientes=$preferencia_cuenta_individual_solo_pendientes,preferencia_cuenta_individual_orden_ascendente=$preferencia_cuenta_individual_orden_ascendente,preferencia_menu_estilo=$preferencia_menu_estilo,preferencia_guardar_usuario=$preferencia_guardar_usuario,preferencia_ctacte_agrupar=$preferencia_ctacte_agrupar,preferencia_cuenta_individual_mostrar_dias_factura_venta=$preferencia_cuenta_individual_mostrar_dias_factura_venta,preferencia_preguntar_recarga=$preferencia_preguntar_recarga where usuario_id=$login_usuario");
} else if ($request->accion=='cerrar_sesiones_extra') {
	f_abrir("DELETE FROM usuarios_logueados where usuario=$login_usuario and sesion!=$login_sesion");
	$valores_retorno['sesiones_activas']=f_cantidadregistros("SELECT sesion FROM usuarios_logueados where usuario=$login_usuario");
}

exit('{"valores_retorno":'.json_encode($valores_retorno).'
	,"usuarios":'.json_encode($usuarios).'
	,"usuarios_todos":'.json_encode($usuarios_todos).'
	,"modulos":'.json_encode($modulos).'
	,"permitidos":'.json_encode($permitidos).'
}');

?>