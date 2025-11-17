import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroIgualdad',
  pure: false
})
export class FiltroIgualdadPipe implements PipeTransform {

  transform(items: any[], buscar: any, NombreCampo: string): any[] {
    if (!items) { return []; }

    if (buscar===null) { return items; }

    function f_filtrado(item:any) {
      if (item[NombreCampo]===buscar) {
        return true;
      } else {
        return false;
      }
    }

    return items.filter(f_filtrado);
  }
}

