import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Globals } from '../../globales';
import { FuncionesService } from '../../funciones.service';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-imagen-abm',
  standalone: false,
  templateUrl: './imagen-abm.component.html',
  styleUrls: ['../../app.component.scss','../../app.estilosgenerales.scss','../../bootstrap.css']
})
export class ImagenAbmComponent implements OnInit {
  @Input() ancho = 100;
  @Input() alto:any = null;
  @Input() titulo = '';
  @Input() pregunta_texto = 'Confirma la imagen?';
  @Input() imagen_actual = '';
  @Input() pregunta_si_guarda=true;
  @Input() controlar_tamanio=true;
  @Input() controlar_tamanio_mostrar_error=true;
  @Output() cancelar = new EventEmitter<any>();
  @Output() confirmar = new EventEmitter<any>();
  ImagenCargada=false;
  ImagenError: string;
  cardImageBase64: string;

  G: Globals;
  constructor(private http: HttpClient
    ,variables: Globals
    , public Funcion: FuncionesService
    ) {
    this.G=variables;
  }
  SuscripcionConfirmar: Subscription;
  ngOnInit() {
    if (this.alto===null) this.alto=this.ancho;
  }

  f_verificar(fileInput: any) {
    this.ImagenError = '';
    if (fileInput.target.files && fileInput.target.files[0]) {
        // Size Filter Bytes
        const max_size = 1048576;
        const allowed_types = ['image/png', 'image/jpeg'];
        const max_height = 1000;
        const max_width = 1000;

        if (fileInput.target.files[0].size > max_size) {
            this.ImagenError =
                'Tamaño Máximo: ' + max_size / 1024 + 'Mb';

            return false;
        }
        /*
        if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
            this.ImagenError = 'Solo imágenes ( JPG | PNG )';
            return false;
        }
        */
        const reader = new FileReader();
        reader.onload = (e: any) => {
            const image = new Image();
            image.src = e.target.result;
            image.onload = rs => {
                const img_height = (rs.currentTarget as HTMLImageElement).height;
                const img_width = (rs.currentTarget as HTMLImageElement).width;
                if (this.controlar_tamanio && (img_height > max_height || img_width > max_width)) {
                    this.ImagenError =
                        'Dimensiones Máximas: ' +
                        max_height +
                        '*' +
                        max_width +
                        'px';
                    if (this.controlar_tamanio_mostrar_error) this.Funcion.Alerta(this.ImagenError,1);
                    return false;
                } else {
                    const imgBase64Path = e.target.result;
                    this.cardImageBase64 = imgBase64Path;
                    this.ImagenCargada = true;
                    if (!this.pregunta_si_guarda) {
                      this.confirmar.emit(this.cardImageBase64);
                    }
                    return true;
                    // this.previewImagePath = imgBase64Path;
                }
            };
        };
        reader.readAsDataURL(fileInput.target.files[0]);
        return true
      } else { return false; }
  }
  f_confirmar() {
    this.Funcion.Confirmar(this.pregunta_texto);
    this.SuscripcionConfirmar=this.Funcion.Confirmar$.subscribe(
      respuesta=> {
        this.SuscripcionConfirmar.unsubscribe();
        if (respuesta===1) {
          this.confirmar.emit(this.cardImageBase64);
        }
      }
    );
  }

}
