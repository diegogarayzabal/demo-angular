import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root' // 🔹 Asegura que el servicio esté disponible globalmente
})

export class Globals {
  SistemaBloqueado=false;
  ultimaActividad = Date.now();
  SesionesActivas=0;
  ConsultaPadronAfip={certificado:'',clave:'',empresa_cuit:0};
  Actualizador={FechaLogueo:'2022-01-01',TiempoIntervaloChequeo:60000,TiempoUltimaConsulta:0,Controlando:true};
  usuarios:any=[];
  tipos_documentos:IdNombre[]=[];
  usuario_preferencias=new UsuarioPreferencias;
  ModoMenu={sin_imagen:true,ancho_barra_menu:100,tamanio_imagen_arriba:2,posicion_triangulo1:100,posicion_triangulo2:320,estilo:0}; //estilo 0 es sin imagen pero con el menu el 1 sería con imagenes y el 2 estilo celular
  servicio_consulta_padron='';
  servicio_factura_electronica='';
  sino:IdNombre[]=[];
  mail_modos:IdNombre[]=[];
  MESES:IdNombre[]=[];
  areas:IdNombre[]=[];
  estados_casos:IdNombre[]=[];
  URL = '';
  title = 'Ortiz Ramondelli';
  GLoginOk=-3;
  div_esperando_local: any =[];
  div_esperando_local_texto: any =[];
  div_procesando_general=false;
  div_procesando_general_texto='';
  ModoProduccion=0;
  alerta_ver=false;
  alerta_texto='';
  alerta_tipo=0;
  confirmar_ver=false;
  confirmar_tipo=1;
  confirmar_subtipo=0;
  confirmar_valor=0;
  confirmar_opciones: any =[];
  confirmar_mensaje='';
  confirmar_datos: any =[];
  confirmar_inicial:any | null;
  confirmar_dato:any | null;
  confirmar_numero:any | null;
  confirmar_numero2:any | null;
  dondevolver = 0;
  provincias:Provincia[]=[];
  municipios:Municipio[]=[];
  menu_activo_titulo = 'Ortiz Ramondelli';
  personas:Persona[]=[];
  login_usuario = 0;
  login_codigo = 0;
  login_cuit = 0;
  login_sesion =0;
  ASALTO=false;
  ACTUALIZAR_SISTEMA=false;
  SISTEMA_ERROR=0;
  menu_item_seleccionado='';
  menu_item_seleccionado_anterior='';
  menu_item: any =[];
  provincias_afip = [2,3,13,1,20,21,15,9,12,14,11,10,19,18,23,0,17,5,16,22,7,8,24,4,6];
  uso_horario='GTM-3';
  ancho=300;
  alto=600;
  modo_celular=false;
  parametros_acceso:ParametrosAcceso;
  login_valores_guardados=false;
  menu_opciones:MenuOpcion[]=[];
  usuario_administrador=0;
  confirmador_datos: any | null;
  confirmador_ver=false;
  usuario_autorizador=false;
  menus:Menu[]=[];
  permisos:Permiso[]=[];

  mensajes:Mensaje[]=[];
  mensaje_id=1;
}

export class ConfirmarTabla {
  clases_tabla:string[]=[];
  clases_cabecera:string[]=[];
  cabeceras:ConfirmarTablaCabecera[]=[];
  datos:any[]=[];
  mostrar_cabecera=true;
  click_retorna_item=true;
  constructor(mostrar_cabecera:boolean=true,click_retorna_item:boolean=true,clase_tabla_con_cabecera:boolean=true) {
    this.mostrar_cabecera=mostrar_cabecera;
    this.click_retorna_item=click_retorna_item;
    if (clase_tabla_con_cabecera) this.clases_tabla.push('tabla_con_cabecera');
  }
}

export class ConfirmarTablaCabecera {
  titulo='';
  nombre_del_campo='';
  alinear='left';
  ancho_px:number=null;
  generar_sumatoria=false;
  es_numero=false;
  decimales=2;
  numerico_con_formato=true;
  constructor(titulo:string,nombre_del_campo:string,es_numero:boolean,dato_alinear_centrado=false,dato_alinear_derecha=false,si_es_numero_decimales=2,numerico_con_formato=true,generar_sumatoria=false,ancho_px:number=null) {
    this.titulo=titulo;
    this.nombre_del_campo=nombre_del_campo;
    if (dato_alinear_centrado) {
      this.alinear='center';
    } else if (dato_alinear_derecha){
      this.alinear='right';
    }
    this.es_numero=es_numero;
    if (es_numero) {
      this.generar_sumatoria=generar_sumatoria;
      this.decimales=si_es_numero_decimales;
      this.numerico_con_formato=numerico_con_formato;
    }
    this.ancho_px=ancho_px;
  }
}

export class FHttpPostRespuesta {
  con_error=false;
  data:any;
  error:any;
  constructor(data:any,con_error=false,error:any=null) {
    this.data=data;
    this.con_error=con_error;
    this.error=error;
  }
}

export class UsuarioPreferencias {
  preguntar_recarga=false;
  menu_estilo=0;
  guardar_usuario=true;
  minutos_bloqueo=60;
  constructor(datos:any=null) {
    if (datos!==null) {
      this.menu_estilo=datos.preferencia_menu_estilo;
      this.guardar_usuario=datos.preferencia_guardar_usuario;
      this.preguntar_recarga=datos.preferencia_preguntar_recarga;
      this.minutos_bloqueo=datos.preferencia_minutos_bloqueo;
    }
  }
}

export class FConfirmar {
  general=false;
  respuestas:ConfirmadorRespuesta[]=[];
  componentes:any[]=[];
  ancho=300;
  mensaje='';
  tipo=1;
  constructor(mensaje:string,general=false) {
    this.mensaje=mensaje;
    this.general=general;
    this.respuestas.push(new ConfirmadorRespuesta(0,'Cancelar',2));
    this.respuestas.push(new ConfirmadorRespuesta(1,'Aceptar',1));
  }
}

export class ParametrosAcceso {
  login_empresa=0;
  login_usuario=0;
  login_codigo=0;
  login_sesion=0;
  verificar_actualizacion=false;
  appVersion=0;
  appVersion_comprobada=0;
  versiones:IdNombre[];
  constructor(login_usuario:number,login_codigo:number,login_sesion:number,appVersion:number) {
    this.login_usuario=login_usuario;
    this.login_codigo=login_codigo;
    this.login_sesion=login_sesion;
    this.appVersion=appVersion;
    this.appVersion_comprobada=appVersion;
  }
  Inicializar() {
    this.verificar_actualizacion=true;
    this.versiones=[];
    this.versiones.push(new IdNombre(-1,'version_personas'));
    this.versiones.push(new IdNombre(-1,'version_parametros_empresa'));
    this.versiones.push(new IdNombre(-1,'version_permisos'));
  }
  ActualizarVersion(nombre:string,valor:number) {
    for (let v of this.versiones) {
      if (v.nombre===nombre) v.id=valor;
    }
  }
  VersionActual(nombre:string) {
    let ret=0;
    for (let v of this.versiones) {
      if (v.nombre===nombre) ret=v.id;
    }
    return ret;
  }
}


export class Log {
  fecha='';
  usuario=0;
  texto='';
  constructor(dato:any) {
    this.fecha=dato.fecha;
    this.usuario=dato.usuario;
    this.texto=dato.texto;
  }
}

export class IdNombreString {
  id='';
  nombre='';
  constructor(id:string,nombre:string) {
    this.id=id;
    this.nombre=nombre;
  }
}

export class IdNombreAbreviado {
  id=0;
  nombre='';
  abreviado='';
  constructor(id=0,nombre='',abreviado='') {
    this.id=id;
    this.nombre=nombre;
    this.abreviado=abreviado;
  }
}

export class Menu {
  nombre='';
  imagen='';
  submenu1:SubMenu1[]=[];
  constructor(datos:any) {
    this.nombre=datos.nombre;
    this.imagen=datos.imagen;
  }
}

export class SubMenu1 {
  nombre='';
  imagen='';
  actualizar=0;
  celular=false;
  opcion='';
  submenu2:SubMenu2[]=[];
  constructor(datos:any) {
    this.nombre=datos.nombre;
    this.imagen=datos.imagen;
    this.actualizar=datos.actualizar;
    this.celular=datos.celular;
    this.opcion=datos.opcion;
  }
}

export class SubMenu2 {
  nombre='';
  imagen='';
  opcion='';
  actualizar=0;
  celular=false;
  constructor(datos:any) {
    this.nombre=datos.nombre;
    this.imagen=datos.imagen;
    this.actualizar=datos.actualizar;
    this.celular=datos.celular;
    this.opcion=datos.opcion;
  }
}

export class Provincia {
  id=0;
  codigo=0;
  nombre='';
  municipios:Municipio[]=[];
  constructor(datos:any) {
    this.id=datos.id;
    this.codigo=datos.codigo;
    this.nombre=datos.nombre;
  }
}

export class Municipio {
  id=0;
  provincia=0;
  nombre='';
  nombre_completo='';
  nombre_municipio='';
  constructor(datos:any) {
    this.id=datos.id;
    this.provincia=datos.provincia;
    this.nombre=datos.nombre;
    this.nombre_completo=datos.nombre_completo;
    this.nombre_municipio=datos.nombre_municipio;
  }
}


export class Mensaje {
  id=0;
  texto='';
  autoCerrar=false;
  duracion=3000;
  tipo=0; //1=celeste 2=verde 3=naranja 4=rojo
  tipo_txt='informacion';
  constructor(id:number,texto:string,tipo:number,temporal:boolean,temporal_ms:number) {
    this.id=id;
    this.texto=texto;
    this.autoCerrar=temporal;
    this.duracion=temporal_ms;
    if (tipo===2) this.tipo_txt='exito';
    if (tipo===3) this.tipo_txt='advertencia';
    if (tipo===4) this.tipo_txt='error';
  }
}

export class IdNombre {
  id=0;
  nombre='';
  constructor(id:number,nombre:string) {
    this.id=id;
    this.nombre=nombre;
  }
}

export class MenuOpcion {
  opcion_id='';
  celular=false;
  version=0;
  constructor(datos:any) {
    this.opcion_id=datos.opcion_id;
    this.celular=datos.celular;
    this.version=datos.version;
  }
}

export class Permiso {
  permitido_id=0;
  permiso='';
  permiso_nombre='';
  permitido=false;
  nuevo_permitido=false;
  menus:any=[];
  restringido=false;
  constructor(permitido_id:number,permiso:string,permiso_nombre:string,permitido:boolean,menus:any,restringido:boolean,nuevo_permitido=false) {
    this.permitido_id=permitido_id;
    this.permiso=permiso;
    this.permiso_nombre=permiso_nombre;
    this.permitido=permitido;
    this.menus=menus;
    this.restringido=restringido;
    this.nuevo_permitido=nuevo_permitido;
  }
}

export class Permitido {
  id=0;
  usuario=0;
  permiso='';
  permitido=true;
  constructor(id:number,usuario:number,permiso:string) {
    this.id=id;
    this.usuario=usuario;
    this.permiso=permiso;
  }
}

export class Paginar {
  grupos:any=[];
  combo:any=[];
  viendo:any=null;
  agrupar=false;
  agrupar_cantidad=500;
  ok=false;
}

export class Fechas_desde_hasta {
  f2=new DatePipe('en-Us').transform(new Date(), 'yyyy-MM-dd','GTM-3') ?? '';
  desde=true;
  desde_fecha=new Date(parseFloat(this.f2.substring(0,4)),parseFloat(this.f2.substring(5,7))-1,parseFloat(this.f2.substring(8,10)));
  hasta=false;
  hasta_fecha=new Date(parseFloat(this.f2.substring(0,4)),parseFloat(this.f2.substring(5,7))-1,parseFloat(this.f2.substring(8,10)));
  ver_filtro_desde=true;
  ver_filtro_hasta=true;
  titulo_desde='';
  titulo_hasta='';
  constructor(desde:any | null=null,desde_fecha:Date | null=null,hasta:any | null=null,hasta_fecha:Date | null=null,ver_filtro_desde=true,ver_filtro_hasta=true,titulo_desde:any | null=null,titulo_hasta:any | null=null) {
    this.ver_filtro_desde=ver_filtro_desde;
    this.ver_filtro_hasta=ver_filtro_hasta;
    if (ver_filtro_desde && desde!==null) this.desde=desde;
    if (ver_filtro_hasta && hasta!==null) this.hasta=hasta;
    if (!ver_filtro_desde) { if (titulo_desde!==null) { this.titulo_desde=titulo_desde; } else { this.titulo_desde='Desde:';}}
    if (!ver_filtro_hasta) { if (titulo_hasta!==null) { this.titulo_hasta=titulo_hasta; } else { this.titulo_hasta='Hasta:';}}
    if (desde_fecha!==null) this.desde_fecha=desde_fecha;
    if (hasta_fecha!==null) this.hasta_fecha=hasta_fecha;
  }
  f_mes_anterior() {
    let f=new Date();
    let mes_mio=f.getMonth()+1;
    let mes=f.getMonth();
    let anio=f.getFullYear();
    if (mes===0) {
      anio--;
      mes=11;
      mes_mio=12;
    } else {
      mes--;
      mes_mio--;
    }
    if (mes_mio===1 || mes_mio===3 || mes_mio===5 || mes_mio===7 || mes_mio===8 || mes_mio===10 || mes_mio===12) {
      this.hasta_fecha=new Date(anio,mes,31);
    } else if (mes_mio===4 || mes_mio===6 || mes_mio===9 || mes_mio===11) {
      this.hasta_fecha=new Date(anio,mes,30);
    } else if (anio/4===this.redondear(anio/4,0)) {
      if (anio/100===this.redondear(anio/100,0)) {
        this.hasta_fecha=new Date(anio,mes,28);
      } else {
        this.hasta_fecha=new Date(anio,mes,29);
      }
    } else {
      this.hasta_fecha=new Date(anio,mes,28);
    }
    this.desde_fecha=new Date(anio,mes,1);
    this.desde=true;
    this.hasta=true;
  }
  redondear(valor:number,decimales=2) { const multiplicar=1*Math.pow(10,decimales); return Math.round(valor*multiplicar)/multiplicar;}
}

export class Numeros_desde_hasta {
  ver_uno_solo=false;
  uno_solo=false;
  desde_ver=true;
  desde_numero=0;
  hasta_ver=false;
  hasta_numero=0;
  decimales=0;
  numero_centrado=true;
  ver_filtro_desdehasta=true;
  titulo_desde='Desde:';
  titulo_hasta='Hasta:';
  ConFormato=1;
}

export class Confirmador {
  mensaje='';
  componentes:any[]=[];
  respuestas:ConfirmadorRespuesta[]=[];
  ancho=100;
  constructor(mensaje='',ancho:number | null=null,componentes:any=null,respuestas:any=null) {
    this.mensaje=mensaje;
    if (ancho!==null) this.ancho=ancho;
    if (componentes!==null) this.componentes=componentes;
    if (respuestas!==null) this.respuestas=respuestas;
  }
  RespuestaAceptar() {
    this.respuestas=[];
    this.respuestas.push(new ConfirmadorRespuesta(0,'Aceptar',1));
  }
  RespuestaAceptarCancelar() {
    this.respuestas=[];
    this.respuestas.push(new ConfirmadorRespuesta(0,'Cancelar',2));
    this.respuestas.push(new ConfirmadorRespuesta(1,'Aceptar',1));
  }
  RespuestaAgregar(valor:any | null=null,titulo='',tipo=1) {
    this.respuestas.push(new ConfirmadorRespuesta(valor,titulo,tipo));
  }
}

export class ConfirmadorRespuesta {
  valor=0;
  titulo='';
  tipo=1;
  constructor(valor:any | null=null,titulo:string,tipo=1) {
    if (valor!==null) this.valor=valor;
    if (titulo!==null) this.titulo=titulo;
    if (tipo!==null) this.tipo=tipo;
  }
}

export class SpanDobleTexto {
  titulo1='';
  texto1='';
  titulo2='';
  texto2='';
}

export class DebeActualizarMovimiento {
  todo=false;
  imputacion=false;
}

export class Autorizando {
  esperando=false;
  autoriza_usuario=0;
  texto='';
  aclaraciones='';
  tipo=1;
  importe=0;
  persona=0;
}

export class Persona {
  id=0;
  doc_tipo=0;
  doc_tipo_txt='';
  nombre='';
  doc_numero='';
  telefono='';
  domicilio='';
  correo_electronico='';
  ultima_modificacion='';
  constructor(dato:any=null) {
    if (dato!==null) {
      this.id=dato.id;
      this.doc_tipo=dato.doc_tipo;
      this.doc_tipo_txt=dato.doc_tipo_txt;
      this.nombre=dato.nombre;
      this.telefono=dato.telefono;
      this.domicilio=dato.domicilio;
      this.correo_electronico=dato.correo_electronico;
      this.doc_numero=dato.doc_numero;
      this.ultima_modificacion=dato.ultima_modificacion;
    }
  }
  NombreCompleto() {
    return this.doc_tipo_txt+' '+this.doc_numero+' - '+this.nombre;
  }
  TipoyNumeroDocumento() {
    return this.doc_tipo_txt+' '+this.doc_numero;
  }
}

export class CopiarTabla {
  listado:any[]=[];
  titulos:any[]=[];
  constructor(titulos:any) {
    this.titulos=titulos;
  }
  Item(item:any) {
    this.listado.push(item);
  }
  Copiar() {
    let tabla='<table>';
    tabla+='<thead>';
    tabla+='<tr style="background-color:#00b5e2;align:center;">';
    for (let t of this.titulos) {
      tabla+='<th><b>'+t+'</b></th>';  
    }
    tabla+='</tr>';
    tabla+='</thead>';
    tabla+='<tbody>';
    for (let item of this.listado) {
      tabla+='<tr>';
      for (let pos=0;pos<this.titulos.length;pos++) {
        tabla+='<td>'+item[pos]+'</td>';
      }
      tabla+='</tr>';
    }
    tabla+='</tbody>';
    tabla+='</table>';
    navigator.clipboard.writeText(tabla);
  }
}

