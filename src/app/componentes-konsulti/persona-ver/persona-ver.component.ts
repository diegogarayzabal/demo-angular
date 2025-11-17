import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Globals,Persona } from '../../globales';
import { FuncionesService } from '../../funciones.service';
import { ComponentesModule } from "../../componentes/componentes.module";
import { NgIf,NgClass,NgFor } from '@angular/common';
import { AbmpersonaComponent } from '../abmpersona/abmpersona.component';


@Component({
  selector: 'app-persona-ver',
  templateUrl: './persona-ver.component.html',
  styleUrls: ['../../app.component.scss','../../app.estilosgenerales.scss','../../bootstrap.css'],imports: [NgIf,NgClass,ComponentesModule,AbmpersonaComponent]
})
export class PersonaVerComponent implements OnInit {
  @Output() debe_actualizar = new EventEmitter<any>();
  @Input() estemenu='';
  @Input() cabecera=2;
  @Input() viendo_persona:Persona=null;
  pantalla_persona='datos_generales';
  persona_modo_abm=false;
  usuarios_locales:any[]=[];
  viendo_autorizados=-1;
  actualizar=0;

  G: Globals;
  constructor(
    variables: Globals
    , public Funcion: FuncionesService
    ) {
    this.G=variables;
  }
  ngOnInit() {
  }
  f_regreso_del_abm(actualizar=0) {
    if (actualizar>0) {
      setTimeout (() => this.f_tratar_de_actualizar(), 100);
    } else {
      this.persona_modo_abm=false;
    }
  }
  f_tratar_de_actualizar(pagina_id:any=null) {
    if (this.G.ACTUALIZAR_SISTEMA) {
      setTimeout (() => this.f_tratar_de_actualizar(pagina_id), 100);
    } else {
      this.debe_actualizar.emit();
      this.viendo_persona=this.Funcion.buscar_por_id(this.G.personas,this.viendo_persona.id);
      this.persona_modo_abm=false;
    }
  }
}
