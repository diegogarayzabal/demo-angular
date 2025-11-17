import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroFuncion',
  pure: false
})
export class FiltroFuncionPipe implements PipeTransform {

  transform(items: any[], NombreCampo: string, valores_posibles: any): any[] {
    if (!items) { return []; }

    function f_filtrado(item:any) {
        let estaba=false;
        for (let a=0;a<valores_posibles.length;a++) {
            if (valores_posibles[a]===item[NombreCampo]) {
                estaba=true;
                break;
            }
        }
        return estaba;
    }

    return items.filter(f_filtrado);
  }
}

