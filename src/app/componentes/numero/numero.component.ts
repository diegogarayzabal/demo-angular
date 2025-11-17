import {
  Component, Input, Output, EventEmitter, ViewChild, ElementRef,
  forwardRef, OnChanges, SimpleChanges
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, Validators
} from '@angular/forms';
import { FuncionesService } from '../../funciones.service';

@Component({
  selector: 'app-numero',
  standalone: false,
  templateUrl: './numero.component.html',
  styleUrls: ['../inputs.scss'],
  providers: [
      {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => NumeroComponent),
          multi: true
      },
      {
          provide: NG_VALIDATORS,
          useExisting: forwardRef(() => NumeroComponent),
          multi: true
      }
  ]
})
export class NumeroComponent implements ControlValueAccessor, OnChanges {
  public altoprincipal=35;
  public anchocaja=110;
  public ancho_div=90;
  public focused = false;
  public valortexto = '';
  public ErrorTexto = '';
  public ConError = false;
  public valor_editando='';
  public debe_mostrar_titulo=true;
  @ViewChild('numericInput') numericInput: ElementRef;
  @Input() min: any = null;
  @Input() max: any = null;
  @Input() autocorrector = false;
  @Input() inputModel: number;
  @Input() decimales = 2;
  @Input() placeholder: string;
  @Input() ancho = 100;
  @Input() alto = 30;
  @Input() titulo = '';
  @Input() mostrar_titulo = true;
  @Input() alinear_derecha = false;
  @Input() alinear_izquierda = false;
  @Input() alinear_centrado = false;
  @Input() alinear = 1; /* 1=derecha, 2=izquierda, 3=centro */
  @Input() MostrarErrores = false;
  @Input() MostrarMensajedeError = false;
  @Input() MensajedeErrorTiempo = 3000;
  @Input() MensajedeErrorMinimo = 'La fecha no puede ser anterior a ';
  @Input() MensajedeErrorMaximo = 'La fecha no puede ser posterior a ';
  @Input() Mensaje = '';
  @Input() CajaEstilo = 1; /* 0=normal, 1=borde redondeado, 2=fondo gris gris */
  @Input() disabled = false;
  @Input() ConFormato = 1;
  @Input() modificable = true;
  @Input() AlinearDerecha=false;
  @Input() AlinearIzquierda=false;

  @Output() inputModelChange = new EventEmitter<number>();
  @Output() blur = new EventEmitter<number>();

  constructor(
    public Funcion: FuncionesService
  ) {
  }

  enfocartext() {
    if (!this.focused && this.modificable) {
      setTimeout(()=> {
        this.enfocado();
      },5);
    }
  }

  enfocado() {
      setTimeout(()=> {
        this.enfocado_ejecuta();
      },10);
  }

  enfocado_ejecuta() {
    this.focused=true;
    if (this.inputModel!==null && this.inputModel!==0) {
      this.numericInput.nativeElement.value=this.inputModel;
    } else {
      this.numericInput.nativeElement.value=null;
    }
    setTimeout(()=> {
      this.numericInput.nativeElement.focus();
    },15);
  }
  sin_foco() {
    this.focused = false;
  
    let valor = 0;
  
    if (this.numericInput.nativeElement.value !== '' && this.Funcion.es_numero(this.numericInput.nativeElement.value)) {
      valor = parseFloat(this.numericInput.nativeElement.value);
  
      if (valor !== this.Funcion.redondear(valor, this.decimales)) {
        valor = this.Funcion.redondear(valor, this.decimales);
      }
    }
  
    if (this.autocorrector) {
      if (this.min !== null && valor < this.min) {
        valor = this.min;
        if (this.MostrarMensajedeError) 
          this.Funcion.Mensaje(this.MensajedeErrorMinimo + this.min.toString(), 4, true, this.MensajedeErrorTiempo);
      } else if (this.max !== null && valor > this.max) {
        valor = this.max;
        if (this.MostrarMensajedeError) 
          this.Funcion.Mensaje(this.MensajedeErrorMaximo + this.max.toString(), 4, true, this.MensajedeErrorTiempo);
      }
    }
  
    this.inputModel = valor;
  
    this.numericInput.nativeElement.value = this.f_mostrar_numero();
  
    setTimeout(() => {
      this.emitir_valor();
    }, 20);
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
    if (this.alto===null || this.alto===undefined) { this.alto = 30;}
    if (this.ancho===null || this.ancho===undefined) { this.ancho = 100;}
    if (this.titulo===null || this.titulo===undefined) { this.titulo = '';}
    if (this.titulo==='' || !this.mostrar_titulo) { this.debe_mostrar_titulo=false; } else { this.debe_mostrar_titulo=true; }
    if (this.autocorrector===null) { this.autocorrector = false;}
    if (this.Mensaje===null || this.Mensaje===undefined) { this.Mensaje = '';}
    if (this.decimales===null || this.decimales===undefined) { this.decimales = 2;}
    if (this.CajaEstilo===null || this.CajaEstilo===undefined) { this.CajaEstilo = 1;}
    if (this.disabled===null || this.disabled===undefined) { this.disabled = false;}
    if (this.modificable===null || this.modificable===undefined) { this.modificable = true;}
    if (this.alinear_derecha===null || this.alinear_derecha===undefined) { this.alinear_derecha = false;}
    if (this.alinear_izquierda===null || this.alinear_izquierda===undefined) { this.alinear_izquierda = false;}
    if (this.alinear_centrado===null || this.alinear_centrado===undefined) { this.alinear_centrado = false;}
    if (this.alinear===null || this.alinear===undefined) { this.alinear = 1;}
    if (this.MostrarErrores===null || this.MostrarErrores===undefined) { this.MostrarErrores = false;}
    if (this.ConFormato===null || this.ConFormato===undefined) { this.ConFormato = 1;}
    if (!this.modificable) { this.disabled=true; }
    this.ancho_div=this.ancho-5;
    this.anchocaja=this.ancho+10;
    this.altoprincipal=this.alto+10;
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
    if (this.inputModel===null || this.inputModel===0) {
      if (this.ConFormato===0) {
        if (this.inputModel===null) {
          this.valor_editando='';
        } else {
          this.valor_editando='0';
        }
      } else if (this.ConFormato===1) {
        this.valor_editando=this.Funcion.formatNumber(0,this.decimales);
      }
    } else {
      if (this.ConFormato===0) {
        this.valor_editando=this.inputModel.toString();
      } else if (this.ConFormato===1) {
        this.valor_editando=this.Funcion.formatNumber(this.inputModel,this.decimales);
      }
    }
  }
  handleKeyDown(event: KeyboardEvent) {
    if (event.key==='Enter') {
      setTimeout(()=> {
        this.numericInput.nativeElement.blur();
      },25);
    }
  }

  f_cambio_numero() {
    let valor=0;
    if (this.numericInput.nativeElement.value!=='' && !this.Funcion.es_numero(this.numericInput.nativeElement.value)) {
      this.numericInput.nativeElement.value=this.numericInput.nativeElement.value.replace(/,/, '.');
    }
    if (this.numericInput.nativeElement.value!=='' && this.Funcion.es_numero(this.numericInput.nativeElement.value)) {
      valor=parseFloat(this.numericInput.nativeElement.value);
      if (valor!==this.Funcion.redondear(valor,this.decimales)) {
        valor=this.Funcion.redondear(valor,this.decimales);
        this.valor_editando=valor.toString();
      }
    }
    this.inputModel=valor;
    if (this.min!==null && valor<this.min) {
      this.ConError=true;
      this.ErrorTexto='Mín: '+this.min.toString();
      if (this.autocorrector) {
        setTimeout(() =>this.inputModel=this.min, 30 );
        setTimeout(() =>this.valor_editando=this.min.toString(), 32 );
      }
    } else if (this.max!==null && valor>this.max) {
      this.ConError=true;
      this.ErrorTexto='Máx: '+this.max.toString();
      if (this.autocorrector) {
        setTimeout(() =>this.inputModel=this.max , 30);
        setTimeout(() =>this.valor_editando=this.max.toString(), 32 );
      }
    } else {
      this.ConError=false;
    }
    setTimeout(() =>this.emitir_valor(), 40 );
  }
  emitir_valor() {
      setTimeout(() => this.inputModelChange.emit(this.inputModel), 45  );
  }
  esta_escrito() {
    if (this.valor_editando===null || this.valor_editando==='') { return false; } else { return true; }
  }
  f_mostrar_numero() {
      if (this.ConFormato===1) {
        if (this.valor_editando===null || this.valor_editando==='') {
          return this.Funcion.formatNumber(0,this.decimales);
        } else {
          return this.Funcion.formatNumber(this.inputModel,this.decimales);
        }
       } else {
        return this.inputModel.toString();
      }
  }
}
