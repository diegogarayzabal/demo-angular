import {
  Component, Input, Output, EventEmitter, ViewChild, ElementRef,
  forwardRef, OnChanges, SimpleChanges
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor
} from '@angular/forms';


@Component({
  selector: 'app-select-comun',
  standalone: false,
  templateUrl: './select-comun.component.html',
  styleUrls: ['../inputs.scss'],
  providers: [
      {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => SelectComunComponent),
          multi: true
      },
      {
          provide: NG_VALIDATORS,
          useExisting: forwardRef(() => SelectComunComponent),
          multi: true
      }
  ]
})
export class SelectComunComponent implements ControlValueAccessor, OnChanges {
  public altoprincipal=35;
  public anchocaja='100%';
  public focused = false;
  @ViewChild('elemento') elemento: ElementRef;
  @Input() inputModel: any;
  @Input() datos: any;
  @Input() campo = 'nombre';
  @Input() ancho: any = null;
  @Input() ancho_porcentaje:number = null;
  @Input() ancho_maximo_px:number = null;
  @Input() ancho_maximo_porcentaje:number = null;
  @Input() alto = 30;
  @Input() titulo = '';
  @Input() mostrar_titulo = true;
  @Input() solo_lectura = false;
  @Input() CajaEstilo = 1; /* 0=normal, 1=borde redondeado, 2=fondo gris gris */
  @Input() AlinearDerecha=false;
  @Input() AlinearIzquierda=false;

  @Output() inputModelChange = new EventEmitter<any>();
  @Output() blur = new EventEmitter<any>();
  estilo_ancho='100%';
  estilo_ancho_maximo='100%';

  constructor() { }

  enfocartext() {
    setTimeout(() =>
    this.elemento.nativeElement.focus()
    );
  }

  writeValue(value: number) {
  }

  registerOnChange(fn: any) {
  }

  registerOnTouched(fn: any) {
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

    if (this.campo===null) { this.campo = 'nombre';}
    if (this.alto===null) { this.alto = 30;}
    if (this.titulo===null) { this.titulo = '';}
    if (this.titulo==='') { this.mostrar_titulo=false; }
    if (this.CajaEstilo===null) { this.CajaEstilo = 1;}
      if (this.ancho!==null) {
        this.anchocaja=this.ancho.toString()+'px';
      }
      this.anchocaja=this.ancho+10;
      this.altoprincipal=this.alto+10;
    if (this.inputModel===null) this.inputModel=this.datos[0];
  }

  enfocado() {
    this.focused=true;
  }

  sin_foco() {
    this.focused=false;
    this.blur.emit(this.inputModel);
  }

  cambio() {
    this.inputModelChange.emit(this.inputModel);
  }

}

