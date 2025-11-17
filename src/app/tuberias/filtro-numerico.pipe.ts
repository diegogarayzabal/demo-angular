import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroNumerico',
  pure: false
})
export class FiltroNumericoPipe implements PipeTransform {

  transform(items: any[], NombreCampo: string, comparador: number, buscar1: number, buscar2: number = 0): any[] {
    /*
    comparadores:
    1 =
    2 >
    3 >=
    4 <
    5 <=
    6 entre dos valores
    7 !=
    */
   if (!items) { return []; }

    if (!buscar1===null) { return items; }
    if (comparador===6 && (buscar2===null)) { return items; }
    function f_filtrado(item:any) {
      if (comparador===1 && item[NombreCampo]===buscar1) {
        return true;
      } else if (comparador===2 && item[NombreCampo]>buscar1) {
        return true;
      } else if (comparador===3 && item[NombreCampo]>=buscar1) {
        return true;
      } else if (comparador===4 && item[NombreCampo]<buscar1) {
        return true;
      } else if (comparador===5 && item[NombreCampo]<=buscar1) {
        return true;
      } else if (comparador===6 && item[NombreCampo]>=buscar1 && item[NombreCampo]<=buscar2) {
        return true;
      } else if (comparador===7 && item[NombreCampo]!==buscar1) {
        return true;
      } else if (comparador===8 && (item[NombreCampo]===buscar1 || item[NombreCampo]===buscar2)) {
        return true;
      } else {
        return false;
      }
    }

    return items.filter(f_filtrado);
  }

}
