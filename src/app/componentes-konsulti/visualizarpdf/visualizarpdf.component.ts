import { Component, OnChanges, Input, SimpleChanges, EventEmitter,Output,ElementRef,ViewChild } from '@angular/core';
import { Globals,ComponenteTabla} from '../../globales';
import { FuncionesService } from '../../funciones.service';
import { PdfsService } from '../../pdfs.service';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { ComponentesModule } from "../../componentes/componentes.module";
import { NgIf,NgClass } from '@angular/common';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-visualizarpdf',
  templateUrl: './visualizarpdf.component.html',
  styleUrls: ['./visualizarpdf.component.scss'],imports: [NgIf,NgClass,ComponentesModule,NgxExtendedPdfViewerModule]
})
export class VisualizarpdfComponent implements OnChanges {
  @ViewChild('divcontenedor') divcontenedor: ElementRef;
  @Input() pdf: any;
  @Input() boton_imprimir=true;
  @Input() boton_descargar=true;
  @Input() boton_copias=false;
  @Input() boton_copias_1y2=false;
  @Input() boton_copias_3=false;
  @Input() boton_copias_1y3=false;
  @Input() boton_mail=false;
  @Input() comprobante_emitido_enviar_cuentas:any[]=[];
  @Input() estemenu='';
  @Input() M:any=null;
  @Input() nombre_archivo_salida='archivo.pdf';
  @Input() con_cabecera=false;
  @Input() con_doble_cabecera=false;
  @Input() otros_pdf:any[]=[];
  @Input() otros_pdf_titulo='';
  @Output() regresar = new EventEmitter<any>();
  @Output() f_copias = new EventEmitter<any>();
  @Output() f_mail = new EventEmitter<any>();
  vsrc: any;
  otro_pdf:any=null;

  G: Globals;
  constructor(private http: HttpClient
    ,variables: Globals
    ,public Funcion: FuncionesService
    ,public PDFS: PdfsService
    ) {
    this.G=variables;
  }

  SuscripcionConfirmar: Subscription;
  SuscripcionConfirmador: Subscription;

  ngOnChanges(changes: SimpleChanges) {
    if (this.otros_pdf.length>0) this.otro_pdf=this.otros_pdf[0];
    setTimeout (() => this.inicializar(), 0);
  }
  inicializar() {
    this.vsrc=this.pdf.output('datauristring');
    this.vsrc=this.PDFS.f_sacar_cabecera_base64(this.vsrc);
  }
  f_imprimir() {
    setTimeout(() => {
      const printButton = document.getElementById('printButton') as HTMLElement;
      
      if (printButton) {
        printButton.click(); // Simula el clic en el botón de impresión
      } else {
        console.error('No se encontró el botón de imprimir.');
      }
    }, 1000); // Espera 1 segundo para asegurar que el visor está listo
  }
  
  f_descargar() {
    const pdfViewer = document.querySelector('ngx-extended-pdf-viewer') as any;
    if (pdfViewer) {
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfViewer['base64Src'] || pdfViewer['src']; // Usa base64 o URL
    downloadLink.download = this.nombre_archivo_salida;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    } else {
      console.error('No se encontró el visor de PDF.');
    }
  }

  f_enviar() {
    this.f_mail.emit();
    setTimeout (() => this.regresar.emit(), 100);
  }
  f_cantidad_item(item:any) {
    let ret='';
    return ret;
  }

  f_bajar_otro_pdf() {
    if (this.otro_pdf!==null) {
      const a = document.createElement("a");
      a.setAttribute("href",this.otro_pdf.datos);
      a.download = this.otro_pdf.nombre;
      a.click();
    }
  }
}
