<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$allowedOrigins = [
    "https://sistema4.konsulti.net",
    "http://localhost:4200","http://localhost:4400"
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
}

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Authorization");

// Responder a la solicitud OPTIONS antes de continuar
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Verificar si la sesión está iniciada antes de llamar a session_start()
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

date_default_timezone_set('America/Argentina/Buenos_Aires');
set_time_limit(6000);

$_SESSION['empresa_mail']="";
$_SESSION['mail_host']="";
$_SESSION['mail_puerto']=587;
$_SESSION['mail_usuario']="";
$_SESSION['mail_password']="";
$_SESSION['mail_cuenta']="";
$_SESSION['mail_SMTPSecure']="";
$_SESSION['login_usuario']=0;


?>