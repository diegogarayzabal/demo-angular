<?php
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
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require("PHPMailer/src/PHPMailer.php");
require_once("PHPMailer/src/Exception.php");
require_once("PHPMailer/src/SMTP.php");   

$JSON = file_get_contents("php://input");
$encontro=0;
$usuario_id_logueado=0;
$codigo_generado=0;
$usuario_preferencias=array();
$valores_retorno=null;
$valores_retorno['texto']="";
$valores_retorno['modo_asalto']=false;
$valores_retorno['sesion_iniciada_en_otro_equipo']=false;
$valores_retorno['en_mantenimiento']=false;
$valores_retorno['actualizar_parametros']=false;
$sesion=0;

$municipios=array();

if(!$JSON){
	exit('{"valores_retorno":'.json_encode($valores_retorno).'
		,"encontro":'.$encontro.'
		,"usuario":'.$usuario_id_logueado.'
		,"codigo":'.$codigo_generado.'
		,"municipios":'.json_encode($municipios).'
	}');
}

$request = json_decode($JSON);

$error=null;

if ($request->accion=='logout') {
	f_abrir("DELETE FROM usuarios_logueados WHERE sesion=".$request->sesion);
} else if ($request->accion=='login') {
	$cuit=$request->cuit;
	$clave=$request->clave;
	$cambiar=$request->cambiar;
	$clave_nueva=$request->clave_nueva;
	$cambiar_mail=$request->cambiar_mail;
	$pmail=$request->mail;
	if (!$cambiar) {
		$t=f_abrir("select * from usuarios where cuit=$cuit and password='$clave'");
		if ($r=f_reg($t)){
			if ($r['forzar_cambio']>0){
				$encontro=2;
			}else if ($r['mail']=='' && !$cambiar_mail){
				$encontro=3;
			}else{
				$encontro=1;
				$usuario_id_logueado=floatval($r['usuario_id']);
				$usuario_preferencias=f_usuario_preferencias($usuario_id_logueado);
			}
		}
	}else{
		$t=f_abrir("select * from usuarios where cuit=$cuit and password='$clave'");
		if ($r=f_reg($t)){
			$usuario_id_logueado=floatval($r['usuario_id']);
			f_abrir("update usuarios set password='$clave_nueva',forzar_cambio=0 where usuario_id=$usuario_id_logueado");
			$encontro=1;
		}
	}
	if ($encontro==1 && $cambiar_mail) f_abrir("update usuarios set mail='$pmail' where usuario_id=$usuario_id_logueado");
	if ($encontro==1 && $cambiar_mail && $r['mail']!='') {
		$encontro=4;
		extract($r);
		$codigo_generado=mt_rand(1000000,9999999);
		$password=md5($codigo_generado);
		$id=$usuario_id;
		f_abrir("update usuarios set password='$password',forzar_cambio=1 where usuario_id=$id");
		$email=$pmail;

		$mail = new PHPMailer(true);
		$mail->isSMTP();
		$mail->SMTPDebug = 0;
		$html="Estimado/a <b>$usuario</b><br><br>Debido al cambio de cuenta de correo electr&oacute;nico, se procedi&oacute; a generar una nueva contrase&ntilde;a que deber&aacute; ser modificada.<br><br>Debe ingresar con su CUIT/CUIL <b>$cuit</b>, e ingresar como contrase&ntilde;a <b>$codigo_generado</b><br><br>Gracias por elegir Sistemas Konsulti.";
		$mail->Host = $_SESSION['mail_host'];
		$mail->Port = $_SESSION['mail_puerto'];
		$mail->SMTPAuth = true;
		$mail->Username = $_SESSION['mail_usuario'];
		$mail->Password = $_SESSION['mail_password'];
		$mail->setFrom($_SESSION['mail_cuenta'],$_SESSION['empresa_mail']);
		$mail->addAddress($email,$usuario);
		$mail->Subject ='Cambio cuenta correo electronico';
		$mail->IsHTML(true);
		$mail->Body = $html;
		$mail->AltBody = ' ';
		$mail->msgHTML($html);
		$mail->send();
		$usuario_id_logueado=floatval($r['usuario_id']);
	}
	if ($encontro==1){
		$codigo_generado=mt_rand(1000000,9999999);
		$sesion=f_abrir("INSERT INTO usuarios_logueados (usuario,codigo_generado,personas_version,parametros_empresa_version,permisos_version) values ($usuario_id_logueado,$codigo_generado,-1,-1,-1)");
		$municipios=f_municipios();
	}
} else if ($request->accion=='blanquear') {
	$cuit=$request->cuit;
	$mail=$request->mail;

	$t=f_abrir("select * from usuarios where cuit=$cuit and mail='$mail'");
	if ($r=f_reg($t)){
		$encontro=1;
		extract($r);
		$codigo_generado=mt_rand(1000000,9999999);
		$password=md5($codigo_generado);
		$id=$usuario_id;
		$usuario_id_logueado=floatval($usuario_id);
		f_abrir("update usuarios set password='$password',forzar_cambio=1 where usuario_id=$id");
		$email=$mail;

		$mail = new PHPMailer();
		try {
			$mail->isSMTP();
			$mail->SMTPDebug = 0;

			$mail->Host = $_SESSION['mail_host'];
			$mail->SMTPSecure = 'tls';
			$mail->Port = $_SESSION['mail_puerto'];
			$mail->SMTPAuth = true;
			$mail->Username = $_SESSION['mail_usuario'];
			$mail->Password = $_SESSION['mail_password'];
			$mail->setFrom($_SESSION['mail_cuenta'],$_SESSION['empresa_mail']);

			$html="Estimado/a <b>$usuario</b><br><br>Debido al olvido de su contrase&ntilde;a, se procedi&oacute; a generar una nueva que deber&aacute; ser modificada.<br><br>Debe ingresar con su CUIT/CUIL <b>$cuit</b>, e ingresar como contrase&ntilde;a <b>$codigo_generado</b><br><br>Gracias por elegir Sistemas Konsulti.";
			$mail->addAddress($email,$usuario);
			$mail->Subject ='Recuperar usuario';
			$mail->IsHTML(true);
			$mail->Body = $html;
			$mail->AltBody = ' ';
			$mail->msgHTML($html);
			if (!$mail->send()) {
				$error=$mail->ErrorInfo;
			}
		} catch (Exception $e) {
			$error=$mail->ErrorInfo; //Pretty error messages from PHPMailer
    	} catch (Exception $e) {
			$error=$mail->ErrorInfo; //Pretty error messages from PHPMailer
		}
	}
} else if ($request->accion=='nuevo') {
	$cuit=$request->cuit;
	$correo_electronico=$request->mail;
	$nombre=strtoupper($request->nombre);
	$t=f_abrir("select * from usuarios where cuit=$cuit or mail='$correo_electronico'");
	if ($r=f_reg($t)){
	} else {
		$retorno=1;
		$codigo_generado=mt_rand(1000000,9999999);
		$password=md5($codigo_generado);
		$usuario_id_logueado=f_abrir("insert into usuarios (cuit,usuario,mail,password,forzar_cambio) values ($cuit,'$nombre','$correo_electronico','$password',1)");
		$mail = new PHPMailer(true);
		try {
			$mail->isSMTP();
			$mail->SMTPDebug = 0;

			$mail->Host = $_SESSION['mail_host'];
			$mail->SMTPSecure = 'tls';
			$mail->Port = $_SESSION['mail_puerto'];
			$mail->SMTPAuth = true;
			$mail->Username = $_SESSION['mail_usuario'];
			$mail->Password = $_SESSION['mail_password'];
			$mail->setFrom($_SESSION['mail_cuenta'],$_SESSION['empresa_mail']);

			$html="Estimado/a <b>$usuario</b><br><br>Su usuario del sistema Konsulti se ha generado satisfactoriamente.<br><br>Debe ingresar con su CUIT/CUIL <b>$cuit</b>, e ingresar como contrase&ntilde;a <b>$codigo_generado</b><br><br>Gracias por elegir Sistemas Konsulti.";
			$mail->addAddress($correo_electronico,$usuario);
			$mail->Subject = 'Nuevo usuario';
			$mail->IsHTML(true);
			$mail->Body = $html;
			$mail->AltBody = ' ';
			$mail->msgHTML($html);
			if (!$mail->send()) {
				$error=$mail->ErrorInfo;
			}
		} catch (Exception $e) {
			$error=$mail->ErrorInfo; //Pretty error messages from PHPMailer
    	} catch (Exception $e) {
			$error=$mail->ErrorInfo; //Pretty error messages from PHPMailer
	  	}
	}
}
exit('{"valores_retorno":'.json_encode($valores_retorno).'
	,"encontro":'.$encontro.'
	,"usuario":'.$usuario_id_logueado.'
	,"codigo":'.$codigo_generado.'
	,"sesion":'.$sesion.'
	,"municipios":'.json_encode($municipios).'
	,"error":'.json_encode($error).'
	,"usuario_preferencias":'.json_encode($usuario_preferencias).'
}');

?>