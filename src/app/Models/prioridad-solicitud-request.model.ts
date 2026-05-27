import {NivelPrioridad} from './Enums/nivel-prioridad.enum';

export interface PrioridadSolicitudRequest {
  prioridad:NivelPrioridad,
  impacto: string;
  justificacion: string;
  usarIA: boolean;
}
