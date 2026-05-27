import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { UsuarioService } from '../../Service/usuario.service';
import { CrearUsuarioRequest } from '../../Models/crear-usuario-request.model';
import { UsuarioResponse } from '../../Models/usuario-response.model';
import { Rol } from '../../Models/Enums/rol.enum';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  usuario: CrearUsuarioRequest = {
    nombre: '',
    correo: '',
    password: '',
    rol: Rol.ESTUDIANTE
  };

  roles = [
    Rol.ESTUDIANTE,
    Rol.DOCENTE,
    Rol.ADMINISTRATIVO
  ];

  usuarios: UsuarioResponse[] = [];

  idBusqueda: number | null = null;
  correoBusqueda = '';
  rolBusqueda = Rol.ESTUDIANTE;

  mensaje = '';
  error = '';
  cargando = false;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  limpiarMensajes(): void {
    this.mensaje = '';
    this.error = '';
  }

  crearUsuario(): void {
    this.limpiarMensajes();
    this.cargando = true;

    this.usuarioService.crearUsuario(this.usuario).subscribe({
      next: () => {
        this.mensaje = 'Usuario creado correctamente';

        this.usuario = {
          nombre: '',
          correo: '',
          password: '',
          rol: Rol.ESTUDIANTE
        };

        this.listarUsuarios();
        this.cargando = false;
      },
      error: (err) => {
        console.log(err);
        this.error = err.error?.message || 'Error al crear usuario';
        this.cargando = false;
      }
    });
  }

  listarUsuarios(): void {
    this.limpiarMensajes();

    this.usuarioService.listarUsuarios().subscribe({
      next: (data) => {
        this.usuarios = [...data];
      },
      error: () => {
        this.error = 'Error al listar usuarios';
      }
    });
  }

  buscarPorId(): void {
    this.limpiarMensajes();

    if (this.idBusqueda == null) {
      this.error = 'Ingrese un ID';
      return;
    }

    this.usuarioService.obtenerPorId(this.idBusqueda).subscribe({
      next: (usuario) => {
        this.usuarios = [usuario];
      },
      error: () => {
        this.error = 'Usuario no encontrado';
      }
    });
  }

  buscarPorCorreo(): void {
    this.limpiarMensajes();

    if (!this.correoBusqueda.trim()) {
      this.error = 'Ingrese un correo';
      return;
    }

    this.usuarioService.obtenerPorCorreo(this.correoBusqueda).subscribe({
      next: (usuario) => {
        this.usuarios = [usuario];
      },
      error: () => {
        this.error = 'Usuario no encontrado';
      }
    });
  }

  buscarPorRol(): void {
    this.limpiarMensajes();

    this.usuarioService.obtenerUsuarioPorRol(this.rolBusqueda).subscribe({
      next: (usuarios) => {
        this.usuarios = [...usuarios];
      },
      error: () => {
        this.error = 'No se encontraron usuarios';
      }
    });
  }

  inactivarUsuario(id: number): void {
    this.limpiarMensajes();

    this.usuarioService.inactivarUsuario(id).subscribe({
      next: (mensaje) => {
        this.mensaje = mensaje;

        // ✅ CORRECCIÓN IMPORTANTE (INMUTABILIDAD)
        this.usuarios = this.usuarios.map(u =>
          u.idUsuario === id
            ? { ...u, activo: false }
            : u
        );
      },
      error: (err) => {
        console.log(err);
        this.error = err.error?.message || 'Error al inactivar usuario';
      }
    });
  }

  activarUsuario(id: number): void {
    this.limpiarMensajes();

    this.usuarioService.activarUsuario(id).subscribe({
      next: (mensaje) => {
        this.mensaje = mensaje;

        // ✅ CORRECCIÓN IMPORTANTE (INMUTABILIDAD)
        this.usuarios = this.usuarios.map(u =>
          u.idUsuario === id
            ? { ...u, activo: true }
            : u
        );
      },
      error: (err) => {
        console.log(err);
        this.error = err.error?.message || 'Error al activar usuario';
      }
    });
  }

  volverLogin(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    this.router.navigate(['/']);
  }
}