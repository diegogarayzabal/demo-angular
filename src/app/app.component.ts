import { Component, enableProdMode,OnInit,ViewChild,ViewContainerRef,ComponentRef,AfterViewInit,Type,ChangeDetectorRef} from '@angular/core';
import { NgIf,NgClass,NgFor } from '@angular/common';
import { FuncionesService } from './funciones.service';
import { Globals,Permiso,IdNombre, Provincia,MenuOpcion,Menu,SubMenu1,SubMenu2,ParametrosAcceso,FConfirmar } from './globales';
import { Subscription } from 'rxjs';
import { ActualizarSistemaModule } from './actualizar-sistema/actualizar-sistema.module';
import { ComponentesModule } from "./componentes/componentes.module";
import { environment } from '../environments/environment';
import md5 from 'js-md5';
enableProdMode();

class menu {
  id=0;
  posicion=0;
  nombre='';
  imagen='';
  submenu1:any[]=[];
  tildado=false;
  constructor(id:number,posicion:number,nombre:string,imagen:string,submenu1:any) {
    this.id=id;
    this.posicion=posicion;
    this.nombre=nombre;
    this.imagen=imagen;
    this.submenu1=submenu1;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss','./app.estilosgenerales.scss','./bootstrap.css','./app.componentestilos.scss'],
  imports: [NgIf,NgClass,NgFor,
    ComponentesModule,ActualizarSistemaModule  ] 
})
export class AppComponent implements OnInit,AfterViewInit  {
  @ViewChild('contenedorConfirmacion', { read: ViewContainerRef }) vcrConfirmador!: ViewContainerRef;
  G: Globals;
  abrir_algo='';
  appVersion=2025.1117;
  menu:menu[]=[];
  MostrandoMenu=false;
  MenuViendoTipo=0;
  MenuViendoTipo_item:any=null;
  Submenu1:any[]=[];
  ViendoSubmenu2=false;
  MenuViendoSubmenuitem:any=null;
  Submenu2:any[]=[];
  submenu1_top=40;
  submenu1_top_triangulo=40;
  submenu1_alto=40;
  submenu2_top=40;
  submenu2_top_triangulo=40;
  submenu2_alto=40;
  desplegar_submenu_tipo_carpeta=false;
  viendo_menu_tipo_carpeta:any=null;
  viendo_submenu1_tipo_carpeta:any=null;
  menu_celular_todo_junto:any[]=[];
  modo_celular_cambiando_empresa=false;

  @ViewChild('contenedorLogin', { read: ViewContainerRef }) contenedorLogin!: ViewContainerRef;
  @ViewChild('contenedorconfig_usuarios', { read: ViewContainerRef }) contenedorconfig_usuarios!: ViewContainerRef;  private componenteconfig_usuarios!: ComponentRef<any>;
  @ViewChild('contenedorconfiguracion', { read: ViewContainerRef }) contenedorconfiguracion!: ViewContainerRef;  private componenteconfiguracion!: ComponentRef<any>;
  @ViewChild('contenedorpersonas', { read: ViewContainerRef }) contenedorpersonas!: ViewContainerRef;  private componentepersonas!: ComponentRef<any>;
  @ViewChild('contenedorvisitas_nueva', { read: ViewContainerRef }) contenedorvisitas_nueva!: ViewContainerRef;  private componentevisitas_nueva!: ComponentRef<any>;
  @ViewChild('contenedorvisitas', { read: ViewContainerRef }) contenedorvisitas!: ViewContainerRef;  private componentevisitas!: ComponentRef<any>;
  @ViewChild('contenedorrecordatorios', { read: ViewContainerRef }) contenedorrecordatorios!: ViewContainerRef;  private componenterecordatorios!: ComponentRef<any>;
  @ViewChild('contenedorcasos_nuevo', { read: ViewContainerRef }) contenedorcasos_nuevo!: ViewContainerRef;  private componentecasos_nuevo!: ComponentRef<any>;
  @ViewChild('contenedorcasos', { read: ViewContainerRef }) contenedorcasos!: ViewContainerRef;  private componentecasos!: ComponentRef<any>;

  constructor(
    G: Globals
    ,public Funcion: FuncionesService
    ,private cdRef: ChangeDetectorRef
    ) {
    this.G=G;
    this.G.URL = environment.URL;
    this.G.servicio_factura_electronica = environment.servicio_factura_electronica;
    this.G.servicio_consulta_padron = environment.servicio_consulta_padron;
    this.G.ModoProduccion=0;
    if (environment.production) this.G.ModoProduccion=1;
    console.log(this.G.ModoProduccion===1 ? 'Producción' : 'Desarrollo');
    this.f_cargar_variables();
    this.G.GLoginOk=-2;
  }

  f_ocultar_componente(cual:string) { return (this.G.menu_item_seleccionado!==cual || this.desplegar_submenu_tipo_carpeta); }
  async cargarLogin() {
    const { LoginComponent } = await import('./login/login.component'); // Lazy Load
    const componentRef = this.contenedorLogin.createComponent(LoginComponent as Type<any>);
    componentRef.instance.parametro_actualizar = 1;
    componentRef.instance.appVersion=this.appVersion;
    this.cdRef.detectChanges();
    componentRef.instance.LoginRespuesta.subscribe((respuesta: object) => {
      this.f_respuesta_login();
    });
  }

  // me quede aca viendo el tema de agrupar con módulo para que no genere tantos archivos no lo probé todavía.

  async f_cargar_componente(nombre:string,recargar=false) {
    let componente: Type<any>;
    let modulo: any;
    if (this.Funcion.f_in(nombre,['configuracion','config_usuarios'])) {
      this.Funcion.f_procesando_general_activar('Cargando Módulo de Configuración');
      modulo = await import('./configuracion/configuracion.module'); // Importar todo el módulo
      this.Funcion.f_procesando_general_desactivar();
      switch (nombre) {
        case 'configuracion':
          this.componenteconfiguracion = await this.Funcion.reiniciarComponente(this.contenedorconfiguracion, this.componenteconfiguracion, modulo.MenuConfiguracionComponent);
          break;
        
        case 'config_usuarios':
          this.componenteconfig_usuarios = await this.Funcion.reiniciarComponente(this.contenedorconfig_usuarios, this.componenteconfig_usuarios, modulo.MenuConfigUsuariosComponent);
          break;
                
      }
    } else if (this.Funcion.f_in(nombre,['personas','recordatorios'])) {
      this.Funcion.f_procesando_general_activar('Cargando Módulo de Utilidades');
      modulo = await import('./utilidades/utilidades.module'); // Importar todo el módulo
      this.Funcion.f_procesando_general_desactivar();
      switch (nombre) {
        case 'personas':
          this.componentepersonas = await this.Funcion.reiniciarComponente(this.contenedorpersonas, this.componentepersonas, modulo.MenuPersonasComponent);
          break;
        case 'recordatorios':
          this.componenterecordatorios = await this.Funcion.reiniciarComponente(this.contenedorrecordatorios, this.componenterecordatorios, modulo.MenuRecordatoriosComponent);
          break;
      }
    } else {
      this.Funcion.f_procesando_general_activar('Cargando Módulo General');
      modulo = await import('./opciones/opciones.module'); // Importar todo el módulo
      this.Funcion.f_procesando_general_desactivar();
      switch (nombre) {
        case 'visitas_nueva':
          this.componentevisitas_nueva = await this.Funcion.reiniciarComponente(this.contenedorvisitas_nueva, this.componentevisitas_nueva, modulo.MenuVisitasNuevaComponent);
          break;
        case 'visitas':
          this.componentevisitas = await this.Funcion.reiniciarComponente(this.contenedorvisitas, this.componentevisitas, modulo.MenuVisitasComponent);
          break;
        case 'casos_nuevo':
          this.componentecasos_nuevo = await this.Funcion.reiniciarComponente(this.contenedorcasos_nuevo, this.componentecasos_nuevo, modulo.MenuCasosNuevoComponent);
          break;
        case 'casos':
          this.componentecasos = await this.Funcion.reiniciarComponente(this.contenedorcasos, this.componentecasos, modulo.MenuCasosComponent);
          break;
    
      }
    }
  }
  
  ngAfterViewInit() {
    this.cdRef.detectChanges();
    this.cargarLogin();
    this.ngOnInit();
  }


  SuscripcionConfirmar: Subscription;
  ngOnInit() {
  }
  async f_cargar_variables() {
    this.G.sino.push(new IdNombre(0,'NO'));
    this.G.sino.push(new IdNombre(1,'SI'));
    let respuesta_post=await this.Funcion.f_http_post('','_variables_iniciales.php','',{},false,false);
    if (!respuesta_post.con_error) {
      let data=respuesta_post.data;
      this.G.tipos_documentos=[]; for (let p of data.tipos_documentos) { this.G.tipos_documentos.push(new IdNombre(p.id,p.nombre)); }
      this.G.mail_modos=[]; for (let p of data.mail_modos) { this.G.mail_modos.push(new IdNombre(p.id,p.nombre)); }
      this.G.MESES=[]; for (let p of data.MESES) { this.G.MESES.push(new IdNombre(p.id,p.nombre)); }
      this.G.provincias=[]; for (let p of data.provincias) { this.G.provincias.push(new Provincia(p)); }
    }
  }
  cambia_ancho(event:any) {
    if (event.target.innerWidth>500) {
      this.G.ancho=500;
    } else {
      this.G.ancho = event.target.innerWidth;
    }
    this.G.alto = event.target.innerHeight;
  }
  async f_respuesta_login() {
    console.log('Versión: '+this.appVersion.toString());
    this.G.Actualizador.FechaLogueo=this.Funcion.fecha_a_mysql(this.Funcion.fecha_hoy());
    this.G.parametros_acceso=new ParametrosAcceso(this.G.login_usuario,this.G.login_codigo,this.G.login_sesion,this.appVersion);
    for (let provincia of this.G.provincias) {
      provincia.municipios=[];
      for (let municipio of this.G.municipios) {
        if (provincia.id===municipio.provincia) provincia.municipios.push(municipio);
      }
    }
    this.G.modo_celular=(this.G.ancho<=500);
    if (this.G.ancho<=500) {
      this.G.ModoMenu.estilo=2;
      this.G.ModoMenu.ancho_barra_menu=0;
    }
    this.G.menu_opciones=[];
    this.G.personas=[];
    this.G.menu_item_seleccionado='';
    this.G.menu_item_seleccionado_anterior='';
    this.G.menu_item=[];
    this.Funcion.show_loading(1,'');
    this.G.Actualizador.TiempoUltimaConsulta=this.Funcion.f_tiempo_transcurrido();
    let respuesta_post=await this.Funcion.f_http_post('','actualizar_empresa.php','',{});
    if (!respuesta_post.con_error) {
      let data=respuesta_post.data;
      this.modo_celular_cambiando_empresa=false;
      this.G.menus=[];
      for (let m of data['menus']) {
        let menu=new Menu(m);
        for (let sm1 of m.submenu1) {
          let submenu1=new SubMenu1(sm1);
          for (let sm2 of sm1.submenu2) {
            submenu1.submenu2.push(new SubMenu2(sm2));
          }
          menu.submenu1.push(submenu1);
        }
        this.G.menus.push(menu);
      }

      this.G.ConsultaPadronAfip=data['ConsultaPadronAfip'];
      this.G.permisos=[];
      for (let p of data['permisos']) {
        this.G.permisos.push(new Permiso(0,p.id,p.nombre,false,p.opciones,p.modulos,p.restringido));
      }
      this.Funcion.f_ordenar(this.G.permisos,'permiso_nombre');
      for (let m of this.G.municipios) {
        m.nombre_completo=m.nombre+' ('+this.Funcion.f_provincia(m.provincia)+')';
      }
      this.MostrandoMenu=false;
      this.f_limpiar_tildados_menu1();
      for (let m of data['menu_opciones']) {
        this.G.menu_opciones.push(new MenuOpcion(m));
      }
      //acomodo los permisos que están habilitados
      for (let permiso of this.G.permisos) {
        permiso.permitido=false;
        for (let p of data['permitidos']) {
          if (p===permiso.permitido_id) permiso.permitido=true;
        }
      }
      this.G.usuarios=data['usuarios_todos'];
      this.G.usuario_administrador=data['usuario_administrador'];
      this.G.usuario_autorizador=data['usuario_autorizador'];

      this.G.parametros_acceso.appVersion_comprobada=data['appVersion_comprobada'];
      this.G.parametros_acceso.Inicializar();
      this.G.GLoginOk=1;
      this.G.menu_activo_titulo='';
      this.G.ACTUALIZAR_SISTEMA=true;
    }
  }
  iniciarDeteccionInactividad() {
    //const tiempoMaxInactivo = 3 * 60 * 1000; // 3 minutos sin actividad
    const renovar = () => {
      this.G.ultimaActividad = Date.now();
      if (this.G.SistemaBloqueado) return
    };

    // Eventos que renuevan actividad
    ['mousemove', 'keydown', 'mousedown', 'touchstart', 'focus'].forEach(evt => {
      window.addEventListener(evt, renovar);
    });

    // Si pierde foco o visibilidad, cuenta como inactividad
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.G.ultimaActividad = Date.now();
    });
    window.addEventListener('blur', () => {
      this.G.ultimaActividad = Date.now();
    });

    // Verificación periódica
    setInterval(() => {
      if (!this.G.SistemaBloqueado) {
        const diff = Date.now() - this.G.ultimaActividad;
        if (diff > this.G.usuario_preferencias.minutos_bloqueo * 60 * 1000) {
          if (this.G.login_valores_guardados) localStorage.setItem('kst_cookie_or',JSON.stringify(null));
          this.G.SistemaBloqueado = true;
        }
      }
    }, 5000);
  }
  async f_desbloquear(clave:any) {
    let respuesta_post=await this.Funcion.f_http_post('','usuarios.php','desbloquear',{cuit:this.G.login_cuit,clave:md5.md5(clave)});
    if (!respuesta_post.con_error) {
      let data=respuesta_post.data;
      if (data.datos.desbloquea) {
        this.G.SistemaBloqueado=false;
      } else {
        this.Funcion.Mensaje('Contraseña incorrecta',4,true);
      }
    }
  }
  async f_cerrar_sesiones() {
    let respuesta=await this.Funcion.ConfirmarComponente(new FConfirmar('Cierra todas las otras sesiones?'),this.vcrConfirmador);
    if (respuesta.respuesta>0) {
      await this.Funcion.f_http_post('','usuarios.php','cerrar_sesiones_extra',{});
    }
  }


  f_volvio_de_actualizar() {
    this.rearmar_menu();
  }
  rearmar_menu() {
    this.menu=[];
    this.menu_celular_todo_junto=[];
    let i=1;
    for(let vmenu of this.G.menus){
      const submenu1=[];
      for (let vsubmenu1 of vmenu.submenu1) {
        if (vsubmenu1.submenu2.length>0) {
          const vsubmenu2=[];
          for (let vsm2 of vsubmenu1.submenu2) {
            if (this.Funcion.f_puede_opcion(vsm2.opcion)) {
              this.menu_celular_todo_junto.push({opcion_id:vsm2.opcion,nombre:vsm2.nombre,imagen:vsm2.imagen,parametro_actualizar:1,abierto:false});
              vsubmenu2.push({opcion_id:vsm2.opcion,nombre:vsm2.nombre,imagen:vsm2.imagen});
              if (this.Funcion.buscar_por_id(this.G.menu_item,vsm2.opcion,'opcion_id')===null) {
                this.G.menu_item.push({opcion_id:vsm2.opcion,nombre:vsm2.nombre,imagen:vsm2.imagen,parametro_actualizar:1,abierto:false});
              }
            }
          }
          if (vsubmenu2.length>0) {
            submenu1.push({opcion_id:'',nombre:vsubmenu1.nombre,submenu:1,submenu2:vsubmenu2});
          }
        } else if (this.Funcion.f_puede_opcion(vsubmenu1.opcion)) {
          this.menu_celular_todo_junto.push({opcion_id:vsubmenu1.opcion,nombre:vsubmenu1.nombre,imagen:vsubmenu1.imagen,parametro_actualizar:1,abierto:false});
          submenu1.push({opcion_id:vsubmenu1.opcion,nombre:vsubmenu1.nombre,imagen:vsubmenu1.imagen,submenu:0,submenu2:[]});
          if (this.Funcion.buscar_por_id(this.G.menu_item,vsubmenu1.opcion,'opcion_id')===null) {
            this.G.menu_item.push({opcion_id:vsubmenu1.opcion,nombre:vsubmenu1.nombre,imagen:vsubmenu1.imagen,parametro_actualizar:1,abierto:false});
          }
        }
      }
      if (submenu1.length>0) {
        this.menu.push(new menu(i,i-1,vmenu.nombre,vmenu.imagen,submenu1));
        i++;
      }
    }
  }
  f_modo_carpeta_selecciona(item:any) {
    if (item.submenu) {
      this.viendo_submenu1_tipo_carpeta=item;
    } else {
      this.f_menu_item(item.opcion_id);
    }
  }
  f_menu_lateral_mostrar_nombre(nombre:string) {
    if (!this.MostrandoMenu) {
      return nombre;
    } else {
      return '';
    }
  }
  f_menu() {
    if (this.G.menu_item_seleccionado==='') {
      this.G.menu_item_seleccionado=this.G.menu_item_seleccionado_anterior;
    } else {
      this.G.menu_item_seleccionado='';
    }
  }
  f_menu_recargar() {
    this.Funcion.Confirmar('RECARGAR '+this.Funcion.buscar_por_id(this.G.menu_item,this.G.menu_item_seleccionado,'opcion_id').nombre+'?');
    this.SuscripcionConfirmar=this.Funcion.Confirmar$.subscribe(
      respuesta=> {
        this.SuscripcionConfirmar.unsubscribe();
        if (respuesta>0) {
          this.f_menu_recargar_ok();
        }
      }
    );
  }
  f_menu_recargar_ok() {
    const m=this.Funcion.buscar_por_id(this.G.menu_item,this.G.menu_item_seleccionado,'opcion_id');
    if (m!==null) {
      setTimeout (() => this.f_cargar_componente(this.G.menu_item_seleccionado), 20);
    }
  }
  f_menu_item(vitem:any) {
    setTimeout(() =>  this.MostrandoMenu=false  );
    setTimeout(() =>  this.desplegar_submenu_tipo_carpeta=false  );
    if (vitem!=='' && this.Funcion.buscar_por_id(this.G.menu_opciones,vitem,'opcion_id')!==null) {
      if (this.Funcion.buscar_por_id(this.G.menu_opciones,vitem,'opcion_id').version>this.appVersion) {
        this.Funcion.Alerta('Para acceder a esta opción debe actualizar la versión - Presione F5',1);
      } else {
        const m=this.Funcion.buscar_por_id(this.G.menu_item,vitem,'opcion_id');
        if (m!==null) {
          this.G.menu_item_seleccionado_anterior=this.G.menu_item_seleccionado;
          this.G.menu_item_seleccionado=vitem;
          this.G.menu_activo_titulo=m.nombre;
          m.parametro_actualizar++;
          m.abierto=true;
        }
        this.f_cargar_componente(vitem);
      }
    }
  }
  f_abierto(cual:string) {
    const m=this.Funcion.buscar_por_id(this.G.menu_item,cual,'opcion_id');
    return (m!==null && m.abierto)
  }
  f_parametro_actualizar(cual:string) {
    let valor=1;
    const m=this.Funcion.buscar_por_id(this.G.menu_item,cual,'opcion_id');
    if (m!==null) valor=m.parametro_actualizar;
    return valor;
  }
  async f_logout() {
    if (this.G.login_valores_guardados) {
      let respuesta=await this.Funcion.ConfirmarComponente(new FConfirmar('Borra los datos de usuario guardado?'),this.vcrConfirmador);
      if (respuesta.respuesta>0) {
        localStorage.setItem('kst_cookie_or',JSON.stringify(null));
      }
    }
    let respuesta_post=await this.Funcion.f_http_post('','login.php','logout',{sesion:this.G.login_sesion,validador:''});
    if (!respuesta_post.con_error) {
      this.G.GLoginOk=-1;
      this.cargarLogin();
    }
  }
  f_opciones_abiertas() {
    const abiertas=[];
    for (let a=0;a<this.G.menu_item.length;a++) {
      if (this.G.menu_item[a].abierto) abiertas.push(this.G.menu_item[a]);
    }
    return abiertas;
  }
  f_alto_div_sin_nada() {
    let altura=(this.menu.length*40);
    if (this.f_opciones_abiertas().length>1) altura+=40;
    altura=this.G.alto-altura;
    return altura;
  }
  f_click_menu(tipo:number,item:any=null) {
    this.f_limpiar_tildados_menu1();
    if (this.MenuViendoTipo===tipo && (this.MenuViendoTipo>1 || this.MenuViendoTipo_item===item)) {
      this.MenuViendoTipo=0;
      this.f_ocultar_menu();
    } else {
      this.ViendoSubmenu2=false;
      this.MostrandoMenu=true;
      this.MenuViendoTipo=tipo;
      this.MenuViendoTipo_item=item;
      this.Submenu1=[];
      let vtop=42;
      if (tipo===1) {
        item.tildado=true;
        this.Submenu1=item.submenu1;
        for (let a=0;a<this.Submenu1.length;a++) { this.Submenu1[a].posicion=a; this.Submenu1[a].tildado=false; }
        vtop+=item.posicion*40;
        this.submenu1_top_triangulo=42+(item.posicion*40);
        this.submenu1_alto=item.submenu1.length*40;
      } else if (tipo===3) {
        for (let e of this.f_opciones_abiertas()) { this.Submenu1.push({opcion_id:e.opcion_id,nombre:e.nombre,tildado:false}); }
        vtop+=this.menu.length*40;
        this.submenu1_top_triangulo=42+(this.menu.length*40);
        this.submenu1_alto=this.Submenu1.length*40;
      }
      this.submenu1_alto+=2;
      if (vtop+this.submenu1_alto>this.G.alto) {
        vtop-=(vtop+this.submenu1_alto-this.G.alto);
      }
      this.submenu1_top=vtop;
    }
  }
  f_limpiar_tildados_menu1() {
    for (let m of this.menu) { m.tildado=false; }
  }
  f_click_submenu(cual:any) {
    if (this.MenuViendoTipo===1 && cual['submenu2'].length>0) {
      if (this.MenuViendoSubmenuitem===cual) {
        cual.tildado=false;
        this.ViendoSubmenu2=false;
        this.MenuViendoSubmenuitem=null;
      } else {
        for (let s1 of this.Submenu1) { s1.tildado=false; }
        cual.tildado=true;
        this.MenuViendoSubmenuitem=cual;
        this.ViendoSubmenu2=true;
        this.Submenu2=cual['submenu2'];
        let vtop=this.submenu1_top+(cual.posicion*40);
        this.submenu2_alto=this.Submenu2.length*40;
        this.submenu2_alto+=2;
        this.submenu2_top_triangulo=this.submenu1_top+(cual.posicion*40);
        if (vtop+this.submenu2_alto>this.G.alto) {
          vtop-=(vtop+this.submenu2_alto-this.G.alto);
        }
        this.submenu2_top=vtop;

      }
    } else {
      this.f_click_opcion(cual);
    }
  }
  f_click_opcion(cual:any) {
    this.f_ocultar_menu();
    if (this.MenuViendoTipo===3) {
      this.MenuViendoTipo=0;
      this.G.menu_item_seleccionado=cual.opcion_id;
    } else {
      this.MenuViendoTipo=0;
      this.f_menu_item(cual.opcion_id);
    }
  }
  f_intercambiar_opciones_abiertas() {
    for (let o of this.G.menu_item) {
      if (o.abierto && o.opcion_id!==this.G.menu_item_seleccionado) {
        this.G.menu_item_seleccionado=o.opcion_id;
        this.f_ocultar_menu();
        break;
      }
    }
  }
  f_ocultar_menu() {
    for (let m of this.Submenu1) { m.tildado=false; }
    this.ViendoSubmenu2=false;
    this.MenuViendoSubmenuitem=null;
    this.MenuViendoTipo_item=null;
    this.f_limpiar_tildados_menu1();
    this.MostrandoMenu=false;
  }


}
