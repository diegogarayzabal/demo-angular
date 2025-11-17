import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuberiasModule } from '.././tuberias/tuberias.module';
import { ComponentesModule } from '../componentes/componentes.module';
import { MenuPersonasComponent } from './menu-personas/menu-personas.component';
import { MenuRecordatoriosComponent } from './menu-recordatorios/menu-recordatorios.component';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TuberiasModule,
    ComponentesModule,
    MenuPersonasComponent,
    MenuRecordatoriosComponent,
  ], exports: [
    MenuPersonasComponent,
    MenuRecordatoriosComponent,
  ]
})
export class UtilidadesModule { }
export {
  MenuPersonasComponent,
  MenuRecordatoriosComponent,

}