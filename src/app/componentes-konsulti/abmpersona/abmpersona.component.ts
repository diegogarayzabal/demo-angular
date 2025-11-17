import { Component, OnInit, Input, EventEmitter, Output,ViewContainerRef,ViewChild } from '@angular/core';
import { Globals, IdNombre,FConfirmar } from '../../globales';
import { FuncionesService } from '../../funciones.service';
import { NgIf,NgClass } from '@angular/common';
import { ComponentesModule } from "../../componentes/componentes.module";

class Persona {
  id=0;
  doc_numero='';
  doc_numero_cuit=0;
  doc_tipo:IdNombre=null;
  nombre='';
  domicilio='';
  telefono='';
  correo_electronico='';
  constructor(pcual:any) {
    if (pcual!==undefined && pcual!==null) {
      this.id=pcual.id;
      this.doc_numero=pcual.doc_numero;
      if (pcual.doc_tipo!==91) this.doc_numero_cuit=parseFloat(pcual.doc_numero);
      this.nombre=pcual.nombre;
    }
  }
}

@Component({
  selector: 'app-abmpersona',
  templateUrl: './abmpersona.component.html',
  styleUrls: ['../../app.component.scss','../../app.estilosgenerales.scss','../../bootstrap.css'],imports: [NgIf,NgClass,ComponentesModule]
})
export class AbmpersonaComponent implements OnInit {
  @ViewChild('contenedorConfirmacion', { read: ViewContainerRef }) vcrConfirmador!: ViewContainerRef;
  @Output() volver = new EventEmitter<any>();
  @Input() estemenu='';
  @Input() persona: any;
  @Input() nueva_doc_tipo=96;
  @Input() nueva_doc_numero='';
  ver=false;
  actualizar_recibos=false;
  modificando:Persona;

  G: Globals;
  constructor(variables: Globals
    , public Funcion: FuncionesService
    ) {
    this.G=variables;
  }
  ngOnInit() {
    setTimeout (() => this.inicializar(), 10);
  }
  inicializar() {
    this.modificando=new Persona(this.persona);
    if (this.persona===undefined || this.persona===null) {
      this.modificando.doc_tipo=this.Funcion.buscar_por_id(this.G.tipos_documentos,this.nueva_doc_tipo);
      if (this.nueva_doc_tipo!==91) {
        this.modificando.doc_numero_cuit=parseFloat(this.nueva_doc_numero);
        if (isNaN(this.modificando.doc_numero_cuit)) this.modificando.doc_numero_cuit=0;
      } else {
        this.modificando.doc_numero=this.nueva_doc_numero;
      }
    } else {
      this.modificando.doc_tipo=this.Funcion.buscar_por_id(this.G.tipos_documentos,this.persona.doc_tipo);
      this.modificando.domicilio=this.persona.domicilio;
      this.modificando.telefono=this.persona.telefono;
      this.modificando.correo_electronico=this.persona.correo_electronico;
    }
    this.actualizar_recibos=false;
    setTimeout (() => this.f_ver(), 10);
  }
  f_ver() {
    this.ver=true;
    if (this.modificando.id===0 && this.modificando.doc_numero!==null && this.modificando.doc_numero.length===11) this.verificar_cuit();
  }
  verificar_cuit() {
    if (this.modificando.id===0) {
      setTimeout (() => this.verificar_cuit_ok(), 10);
    }
  }
  verificar_cuit_ok() {
    if (this.modificando.doc_tipo.id===80) {
      let respuesta=this.f_verificar_cuit();
      if (respuesta.error>1) {
        this.Funcion.Alerta(respuesta.error_texto,1);
      } else if (respuesta.error===0) {
        this.Afip_padron(this.modificando.doc_numero_cuit);
      }
    }
  }
  f_verificar_cuit() {
    let ret={error:0,error_texto:''};
    if (this.modificando.doc_numero_cuit<20000000000 || this.modificando.doc_numero_cuit>40000000000) {
      ret.error=1;
      ret.error_texto='CUIT Incorrecto';
    } else if (!this.Funcion.validarCuit(this.modificando.doc_numero_cuit)) {
      ret.error=2;
      ret.error_texto='CUIT Incorrecto';
    }
    if (this.modificando.id===0 && this.G.personas!==null && this.modificando.doc_numero_cuit!==null && this.modificando.doc_numero_cuit>0) {
      for (let p of this.G.personas) {
        if (p.doc_tipo===this.modificando.doc_tipo.id && p.doc_numero===this.modificando.doc_numero_cuit.toString()) {
          this.modificando.doc_numero_cuit=null;
          ret.error=3;
          ret.error_texto=this.modificando.doc_tipo.nombre+' pertenece a '+p.nombre;
          break;
        }
      }
    }
    return ret;
  }
  async Afip_padron(pcuit:number) {
    let data:any=await this.Funcion.Afip_padron(this.estemenu,pcuit,this.modificando.doc_tipo.id);
    if (data!==null) {
      const datos_todo=data['mensaje'];
      const datos=datos_todo.datosGenerales;
      if (this.G.login_usuario===1) { console.log(datos); }
      if (datos===undefined) {
        this.Funcion.Alerta('No se obtuvieron datos de AFIP, ingrese los valores manualmente o verifique que la CUIT no esté inhabilitada',1);
      } else {
        if (datos.tipoPersona!=='FISICA') {
          this.modificando.nombre=datos.razonSocial;
        } else {
          this.modificando.nombre=datos.apellido+' '+datos.nombre;
        }
        this.modificando.domicilio=datos.domicilioFiscal.direccion;
      }
    }
  }
  async confirmar() {
    if (this.modificando.doc_tipo.id===80) {
      let respuesta=this.f_verificar_cuit();
      if (respuesta.error>0) {
        this.Funcion.Alerta(respuesta.error_texto,1);
        return false;
      }
    }
    let vdoc_numero=this.modificando.doc_numero;
    if (this.modificando.doc_tipo.id!==91) vdoc_numero=this.modificando.doc_numero_cuit.toString();
    if (parseFloat(vdoc_numero)<=3000000) {this.Funcion.Alerta('Ingrese el número',1);return false;}
    if (this.modificando.nombre===null || this.modificando.nombre===undefined || this.modificando.nombre.length<3) {this.Funcion.Alerta('Ingrese el Nombre',1);return false;}
    let respuesta=await this.Funcion.ConfirmarComponente(new FConfirmar('Ingresa los datos?'),this.vcrConfirmador);
    if (respuesta.respuesta===1) {
      let respuesta_post=await this.Funcion.f_http_post(this.estemenu,'persona_datos.php','abm_persona',{
        id:this.modificando.id
        ,doc_tipo:this.modificando.doc_tipo.id
        ,doc_numero:vdoc_numero
        ,nombre:this.modificando.nombre
        ,domicilio:this.modificando.domicilio
        ,telefono:this.modificando.telefono
        ,correo_electronico:this.modificando.correo_electronico
      });
      if (!respuesta_post.con_error) {
        let data=respuesta_post.data;        
        this.volver.emit(data['actualizar_id']);
      }
    }
    return null;
  }

}
