import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertaComponent } from './alerta/alerta.component';

import { NgSelectModule } from '@ng-select/ng-select';

import { TextoComponent } from './texto/texto.component';
import { FechaComponent } from './fecha/fecha.component';

import { NumeroComponent } from './numero/numero.component';
import { BotonComponent } from './boton/boton.component';
import { TildarComponent } from './tildar/tildar.component';
import { TuberiasModule } from '../tuberias/tuberias.module';
import { SelectComunComponent } from './select-comun/select-comun.component';
import { SelectEspecialComponent } from './select-especial/select-especial.component';
import { SpanComponent } from './span/span.component';
import { FilaCelularComponent } from './fila-celular/fila-celular.component';
import { ArchivoComponent } from './archivo/archivo.component';
import { TextareaComponent } from './textarea/textarea.component';
import { ImagenesComponent } from './imagenes/imagenes.component';
import { AutorizadorComponent } from './autorizador/autorizador.component';
import { ImagenOpcionEnTablaComponent } from './imagen-opcion-en-tabla/imagen-opcion-en-tabla.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { PaginadorComponent } from './paginador/paginador.component';
import { FechaDesdeHastaComponent } from './fecha-desde-hasta/fecha-desde-hasta.component';
import { NumeroDesdeHastaComponent } from './numero-desde-hasta/numero-desde-hasta.component';
import { ImagenAbmComponent } from './imagen-abm/imagen-abm.component';
import { SinoIndistintoComponent } from './sino-indistinto/sino-indistinto.component';
import { ImagenMostrarComponent } from './imagen-mostrar/imagen-mostrar.component';
import { SelectConImagenComponent } from './select-con-imagen/select-con-imagen.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { MensajesComponent } from './mensajes/mensajes.component';
import { GraficotortaComponent } from './graficotorta/graficotorta.component';
import { FConfirmarComponent } from './fconfirmar/fconfirmar.component';

@NgModule({
  declarations: [AlertaComponent, TextoComponent, FechaComponent, NumeroComponent, BotonComponent, TildarComponent, FConfirmarComponent, SelectComunComponent, SelectEspecialComponent, SpanComponent, FilaCelularComponent, ArchivoComponent, TextareaComponent, ImagenesComponent, AutorizadorComponent, ImagenOpcionEnTablaComponent
    ,MenuItemComponent, PaginadorComponent, FechaDesdeHastaComponent,
    NumeroDesdeHastaComponent,
    ImagenAbmComponent,
    SinoIndistintoComponent,
    ImagenMostrarComponent,
    SelectConImagenComponent,
    MensajesComponent,
    GraficotortaComponent
  ],
  imports: [
    CommonModule
    ,FormsModule
    ,TuberiasModule
    ,NgSelectModule
    ,ZXingScannerModule 
    ,
],
  exports: [
    AlertaComponent
    ,TextoComponent
    ,TextareaComponent
    ,FechaComponent
    ,NumeroComponent
    ,BotonComponent
    ,TildarComponent
    ,FConfirmarComponent
    ,SelectComunComponent
    ,SelectEspecialComponent
    ,SpanComponent
    ,FilaCelularComponent
    ,ArchivoComponent
    ,NgSelectModule
    ,ImagenesComponent
    ,AutorizadorComponent
    ,ImagenOpcionEnTablaComponent
    ,MenuItemComponent
    ,PaginadorComponent
    ,FechaDesdeHastaComponent
    ,NumeroDesdeHastaComponent
    ,ImagenAbmComponent
    ,SinoIndistintoComponent
    ,ImagenMostrarComponent
    ,SelectConImagenComponent
    ,MensajesComponent
    ,GraficotortaComponent
  ]
})
export class ComponentesModule { }
