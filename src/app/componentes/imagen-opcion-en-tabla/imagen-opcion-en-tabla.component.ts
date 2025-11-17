import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-imagen-opcion-en-tabla',
  standalone: false,
  templateUrl: './imagen-opcion-en-tabla.component.html',
  styleUrls: ['./imagen-opcion-en-tabla.component.scss']
})
export class ImagenOpcionEnTablaComponent implements OnInit {
  @Input() Titulo='';
  @Input() Imagen='';
  @Input() ImagenAgregar=false;
  @Input() ImagenBorrar=false;
  @Input() ImagenModificar=false;
  @Input() ImagenChequeado=false;
  @Input() ImagenSinChequear=false;
  @Input() ImagenGuardar=false;
  @Input() ImagenRegresar=false;
  @Input() ImagenRenovar=false;
  @Input() ImagenBasurero=false;
  @Input() ImagenTilde=false;
  @Input() ImagenImpresora=false;
  @Input() ImagenInformacion=false;
  @Input() ImagenLista=false;
  @Input() ImagenTransferencia=false;
  @Input() ImagenExcel=false;
  @Input() ImagenCandadoAbierto=false;
  @Input() ImagenCandadoCerrado=false;
  @Input() ImagenPdf=false;
  @Input() Ok=false;
  @Input() Tamanio=2;
  @Input() Ampliar=false;
  @Input() AlinearDerecha=false;
  @Input() AlinearIzquierda=false;
  @Input() FondoVerde=false;
  @Input() FondoCeleste=false;
  @Input() FondoAzul=false;
  @Input() FondoRojo=false;
  @Input() FondoVerdeClaro=false;
  @Input() FondoGrisClaro=false;
  @Input() FondoNaranja=false;
  @Input() FondoBlanco=false;
  @Input() FondoColor='';
  @Input() con_recuadro=false;


  mostrar=false;

  constructor() { }

  ngOnInit(): void {
    if (this.ImagenAgregar) this.Imagen='mas_circular.svg';
    if (this.ImagenBorrar) this.Imagen='cruz2.svg';
    if (this.ImagenModificar) this.Imagen='modificar.svg';
    if (this.ImagenChequeado) this.Imagen='chequeado_si.svg';
    if (this.ImagenSinChequear) this.Imagen='chequeado_no.svg';
    if (this.ImagenGuardar) this.Imagen='guardar.svg';
    if (this.ImagenRegresar) this.Imagen='regresar.svg';
    if (this.ImagenBasurero) this.Imagen='basurero.svg';
    if (this.ImagenTilde) this.Imagen='tilde.svg';
    if (this.ImagenRenovar) this.Imagen='renovar.svg';
    if (this.ImagenImpresora) this.Imagen='impresora.svg';
    if (this.ImagenInformacion) this.Imagen='informacion.svg';
    if (this.ImagenLista) this.Imagen='grading.svg';
    if (this.ImagenTransferencia) this.Imagen='transferencia.svg';
    if (this.ImagenExcel) this.Imagen='excel.png';
    if (this.ImagenCandadoAbierto) this.Imagen='candado_abierto.svg';
    if (this.ImagenCandadoCerrado) this.Imagen='candado_cerrado.svg';
    if (this.ImagenPdf) this.Imagen='pdf.png';
    if (this.Ok) this.Imagen='ok.svg';
    if (this.Imagen==='') this.Imagen='modificar.svg';
    if (this.FondoColor==='verde') this.FondoVerde=true;
    if (this.FondoColor==='celeste') this.FondoCeleste=true;
    if (this.FondoColor==='azul') this.FondoAzul=true;
    if (this.FondoColor==='rojo') this.FondoRojo=true;
    if (this.FondoColor==='verde_claro') this.FondoVerdeClaro=true;
    if (this.FondoColor==='gris_claro') this.FondoGrisClaro=true;
    if (this.FondoColor==='naranja') this.FondoNaranja=true;
    setTimeout (() => this.mostrar=true, 100);
  }

}
