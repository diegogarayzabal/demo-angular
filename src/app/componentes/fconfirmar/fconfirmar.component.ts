import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { Globals,FConfirmar, ConfirmarTabla, ConfirmarTablaCabecera } from '../../globales';
import { FuncionesService } from '../../funciones.service';

@Component({
  selector: 'app-fconfirmar',
  standalone: false,
  templateUrl: './fconfirmar.component.html',
  styleUrls: ['./fconfirmar.component.scss','../inputs.scss','../../app.component.scss','../../app.estilosgenerales.scss']

})
export class FConfirmarComponent implements OnInit {
  @Input() datos:FConfirmar=null;
  @Output() cerrar = new EventEmitter<any>();
  componentes:any[]=[];
  componentes_tablas:ConfirmarTabla[]=[];
  respuesta=0;
  separador_respuestas=true;
  ancho=700;
  overflowy=false;
  termino_de_cargar=false;

  G: Globals;
  constructor(variables: Globals,public Funcion: FuncionesService) {this.G=variables;
  }
  /*
  confirmador(datos)
  separador_respuestas:false,
  mensaje:'xxxxx',
  tipo:1,
  ancho:xxx
  componentes:[
    {tipo:'select-especial',dato:xxxxx,datos:fuente,buscable:true,borrable:false},
    {tipo:'tabla',datos:fuente,retorna_item:false,campos:[{titulo:'xxxx',alinear:'center',nombre:'nombrecampo',ancho_px:100,formato_numerico:false,formato_decimales:2}]}
    {tipo:'texto',dato:pnombre,titulo:'Nombre:',ancho_porcentaje:100}
    ],
  respuestas:
  si no quiero pasar vacio []
  si es nulo o sin definir carga ACEPTAR y CANCELAR
  */
  ngOnInit() {
    setTimeout (() => this.inicializar(), 10);
  }
  inicializar() {
    this.separador_respuestas=true;
    if (!this.G.modo_celular) {
      if (this.datos.ancho!==undefined && this.datos.ancho!==null) {
        this.ancho=this.datos.ancho;
      } else {
        this.ancho=700;
      }
    }
    if (this.ancho+10>this.G.ancho) {
      this.ancho=this.G.ancho-10;
    }
    if (this.datos.componentes.length>0) {
      for (let c of this.datos.componentes) {
        if (c.titulo==undefined || c.titulo===null) { c.titulo=''; }
        if (c.tipo==='select-especial') {
          if (c.campo===undefined || c.campo===null) {
            c.campo='nombre';
          }
          if (c.borrable===undefined || c.borrable===null) c.borrable=false;
          if (c.buscable===undefined || c.buscable===null) c.buscable=true;
          if (c.ancho_px===null || c.ancho_px===undefined || c.ancho_px+30>this.ancho) {
            c.ancho_px=this.ancho-30;
          }
        } else if (c.tipo==='texto') {
          if (c.ancho===null || c.ancho===undefined || c.ancho+30>this.ancho) {
            c.ancho=this.ancho-30;
          }
        } else if (c.tipo==='textarea') {
          if (c.ancho===null || c.ancho===undefined || c.ancho+40>this.ancho) {
            c.ancho=this.ancho-40;
          }
          if (c.alto===null || c.alto===undefined) {
            c.alto=150;
          }
        } else if (c.tipo==='fecha') {
          if (c.ConFechaMaxima===null || c.ConFechaMaxima===undefined) {
            c.ConFechaMaxima=false;
          }
          if (c.FechaMaximaDesdeFecha===null || c.FechaMaximaDesdeFecha===undefined) {
            c.FechaMaximaDesdeFecha='';
            c.ConFechaMaxima=false;
          }
          
        }
        if (c.tipo==='tabla') {
          this.overflowy=true;
          this.componentes_tablas.push(c.datos);
        } else {
          this.componentes.push(c);
        }
      }
    }
    setTimeout (() => this.f_termino(), 10);
  }
  f_termino() {
    this.termino_de_cargar=true;
  }
  retornar_item(retorna_item:any,item:any){
    if (retorna_item){
      this.retornar(1,item);
    }
  }
  retornar(valor:number,item:any=null) {
    const valores=[];
    if (this.datos.componentes!==undefined && this.datos.componentes!==null && this.datos.componentes.length>0) {
      for (let a=0;a<this.datos.componentes.length;a++){
        if (this.datos.componentes[a].tipo==='tabla' || this.datos.componentes[a].tipo==='tabla_sin_cabecera') {
          valores.push(item);
        } else {
          valores.push(this.datos.componentes[a].dato);
        }
      }
    }
    this.cerrar.emit({respuesta:valor,valores:valores});
  }
  f_formato(campo:ConfirmarTablaCabecera,item_general:any=null) {
    if (campo.es_numero && campo.numerico_con_formato) {
      return this.Funcion.formatNumber(item_general[campo.nombre_del_campo],campo.decimales);
    } else {
      return item_general[campo.nombre_del_campo];
    }
  }
  f_tiene_sumatoria(campos:ConfirmarTablaCabecera[],datos:any[]) {
    let totales:any[]=[];
    let sumar=false;
    for (let a=0;a<campos.length;a++) {
      let texto='';
      if (campos[a].generar_sumatoria) {
        sumar=true;
        let t=0;
        for (let d of datos) {
          t+=d[a];
        }
        if (campos[a].numerico_con_formato) {
          texto=this.Funcion.formatNumber(t,campos[a].decimales);
        } else {
          texto=t.toString();
        }
      }
      totales.push({texto:texto,alinear:campos[a].alinear});
    }
    return {tiene:sumar,totales:totales};
  }
}
