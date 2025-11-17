import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuberiasModule } from '.././tuberias/tuberias.module';
import { ComponentesModule } from '../componentes/componentes.module';
import { MenuConfigUsuariosComponent } from '../configuracion/menu-config-usuarios/menu-config-usuarios.component';
import { MenuConfiguracionComponent } from './menu-configuracion/menu-configuracion.component';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TuberiasModule,
    ComponentesModule,
        MenuConfigUsuariosComponent,
        MenuConfiguracionComponent,
  ], exports: [
    MenuConfigUsuariosComponent,
    MenuConfiguracionComponent,
]
})
export class ConfiguracionModule { }

export { 
  MenuConfigUsuariosComponent,
  MenuConfiguracionComponent,
}
