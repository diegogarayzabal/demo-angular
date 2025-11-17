import { Component,Input, Output, OnInit, EventEmitter,ViewChild,ElementRef } from '@angular/core';

@Component({
  selector: 'app-boton',
  standalone: false,
  templateUrl: './boton.component.html',
  styleUrls: ['./boton.scss']
})
export class BotonComponent implements OnInit {
  @Input() ancho:number = null;
  @Input() ancho_porcentaje:number = null;
  @Input() alto = 30;
  @Input() titulo = '';
  @Input() alinear = 1; /* 1=derecha, 2=izquierda, 3=centro */
  @Input() Tipo = 1; /* 1=azul, 2=rojo  3=verde 4=gris 5=naranja*/
  @Input() MargenSuperior = 0;
  @Input() Azul = false;
  @Input() Rojo = false;
  @Input() Verde = false;
  @Input() Gris = false;
  @Input() Naranja = false;
  @Output() enter = new EventEmitter<number>();
  @ViewChild('elemento') elemento: ElementRef;
  estilo_ancho='';

  constructor() { }

  ngOnInit(): void {
    if (this.alto===null) { this.alto=30; }
    if (this.titulo===null) { this.titulo=''; }
    if (this.alinear===null) { this.alinear=1; }
    if (this.Tipo===null) { this.Tipo=1; }
    if (this.MargenSuperior===null) { this.MargenSuperior=0; }
    if (this.ancho_porcentaje!==null) {
      this.estilo_ancho=this.ancho_porcentaje+'%';
    } else if (this.ancho!==null) {
      this.estilo_ancho=this.ancho+'px';
    }
    if (this.Azul) { this.Tipo=1; }
    if (this.Rojo) { this.Tipo=2; }
    if (this.Verde) { this.Tipo=3; }
    if (this.Gris) { this.Tipo=4; }
    if (this.Naranja) { this.Tipo=5; }
  }
  presiono() {
    //this.elemento.nativeElement.focus();
    setTimeout (() => this.salir(), 50);
  }
  salir() {
    //this.elemento.nativeElement.blur();
    setTimeout (() => this.enter.emit(), 1);
  }

}
