import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FuncionesService } from '../../funciones.service';

@Component({
  selector: 'app-paginador',
  standalone: false,
  templateUrl: './paginador.component.html',
  styleUrls: ['../../app.component.scss','../../app.estilosgenerales.scss','../../bootstrap.css','./paginador.component.scss']
})
export class PaginadorComponent implements OnInit {
  @Input() paginar: any;
  @Input() listado: any =[];
  @Input() AlinearIzquierda=false;
  @Input() AlinearDerecha=false;
  @Input() con_recuadro=true;
  @Output() recalcular = new EventEmitter<any>();
  cargado=false;

  constructor(public Funcion: FuncionesService) {}

  ngOnInit(): void {
    if (this.listado!==null && this.listado.length>0 && this.paginar.viendo===null) this.paginar.viendo=this.paginar.combo[0];
    setTimeout (() => this.cargado=true,10);
  }
  f_recalcular() {
    this.cargado=false;
    this.Funcion.f_repaginar(this.paginar,this.listado);
    if (this.listado!==null && this.listado.length>0 && this.paginar.viendo===null) this.paginar.viendo=this.paginar.combo[0];
    setTimeout (() => this.cargado=true,10);
  }
  f_pagina_siguiente() {
    if (this.paginar.viendo.id+1<this.paginar.combo.length) {
      this.paginar.viendo.id++;
    }
  }
  f_pagina_anterior() {
    if (this.paginar.viendo.id>0) this.paginar.viendo.id--;
  }
}
