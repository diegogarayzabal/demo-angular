import {
  Component, Input, forwardRef, OnChanges, SimpleChanges
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR, NG_VALIDATORS
} from '@angular/forms';


@Component({
  selector: 'app-span',
  standalone: false,
  templateUrl: './span.component.html',
  styleUrls: ['../inputs.scss'],
  providers: [
      {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => SpanComponent),
          multi: true
      },
      {
          provide: NG_VALIDATORS,
          useExisting: forwardRef(() => SpanComponent),
          multi: true
      }
  ]
})
export class SpanComponent implements OnChanges {
  public altoprincipal=30;
  public anchocaja=110;
  @Input() texto: any;
  @Input() ancho: any = null;
  @Input() ancho_total = false;
  @Input() alto = 30;
  @Input() titulo = '';
  @Input() alinear_derecha = false;
  @Input() alinear_izquierda = false;
  @Input() alinear_centrado = false;
  @Input() alinear = 2; /* 1=derecha, 2=izquierda, 3=centro */
  @Input() CajaEstilo = 1; /* 0=normal, 1=borde redondeado, 2=fondo gris gris */

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (this.ancho_total===null) { this.ancho_total = false;}
    if (this.titulo===null) { this.titulo = '';}
    if (this.alinear_derecha===null) { this.alinear_derecha = false;}
    if (this.alinear_izquierda===null) { this.alinear_izquierda = false;}
    if (this.alinear_centrado===null) { this.alinear_centrado = false;}
    if (this.alinear===null) { this.alinear = 1;}
    if (this.CajaEstilo===null) { this.CajaEstilo = 1;}
      this.anchocaja=this.ancho+10;
      this.altoprincipal=this.alto+10;
      if (this.alinear_derecha) {
        this.alinear=1;
      } else if (this.alinear_izquierda) {
        this.alinear=2;
      } else if (this.alinear_centrado) {
        this.alinear=3;
      }
  }

}

