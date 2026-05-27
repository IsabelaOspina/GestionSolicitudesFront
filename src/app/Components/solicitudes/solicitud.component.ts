// solicitud.component.ts

import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { SolicitudService } from '../../Service/solicitud.service';

import { SolicitudResponse } from '../../Models/solicitud-response.model';

import { CrearSolicitudRequest } from '../../Models/crear-solicitud-request.model';

import { TipoSolicitud } from '../../Models/Enums/tipo-solicitud.enum';

import { CanalOrigen } from '../../Models/Enums/canal-origen.enum';

@Component({
  selector: 'app-solicitud',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.css']
})

export class SolicitudComponent {

  solicitudes: SolicitudResponse[] = [];

  cargando = false;

  mensaje = '';

  error = '';

  mostrarTabla = false;

  tiposSolicitud =
    Object.values(TipoSolicitud);

  canalesOrigen =
    Object.values(CanalOrigen);

  nuevaSolicitud: CrearSolicitudRequest = {

    descripcion: '',

    tipoSolicitud:
      TipoSolicitud.CONSULTA_ACADEMICA,

    canalOrigen:
      CanalOrigen.CORREO_ELECTRONICO
  };

  constructor(
    private solicitudService:
      SolicitudService
  ) {}

  /* ==============================
      OBTENER MIS SOLICITUDES
  ============================== */

  obtenerMisSolicitudes(): void {

    this.cargando = true;

    this.error = '';

    this.mostrarTabla = true;

    this.solicitudService
      .obtenerMisSolicitudes()
      .subscribe({

        next: (data) => {

          this.solicitudes = data;

          this.cargando = false;
        },

        error: (err) => {

          console.error(err);

          this.error =
            'Error al obtener solicitudes';

          this.cargando = false;
        }
      });
  }

  /* ==============================
      REGISTRAR SOLICITUD
  ============================== */

  registrarSolicitud(): void {

    this.mensaje = '';

    this.error = '';

    if (
      !this.nuevaSolicitud.descripcion
    ) {

      this.error =
        'La descripción es obligatoria';

      return;
    }

    this.solicitudService
      .registrarSolicitud(
        this.nuevaSolicitud
      )
      .subscribe({

        next: (response) => {

          this.mensaje =
            'Solicitud registrada correctamente';

          this.solicitudes.unshift(response);

          this.nuevaSolicitud = {

            descripcion: '',

            tipoSolicitud:
              TipoSolicitud.CONSULTA_ACADEMICA,

            canalOrigen:
              CanalOrigen.CORREO_ELECTRONICO
          };
        },

        error: (err) => {

          console.error(err);

          this.error =
            'Error al registrar solicitud';
        }
      });
  }
}