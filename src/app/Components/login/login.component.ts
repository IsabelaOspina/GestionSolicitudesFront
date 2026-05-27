import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../Service/usuario.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  correoElectronico = '';
  password = '';
  error = '';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  login(): void {
    const dto = {
      correoElectronico: this.correoElectronico,
      password: this.password
    };

    this.usuarioService.login(dto).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);

        const payload = JSON.parse(atob(response.token.split('.')[1]));
        const rol = payload.role;

        localStorage.setItem('rol', rol);
        localStorage.setItem('nombre', payload.sub || '');

        if (rol === 'ADMINISTRADOR') {
          this.router.navigate(['/admin']);
        } else if (rol === 'ADMINISTRATIVO') {
          this.router.navigate(['/administrativo']);
        } else if (rol === 'ESTUDIANTE' || rol === 'DOCENTE') {
          this.router.navigate(['/solicitudes']);
        }
      },
      error: () => {
        this.error = 'Credenciales incorrectas';
        this.cdr.markForCheck();
      }
    });
  }
}
