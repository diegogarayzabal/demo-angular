import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuberiasModule } from '.././tuberias/tuberias.module';
import { ComponentesModule } from '../componentes/componentes.module';
import { MenuVisitasNuevaComponent } from './menu-visitas-nueva/menu-visitas-nueva.component';
import { MenuVisitasComponent } from './menu-visitas/menu-visitas.component';
import { MenuCasosComponent } from './menu-casos/menu-casos.component';
import { MenuCasosNuevoComponent } from './menu-casos-nuevo/menu-casos-nuevo.component';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TuberiasModule,
    ComponentesModule,
    MenuVisitasNuevaComponent,MenuVisitasComponent,MenuCasosComponent,MenuCasosNuevoComponent,
  ],
  exports : [
    MenuVisitasNuevaComponent,MenuVisitasComponent,MenuCasosComponent,MenuCasosNuevoComponent,
  ]
})
export class OpcionesModule { }
export {
  MenuVisitasNuevaComponent,MenuVisitasComponent,MenuCasosComponent,MenuCasosNuevoComponent,
}