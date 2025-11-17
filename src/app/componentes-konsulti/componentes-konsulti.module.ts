import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuberiasModule } from '.././tuberias/tuberias.module';
import { ComponentesModule } from '../componentes/componentes.module';
import { AbmpersonaComponent } from './abmpersona/abmpersona.component';
import { VisualizarpdfComponent } from './visualizarpdf/visualizarpdf.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { MuestraLogsComponent } from './muestra-logs/muestra-logs.component';
import { PersonaVerComponent } from './persona-ver/persona-ver.component';


@NgModule({
  declarations: [],
  imports: [
    AbmpersonaComponent,
    VisualizarpdfComponent,
    MuestraLogsComponent,
    PersonaVerComponent,
    NgxExtendedPdfViewerModule,
    TuberiasModule,
    ComponentesModule,
    CommonModule
  ], exports: [
    AbmpersonaComponent,
    VisualizarpdfComponent,
    MuestraLogsComponent,
    PersonaVerComponent,
    
  ]
})
export class ComponentesKonsultiModule { }
