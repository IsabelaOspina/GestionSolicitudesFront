import { TipoSolicitud } from './Enums/tipo-solicitud.enum';
import { CanalOrigen } from './Enums/canal-origen.enum';

export interface CrearSolicitudRequest {
  description: string;
  tipoSolicitud: TipoSolicitud;
  canalOrigen: CanalOrigen;

}
