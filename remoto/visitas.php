<?php
include("a.php");
$listado=array();

if ($request->accion=='nueva_visita') {
	$persona=$request->persona;
	$motivo=$request->motivo;
	$area=$request->area;
    $fecha=f_datetime();
	f_abrir("INSERT INTO visitas (usuario,fecha,persona,motivo,area) VALUES ($login_usuario,'$fecha',$persona,'$motivo',$area) ");
} else if ($request->accion=='consulta') {
	$condiciones=f_consultas_varias_filtro_fechas($request->fechas,"fecha","AND");
    $conector="WHERE";
    if ($condiciones!="") $conector="AND";
    if ($request->area>0) { $condiciones.=" $conector area=".$request->area; $conector="AND"; }
    if ($request->persona>0) { $condiciones.=" $conector persona=".$request->persona; $conector="AND"; }
	$listado=f_traer_datos_tabla("visitas",$condiciones);

}

exit('{"valores_retorno":'.json_encode($valores_retorno).'
	,"listado":'.json_encode($listado).'
}');

?>