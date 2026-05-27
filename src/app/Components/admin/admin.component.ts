import { Component, ChangeDetectorRef } from '@angular/core';
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
  nombreUsuario = ' '

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { this.nombreUsuario = localStorage.getItem('nombre') || 'Administrador'; }

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
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.log(err);
        this.error = err.error?.message || 'Error al crear usuario';
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  listarUsuarios(): void {
    this.limpiarMensajes();

    this.usuarioService.listarUsuarios().subscribe({
      next: (data) => {
        this.usuarios = [...data];
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Error al listar usuarios';
        this.cdr.markForCheck();
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
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Usuario no encontrado';
        this.cdr.markForCheck();
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
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Usuario no encontrado';
        this.cdr.markForCheck();
      }
    });
  }

  buscarPorRol(): void {
    this.limpiarMensajes();

    this.usuarioService.obtenerUsuarioPorRol(this.rolBusqueda).subscribe({
      next: (usuarios) => {
        this.usuarios = [...usuarios];
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'No se encontraron usuarios';
        this.cdr.markForCheck();
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
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.log(err);
        this.error = err.error?.message || 'Error al inactivar usuario';
        this.cdr.markForCheck();
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
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.log(err);
        this.error = err.error?.message || 'Error al activar usuario';
        this.cdr.markForCheck();
      }
    });
  }

  volverLogin(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    this.router.navigate(['/']);
  }
}
