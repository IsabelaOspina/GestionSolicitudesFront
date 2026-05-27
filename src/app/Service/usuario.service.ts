import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UsuarioResponse } from '../Models/usuario-response.model';
import { CrearUsuarioRequest } from '../Models/crear-usuario-request.model';
import { LoginRequest } from '../Models/login-request.model';
import { Rol } from '../Models/Enums/rol.enum';
import { LoginResponse } from '../Models/login-response';
import {environment} from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  private baseUrl = `${environment.apiUrl}/usuarios`;

  constructor(
    private http: HttpClient
  ) {}

  crearUsuario(
    dto: CrearUsuarioRequest
  ): Observable<UsuarioResponse> {

    const token = localStorage.getItem('token');

    return this.http.post<UsuarioResponse>(
      `${this.baseUrl}/admin/crear`,
      dto,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  login(
    dto: LoginRequest
  ): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      `${this.baseUrl}/login`,
      dto
    );
  }

  obtenerPorId(
    id: number
  ): Observable<UsuarioResponse> {

    const token = localStorage.getItem('token');

    return this.http.get<UsuarioResponse>(
      `${this.baseUrl}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  obtenerUsuarioPorRol(
    rol: Rol
  ): Observable<UsuarioResponse[]> {

    const token = localStorage.getItem('token');

    return this.http.get<UsuarioResponse[]>(
      `${this.baseUrl}/rol/${rol}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  obtenerPorCorreo(
    correo: string
  ): Observable<UsuarioResponse> {

    const token = localStorage.getItem('token');

    return this.http.get<UsuarioResponse>(
      `${this.baseUrl}/correo/${correo}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  validarUsuarioActivo(
    id: number
  ): Observable<string> {

    const token = localStorage.getItem('token');

    return this.http.get(
      `${this.baseUrl}/${id}/activo`,
      {
        responseType: 'text',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  inactivarUsuario(
    id: number
  ): Observable<string> {

    const token = localStorage.getItem('token');

    return this.http.put(
      `${this.baseUrl}/inactivar/${id}`,
      {},
      {
        responseType: 'text',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  activarUsuario(
    id: number
  ): Observable<string> {

    const token = localStorage.getItem('token');

    return this.http.put(
      `${this.baseUrl}/activar/${id}`,
      {},
      {
        responseType: 'text',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  listarUsuarios(): Observable<UsuarioResponse[]> {

    const token = localStorage.getItem('token');

    return this.http.get<UsuarioResponse[]>(
      `${this.baseUrl}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
}
