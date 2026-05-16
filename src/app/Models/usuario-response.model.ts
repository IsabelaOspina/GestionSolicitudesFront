import { Rol } from './Enums/rol.enum';

export interface UsuarioResponse {
  idUsuario: number;
  nombreUsuario: string;
  correoElectronico: string;
  rol: Rol;
  activo: boolean;
}
