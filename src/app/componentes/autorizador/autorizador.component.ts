import { Component,Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Globals,Autorizando } from '../../globales';
import { FuncionesService } from '../../funciones.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-autorizador',
  standalone: false,
  templateUrl: './autorizador.component.html',
  styleUrls: ['./autorizador.component.scss']
})
export class AutorizadorComponent implements OnInit {
  @Input() estemenu='';
  @Input() Autorizando!:Autorizando;
  @Output() Autorizado = new EventEmitter<number>();
  @Output() Cancelado = new EventEmitter<any>();
  autoriza_id=0;

  G: Globals;
  constructor(private http: HttpClient
    ,variables: Globals
    , public Funcion: FuncionesService
    ) {
    this.G=variables;
  }

  SuscripcionConfirmador!: Subscription;

  ngOnInit(): void {
    interface Respuesta {
      valores_retorno: any;
      id: number;
    }
    this.Funcion.show_loading(1,this.estemenu);
    this.http.post<Respuesta>(this.G.URL+'autorizaciones.php', {
      accion:'generar_autorizacion',
      tipo:this.Autorizando.tipo,
      texto:this.Autorizando.texto,
      persona:this.Autorizando.persona,
      importe:this.Autorizando.importe,
      aclaraciones:this.Autorizando.aclaraciones,
      parametros_acceso: this.G.parametros_acceso}).subscribe(
      data => {
        this.Funcion.show_loading(0,this.estemenu);
        this.Funcion.f_retorno_de_php(data['valores_retorno']);
        this.autoriza_id=data['id'];
        setTimeout (() => this.f_verificar_si_autorizaron(), 1000);
      },(error: any) => { this.Funcion.f_error_php(this.estemenu,error); }
    );
  }

  f_verificar_si_autorizaron() {
    interface Respuesta {
      valores_retorno: any;
      autorizado: number;
    }
    this.http.post<Respuesta>(this.G.URL+'autorizaciones.php', {
      accion:'verificar_si_autorizaron',
      id:this.autoriza_id,
      parametros_acceso: this.G.parametros_acceso}).subscribe(
      data => {
        this.Funcion.f_retorno_de_php(data['valores_retorno']);
        if (data['autorizado']>0) {
          this.Funcion.Alerta(this.Autorizando.texto+' - Autorizado por '+this.Funcion.f_usuario(data['autorizado']));
          this.Autorizado.emit(data['autorizado']);
        } else if (data['autorizado']<0) {
          this.Funcion.Alerta('Autorización Rechazada por '+this.Funcion.f_usuario(data['autorizado']*-1),1);
          this.Cancelado.emit();
        } else {
          setTimeout (() => this.f_verificar_si_autorizaron(), 1000);
        }
      },(error: any) => { this.Funcion.f_error_php(this.estemenu,error); }
    );
  }
  f_cancelar_autorizacion() {
    interface Respuesta {
      valores_retorno: any;
    }
    this.http.post<Respuesta>(this.G.URL+'autorizaciones.php', {
      accion:'autorizar_cancelar',
      id:this.autoriza_id,
      parametros_acceso: this.G.parametros_acceso}).subscribe(
      data => {
        this.Funcion.f_retorno_de_php(data['valores_retorno']);
        this.Cancelado.emit();
      },(error: any) => { this.Funcion.f_error_php(this.estemenu,error); }
    );
  }

}
