import { EstadoSolicitud } from "./Enums/estado-solicitud.enum";
export interface ResumenSolicitudResponse{
  idSolicitud: number;
  estadoSolucitud: EstadoSolicitud;
  resumenGenerado: string;
}
