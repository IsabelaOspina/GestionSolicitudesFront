import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { UsuarioService } from '../../Service/usuario.service';

import { CrearUsuarioRequest } from '../../Models/crear-usuario-request.model';
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

  mensaje = '';
  error = '';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  crearUsuario(): void {

    this.mensaje = '';
    this.error = '';

    console.log(this.usuario);

    this.usuarioService.crearUsuario(this.usuario)
      .subscribe({

        next: () => {

          this.mensaje =
            'Usuario creado correctamente';

          this.usuario = {
            nombre: '',
            correo: '',
            password: '',
            rol: Rol.ESTUDIANTE
          };
        },

        error: (err) => {

          console.log(err);

          this.error =
            err.error?.message ||
            'Error al crear usuario';
        }
      });
  }

  volverLogin(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('rol');

    this.router.navigate(['/login']);
  }
}