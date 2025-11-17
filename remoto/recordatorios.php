<?php
include("a.php");

$recordatorios = array();
$recordatorios_compartidos=array();
$recordatorios_items = array();
$subitems = array();

if ($request->accion=='inicial') {
	$t=f_abrir("select * from recordar_grupos where grupo_duenio=$login_usuario or (select count(grupo) from recordar_compartir where grupo=recordar_grupos.grupo_id and usuario=$login_usuario)>0 order by grupo_nombre");
	while ($r=f_reg($t)){
		$modificable=false;
		$duenio=0; if ($r['grupo_duenio']==$login_usuario){ 
			$duenio=1; $duenio_nombre=""; $modificable=true;
		}else{ 
			$duenio_nombre=f_usuario($r['grupo_duenio']); 
			if (f_cantidadregistros("select * from recordar_compartir where grupo=".$r['grupo_id']." and item=0 and usuario=$login_usuario and modificable>0")>0) $modificable=true;
		}
		$cant=f_cantidadregistros("select * from recordar_items where grupo=".$r['grupo_id']);
		array_push($recordatorios, array("id" =>floatval($r['grupo_id']), "nombre" => $r['grupo_nombre'], "duenio" => $duenio, "duenio_nombre" => $duenio_nombre, "cantidad" => $cant, "modificable" => $modificable));
	}
} else if ($request->accion=='grupo') {
	$id=$request->grupo_id;
	$nombre=$request->grupo_nombre;
	if ($id>0){
		$nada=f_abrir("update recordar_grupos set grupo_nombre='$nombre' where grupo_id=$id");
	}else{
		$nada=f_abrir("insert into recordar_grupos (grupo_nombre,grupo_duenio) values ('$nombre',$login_usuario)");
	}
} else if ($request->accion=='grupo_eliminar') {
	$id=$request->grupo_id;
	$nada=f_abrir("delete from recordar_grupos where grupo_id=$id");
	$nada=f_abrir("delete from recordar_compartir where grupo=$id");
	$nada=f_abrir("delete from recordar_subitems WHERE item in (select item_id from recordar_items where grupo=$id)");
	$nada=f_abrir("delete from recordar_items where grupo=$id");
} else if ($request->accion=='compartidos') {
	$grupo=$request->grupo;
	$item=$request->item;
	$t=f_abrir("SELECT * FROM k3_usuarios where usuario_id<>$login_usuario and usuario_id in (select distinct usuario from k3_usuario_empresa where empresa in (select distinct empresa from k3_usuario_empresa where usuario=$login_usuario)) order by usuario");
	while ($r=f_reg($t)){
		$agregable=true;
		if ($item>0){
			if (f_cantidadregistros("select * from recordar_compartir where grupo=$grupo and item=0 and usuario=".$r['usuario_id'])>0) $agregable=false;
		}
		if ($agregable){
			$cant=f_cantidadregistros("select * from recordar_compartir where grupo=$grupo and item=$item and usuario=".$r['usuario_id']);
			$compartido=false; if ($cant>0) $compartido=true;
			$cant=f_cantidadregistros("select * from recordar_compartir where grupo=$grupo and item=$item and modificable>0 and usuario=".$r['usuario_id']);
			$compartido_modificable=false; if ($cant>0) $compartido_modificable=true;
			array_push($recordatorios_compartidos, array("id" =>floatval($r['usuario_id']), "nombre" => $r['usuario'], "compartido" => $compartido, "compartido_modificable" => $compartido_modificable));
		}
	}
} else if ($request->accion=='compartir') {
	$grupo=$request->grupo;
	$item=$request->item;
	$usuarios = json_decode($request->usuarios);
	$cantidad=f_count($usuarios);
	for ($a=0;$a<$cantidad;$a++){
		$usuario=$usuarios[$a]->id;
		$compartido=$usuarios[$a]->compartido;
		$modificable=0; if ($usuarios[$a]->compartido_modificable) $modificable=1;
		$t=f_abrir("SELECT * FROM recordar_compartir where grupo=$grupo and item=$item and usuario=$usuario");
		$estaba=false;
		if ($r=f_reg($t)){ $estaba=true; }
		if ($estaba && !$compartido){ 
			$nada=f_abrir("delete from recordar_compartir where compartir_id=".$r['compartir_id']);
		}elseif (!$estaba && $compartido){ 
			$nada=f_abrir("insert into recordar_compartir (grupo,item,usuario,modificable) values ($grupo,$item,$usuario,$modificable)");
		}elseif ($estaba && $compartido){ 
			$nada=f_abrir("update recordar_compartir set modificable=$modificable where grupo=$grupo and item=$item and usuario=$usuario");
		}
	}	
} else if ($request->accion=='items') {
	$grupo=$request->grupo;
	$es_duenio=$request->es_duenio;
	$in="";
	$modificable=true;
	if ($es_duenio==0) {
		$modificable=false;
		if (f_cantidadregistros("select * from recordar_compartir where grupo=$grupo and usuario=$login_usuario and item=0")==0) {
			$ti=f_abrir("select * from recordar_compartir where grupo=$grupo and usuario=$login_usuario");
			while($ri=f_reg($ti)) {
				if ($in!="") {
					$in.=",";
				} else {
					$in=" AND item_id IN (";
				}
				$in.=$ri["item_id"];
			}
			if ($in!="") $in.=")";
		} else if (f_cantidadregistros("select * from recordar_compartir where grupo=$grupo and usuario=$login_usuario and item=0 and modificable>0")>0) {
			$modificable=true;
		}
	}
	$t=f_abrir("select * from recordar_items where grupo=$grupo $in order by item_nombre");
	while ($r=f_reg($t)){
		$modificable2=$modificable;
		if (!$modificable2 && f_cantidadregistros("select * from recordar_compartir where grupo=$grupo and item=".$r['item_id']." and usuario=$login_usuario and modificable>0")>0) $modificable2=true;
		$cant=f_cantidadregistros("select * from recordar_subitems where item=".$r['item_id']." order by nombre");
		array_push($recordatorios_items, array("id" =>floatval($r['item_id']), "nombre" => $r['item_nombre'], "cantidad" => $cant, "modificable" =>$modificable2));
	}
	
} else if ($request->accion=='items_am') {
	$grupo=$request->grupo;
	$id=$request->id;
	$nombre=$request->nombre;
	if ($id>0){
		$nada=f_abrir("update recordar_items set item_nombre='$nombre' where item_id=$id");
	}else{
		$nada=f_abrir("insert into recordar_items (item_nombre,grupo) values ('$nombre',$grupo)");
	}
} else if ($request->accion=='items_eliminar') {
	$id=$request->id;
	$nada=f_abrir("delete from recordar_items where item_id=$id");
	$nada=f_abrir("delete from recordar_compartir where item=$id");
	$nada=f_abrir("delete from recordar_subitems WHERE item=$id");
} else if ($request->accion=='subitems') {
	$id=$request->id;
	$t=f_abrir("select * from recordar_subitems where item=$id order by nombre");
	while ($r=f_reg($t)){
		array_push($subitems, array("id" =>floatval($r['subitem_id']), "nombre" => $r['nombre'],"valor" =>$r['valor']));
	}
} else if ($request->accion=='subitems_am') {
	$item=$request->item;
	$id=$request->id;
	$nombre=$request->nombre;
	$valor=$request->valor;
	if ($id>0){
		$nada=f_abrir("update recordar_subitems set nombre='$nombre',valor='$valor' where subitem_id=$id");
	}else{
		$nada=f_abrir("insert into recordar_subitems (item,nombre,valor) values ($item,'$nombre','$valor')");
	}
} else if ($request->accion=='subitems_eliminar') {
	$id=$request->id;
	f_abrir("delete from recordar_subitems WHERE subitem_id=$id");
}

exit('{"valores_retorno":'.json_encode($valores_retorno).'
	,"recordatorios":'.json_encode($recordatorios).'
	,"recordatorios_compartidos":'.json_encode($recordatorios_compartidos).'
	,"recordatorios_items":'.json_encode($recordatorios_items).'
	,"subitems":'.json_encode($subitems).'
}');

?>