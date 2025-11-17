import { Component, OnInit,ViewChild, ViewContainerRef } from '@angular/core';
import { Globals,Paginar,Fechas_desde_hasta, IdNombre, Persona,FConfirmar } from '../../globales';
import { FuncionesService } from '../../funciones.service';
import { ComponentesModule } from "../../componentes/componentes.module";
import { NgIf,NgClass,NgFor } from '@angular/common';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-menu-visitas',
  templateUrl: './menu-visitas.component.html',
  styleUrls: ['../../app.component.scss','../../app.estilosgenerales.scss','../../bootstrap.css'],imports: [NgIf,NgFor,NgClass,ComponentesModule]
})
export class MenuVisitasComponent implements OnInit {
  @ViewChild('contenedorConfirmacion', { read: ViewContainerRef }) vcrConfirmador!: ViewContainerRef;
  estemenu='visitas';
  viendo_filtro=0;
  filtro_fechas=new Fechas_desde_hasta(true,null,true);
  filtro_persona:Persona=null;
  filtro_area:IdNombre=null;
  pantalla='';
  paginar: Paginar;
  movimientos:any[]=[];

  G: Globals;
  constructor(
    variables: Globals
    , public Funcion: FuncionesService
    ) {
    this.G=variables;
  }

  ngOnInit() {
    this.filtro_fechas.titulo_desde='Desde Fecha:';
    this.filtro_fechas.titulo_hasta='Hasta Fecha:';
    this.filtro_fechas.f_mes_anterior();
    this.filtro_fechas.desde=false;
    this.filtro_fechas.hasta=false;
    setTimeout (() => this.inicializar(), 0); }
  f_alternar_filtro(activar:number) {if (this.viendo_filtro>0) { this.viendo_filtro=0; } else { this.viendo_filtro=activar; }}
  inicializar() {
    this.paginar=new Paginar();
    this.viendo_filtro=1;
    if (!this.G.ModoProduccion) {
    }
  }
  async f_consultar() {
    this.pantalla='';
    let vpersona=0,varea=0;
    if (this.filtro_persona!==null) vpersona=this.filtro_persona.id;
    if (this.filtro_area!==null) varea=this.filtro_area.id;
    let respuesta_post=await this.Funcion.f_http_post(this.estemenu,'visitas.php','consulta',{fechas:JSON.stringify(this.filtro_fechas),area:varea,persona:vpersona});
    if (!respuesta_post.con_error)  {
      let data=respuesta_post.data;
      this.movimientos=[];
      for (let dato of data["listado"]) {
        dato.ordenar=dato.fecha;
        dato.creado_txt=this.Funcion.f_usuario(dato.usuario);
        dato.creado_fecha_txt=this.Funcion.mysqldatetime_a_php(dato.fecha,false);
        this.movimientos.push(dato);
      }
      this.Funcion.f_ordenar(this.movimientos,'ordenar');
      if (this.movimientos!==null && this.movimientos.length>1000 && !this.paginar.agrupar) {
        this.paginar.agrupar_cantidad=500;
        this.paginar.agrupar=true;
      }

      this.Funcion.f_repaginar(this.paginar,this.movimientos);
      setTimeout (() => this.f_mostrar_cuenta_ok(),10);
    }
  }
  f_mostrar_cuenta_ok() {
    this.pantalla='viendo_movimientos';
    this.viendo_filtro=0;
  }
  f_exportar() {
    const datos:any = [];
    for (let item of this.movimientos) {
      let vreferente=''; if (item.referente>0) vreferente=this.Funcion.f_persona(item.referente);
      datos.push({
        'Usuario':item.creado_txt
        ,'Fecha':this.Funcion.mysqldatetime_a_php(item.fecha,false)
        ,'Persona':this.Funcion.f_persona(item.persona)
        ,'Area':this.Funcion.f_traer_dato_tabla_texto(this.G.areas,item.area)
        ,'Motivo':item.motivo
      });
    }
    // Convertir JSON a hoja de cálculo
    const hoja = XLSX.utils.json_to_sheet(datos);

    // Crear libro y añadir la hoja
    const libro: XLSX.WorkBook = {
      Sheets: { 'Visitas': hoja },
      SheetNames: ['Visitas']
    };

    // Generar el archivo en memoria
    const excelBuffer: any = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });

    // Guardar el archivo usando file-saver
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, 'visitas.xlsx');
  }

}
