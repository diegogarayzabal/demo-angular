import { Component, OnInit,Input,ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-imagen-mostrar',
  standalone: false,
  templateUrl: './imagen-mostrar.component.html',
  styleUrls: ['./imagen-mostrar.component.scss']
})
export class ImagenMostrarComponent implements OnInit {
  @Input() Src='';
  @Input() anchoyalto=600;
  imagen_ancho=0;
  imagen_alto=0;
  mostrar=false;

  constructor() { }

  ngOnInit(): void {
    let img = new Image();
    img.src = this.Src;
    img.decode().then(() => {
      if (img.width>img.height) {
        this.imagen_ancho=this.anchoyalto;
        this.imagen_alto=Math.round(this.anchoyalto/img.width*img.height);
      } else if (img.height>img.width) {
        this.imagen_alto=this.anchoyalto;
        this.imagen_ancho=Math.round(this.anchoyalto/img.height*img.width);
      } else {
        this.imagen_alto=this.anchoyalto;
        this.imagen_ancho=this.anchoyalto;
      }
      this.mostrar=true;
    });
  }
}

