import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  private baseUrl = 'http://localhost:8080/solicitudes';

  constructor(private http: HttpClient) {}

  // RF-01 Registrar solicitud
  registrarSolicitud(
    dto: CrearSolicitudRequest
  ): Observable<SolicitudResponse> {

    return this.http.post<SolicitudResponse>(
      `${this.baseUrl}/registrar`,
      dto
    );
  }

  // RF-03 Priorizar solicitud
  priorizarSolicitud(
    idSolicitud: number,
    dto: PrioridadSolicitudRequest
  ): Observable<SolicitudResponse> {

    return this.http.put<SolicitudResponse>(
      `${this.baseUrl}/priorizar/${idSolicitud}`,
      dto
    );
  }

  // RF-05 Asignar responsable
  asignarResponsable(
    idSolicitud: number,
    idResponsable: number
  ): Observable<SolicitudResponse> {

    return this.http.post<SolicitudResponse>(
      `${this.baseUrl}/${idSolicitud}/asignar/${idResponsable}`,
      {}
    );
  }

  // RF-07 Consultar por estado
  consultarPorEstado(
    estado: EstadoSolicitud
  ): Observable<SolicitudResponse[]> {

    return this.http.get<SolicitudResponse[]>(
      `${this.baseUrl}/estado/${estado}`
    );
  }

  // RF-07 Consultar por tipo
  consultarPorTipo(
    tipo: TipoSolicitud
  ): Observable<SolicitudResponse[]> {

    return this.http.get<SolicitudResponse[]>(
      `${this.baseUrl}/tipo/${tipo}`
    );
  }

  // RF-07 Consultar por prioridad
  consultarPorPrioridad(
    prioridad: NivelPrioridad
  ): Observable<SolicitudResponse[]> {

    return this.http.get<SolicitudResponse[]>(
      `${this.baseUrl}/prioridad/${prioridad}`
    );
  }

  // RF-07 Consultar por responsable
  consultarPorResponsable(
    idResponsable: number
  ): Observable<SolicitudResponse[]> {

    return this.http.get<SolicitudResponse[]>(
      `${this.baseUrl}/responsable/${idResponsable}`
    );
  }

  // RF-07 Consultar por rango de fechas
  consultarPorRangoFechas(
    desde: string,
    hasta: string
  ): Observable<SolicitudResponse[]> {

    const params = new HttpParams()
      .set('desde', desde)
      .set('hasta', hasta);

    return this.http.get<SolicitudResponse[]>(
      `${this.baseUrl}/rango`,
      { params }
    );
  }

  // RF-07 Consultar por estado y tipo
  consultarPorEstadoYTipo(
    estado: EstadoSolicitud,
    tipo: TipoSolicitud
  ): Observable<SolicitudResponse[]> {

    const params = new HttpParams()
      .set('estado', estado)
      .set('tipo', tipo);

    return this.http.get<SolicitudResponse[]>(
      `${this.baseUrl}/estado-tipo`,
      { params }
    );
  }

  // RF-07 Consultar por solicitante
  consultarPorSolicitante(
    idSolicitante: number
  ): Observable<SolicitudResponse[]> {

    return this.http.get<SolicitudResponse[]>(
      `${this.baseUrl}/solicitante/${idSolicitante}`
    );
  }

  // RF-08 Cerrar solicitud
  cerrarSolicitud(
    idSolicitud: number,
    dto: CerrarSolicitudRequest
  ): Observable<SolicitudResponse> {

    return this.http.post<SolicitudResponse>(
      `${this.baseUrl}/cerrar/${idSolicitud}`,
      dto.observacionCierre
    );
  }

  // Generar resumen IA
  generarResumenSolicitud(
    idSolicitud: number
  ): Observable<ResumenSolicitudResponse> {

    return this.http.get<ResumenSolicitudResponse>(
      `${this.baseUrl}/${idSolicitud}/resumen`
    );
  }

  // Atender solicitud
  atenderSolicitud(
    idSolicitud: number,
    dto: AtenderSolicitudRequest
  ): Observable<SolicitudResponse> {

    return this.http.post<SolicitudResponse>(
      `${this.baseUrl}/atender/${idSolicitud}`,
      dto
    );
  }

}
