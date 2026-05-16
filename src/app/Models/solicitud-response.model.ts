import { CanalOrigen } from './Enums/canal-origen.enum';
import { EstadoSolicitud } from './Enums/estado-solicitud.enum';
import { TipoSolicitud } from './Enums/tipo-solicitud.enum';
import { NivelPrioridad } from './Enums/nivel-prioridad.enum';

export interface SolicitudResponse {
  idSolicitud: number;
  descripcion: string;
  fechaHoraRegistro: string;
  canalOrigen: CanalOrigen;
  tipoSolicitud: TipoSolicitud;
  estadoSolicitud: EstadoSolicitud;
  fechaLimite: string;
  nivelPrioridad: NivelPrioridad;
  justificacionPrioridad: string;
  solicitanteId: string;
  solicitanteNombre: string;
  responsableAsignadoId: string;
  nombreResponsable: string;

}
