import { Component, OnInit, Input, Output,EventEmitter,ViewChild, ViewContainerRef } from '@angular/core';
import { Globals,FConfirmar,ConfirmarTabla,ConfirmadorRespuesta,ConfirmarTablaCabecera } from '../../globales';
import { FuncionesService } from '../../funciones.service';
import { ComponentesModule } from "../../componentes/componentes.module";

@Component({
  selector: 'app-muestra-logs',
  templateUrl: './muestra-logs.component.html',
  styleUrls: ['../../app.component.scss','../../app.estilosgenerales.scss','../../bootstrap.css'],imports: [ComponentesModule]
})
export class MuestraLogsComponent implements OnInit {
  @ViewChild('contenedorConfirmacion', { read: ViewContainerRef }) vcrConfirmador!: ViewContainerRef;
  @Input() estemenu='';
  @Input() datos:any[]=[];
  @Input() EsImagen=true;
  @Input() Titulo='Logs';
  @Input() AlinearDerecha=false;
  @Input() AlinearIzquierda=false;
  @Input() Negrita=false;
  @Input() LetraGrande=false;
  @Output() regresar = new EventEmitter<any>();

  G: Globals;
  constructor(variables: Globals
    , public Funcion: FuncionesService
    ) {
    this.G=variables;
  }

  ngOnInit() {
    this.f_mostrar_logs();
  }
  async f_mostrar_logs() {
    const listado=[];
    let parametros=new FConfirmar('Movimientos');
		const tabla=new ConfirmarTabla(true);
    for (let dato of this.datos) {
      listado.push({
        fecha:this.Funcion.mysqldatetime_a_php(dato.fecha,false)
        ,usuario:this.Funcion.f_usuario(dato.usuario)
        ,texto:dato.texto
      });
    }
    parametros.respuestas=[];
    parametros.respuestas.push(new ConfirmadorRespuesta(1,'Aceptar',1));
		tabla.cabeceras.push(new ConfirmarTablaCabecera('Fecha','fecha',false,true,false,null,null,null,120));
		tabla.cabeceras.push(new ConfirmarTablaCabecera('Usuario','usuario',false));
		tabla.cabeceras.push(new ConfirmarTablaCabecera('Texto','texto',false));
		parametros.componentes.push({tipo:'tabla',datos:tabla});
		parametros.ancho=600;
		await this.Funcion.ConfirmarComponente(parametros,this.vcrConfirmador);
  }
}
