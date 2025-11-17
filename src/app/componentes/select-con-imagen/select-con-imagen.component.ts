import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

interface Option {
  [key: string]: any;
  image: string;
  description: string;
}

@Component({
  selector: 'app-select-con-imagen',
  standalone: false,
  templateUrl: './select-con-imagen.component.html',
  styleUrls: ['./select-con-imagen.component.scss']
})
export class SelectConImagenComponent implements OnInit {
  @Input() options: Option[] = [];
  @Input() selectedOption: Option | null = null;
  @Input() ancho: string = '200px';
  @Input() campo_imagen: string = 'imagen_data';
  @Input() campo_nombre: string = 'nombre';
  @Input() CajaEstilo = 1; /* 0=normal, 1=borde redondeado, 2=fondo gris gris */
  @Output() selectedOptionChange = new EventEmitter<Option>();
  dropdownOpen = false;

  ngOnInit() {
    // Si hay una opción inicial, la establece como seleccionada
    if (this.selectedOption) {
      this.selectOption(this.selectedOption);
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectOption(option: Option) {
    this.selectedOption = option;
    this.selectedOptionChange.emit(this.selectedOption); // Notifica el cambio
    this.dropdownOpen = false;
  }
}
