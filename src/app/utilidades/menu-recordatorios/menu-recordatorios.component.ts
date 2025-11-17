import { Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import { Globals,FConfirmar } from '../../globales';
import { FuncionesService } from '../../funciones.service';
import { ComponentesModule } from "../../componentes/componentes.module";
import { NgIf,NgClass,NgFor } from '@angular/common';

@Component({
  selector: 'app-menu-recordatorios',
  templateUrl: './menu-recordatorios.component.html',
  styleUrls: ['../../app.component.scss','../../app.estilosgenerales.scss','../../bootstrap.css'],imports: [NgIf,NgFor,NgClass,ComponentesModule]
})
export class MenuRecordatoriosComponent implements OnInit {
  @ViewChild('contenedorConfirmacion', { read: ViewContainerRef }) vcrConfirmador!: ViewContainerRef;
  estemenu='recordatorios';
  recordatorios:any=null;
  pantalla=0;
  modificando_grupo_id=0;
  modificando_nombre='';
  items:any[]=[];
  modificando_item_id=0;
  viendo_grupo:any=null;
  compartiendo_grupo=0;
  compartiendo_item=0;
  compartiendo_grupo_nombre='';
  compartiendo_item_nombre='';
  compartidos:any[]=[];
  viendo_item:any=null;
  subitems:any[]=[];
  modificando_subitem_id=0;
  modificando_valor='';

  G: Globals;
  constructor(
    variables: Globals
    , public Funcion: FuncionesService
    ) {
    this.G=variables;
  }

  ngOnInit() {
      setTimeout (() => this.inicializar(), 0);
  }
  async inicializar() {
    let respuesta_post=await this.Funcion.f_http_post(this.estemenu,'recordatorios.php','inicial',{});
    if (!respuesta_post.con_error) {
      let data=respuesta_post.data;
      this.recordatorios=data['recordatorios'];
      this.modificando_grupo_id=0;
      this.pantalla=0;
    }
  }
  async grupo_modificar() {
    let respuesta=await this.Funcion.ConfirmarComponente(new FConfirmar('Confirma los datos del grupo?'),this.vcrConfirmador);
    if (respuesta.respuesta===1) {
      let respuesta_post=await this.Funcion.f_http_post(this.estemenu,'recordatorios.php','grupo',{grupo_id:this.modificando_grupo_id,grupo_nombre:this.modificando_nombre});
      if (!respuesta_post.con_error) {
        let data=respuesta_post.data;
        if (this.modificando_grupo_id>0) {
          let a: number;
          for (a=0;a<this.recordatorios.length;a++) {
            if (this.recordatorios[a].id===this.modificando_grupo_id) {
              this.recordatorios[a].nombre=this.modificando_nombre;
            }
          }
          this.modificando_grupo_id=0;
        } else {
          this.modificando_grupo_id=0;
          this.inicializar();
        }
      }
    }
  }
  async grupo_eliminar(item:any) {
    let respuesta=await this.Funcion.ConfirmarComponente(new FConfirmar('Elimina el grupo?'),this.vcrConfirmador);
    if (respuesta.respuesta===1) {
      let respuesta_post=await this.Funcion.f_http_post(this.estemenu,'recordatorios.php','grupo_eliminar',{grupo_id:item.id});
      if (!respuesta_post.con_error) {
        let data=respuesta_post.data;
        let a: number;
        for (a=0;a<this.recordatorios.length;a++) {
          if (this.recordatorios[a].id===item.id) {
            this.recordatorios.splice(a, 1);
          }
        }
      }
    }
  }
  async grupo_compartir(pgrupo:any,pgrupo_nombre:string,pitem:any,pitem_nombre:string) {
    this.compartiendo_grupo=pgrupo;
    this.compartiendo_item=pitem;
    this.compartiendo_grupo_nombre=pgrupo_nombre;
    this.compartiendo_item_nombre=pitem_nombre;
    let respuesta_post=await this.Funcion.f_http_post(this.estemenu,'recordatorios.php','compartidos',{grupo:pgrupo,item:pitem});
    if (!respuesta_post.con_error) {
      let data=respuesta_post.data;
      this.compartidos=data['recordatorios_compartidos'];
      this.pantalla=1;
    }
  }
  async compartir() {
    let respuesta=await this.Funcion.ConfirmarComponente(new FConfirmar('Confirma los cambios en lo compartido?'),this.vcrConfirmador);
    if (respuesta.respuesta===1) {
      let respuesta_post=await this.Funcion.f_http_post(this.estemenu,'recordatorios.php','compartir',{grupo:this.compartiendo_grupo,
        item:this.compartiendo_item,
        usuarios:JSON.stringify(this.compartidos)});
      if (!respuesta_post.con_error) {
        if (this.compartiendo_item>0) {
          this.pantalla=2;
        } else {
          this.pantalla=0;
        }
      }
    }
  }
  async items_actualizar(item:any) {
    let respuesta_post=await this.Funcion.f_http_post(this.estemenu,'recordatorios.php','items',{grupo:item.id,es_duenio:item.duenioitems});
    if (!respuesta_post.con_error) {
      let data=respuesta_post.data;
      this.items=data['recordatorios_items'];
      this.modificando_item_id=0;
      this.pantalla=2;
      this.viendo_grupo=item;
    }
  }
  async item_modificar() {
    let respuesta=await this.Funcion.ConfirmarComponente(new FConfirmar('Confirma los datos del Item?'),this.vcrConfirmador);
    if (respuesta.respuesta===1) {
      let respuesta_post=await this.Funcion.f_http_post(this.estemenu,'recordatorios.php','items_am',{grupo:this.viendo_grupo.id,
        id:this.modificando_item_id,
        nombre:this.modificando_nombre});
      if (!respuesta_post.con_error) {
        let data=respuesta_post.data;
        if (this.modificando_item_id>0) {
          let a: number;
          for (a=0;a<this.items.length;a++) {
            if (this.items[a].id===this.modificando_item_id) {
              this.items[a].nombre=this.modificando_nombre;
            }
          }
          this.modificando_item_id=0;
        } else {
          this.modificando_item_id=0;
          this.items_actualizar(this.viendo_grupo);
        }
        this.pantalla=2;
      }
    }
  }
  async item_eliminar(item:any) {
    let respuesta=await this.Funcion.ConfirmarComponente(new FConfirmar('Elimina el Item?'),this.vcrConfirmador);
    if (respuesta.respuesta===1) {
      let respuesta_post=await this.Funcion.f_http_post(this.estemenu,'recordatorios.php','items_eliminar',{id:item.id});
      if (!respuesta_post.con_error) {
        let data=respuesta_post.data;
        let a: number;
        for (a=0;a<this.items.length;a++) {
          if (this.items[a].id===item.id) {
            this.items.splice(a, 1);
          }
        }
      }
    }
  }
  async subitems_actualizar(item:any) {
    let respuesta_post=await this.Funcion.f_http_post(this.estemenu,'recordatorios.php','subitems',{id:item.id});
    if (!respuesta_post.con_error) {
      let data=respuesta_post.data;
      this.subitems=data['subitems'];
      this.modificando_subitem_id=0;
      this.pantalla=3;
      this.viendo_item=item;
    }
  }
  async subitem_modificar() {
    let respuesta=await this.Funcion.ConfirmarComponente(new FConfirmar('Confirma los datos del SubItem?'),this.vcrConfirmador);
    if (respuesta.respuesta===1) {
      let respuesta_post=await this.Funcion.f_http_post(this.estemenu,'recordatorios.php','subitems_am',{item:this.viendo_item.id,
        id:this.modificando_subitem_id,
        nombre:this.modificando_nombre,
        valor:this.modificando_valor});
      if (!respuesta_post.con_error) {
        let data=respuesta_post.data;
        if (this.modificando_subitem_id>0) {
          let a: number;
          for (a=0;a<this.subitems.length;a++) {
            if (this.subitems[a].id===this.modificando_subitem_id) {
              this.subitems[a].nombre=this.modificando_nombre;
              this.subitems[a].valor=this.modificando_valor;
            }
          }
          this.modificando_subitem_id=0;
          this.pantalla=3;
        } else {
          this.modificando_subitem_id=0;
          this.subitems_actualizar(this.viendo_item);
        }
      }
    }
  }
  async subitem_eliminar(item:any) {
    let respuesta=await this.Funcion.ConfirmarComponente(new FConfirmar('Elimina el SubItem?'),this.vcrConfirmador);
    if (respuesta.respuesta===1) {
      let respuesta_post=await this.Funcion.f_http_post(this.estemenu,'recordatorios.php','subitems_eliminar',{id:item.id});
      if (!respuesta_post.con_error) {
        let data=respuesta_post.data;
        let a: number;
        for (a=0;a<this.subitems.length;a++) {
          if (this.subitems[a].id===item.id) {
            this.subitems.splice(a, 1);
          }
        }
      }
    }
  }
}
