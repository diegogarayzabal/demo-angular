import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltrandoPipe } from './filtrando.pipe';
import { FiltroIgualdadPipe } from './filtro-igualdad.pipe';
import { FiltroNumericoPipe } from './filtro-numerico.pipe';
import { FiltroFuncionPipe } from './filtro-funcion.pipe';
import { FiltropornombrePipe } from './filtropornombre.pipe';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,FiltrandoPipe, FiltroIgualdadPipe, FiltroNumericoPipe,FiltroFuncionPipe,FiltropornombrePipe
  ],
  exports: [FiltrandoPipe, FiltroIgualdadPipe, FiltroNumericoPipe,FiltroFuncionPipe,FiltropornombrePipe]
})
export class TuberiasModule { }
