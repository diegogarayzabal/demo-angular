import { Component, OnInit,Input,ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-menu-item',
  standalone: false,
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss','../inputs.scss']
})
export class MenuItemComponent implements OnInit {
  @Input() Titulo='';
  @Input() EsImagen=true;
  @Input() EsDobleTexto=false;
  @Input() DobleTextoDatos:any=null;
  @Input() DobleTextoAncho=160;
  @Input() Seleccionado=false;
  @Input() Imagen='';
  @Input() Src='';
  @Input() ImagenAgregar=false;
  @Input() ImagenBorrar=false;
  @Input() ImagenModificar=false;
  @Input() ImagenChequeado=false;
  @Input() ImagenSinChequear=false;
  @Input() ImagenGuardar=false;
  @Input() ImagenRegresar=false;
  @Input() ImagenRenovar=false;
  @Input() ImagenBasurero=false;
  @Input() ImagenFiltro=false;
  @Input() ImagenTilde=false;
  @Input() ImagenImpresora=false;
  @Input() ImagenInformacion=false;
  @Input() ImagenLista=false;
  @Input() ImagenTransferencia=false;
  @Input() ImagenExcel=false;
  @Input() ImagenPdf=false;
  @Input() ImagenAnchoFijo=true;
  @Input() SeleccionadoDobleAncho=true;
  
  @Input() Efectos=true;
  @Input() AlinearDerecha=false;
  @Input() AlinearIzquierda=false;
  @Input() TextoCentrado=false;
  @Input() FondoConfirmar=false;
  @Input() FondoCancelar=false;
  @Input() FondoModificar=false;
  @Input() FondoCeleste=false;
  @Input() FondoGrisClaro=false;
  @Input() FondoRosaClaro=false;
  @Input() FondoVerde=false;
  @Input() FondoNaranja=false;
  @Input() FondoAmarillo=false;
  @Input() FondoNegroTexto=false;
  @Input() ImagenTamanio=2;
  @Input() Negrita=false;
  @Input() LetraGrande=false;
  @ViewChild('principal') principal: ElementRef;
  mostrar=false;
  path_imagen='assets/';

  constructor() { }

  ngOnInit(): void {
    if (this.ImagenAgregar) this.Imagen='mas_circular.svg';
    if (this.ImagenBorrar) this.Imagen='cruz2.svg';
    if (this.ImagenModificar) this.Imagen='modificar.svg';
    if (this.ImagenChequeado) this.Imagen='chequeado_si.svg';
    if (this.ImagenSinChequear) this.Imagen='chequeado_no.svg';
    if (this.ImagenGuardar) this.Imagen='guardar.svg';
    if (this.ImagenRegresar) this.Imagen='regresar.svg';
    if (this.ImagenRenovar) this.Imagen='renovar.svg';
    if (this.ImagenBasurero) this.Imagen='basurero.svg';
    if (this.ImagenFiltro) this.Imagen='menu.svg';
    if (this.ImagenTilde) this.Imagen='tilde.svg';
    if (this.ImagenImpresora) this.Imagen='impresora.svg';
    if (this.ImagenInformacion) this.Imagen='informacion.svg';
    if (this.ImagenLista) this.Imagen='grading.svg';
    if (this.ImagenTransferencia) this.Imagen='transferencia.svg';
    if (this.ImagenExcel) this.Imagen='excel.png';
    if (this.ImagenPdf) this.Imagen='pdf.png';
    if (this.Imagen==='') this.Imagen='atencion3.svg';
    if (this.Src==='') {
      this.path_imagen+=this.Imagen;
    } else {
      this.path_imagen=this.Src;
    }
    setTimeout (() => this.mostrar=true, 100);
  }
  f_sacar_foco() {
    setTimeout(()=> {
      this.principal.nativeElement.blur();
    },10);
  }

}
