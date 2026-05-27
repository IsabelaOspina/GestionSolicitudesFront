import { TipoSolicitud } from './Enums/tipo-solicitud.enum';
import { CanalOrigen } from './Enums/canal-origen.enum';

export interface CrearSolicitudRequest {
  descripcion: string;
  tipoSolicitud: TipoSolicitud;
  canalOrigen: CanalOrigen;

}
