import { Component, Output, EventEmitter, OnInit,Input } from '@angular/core';
import { NgIf,NgFor } from '@angular/common';
import { Globals,IdNombre,Permiso,Persona} from '../globales';
import { FuncionesService } from '../funciones.service';

type Estado = 'Pendiente' | 'Actualizando...' | 'FINALIZADO';


class ItemActualizacion {
  id=0;
  nombre='';
  estado: Estado;
  constructor(dato:any) {
    this.id=dato.id;
    this.nombre=dato.nombre;
    this.estado=dato.estado;
  }
}


@Component({
  selector: 'app-actualizar-sistema',
  templateUrl: './actualizar-sistema.component.html',
  styleUrls: ['../app.component.scss','../app.estilosgenerales.scss','../bootstrap.css','actualizar-sistema.component.scss'],
  imports: [NgIf,NgFor] 
})
export class ActualizarSistemaComponent implements OnInit {
  @Input() parametro_actualizar: number;
  @Output() actualizo = new EventEmitter<any>();
  @Output() rearmar_menu = new EventEmitter<any>();
  modo=0;
  actualizaciones: ItemActualizacion[] = [];
  i=0;
  tiempo_retardo=0;

  G: Globals;
  constructor(variables: Globals
    , public Funcion: FuncionesService
    ) {
    this.G=variables;
  }

  ngOnInit() {}
  ngAfterViewInit() {
    this.Funcion.detenerRelojActualizador();
    this.f_inicializar();
  }
  get progresoCompletado(): number {
    return this.actualizaciones.filter(a => a.estado === 'FINALIZADO').length;
  }


  get porcentajeProgreso(): number {
    const total = this.actualizaciones.length || 1;
    return Math.round((this.progresoCompletado / total) * 100);
  }


  get estaCorriendo(): boolean {
    return this.actualizaciones.some(a => a.estado === 'Actualizando...') || this.modo === 0;
  }


  get textoPie(): string {
    if (this.progresoCompletado === this.actualizaciones.length && this.actualizaciones.length > 0) return '¡Listo! Todo actualizado.';
    return '';
  }

  trackByNombre = (_: number, it: ItemActualizacion) => it.nombre;


  // Acciones (ajústalas a tu flujo real)
  onCerrar() { /* emitir evento o setear bandera para ocultar */ }

  async f_inicializar() {
    this.G.Actualizador.Controlando=true;
    this.modo=0;
    this.actualizaciones=[];
    this.G.parametros_acceso.verificar_actualizacion=false;
    let respuesta_post=await this.Funcion.f_http_post('','actualizar_sistema.php','inicial',{});
    if (!respuesta_post.con_error) {
      let data=respuesta_post.data;
      for (let act of data['actualizaciones']) {
        this.actualizaciones.push(new ItemActualizacion(act));
      }
      this.G.parametros_acceso.ActualizarVersion('parametros_empresa',data['version_parametros_empresa']);
      this.G.parametros_acceso.ActualizarVersion('permisos',data['version_permisos']);
      this.i=0;
      this.modo=1;
      if (this.actualizaciones.length>0){
        setTimeout (() => this.proxima(), this.tiempo_retardo);
      }else{
        this.finalizar();
      }
    }
  }
  finalizar() {
    this.G.Actualizador.Controlando=false;
    this.G.parametros_acceso.verificar_actualizacion=true;
    if (this.G.login_usuario===1 || !this.G.ModoProduccion) console.log(this.G);
    this.G.Actualizador.TiempoUltimaConsulta=this.Funcion.f_tiempo_transcurrido();
    this.Funcion.Mensaje('SISTEMA ACTUALIZADO',0,true,1500);
    this.actualizo.emit();
    setTimeout (() => this.G.ACTUALIZAR_SISTEMA=false, 40);
    this.Funcion.iniciarRelojActualizador();
  }
  async proxima() {
    if (this.i+1>this.actualizaciones.length) {
      setTimeout (() => this.finalizar(), this.tiempo_retardo);
    } else {
      this.actualizaciones[this.i].estado='Actualizando...';
      if (this.actualizaciones[this.i].id===1) {
        let respuesta_post=await this.Funcion.f_http_post('','actualizar_sistema.php','opciones',{},false,false);
        if (!respuesta_post.con_error) {
          let data=respuesta_post.data;
          for (let opc of data['opciones']) {
            for(let opcion of this.G.menu_opciones){
              if (opcion.opcion_id===opc.id && opcion.version<opc.version) {
                opcion.version=opc.version
                const m=this.Funcion.buscar_por_id(this.G.menu_item,opcion.opcion_id,'opcion_id');
                if (m!==null) {
                  m.abierto=false;
                  if (this.G.menu_item_seleccionado===opcion.opcion_id) {
                    this.G.menu_item_seleccionado='';
                    this.G.menu_activo_titulo='Konsulti';
                  }
                }
              }
            }
          }
          this.actualizaciones[this.i].estado='FINALIZADO';
          this.G.parametros_acceso.appVersion_comprobada=data['ultima'];
          this.i++;
          setTimeout (() => this.proxima(), this.tiempo_retardo);
        }
      }else if (this.actualizaciones[this.i].id===6) {
        let respuesta_post=await this.Funcion.f_http_post('','actualizar_sistema.php','permisos',{},false,false);
        if (!respuesta_post.con_error) {
          let data=respuesta_post.data;
          let permiso:Permiso;
          for (permiso of this.G.permisos) {
            let permitido=false;
            for (let a=0;a<data['permitidos'].length;a++) {
              if (data['permitidos'][a]===permiso.permiso) permitido=true;
            }
            permiso.permitido=permitido;
          }
          this.actualizaciones[this.i].estado='FINALIZADO';
          this.i++;
          setTimeout (() => this.proxima(), this.tiempo_retardo);
        }
      }else if (this.actualizaciones[this.i].id>=2 || this.actualizaciones[this.i].id<=8) {
        let respuesta_post=await this.Funcion.f_http_post('','actualizar_sistema.php','traer',{quecosa:this.actualizaciones[this.i].id,personas_ultima_version:this.G.parametros_acceso.VersionActual('personas')},false,false);
        if (!respuesta_post.con_error) {
          let data=respuesta_post.data;
          if (this.actualizaciones[this.i].id===2) {
            for (let p of data['personas']) {
              if (p.actualizacion_version>this.G.parametros_acceso.VersionActual('personas')) this.G.parametros_acceso.ActualizarVersion('personas',p.actualizacion_version);
                p.doc_tipo_txt=this.Funcion.f_traer_dato_tabla_texto(this.G.tipos_documentos,p.doc_tipo);
                let estaba=false;
                for (let a=0;a<this.G.personas.length;a++) {
                  if (this.G.personas[a].id===p.id) {
                    estaba=true;
                    this.G.personas[a]=new Persona(p);
                    break;
                  }
                }
                if (!estaba) this.G.personas.push(new Persona(p));
              }
            this.Funcion.f_ordenar(this.G.personas,'nombre');
          }
          if (this.actualizaciones[this.i].id===3) {
          }
          if (this.actualizaciones[this.i].id===4) {
          }
          if (this.actualizaciones[this.i].id===4.1) {
          }
          if (this.actualizaciones[this.i].id===4.2) {
            this.G.estados_casos=[];
            for (let d of data['estados_casos']) {
              this.G.estados_casos.push(new IdNombre(d.id,d.nombre));
            }
            this.Funcion.f_ordenar(this.G.estados_casos,'nombre');
            this.G.areas=[];
            for (let d of data['areas']) {
              this.G.areas.push(new IdNombre(d.id,d.nombre));
            }
            this.Funcion.f_ordenar(this.G.areas,'nombre');
          }
          if (this.actualizaciones[this.i].id===7) {
          }
          this.actualizaciones[this.i].estado='FINALIZADO';
          this.i++;
          setTimeout (() => this.proxima(), this.tiempo_retardo);
        }
      }else{
        this.actualizaciones[this.i].estado='FINALIZADO';
        this.i++;
        setTimeout (() => this.proxima(), this.tiempo_retardo);
      }
    }
  }
}
