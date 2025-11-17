import { Component, OnChanges, Input,ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { Globals } from '../../globales';

@Component({
  selector: 'app-alerta',
  standalone: false,
  templateUrl: './alerta.component.html',
  styleUrls: ['./alerta.component.scss','../../bootstrap.css']
})
export class AlertaComponent implements OnChanges {
  @ViewChild('boton_ok') boton_ok!: ElementRef;
  @Input() alerta_ver = false;
  @Input() mensaje: string='';
  @Input() tipo = 0; /* 0=normal 1=rojo */
  G: Globals;
  constructor(variables: Globals) {this.G=variables;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.alerta_ver) {
      setTimeout (() => this.actualizar (), 0);
    }
  }
  actualizar() {
    this.G.alerta_ver=true;
    this.boton_ok.nativeElement.focus();
  }
  cerrar() {
    this.alerta_ver=false;
    this.G.alerta_ver=false;
  }
}
