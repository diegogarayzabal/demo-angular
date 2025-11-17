import { Component, OnInit,ViewChild, ViewContainerRef } from '@angular/core';
import { Globals,IdNombre,Persona,FConfirmar } from '../../globales';
import { FuncionesService } from '../../funciones.service';
import { ComponentesModule } from "../../componentes/componentes.module";
import { NgClass,NgIf } from '@angular/common';
import { AbmpersonaComponent } from '../../componentes-konsulti/abmpersona/abmpersona.component';


@Component({
  selector: 'app-menu-casos-nuevo',
  templateUrl: './menu-casos-nuevo.component.html',
  styleUrls: ['../../app.component.scss','../../app.estilosgenerales.scss','../../bootstrap.css'],imports: [NgIf,NgClass,ComponentesModule,AbmpersonaComponent]
})
export class MenuCasosNuevoComponent implements OnInit {
  @ViewChild('contenedorConfirmacion', { read: ViewContainerRef }) vcrConfirmador!: ViewContainerRef;
  estemenu='casos_nuevo';
  persona:Persona=null;
  area:IdNombre=null;
  nombre='';
  referente:Persona=null;
  contraparte='';
  numero='';
  estado:IdNombre=null;
  persona_modo_abm=false;

  G: Globals;
  constructor(variables: Globals
    , public Funcion: FuncionesService
    ) {
    this.G=variables;
  }

  ngOnInit(): void {
    this.area=this.G.areas[0];
    this.estado=this.G.estados_casos[0];
    this.f_inicializar();
  }
  f_inicializar() {
    this.persona=null;
    this.nombre='';
    this.referente=null;
    this.contraparte='';
    this.numero='';
  }
  async f_guardar() {
    let vreferente=0; if (this.referente!==null) vreferente=this.referente.id;
    if (this.persona===undefined || this.persona===null || this.persona.id<=0) { this.Funcion.Alerta('Debe indicar el cliente'); return; }
    if (vreferente>0 && this.persona.id===vreferente) { this.Funcion.Alerta('El referente no puede ser el mismo cliente'); return; }
    if (this.nombre==='') { this.Funcion.Alerta('Debe indicar el nombre del caso'); return; }
    if (this.contraparte==='') { this.Funcion.Alerta('Debe indicar el nombre de la contraparte'); return; }
    let respuesta=await this.Funcion.ConfirmarComponente(new FConfirmar('Confirma el caso?'),this.vcrConfirmador);
    if (respuesta.respuesta===1) {
      let respuesta_post=await this.Funcion.f_http_post(this.estemenu,'casos.php','nuevo_caso',{persona:this.persona.id,referente:vreferente,area:this.area.id,nombre:this.nombre,contraparte:this.contraparte,estado:this.estado.id});
      if (!respuesta_post.con_error)  {
        this.Funcion.Alerta('Caso Ingresado');
        this.f_inicializar();
      }
    }
  }
  f_regreso_del_abm(actualizar=0) {
    if (actualizar>0) {
      setTimeout (() => this.f_tratar_de_actualizar(actualizar), 100);
    } else {
      this.persona_modo_abm=false;
    }
  }
  f_tratar_de_actualizar(id:number) {
    if (this.G.ACTUALIZAR_SISTEMA) {
      setTimeout (() => this.f_tratar_de_actualizar(id), 100);
    } else {
      this.persona_modo_abm=false;
      this.persona=this.Funcion.buscar_por_id(this.G.personas,id);
    }
  }
}
