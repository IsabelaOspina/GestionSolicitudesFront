import { Rol } from "./Enums/rol.enum";

export interface CrearUsuarioRequest {
  nombre: string;
  correo: string;
  password: string;
  rol:Rol;

}
