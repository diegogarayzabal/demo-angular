import {
  Component, Input, Output, EventEmitter, ViewChild, ElementRef,
  forwardRef, OnChanges, SimpleChanges
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, AbstractControl,
  ControlValueAccessor, Validators
} from '@angular/forms';
import * as _ from 'lodash';
import { FuncionesService } from '../../funciones.service';
import { Fechas_desde_hasta } from '../../globales';

@Component({
  selector: 'app-fecha-desde-hasta',
  standalone: false,
  templateUrl: './fecha-desde-hasta.component.html',
  styleUrls: ['../inputs.scss'],
  providers: [
    {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => FechaDesdeHastaComponent),
        multi: true
    },
    {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => FechaDesdeHastaComponent),
        multi: true
    }
  ]
})
export class FechaDesdeHastaComponent implements ControlValueAccessor, OnChanges {
  @Input() inputModel:Fechas_desde_hasta;
  @Input() AlinearDerecha=false;
  @Input() AlinearIzquierda=false;
  @Input() modo_cabecera=false;
  @Output() inputModelChange = new EventEmitter<Fechas_desde_hasta>();

  constructor(public Funcion: FuncionesService) { }
  writeValue(value: number) {}
  registerOnChange(fn: any) {}
  registerOnTouched(fn: any) {}

  ngOnChanges(changes: SimpleChanges) {
  }
  f_cambio_algo() {
    setTimeout (() => this.inputModelChange.emit(this.inputModel), 10);
  }
}
