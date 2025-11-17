import {
  Component, Input, Output, EventEmitter, ViewChild, ElementRef,
  forwardRef, OnChanges, SimpleChanges
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, AbstractControl,
  ControlValueAccessor, Validators
} from '@angular/forms';
import * as _ from 'lodash';
import { FuncionesService } from '../../funciones.service';

class CalendarioDia {
  fecha:Date;
  dia:number;
  hoy=false;
  actual=false;
  otro_mes=false;
  constructor(fecha:Date,dia=0,hoy=false,actual=false,otro_mes=false) {
    this.fecha=fecha;
    this.dia=dia;
    this.hoy=hoy;
    this.actual=actual;
    this.otro_mes=otro_mes;
  }
}

@Component({
  selector: 'app-fecha',
  standalone: false,
  templateUrl: './fecha.component.html',
  styleUrls: ['../inputs.scss'],
  providers: [
    {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => FechaComponent),
        multi: true
    },
    {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => FechaComponent),
        multi: true
    }
  ]
})
export class FechaComponent implements ControlValueAccessor, OnChanges {
  public calendario_dias:CalendarioDia[][]=[];
  public calendario_viendo_mes=1;
  public calendario_viendo_anio=2020;
  public ancho=110;
  public altoprincipal=30;
  public anchocaja=120;
  public ancho_div=100;
  public valor_dia = '';
  public valor_mes = '';
  public valor_anio = '';
  public valor_hora = '';
  public valor_minutos = '';
  public valor_segundos = '';
  public ErrorTexto = '';
  public foco_dia = false;
  public foco_mes = false;
  public foco_anio = false;
  public foco_hora = false;
  public foco_minutos = false;
  public foco_segundos = false;
  public fecha_solo_lectura = '';
  public viendo_calendario = false;
  public ConError = false;
  public MESES=[{id:1,nombre:'Enero'},{id:2,nombre:'Febrero'},{id:3,nombre:'Marzo'},{id:4,nombre:'Abril'},{id:5,nombre:'Mayo'},{id:6,nombre:'Junio'},{id:7,nombre:'Julio'},{id:8,nombre:'Agosto'},{id:9,nombre:'Septiembre'},{id:10,nombre:'Octubre'},{id:11,nombre:'Noviembre'},{id:12,nombre:'Diciembre'}];
  @ViewChild('dia') dia: ElementRef;
  @ViewChild('mes') mes: ElementRef;
  @ViewChild('anio') anio: ElementRef;
  @ViewChild('hora') hora: ElementRef;
  @ViewChild('minutos') minutos: ElementRef;
  @ViewChild('segundos') segundos: ElementRef;
  @Input() inputModel: Date;
  @Input() placeholder: string;
  @Input() alto = 30;
  @Input() titulo = '';
  @Input() MostrarErrores = false;
  @Input() Mensaje = '';
  @Input() posicion_derecha = false;
  @Input() CajaEstilo = 1; /* 0=normal, 1=borde redondeado, 2=fondo gris gris */
  @Input() disabled = false;
  @Input() modificable = true;
  @Input() anio_minimo = 1900;
  @Input() anio_maximo = 2100;
  @Input() con_horario = 0;/* 0=solo fecha, 1=hora y minutos, 2=hora, minutos y segundos */
  @Input() AlinearDerecha=false;
  @Input() AlinearIzquierda=false;
  @Input() autocorrector=false;
  @Input() MostrarErrorMinimoMaximo=false;
  @Input() MostrarErrorMinimoMaximo_titulo='';
  @Input() MostrarMensajedeError = false;
  @Input() MensajedeErrorTiempo = 3000;
  @Input() MensajedeErrorMinimo = 'El valor mínimo es ';
  @Input() MensajedeErrorMaximo = 'El valor máximo es ';
  @Input() ConFechaMinima=false;
  @Input() FechaMinimaMysql='';
  @Input() ConFechaMaxima=false;
  @Input() FechaMaximaMysql='';
  @Input() FechaMaximaDiasDesdeFecha=0;
  @Input() FechaMaximaDesdeFecha=new Date();
  @Output() inputModelChange = new EventEmitter<Date>();

  constructor(public Funcion: FuncionesService) { }

  f_click(cual:number) {
    if (this.modificable && cual===1) {
      this.dia.nativeElement.select();
      setTimeout(() =>this.dia.nativeElement.focus() );
    }
    if (this.modificable && cual===2) {
      this.mes.nativeElement.select();
      setTimeout(() =>this.mes.nativeElement.focus() );
    }
    if (this.modificable && cual===3) {
      this.anio.nativeElement.select();
      setTimeout(() =>this.anio.nativeElement.focus() );
    }
    if (this.modificable && cual===4) {
      this.hora.nativeElement.select();
      setTimeout(() =>this.hora.nativeElement.focus() );
    }
    if (this.modificable && cual===5) {
      this.minutos.nativeElement.select();
      setTimeout(() =>this.minutos.nativeElement.focus() );
    }
    if (this.modificable && cual===6) {
      this.segundos.nativeElement.select();
      setTimeout(() =>this.segundos.nativeElement.focus() );
    }
  }
  enfocartext() {
  }

  tecla_en_dia(event: KeyboardEvent) {
    const tecla=event.which;
    const vf=this.Funcion.fecha_a_mysql(this.inputModel);
    let vdia=parseInt(vf.substring(8,10),10);
    if (vdia===null || vdia===undefined) { vdia=this.Funcion.fecha_hoy().getDate(); }
    if (tecla===38) {
      vdia++;
      this.valor_dia=vdia.toString();
      this.f_armar_la_fecha();
    }
    if (tecla===40 && vdia>1) {
      vdia--;
      this.valor_dia=vdia.toString();
      this.f_armar_la_fecha();
    }
  }

  tecla_en_mes(event: KeyboardEvent) {
    const tecla=event.which;
    const vf=this.Funcion.fecha_a_mysql(this.inputModel);
    let vmes=parseInt(vf.substring(5,7),10);
    if (vmes===null || vmes===undefined) { vmes=this.Funcion.mes_hoy();}
    if (tecla===38 && vmes<12) {
      vmes++;
      this.valor_mes=vmes.toString();
      this.f_armar_la_fecha();
    }
    if (tecla===40 && vmes>1) {
      vmes--;
      this.valor_mes=vmes.toString();
      this.f_armar_la_fecha();
    }
  }

  tecla_en_anio(event: KeyboardEvent) {
    const tecla=event.which;
    const vf=this.Funcion.fecha_a_mysql(this.inputModel);
    let vanio=parseInt(vf.substring(0,4),10);
    if (vanio===null || vanio===undefined) { vanio=this.Funcion.anio_hoy();}
    if (tecla===38) {
      vanio++;
      this.valor_anio=vanio.toString();
      this.f_armar_la_fecha();
    }
    if (tecla===40) {
      vanio--;
      this.valor_anio=vanio.toString();
      this.f_armar_la_fecha();
    }
  }

  tecla_en_hora(event: KeyboardEvent) {
    const tecla=event.which;
    const vf=this.Funcion.fecha_a_mysql(this.inputModel,true,true);
    let valor=parseInt(vf.substring(11,13),10);
    if (valor===null || valor===undefined) { valor=this.Funcion.fecha_hoy().getHours();}
    if (tecla===38 && valor<23) {
      valor++;
      this.valor_hora=valor.toString();
      this.f_armar_la_fecha();
    }
    if (tecla===40 && valor>1) {
      valor--;
      this.valor_hora=valor.toString();
      this.f_armar_la_fecha();
    }
  }

  tecla_en_minutos(event: KeyboardEvent) {
    const tecla=event.which;
    const vf=this.Funcion.fecha_a_mysql(this.inputModel,true,true);
    let valor=parseInt(vf.substring(14,16),10);
    if (valor===null || valor===undefined) { valor=this.Funcion.fecha_hoy().getMinutes();}
    if (tecla===38 && valor<59) {
      valor++;
      this.valor_minutos=valor.toString();
      this.f_armar_la_fecha();
    }
    if (tecla===40 && valor>1) {
      valor--;
      this.valor_minutos=valor.toString();
      this.f_armar_la_fecha();
    }
  }

  tecla_en_segundos(event: KeyboardEvent) {
    const tecla=event.which;
    const vf=this.Funcion.fecha_a_mysql(this.inputModel,true,true);
    let valor=parseInt(vf.substring(17,19),10);
    if (valor===null || valor===undefined) { valor=this.Funcion.fecha_hoy().getSeconds();}
    if (tecla===38 && valor<59) {
      valor++;
      this.valor_segundos=valor.toString();
      this.f_armar_la_fecha();
    }
    if (tecla===40 && valor>1) {
      valor--;
      this.valor_segundos=valor.toString();
      this.f_armar_la_fecha();
    }
  }

  writeValue(value: number) {}
  registerOnChange(fn: any) {}
  registerOnTouched(fn: any) {}
  ngOnChanges(changes: SimpleChanges) {
      if (this.alto===null) { this.alto = 30;}
      if (this.titulo===null) { this.titulo = '';}
      if (this.MostrarErrores===null) { this.MostrarErrores = false;}
      if (this.Mensaje===null) { this.Mensaje = '';}
      if (this.posicion_derecha===null) { this.posicion_derecha = false;}
      if (this.CajaEstilo===null) { this.CajaEstilo = 1;}
      if (this.disabled===null) { this.disabled = false;}
      if (this.modificable===null) { this.modificable = true;}
      if (this.anio_minimo===null) { this.anio_minimo = 1900;}
      if (this.anio_maximo===null) { this.anio_maximo = 2100;}
      if (this.con_horario===null) { this.con_horario=0;}

      if (!this.modificable) {
        this.ancho=80;
        this.fecha_solo_lectura=this.Funcion.fecha_a_txt(this.inputModel);
        if (this.con_horario===1) {
          this.ancho=120;
        } else if (this.con_horario===2) {
          this.ancho=150;
        }
      }else{
        if (this.con_horario===1) {
          this.ancho=150;
        } else if (this.con_horario===2) {
          this.ancho=180;
        }

      }
      this.ancho_div=this.ancho-5;
      this.anchocaja=this.ancho+10;
      this.altoprincipal=this.alto+10;
      this.actualizar_fecha(this.inputModel);
      if (this.MostrarErrores) {
        this.altoprincipal=this.alto+28;
      }
      if (this.ConFechaMaxima) {
        this.FechaMaximaMysql=this.Funcion.fecha_a_mysql(this.FechaMaximaDesdeFecha);
        if (this.FechaMaximaDiasDesdeFecha>0) this.FechaMaximaMysql=this.Funcion.fecha_desplazada_mysql(this.Funcion.fecha_a_mysql(this.FechaMaximaDesdeFecha),this.FechaMaximaDiasDesdeFecha);
      }
  }
  actualizar_fecha(que:Date) {
    const vf=this.Funcion.fecha_a_mysql(que,true,true);
    this.valor_dia=vf.substring(8,10);
    this.valor_mes=vf.substring(5,7);
    this.valor_anio=vf.substring(0,4);
    this.valor_hora=vf.substring(11,13);
    this.valor_minutos=vf.substring(14,16);
    this.valor_segundos=vf.substring(17,19);
  }

  enfocado_dia() {
    this.foco_dia=true;
    this.viendo_calendario=false;
  }
  dia_cambio() {
    if (parseInt(this.valor_dia, 10)>9 || (this.valor_dia.length>1 && parseInt(this.valor_dia, 10)>0)) {
      this.mes.nativeElement.select();
      this.mes.nativeElement.focus();
    }
  }
  sin_foco_dia() {
    this.foco_dia=false;
    this.f_ver_si_perdio_foco_antes_de_armar();
  }
  enfocado_mes() {
    this.foco_mes=true;
    this.viendo_calendario=false;
  }
  mes_cambio() {
    if (parseInt(this.valor_mes, 10)>9 || (this.valor_mes.length>1 && parseInt(this.valor_mes, 10)>0)) {
      this.anio.nativeElement.select();
      this.anio.nativeElement.focus();
    }
  }
  sin_foco_mes() {
    this.foco_mes=false;
    this.f_ver_si_perdio_foco_antes_de_armar();
  }
  enfocado_anio() {
    this.foco_anio=true;
    this.viendo_calendario=false;
  }
  anio_cambio() {
    if (this.con_horario>0){
      this.hora.nativeElement.select();
      this.hora.nativeElement.focus();
    }
  }
  sin_foco_anio() {
    if (this.valor_anio.length>1 && parseInt(this.valor_anio, 10)>0) {
      this.foco_anio=false;
    }
    this.f_ver_si_perdio_foco_antes_de_armar();
  }
  enfocado_hora() {
    this.foco_hora=true;
    this.viendo_calendario=false;
  }
  hora_cambio() {
    if (parseInt(this.valor_hora, 10)<0) this.valor_hora='00';
    if (parseInt(this.valor_hora, 10)>23) this.valor_hora='23';
    if (parseInt(this.valor_hora, 10)>9 || (this.valor_hora.length>1 && parseInt(this.valor_hora, 10)>0)) {
      this.minutos.nativeElement.select();
      this.minutos.nativeElement.focus();
    }
  }
  sin_foco_hora() {
    this.foco_hora=false;
    this.f_armar_la_fecha();
  }
  enfocado_minutos() {
    this.foco_minutos=true;
    this.viendo_calendario=false;
  }
  minutos_cambio() {
    if (parseInt(this.valor_minutos, 10)<0) this.valor_minutos='00';
    if (parseInt(this.valor_minutos, 10)>59) this.valor_minutos='59';
    if (parseInt(this.valor_minutos, 10)>9 || (this.valor_minutos.length>1 && parseInt(this.valor_minutos, 10)>0)) {
      if (this.con_horario>1){
        this.segundos.nativeElement.select();
        this.segundos.nativeElement.focus();
      }
    }
  }
  sin_foco_minutos() {
    this.foco_minutos=false;
    this.f_armar_la_fecha();
  }
  enfocado_segundos() {
    this.foco_segundos=true;
    this.viendo_calendario=false;
  }
  segundos_cambio() {
    if (parseInt(this.valor_segundos, 10)<0) this.valor_segundos='00';
    if (parseInt(this.valor_segundos, 10)>59) this.valor_segundos='59';
  }
  sin_foco_segundos() {
    this.foco_segundos=false;
    this.f_armar_la_fecha();
  }

  f_ver_si_perdio_foco_antes_de_armar() {
    setTimeout (() => this.f_ver_si_perdio_foco_antes_de_armar_paso2(), 10);
  }

  f_ver_si_perdio_foco_antes_de_armar_paso2() {
    if (this.foco_dia || this.foco_mes || this.foco_anio) {
      //mantiene el foco no lo arma
    } else {
      this.f_armar_la_fecha();
    }
  }

  f_armar_la_fecha() {
    if (isNaN(parseInt(this.valor_dia, 10))) { this.valor_dia='1'; }
    if (isNaN(parseInt(this.valor_mes, 10))) { this.valor_mes='1'; }
    if (isNaN(parseInt(this.valor_anio, 10))) { this.valor_anio='2020'; }
    if (isNaN(parseInt(this.valor_hora, 10))) { this.valor_hora='0'; }
    if (isNaN(parseInt(this.valor_minutos, 10))) { this.valor_minutos='0'; }
    if (isNaN(parseInt(this.valor_segundos, 10))) { this.valor_segundos='0'; }
    if (this.valor_dia==='') {
      this.valor_dia='1';
    }
    let vdia=parseInt(this.valor_dia, 10);
    if (vdia<1) {
      this.valor_dia='1';
    } else if (vdia>31) {
      this.valor_dia='31';
    }
    if (this.valor_mes==='') {
      this.valor_mes='1';
    }
    let vmes=parseInt(this.valor_mes, 10);
    if (vmes<1) {
      this.valor_mes='1';
    } else if (vmes>12) {
      this.valor_mes='12';
    }
    if (this.valor_anio==='') {
      if (this.anio_minimo<=this.Funcion.anio_hoy() && this.anio_maximo>=this.Funcion.anio_hoy()) {
        this.valor_anio=this.Funcion.anio_hoy().toString();
      } else {
        this.valor_anio=this.anio_minimo.toString();
      }
    }
    const vanio=parseInt(this.valor_anio, 10);
    if (vanio<this.anio_minimo) {
      this.valor_anio=this.anio_minimo.toString();
    } else if (vanio>this.anio_maximo) {
      this.valor_anio=this.anio_maximo.toString();
    }
      if (vdia===31 && (vmes===4 || vmes===6 || vmes===9 || vmes===11)) {
      vdia=30;
      this.valor_dia='30';
    } else if (vdia>28 && vmes===2) {
      if (vanio/4===this.Funcion.redondear(vanio/4,0)) {
        if (vanio/100===this.Funcion.redondear(vanio/100,0)) {
          vdia=28;
          this.valor_dia='28';
        } else {
          vdia=29;
          this.valor_dia='29';
        }
      } else {
        vdia=28;
        this.valor_dia='28';
      }
    }
    vmes--;
    this.inputModel=new Date(vanio,vmes,vdia,parseInt(this.valor_hora,10),parseInt(this.valor_minutos,10),parseInt(this.valor_segundos,10));
    if (this.ConFechaMinima && this.Funcion.fecha_a_mysql(this.inputModel)<this.FechaMinimaMysql) {
      if (this.autocorrector) this.inputModel=this.Funcion.mysql_a_formatofecha(this.FechaMinimaMysql);
      if (this.MostrarErrorMinimoMaximo) this.Funcion.Alerta('La fecha '+this.MostrarErrorMinimoMaximo_titulo+' no puede ser anterior a '+this.Funcion.mysql_a_php(this.FechaMinimaMysql),1);
      if (this.MostrarMensajedeError) this.Funcion.Mensaje(this.MensajedeErrorMinimo+this.Funcion.mysql_a_php(this.FechaMinimaMysql),4,true,this.MensajedeErrorTiempo);
    }
    if (this.ConFechaMaxima && this.Funcion.fecha_a_mysql(this.inputModel)>this.FechaMaximaMysql) {
      if (this.autocorrector) this.inputModel=this.Funcion.mysql_a_formatofecha(this.FechaMaximaMysql);
      if (this.MostrarErrorMinimoMaximo) this.Funcion.Alerta('La fecha '+this.MostrarErrorMinimoMaximo_titulo+' no puede ser posterior a '+this.Funcion.mysql_a_php(this.FechaMaximaMysql),1);
      if (this.MostrarMensajedeError) this.Funcion.Mensaje(this.MensajedeErrorMaximo+this.Funcion.mysql_a_php(this.FechaMaximaMysql),4,true,this.MensajedeErrorTiempo);
    }
    this.inputModelChange.emit(this.inputModel);
  }
  f_calendario() {
    if (this.viendo_calendario) {
      this.viendo_calendario=false;
    } else {
      const vf=this.Funcion.fecha_a_mysql(this.inputModel);
      this.armar_calendario(parseInt(vf.substring(5,7),10),parseInt(vf.substring(0,4),10));
      this.viendo_calendario=true;
    }
  }
  armar_calendario(pmes:number,panio:number) {
    this.calendario_viendo_mes=pmes;
    this.calendario_viendo_anio=panio;
    this.calendario_dias=[];
    let vfecha=new Date(panio,pmes-1,1);
    const vdiasemana=0-vfecha.getDay();
    vfecha=this.Funcion.fecha_desplazada(vfecha,vdiasemana);
    let semanas: number;
    let dias: number;
    let vdia=0;
    let vhoy=false;
    let vactual=false;
    let vmes=0;
    let votro_mes=false;
    for (semanas=0;semanas<6;semanas++) {
      this.calendario_dias.push([]);
      for (dias=0;dias<7;dias++) {
        const vf=this.Funcion.fecha_a_mysql(vfecha);
        vdia=parseInt(vf.substring(8,10),10);
        vmes=parseInt(vf.substring(5,7),10);
        if (this.Funcion.fecha_a_mysql(vfecha)===this.Funcion.fecha_a_mysql(this.Funcion.fecha_hoy())) { vhoy=true; } else { vhoy=false; }
        if (this.Funcion.fecha_a_mysql(vfecha)===this.Funcion.fecha_a_mysql(this.inputModel)) { vactual=true; } else { vactual=false; }
        if (vmes!==pmes) { votro_mes=true; } else { votro_mes=false; }
        this.calendario_dias[semanas].push(new CalendarioDia(vfecha,vdia,vhoy,vactual,votro_mes));
        vfecha=this.Funcion.fecha_desplazada(vfecha,1);
      }
    }
  }
  f_calendario_selecciono(f:Date) {
    this.inputModel=f;
    this.actualizar_fecha(f);
    this.viendo_calendario=false;
    this.inputModelChange.emit(this.inputModel);
  }
  f_mes_anterior() {
    if (this.calendario_viendo_mes===1) { this.calendario_viendo_mes=12; this.calendario_viendo_anio--; } else { this.calendario_viendo_mes--; }
    this.armar_calendario(this.calendario_viendo_mes,this.calendario_viendo_anio);
  }
  f_mes_posterior() {
    if (this.calendario_viendo_mes===12) { this.calendario_viendo_mes=1; this.calendario_viendo_anio++; } else { this.calendario_viendo_mes++; }
    this.armar_calendario(this.calendario_viendo_mes,this.calendario_viendo_anio);
  }
}
