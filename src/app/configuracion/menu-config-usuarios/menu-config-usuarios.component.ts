import { Component, OnInit, Input,ViewChild, ViewContainerRef } from '@angular/core';
import { Globals,Permiso,Permitido,FConfirmar } from '../../globales';
import { FuncionesService } from '../../funciones.service';import { ComponentesModule } from "../../componentes/componentes.module";import { NgIf,NgClass,NgFor } from '@angular/common';

class PermisosUsuario {
  usuario=0;
  nombre='';
  permisos:any[]=[];
  constructor(usuario:number,nombre:string,permisos:any,permitidos:any) {
    this.usuario=usuario;
    this.nombre=nombre;
    let permiso:Permiso;
    for (permiso of permisos) {
      let permitido=false;
      let permitido_id=0;
      let ok:Permitido;
      for (ok of permitidos) {
        if (ok.usuario===usuario && ok.permiso===permiso.permiso) {
          permitido=true;
          permitido_id=ok.id;
        }
      }
      this.permisos.push(new Permiso(permitido_id,permiso.permiso,permiso.permiso_nombre,permitido,permiso.menus,permiso.restringido,permitido));
    }
  }
}

class Usuario {
  id=0;
  cuil=0;
  nombre='';
  mail='';
  tildado=false;
  tipo=0;
  orden='';
  constructor(id:number,cuil:number,nombre:string,mail:string,tildado=false) {
    this.id=id;
    this.cuil=cuil;
    this.nombre=nombre;
    this.mail=mail;
    this.tildado=tildado;
  }
}

@Component({
  selector: 'app-menu-config-usuarios',
  templateUrl: './menu-config-usuarios.component.html',
  styleUrls: ['../../app.component.scss','../../app.estilosgenerales.scss','../../bootstrap.css'],imports: [NgIf,NgFor,NgClass,ComponentesModule]
})

export class MenuConfigUsuariosComponent implements OnInit {
  @ViewChild('contenedorConfirmacion', { read: ViewContainerRef }) vcrConfirmador!: ViewContainerRef;
  @Input() parametro_actualizar: number=0;
  estemenu='config_usuarios';
  pantalla='';
  usuarios:any[]=[];
  usuarios_todos:any[]=[];
  permitidos:any[]=[];
  permisos:any[]=[];
  usuarios_permitiendo:any[]=[];
  permisos_visibles:any[]=[];
  usuario={id:0,cuil:0,nombre:'',mostrar_nombre:false};

  opciones:any[]=[];
  opcion:any=null;

  G: Globals;
  constructor(variables: Globals
    , public Funcion: FuncionesService
    ) {
    this.G=variables;
  }

  ngOnInit() {
    setTimeout (() => this.actualizar(), 0);
  }
  async actualizar() {
    this.opciones=[];
    this.opciones.push({id:'',nombre:''});
    for (let m of this.G.menus) {
      for (let sm1 of m.submenu1) {
        if (sm1.opcion!=='') {
          this.opciones.push({id:sm1.opcion,nombre:sm1.nombre});
        } else {
          for (let sm2 of sm1.submenu2) {
            this.opciones.push({id:sm2.opcion,nombre:sm2.nombre});
          }
        }
      }
    }
    this.opcion=this.opciones[0];
		let respuesta_post=await this.Funcion.f_http_post(this.estemenu,'usuarios.php','inicial',{});
    if (!respuesta_post.con_error) {
      let data=respuesta_post.data;
      this.usuarios=[];
      let usr:Usuario;
      for (usr of data['usuarios']) {
        usr.orden=usr.nombre;
        this.usuarios.push(usr);
      }
      this.Funcion.f_ordenar(this.usuarios,'orden');
      this.usuarios_todos=data['usuarios_todos'];
      this.pantalla='listado_usuarios';
    }
  }
	chequear_usuario() {setTimeout (() => this.chequear_usuario_ok(), 10);}
  chequear_usuario_ok() {
    //verifico que esté dentro de los números de un cuit/cuil y luego valido
    if (this.usuario.cuil<20000000000 || this.usuario.cuil>39999999999 || !this.Funcion.validarCuit(this.usuario.cuil)) {
      this.usuario.mostrar_nombre=false;
      this.Funcion.Alerta('Error en CUIT/CUIL',1);
    } else if (this.Funcion.buscar_por_id(this.usuarios,this.usuario.cuil,'cuil')!==null) {
      this.usuario.mostrar_nombre=false;
      this.Funcion.Alerta('El usuario ya existe',1);
    } else {
      let usr=this.Funcion.buscar_por_id(this.usuarios_todos,this.usuario.cuil,'cuil');
      if (usr===null) {
        this.usuario.mostrar_nombre=false;
        this.Funcion.Alerta('El usuario NO existe',1);
      } else {
        this.usuario.nombre=usr.nombre;
        this.usuario.id=usr.id;
        this.usuario.mostrar_nombre=true;
      }
    }
  }
	async nuevo() {
    if (!this.Funcion.validarCuit(this.usuario.cuil)) { this.Funcion.Alerta('Error de Cuit',1); return; }
    let respuesta=await this.Funcion.ConfirmarComponente(new FConfirmar('Confirma los datos del Usuario?'),this.vcrConfirmador);
    if (respuesta.respuesta===1) {
      let respuesta_post=await this.Funcion.f_http_post(this.estemenu,'usuarios.php','agregar',{id:this.usuario.id});
      if (!respuesta_post.con_error) this.actualizar();
    }
	}
	async eliminar(usuario:any) {
    let respuesta=await this.Funcion.ConfirmarComponente(new FConfirmar('Elimina a '+usuario.nombre+'?'),this.vcrConfirmador);
    if (respuesta.respuesta===1) {
      let respuesta_post=await this.Funcion.f_http_post(this.estemenu,'usuarios.php','eliminar',{id:usuario.id});
      if (!respuesta_post.con_error) this.actualizar();
    }
	}
	async f_permisos() {
    const permisos_posibles:Permiso[]=[];
    let permisos_restringidos='';
    for (let p of this.G.permisos) {
      permisos_posibles.push(p);
    }
    this.usuarios_permitiendo=[];
    let vin='';
    let usuario:Usuario;
    let lista=this.usuarios;
    for (usuario of lista) {
      if (usuario.tildado) {
        if (vin!=='') vin+=',';
        vin+=usuario.id;
        this.usuarios_permitiendo.push(usuario);
      }
    }
    if (vin!=='') {
      let respuesta_post=await this.Funcion.f_http_post(this.estemenu,'usuarios.php','permisos',{usuarios_in:vin,eliminar_in:permisos_restringidos});
      if (!respuesta_post.con_error) {
        let data=respuesta_post.data;
        this.permitidos=[];
        for (usuario of this.usuarios_permitiendo) {
          this.permitidos.push(new PermisosUsuario(usuario.id,usuario.nombre,permisos_posibles,data['permitidos']));
        }
        this.permisos=[];
        let permiso:Permiso;
        for (permiso of permisos_posibles) { 
          if (this.G.login_usuario===1) this.permisos.push(new Permiso(permiso.permitido_id,permiso.permiso,permiso.permiso_nombre,false,permiso.menus,permiso.restringido,false));
        }
        this.f_actualizar_permisos_visibles();
        this.pantalla='asignando_permisos';
      }
    }
	}
  f_actualizar_permisos_visibles() {
    this.permisos_visibles=[];
    let permiso:Permiso;
    for (permiso of this.permisos) {
      this.permisos_visibles.push(permiso);
    }
  }
	async confirmar_permitidos() {
    let respuesta=await this.Funcion.ConfirmarComponente(new FConfirmar('Confirma los permisos?'),this.vcrConfirmador);
    if (respuesta.respuesta===1) {
      let respuesta_post=await this.Funcion.f_http_post(this.estemenu,'usuarios.php','permisos_guardar',{permitidos:JSON.stringify(this.permitidos)});
      if (!respuesta_post.con_error) {
        for (let u of this.usuarios) { u.tildado=false; }
        this.pantalla='listado_usuarios';
      }
    }
	}
  f_cancelar_permisos() {for (let u of this.usuarios) { u.tildado=false; } this.pantalla='listado_usuarios'; }
  f_mostrar_permitido(vpermiso:string,vusuario:number) {
    let respuesta=0;
    let permisos_usuario:PermisosUsuario;
    for (permisos_usuario of this.permitidos) {
      if (permisos_usuario.usuario===vusuario) {
        let permiso:Permiso;
        for (permiso of permisos_usuario.permisos) {
          if (permiso.permiso===vpermiso) {
            if (permiso.permitido && !permiso.nuevo_permitido) {
              respuesta=-1;
            } else if (permiso.permitido && permiso.nuevo_permitido) {
              respuesta=1;
            } else if (!permiso.permitido && permiso.nuevo_permitido) {
              respuesta=2;
            }
          }
        }
      }
    }
    return respuesta;
  }
  f_tildar(vpermiso:string,vusuario:number) {
    let permisos_usuario:PermisosUsuario;
    for (permisos_usuario of this.permitidos) {
      if (permisos_usuario.usuario===vusuario) {
        let permiso:Permiso;
        for (permiso of permisos_usuario.permisos) {
          if (permiso.permiso===vpermiso) permiso.nuevo_permitido=!permiso.nuevo_permitido;
        }
      }
    }
  }
	chequear_todos(vusuario:number) {
    const permisos_usuario:PermisosUsuario=this.Funcion.buscar_por_id(this.permitidos,vusuario,'usuario');
    let todos_chequeados=true;
		for (let permiso of permisos_usuario.permisos) {
      if (!permiso.nuevo_permitido) {
        todos_chequeados=false;
        break;
      }
		}
    for (let permiso of permisos_usuario.permisos) {
        if (todos_chequeados) {
          permiso.nuevo_permitido=permiso.permitido;
        } else {
          permiso.nuevo_permitido=true;
        }
		}
	}
  async f_migrar() {
		let respuesta_post=await this.Funcion.f_http_post(this.estemenu,'usuarios.php','migrar',{});
    if (!respuesta_post.con_error)  {
      this.actualizar();
    }
  }
  f_usuarios_tildados() {
    let cant=0;
    for (let usuario of this.usuarios) {if (usuario.tildado) cant++;}
    return cant;
  }
  f_tildar_usuarios() {
    let tildar=!(this.f_usuarios_tildados()===this.usuarios.length);
    for (let usuario of this.usuarios) { usuario.tildado=tildar; }
  }
  f_destildar_todo() {
    for (let usuario of this.usuarios) { usuario.tildado=false; }
  }
  async f_copiar_permisos() {
    let parametros=new FConfirmar('Seleccione el Usuario');
    parametros.componentes.push({tipo:'select-especial',datos:this.usuarios,dato:this.usuarios[0],ancho_px:450,buscable:true});
    parametros.ancho=450;
    let respuesta=await this.Funcion.ConfirmarComponente(parametros,this.vcrConfirmador);
    if (respuesta.respuesta===1 && respuesta.valores[0]!==null) {
      this.pantalla='';
      let respuesta_post=await this.Funcion.f_http_post(this.estemenu,'usuarios.php','traer_permisos_usuario',{usuario:respuesta.valores[0].id});
      if (!respuesta_post.con_error) {
        let data=respuesta_post.data;
        for (let permiso_copiar of data['permitidos']) {
          let permisos_usuario:PermisosUsuario;
          for (permisos_usuario of this.permitidos) {
            for (let permiso of permisos_usuario.permisos) {
              if (permiso.permiso===permiso_copiar) permiso.nuevo_permitido=true;
            }
          }
        }
      }
    }
  }
}
