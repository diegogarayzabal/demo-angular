<?php
date_default_timezone_set('America/Argentina/Buenos_Aires');

function f_usuario($id=0,$campo="usuario"){
	$t=f_abrir('SELECT * FROM usuarios WHERE usuario_id='.$id);
	if ($r=f_reg($t)){ if ($campo=="todo"){return $r;}else{return $r[$campo];}} else { return ''; }
}

function f_municipio($id,$campo="nombre"){
	$t=f_abrir('SELECT * FROM municipios WHERE municipio_id='.$id);
	if ($r=f_reg($t)){ if ($campo=="todo"){return $r;}else{return $r[$campo];} }else{}
}

function f_provincia_general($id){
	foreach ($_SESSION['provincias'] as $provincia) {
        if ($provincia['id'] == $id) {
            return $provincia['nombre'];
        }
    }
    return '';
}

function f_campo_id_tabla($tabla) {
	$campo_nombre='';
	if ($tabla!="") {
		$result2=f_abrir("describe $tabla");
		if ($row2=$result2->fetch_row()) {
			$campo_nombre=$row2[0];
		}
	}
	return $campo_nombre;
}

function f_registro_eliminar($id,$tabla,$campo_nombre=null) {
	if ($campo_nombre==null || $campo_nombre=="") $campo_nombre=f_campo_id_tabla($tabla);
	if ($campo_nombre!=null) {
		f_abrir("DELETE from $tabla where $campo_nombre=$id");
	}
}

function f_buscar_posicion_en_array($array,$campo_nombre,$valor) {
	$posicion=-1;
	for ($a=0;$a<f_count($array);$a++) {
		if ($array[$a][$campo_nombre]==$valor) $posicion=$a;
	}
	return $posicion;
}

function f_moneda($id){
	if ($id==1) return "Pesos";
	if ($id==2) return "Dólares";
	if ($id==3) return "Euros";
}

function f_actualizar_version($deque,$usuario=0) {
	if ($usuario==0) {
		f_abrir("UPDATE usuarios_logueados set ".$deque."_version=".$deque."_version+1");
	} else {
		f_abrir("UPDATE usuarios_logueados set ".$deque."_version=".$deque."_version+1 where usuario=$usuario");
	}
}

function f_permitidos($usuario){
	$permitidos=array();
	$tpermitidos=f_abrir("SELECT distinct permiso from permitidos where usuario=$usuario");
	while($r=f_reg($tpermitidos)){
		$permitidos[]=$r['permiso'];
	}
	return $permitidos;
}

function f_permitido($permiso){
	$permitido=false;
	for($a=0;$a<f_count($_SESSION['permitidos']);$a++){
		if ($_SESSION['permitidos'][$a]==$permiso){
			$permitido=true;
			break;
		}
	}
	return $permitido;
}

function f_verdadero_falso_a_txt($que){if ($que) { return "true"; }else{ return "false"; }}

function f_usuario_preferencias($id) {
	$datos=f_usuario($id,"todo");
	extract($datos);
	$preferencias = array();
	array_push($preferencias, array(
		"preferencia_menu_estilo"=>floatval($preferencia_menu_estilo)
		,"preferencia_preguntar_recarga"=>($preferencia_preguntar_recarga==1)
		,"preferencia_minutos_bloqueo"=>floatval($preferencia_minutos_bloqueo)
	));
	return $preferencias[0];
}

function f_insert_masivo($listado,$sql_inicial) {
	if ($listado!=null) {
		$contador=0; $sql=$sql_inicial;
		for ($a1=0;$a1<f_count($listado);$a1++) {
			$contador++;
			if ($contador>500) {f_abrir($sql);$sql=$sql_inicial;$contador=1;}
			if ($contador>1) $sql.=",";
			$sql.=$listado[$a1];
		}
		f_abrir($sql);
	}
}

function f_consultas_varias_filtro_fechas($fechas,$campo_nombre="fecha",$conector="AND") {
	$filtro="";
	$datos=json_decode($fechas);
	if ($datos->desde && $datos->hasta) {
		$filtro=" $conector $campo_nombre between '".substr($datos->desde_fecha,0,10)."' and '".substr($datos->hasta_fecha,0,10)."' ";
	} else if ($datos->desde) {
		$filtro=" $conector $campo_nombre>='".substr($datos->desde_fecha,0,10)."' ";
	} else if ($datos->hasta) {
		$filtro=" $conector $campo_nombre<='".substr($datos->hasta_fecha,0,10)."' ";
	}
	if ($filtro!="") $filtro.=" ";
	return $filtro;
}

function f_consultas_varias_filtro_peridos($periodos,$campo_nombre="periodo",$conector="AND") {
	$filtro="";
	$datos=json_decode($periodos);
	if ($datos->uno_solo) {
		$filtro=" $conector $campo_nombre=".$datos->periodo_desde->id;
	} else if ($datos->desde && $datos->hasta) {
		$filtro=" $conector $campo_nombre between ".$datos->periodo_desde->id." and ".$datos->periodo_hasta->id;
	} else if ($datos->desde) {
		$filtro=" $conector $campo_nombre>=".$datos->periodo_desde->id;
	} else if ($datos->hasta) {
		$filtro=" $conector $campo_nombre<=".$datos->periodo_hasta->id;
	}
	if ($filtro!="") $filtro.=" ";
	return $filtro;
}

function f_consultas_varias_filtro_numeros($numeros,$campo_nombre,$conector="AND") {
	$filtro="";
	$datos=json_decode($numeros);
	if ($datos->uno_solo) {
		$filtro=" $conector $campo_nombre=".$datos->desde_numero;
	} else if ($datos->desde_ver && $datos->hasta_ver) {
		$filtro=" $conector $campo_nombre between ".$datos->desde_numero." and ".$datos->hasta_numero;
	} else if ($datos->desde_ver) {
		$filtro=" $conector $campo_nombre>=".$datos->desde_numero;
	} else if ($datos->hasta_ver) {
		$filtro=" $conector $campo_nombre<=".$datos->hasta_numero;
	}
	if ($filtro!="") $filtro.=" ";
	return $filtro;
}


function f_consultas_varias_filtro_perido($periodo,$campo_nombre="periodo",$conector="AND",$comparador="=") {
	$filtro="";
	$datos=json_decode($periodo);
	if ($datos->seleccionado) {
		$filtro=" $conector $campo_nombre $comparador ".$datos->periodo->id;
	}
	if ($filtro!="") $filtro.=" ";
	return $filtro;
}

function f_agregar_permiso($usuario,$permiso) {
	if (f_cantidadregistros("SELECT * from permitidos where usuario=$usuario and permiso='$permiso'")==0) {
		f_abrir("INSERT INTO permitidos (usuario,permiso) values ($usuario,'$permiso')");
	}
}

function f_mail_estilo_cabecera_azul() {
	return 'style="padding: 0;
			vertical-align: middle;
			border-top: 1px solid #dee2e6;
			border: 1px solid #000;
			text-align: center;
			padding-left: 3px;
			padding-right: 3px;
			background-image: linear-gradient(blue, #00b5e2);
			"';
}

function f_mail_estilo_tabla() {
	return 'style="
			box-sizing: border-box;
			margin-left: 0;
			border: none;
			border-collapse: collapse;
			color: #212529;
			"';
}

function f_mail_estilo_tr() {
	return ' style="border: 1px solid black;"';
}

function f_mail_estilo_td() {
	return 'style="
			box-sizing: border-box;
			margin-left: 0;
			border: none;
			border-collapse: collapse;
			color: #212529;
			"';
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
function f_enviar_mail($parametros) {
	require("PHPMailer/src/PHPMailer.php");
	$asunto="";
	$html="";
	$nombre_archivo="archivo.pdf";
	$archivo=$parametros->archivo;

	$retorno["enviado"]=false;
	$retorno["error"]=null;
	try {
		$mail = new PHPMailer(true);
		$mail->isSMTP();
		$mail->SMTPDebug = 0;
		$mail->SMTPAuth = true;
		$mail->CharSet = 'UTF-8';  // Establecer la codificación correcta
		$mail->Encoding = 'base64';

		if ($_SESSION['mail_host']!=null && $_SESSION['mail_host']!="" && $parametros->accion!='enviar_mail_reporte_error') {
			$mail->Host = $_SESSION['mail_host'];
			$mail->Port = $_SESSION['mail_puerto'];
			$mail->Username = $_SESSION['mail_usuario'];
			$mail->Password = $_SESSION['mail_password'];
			$mail->addReplyTo($_SESSION['mail_cuenta'],$_SESSION['empresa_nombre']);
			$mail->setFrom($_SESSION['mail_cuenta'],$_SESSION['empresa_nombre']);
			$mail->SMTPSecure=$_SESSION['mail_SMTPSecure'];
		} else {
			$mail->Host = 'smtp.ionos.com';
			$mail->SMTPSecure = 'tls';
			$mail->Port = 587;
			$mail->Username = 'no-reply@konsulti.net';
			$mail->Password = 'Agarrameesta01';
			$mail->setFrom('no-reply@konsulti.net', 'Konsulti');
			$mail->addReplyTo($_SESSION['empresa_mail'],$_SESSION['empresa_nombre']);
		}

		include("_mysql_modo.php");
		if ($parametros->accion=='enviar_mail_reporte_error') {
			$mail->addAddress('konsultisas@gmail.com','Errores');
		} else {
			//if (1==1) {
			if (!$modo_servidor){
				$mail->addAddress('konsultisas@gmail.com','Prueba');
				$asunto="MODO PRUEBA: ".$asunto;
			} else {
				for ($a=0;$a<f_count($cuentas);$a++) {
					if ($cuentas[$a]->modo==0) $mail->addAddress($cuentas[$a]->mail,$cuentas[$a]->nombre);
					if ($cuentas[$a]->modo==1) $mail->addCC($cuentas[$a]->mail,$cuentas[$a]->nombre);
					if ($cuentas[$a]->modo==3) $mail->addBCC($cuentas[$a]->mail,$cuentas[$a]->nombre);
				}
				if ($parametros->accion=='nuevo_pedido_de_cliente') {
					$tu=f_abrir("SELECT mail,usuario FROM k3_usuarios where usuario_id=".$_SESSION['login_usuario']);
					if ($ru=f_reg($tu)) {
						if ($ru["mail"]!="") $mail->addCC($ru["mail"],$ru["usuario"]);
					}
				}
			}
			if ($archivo!=null) $mail->addStringAttachment(base64_decode($archivo),$nombre_archivo);
		}
		$mail->Subject=$asunto;
		$mail->IsHTML(true);
		$mail->Body = $html;
		$mail->AltBody = ' ';
		$mail->msgHTML($html);
		$mail->send();
		$retorno["enviado"]=true;
	} catch (Exception $e) {
		$retorno["error"]=$mail->ErrorInfo; //Pretty error messages from PHPMailer
  	} catch (Exception $e) {
		$retorno["error"]=$e->getMessage(); //Boring error messages from anything else!
  	}
	return $retorno;
}

function f_log_nuevo($tabla='',$id=0,$texto='',$accion_0_es_carga=0,$fecha=null,$usuario=null) {
	if ($fecha==null) $fecha=f_datetime();
	if ($usuario==null) $usuario=$_SESSION['login_usuario'];
	f_abrir("INSERT INTO logs (tabla,id,fecha,texto,usuario,accion) values ('$tabla',$id,'$fecha','$texto',$usuario,$accion_0_es_carga) ");
}

function f_monedas(){
	$monedas=array();
	array_push($monedas, array("id" =>1,"nombre"=>"Pesos"));
	array_push($monedas, array("id" =>2,"nombre"=>"Dólares"));
	array_push($monedas, array("id" =>3,"nombre"=>"Euros"));
	return $monedas;
}

function f_municipios(){
	$datos=array();
	$tp=f_abrir("SELECT * from municipios");
	while($rp=f_reg($tp)){
		extract($rp);
		array_push($datos, array("id"=>floatval($municipio_id)
			,"provincia"=>floatval($provincia)
			,"cuit"=>floatval($cuit)
			,"nombre"=>$nombre 
			,"nombre_municipio"=>$nombre_municipio 
		));
	}
	return $datos;
}

function f_personas($posterior_a_version){
	$personas = array();
	$t=f_abrir("SELECT * from personas WHERE actualizacion_version>$posterior_a_version");
	while ($r=f_reg($t)){
		array_push($personas, array("id"=>floatval($r['persona_id'])
			,"doc_tipo"=>floatval($r['doc_tipo'])
			,"doc_numero"=>$r['doc_numero']
			,"nombre"=>$r['nombre']
			,"telefono"=>$r['telefono']
			,"domicilio"=>$r['domicilio']
			,"correo_electronico"=>$r['correo_electronico']
			,"actualizacion_version"=>floatval($r['actualizacion_version'])
		));
	}
	
	return $personas;
}

function f_usuarios_empresa() {
	$usuarios=array();
	$t=f_abrir("select * from k3_usuarios order by usuario");
	while ($r=f_reg($t)){
		if (f_cantidadregistros("SELECT * FROM usuario_empresa where usuario=".$r["usuario_id"])>0) {
			array_push($usuarios, array("id"=>floatval($r['usuario_id'])
			,"cuil"=>floatval($r['cuit'])
			,"nombre"=>$r['usuario']
			,"mail"=>f_usuario($r['usuario_id'],"mail")
			));
		}
	}
	return $usuarios;
}

function f_abrir_conexion(){
	$Konfig =require __DIR__ . '/../konsulti_seguro/config_ortizramondelli.php';
	$Base=$Konfig["Cnx_Base"];
	$Usuario=$Konfig["Cnx_Usuario"];
	$Password=$Konfig["Cnx_Password"];
	$Servidor=$Konfig["Cnx_Servidor"];
	$vCX= new mysqli($Servidor,$Usuario,$Password,$Base);
	if ($vCX -> connect_errno){ die("Error de Conexión servidor=$Servidor usuario=$Usuario base=$Base (" .$vCX -> connect_errno. ") ". $vCX -> connect_errno." sql=".$Sql); return 0;}
	mysqli_set_charset($vCX, "utf8");
	return $vCX;
}

function f_cerrar_conexion($conexion) {
	$conexion->close();
}

function f_abrir($Sql){
	$retornar=null;
	if ($vSQL=$_SESSION['conexion']->query($Sql)) {
		$comando=strtoupper(substr($Sql,0,6));
		if ($comando=="INSERT"){
			$vr=$_SESSION['conexion']->insert_id;
			$retornar=$vr;
		} else if ($comando=="UPDATE" || $comando=="DELETE") {
			$retornar=$_SESSION['conexion']->affected_rows;
		} else {
			$retornar=$vSQL;
		}
	} else {
		$_SESSION['sql_error']=true;
		$_SESSION['sql_error_listado'][]=$Sql;
		return 0;
	}
	return $retornar;
}

function f_cerrar($cual){
	if ($cual) $cual->close();
}

function f_cantidadregistros($pSql){
	$t=f_abrir($pSql);
	$cantidad=mysqli_num_rows($t);
	
	return $cantidad;
}

function f_reg($SQL){
//	return $SQL->fetch_assoc();
	return mysqli_fetch_array($SQL, MYSQLI_ASSOC);
}


function f_sql_grabar($listado,$sql_inicial) {
	if ($listado!=null) {
		$contador=0; $sql=$sql_inicial;
		for ($a1=0;$a1<f_count($listado);$a1++) {
			$contador++;
			if ($contador>500) {
				f_abrir($sql);
				$sql=$sql_inicial;$contador=1;}
			if ($contador>1) $sql.=",";
			$sql.=$listado[$a1];
		}
		f_abrir($sql);
		usleep(10);
	}
}

function alert($t){	echo "<script>window.alert('".$t."');</script>"; }
function redondear($importe,$hace_redondeo=true,$decimales=2) {
	if ($hace_redondeo) {
		$multiplicador=pow(10,$decimales);
		return (round($importe*$multiplicador)/$multiplicador);
	}else{
		$esta=false;
		$limite=0;
		$cadena=$importe."";
		$resultado="";
		for ($a=0;$a<strlen($cadena);$a++){
			if (substr($cadena,$a,1)=="."){ $limite=$a+2; $esta=true; }
			$resultado.=substr($cadena,$a,1);
			if ($esta && $limite<=$a) break;
		}
		return $resultado;
	}
}
function f_mysql_a_php($fecha){    return substr($fecha,8,2)."/".substr($fecha,5,2)."/".substr($fecha,0,4);}
function f_mysqldatetime_a_php($fecha,$con_horario=0){
	if ($con_horario==2){
		return substr($fecha,8,2)."/".substr($fecha,5,2)."/".substr($fecha,0,4).substr($fecha,10,9);
	}else if ($con_horario==1){
		return substr($fecha,8,2)."/".substr($fecha,5,2)."/".substr($fecha,0,4).substr($fecha,10,6);
	}else{
		return substr($fecha,8,2)."/".substr($fecha,5,2)."/".substr($fecha,0,4);
	}
}
function f_php_a_mysql($fecha){    return substr($fecha,6,4)."-".substr($fecha,3,2)."-".substr($fecha,0,2);}
function f_diadelasemana($fecha){    return date('w', mktime(0,0,0,substr($fecha,5,2),substr($fecha,8,2),substr($fecha,0,4))); }
function f_datetime(){
        $vf=getdate(time());
        $r=$vf['year']."-";
        if ($vf['mon']<10){ $r .= "0"; }
        $r .=$vf['mon']."-";
        if ($vf['mday']<10){ $r .= "0"; }
        $r .=$vf['mday'];
		$r.=" ".date("H:i:s");
        return $r;
}
function f_date(){
        $vf=getdate(time());
        $r=$vf['year']."-";
        if ($vf['mon']<10){ $r .= "0"; }
        $r .=$vf['mon']."-";
        if ($vf['mday']<10){ $r .= "0"; }
        $r .=$vf['mday'];
        return $r;
}
function f_hoy($d=0){
	if ($d==0){
		return f_mysql_a_php(f_date());
	}else{
		return f_mysql_a_php(f_fechadesplazada(f_date(),$d));
	}
}

function f_fechadesplazada($f,$desplazo){
    $a=round(substr($f,0,4));
    $m=round(substr($f,5,2));
    $d=round(substr($f,8,2));
    if ($desplazo>0){
        for ($desp=0; $desp<$desplazo; $desp++){
            if ($d==f_ultimodia($a,$m)){
                $d=1;
                if ($m==12){
                    $m=1;
                    $a++;
                }else{
                    $m++;
                }
            }else{
                $d++;
            }
        }
    }else if ($desplazo<0){
        $desplazo=$desplazo*(-1);
        for ($desp=0; $desp<$desplazo; $desp++){
            if ($d==1){
                if ($m==1){
                    $m=12;
                    $a--;
                }else{
                    $m--;
                }
                $d=f_ultimodia($a,$m);
            }else{
                $d--;
            }
        }
    }
    $r=$a."-";
    if ($m<10) $r.="0";
    $r.=$m."-";
    if ($d<10) $r.="0";
    $r.=$d;
    return $r;
}

function f_fechadesplazadahabiles($f,$desplazo){
    $a=round(substr($f,0,4));
    $m=round(substr($f,5,2));
    $d=round(substr($f,8,2));
    if ($desplazo>0){
        for ($desp=0; $desp<$desplazo; $desp++){
            if ($d==f_ultimodia($a,$m)){
                $d=1;
                if ($m==12){
                    $m=1;
                    $a++;
                }else{
                    $m++;
                }
            }else{
                $d++;
            }
			$r=$a."-";
			if ($m<10) $r.="0";
			$r.=$m."-";
			if ($d<10) $r.="0";
			$r.=$d;
			if (f_diadelasemana($r)>0 && f_diadelasemana($r)<6){
			}else{
				$desplazo++;
			}
        }
    }else if ($desplazo<0){
        $desplazo=$desplazo*(-1);
        for ($desp=0; $desp<$desplazo; $desp++){
            if ($d==1){
                if ($m==1){
                    $m=12;
                    $a--;
                }else{
                    $m--;
                }
                $d=f_ultimodia($a,$m);
            }else{
                $d--;
            }
			$r=$a."-";
			if ($m<10) $r.="0";
			$r.=$m."-";
			if ($d<10) $r.="0";
			$r.=$d;
        }
    }
    return $r;
}

function f_periodo_desplazar($p,$cantidad) {
	$anio=substr($p,0,4)*1;
	$mes=substr($p,4,2)*1;
	if ($cantidad>0) {
		while($cantidad>=12) {
			$anio++;
			$cantidad-=12;
		}
		if ($mes+$cantidad>12) {
			$anio++;
			$mes=$mes+$cantidad-12;
		} else {
			$mes+=$cantidad;
		}
	} else if ($cantidad<0) {
		$cantidad=$cantidad*-1;
		while($cantidad>=12) {
			$anio--;
			$cantidad-=12;
		}
		if ($mes-$cantidad<1) {
			$anio--;
			$mes=$mes-$cantidad+12;
		} else {
			$mes-=$cantidad;
		}
	}
	return ($anio*100)+$mes;
}

function f_periodo_ultimodia($p) { return f_ultimodia(substr($p,0,4),substr($p,4,2)); }

function f_esfechahabil($f){
	if (f_diadelasemana($f)>0 && f_diadelasemana($f)<6){
		$habil=true;
	}else{
		$habil=false;
	}
    return $habil;
}

function f_ultimodia($anho,$mes){
   if (((fmod($anho,4)==0) and (fmod($anho,100)!=0)) or (fmod($anho,400)==0)) {
       $dias_febrero = 29;
   } else {
       $dias_febrero = 28;
   }
   switch($mes) {
       case 1: return 31; break;
       case 2: return $dias_febrero; break;
       case 3: return 31; break;
       case 4: return 30; break;
       case 5: return 31; break;
       case 6: return 30; break;
       case 7: return 31; break;
       case 8: return 31; break;
       case 9: return 30; break;
       case 10: return 31; break;
       case 11: return 30; break;
       case 12: return 31; break;
   }
}
function f_numerico($n,$decimales=2,$mostrar_decimales_si_es_cero=true){
	if ($decimales>0) {
		if (redondear($n,true,$decimales)==redondear($n,true,0) && !$mostrar_decimales_si_es_cero) {
			return number_format($n,0,",",".");
		} else {
			return number_format($n,$decimales,",",".");
		}
	} else {
		return number_format($n,0,",",".");
	}
}
function f_numerico2($n){	return number_format($n,2,".","");}
function f_sincomillas($texto){	$texto=str_replace('"',"",$texto);	$texto=str_replace("'","",$texto);	return $texto;}
function f_sincomillas_ni_acentos($texto){
	$texto=str_replace('"'," ",$texto);
	$texto=str_replace("'"," ",$texto);
	$texto=str_replace('á',"a",$texto);
	$texto=str_replace('é',"e",$texto);
	$texto=str_replace('í',"i",$texto);
	$texto=str_replace('ó',"o",$texto);
	$texto=str_replace('ú',"u",$texto);
	$texto=str_replace('Á',"A",$texto);
	$texto=str_replace('É',"E",$texto);
	$texto=str_replace('Í',"I",$texto);
	$texto=str_replace('Ó',"O",$texto);
	$texto=str_replace('Ú',"U",$texto);
	$texto=str_replace('Ñ',"N",$texto);
	$texto=str_replace('ñ',"n",$texto);
	return $texto;
}
function f_sincomillas_ni_caracteres_raros($texto){
	$texto=preg_replace('([^A-Za-z0-9 @\á\é\í\ó\ú\Á\É\Í\Ó\ÚñÑ\.\,\-\<\>\!\%\$\/\&\(\)\=\+\-\*\:\;\_])', '', $texto);
	$texto=str_replace('	',"",$texto);
	return $texto;
}
function f_json_a_fecha($fecha){	return substr($fecha,0,4)."-".substr($fecha,4,2)."-".substr($fecha,6,2)." ".substr($fecha,8,2).":".substr($fecha,10,2).":".substr($fecha,12,2);}
function f_fecha_a_json($fecha){	return substr($fecha,0,4).substr($fecha,5,2).substr($fecha,8,2).substr($fecha,11,2).substr($fecha,14,2).substr($fecha,17,2);}
function f_numero_a_horas($n){
	$hora=0;
	while($n>=60){
		$hora++;
		$n=$n-60;
	}
	$r="";
	if ($hora<10) $r.="0";
	$r.=$hora.":";
	if ($n<10) $r.="0";
	$r.=$n.":00";
	return $r;
}
function f_sino($si){	if ($si){ return "Si"; }else{ return "No"; }}
function f_anios($inicio,$fin){
	$dia=substr($fin,8,2)*1;
	$mes=substr($fin,5,2)*1;
	if ($dia>28 && $mes==2) $fin=substr($fin,0,8)."28";
	$anio_inicio=substr($inicio,0,4)*1;
	$anio_fin=substr($fin,0,4)*1;
	$anios=0;
	while ($anio_fin>$anio_inicio){
		$anioanterior=$anio_fin-1;
		$nuevofin=$anioanterior.substr($fin,4,6);
		if ($nuevofin>=$inicio) $anios++;
		$anio_fin--;
	}
	return $anios;
}
function f_mes($m){
	if ($m==1) return "Enero";
	if ($m==2) return "Febrero";
	if ($m==3) return "Marzo";
	if ($m==4) return "Abril";
	if ($m==5) return "Mayo";
	if ($m==6) return "Junio";
	if ($m==7) return "Julio";
	if ($m==8) return "Agosto";
	if ($m==9) return "Septiembre";
	if ($m==10) return "Octubre";
	if ($m==11) return "Noviembre";
	if ($m==12) return "Diciembre";
}
function f_convertir_a_letras($numero){
	$numero=round($numero,2);
	$num_letras="";
	if ($numero < 1000000000){
		if ($numero >= 100000000){
			$millones=substr($numero,0,3);
			$numero=$numero-($millones*1000000);
			if ($num_letras<>"") $num_letras.=" ";
			$num_letras.=f_centenas($millones)." millones";
		}else if ($numero >= 10000000){
			$millones=substr($numero,0,2);
			$numero=$numero-($millones*1000000);
			if ($num_letras<>"") $num_letras.=" ";
			$num_letras.=f_decenas($millones)." millones";
		}else if ($numero >= 1000000 && $numero<2000000){
			$millones=substr($numero,0,1);
			$numero=$numero-1000000;
			if ($num_letras<>"") $num_letras.=" ";
			$num_letras.="un millon";
		}else if ($numero >= 1000000){
			$millones=substr($numero,0,1);
			$numero=$numero-($millones*1000000);
			if ($num_letras<>"") $num_letras.=" ";
			$num_letras.=f_decenas($millones)." millones";
		}
		if ($numero >= 100000){
			$millones=substr($numero,0,3);
			$numero=$numero-($millones*1000);
			if ($num_letras<>"") $num_letras.=" ";
			$num_letras.=f_centenas($millones)." mil";
		}else if ($numero >= 10000){
			$millones=substr($numero,0,2);
			$numero=$numero-($millones*1000);
			if ($num_letras<>"") $num_letras.=" ";
			$num_letras.=f_decenas($millones)." mil";
		}else if ($numero >= 1000 && $numero<2000){
			$millones=substr($numero,0,1);
			$numero=$numero-1000;
			if ($num_letras<>"") $num_letras.=" ";
			$num_letras.="un mil";
		}else if ($numero >= 1000){
			$millones=substr($numero,0,1);
			$numero=$numero-($millones*1000);
			if ($num_letras<>"") $num_letras.=" ";
			$num_letras.=f_decenas($millones)." mil";
		}
		if ($numero >= 100){
			$millones=substr($numero,0,3);
			$numero=$numero-($millones);
			if ($num_letras<>"") $num_letras.=" ";
			$num_letras.=f_centenas($millones);
		}else if ($numero >= 10){
			$millones=substr($numero,0,2);
			$numero=$numero-$millones;
			if ($num_letras<>"") $num_letras.=" ";
			$num_letras.=f_decenas($millones);
		}else if ($numero >= 1 && $numero<2){
			$millones=substr($numero,0,1);
			$numero=$numero-1;
			if ($num_letras<>"") $num_letras.=" ";
			$num_letras.="uno";
		}else if ($numero >= 1){
			$millones=substr($numero,0,1);
			$numero=$numero-($millones);
			if ($num_letras<>"") $num_letras.=" ";
			$num_letras.=f_decenas($millones);
		}
		$numero=round($numero*100,0);
		if ($numero>=1){
			if ($num_letras<>"") $num_letras.=" con ";
			if ($numero<2){
				$num_letras.=" un centavo";
			}else{
				if ($numero>9){ $dec=substr($numero,0,2);}else{ $dec=substr($numero,0,1); }
				$num_letras.=f_decenas($dec,false)." centavos";
			}
		}
	}
	return $num_letras;

}
function f_centenas($nro,$uno=true){
	$decena=substr($nro,1,2);
	if ($nro==100){ return "cien";
	}else if ($nro<200){ return "ciento ".f_decenas($decena,$uno);
	}else if ($nro>=900){ return "novecientos ".f_decenas($decena,$uno);
	}else if ($nro>=800){ return "ochocientos ".f_decenas($decena,$uno);
	}else if ($nro>=700){ return "setecientos ".f_decenas($decena,$uno);
	}else if ($nro>=600){ return "seiscientos ".f_decenas($decena,$uno);
	}else if ($nro>=500){ return "quinientos ".f_decenas($decena,$uno);
	}else if ($nro>=400){ return "cuatrocientos ".f_decenas($decena,$uno);
	}else if ($nro>=300){ return "trescientos ".f_decenas($decena,$uno);
	}else if ($nro>=200){ return "doscientos ".f_decenas($decena,$uno);
	}
}
function f_decenas($nro,$uno=true){
	if ($nro<30){
		if ($nro==1){ if ($uno){ return "uno"; }else{ return "un"; } }
		if ($nro==2) return "dos";
		if ($nro==3) return "tres";
		if ($nro==4) return "cuatro";
		if ($nro==5) return "cinco";
		if ($nro==6) return "seis";
		if ($nro==7) return "siete";
		if ($nro==8) return "ocho";
		if ($nro==9) return "nueve";
		if ($nro==10) return "diez";
		if ($nro==11) return "once";
		if ($nro==12) return "doce";
		if ($nro==13) return "trece";
		if ($nro==14) return "catorce";
		if ($nro==15) return "quince";
		if ($nro==16) return "dieciseis";
		if ($nro==17) return "diecisiete";
		if ($nro==18) return "dieciocho";
		if ($nro==19) return "diecinueve";
		if ($nro==20) return "veinte";
		if ($nro==21) return "veintiuno";
		if ($nro==22) return "veintidos";
		if ($nro==23) return "veintitres";
		if ($nro==24) return "veinticuatro";
		if ($nro==25) return "veinticinco";
		if ($nro==26) return "veintiseis";
		if ($nro==27) return "veintisiete";
		if ($nro==28) return "veintiocho";
		if ($nro==29) return "veintinueve";
	}else if ($nro==30){
		return "treinta";
	}else if ($nro<40){
		return "treinta y ".f_decenas(substr($nro,1,1),$uno);
	}else if ($nro==40){
		return "cuarenta";
	}else if ($nro<50){
		return "cuarenta y ".f_decenas(substr($nro,1,1),$uno);
	}else if ($nro==50){
		return "cincuenta";
	}else if ($nro<60){
		return "cincuenta y ".f_decenas(substr($nro,1,1),$uno);
	}else if ($nro==60){
		return "sesenta";
	}else if ($nro<70){
		return "sesenta y ".f_decenas(substr($nro,1,1),$uno);
	}else if ($nro==70){
		return "setenta";
	}else if ($nro<80){
		return "setenta y ".f_decenas(substr($nro,1,1),$uno);
	}else if ($nro==80){
		return "ochenta";
	}else if ($nro<90){
		return "ochenta y ".f_decenas(substr($nro,1,1),$uno);
	}else if ($nro==90){
		return "noventa";
	}else{
		return "noventa y ".f_decenas(substr($nro,1,1),$uno);
	}
}
function f_verdadero($que){
	if ($que>0){ return true;} else{ return false; }
}
function f_fecha_sin_guiones($f){ return substr($f,0,4).substr($f,5,2).substr($f,8,2); }
function f_rellenar_caracteres($que,$cuantos,$caracter="0",$adelante=true){
	$dato=$que."";
	$agregar=$cuantos-strlen($dato);
	$rellenar="";
	while($agregar>0){ $rellenar.=$caracter; $agregar--; }
	if ($adelante){
		return $rellenar.$dato;
	}else{
		return $dato.$rellenar;
	}
}

function f_diferencia_dias($fecha1,$fecha2){
	$datetime1 = new DateTime($fecha1);
	$datetime2 = new DateTime($fecha2);
	$interval = $datetime1->diff($datetime2);
	$dias=$interval->days;
	if ($fecha1>$fecha2){
		return 0-$dias;
	}else if ($fecha1<$fecha2){
		return $dias;
	}else{
		return 0;
	}
}

function f_count($que) {
	if ($que==null) {
		return 0;
	} else {
		return count($que);
	}

}

function f_in($variable,$valores) {
	$estaba=false;
	for ($a=0;$a<f_count($valores);$a++) {
		if ($valores[$a]==$variable) $estaba=true;
	}
	return $estaba;
}

function f_not_in($variable,$valores) {
	$no_estaba=true;
	for ($a=0;$a<f_count($valores);$a++) {
		if ($valores[$a]==$variable) $no_estaba=false;
	}
	return $no_estaba;
}

function f_tabla_estructura($tabla) {
	//traigo la estructura de una tabla, me sirve para no consultar permanentemente esto
	//luego el dato se usa en la función f_acomodar_registro como parámetro para que no lo busque
	//es un array con todos los campos indicando verdadero o falso para indicar si es numérico el dato para enviarlo con floatval()
	$estructura=array();
	$result2=f_abrir("describe $tabla");
	while ($row2=$result2->fetch_row()) {
		if (substr($row2[1],0,3)=="int" || substr($row2[1],0,6)=="double" || substr($row2[1],0,7)=="decimal") {
			array_push($estructura, array("campo"=>$row2[0],"es_numero"=>true));
		} else {
			array_push($estructura, array("campo"=>$row2[0],"es_numero"=>false));
		}
	}
	return $estructura;
}

function f_acomodar_registro($r,$tabla,$estructura=null) {
	if ($r==null || $tabla==null) {
		$r=null;
	} else if ($estructura==null) {
		$result2=f_abrir("describe $tabla");
		while ($row2=$result2->fetch_row()) {
			if (substr($row2[1],0,3)=="int" || substr($row2[1],0,6)=="double" || substr($row2[1],0,7)=="decimal") {
				$r[$row2[0]]=floatval($r[$row2[0]]);
			}
		}
	} else {
		for ($a=0;$a<f_count($estructura);$a++) {
			if ($estructura[$a]["es_numero"]) $r[$estructura[$a]["campo"]]=floatval($r[$estructura[$a]["campo"]]);
		}
	}
	return $r;
}

function f_traer_datos_tabla($tabla,$condiciones) {
	$datos=array();
	$sql="SELECT * FROM $tabla ";
	if ($condiciones!="") $sql.="WHERE $condiciones";
	$t=f_abrir($sql);
	if ($r=f_reg($t)) {
		$estructura=f_tabla_estructura($tabla);
		do {
			$r=f_acomodar_registro($r,$tabla,$estructura);
			array_push($datos,$r);
		} while($r=f_reg($t));
	} 
	return $datos;

}

function f_persona($id){
	$nombre="";
	$t=f_abrir("SELECT * from personas WHERE persona_id=$id");
	if ($r=f_reg($t)){
		$nombre=$r["nombre"];
	}
	
	return $nombre;
}

function f_area($id){
	$nombre="";
	$t=f_abrir("SELECT * from areas WHERE area_id=$id");
	if ($r=f_reg($t)){
		$nombre=$r["nombre"];
	}
	
	return $nombre;
}

?>