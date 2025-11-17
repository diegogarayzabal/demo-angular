import { Component, OnChanges, Input,SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-imagenes',
  standalone: false,
  templateUrl: './imagenes.component.html',
  styleUrls: ['./imagenes.component.scss']
})
export class ImagenesComponent implements OnChanges {
  @Input() tamanio=1;
  @Input() tildado=true;
  @Input() imagen='';
  @Input() texto='';
  ancho=0;
  alto=0;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (this.tamanio===null || this.tamanio===1) {
      this.ancho=26;
      this.alto=26;
    }
  }

}
