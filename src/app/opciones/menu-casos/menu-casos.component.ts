import { Component, OnInit,ViewChild, ViewContainerRef } from '@angular/core';
import { Globals,Paginar,IdNombre, Persona,FConfirmar } from '../../globales';
import { FuncionesService } from '../../funciones.service';
import { ComponentesModule } from "../../componentes/componentes.module";
import { NgIf,NgClass,NgFor } from '@angular/common';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

class Modificando {
  persona:Persona=null;
  area:IdNombre=null;
  nombre='';
  referente:Persona=null;
  contraparte='';
  numero='';
  modificando=false;
}

@Component({
  selector: 'app-menu-casos',
  templateUrl: './menu-casos.component.html',
  styleUrls: ['../../app.component.scss','../../app.estilosgenerales.scss','../../bootstrap.css'],imports: [NgIf,NgFor,NgClass,ComponentesModule]
})
export class MenuCasosComponent implements OnInit {
  @ViewChild('contenedorConfirmacion', { read: ViewContainerRef }) vcrConfirmador!: ViewContainerRef;
  estemenu='casos';
  viendo_filtro=0;
  filtro_persona:Persona=null;
  filtro_referente:Persona=null;
  filtro_area:IdNombre=null;
  filtro_estado:IdNombre=null;
  pantalla='';
  paginar: Paginar;
  movimientos:any[]=[];
  viendo_uno:any=null;
  viendo_uno_que=0;
  notas:any[]=[];
  estados:any[]=[];
  modificando:Modificando;

  G: Globals;
  constructor(variables: Globals
    , public Funcion: FuncionesService
    ) {
    this.G=variables;
  }

  ngOnInit() {
    this.modificando=new Modificando();
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
    let vpersona=0,varea=0,vreferente=0,vestado=0;
    if (this.filtro_persona!==null) vpersona=this.filtro_persona.id;
    if (this.filtro_area!==null) varea=this.filtro_area.id;
    if (this.filtro_referente!==null) vreferente=this.filtro_referente.id;
    if (this.filtro_estado!==null) vestado=this.filtro_estado.id;
    
    let respuesta_post=await this.Funcion.f_http_post(this.estemenu,'casos.php','consulta',{area:varea,persona:vpersona,referente:vreferente,estado:vestado});
    if (!respuesta_post.con_error)  {
      let data=respuesta_post.data;
      this.movimientos=[];
      for (let dato of data["listado"]) {
        dato.ordenar=dato.nombre;
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
  f_ver(item:any) {
    this.viendo_uno_que=0;
    this.viendo_uno=item;
    this.f_actualizar_uno();
  }
  async f_actualizar_uno() {
    let respuesta_post=await this.Funcion.f_http_post(this.estemenu,'casos.php','traer_uno',{accion:'',id:this.viendo_uno.caso_id});
    if (!respuesta_post.con_error)  {
      let data=respuesta_post.data;
      this.viendo_uno=data['dato'];
      this.f_asignar_en_modificando();
      this.notas=[];
      for (let dato of data["notas"]) {
        this.notas.push(dato);
      }
      this.Funcion.f_ordenar(this.notas,'fecha',false);
      this.estados=[];
      for (let dato of data["estados"]) {
        dato.ordenar=dato.fecha+dato.fecha_carga;
        this.estados.push(dato);
      }
      this.Funcion.f_ordenar(this.estados,'ordenar',false);
    }
  }
  f_asignar_en_modificando() {
    this.modificando=new Modificando();
    this.modificando.persona=this.Funcion.buscar_por_id(this.G.personas,this.viendo_uno.persona);
    if (this.viendo_uno.referente>0) this.modificando.referente=this.Funcion.buscar_por_id(this.G.personas,this.viendo_uno.referente);
    this.modificando.area=this.Funcion.buscar_por_id(this.G.areas,this.viendo_uno.area);
    this.modificando.nombre=this.viendo_uno.nombre;
    this.modificando.contraparte=this.viendo_uno.contraparte;
    this.modificando.numero=this.viendo_uno.numero;
  }
  f_ver_uno(cual:number) {
    this.viendo_uno_que=cual;
    this.f_asignar_en_modificando();
  }
  async f_guardar() {
    let vreferente=0; if (this.modificando.referente!==null) vreferente=this.modificando.referente.id;
    if (vreferente>0 && this.modificando.persona.id===vreferente) { this.Funcion.Alerta('El referente no puede ser el mismo cliente'); return; }
    if (this.modificando.nombre==='') { this.Funcion.Alerta('Debe indicar el nombre del caso'); return; }
    if (this.modificando.contraparte==='') { this.Funcion.Alerta('Debe indicar el nombre de la contraparte'); return; }
    let respuesta=await this.Funcion.ConfirmarComponente(new FConfirmar('Confirma los datos del caso?'),this.vcrConfirmador);
    if (respuesta.respuesta===1) {
      let respuesta_post=await this.Funcion.f_http_post(this.estemenu,'casos.php','caso_modificar',{id:this.viendo_uno.caso_id,referente:vreferente,area:this.modificando.area.id,nombre:this.modificando.nombre,contraparte:this.modificando.contraparte,numero:this.modificando.numero});
      if (!respuesta_post.con_error)  {
        this.Funcion.Alerta('Caso Modificado');
        this.f_actualizar_uno();
      }
    }
  }
  async f_nuevanota() {
    let parametros=new FConfirmar('NUEVA NOTA');
    parametros.componentes.push({tipo:'texto',dato:'',ancho:450});
    parametros.ancho=470;
    let respuesta=await this.Funcion.ConfirmarComponente(parametros,this.vcrConfirmador);
    if (respuesta.respuesta===1 && respuesta.valores[0]!=='') {
      let respuesta_post=await this.Funcion.f_http_post(this.estemenu,'casos.php','caso_nueva_nota',{id:this.viendo_uno.caso_id,texto:respuesta.valores[0]});
      if (!respuesta_post.con_error)  {
        this.Funcion.Alerta('Nota agregada');
        this.f_actualizar_uno();
      }
    }
  }
  async f_nuevo_estado() {
    let parametros=new FConfirmar('NUEVO ESTADO');
    parametros.componentes.push({tipo:'select-especial',datos:this.G.estados_casos,dato:this.G.estados_casos[0],ancho_px:450});
    parametros.ancho=450;
    let respuesta=await this.Funcion.ConfirmarComponente(parametros,this.vcrConfirmador);
    if (respuesta.respuesta===1 && respuesta.valores[0]!==null) {
      let respuesta_post=await this.Funcion.f_http_post(this.estemenu,'casos.php','caso_nuevo_estado',{id:this.viendo_uno.caso_id,estado:respuesta.valores[0].id});
      if (!respuesta_post.con_error)  {
        this.Funcion.Alerta('Estado modificado');
        this.f_actualizar_uno();
      }
    }
  }
  f_exportar(cual:number) {
    if (cual===1) {
      const datos:any = [];
      for (let item of this.movimientos) {
        let vreferente=''; if (item.referente>0) vreferente=this.Funcion.f_persona(item.referente);
        datos.push({
          'Número':item.numero
          ,'Nombre':item.nombre
          ,'Area':this.Funcion.f_traer_dato_tabla_texto(this.G.areas,item.area)
          ,'Cliente':this.Funcion.f_persona(item.persona)
          ,'Referente':vreferente
          ,'Contraparte':item.contraparte
          ,'Estado':this.Funcion.f_traer_dato_tabla_texto(this.G.estados_casos,item.estado)
        });
      }
      // Convertir JSON a hoja de cálculo
      const hoja = XLSX.utils.json_to_sheet(datos);
  
      // Crear libro y añadir la hoja
      const libro: XLSX.WorkBook = {
        Sheets: { 'Casos': hoja },
        SheetNames: ['Casos']
      };
  
      // Generar el archivo en memoria
      const excelBuffer: any = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });
  
      // Guardar el archivo usando file-saver
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      FileSaver.saveAs(blob, 'casos.xlsx');
    }
  }
}
