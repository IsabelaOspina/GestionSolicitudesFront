import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {HistorialSolicitudesResponse} from '../Models/historial-solicitudes-response.model';

@Injectable({
  providedIn: 'root',
})

export class HistorialSolicitudesService {
  private baseUrl = 'http://localhost:8080/historial-solicitudes';

  constructor(private http: HttpClient) {
  }

  obtenerHistorialPorSolicitud(idSolicitud: number): Observable<HistorialSolicitudesResponse[]> {
      return this.http.get<HistorialSolicitudesResponse[]>(`${this.baseUrl}/solicitud/${idSolicitud}`);
  }

  registrarAccion(idSolicitud:number, dto: HistorialSolicitudesResponse): Observable<HistorialSolicitudesResponse> {
    return this.http.post<HistorialSolicitudesResponse>(`${this.baseUrl}/solicitud/${idSolicitud}/registrar`, dto);
  }
}
