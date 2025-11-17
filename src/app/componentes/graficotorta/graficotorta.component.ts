import { Component,Input,ViewChild,ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-graficotorta',
  standalone: false,
  templateUrl: './graficotorta.component.html',
})
export class GraficotortaComponent implements OnChanges {
  @Input() titulos:any[]=[];
  @Input() datos:any[]=[];
  @Input() anchoyalto=400;
  @ViewChild('chart') chartEl!: ElementRef;
  private chart!: ApexCharts;
  options = {
          chart: {
            type: 'pie',
            height: 350,
          },
          series: [30, 45, 25],
          labels: ['Ventas', 'Marketing', 'Soporte'],
        };
  

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    this.options.chart.height=this.anchoyalto-50;
    this.options.series=this.datos;
    this.options.labels=this.titulos;
    setTimeout(()=> {
      this.f_generar_grafico();
    },10);
  }
  f_generar_grafico() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new ApexCharts(this.chartEl.nativeElement, this.options);
    this.chart.render();
  }
}

