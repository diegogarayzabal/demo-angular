import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-archivo',
  standalone: false,
  templateUrl: './archivo.component.html',
  styleUrls: ['./archivo.component.scss']
})
export class ArchivoComponent implements OnInit {
  @Input() titulo = '';
  @Input() Efectos=true;
  @Input() alto=28;
  @Input() ancho:number=null;
  @Input() DevolverExtension=false;
  @Input() FondoConfirmar=false;
  @Input() FondoCancelar=false;
  @Input() FondoModificar=false;
  @Input() FondoCeleste=false;
  @Input() FondoGrisClaro=false;
  @Input() FondoRosaClaro=false;
  @Input() FondoVerde=false;
  @Input() FondoNaranja=false;
  @Input() DevolverSinProcesar=false;

  @Output() archivo_cargado = new EventEmitter<any>();
  archivo: any;

  constructor() { }

  ngOnInit(): void {
  }

  subio_archivo(e:any) {
    if (this.DevolverSinProcesar) {
      this.archivo_cargado.emit(e);
    } else {
      this.archivo = e.target.files[0];
      if (this.archivo!==undefined) {
        this.procesar();
      }
    }
  }
  procesar() {
    let resultado='';
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      let posicion_punto=-1,extension='',nombre=this.archivo.name;
      for (let a=0;a<this.archivo.name.length;a++) {
        if (this.archivo.name.substring(a,a+1)==='.') posicion_punto=a;
      }
      if (posicion_punto>=0) {
        nombre=this.archivo.name.substring(0,posicion_punto);
        extension=this.archivo.name.substring(posicion_punto+1,this.archivo.name.length);
      }
      if (fileReader.result!==null) resultado=fileReader.result.toString();
      if (this.DevolverExtension) {
        this.archivo_cargado.emit({nombre:nombre,extension:extension,contenido:resultado});
      } else {
        this.archivo_cargado.emit(resultado);
      }
    };
    if (this.DevolverExtension) {
      fileReader.readAsDataURL(this.archivo);
    } else {
      fileReader.readAsText(this.archivo);
    }
  }
}
