import { Injectable } from '@angular/core';
import { Globals,Persona } from './globales';
import { HttpClient } from '@angular/common/http';
import { FuncionesService } from './funciones.service';
import jsPDF from 'jspdf';

class FilaColumna {
  ancho=0;
  texto='';
  centrado=false;
  derecha=false;
  imagen_data='';
  anchoyalto=25;
  constructor(ancho=10,texto='',centrado=false,derecha=false,imagen_data='',anchoyalto=25) {
    this.ancho=ancho;
    this.texto=texto;
    this.centrado=centrado;
    this.derecha=derecha;
    this.imagen_data=imagen_data;
    this.anchoyalto=anchoyalto;
  }
}

@Injectable({
  providedIn: 'root'
})
export class PdfsService {

  G: Globals;
  constructor(
    private http: HttpClient
    ,variables: Globals
    , public Funcion: FuncionesService
    ) {
    this.G=variables;
  }
  pdf_mostrar_multilinea(pdf:jsPDF,texto:string,x:number,y:number,ancho:number,alto=6,interlineado:number=null) {
    if (interlineado===null) { interlineado=alto; }
    let vmostrar_lineas='';
    vmostrar_lineas = pdf.splitTextToSize(texto,ancho);
    let l: number;
    for (l=0;l<vmostrar_lineas.length;l++) {
      pdf.text(vmostrar_lineas[l],x,y+0.5);
      if (l+1!==vmostrar_lineas.length) { y=y+interlineado;} else {y=y+alto;}
    }
    return y;
  }
  pdf_linea_vertical(pdf:jsPDF,x:number,y_inicial:number,y_final:number) { pdf.line(x,y_inicial,x,y_final); }
  pdf_linea_horizontal(pdf:jsPDF,x_inicial:number,x_final:number,y:number) { pdf.line(x_inicial,y,x_final,y); }
  pdf_lineas_verticales(pdf:jsPDF,x:any=[],y_inicial:number,y_final:number) { for (let x1 of x) {pdf.line(x1,y_inicial,x1,y_final); } }
  pdf_lineas_horizontales(pdf:jsPDF,y:any=[],x_inicial:number,x_final:number) { for (let y1 of y) { pdf.line(x_inicial,y1,x_final,y1); } }
  f_sacar_cabecera_base64(t:string) {
    let a: number;
    let devolver='';
    for (a=0;a<t.length;a++) {
      const ver=t.substring(a,a+7);
      if (ver==='base64,') {
        devolver=t.substring(a+7,t.length);
        break;
      }
    }
    return devolver;
  }
  f_ngx_pdf(atributo:string) {
    if (atributo==='showFindButton' || atributo==='showZoomButtons') {
      return !this.G.modo_celular;
    } else {
      return null;
    }
  }

}


