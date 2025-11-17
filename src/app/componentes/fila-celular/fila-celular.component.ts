import {
  Component, Input, Output, EventEmitter, ViewChild, ElementRef,
  forwardRef, OnChanges, SimpleChanges
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor
} from '@angular/forms';

@Component({
  selector: 'app-fila-celular',
  standalone: false,
  templateUrl: './fila-celular.component.html',
  styleUrls: ['./fila-celular.component.scss','../inputs.scss'],
  providers: [
    {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => FilaCelularComponent),
        multi: true
    },
    {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => FilaCelularComponent),
        multi: true
    }
  ]
})
export class FilaCelularComponent implements ControlValueAccessor, OnChanges {
  @ViewChild('elemento') elemento: ElementRef;
  @Input() inputModel: any;
  @Input() datos: any;
  @Input() campo = 'nombre';
  @Input() buscable = true;
  @Input() borrable = true;
  @Input() label = '';
  @Input() titulo = '';
  @Input() titulo2 = '';
  @Input() fondo = 'white';
  @Input() componente = '';
  @Input() alinear_derecha:boolean = null;
  @Input() alinear_izquierda:boolean = null;
  @Input() alinear_centrado:boolean = null;
  @Input() alinear = 1; /* 1=derecha, 2=izquierda, 3=centro */
  @Input() Tipo = 1; /* 1=azul, 2=rojo  3=verde*/
  @Input() Tipo2 = 1; /* 1=azul, 2=rojo  3=verde*/
  @Input() min:any = null;
  @Input() max:any = null;
  @Input() placeholder: string;
  @Input() disabled:boolean = null;
  @Input() modificable:boolean = null;
  @Input() anio_minimo:number = null;
  @Input() anio_maximo:number = null;
  @Input() CajaEstilo:number = null; /* 0=normal, 1=borde redondeado, 2=fondo gris gris */
  @Input() alto:number = null;
  @Input() autocorrector:boolean = null;
  @Input() decimales:number = null;
  @Input() ancho:number = null;
  @Input() MostrarErrores = false;
  @Input() Mensaje:any = null;
  @Input() ConFormato:number = null;
  @Input() ancho_px:number = null;
  @Input() ancho_porcentaje:number = null;
  @Input() texto:any=null;
  @Input() ancho_total:boolean = null;
  @Input() value:any=null;
  @Input() en_mayusculas:boolean = null;
  @Input() condicional_titulo='';
  @Input() MargenSuperior:number = null;
  @Input() estilo_switch_vertical = false;
  @Input() estilo_tilde=false;
  @Input() estilo_switch_horizontal=false;
  @Input() estilo_switch_horizontal_bootstrap=false;
  @Output() inputModelChange = new EventEmitter<any>();
  @Output() click = new EventEmitter<any>();
  @Output() blur = new EventEmitter<any>();
  @Output() inputModelChange2 = new EventEmitter<any>();
  @Output() valor_condicional = new EventEmitter<any>();
  @Output() enter = new EventEmitter<any>();
  @Output() enter2 = new EventEmitter<any>();
  constructor() { }

  writeValue(value: number) {
  }

  registerOnChange(fn: any) {
  }

  registerOnTouched(fn: any) {
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  f_blur() {
    this.blur.emit(this.inputModel);
  }

  f_click() {
    this.click.emit();
  }

  f_inputModelChange() {
    setTimeout (() => this.f_f_inputModelChangeOK(), 10);
  }
  f_f_inputModelChangeOK() {
    this.inputModelChange.emit(this.inputModel);
  }
  f_inputModelChange2() {
    setTimeout (() => this.f_inputModelChange2OK(), 10);
  }
  f_inputModelChange2OK() {
    this.inputModelChange2.emit(this.inputModel);
  }
  f_devolver_condicional() {
    setTimeout (() => this.f_devolver_condicionalOK(), 10);
  }
  f_devolver_condicionalOK() {
    this.valor_condicional.emit(this.inputModel.condicional);
  }
}
