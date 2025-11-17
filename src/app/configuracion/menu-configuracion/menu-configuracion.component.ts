import { Component, OnInit,ViewChild, ViewContainerRef } from '@angular/core';
import { Globals,FConfirmar } from '../../globales';
import { FuncionesService } from '../../funciones.service';import { ComponentesModule } from "../../componentes/componentes.module";import { NgIf,NgClass,NgFor } from '@angular/common';

class modificando {
  id=0;
  nombre='';
}

class parametros_sistema {
  mail_Host='';
  mail_Port=0;
  mail_Username='';
  mail_Password='';
  mail_setFrom_mail='';
  mail_setFrom_nombre='';
  constructor(datos:any) {
    this.mail_Host=datos.mail_Host;
    this.mail_Port=datos.mail_Port;
    this.mail_Username=datos.mail_Username;
    this.mail_Password=datos.mail_Password;
    this.mail_setFrom_mail=datos.mail_setFrom_mail;
    this.mail_setFrom_nombre=datos.mail_setFrom_nombre;
  }
}

@Component({
  selector: 'app-menu-configuracion',
  templateUrl: './menu-configuracion.component.html',
  styleUrls: ['../../app.component.scss','../../app.estilosgenerales.scss','../../bootstrap.css'],imports: [NgIf,NgFor,NgClass,ComponentesModule]
})
export class MenuConfiguracionComponent implements OnInit {
  @ViewChild('contenedorConfirmacion', { read: ViewContainerRef }) vcrConfirmador!: ViewContainerRef;
  estemenu='configuracion';
  viendo=0;
  pantalla='';
  viendo_subtipos:any=null;
  m:modificando=null;
  trajo_generales=false;
  parametros_sistema:parametros_sistema;
  parametros_sistema_abm:parametros_sistema;
  parametros_datos:any;
  
  G: Globals;
  constructor(variables: Globals
    , public Funcion: FuncionesService
    ) {
    this.G=variables;
  }

  ngOnInit() {
    this.pantalla='';
  }

  async f_ver(cual:any) {
    if (cual!==3 || this.trajo_generales) {
      this.viendo=cual;
      this.pantalla='listado'
    } else {
      let respuesta_post=await this.Funcion.f_http_post(this.estemenu,'configuracion.php','traer_parametros',{});
      if (!respuesta_post.con_error)  {
        let data=respuesta_post.data;
        this.parametros_datos=data['datos'];
        this.parametros_sistema=new parametros_sistema(this.parametros_datos);
        this.parametros_sistema_abm=new parametros_sistema(this.parametros_datos);
        this.viendo=cual;
        this.pantalla='listado';
      }
    }
  }
  f_nuevo() {
    this.m=new modificando();
    this.pantalla='abm';
  }
  f_modificar(cual:any) {
    this.m.id=cual.id;
    this.m.nombre=cual.nombre;
    this.pantalla='abm';
  }
  async f_guardar() {
    if (this.m.nombre==='') { this.Funcion.Alerta('Debe ingresar el nombre',1); return; }
    let respuesta=await this.Funcion.ConfirmarComponente(new FConfirmar('Confirma los datos?'),this.vcrConfirmador);
    if (respuesta.respuesta===1) {
      let respuesta_post=await this.Funcion.f_http_post(this.estemenu,'configuracion.php','abm',{datos:JSON.stringify(this.m),tipo:this.viendo});
      if (!respuesta_post.con_error)  {
        this.pantalla='listado';
      }
    }
  }
  async f_guardar_configuracion() {
    let respuesta=await this.Funcion.ConfirmarComponente(new FConfirmar('Guarda los datos de configuración?'),this.vcrConfirmador);
    if (respuesta.respuesta===1) {
      let respuesta_post=await this.Funcion.f_http_post(this.estemenu,'configuracion.php','parametros_abm',{datos:JSON.stringify(this.parametros_sistema_abm)});
      if (!respuesta_post.con_error)  {
        let data=respuesta_post.data;
        this.parametros_datos=data['datos'];
        this.parametros_sistema=new parametros_sistema(this.parametros_datos);
        this.parametros_sistema_abm=new parametros_sistema(this.parametros_datos);
      }
    }
  }
  f_cancelar_configuracion() {
    this.parametros_sistema_abm=new parametros_sistema(this.parametros_datos);
  }
  f_parametros_modificados() {
    let modificado=false;
    if (this.parametros_sistema.mail_Host!==this.parametros_sistema_abm.mail_Host) modificado=true;
    if (this.parametros_sistema.mail_Port!==this.parametros_sistema_abm.mail_Port) modificado=true;
    if (this.parametros_sistema.mail_Username!==this.parametros_sistema_abm.mail_Username) modificado=true;
    if (this.parametros_sistema.mail_Password!==this.parametros_sistema_abm.mail_Password) modificado=true;
    if (this.parametros_sistema.mail_setFrom_mail!==this.parametros_sistema_abm.mail_setFrom_mail) modificado=true;
    if (this.parametros_sistema.mail_setFrom_nombre!==this.parametros_sistema_abm.mail_setFrom_nombre) modificado=true;
    return modificado;
  }
}
