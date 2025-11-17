import { Component, OnInit,ViewChild, ViewContainerRef } from '@angular/core';
import { Globals,IdNombre,Persona,FConfirmar } from '../../globales';
import { FuncionesService } from '../../funciones.service';
import { ComponentesModule } from "../../componentes/componentes.module";
import { NgClass,NgIf } from '@angular/common';
import { AbmpersonaComponent } from '../../componentes-konsulti/abmpersona/abmpersona.component';

@Component({
  selector: 'app-menu-visitas-nueva',
  templateUrl: './menu-visitas-nueva.component.html',
  styleUrls: ['../../app.component.scss','../../app.estilosgenerales.scss','../../bootstrap.css'],imports: [NgIf,NgClass,ComponentesModule,AbmpersonaComponent]
})
export class MenuVisitasNuevaComponent implements OnInit {
  @ViewChild('contenedorConfirmacion', { read: ViewContainerRef }) vcrConfirmador!: ViewContainerRef;
  estemenu='visitas_nueva';
  persona:Persona=null;
  motivo='';
  fecha=new Date();
  area:IdNombre=null;
  persona_modo_abm=false;

  G: Globals;
  constructor(
    variables: Globals
    , public Funcion: FuncionesService
    ) {
    this.G=variables;
  }

  ngOnInit(): void {
    this.area=this.G.areas[0];
    this.f_inicializar();
  }
  f_inicializar() {
    this.motivo='';
    this.persona=null;
  }
  async f_guardar() {
    if (this.persona===undefined || this.persona===null || this.persona.id<=0) { this.Funcion.Alerta('Debe indicar el visitante'); return; }
    if (this.motivo==='') { this.Funcion.Alerta('Debe indicar el motivo'); return; }
    let respuesta=await this.Funcion.ConfirmarComponente(new FConfirmar('Confirma la visita?'),this.vcrConfirmador);
    if (respuesta.respuesta===1) {
      let respuesta_post=await this.Funcion.f_http_post(this.estemenu,'visitas.php','nueva_visita',{persona:this.persona.id,motivo:this.motivo,area:this.area.id});
      if (!respuesta_post.con_error)  {
        this.Funcion.Alerta('Visita registrada');
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
