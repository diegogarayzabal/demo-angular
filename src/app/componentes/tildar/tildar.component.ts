import { Component, Input, Output, OnChanges, forwardRef, EventEmitter, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import {
  NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor
} from '@angular/forms';

@Component({
  selector: 'app-tildar',
  standalone: false,
  templateUrl: './tildar.component.html',
  styleUrls: ['./tildar.component.scss','../../bootstrap.css'],
  providers: [
    {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TildarComponent),
        multi: true
    },
    {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => TildarComponent),
        multi: true
    }
]
})
export class TildarComponent implements ControlValueAccessor, OnChanges {
  @ViewChild('DivContenedor') DivContenedor: ElementRef;
  @Input() inputModel = false;
  @Input() modo=1;
  @Input() ancho=24;
  @Input() alto=40; //normal de 40 reducido de 36
  @Input() titulo='';
  @Input() titulo_izquierda=true;
  @Input() estilo=1; /* estilo1=caja con o sin tilde - estilo2 prendido apagado con texto */
  @Input() estilo_tilde:boolean=null;
  @Input() estilo_switch_horizontal:boolean=null;
  @Input() estilo_switch_vertical: any=null;
  @Input() estilo_switch_horizontal_bootstrap:boolean=null;
  @Input() modificable=true;
  @Input() con_recuadro=false;
  @Input() AlinearDerecha=false;
  @Input() AlinearIzquierda=false;
  @Output() inputModelChange = new EventEmitter<boolean>();

  constructor() { }

  writeValue(value: number) {
  }

  registerOnChange(fn: any) {
  }

  registerOnTouched(fn: any) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.estilo_tilde===null && this.estilo_switch_horizontal===null && this.estilo_switch_horizontal_bootstrap===null && this.estilo_switch_vertical===null) {
      this.estilo=4;
    } else if (!this.estilo_tilde && !this.estilo_switch_horizontal && !this.estilo_switch_horizontal_bootstrap && !this.estilo_switch_vertical) {
      this.estilo_switch_vertical=true;
    }
    if (this.estilo_tilde) { this.estilo=1; }
    if (this.estilo_switch_horizontal) { this.estilo=2; }
    if (this.estilo_switch_horizontal_bootstrap) { this.estilo=3; }
    if (this.estilo_switch_vertical) { this.estilo=4; }
    if(this.estilo===1) {
      setTimeout(() =>
     this.DivContenedor.nativeElement.focus()
    );
    }
  }

  cambio() {
    if (this.modificable) {
      this.inputModel=!this.inputModel;
      this.inputModelChange.emit(this.inputModel);
    }
  }

}
