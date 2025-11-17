import {
  Component, Input, Output, EventEmitter, ViewChild, ElementRef,
  forwardRef, OnChanges, SimpleChanges
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor
} from '@angular/forms';
import { Globals } from '../../globales';


@Component({
  selector: 'app-select-especial',
  standalone: false,
  templateUrl: './select-especial.component.html',
  styleUrls: ['../inputs.scss'],
  providers: [
      {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => SelectEspecialComponent),
          multi: true
      },
      {
          provide: NG_VALIDATORS,
          useExisting: forwardRef(() => SelectEspecialComponent),
          multi: true
      }
  ]
})

export class SelectEspecialComponent implements ControlValueAccessor, OnChanges {
  public altoprincipal=30;
  public anchocaja='100%';
  public focused = false;
  @ViewChild('elemento') elemento: ElementRef;
  @Input() inputModel: any;
  @Input() datos: any;
  @Input() campo = 'nombre';
  @Input() ancho_px: any = null;
  @Input() ancho_porcentaje:number = null;
  @Input() ancho_maximo_px:number = null;
  @Input() ancho_maximo_porcentaje:number = null;
  @Input() alto:number = null;
  @Input() buscable = true;
  @Input() borrable = false;
  @Input() titulo = '';
  @Input() mostrar_titulo = true;
  @Input() solo_lectura = false;
  @Input() AlinearDerecha=false;
  @Input() AlinearIzquierda=false;
  @Output() inputModelChange = new EventEmitter<any>();
  @Output() blur = new EventEmitter<any>();
  estilo_ancho='100%';
  estilo_ancho_maximo='100%';

  G: Globals;
  constructor(variables: Globals
    ) {
    this.G=variables;
  }

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
    if (this.campo===null) { this.campo = 'nombre';}
    if (this.titulo===null) { this.titulo = '';}
    if (this.titulo==='') { this.mostrar_titulo=false; }
    if (this.buscable===null) { this.buscable = true;}
    if (this.borrable===null) { this.borrable = true;}
      if (this.ancho_porcentaje!==null) {
        this.estilo_ancho=this.ancho_porcentaje+'%';
      } else if (this.ancho_px!==null) {
        if (this.ancho_px>this.G.ancho) {
          this.ancho_px=this.G.ancho-10;
        }
        this.estilo_ancho=this.ancho_px+'px';
      }
      if (this.ancho_maximo_porcentaje!==null) {
        this.estilo_ancho_maximo=this.ancho_maximo_porcentaje+'%';
      } else if (this.ancho_maximo_px!==null) {
        this.estilo_ancho_maximo=this.ancho_maximo_px+'px';
      }
      if (!this.borrable && this.inputModel===null) this.inputModel=this.datos[0];
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

