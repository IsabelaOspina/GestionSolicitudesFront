import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SolicitudService } from '../../Service/solicitud.service';
import { HistorialSolicitudesService } from '../../Service/historial-solicitudes.service';

import { SolicitudResponse } from '../../Models/solicitud-response.model';
import { ResumenSolicitudResponse } from '../../Models/resumen-solicitud-response.model';
import { HistorialSolicitudesResponse } from '../../Models/historial-solicitudes-response.model';
import { HistorialSolicitudesRequest } from '../../Models/historial-solicitudes-request.model';

import { EstadoSolicitud } from '../../Models/Enums/estado-solicitud.enum';
import { TipoSolicitud } from '../../Models/Enums/tipo-solicitud.enum';
import { NivelPrioridad } from '../../Models/Enums/nivel-prioridad.enum';
import { Router } from '@angular/router';

type TabKey =
  | 'consultar'
  | 'priorizar'
  | 'asignar'
  | 'atender'
  | 'cerrar'
  | 'resumen'
  | 'historial'
  | 'registrar-accion';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './administrativo.component.html',
  styleUrls: ['./administrativo.component.css'],
})
export class AdministrativoComponent implements OnInit {

  activeTab: TabKey = 'consultar';
  errorMsg = '';
  successMsg = '';
  globalStatus: 'ok' | 'error' | '' = '';
  globalStatusText = 'Sistema activo';
  nombreUsuario = '';
  loading = false;

  estados: EstadoSolicitud[] = Object.values(EstadoSolicitud);
  tipos: TipoSolicitud[]     = Object.values(TipoSolicitud);
  prioridades: NivelPrioridad[] = Object.values(NivelPrioridad);

  tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: 'consultar',        label: 'Consultar',         icon: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="6.5" cy="6.5" r="4.5"/><path d="M10.5 10.5l3 3" stroke-linecap="round"/></svg>' },
    { key: 'priorizar',        label: 'Priorizar',         icon: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 2v12M4 6l4-4 4 4" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { key: 'asignar',          label: 'Asignar',           icon: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="5" r="3"/><path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke-linecap="round"/></svg>' },
    { key: 'atender',          label: 'Atender',           icon: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="6"/><path d="M5 8l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { key: 'cerrar',           label: 'Cerrar',            icon: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="7" width="10" height="8" rx="1.5"/><path d="M5 7V5a3 3 0 016 0v2" stroke-linecap="round"/></svg>' },
    { key: 'resumen',          label: 'Resumen IA',        icon: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="6"/><path d="M6 6.5C6 5.12 6.9 4 8 4s2 1.12 2 2.5c0 1.5-2 3-2 3" stroke-linecap="round"/><circle cx="8" cy="12" r=".7" fill="currentColor" stroke="none"/></svg>' },
    { key: 'historial',        label: 'Historial',         icon: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="6"/><path d="M8 5v3l2.5 2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { key: 'registrar-accion', label: 'Registrar Acción',  icon: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 2v12M2 8h12" stroke-linecap="round"/></svg>' },
  ];

  get currentTabLabel(): string {
    return this.tabs.find(t => t.key === this.activeTab)?.label ?? '';
  }

  solicitudes: SolicitudResponse[] = [];
  solicitudSeleccionada: SolicitudResponse | null = null;
  solicitudResultado: SolicitudResponse | null = null;
  resumenResultado: ResumenSolicitudResponse | null = null;
  historial: HistorialSolicitudesResponse[] = [];

  filtroEstado      = '';
  filtroTipo        = '';
  filtroPrioridad   = '';
  filtroResponsableId: number | null = null;
  filtroSolicitanteId: number | null = null;
  filtroDesde       = '';
  filtroHasta       = '';
  filtroEstadoCombo = '';
  filtroTipoCombo   = '';

  priorizarForm = {
    idSolicitud:   null as number | null,
    prioridad:     null as NivelPrioridad | null,
    impacto:       '',
    justificacion: '',
    usarIA:        false,
  };

  asignarForm = {
    idSolicitud:   null as number | null,
    idResponsable: null as number | null,
  };

  atenderForm = {
    idSolicitud: null as number | null,
    observacion: '',
  };

  cerrarForm = {
    idSolicitud:       null as number | null,
    observacionCierre: '',
  };

  registrarAccionForm = {
    idSolicitud:     null as number | null,
    accionRealizada: '',
    observaciones:   '',
  };

  resumenIdSolicitud:   number | null = null;
  historialIdSolicitud: number | null = null;

  constructor(
    private solicitudSvc: SolicitudService,
    private historialSvc: HistorialSolicitudesService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {
    this.nombreUsuario = localStorage.getItem('nombre') || 'Administrativo';
  }

  ngOnInit(): void {}

  /* ── NAV ── */
  setTab(tab: TabKey): void {
    this.activeTab = tab;
    this.solicitudes = [];
    this.solicitudResultado = null;
    this.resumenResultado = null;
    this.historial = [];
    this.errorMsg = '';
    this.successMsg = '';
  }

  seleccionarSolicitud(s: SolicitudResponse): void {
    this.solicitudSeleccionada = s;
  }

  /* ── HELPERS ── */
  private handleError(err: any): void {
    console.log('Error completo:', err);
    console.log('err.error:', err.error);
    console.log('err.error.error:', err.error?.error);
    this.errorMsg = err?.error?.error ?? err?.error?.message ?? 'Error al procesar la solicitud.';
    this.globalStatus = 'error';
    this.globalStatusText = 'Error';
    this.cdr.markForCheck();
  }

  private handleSuccess(msg: string): void {
    this.successMsg = msg;
    this.globalStatus = 'ok';
    this.globalStatusText = 'OK';
    this.cdr.markForCheck();
    setTimeout(() => {
      this.globalStatus = '';
      this.globalStatusText = 'Sistema activo';
      this.cdr.markForCheck();
    }, 3000);
  }

  /* ── CONSULTAS ── */
  consultarPorEstado(): void {
    if (!this.filtroEstado) return;
    this.solicitudSvc.consultarPorEstado(this.filtroEstado as EstadoSolicitud).subscribe({
      next: data => { this.solicitudes = data; this.cdr.markForCheck(); },
      error: err => this.handleError(err),
    });
  }

  consultarPorTipo(): void {
    if (!this.filtroTipo) return;
    this.solicitudSvc.consultarPorTipo(this.filtroTipo as TipoSolicitud).subscribe({
      next: data => { this.solicitudes = data; this.cdr.markForCheck(); },
      error: err => this.handleError(err),
    });
  }

  consultarPorPrioridad(): void {
    if (!this.filtroPrioridad) return;
    this.solicitudSvc.consultarPorPrioridad(this.filtroPrioridad as NivelPrioridad).subscribe({
      next: data => { this.solicitudes = data; this.cdr.markForCheck(); },
      error: err => this.handleError(err),
    });
  }

  consultarPorResponsable(): void {
    if (!this.filtroResponsableId) return;
    this.solicitudSvc.consultarPorResponsable(this.filtroResponsableId).subscribe({
      next: data => { this.solicitudes = data; this.cdr.markForCheck(); },
      error: err => this.handleError(err),
    });
  }

  consultarPorSolicitante(): void {
    if (!this.filtroSolicitanteId) return;
    this.solicitudSvc.consultarPorSolicitante(this.filtroSolicitanteId).subscribe({
      next: data => { this.solicitudes = data; this.cdr.markForCheck(); },
      error: err => this.handleError(err),
    });
  }

  consultarPorRangoFechas(): void {
    if (!this.filtroDesde || !this.filtroHasta) { this.errorMsg = 'Selecciona ambas fechas.'; return; }
    this.solicitudSvc.consultarPorRangoFechas(this.filtroDesde, this.filtroHasta).subscribe({
      next: data => { this.solicitudes = data; this.cdr.markForCheck(); },
      error: err => this.handleError(err),
    });
  }

  consultarPorEstadoYTipo(): void {
    if (!this.filtroEstadoCombo || !this.filtroTipoCombo) { this.errorMsg = 'Selecciona estado y tipo.'; return; }
    this.solicitudSvc.consultarPorEstadoYTipo(
      this.filtroEstadoCombo as EstadoSolicitud,
      this.filtroTipoCombo as TipoSolicitud,
    ).subscribe({
      next: data => { this.solicitudes = data; this.cdr.markForCheck(); },
      error: err => this.handleError(err),
    });
  }

  /* ── PRIORIZAR ── */
  priorizarSolicitud(): void {
    const { idSolicitud, prioridad, impacto, justificacion, usarIA } = this.priorizarForm;
    if (!idSolicitud) { this.errorMsg = 'Ingresa el ID de la solicitud.'; return; }
    if (!usarIA && (!prioridad || !impacto || !justificacion)) {
      this.errorMsg = 'Completa la prioridad, impacto y justificación, o activa la IA.'; return;
    }
    this.solicitudResultado = null;
    this.solicitudSvc.priorizarSolicitud(idSolicitud, { prioridad: prioridad!, impacto, justificacion, usarIA }).subscribe({
      next: data => { this.solicitudResultado = data; this.handleSuccess('Solicitud priorizada correctamente.'); },
      error: err => this.handleError(err),
    });
  }

  /* ── ASIGNAR ── */
  asignarResponsable(): void {
    console.log('Token:', localStorage.getItem('token'));
    console.log('Rol guardado:', localStorage.getItem('rol'));
    const { idSolicitud, idResponsable } = this.asignarForm;
    if (!idSolicitud || !idResponsable) { this.errorMsg = 'Completa ID de solicitud e ID de responsable.'; return; }
    this.solicitudResultado = null;
    this.solicitudSvc.asignarResponsable(idSolicitud, idResponsable).subscribe({
      next: data => { this.solicitudResultado = data; this.handleSuccess('Responsable asignado correctamente.'); },
      error: err => this.handleError(err),
    });
  }

  /* ── ATENDER ── */
  atenderSolicitud(): void {
    const { idSolicitud, observacion } = this.atenderForm;
    if (!idSolicitud || !observacion) { this.errorMsg = 'Completa el ID y la observación.'; return; }
    this.solicitudResultado = null;
    this.solicitudSvc.atenderSolicitud(idSolicitud, { observacion }).subscribe({
      next: data => { this.solicitudResultado = data; this.handleSuccess('Solicitud marcada como atendida.'); },
      error: err => this.handleError(err),
    });
  }

  /* ── CERRAR ── */
  cerrarSolicitud(): void {
    const { idSolicitud, observacionCierre } = this.cerrarForm;
    if (!idSolicitud || !observacionCierre) { this.errorMsg = 'Completa el ID y la observación de cierre.'; return; }
    this.solicitudResultado = null;
    this.solicitudSvc.cerrarSolicitud(idSolicitud, { observacionCierre }).subscribe({
      next: data => { this.solicitudResultado = data; this.handleSuccess('Solicitud cerrada correctamente.'); },
      error: err => this.handleError(err),
    });
  }

  /* ── RESUMEN IA ── */
  generarResumen(idSolicitud: number, event: Event): void {
    event.stopPropagation();
    this.solicitudSvc.generarResumenSolicitud(idSolicitud).subscribe({
      next: data => { this.resumenResultado = data; this.activeTab = 'resumen'; this.handleSuccess('Resumen generado.'); },
      error: err => this.handleError(err),
    });
  }

  generarResumenTab(): void {
    if (!this.resumenIdSolicitud) { this.errorMsg = 'Ingresa el ID de la solicitud.'; return; }
    this.resumenResultado = null;
    this.solicitudSvc.generarResumenSolicitud(this.resumenIdSolicitud).subscribe({
      next: data => { this.resumenResultado = data; this.handleSuccess('Resumen generado correctamente.'); },
      error: err => this.handleError(err),
    });
  }

  /* ── HISTORIAL ── */
  verHistorial(idSolicitud: number, event: Event): void {
    event.stopPropagation();
    this.historialIdSolicitud = idSolicitud;
    this.activeTab = 'historial';
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    if (!this.historialIdSolicitud) { this.errorMsg = 'Ingresa el ID de la solicitud.'; return; }
    this.historial = [];
    this.historialSvc.obtenerHistorialPorSolicitud(this.historialIdSolicitud).subscribe({
      next: data => { this.historial = data; this.cdr.markForCheck(); },
      error: err => this.handleError(err),
    });
  }

  /* ── REGISTRAR ACCIÓN ── */
  registrarAccion(): void {
    const { idSolicitud, accionRealizada, observaciones } = this.registrarAccionForm;
    if (!idSolicitud || !accionRealizada.trim() || !observaciones.trim()) {
      this.errorMsg = 'Completa todos los campos.';
      return;
    }
    const dto: HistorialSolicitudesRequest = {
      idSolicitud,
      accionRealizada,
      observaciones,
      fechaHora: new Date().toISOString().substring(0, 19),
    };
    console.log('DTO enviado:', JSON.stringify(dto));
    this.historialSvc.registrarAccion(idSolicitud, dto).subscribe({
      next: () => {
        this.handleSuccess('Acción registrada correctamente.');
        this.registrarAccionForm = { idSolicitud: null, accionRealizada: '', observaciones: '' };
      },
      error: err => {
        console.log('Error response:', err.error);
        this.handleError(err);
      },
    });
  }

  /* ── CERRAR SESIÓN ── */
  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('nombre');
    this.router.navigate(['/login']);
  }
}
