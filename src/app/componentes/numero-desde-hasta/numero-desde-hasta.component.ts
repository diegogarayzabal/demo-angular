import {
  Component, Input, Output, EventEmitter, ViewChild, ElementRef,
  forwardRef, OnChanges, SimpleChanges
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, AbstractControl,
  ControlValueAccessor, Validators
} from '@angular/forms';
import * as _ from 'lodash';
import { Numeros_desde_hasta } from '../../globales';

@Component({
  selector: 'app-numero-desde-hasta',
  standalone: false,
  templateUrl: './numero-desde-hasta.component.html',
  styleUrls: ['../inputs.scss'],
  providers: [
    {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NumeroDesdeHastaComponent),
        multi: true
    },
    {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => NumeroDesdeHastaComponent),
        multi: true
    }
  ]
})

export class NumeroDesdeHastaComponent implements ControlValueAccessor, OnChanges {
  @Input() inputModel:Numeros_desde_hasta;
  @Input() AlinearDerecha=false;
  @Input() AlinearIzquierda=false;
  @Input() modo_cabecera=false;
  @Output() inputModelChange = new EventEmitter<Numeros_desde_hasta>();

  constructor() { }
  writeValue(value: number) {}
  registerOnChange(fn: any) {}
  registerOnTouched(fn: any) {}

  ngOnChanges(changes: SimpleChanges) {
    if (!this.inputModel.ver_uno_solo) this.inputModel.uno_solo=false;
  }
  f_cambio_uno_solo() {
    if (!this.inputModel.ver_uno_solo) this.inputModel.uno_solo=false;
    this.f_cambio_algo();
  }

  f_cambio_algo() {
    setTimeout (() => this.inputModelChange.emit(this.inputModel), 10);
  }
}
