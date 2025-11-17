import { Component } from '@angular/core';
import { Globals } from '../../globales';
import { FuncionesService } from '../../funciones.service';

@Component({
  selector: 'app-mensajes',
  standalone: false,
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.scss']
})
export class MensajesComponent {

  G: Globals;
    constructor(variables: Globals, public Funcion: FuncionesService) {this.G=variables;
  }
  
}
