<?php
include("a.php");
$dato=null;
$listado=array();
$notas=array();
$estados=array();

if ($request->accion=='nuevo_caso') {
	$persona=$request->persona;
	$referente=$request->referente;
	$nombre=$request->nombre;
	$contraparte=$request->contraparte;
	$numero=$request->numero;
	$area=$request->area;
    $estado=$request->estado;
    $fecha=f_date();
    $fechayhora=f_datetime();
	$caso_id=f_abrir("INSERT INTO casos (persona,referente,area,nombre,contraparte,numero,estado) VALUES ($persona,$referente,$area,'$nombre','$contraparte','$numero',$estado) ");
    f_abrir("INSERT INTO casos_estados (caso,estado,usuario,fecha,fecha_carga) VALUES ($caso_id,$estado,$login_usuario,'$fecha','$fechayhora')");
} else if ($request->accion=='consulta') {
    $conector="";
    $condiciones='';
    if ($request->persona>0) { $condiciones.=" $conector persona=".$request->persona; $conector="AND"; }
    if ($request->referente>0) { $condiciones.=" $conector referente=".$request->referente; $conector="AND"; }
    if ($request->area>0) { $condiciones.=" $conector area=".$request->area; $conector="AND"; }
    if ($request->estado>0) { $condiciones.=" $conector estado=".$request->estado; $conector="AND"; }
	$listado=f_traer_datos_tabla("casos",$condiciones);
} else if ($request->accion=='caso_modificar') {
    $id=$request->id;
	$referente=$request->referente;
	$nombre=$request->nombre;
	$contraparte=$request->contraparte;
	$numero=$request->numero;
	$area=$request->area;
    $fecha=f_date();
    $fechayhora=f_datetime();
    $t=f_abrir("SELECT * FROM casos WHERE caso_id=$id");
    $r=f_reg($t); 
    $modificado='';
    if ($referente!=$r["referente"]) {
        if ($r["referente"]==0) {
            $modificado.='Asignó el referente';
        } else if ($referente==0) {
            $modificado.='Sacó como referente a '.f_persona($r["referente"]);
        } else {
            $modificado.='Cambió el referente antes era '.f_persona($r["referente"]);
        }
    }
    if ($nombre!=$r["nombre"]) {
        if ($modificado!="") $modificado.="; y ";
        $modificado.="Cambió el nombre, antes era ".$r["nombre"];
    }
    if ($numero!=$r["numero"]) {
        if ($modificado!="") $modificado.="; y ";
        if ($r["numero"]=="") {
            $modificado.="Cargó el número de expediente";
       } else {
            $modificado.="Cambió el número de expediente, antes era ".$r["numero"];
        }
    }
    if ($contraparte!=$r["contraparte"]) {
        if ($modificado!="") $modificado.="; y ";
        $modificado.="Cambió la contraparte, antes era ".$r["contraparte"];
    }
    if ($area!=$r["area"]) {
        if ($modificado!="") $modificado.="; y ";
        $modificado.="Cambió el área, antes era ".f_area($r["area"]);
    }
    if ($modificado!='') {
	    f_abrir("UPDATE casos SET referente=$referente,area=$area,nombre='$nombre',numero='$numero',contraparte='$contraparte' WHERE caso_id=$id");
        f_abrir("INSERT INTO casos_notas (caso,texto,usuario,fecha) VALUES ($id,'$modificado',$login_usuario,'$fechayhora')");
    }
} else if ($request->accion=='caso_nueva_nota') {
    $id=$request->id;
	$texto=$request->texto;
    $fechayhora=f_datetime();
    f_abrir("INSERT INTO casos_notas (caso,texto,usuario,fecha) VALUES ($id,'$texto',$login_usuario,'$fechayhora')");
} else if ($request->accion=='caso_nuevo_estado') {
    $id=$request->id;
	$estado=$request->estado;
    $fechayhora=f_datetime();
    $fecha=f_date();
    f_abrir("INSERT INTO casos_estados (caso,estado,usuario,fecha,fecha_carga) VALUES ($id,$estado,$login_usuario,'$fecha','$fechayhora')");
} else if ($request->accion=='traer_uno') {
    $id=$request->id;
    $listado=f_traer_datos_tabla("casos","caso_id=$id");
    $dato=$listado[0];
    $notas=f_traer_datos_tabla("casos_notas","caso=$id");
    $estados=f_traer_datos_tabla("casos_estados","caso=$id");
}

exit('{"valores_retorno":'.json_encode($valores_retorno).'
	,"listado":'.json_encode($listado).'
    ,"notas":'.json_encode($notas).'
    ,"estados":'.json_encode($estados).'
    ,"dato":'.json_encode($dato).'
}');

?>