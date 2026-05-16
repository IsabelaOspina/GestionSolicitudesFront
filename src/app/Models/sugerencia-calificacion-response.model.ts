import {TipoSolicitud} from './Enums/tipo-solicitud.enum';
import {NivelPrioridad} from './Enums/nivel-prioridad.enum';

export interface SugerenciaCalificacionResponse {
  tipoSolicitudSugerido: TipoSolicitud;
  prioridadSugerida: NivelPrioridad;
}
