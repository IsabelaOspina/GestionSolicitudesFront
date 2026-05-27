import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {HistorialSolicitudesResponse} from '../Models/historial-solicitudes-response.model';
import {HistorialSolicitudesRequest} from '../Models/historial-solicitudes-request.model';

@Injectable({
  providedIn: 'root',
})

export class HistorialSolicitudesService {
  private baseUrl = 'http://localhost:8080/historial-solicitudes';

  constructor(private http: HttpClient) {
  }

  obtenerHistorialPorSolicitud(idSolicitud: number): Observable<HistorialSolicitudesResponse[]> {
    const token = localStorage.getItem('token');
    return this.http.get<HistorialSolicitudesResponse[]>(
      `${this.baseUrl}/solicitud/${idSolicitud}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  registrarAccion(idSolicitud: number, dto: HistorialSolicitudesRequest): Observable<HistorialSolicitudesResponse> {
    const token = localStorage.getItem('token');
    return this.http.post<HistorialSolicitudesResponse>(
      `${this.baseUrl}/solicitud/${idSolicitud}`,
      dto,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
}
