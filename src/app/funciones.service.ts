import { Injectable, EventEmitter, ComponentRef, Type, ViewContainerRef,EnvironmentInjector} from '@angular/core';
import { Globals,Permiso, FHttpPostRespuesta, Mensaje, Paginar, FConfirmar } from './globales';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FConfirmarComponent } from './componentes/fconfirmar/fconfirmar.component';

@Injectable({
  providedIn: 'root'
})
export class FuncionesService {

  Confirmar$=new EventEmitter<any>();
  Confirmador$=new EventEmitter<any>();
  Confirmador2$=new EventEmitter<any>();

  G: Globals;
  constructor(
    private http: HttpClient
    ,variables: Globals, private envInjector: EnvironmentInjector
    ) {
    this.G=variables;
  }

  async reiniciarComponente<T>(
    contenedor: ViewContainerRef,
    componenteRef: ComponentRef<T> | null,
    componenteType: Type<T>
  ): Promise<ComponentRef<T>> {
    // Destruir si existe
    if (componenteRef) {
      componenteRef.destroy();
    }

    // Limpiar contenedor
    contenedor.clear();
    // Crear y retornar la nueva instancia
    return contenedor.createComponent(componenteType);
  }

  ConfirmarComponente(config: FConfirmar,viewContainerRef: ViewContainerRef): Promise<any> {
    return new Promise((resolve) => {
      if (!viewContainerRef) {
        throw new Error('ViewContainerRef no configurado. Llamá a setViewContainerRef() desde tu componente principal.');
      }

      const componentRef = viewContainerRef.createComponent(FConfirmarComponent, {
        environmentInjector: this.envInjector
      });
      componentRef.instance.datos = config;
      const sub = componentRef.instance.cerrar.subscribe((valor: any) => {
        resolve(valor);
        sub.unsubscribe();
        componentRef.destroy();
      });
    });
  }

  async f_http_post(estemenu:string, pagina_php: string, accion:string, parametros: any,con_loading=true,saca_loading=true,ejecutar_error=true,texto_esperando=''): Promise<FHttpPostRespuesta> {
    if (parametros instanceof FormData) {
      parametros.append('accion', accion);
      parametros.append('parametros_acceso', JSON.stringify(this.G.parametros_acceso));
    } else {
      parametros.accion = accion;
      parametros.parametros_acceso = this.G.parametros_acceso;
    }
    this.detenerRelojActualizador()
    return new Promise((resolve) => {
      if (con_loading) {
        if (estemenu==='') {
          this.f_procesando_general_activar();
        } else {
          this.show_loading(1,estemenu,texto_esperando);
        }
      }
      this.http.post<any>(this.G.URL+pagina_php, parametros).subscribe({
      next: data => {
        if (saca_loading) {
          if (estemenu==='') {
            this.f_procesando_general_desactivar();
          } else {
            this.show_loading(0,estemenu);
          }
        }
        if (data.sql_error!==undefined && data.sql_error!==null && data.sql_error) {
          let vtitulo='Error de sistema menu '+estemenu+', archivo: '+pagina_php+' se envió reporte al servicio técnico.';
          let valerta='Error de sistema ('+estemenu+')';
          this.Alerta(valerta,1);
          let error_archivo=pagina_php;
          if (accion!=='') error_archivo+=' - Accion: '+accion;
          let verrores_txt='Error en instrucciones sql<br><br>';
          for (let sql of data.sql_error_listado) {
            verrores_txt+=sql+'<br><br>';
          }
          this.http.post(this.G.URL+'consultas_varias.php', {
            accion:'enviar_mail_reporte_error',
            titulo:vtitulo,
            menu:estemenu,
            error_archivo:error_archivo,
            error_texto:verrores_txt,
            error_status:'',
            error_nombre:'',
            error_mensaje:'',
            parametros_acceso: this.G.parametros_acceso } ).subscribe(
          );
          resolve(new FHttpPostRespuesta(null,true,verrores_txt));
        } else {
          if (this.f_not_in(pagina_php,['_variables_iniciales.php'])) {
            this.f_retorno_de_php(data['valores_retorno']);
          }
          if (pagina_php!=='_verificar_actualizaciones.php') {
            this.G.ultimaActividad = Date.now();
          }
          resolve(new FHttpPostRespuesta(data));
        }
      },
      error: error => {
        if (ejecutar_error) {
          let vtitulo='Error de sistema menu '+estemenu+', archivo: '+pagina_php;
          //if (this.G.ModoProduccion!==1 || this.G.login_usuario===1) {
          if (this.G.ModoProduccion!==1) {
            this.Alerta(vtitulo,1);
            console.log(pagina_php);
            console.log(error.error.text);
            console.log(error);
          } else {
            if (this.G.login_usuario===1) {
              console.log(vtitulo);
              console.log(pagina_php);
              console.log(error.error.text);
              console.log(error);
            }
            if (error.error.text.trim().substring(0,17)==='Error de Conexión') {
              this.Alerta('Error de Conexión, verifique su servicio de internet.',1);
            } else {
              let valerta='Error de sistema ('+estemenu+')';
              vtitulo+=' se envió reporte al servicio técnico.';
              this.Alerta(valerta,1);
              let error_archivo=pagina_php;
              if (accion!=='') error_archivo+=' - Accion: '+accion;
              this.http.post(this.G.URL+'consultas_varias.php', {
                accion:'enviar_mail_reporte_error',
                titulo:vtitulo,
                menu:estemenu,
                error_archivo:error_archivo,
                error_texto:error.error.text,
                error_status:error.status,
                error_nombre:error.name,
                error_mensaje:error.message,
                parametros_acceso: this.G.parametros_acceso } ).subscribe(
                );
            }
          }
        }
        this.iniciarRelojActualizador();
        if (saca_loading) this.show_loading(0,estemenu);
        resolve(new FHttpPostRespuesta(null,true,error));
      }
      });
    });
  }
  private actualizadorInterval: any = null;
  private actualizadorEnProceso = false;
  iniciarRelojActualizador(segundos=10) {
    if (this.actualizadorInterval) return; // Evita duplicados
    this.actualizadorInterval = setInterval(() => this.verificarActualizacionAutomatica(), segundos*1000);
  }
  detenerRelojActualizador() {
    if (this.actualizadorInterval) {
      clearInterval(this.actualizadorInterval);
      this.actualizadorInterval = null;
    }
  }
  private async verificarActualizacionAutomatica() {
    if (this.actualizadorEnProceso) return;
    this.actualizadorEnProceso = true;
    try {
      await this.f_http_post('','_verificar_actualizaciones.php','',{},false,false,false);
    } catch (e) {
      console.warn('Error en verificación automática:', e);
    } finally {
      this.actualizadorEnProceso = false;
    }
  }
  async Afip_padron(estemenu:string,pcuit:number,tipo_documento:number) {
    return new Promise((resolve) => {
      this.show_loading(1,estemenu,'Consultando con ARCA');
      this.http.post<any>(this.G.servicio_consulta_padron, {
      cuit_cliente: pcuit,
      tipo_documento:tipo_documento,
      cuit:this.G.ConsultaPadronAfip.empresa_cuit,
      certificado:this.G.ConsultaPadronAfip.certificado,
      clave:this.G.ConsultaPadronAfip.clave}).subscribe({
      next: data => {
        this.show_loading(0,estemenu);
        resolve(new FHttpPostRespuesta(data));
      },
      error: error => {
        this.show_loading(0,estemenu);
        this.Alerta('Error en la consulta con ARCA, pruebe más tarde o cargue los datos manualmente');
        resolve(new FHttpPostRespuesta(null));
      }
      });
    });
  }
  f_retorno_de_php(valores:any): void {
    this.G.Actualizador.TiempoUltimaConsulta=this.f_tiempo_transcurrido();
    this.G.SesionesActivas=valores.sesiones_activas;

    if (!this.G.Actualizador.Controlando) this.G.ACTUALIZAR_SISTEMA=(valores.actualizar_parametros>0);

    if (valores.sesion_expirada) {
      this.G.SISTEMA_ERROR=1;
    } else if (valores.en_mantenimiento) {
      this.G.SISTEMA_ERROR=3;
    } else if (valores.actualizar_parametros>0) {
      this.G.ACTUALIZAR_SISTEMA=true;
    }
    if (!this.G.ACTUALIZAR_SISTEMA) this.iniciarRelojActualizador();
  }

  Mensaje(texto='',tipo=1,temporal=false,duracion_ms=3000) {
    let id=this.G.mensaje_id;
    this.G.mensajes.push(new Mensaje(id,texto,tipo,temporal,duracion_ms));
    if (temporal) {
      setTimeout(() => {
        this.MensajeBorrar(id);
      }, duracion_ms);
    }
    this.G.mensaje_id++;
  }
  MensajeBorrar(id:any) {
    this.eliminar_array_id(this.G.mensajes,id);
  }
  Alerta(mensaje='',tipo=0) {
    this.G.alerta_ver=true;
    this.G.alerta_texto=mensaje;
    this.G.alerta_tipo=tipo;
  }
  Confirmador(datos:any) {
    this.G.confirmador_datos=datos;
    this.G.confirmador_ver=true;
  }
  Confirmar(mensaje='',tipo?: number,opciones?: any,subtipo?: any, inicial?: any, dato_extra?: any) {
    if (tipo===null || tipo===undefined) { tipo=1; }
    if (subtipo===null || subtipo===undefined) {
      if (this.f_in(tipo,[5,5.1])) {
        subtipo='nombre';
      } else {
        subtipo=0;
      }
    }
    this.G.confirmar_tipo=tipo;
    this.G.confirmar_subtipo=subtipo;
    this.G.confirmar_mensaje=mensaje;
    this.G.confirmar_inicial=inicial;
    if (tipo===1) {
      this.G.confirmar_opciones=[{valor:1,mensaje:'Aceptar',tipo:1},{valor:0,mensaje:'Cancelar',tipo:2}];
    } else if (tipo===2) {
      this.G.confirmar_opciones=[{valor:1,mensaje:'ELIMINAR',tipo:2},{valor:2,mensaje:'ANULAR',tipo:2},{valor:0,mensaje:'Regresar',tipo:1}];
    } else if (tipo===3) {
      this.G.confirmar_datos=opciones;
      this.G.confirmar_opciones=[{valor:1,mensaje:'ACEPTAR',tipo:1}];
    } else if (tipo===3.1 || tipo===3.2 || tipo===4 || tipo===4.1 || tipo===4.2 || tipo===4.3 || tipo===4.4) {
      this.G.confirmar_numero=opciones;
      this.G.confirmar_numero2=subtipo;
      this.G.confirmar_opciones=[{valor:1,mensaje:'ACEPTAR',tipo:1},{valor:0,mensaje:'CANCELAR',tipo:2}];
    } else if (tipo===5) {
      this.G.confirmar_datos=opciones;
      this.G.confirmar_opciones=[{valor:1,mensaje:'ACEPTAR',tipo:1},{valor:0,mensaje:'CANCELAR',tipo:2}];
    } else if (tipo===5.1) {
      this.G.confirmar_datos=opciones;
      this.G.confirmar_opciones=[{valor:1,mensaje:'ACEPTAR',tipo:1},{valor:0,mensaje:'CANCELAR',tipo:2}];
    } else if (tipo===6) {
      this.G.confirmar_datos=opciones;
      if (subtipo===1) {
        this.G.confirmar_opciones=[{valor:1,mensaje:'ACEPTAR',tipo:1},{valor:0,mensaje:'CANCELAR',tipo:2}];
      } else if (subtipo===2) {
        this.G.confirmar_opciones=dato_extra;
      } else {
        this.G.confirmar_opciones=[{valor:1,mensaje:'ACEPTAR',tipo:1}];
      }
    } else if (tipo===0) {
      this.G.confirmar_opciones=opciones;
    }
    this.G.confirmar_ver=true;
  }
  show_loading(modo: number,menu:string,titulo='') {
    setTimeout (() => this.show_loading_cambia (modo,menu,titulo), 0);
  }
  show_loading_cambia(modo: number,menu:string,titulo='') {
    if (modo===0) {
      this.G.div_esperando_local[menu]=false;
    } else {
      this.G.div_esperando_local[menu]=true;
      this.G.div_esperando_local_texto[menu]=titulo;
    }
  }
  f_procesando_general_activar(titulo='') {
    this.G.div_procesando_general_texto=titulo;
    this.G.div_procesando_general=true;
  }

  f_procesando_general_desactivar() { this.G.div_procesando_general=false; }
  
  buscar_por_id(varray: any,valor: any,campo_id_nombre='id',o_devolver_el_primero=false,devolver_nombre=false) {
    let encontro=false;
    let ret=null;
    for (let item of varray) {
      if (item[campo_id_nombre]===valor) {
        ret=item;
        encontro=true;
        break;
      }
    }
    if (devolver_nombre) {
      if (!encontro || ret['nombre']===undefined || ret['nombre']===null) {
        return '';
      } else {
        return ret['nombre'];
      }
    } else if (!encontro && o_devolver_el_primero) {
      return varray[0];
    } else {
      return ret;
    }
  }
  permitido(un_permiso:string) {
    let permiso:Permiso;
    for (permiso of this.G.permisos) {
      if (permiso.permiso===un_permiso && permiso.permitido) {
        return true;
      }
    }
    return false;
  }
  permitido_alguno(listado:any[]) {
    let permiso:Permiso;
    for (permiso of this.G.permisos) {
      for (let p of listado) {
        if (permiso.permiso===p && permiso.permitido) {
          return true;
        }
      }
    }
    return false;
  }
  cerrar_menu(id: any) {
    const m=this.buscar_por_id(this.G.menu_item,id,'opcion_id');
    if (m!==null) {
      m.abierto=false;
    }
    this.G.menu_item_seleccionado='';
    this.G.menu_activo_titulo='Konsulti';
    if (this.G.menu_item_seleccionado_anterior!=='') {
      const m=this.buscar_por_id(this.G.menu_item,id,this.G.menu_item_seleccionado_anterior);
      if (m!==null && m.abierto) {
        this.G.menu_item_seleccionado_anterior='';
        this.G.menu_item_seleccionado=m.opcion_id;
        this.G.menu_activo_titulo=m.nombre;
      }
    }
    if (this.G.menu_item_seleccionado=='') {
      for (let a=0;a<this.G.menu_item.length;a++) {
        if (this.G.menu_item[a].abierto) {
          this.G.menu_item_seleccionado_anterior='';
          this.G.menu_item_seleccionado=this.G.menu_item[a].opcion_id;
          this.G.menu_activo_titulo=this.G.menu_item[a].nombre;
          break;
        }
      }
    }
  }
  eliminar_array_id(varray:any,valor:any,campo='id') {
    let a: any;
    for (a=0;a<varray.length;a++) {
      if (varray[a][campo]===valor) {
        varray.splice(a,1);
      }
    }
    return varray;
  }
  eliminar_array_item(varray:any,valor:any) {
    for (let a=0;a<varray.length;a++) {
      if (varray[a]===valor) {
        varray.splice(a,1);
        break;
      }
    }
    return varray;
  }
  es_numero(pnumero:any,minimo:any=null,maximo:any=null) {
    if (isNaN(pnumero)) {
      return false;
    } else if (pnumero===null || pnumero===undefined) {
      return false;
    } else {
      let retorna=true;
      if (minimo!==null && pnumero<minimo) {
        retorna=false;
      } else if (maximo!==null && pnumero>maximo) {
        retorna=false;
      }
      return retorna;
    }
  }
  fecha_ahora() {
    const f=new Date();
    const f2:string=new DatePipe('en-Us').transform(f, 'yyyy-MM-dd HH:mm:ss',this.G.uso_horario) ?? '';
    return this.mysqldatetime_a_formatofecha(f2.toString());
  }
  fecha_hoy() {
    const f=new Date();
    const f2:string=new DatePipe('en-Us').transform(f, 'yyyy-MM-dd',this.G.uso_horario) ?? '';
    return this.mysql_a_formatofecha(f2);
  }
  dia_hoy() {
    const f=this.fecha_hoy();
    return f.getDate();
  }
  mes_hoy() {
    const f=this.fecha_hoy();
    return f.getMonth()+1;
  }
  anio_hoy() {
    const f=this.fecha_hoy();
    return f.getFullYear();
  }
  fecha_a_mysql(f:Date,con_guiones=true,con_horario=false) {
    let ret='';
    let vm: any; let vd: any;  let vy,vhora,vmin,vseg: any;  vy=f.getFullYear();	if ((f.getMonth() +1)<10) {	vm='0'+(f.getMonth() +1);	} else {	vm=(f.getMonth() +1);	}	if (f.getDate()<10) {	vd='0'+f.getDate();	} else { vd=f.getDate();	}
    if (f.getHours()<10) { vhora='0'+f.getHours().toString();} else {vhora=f.getHours().toString(); }
    if (f.getMinutes()<10) { vmin='0'+f.getMinutes().toString();} else {vmin=f.getMinutes().toString(); }
    if (f.getSeconds()<10) { vseg='0'+f.getSeconds().toString();} else {vseg=f.getSeconds().toString(); }
    if (con_guiones) {
      ret=vy+'-'+vm+'-'+vd;
      if (con_horario) { ret+=' '+vhora+':'+vmin+':'+vseg;}
    } else {
      ret=vy+vm+vd;
      if (con_horario) { ret+=' '+vhora+vmin+vseg;}
    }
    return ret;
  }
  mysql_fecha_dias_hasta_hoy(fecha:string='') {
    return this.fecha_diferencia_dias(this.fecha_hoy(),this.mysql_a_formatofecha(fecha));
  }
  fecha_dias_hasta_hoy(fecha=new Date()) {
    return this.fecha_diferencia_dias(this.fecha_hoy(),fecha);
  }
  fecha_diferencia_dias(fecha_menor:Date,parametrofecha2: Date | null = null) {
    if (parametrofecha2===null) parametrofecha2=this.fecha_hoy();
    fecha_menor=this.mysql_a_formatofecha(this.fecha_a_mysql(fecha_menor));
    let fecha2=this.mysql_a_formatofecha(this.fecha_a_mysql(parametrofecha2));
    let dias=0;
    if (fecha_menor>fecha2) {
      while(fecha_menor>fecha2){
        dias++;
        fecha_menor=this.fecha_dia_anterior(fecha_menor);
      }
    } else if (fecha2>fecha_menor) {
      while(fecha2>fecha_menor){
        dias--;
        fecha2=this.fecha_dia_anterior(fecha2);
      }
    }
    return dias;
  }
  fecha_a_txt(f:Date) { let vm: any; let vd: any;  let vy: any; vy=f.getFullYear();	if ((f.getMonth() +1)<10) {	vm='0'+(f.getMonth() +1);	} else {	vm=(f.getMonth() +1);	}	if (f.getDate()<10) {	vd='0'+f.getDate();	} else { vd=f.getDate();	}	return vd+'/'+vm+'/'+vy;}
  fecha_desplazada_mysql(f:string,dias:number,habiles=false) {
    return this.fecha_a_mysql(this.fecha_desplazada(this.mysql_a_formatofecha(f),dias,0,0,0,habiles));
  }
  fecha_desplazada(f:Date,dias:number,horas=0,minutos=0,segundos=0,habiles=false) {
    const vf=this.fecha_a_mysql(f,true,true);
    const vdia=parseInt(vf.substring(8,10),10);
    let vmes=parseInt(vf.substring(5,7),10);
    let vanio=parseInt(vf.substring(0,4),10);
    let vhoras=parseInt(vf.substring(11,13),10);
    let vminutos=parseInt(vf.substring(14,16),10);
    let vsegundos=parseInt(vf.substring(17,19),10);
    segundos=parseInt(segundos.toString(),10); if (segundos>59) { segundos=59;} else if (segundos<-59) { segundos=-59;}
    minutos=parseInt(minutos.toString(),10); if (minutos>59) { minutos=59;} else if (minutos<-59) { minutos=-59;}
    horas=parseInt(horas.toString(),10); if (horas>23) { horas=23;} else if (horas<-23) { horas=-23;}
    if (segundos>0) {
      if (vsegundos+segundos>59) {
        minutos++;
        vsegundos=vsegundos+segundos-60;
      } else {
        vsegundos=vsegundos+segundos;
      }
    } else if (segundos<0) {
      if (vsegundos-segundos<0) {
        minutos--;
        vsegundos=vsegundos-segundos+60;
      } else {
        vsegundos=vsegundos-segundos;
      }
    }
    if (minutos>0) {
      if (vminutos+minutos>59) {
        horas++;
        vminutos=vminutos+minutos-60;
      } else {
        vminutos=vminutos+minutos;
      }
    } else if (minutos<0) {
      if (vminutos-minutos<0) {
        horas--;
        vminutos=vminutos-minutos+60;
      } else {
        vminutos=vminutos-minutos;
      }
    }
    if (horas>0) {
      if (vhoras+horas>23) {
        dias++;
        vhoras=vhoras+horas-24;
      } else {
        vhoras=vhoras+horas;
      }
    } else if (horas<0) {
      if (vhoras-horas<0) {
        dias--;
        vhoras=vhoras-horas+24;
      } else {
        vhoras=vhoras-horas;
      }
    }
    let f1=new Date(vanio,vmes-1,vdia,vhoras,vminutos,vsegundos);
    if (dias>0) {
      while(dias>0) {
        f1=this.fecha_dia_posterior(f1,habiles);
        dias--;
      }
    } else {
      while (dias<0) {
        f1=this.fecha_dia_anterior(f1,habiles);
        dias++;
      }
    }
    return f1;
  }
  fecha_dia_anterior(f: Date, habiles = false): Date {
    const vf = this.fecha_a_mysql(f, true, true);
    let vhora = parseInt(vf.substring(11, 13), 10);
    let vminutos = parseInt(vf.substring(14, 16), 10);
    let vsegundos = parseInt(vf.substring(17, 19), 10);
    let vdia = parseInt(vf.substring(8, 10), 10);
    let vmes = parseInt(vf.substring(5, 7), 10);
    let vanio = parseInt(vf.substring(0, 4), 10);
  
    let respuesta = new Date(vanio, vmes - 1, vdia, vhora, vminutos, vsegundos);
  
    // Retroceder un día
    respuesta.setDate(respuesta.getDate() - 1);
  
    // Si se requiere un día hábil, saltar sábados y domingos
    if (habiles) {
      while (respuesta.getDay() === 0 || respuesta.getDay() === 6) {
        respuesta.setDate(respuesta.getDate() - 1);
      }
    }
  
    return respuesta;
  }
  
  fecha_dia_posterior(f: Date, habiles = false): Date {
    const vf = this.fecha_a_mysql(f, true, true);
    let vhora = parseInt(vf.substring(11, 13), 10);
    let vminutos = parseInt(vf.substring(14, 16), 10);
    let vsegundos = parseInt(vf.substring(17, 19), 10);
  
    let respuesta = new Date(f.getFullYear(), f.getMonth(), f.getDate(), vhora, vminutos, vsegundos);
  
    // Avanzar un día
    respuesta.setDate(respuesta.getDate() + 1);
  
    // Si se requiere un día hábil, saltar sábados y domingos
    if (habiles) {
      while (respuesta.getDay() === 0 || respuesta.getDay() === 6) {
        respuesta.setDate(respuesta.getDate() + 1);
      }
    }
  
    return respuesta;
  }
  fecha_mysql_ultimo_dia_periodo(p:number) {
    let fecha=new Date(parseFloat(p.toString().substring(0,4)),parseFloat(p.toString().substring(4,6)),0);
    return this.fecha_a_mysql(fecha);
  }
  fecha_ultimo_dia(mes:number,anio:number,hora=0,minutos=0,segundos=0) {
    return new Date(anio, mes, 0, hora, minutos, segundos);
  }
  formatNumberTxt(num:any,cantidad_decimales=2,separador_decimal=',',separador_miles='.') {
    return this.formatNumber(parseFloat(num),cantidad_decimales,false,true,separador_decimal,separador_miles);
  }
  formatNumber(num:any,cantidad_decimales=2,versolovaloresdistintosdecero=false,mostrar_decimales_en_cero=true,separador_decimal=',',separador_miles='.') {
    if (versolovaloresdistintosdecero && this.redondear(num,cantidad_decimales)===0) {
      return '';
    }
    let splitLeft: any;
    let splitRight: any;
    if (num===null || num===undefined || !this.es_numero(num) || num===0) {
      splitLeft='0';
      splitRight='';
    } else {
      if (!mostrar_decimales_en_cero) {
        if (this.redondear(num,cantidad_decimales)===this.redondear(num,0)) {
          cantidad_decimales=0;
        }
      }
      num=this.redondear(num,cantidad_decimales);
      num +='';
      const splitStr = num.split('.');
      splitLeft = splitStr[0];
      splitRight = splitStr.length > 1 ? separador_decimal + splitStr[1] : '';
      const regx = /(\d+)(\d{3})/;
      if (separador_miles!=='') {
        while (regx.test(splitLeft)) {
          splitLeft = splitLeft.replace(regx, '$1' + separador_miles + '$2');
        }
      }
    }
    if (splitRight==='' && cantidad_decimales>0) {
      splitRight=separador_decimal;
      for (let a=0;a<cantidad_decimales;a++) {
        splitRight=splitRight+'0';
      }
    } else if (cantidad_decimales>0) {
      for (let a=splitRight.length;a<=cantidad_decimales;a++) {
        splitRight=splitRight+'0';
      }
    }
    return splitLeft +splitRight;
  }
  formatoNumerico(numero:number,valorespositivos_1_distintosdecero_menosuno_todos_cero=0,decimales=2) {
    let ret='';
    if (valorespositivos_1_distintosdecero_menosuno_todos_cero===0 || (valorespositivos_1_distintosdecero_menosuno_todos_cero===1 && numero>0) || (valorespositivos_1_distintosdecero_menosuno_todos_cero===-1 && numero!=0)) ret=this.formatNumber(numero,decimales);
    return ret;
  }
  mysql_a_formatofecha(vfecha:string) {
    return new Date(parseFloat(vfecha.substr(0,4)),parseFloat(vfecha.substr(5,2))-1,parseFloat(vfecha.substr(8,2)));
  }
  mysqldatetime_a_formatofecha(vfecha:string) {
    return new Date(parseFloat(vfecha.substr(0,4)),parseFloat(vfecha.substr(5,2))-1,parseFloat(vfecha.substr(8,2)),parseFloat(vfecha.substr(11,2)),parseFloat(vfecha.substr(14,2)),parseFloat(vfecha.substr(17,2)));
  }
  mysql_a_php(vfecha:string) {
    return vfecha.substr(8,2)+'/'+vfecha.substr(5,2)+'/'+vfecha.substr(0,4);
  }
  mysqldatetime_a_php(vfecha:string,con_segundos=false) {
    if (!con_segundos) {
      //hora y minutos
      return vfecha.substr(8,2)+'/'+vfecha.substr(5,2)+'/'+vfecha.substr(0,4)+' '+vfecha.substr(11,5);
    } else{
      //hora, minutos y segundos
      return vfecha.substr(8,2)+'/'+vfecha.substr(5,2)+'/'+vfecha.substr(0,4)+' '+vfecha.substr(11,8);
    }
  }
  f_fecha_mes_anterior(primer_dia=false) {
    let desde_fecha=new Date();
    let hasta_fecha=new Date();
    let f=new Date();
    let mes_mio=f.getMonth()+1;
    let mes=f.getMonth();
    let anio=f.getFullYear();
    if (mes===0) {
      anio--;
      mes=11;
      mes_mio=12;
    } else {
      mes--;
      mes_mio--;
    }
    if (mes_mio===1 || mes_mio===3 || mes_mio===5 || mes_mio===7 || mes_mio===8 || mes_mio===10 || mes_mio===12) {
      hasta_fecha=new Date(anio,mes,31);
    } else if (mes_mio===4 || mes_mio===6 || mes_mio===9 || mes_mio===11) {
      hasta_fecha=new Date(anio,mes,30);
    } else if (anio/4===this.redondear(anio/4,0)) {
      if (anio/100===this.redondear(anio/100,0)) {
        hasta_fecha=new Date(anio,mes,28);
      } else {
        hasta_fecha=new Date(anio,mes,29);
      }
    } else {
      hasta_fecha=new Date(anio,mes,28);
    }
    desde_fecha=new Date(anio,mes,1);
    if (primer_dia) {
      return desde_fecha;
    } else {
      return hasta_fecha;
    }
  }

  f_fecha_futura(vfecha:Date) {
    return (this.fecha_a_mysql(vfecha)>this.fecha_a_mysql(this.fecha_hoy()));
  }
  f_rellenar_caracteres(texto='',cantidad=1,caracter=' ',adelante=true) {
    if (texto===null || texto===undefined) { texto=''; }
    while(texto.length<cantidad) {
      if (adelante){
        texto=caracter+texto;
      }else{
        texto=texto+caracter;
      }
    }
    return texto;
  }
  f_sincomillas_ni_acentos(texto:string){
    let r='';
    for (let a=0;a<texto.length;a++) {
      let l=texto.substring(a,a+1);
      if (l==='"' || l==="'") { l=' '; }
      if (l==='á') { l="a"; }
      if (l==='é') { l="e"; }
      if (l==='í') { l="i"; }
      if (l==='ó') { l="o"; }
      if (l==='ú') { l="u"; }
      if (l==='Á') { l="A"; }
      if (l==='É') { l="E"; }
      if (l==='Í') { l="I"; }
      if (l==='Ó') { l="O"; }
      if (l==='Ú') { l="U"; }
      if (l==='Ñ') { l="N"; }
      if (l==='ñ') { l="n"; }
      r=r+l;
    }
    return r;
  }
  f_solo_numerosyletras(parametro_texto:string) {
    let r='';
    let texto=this.f_sincomillas_ni_acentos(parametro_texto).toUpperCase();
    for (let a=0;a<texto.length;a++) {
      let l=texto.substring(a,a+1);
      if (this.f_in(l,['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9'])) r=r+l;
    }
    return r;
  }
  f_convertir_evitar_redondeo(importe:number){
    return this.redondear(importe*100,0).toString();
  }
  numero_a_verdadero(vnumero:number) { return (vnumero>0); }
  verdadero_a_numero(vestado: boolean) { if (vestado) { return 1;} else { return 0; }}
  php_a_fecha(vfecha:string) { return this.mysql_a_formatofecha(this.php_a_mysql(vfecha)); }
  phpdatetime_a_formatofecha(vfecha:string) {
    return new Date(parseFloat(vfecha.substr(6,4)),parseFloat(vfecha.substr(3,2))-1,parseFloat(vfecha.substr(0,2)),parseFloat(vfecha.substr(11,2)),parseFloat(vfecha.substr(14,2)),parseFloat(vfecha.substr(17,2)));
  }

  php_a_mysql(vfecha:string) {
    return vfecha.substr(6,4)+'-'+vfecha.substr(3,2)+'-'+vfecha.substr(0,2);
  }
  redondear(valor:number,decimales=2) { const multiplicar=1*Math.pow(10,decimales); return Math.round(valor*multiplicar)/multiplicar;}
  separar_campos_csv_por_coma(linea:any) {
    const r = [];
    let i = 0;
    let comilla=false;
    let a: number;
    let datos = '';
    for (a=0;a<linea.length;a++) {
      const caracter=linea.substring(a,a+1);
      if (caracter==='"') {
        if (comilla) {
          comilla=false;
        } else {
          comilla=true;
        }
      } else {
        if (caracter===',') {
          r[i]=datos;
          i++;
          datos='';
        } else {
          datos=datos+caracter;
        }
      }
    }
    r[i]=datos;
    return r;
  }
  separar_campos_csv_por_puntoycoma(linea:any) {
    const r = [];
    let i = 0;
    let comilla=false;
    let a: number;
    let datos = '';
    for (a=0;a<linea.length;a++) {
      const caracter=linea.substring(a,a+1);
      if (caracter==='"') {
        if (comilla) {
          comilla=false;
        } else {
          comilla=true;
        }
      } else {
        if (caracter===';') {
          r[i]=datos;
          i++;
          datos='';
        } else {
          datos=datos+caracter;
        }
      }
    }
    r[i]=datos;
    return r;
  }
  sumatoria(listado:any,campo1:string,campo2='',redondear=false,decimales=2) {
    let total=0;
    let a: number;
    if (listado!==null && listado.length>0) {
      for (a=0;a<listado.length;a++) {
        if (campo2==='') {
          if (listado[a][campo1]!==undefined && listado[a][campo1]!==null) total+=listado[a][campo1];
        } else {
          if (listado[a][campo1]!==undefined && listado[a][campo1]!==null && listado[a][campo2]!==undefined && listado[a][campo2]!==null) total+=(listado[a][campo1]*listado[a][campo2]);
        }
      }
    }
    if (redondear) total=this.redondear(total,decimales);
    return total;
  }
  f_sumatoria_numerico(listado:any,campo1:string,campo2='',formato_numerico=true,decimales=2,versolovaloresdistintosdecero=false) {
    if (formato_numerico) {
      return this.formatNumber(this.sumatoria(listado,campo1,campo2),decimales,versolovaloresdistintosdecero);
    } else {
      return this.sumatoria(listado,campo1,campo2).toString();
    }
  }
  validarCuit(pcuit:any) {
    if (pcuit===null || pcuit===undefined) {
      return false;
    }
    const cuit = pcuit.toString();
    if(cuit.length !== 11) {
      return false;
    }
    let acumulado = 0;
    const digitos = cuit.split('');
    const digito = parseFloat(digitos.pop());
    let i: number;
    for(i = 0; i < digitos.length; i++) {
      acumulado += digitos[9 - i] * (2 + (i % 6));
    }
    let verif = 11 - (acumulado % 11);
    if(verif === 11) {
      verif = 0;
    } else if(verif === 10) {
      verif = 9;
    }
    if (digito === verif) {
      return true;
    } else {
      return false;
    }
  }
  validar_fecha(que:any) {
    if (Object.prototype.toString.call(que) === '[object Date]') {
      return true;
    } else {
      return false;
    }
  }
  validar_mail(mail:string) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true;
    } else {
      return false;
    }
  }
  f_ancho_caja(pancho=0) {
    let ancho=0;
    if (this.G.ancho>pancho) {
      ancho=pancho;
    } else if (!this.G.modo_celular) {
      ancho=this.G.ancho-20;
    } else {
      ancho=this.G.ancho;
    }
    return ancho;
  }
  f_error_php(pmenu='',error:any,cerrar=true) {
    if (pmenu!=='' && cerrar) { this.show_loading(0,pmenu); }
    let a: number;
    let barra=0;
    let archivo=error.url;
    for (a=0;a<error.url.length;a++) {
      if (error.url.substring(a,a+1)==='/') {
        barra=a;
      }
    }
    if (barra>0) { archivo=error.url.substring(barra+1,error.url.length); }
    const vtitulo='Error de sistema menu '+pmenu+', archivo: '+archivo;
    //if (this.G.ModoProduccion!==1 || this.G.login_usuario===1) {
    if (this.G.ModoProduccion!==1) {
      this.Alerta(vtitulo,1);
      console.log(archivo);
      console.log(error.error.text);
      console.log(error);
    } else {
      if (this.G.login_usuario===1) {
        console.log(vtitulo);
        console.log(archivo);
        console.log(error.error.text);
        console.log(error);
      }
      if (error.error.text.trim().substring(0,17)==='Error de Conexión') {
        this.Alerta('Error de Conexión, verifique su servicio de internet.',1);
      } else {
        this.Alerta('Error de sistema ('+pmenu+') se envió reporte al servicio técnico.',1);
        this.http.post(this.G.URL+'consultas_varias.php', {
          accion:'enviar_mail_reporte_error',
          titulo:vtitulo,
          menu:pmenu,
          error_archivo:archivo,
          error_texto:error.error.text,
          error_status:error.status,
          error_nombre:error.name,
          error_mensaje:error.message,
          parametros_acceso: this.G.parametros_acceso } ).subscribe(
          );
      }
    }
  }
  f_numeros_a_letras(numero=0) {
  	numero=this.redondear(numero,2);
	  let num_letras='';
	  if (numero < 1000000000) {
      let millones=0;
  		if (numero >= 100000000) {
			  millones=parseFloat(numero.toString().substring(0,3));
  			numero=numero-(millones*1000000);
			  if (num_letras!=='') { num_letras=num_letras+''; }
  			num_letras=num_letras+this.f_centenas(millones)+' millones';
		  } else if (numero >= 10000000) {
			  millones=parseFloat(numero.toString().substring(0,2));
  			numero=numero-(millones*1000000);
			  if (num_letras!=='') {num_letras=num_letras+' ';}
  			num_letras=num_letras+this.f_decenas(millones)+' millones';
		  } else if (numero>=1000000 && numero<2000000) {
			  num_letras=num_letras+'un millon';
			  millones=parseFloat(numero.toString().substring(0,1));
  			numero=numero-1000000;
			  if (num_letras!=='') { num_letras=num_letras+' ';}
  		} else if (numero>= 1000000) {
			  millones=parseFloat(numero.toString().substring(0,1));
  			numero=numero-(millones*1000000);
			  if (num_letras!=='') { num_letras=num_letras+' '; }
  			num_letras=num_letras+this.f_decenas(millones)+' millones';
		  }
		  if (numero >= 100000) {
			  millones=parseFloat(numero.toString().substring(0,3));
  			numero=numero-(millones*1000);
  			if (num_letras!=='') { num_letras=num_letras+' ';}
			  num_letras=num_letras+this.f_centenas(millones)+' mil';
  		} else if (numero >= 10000) {
			  millones=parseFloat(numero.toString().substring(0,2));
  			numero=numero-(millones*1000);
			  if (num_letras!=='') { num_letras=num_letras+' ';}
			  num_letras=num_letras+this.f_decenas(millones)+' mil';
		  } else if (numero >= 1000 && numero<2000) {
			  millones=parseFloat(numero.toString().substring(0,1));
			  numero=numero-1000;
			  if (num_letras!=='') { num_letras=num_letras+' '; }
			  num_letras=num_letras+'un mil';
		  } else if (numero >= 1000) {
			  millones=parseFloat(numero.toString().substring(0,1));
  			numero=numero-(millones*1000);
	  		if (num_letras!=='') { num_letras=num_letras+' ';}
		  	num_letras=num_letras+this.f_decenas(millones)+' mil';
		  }
      if (numero>=100) {
        millones=parseFloat(numero.toString().substring(0,3));
        numero=numero-(millones);
        if (num_letras!=='') { num_letras=num_letras+' ';}
        num_letras=num_letras+this.f_centenas(millones);
      } else if (numero >= 10) {
        millones=parseFloat(numero.toString().substring(0,2));
        numero=numero-millones;
        if (num_letras!=='') { num_letras=num_letras+' ';}
        num_letras=num_letras+this.f_decenas(millones);
      } else if (numero >= 1 && numero<2) {
        millones=parseFloat(numero.toString().substring(0,1));
        numero=numero-1;
        if (num_letras!=='') { num_letras=num_letras+' ';}
        num_letras=num_letras+'uno';
      } else if (numero >= 1) {
        millones=parseFloat(numero.toString().substring(0,1));
        numero=numero-(millones);
        if (num_letras!=='') { num_letras=num_letras+' ';}
        num_letras=num_letras+this.f_decenas(millones);
      }
  		numero=this.redondear(numero*100,0);
      if (numero>=1) {
        if (num_letras!=='') { num_letras=num_letras+' con ';}
        if (numero<2) {
          num_letras=num_letras+' un centavo';
        } else {
          let dec=0;
          if (numero>9) {
            dec=parseFloat(numero.toString().substring(0,2));
          } else {
            dec=parseFloat(numero.toString().substring(0,1));
          }
          num_letras=num_letras+this.f_decenas(dec,false)+' centavos';
        }
      }
    }
  	return num_letras;
  }
  f_centenas(nro=0,uno=true) {
  let retornar='';
	const decena=parseFloat(nro.toString().substring(1,3));
	if (nro===100) { retornar='cien';
	} else if (nro<200) { retornar='ciento '+this.f_decenas(decena,uno);
	} else if (nro>=900) { retornar='novecientos '+this.f_decenas(decena,uno);
	} else if (nro>=800) { retornar='ochocientos '+this.f_decenas(decena,uno);
	} else if (nro>=700) { retornar='setecientos '+this.f_decenas(decena,uno);
	} else if (nro>=600) { retornar='seiscientos '+this.f_decenas(decena,uno);
	} else if (nro>=500) { retornar='quinientos '+this.f_decenas(decena,uno);
	} else if (nro>=400) { retornar='cuatrocientos '+this.f_decenas(decena,uno);
	} else if (nro>=300) { retornar='trescientos '+this.f_decenas(decena,uno);
	} else if (nro>=200) { retornar='doscientos '+this.f_decenas(decena,uno);
	} else { retornar=''; }
  if (retornar!=='cien' && retornar!=='' && decena===0) {
    retornar=retornar.trim();
  }
  return retornar;
  }
  f_decenas(nro=0,uno=true) : string {
	if (nro<30) {
    if (nro===0) { return ''; }
		if (nro===1) { if (uno) { return 'uno'; } else { return 'un'; } }
		if (nro===2) {return 'dos';}
		if (nro===3) {return 'tres';}
		if (nro===4) {return 'cuatro';}
		if (nro===5) {return 'cinco';}
		if (nro===6) {return 'seis';}
		if (nro===7) {return 'siete';}
		if (nro===8) {return 'ocho';}
		if (nro===9) {return 'nueve';}
		if (nro===10) {return 'diez';}
		if (nro===11) {return 'once';}
		if (nro===12) {return 'doce';}
		if (nro===13) {return 'trece';}
		if (nro===14) {return 'catorce';}
		if (nro===15) {return 'quince';}
		if (nro===16) {return 'dieciseis';}
		if (nro===17) {return 'diecisiete';}
		if (nro===18) {return 'dieciocho';}
		if (nro===19) {return 'diecinueve';}
		if (nro===20) {return 'veinte';}
		if (nro===21) {return 'veintiuno';}
		if (nro===22) {return 'veintidos';}
		if (nro===23) {return 'veintitres';}
		if (nro===24) {return 'veinticuatro';}
		if (nro===25) {return 'veinticinco';}
		if (nro===26) {return 'veintiseis';}
		if (nro===27) {return 'veintisiete';}
		if (nro===28) {return 'veintiocho';}
		if (nro===29) {return 'veintinueve';}
    return '';
	} else if (nro===30) {
		return 'treinta';
	} else if (nro<40) {
		return 'treinta y '+this.f_decenas(parseFloat(nro.toString().substring(1,2)),uno);
	} else if (nro===40) {
		return 'cuarenta';
	} else if (nro<50) {
		return 'cuarenta y '+this.f_decenas(parseFloat(nro.toString().substring(1,2)),uno);
	} else if (nro===50) {
		return 'cincuenta';
	} else if (nro<60) {
		return 'cincuenta y '+this.f_decenas(parseFloat(nro.toString().substring(1,2)),uno);
	} else if (nro===60) {
		return 'sesenta';
	} else if (nro<70) {
		return 'sesenta y '+this.f_decenas(parseFloat(nro.toString().substring(1,2)),uno);
	} else if (nro===70) {
		return 'setenta';
	} else if (nro<80) {
		return 'setenta y '+this.f_decenas(parseFloat(nro.toString().substring(1,2)),uno);
	} else if (nro===80) {
		return 'ochenta';
	} else if (nro<90) {
		return 'ochenta y '+this.f_decenas(parseFloat(nro.toString().substring(1,2)),uno);
	} else if (nro===90) {
		return 'noventa';
	} else {
		return 'noventa y '+this.f_decenas(parseFloat(nro.toString().substring(1,2)),uno);
	}
  }
  f_municipio(cual:number,parametro_opciones:any=null) {
    let campo='nombre';
    let nombre_con_provincia=false;
    let nombre_provincia_al_final=true;
    let nombre_vacio='';
    if (parametro_opciones!==null) {
      let opciones=JSON.parse(JSON.stringify(parametro_opciones));
      if (opciones['campo']!==undefined) campo=opciones.campo;
      if (opciones['nombre_con_provincia']!==undefined) nombre_con_provincia=opciones.nombre_con_provincia;
      if (opciones['nombre_provincia_al_final']!==undefined) nombre_provincia_al_final=opciones.nombre_provincia_al_final;
      if (opciones['nombre_vacio']!==undefined) nombre_vacio=opciones.nombre_vacio;
    }
    const r=this.buscar_por_id(this.G.municipios,cual);
    if (campo==='nombre') {
      if (r===null) {
        return nombre_vacio;
      } else {
        if (nombre_con_provincia && nombre_provincia_al_final) {
          return r.nombre+' ('+this.f_provincia(r.provincia)+')';
        } else if (nombre_con_provincia) {
          return this.f_provincia(r.provincia)+' -> '+r.nombre;
        } else {
          return r.nombre;
        }
      }
    } else if (campo!==null) {
      return r[campo];
    } else {
      return r;
    }
  }
  f_municipalidad(cual:number,parametro_opciones:any=null) {
    let campo='nombre_municipio';
    let nombre_con_provincia=false;
    let nombre_provincia_al_final=true;
    let nombre_vacio='';
    if (parametro_opciones!==null) {
      let opciones=JSON.parse(JSON.stringify(parametro_opciones));
      if (opciones['campo']!==undefined) campo=opciones.campo;
      if (opciones['nombre_con_provincia']!==undefined) nombre_con_provincia=opciones.nombre_con_provincia;
      if (opciones['nombre_provincia_al_final']!==undefined) nombre_provincia_al_final=opciones.nombre_provincia_al_final;
      if (opciones['nombre_vacio']!==undefined) nombre_vacio=opciones.nombre_vacio;
    }
    const r=this.buscar_por_id(this.G.municipios,cual);
    if (campo==='nombre_municipio') {
      if (r===null) {
        return nombre_vacio;
      } else {
        if (nombre_con_provincia && nombre_provincia_al_final) {
          return r.nombre_municipio+' ('+this.f_provincia(r.provincia)+')';
        } else if (nombre_con_provincia) {
          return this.f_provincia(r.provincia)+' -> '+r.nombre_municipio;
        } else {
          return r.nombre_municipio;
        }
      }
    } else if (campo!==null) {
      return r[campo];
    } else {
      return r;
    }
  }

  f_traer_algo_por_tipo(tipo:string,cual:number) {
    let r:any=null;
    if (tipo==='provincias') r=this.buscar_por_id(this.G.provincias,cual);
    if (tipo==='personas') r=this.buscar_por_id(this.G.personas,cual);
    if (tipo==='usuarios') r=this.buscar_por_id(this.G.usuarios,cual);
    return r;
  }

  f_buscar_algo_nombre_por_defecto(tipo:string,cual:number,campo='nombre') {
    let r:any=this.f_traer_algo_por_tipo(tipo,cual);
    let retorno:any=null;
    if (campo==='nombre') {
      if (r===null) {
        retorno='';
      } else {
        retorno=r.nombre;
      }
    } else if (campo!==null) {
      retorno=r[campo];
    } else {
      retorno=r;
    }
    return retorno;
  }
  f_moneda(cual:number,campo='nombre') { return this.f_buscar_algo_nombre_por_defecto('monedas',cual,campo); }
  f_provincia(cual:number,campo='nombre') { return this.f_buscar_algo_nombre_por_defecto('provincias',cual,campo); }
  f_persona(cual:number,campo='nombre') { return this.f_buscar_algo_nombre_por_defecto('personas',cual,campo); }
  f_usuario(cual:number,campo='nombre') { return this.f_buscar_algo_nombre_por_defecto('usuarios',cual,campo); }
  f_iva_alicuota(cual:number,campo='nombre') { return this.f_buscar_algo_nombre_por_defecto('iva_alicuotas',cual,campo); }
  f_iva_alicuota_multiplicador(cual:number) { return this.f_buscar_algo_nombre_por_defecto('iva_alicuotas',cual,'multiplicador'); }


  f_listado_permitido(listado:any,permiso='pagar',segundo_campo='',valor:any=null) {
    const lista=[];
    for (const l of listado) {
      if (l[permiso]!==undefined && l[permiso]) {
        if (segundo_campo==='' || l[segundo_campo]===valor) lista.push(l);
      }
    }
    return lista;
  }

  f_cuit_con_guiones(cuit:any) {
    let c=cuit.toString();
    return c.substring(0,2)+'-'+c.substring(2,10)+'-'+c.substring(10,11);
  }
  f_ordenar(listado:any,campo:string,ascendiente=true) {
    if (ascendiente) {
      listado.sort((a:any, b:any) => {
        if(a[campo] > b[campo]) return 1;
        if(a[campo] < b[campo]) return -1;
        return 0;
      });
    } else {
      listado.sort((a:any, b:any) => {
        if(a[campo] < b[campo]) return 1;
        if(a[campo] > b[campo]) return -1;
        return 0;
      });
    }

  }

  f_traer_dato_tabla_texto(listado:any,id:any,campo='nombre',campo_id='id') {
    let r='';
    const dato=this.buscar_por_id(listado,id,campo_id);
    if (dato!==null) r=dato[campo];
    return r;
  }
  f_traer_dato_tabla_numero(listado:any,id:any,campo='nombre',campo_id='id') {
    let r=0;
    const dato=this.buscar_por_id(listado,id,campo_id);
    if (dato!==null) r=dato[campo];
    return r;
  }
  f_repaginar(paginar:Paginar,listado:any) {paginar.ok=false;setTimeout (() => paginar.ok=this.f_paginar(listado,paginar),10);}
  f_paginar(listado:any,paginar:Paginar) {
    paginar.grupos=[];
    paginar.combo=[];
    paginar.viendo=null;
    if (paginar.agrupar) {
      if (listado!==null && listado.length>0) {
        let contador=0;
        let primero=true;
        let indice=1;
        for (let a=0;a<listado.length;a++) {
          if (contador>=paginar.agrupar_cantidad || primero) {
            paginar.combo.push({id:indice-1,nombre:indice,primero:primero,ultimo:false});
            paginar.grupos.push({listado:[]});
            primero=false;
            indice++;
          }
          if (contador>=paginar.agrupar_cantidad) contador=0;
          if (a+1===listado.length) paginar.combo[paginar.combo.length-1].ultimo=true;
          paginar.grupos[paginar.grupos.length-1].listado.push(listado[a]);
          contador++;
        }
        paginar.viendo=paginar.combo[0];
      }
    } else if (listado!==null && listado.length>0) {
      paginar.combo.push({id:0,nombre:'1',primero:true,ultimo:false});
      paginar.grupos.push({listado:listado});
      paginar.viendo=paginar.combo[0];
    }
    return true;
  }

  f_in(variable:any,listado:any) {
    let esta=false;
    if (listado!==null && listado.length>0) {
      for (let a=0;a<listado.length;a++) {
        if (listado[a]===variable) {
          esta=true;
          break;
        }
      }
    }
    return esta;
  }
  f_not_in(variable:any,listado:any) {
    let noesta=true;
    if (listado!==null && listado.length>0) {
      for (let a=0;a<listado.length;a++) {
        if (listado[a]===variable) {
          noesta=false;
          break;
        }
      }
    }
    return noesta;
  }
  f_tiempo_transcurrido() {
    let tiempo=0;
    let f=new Date();
    tiempo=f.getSeconds();
    tiempo+=f.getMinutes()*60;
    tiempo+=f.getHours()*60*60;
    tiempo+=this.fecha_diferencia_dias(f,this.mysql_a_formatofecha(this.G.Actualizador.FechaLogueo))*24*60*60;
    return tiempo;
  }
  f_max_width(maximo=450) {
    if (this.G.modo_celular) {
      return this.G.ancho;
    } else if (this.G.ancho>maximo) {
      return maximo;
    } else {
      return this.G.ancho;
    }
  }
  f_puede_opcion(opcion:string) {
    let adaptado_a_celular=false;for (let b of this.G.menu_opciones) { if (b.opcion_id===opcion && b.celular) adaptado_a_celular=true; }
    if (this.G.modo_celular && !adaptado_a_celular) { return false; }
    else if (opcion==='config_usuarios' && this.G.usuario_administrador===this.G.login_usuario) {return true;}
    let puede=false;
    let p:Permiso;
    for (p of this.G.permisos) {
      if (p.permitido) {
        for (let menu_opcion of p.menus) {
          if (menu_opcion===opcion) puede=true;
        }
      }
    }
    return puede;
  }
  f_tildardestiladar_todo(listado:any,estado:boolean,campo='tildado') {for (let l of listado) { l[campo]=estado; }}
  f_listado_esta_todo_tildadodestildado(listado:any,estado:boolean,campo='tildado') {
    let esta=true;
    for (let l of listado) {
      if (l[campo]!=estado) esta=false;
    }
    return esta;
  }
  f_listado_esta_algo_tildado(listado:any,campo='tildado') {
    let esta=false;
    for (let l of listado) {
      if (l[campo]) esta=true;
    }
    return esta;
  }
  f_hay_cantidad_distinta_de_un_valor(listado:any,valor=1,campo='cantidad') {
    let hay=true;
    if (listado.length>0) {
      hay=false;
      for (let i of listado) {
        if (i[campo]===undefined || i[campo]!==valor) {
          hay=true;
          break;
        }
      }
    }
    return hay;
  }
  f_hay_texto_distinto_de_un_valor(listado:any,valor='',campo='nombre') {
    let hay=true;
    if (listado.length>0) {
      hay=false;
      for (let i of listado) {
        if (i[campo]===undefined || i[campo]!==valor) {
          hay=true;
          break;
        }
      }
    }
    return hay;
  }
  f_cantidad_tildada(listado:any,valor=true,campo='tildado') {
    let cantidad=0;
    for (let i of listado) {
      if (i[campo]!==undefined) {
        if (i[campo] && valor) cantidad++;
        if (!i[campo] && !valor) cantidad++;
      }
    }

    return cantidad;
  }
  f_color(posicion:number,con_opacidad:any | null=null) {
    let ret='rgb(';
    if (this.f_in(posicion,[0,3,6,9,12])) {
      ret+=(255-(posicion*20)).toString()+',';
    } else {
      ret+='0,';
    }
    if (this.f_in(posicion,[1,4,7,10,13])) {
      ret+=(255-(posicion*20)).toString()+',';
    } else {
      ret+='0,';
    }
    if (this.f_in(posicion,[2,5,8,11,14])) {
      ret+=(255-(posicion*20)).toString();
    } else {
      ret+='0';
    }
    if (con_opacidad===null) {
      ret+=')';
    } else {
      ret+=','+con_opacidad+')';
    }
    return ret;
  }
  f_stringToUTF8(str:string) {
    let bytes = [];

    for(let character of str) {
        let code = character.codePointAt(0);

        if(code <= 127)
        {
            let byte1 = code;

            bytes.push(byte1);
        }
        else if(code <= 2047)
        {
            let byte1 = 0xC0 | (code >> 6);
            let byte2 = 0x80 | (code & 0x3F);

            bytes.push(byte1, byte2);
        }
        else if(code <= 65535)
        {
            let byte1 = 0xE0 | (code >> 12);
            let byte2 = 0x80 | ((code >> 6) & 0x3F);
            let byte3 = 0x80 | (code & 0x3F);

            bytes.push(byte1, byte2, byte3);
        }
        else if(code <= 2097151)
        {
            let byte1 = 0xF0 | (code >> 18);
            let byte2 = 0x80 | ((code >> 12) & 0x3F);
            let byte3 = 0x80 | ((code >> 6) & 0x3F);
            let byte4 = 0x80 | (code & 0x3F);

            bytes.push(byte1, byte2, byte3, byte4);
        }
    }

    return bytes;
  }

  f_utf8ToString(bytes:any, fallback:any) {
    let valid = undefined;
    let codePoint = undefined;
    let codeBlocks = [0, 0, 0, 0];

    let result = "";

    for(let offset = 0; offset < bytes.length; offset++) {
        let byte = bytes[offset];

        if((byte & 0x80) == 0x00) {
            codeBlocks[0] = byte & 0x7F;

            codePoint = codeBlocks[0];
        } else if((byte & 0xE0) == 0xC0) {
            codeBlocks[0] = byte & 0x1F;

            byte = bytes[++offset];
            if(offset >= bytes.length || (byte & 0xC0) != 0x80) { valid = false; break; }

            codeBlocks[1] = byte & 0x3F;

            codePoint = (codeBlocks[0] << 6) + codeBlocks[1];
        } else if((byte & 0xF0) == 0xE0) {
            codeBlocks[0] = byte & 0xF;

            for(let blockIndex = 1; blockIndex <= 2; blockIndex++) {
                byte = bytes[++offset];
                if(offset >= bytes.length || (byte & 0xC0) != 0x80) { valid = false; break; }

                codeBlocks[blockIndex] = byte & 0x3F;
            }
            if(valid === false) { break; }
            codePoint = (codeBlocks[0] << 12) + (codeBlocks[1] << 6) + codeBlocks[2];
        } else if((byte & 0xF8) == 0xF0) {
            codeBlocks[0] = byte & 0x7;

            for(let blockIndex = 1; blockIndex <= 3; blockIndex++) {
                byte = bytes[++offset];
                if(offset >= bytes.length || (byte & 0xC0) != 0x80) { valid = false; break; }

                codeBlocks[blockIndex] = byte & 0x3F;
            }
            if(valid === false) { break; }

            codePoint = (codeBlocks[0] << 18) + (codeBlocks[1] << 12) + (codeBlocks[2] << 6) + (codeBlocks[3]);
        } else {
            valid = false; break;
        }

        result += String.fromCodePoint(codePoint);
    }

    if(valid === false) {
        if(!fallback) {
            throw new TypeError("Malformed utf-8 encoding.");
        }
        result = "";
        for(let offset = 0; offset != bytes.length; offset++) {
            result += String.fromCharCode(bytes[offset] & 0xFF);
        }
    }
    return result;
}

  f_decodeBase64(text:any) {
    if(/[^0-9a-zA-Z\+\/\=]/.test(text)) { throw new TypeError("The string to be decoded contains characters outside of the valid base64 range."); }

    let codePointA = 'A'.codePointAt(0);
    let codePointZ = 'Z'.codePointAt(0);
    let codePointa = 'a'.codePointAt(0);
    let codePointz = 'z'.codePointAt(0);
    let codePointZero = '0'.codePointAt(0);
    let codePointNine = '9'.codePointAt(0);
    let codePointPlus = '+'.codePointAt(0);
    let codePointSlash = '/'.codePointAt(0);

    function getCodeFromKey(key:any) {
        let keyCode = key.codePointAt(0);

        if(keyCode >= codePointA && keyCode <= codePointZ)
        {
            return keyCode - codePointA;
        }
        else if(keyCode >= codePointa && keyCode <= codePointz)
        {
            return keyCode + 26 - codePointa;
        }
        else if(keyCode >= codePointZero && keyCode <= codePointNine)
        {
            return keyCode + 52 - codePointZero;
        }
        else if(keyCode == codePointPlus)
        {
            return 62;
        }
        else if(keyCode == codePointSlash)
        {
            return 63;
        }

        return undefined;
    }

    let codes = Array.from(text).map(character => getCodeFromKey(character));

    let bytesLength = Math.ceil(codes.length / 4) * 3;

    if(codes[codes.length - 2] == undefined) { bytesLength = bytesLength - 2; } else if(codes[codes.length - 1] == undefined) { bytesLength--; }

    let bytes = new Uint8Array(bytesLength);

    for(let offset = 0, index = 0; offset < bytes.length;) {
        let code1 = codes[index++];
        let code2 = codes[index++];
        let code3 = codes[index++];
        let code4 = codes[index++];

        let byte1 = (code1 << 2) | (code2 >> 4);
        let byte2 = ((code2 & 0xf) << 4) | (code3 >> 2);
        let byte3 = ((code3 & 0x3) << 6) | code4;

        bytes[offset++] = byte1;
        bytes[offset++] = byte2;
        bytes[offset++] = byte3;
    }

    return this.f_utf8ToString(bytes, true);
  }

  f_encodeBase64(bytes:any) {
    if (bytes === undefined || bytes === null) {
        return '';
    }
    if (bytes instanceof Array) {
        bytes = bytes.filter(item => {
            return Number.isFinite(item) && item >= 0 && item <= 255;
        });
    }

    if (
        !(
            bytes instanceof Uint8Array ||
            bytes instanceof Uint8ClampedArray ||
            bytes instanceof Array
        )
    ) {
        if (typeof bytes === 'string') {
            const str = bytes;
            bytes = Array.from(unescape(encodeURIComponent(str))).map(ch =>
                ch.codePointAt(0)
            );
        } else {
            throw new TypeError('bytes must be of type Uint8Array or String.');
        }
    }

    const keys = [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'x',
        'y',
        'z',
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '+',
        '/'
    ];
    const fillKey = '=';

    let byte1;
    let byte2;
    let byte3;
    let sign1 = ' ';
    let sign2 = ' ';
    let sign3 = ' ';
    let sign4 = ' ';

    let result = '';

    for (let index = 0; index < bytes.length; ) {
        let fillUpAt = 0;

        // tslint:disable:no-increment-decrement
        byte1 = bytes[index++];
        byte2 = bytes[index++];
        byte3 = bytes[index++];

        if (byte2 === undefined) {
            byte2 = 0;
            fillUpAt = 2;
        }

        if (byte3 === undefined) {
            byte3 = 0;
            if (!fillUpAt) {
                fillUpAt = 3;
            }
        }

        // tslint:disable:no-bitwise
        sign1 = keys[byte1 >> 2];
        sign2 = keys[((byte1 & 0x3) << 4) + (byte2 >> 4)];
        sign3 = keys[((byte2 & 0xf) << 2) + (byte3 >> 6)];
        sign4 = keys[byte3 & 0x3f];

        if (fillUpAt > 0) {
            if (fillUpAt <= 2) {
                sign3 = fillKey;
            }
            if (fillUpAt <= 3) {
                sign4 = fillKey;
            }
        }

        result += sign1 + sign2 + sign3 + sign4;

        if (fillUpAt) {
            break;
        }
    }
    return result;
  }
  f_fechas_mes_anterior(devolver_primer_dia=true) {
    let primer_dia=new Date();
    let ultimo_dia=new Date();
    let f=new Date();
    let mes_mio=f.getMonth()+1;
    let mes=f.getMonth();
    let anio=f.getFullYear();
    if (mes===0) {
      anio--;
      mes=11;
      mes_mio=12;
    } else {
      mes--;
      mes_mio--;
    }
    if (mes_mio===1 || mes_mio===3 || mes_mio===5 || mes_mio===7 || mes_mio===8 || mes_mio===10 || mes_mio===12) {
      ultimo_dia=new Date(anio,mes,31);
    } else if (mes_mio===4 || mes_mio===6 || mes_mio===9 || mes_mio===11) {
      ultimo_dia=new Date(anio,mes,30);
    } else if (anio/4===this.redondear(anio/4,0)) {
      if (anio/100===this.redondear(anio/100,0)) {
        ultimo_dia=new Date(anio,mes,28);
      } else {
        ultimo_dia=new Date(anio,mes,29);
      }
    } else {
      ultimo_dia=new Date(anio,mes,28);
    }
    if (devolver_primer_dia) {
      return new Date(anio,mes,1);
    } else {
      return ultimo_dia;
    }
  }
}

