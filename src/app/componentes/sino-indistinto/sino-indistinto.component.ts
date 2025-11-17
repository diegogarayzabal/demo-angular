import {
  Component, Input, Output, EventEmitter, ViewChild, ElementRef,
  forwardRef, OnChanges, SimpleChanges
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor
} from '@angular/forms';
import { IdNombre } from '../../globales';


@Component({
  selector: 'app-sino-indistinto',
  standalone: false,
  templateUrl: './sino-indistinto.component.html',
  providers: [
    {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SinoIndistintoComponent),
        multi: true
    },
    {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => SinoIndistintoComponent),
        multi: true
    }
]

})
export class SinoIndistintoComponent implements ControlValueAccessor, OnChanges {
  public altoprincipal=35;
  public anchocaja='100%';
  public focused = false;
  @ViewChild('elemento') elemento: ElementRef;
  @Input() inputModel:any=null;
  @Input() titulo='';
  @Input() texto_cualquiera='Cualquiera';
  @Input() texto1='SI';
  @Input() texto0='NO';
  @Input() modo_verdadero_falso=false;
  @Input() modo_vigente=false;
  @Input() ancho = 110;
  @Input() CajaEstilo = 1; /* 0=normal, 1=borde redondeado, 2=fondo gris gris */
  @Input() AlinearDerecha=false;
  @Input() AlinearIzquierda=false;
  @Output() inputModelChange = new EventEmitter<any>();
  datos:IdNombre[]=[];
  cargado=false;

  constructor() { }
  writeValue(value: number) {}
  registerOnChange(fn: any) {}
  registerOnTouched(fn: any) {}
  ngOnChanges(changes: SimpleChanges) {
    if (this.modo_verdadero_falso) {
      this.texto1='Verdadero';
      this.texto0='Falso';
    } else if (this.modo_vigente) {
      this.texto1='Vigente';
      this.texto0='No Vigente';
    }
    this.datos.push({id:-1,nombre:this.texto_cualquiera});
    this.datos.push({id:1,nombre:this.texto1});
    this.datos.push({id:0,nombre:this.texto0});
    if (this.inputModel===null || this.inputModel['id']===undefined) {
      this.inputModel=this.datos[0];
    } else {
      if (this.inputModel.id===-1) this.inputModel=this.datos[0];
      if (this.inputModel.id===1) this.inputModel=this.datos[1];
      if (this.inputModel.id===0) this.inputModel=this.datos[2];
    }
    this.cargado=true;    
  }
  cambio() {
    this.inputModelChange.emit(this.inputModel);
  }

}

