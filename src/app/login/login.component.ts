import { Component, OnInit, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { NgIf,NgClass } from '@angular/common';
import {Globals, Municipio, UsuarioPreferencias} from '../globales';
import { HttpClient } from '@angular/common/http';
import { FuncionesService } from '../funciones.service';
import md5 from 'js-md5';
import { Subscription } from 'rxjs';
import { ComponentesModule } from "../componentes/componentes.module";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss','../app.estilosgenerales.scss']
  ,imports: [NgIf,NgClass,ComponentesModule]
})

export class LoginComponent implements OnInit {
  @Output() LoginRespuesta = new EventEmitter<object>();
  @Input() appVersion='';
  @Input() parametro_actualizar: number = -1;
  CambiarClave=false;
  ForzadoACambiar=false;
  ForzadoACambiar_mail=false;
  usuario:number=null;
  clave='';
  clave1='';
  clave2='';
  usuario_nombre='';
  modo=0;
  mail='';
  estaba_guardado=false;
  G: Globals;
  constructor(private http: HttpClient
    ,G: Globals
    ,public Funcion: FuncionesService
    ) {
    this.G=G;
  }
  

  SuscripcionConfirmar: Subscription;
  ngOnInit() {
    if (this.parametro_actualizar!==null && this.parametro_actualizar>0) {
      this.G.ancho=window.innerWidth;
      this.G.alto=window.innerHeight;
    }
  }

  async f_login() {
    if (this.usuario===null) { this.Funcion.Alerta('Debe ingresar el usuario',1); return; }
    if (!this.Funcion.validarCuit(this.usuario)) { this.Funcion.Alerta('Cuit/Cuil Inválido',1); return; }
    if (this.clave===null) { this.Funcion.Alerta('Ingrese la contraseña',1); return; }
    if (this.CambiarClave && this.clave1===null) { this.Funcion.Alerta('Ingrese la nueva contraseña',1); return; }
    if (this.CambiarClave && this.clave1!==this.clave2) { this.Funcion.Alerta('Las nuevas contraseñas no coinciden',1); return; }
    let respuesta_post=await this.Funcion.f_http_post('','login.php','login',{cuit:this.usuario,
      clave:md5.md5(this.clave),
      cambiar:this.CambiarClave,
      clave_nueva:md5.md5(this.clave1),
      cambiar_mail:this.ForzadoACambiar_mail,
      mail:this.mail,
    });
    if (!respuesta_post.con_error) {
      let data=respuesta_post.data;
      if (data['encontro'] === 0) {
        this.Funcion.Alerta('USUARIO O CONTRASEÑA INCORRECTO',1);
      }
      if (data['encontro'] === 1) {
        this.G.login_usuario = data['usuario'];
        this.G.login_codigo = data['codigo'];
        this.G.login_sesion = data['sesion'];
        this.G.municipios=[];
        for (let m of data['municipios']) {
          this.G.municipios.push(new Municipio(m));
        }
        this.G.usuario_preferencias=new UsuarioPreferencias(data['usuario_preferencias']);
        this.Funcion.f_ordenar(this.G.municipios,'nombre');
        this.G.login_cuit=this.usuario;
        this.LoginRespuesta.emit({LoginOk:true});
      }
      if (data['encontro'] === 2) {
        this.Funcion.Alerta('DEBE CAMBIAR LA CONTRASEÑA');
        this.CambiarClave=true;
        this.ForzadoACambiar=true;
      }
      if (data['encontro'] === 3) {
        this.Funcion.Alerta('Debe ingresar su correo electrónico');
        this.ForzadoACambiar_mail=true;
      }
      if (data['encontro'] ===4) {
        this.Funcion.Alerta('Correo electrónico actualizado, se envió la nueva contraseña a la dirección indicada');
        this.CambiarClave=false;
        this.ForzadoACambiar=false;
        this.ForzadoACambiar_mail=false;
        this.mail='';
        this.usuario=null;
        this.clave='';
        this.clave1='';
        this.clave2='';
        this.usuario_nombre='';
      }
    }
  }
  async f_nuevo() {
    if (this.usuario===null) { this.Funcion.Alerta('Debe ingresar el Cuit/Cuil',1); return; }
    if (!this.Funcion.validarCuit(this.usuario)) { this.Funcion.Alerta('Cuit/Cuil Inválido',1); return; }
    if (this.usuario_nombre===null || this.usuario_nombre==='') { this.Funcion.Alerta('Debe ingresar el nombre',1); return; }
    if (this.mail===null || this.mail==='') { this.Funcion.Alerta('Debe ingresar el correo electrónico',1); return; }
    if (!this.Funcion.validar_mail(this.mail)) { this.Funcion.Alerta('Correo electrónico Inválido',1); return; }
    let respuesta_post=await this.Funcion.f_http_post('','login.php','nuevo',{cuit: this.usuario,mail: this.mail,nombre:this.usuario_nombre});
    if (!respuesta_post.con_error) {
      let data=respuesta_post.data;
      if (data['encontro'] === 0) {
        this.Funcion.Alerta('NO SE PUEDE GENERAR EL USUARIO',1);
      } else {
        console.log(data['error']);
        this.Funcion.Alerta('Se envió las instrucciones a '+this.mail);
        this.mail='';
        this.usuario=null;
        this.modo=0;
        this.usuario_nombre='';
      }
    }
  }
  async f_blanquear() {
    if (this.usuario===null) { this.Funcion.Alerta('Debe ingresar el Cuit/Cuil',1); return; }
    if (!this.Funcion.validarCuit(this.usuario)) { this.Funcion.Alerta('Cuit/Cuil Inválido',1); return; }
    if (this.mail===null || this.mail==='') { this.Funcion.Alerta('Debe ingresar el correo electrónico',1); return; }
    if (!this.Funcion.validar_mail(this.mail)) { this.Funcion.Alerta('Correo electrónico Inválido',1); return; }
    let respuesta_post=await this.Funcion.f_http_post('','login.php','blanquear',{cuit: this.usuario,mail: this.mail});
    if (!respuesta_post.con_error) {
      let data=respuesta_post.data;
      if (data['encontro'] === 0) {
        this.Funcion.Alerta('ERROR EN EL USUARIO O CORREO ELECTRÓNICO',1);
      } else {
        this.Funcion.Alerta('Se envió las instrucciones a '+this.mail);
        this.mail='';
        this.usuario=null;
        this.modo=0;
      }
    }
  }
  forzar_mail() {
    if (this.ForzadoACambiar_mail) {
      this.ForzadoACambiar_mail=false;
    } else {
      this.ForzadoACambiar_mail=true;
    }
  }
}
