import { Component, OnInit} from '@angular/core';
import { Globals,Paginar,Persona } from '../../globales';
import { FuncionesService } from '../../funciones.service';
import { ComponentesModule } from "../../componentes/componentes.module";
import { NgIf,NgClass,NgFor } from '@angular/common';
import { PersonaVerComponent } from '../../componentes-konsulti/persona-ver/persona-ver.component';
import { AbmpersonaComponent } from '../../componentes-konsulti/abmpersona/abmpersona.component';


@Component({
  selector: 'app-menu-personas',
  templateUrl: './menu-personas.component.html',
  styleUrls: ['../../app.component.scss','../../app.estilosgenerales.scss','../../bootstrap.css'],imports: [NgIf,NgFor,NgClass,ComponentesModule,PersonaVerComponent,AbmpersonaComponent]
})
export class MenuPersonasComponent implements OnInit {
  
  estemenu='personas';
  pantalla='';

  viendo_persona:Persona=null;
  paginar: Paginar;
  movimientos:any[]=[];

  filtro_nombre='';

  persona_modo_abm=false;

  G: Globals;
  constructor(
    variables: Globals
    , public Funcion: FuncionesService
    ) {
    this.G=variables;
  }

  ngOnInit() {
    this.paginar=new Paginar();
    setTimeout (() => this.f_tratar_de_actualizar(), 100);
  }
  f_tratar_de_actualizar(pagina_id:number=null) {
    if (this.G.ACTUALIZAR_SISTEMA) {
      setTimeout (() => this.f_tratar_de_actualizar(pagina_id), 100);
    } else {
      this.persona_modo_abm=false;
      this.actualizar(pagina_id);
    }
  }
  actualizar(pagina_id:number=null,actualizar_pantalla=true) {
    if (actualizar_pantalla) this.pantalla='';
    this.movimientos=[];
    let p:Persona;
    for (p of this.G.personas) {
      let mostrar=true;
      if (this.filtro_nombre!=='' && !p.nombre.toUpperCase().includes(this.filtro_nombre.toUpperCase())) mostrar=false;
      if (mostrar) this.movimientos.push(p);
    }
    if (this.movimientos!==null && this.movimientos.length>1000 && !this.paginar.agrupar) {
      this.paginar.agrupar_cantidad=500;
      this.paginar.agrupar=true;
    }
    this.Funcion.f_repaginar(this.paginar,this.movimientos);
    if (actualizar_pantalla) { setTimeout (() => this.pantalla='listado', 10); }
    if (pagina_id!==null) {
      setTimeout (() => this.paginar.viendo=this.paginar.combo[pagina_id], 50);
    }
  }
  f_persona_ver(cual:Persona) {
    this.viendo_persona=cual;
    this.pantalla='viendo_persona';
  }
  f_regreso_del_abm(actualizar=0) {
    if (actualizar>0) {
      setTimeout (() => this.f_tratar_de_actualizar(this.paginar.viendo.id), 100);
    } else {
      this.persona_modo_abm=false;
    }
  }
}
