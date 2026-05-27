// src/app/Service/solicitud.service.ts

import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';

import { Observable } from 'rxjs';

import { SolicitudResponse } from '../Models/solicitud-response.model';

import { CrearSolicitudRequest } from '../Models/crear-solicitud-request.model';

import { PrioridadSolicitudRequest } from '../Models/prioridad-solicitud-request.model';

import { ResumenSolicitudResponse } from '../Models/resumen-solicitud-response.model';

import { AtenderSolicitudRequest } from '../Models/atender-solicitud-request.model';

import { CerrarSolicitudRequest } from '../Models/cerrar-solicitud-request.model';

import { EstadoSolicitud } from '../Models/Enums/estado-solicitud.enum';

import { TipoSolicitud } from '../Models/Enums/tipo-solicitud.enum';

import { NivelPrioridad } from '../Models/Enums/nivel-prioridad.enum';

@Injectable({
  providedIn: 'root',
})

export class SolicitudService {

  private baseUrl =
    'http://localhost:8080/solicitudes';

  constructor(
    private http: HttpClient
  ) {}

  /* =====================================
      HEADERS JWT
  ===================================== */

  private getHeaders(): HttpHeaders {

    const token =
      localStorage.getItem('token');

    return new HttpHeaders({

      Authorization:
        `Bearer ${token}`
    });
  }

  /* =====================================
      RF-01 REGISTRAR SOLICITUD
  ===================================== */

  registrarSolicitud(
    dto: CrearSolicitudRequest
  ): Observable<SolicitudResponse> {

    return this.http.post<SolicitudResponse>(
      `${this.baseUrl}/registrar`,
      dto,
      {
        headers: this.getHeaders()
      }
    );
  }

  /* =====================================
      RF-03 PRIORIZAR SOLICITUD
  ===================================== */

  priorizarSolicitud(
    idSolicitud: number,
    dto: PrioridadSolicitudRequest
  ): Observable<SolicitudResponse> {

    return this.http.put<SolicitudResponse>(
      `${this.baseUrl}/priorizar/${idSolicitud}`,
      dto,
      {
        headers: this.getHeaders()
      }
    );
  }

  /* =====================================
      RF-05 ASIGNAR RESPONSABLE
  ===================================== */

  asignarResponsable(
    idSolicitud: number,
    idResponsable: number
  ): Observable<SolicitudResponse> {

    return this.http.put<SolicitudResponse>(
      `${this.baseUrl}/${idSolicitud}/asignar/${idResponsable}`,
      {},
      {
        headers: this.getHeaders()
      }
    );
  }

  /* =====================================
      RF-07 CONSULTAR POR ESTADO
  ===================================== */

  consultarPorEstado(
    estado: EstadoSolicitud
  ): Observable<SolicitudResponse[]> {

    return this.http.get<SolicitudResponse[]>(
      `${this.baseUrl}/estado/${estado}`,
      {
        headers: this.getHeaders()
      }
    );
  }

  /* =====================================
      RF-07 CONSULTAR POR TIPO
  ===================================== */

  consultarPorTipo(
    tipo: TipoSolicitud
  ): Observable<SolicitudResponse[]> {

    return this.http.get<SolicitudResponse[]>(
      `${this.baseUrl}/tipo/${tipo}`,
      {
        headers: this.getHeaders()
      }
    );
  }

  /* =====================================
      RF-07 CONSULTAR POR PRIORIDAD
  ===================================== */

  consultarPorPrioridad(
    prioridad: NivelPrioridad
  ): Observable<SolicitudResponse[]> {

    return this.http.get<SolicitudResponse[]>(
      `${this.baseUrl}/prioridad/${prioridad}`,
      {
        headers: this.getHeaders()
      }
    );
  }

  /* =====================================
      RF-07 CONSULTAR POR RESPONSABLE
  ===================================== */

  consultarPorResponsable(
    idResponsable: number
  ): Observable<SolicitudResponse[]> {

    return this.http.get<SolicitudResponse[]>(
      `${this.baseUrl}/responsable/${idResponsable}`,
      {
        headers: this.getHeaders()
      }
    );
  }

  /* =====================================
      RF-07 CONSULTAR POR RANGO FECHAS
  ===================================== */

  consultarPorRangoFechas(
    desde: string,
    hasta: string
  ): Observable<SolicitudResponse[]> {

    const params = new HttpParams()
      .set('desde', desde)
      .set('hasta', hasta);

    return this.http.get<SolicitudResponse[]>(
      `${this.baseUrl}/rango`,
      {
        headers: this.getHeaders(),
        params
      }
    );
  }

  /* =====================================
      RF-07 CONSULTAR POR ESTADO Y TIPO
  ===================================== */

  consultarPorEstadoYTipo(
    estado: EstadoSolicitud,
    tipo: TipoSolicitud
  ): Observable<SolicitudResponse[]> {

    const params = new HttpParams()
      .set('estado', estado)
      .set('tipo', tipo);

    return this.http.get<SolicitudResponse[]>(
      `${this.baseUrl}/estado-tipo`,
      {
        headers: this.getHeaders(),
        params
      }
    );
  }

  /* =====================================
      RF-07 CONSULTAR POR SOLICITANTE
  ===================================== */

  consultarPorSolicitante(
    idSolicitante: number
  ): Observable<SolicitudResponse[]> {

    return this.http.get<SolicitudResponse[]>(
      `${this.baseUrl}/solicitante/${idSolicitante}`,
      {
        headers: this.getHeaders()
      }
    );
  }

  /* =====================================
      RF-08 CERRAR SOLICITUD
  ===================================== */

  cerrarSolicitud(
    idSolicitud: number,
    dto: CerrarSolicitudRequest
  ): Observable<SolicitudResponse> {

    return this.http.put<SolicitudResponse>(
      `${this.baseUrl}/cerrar/${idSolicitud}`,
      dto,
      {
        headers: this.getHeaders()
      }
    );
  }

  /* =====================================
      GENERAR RESUMEN IA
  ===================================== */

  generarResumenSolicitud(
    idSolicitud: number
  ): Observable<ResumenSolicitudResponse> {

    return this.http.get<ResumenSolicitudResponse>(
      `${this.baseUrl}/${idSolicitud}/resumen`,
      {
        headers: this.getHeaders()
      }
    );
  }

  /* =====================================
      ATENDER SOLICITUD
  ===================================== */

  atenderSolicitud(
    idSolicitud: number,
    dto: AtenderSolicitudRequest
  ): Observable<SolicitudResponse> {

    return this.http.put<SolicitudResponse>(
      `${this.baseUrl}/atender/${idSolicitud}`,
      dto,
      {
        headers: this.getHeaders()
      }
    );
  }

  /* =====================================
      OBTENER MIS SOLICITUDES
  ===================================== */

  obtenerMisSolicitudes():
    Observable<SolicitudResponse[]> {

    return this.http.get<SolicitudResponse[]>(
      `${this.baseUrl}/mis-solicitudes`,
      {
        headers: this.getHeaders()
      }
    );
  }

}