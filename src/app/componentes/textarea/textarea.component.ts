import {
  Component, Input, Output, EventEmitter, ViewChild, ElementRef,
  forwardRef, OnChanges, SimpleChanges
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR
  ,NG_VALIDATORS
  ,ControlValueAccessor
} from '@angular/forms';

@Component({
  selector: 'app-textarea',
  standalone: false,
  templateUrl: './textarea.component.html',
  styleUrls: ['../inputs.scss'],
  providers: [
    {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TextareaComponent),
        multi: true
    },
    {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => TextareaComponent),
        multi: true
    }
  ]
})
export class TextareaComponent implements ControlValueAccessor, OnChanges {
  public altoprincipal=30;
  public focused = false;
  public valortexto = '';
  public ErrorTexto = '';
  public ConError = false;
  public debe_mostrar_titulo=true;
  @ViewChild('numericInput') numericInput: ElementRef;
  @Input() min: any = null;
  @Input() max: any = null;
  @Input() value: string;
  @Input() inputModel: string;
  @Input() placeholder: string;
  @Input() ancho:number = null;
  @Input() ancho_porcentaje:number = null;
  @Input() ancho_maximo_px:number = null;
  @Input() ancho_maximo_porcentaje:number = null;
  @Input() alto = 30;
  @Input() titulo = '';
  @Input() mostrar_titulo = true;
  @Input() en_mayusculas = false;
  @Input() alinear_derecha = false;
  @Input() alinear_izquierda = false;
  @Input() alinear_centrado = false;
  @Input() alinear = 2; /* 1=derecha, 2=izquierda, 3=centro */
  @Input() MostrarErrores = false;
  @Input() Mensaje = '';
  @Input() CajaEstilo = 1; /* 0=normal, 1=borde redondeado, 2=fondo gris gris, 3 completo tipo bootstrap*/
  @Input() disabled = false;
  @Input() ConFormato = 1;
  @Output() inputModelChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<string>();
  estilo_ancho='100%';
  estilo_ancho_maximo='100%';

  constructor() { }

  enfocartext() {
    this.focused=true;
    setTimeout(() =>
    this.numericInput.nativeElement.focus()
    );
  }

  writeValue(value: number) {
  }

  registerOnChange(fn: any) {
  }

  registerOnTouched(fn: any) {
  }

  setDisabledState(isDisabled: boolean) {
      this.disabled = isDisabled;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.ancho_porcentaje!==null) {
      this.estilo_ancho=this.ancho_porcentaje+'%';
    } else if (this.ancho!==null) {
      this.estilo_ancho=this.ancho+'px';
    }
    if (this.ancho_maximo_porcentaje!==null) {
      this.estilo_ancho_maximo=this.ancho_maximo_porcentaje+'%';
    } else if (this.ancho_maximo_px!==null) {
      this.estilo_ancho_maximo=this.ancho_maximo_px+'px';
    }
    if (this.alto===null) { this.alto = 30;}
    if (this.titulo===null) { this.titulo = '';}
    if (this.titulo==='' || !this.mostrar_titulo) { this.debe_mostrar_titulo=false; } else { this.debe_mostrar_titulo=true; }
    if (this.en_mayusculas===null) { this.en_mayusculas = false;}
    if (this.alinear_derecha===null) { this.alinear_derecha = false;}
    if (this.alinear_izquierda===null) { this.alinear_izquierda = false;}
    if (this.alinear_centrado===null) { this.alinear_centrado = false;}
    if (this.alinear===null) { this.alinear = 2;}
    if (this.MostrarErrores===null) { this.MostrarErrores = false;}
    if (this.Mensaje===null) { this.Mensaje = '';}
    if (this.CajaEstilo===null) { this.CajaEstilo = 1;}
    if (this.disabled===null) { this.disabled = false;}
    if (this.ConFormato===null) { this.ConFormato = 1;}
    if (this.CajaEstilo===3) {
      this.alto+=5;
      this.altoprincipal=this.alto;
      this.MostrarErrores=false;
    } else {
      this.altoprincipal=this.alto+10;
    }
    if (this.alinear_derecha) {
      this.alinear=1;
    } else if (this.alinear_izquierda) {
      this.alinear=2;
    } else if (this.alinear_centrado) {
      this.alinear=3;
    }
    if (this.MostrarErrores) {
      this.altoprincipal=this.alto+28;
    }
  }

  esta_escrito() {
    if (this.inputModel===null || this.inputModel===undefined) {
      return false;
    } else if (this.inputModel.toString().length>0) {
      return true;
    } else {
      return false;
    }
  }

  f_cambio() {
    if (this.en_mayusculas) {
      this.inputModel=this.inputModel.toUpperCase();
    }
    this.inputModelChange.emit(this.inputModel);
  }
  control_cambio(event: KeyboardEvent) {
    const valor=this.numericInput.nativeElement.value;
    if (this.min!==null && this.min>0 && valor.length<this.min) {
      this.ConError=true;
      this.ErrorTexto='Mínimo '+this.min.toString();
    } else if (this.max!==null && this.max>0 && valor.length>this.max) {
      this.ConError=true;
      this.ErrorTexto='Máximo '+this.max.toString();
    } else {
      this.ConError=false;
    }
  }

  enfocado() {
    this.focused=true;
  }

  sin_foco() {
    this.focused=false;
    setTimeout (() => this.blur.emit(), 0);
  }

}

