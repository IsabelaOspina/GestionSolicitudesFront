import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { SolicitudService } from '../../Service/solicitud.service';
import { SolicitudResponse } from '../../Models/solicitud-response.model';
import { CrearSolicitudRequest } from '../../Models/crear-solicitud-request.model';
import { TipoSolicitud } from '../../Models/Enums/tipo-solicitud.enum';
import { CanalOrigen } from '../../Models/Enums/canal-origen.enum';

@Component({
  selector: 'app-solicitud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.css']
})
export class SolicitudComponent {

  solicitudes: SolicitudResponse[] = [];
  cargando = false;
  mensaje = '';
  error = '';
  mostrarTabla = false;
  nombreUsuario = '';
  solicitudDetalle: SolicitudResponse | null = null;

  tiposSolicitud = Object.values(TipoSolicitud);
  canalesOrigen  = Object.values(CanalOrigen);

  nuevaSolicitud: CrearSolicitudRequest = {
    descripcion:   '',
    tipoSolicitud: TipoSolicitud.CONSULTA_ACADEMICA,
    canalOrigen:   CanalOrigen.CORREO_ELECTRONICO,
  };

  constructor(
    private solicitudService: SolicitudService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.nombreUsuario = localStorage.getItem('nombre') || 'Estudiante';
  }

  obtenerMisSolicitudes(): void {
    this.cargando = true;
    this.error = '';
    this.mostrarTabla = true;

    this.solicitudService.obtenerMisSolicitudes().subscribe({
      next: data => {
        this.solicitudes = data;
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: err => {
        console.error(err);
        this.error = 'Error al obtener solicitudes';
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  registrarSolicitud(): void {
    this.mensaje = '';
    this.error = '';

    if (!this.nuevaSolicitud.descripcion.trim()) {
      this.error = 'La descripción es obligatoria';
      return;
    }

    this.solicitudService.registrarSolicitud(this.nuevaSolicitud).subscribe({
      next: response => {
        this.mensaje = 'Solicitud registrada correctamente';
        this.solicitudes.unshift(response);
        this.mostrarTabla = true;
        this.nuevaSolicitud = {
          descripcion:   '',
          tipoSolicitud: TipoSolicitud.CONSULTA_ACADEMICA,
          canalOrigen:   CanalOrigen.CORREO_ELECTRONICO,
        };
        this.cdr.markForCheck();
      },
      error: err => {
        console.error(err);
        this.error = 'Error al registrar solicitud';
        this.cdr.markForCheck();
      }
    });
  }

  verDetalle(s: SolicitudResponse): void {
    this.solicitudDetalle = s;
  }

  cerrarDetalle(): void {
    this.solicitudDetalle = null;
  }

  volverLogin(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('nombre');
    this.router.navigate(['/login']);
  }
}
