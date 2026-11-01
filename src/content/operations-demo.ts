/**
 * Demonstration-only RCM command-center data. This file must never be used as
 * evidence of a live payer, EHR or credentialing connection. No PHI is present.
 */
export type DemoLocale = 'en' | 'es';
export type Pair = { en: string; es: string };
export type Origin = 'synthetic' | 'manual_verified' | 'api_verified';
export type CredentialingPhase =
  | 'intake'
  | 'caqh'
  | 'primary_source'
  | 'payer_submission'
  | 'payer_review'
  | 'effective';
export type StageState = 'complete' | 'current' | 'upcoming';

export type StageProgress = {
  id: CredentialingPhase;
  label: Pair;
  state: StageState;
};

export type CredentialingApplication = {
  id: string;
  organizationId: 'demo-bayview';
  providerAlias: Pair;
  payer: string;
  applicationType: Pair;
  phase: CredentialingPhase;
  nextAction: Pair;
  owner: Pair;
  externalStatus: Pair;
  updatedAt: null;
  source: Origin;
  sourceReference: null;
  verifiedAt: null;
  effectiveDate: null;
  stages: StageProgress[];
};

export const phaseLabels: readonly { id: CredentialingPhase; label: Pair }[] = [
  { id: 'intake', label: { en: 'Application intake', es: 'Recepción de solicitud' } },
  { id: 'caqh', label: { en: 'CAQH & documents', es: 'CAQH y documentos' } },
  { id: 'primary_source', label: { en: 'Primary-source checks', es: 'Verificación de fuentes primarias' } },
  { id: 'payer_submission', label: { en: 'Payer submission', es: 'Envío al pagador' } },
  { id: 'payer_review', label: { en: 'Payer review & follow-up', es: 'Revisión y seguimiento del pagador' } },
  { id: 'effective', label: { en: 'Approval & effective date', es: 'Aprobación y fecha de vigencia' } },
] as const;

function stagesAt(index: number): StageProgress[] {
  return phaseLabels.map((s, i) => ({
    id: s.id,
    label: s.label,
    state: (i < index ? 'complete' : i === index ? 'current' : 'upcoming') as StageState,
  }));
}

export const credentialingApplications: readonly CredentialingApplication[] = [
  {
    id: 'DEMO-CRED-001', organizationId: 'demo-bayview',
    providerAlias: { en: 'Sample Clinician A', es: 'Profesional de ejemplo A' },
    payer: 'Healthfirst', applicationType: { en: 'Initial enrollment', es: 'Inscripción inicial' },
    phase: 'payer_review', nextAction: { en: 'Request payer acknowledgement and review status', es: 'Solicitar acuse y estado de revisión al pagador' },
    owner: { en: 'Enrollment specialist', es: 'Especialista de inscripción' },
    externalStatus: { en: 'Not connected — simulated status', es: 'Sin conexión — estado simulado' },
    updatedAt: null, source: 'synthetic', sourceReference: null, verifiedAt: null, effectiveDate: null, stages: stagesAt(4),
  },
  {
    id: 'DEMO-CRED-002', organizationId: 'demo-bayview',
    providerAlias: { en: 'Sample Clinician B', es: 'Profesional de ejemplo B' },
    payer: 'Aetna', applicationType: { en: 'Revalidation', es: 'Revalidación' },
    phase: 'caqh', nextAction: { en: 'Validate document roster and CAQH attestation', es: 'Validar documentación y certificación CAQH' },
    owner: { en: 'Credentialing coordinator', es: 'Coordinador de credencialización' },
    externalStatus: { en: 'Not connected — simulated status', es: 'Sin conexión — estado simulado' },
    updatedAt: null, source: 'synthetic', sourceReference: null, verifiedAt: null, effectiveDate: null, stages: stagesAt(1),
  },
  {
    id: 'DEMO-CRED-003', organizationId: 'demo-bayview',
    providerAlias: { en: 'Sample Clinician C', es: 'Profesional de ejemplo C' },
    payer: 'UnitedHealthcare', applicationType: { en: 'Location addition', es: 'Alta de ubicación' },
    phase: 'payer_submission', nextAction: { en: 'Submit payer-specific location packet', es: 'Enviar paquete de ubicación específico del pagador' },
    owner: { en: 'Enrollment specialist', es: 'Especialista de inscripción' },
    externalStatus: { en: 'Not connected — simulated status', es: 'Sin conexión — estado simulado' },
    updatedAt: null, source: 'synthetic', sourceReference: null, verifiedAt: null, effectiveDate: null, stages: stagesAt(3),
  },
] as const;

export const revenueStages: readonly { id: string; label: Pair; count: number; action: Pair }[] = [
  { id: 'schedule', label: { en: 'Scheduling', es: 'Programación' }, count: 32, action: { en: 'Appointment readiness', es: 'Preparación de citas' } },
  { id: 'eligibility', label: { en: 'Eligibility', es: 'Elegibilidad' }, count: 28, action: { en: '270/271 inquiries', es: 'Consultas 270/271' } },
  { id: 'auth', label: { en: 'Authorization', es: 'Autorización' }, count: 7, action: { en: 'Prior-auth checkpoints', es: 'Puntos de autorización previa' } },
  { id: 'charges', label: { en: 'Charge & coding', es: 'Cargos y codificación' }, count: 19, action: { en: 'Documentation review', es: 'Revisión de documentación' } },
  { id: 'submit', label: { en: 'Claim submission', es: 'Envío de reclamos' }, count: 41, action: { en: '837 / 999 / 277CA', es: '837 / 999 / 277CA' } },
  { id: 'payer', label: { en: 'Payer processing', es: 'Procesamiento del pagador' }, count: 34, action: { en: '276/277 status checks', es: 'Consultas de estado 276/277' } },
  { id: 'remit', label: { en: 'Remittance', es: 'Remesas' }, count: 21, action: { en: '835 posting & reconciliation', es: 'Registro y conciliación 835' } },
  { id: 'denials', label: { en: 'Denials & appeals', es: 'Denegaciones y apelaciones' }, count: 9, action: { en: 'Ownership & next actions', es: 'Responsable y próximos pasos' } },
  { id: 'ar', label: { en: 'A/R follow-up', es: 'Seguimiento C/C' }, count: 16, action: { en: 'Aging and payer escalation', es: 'Antigüedad y escalamiento' } },
] as const;

export const sampleClaimStatuses = [
  {
    id: 'DEMO-CLM-1001', payer: 'Healthfirst',
    state: { en: 'Payer processing', es: 'En proceso del pagador' },
    next: { en: 'Next 276/277 status inquiry', es: 'Próxima consulta 276/277' },
    source: 'synthetic' as const, verifiedAt: null,
  },
  {
    id: 'DEMO-CLM-1002', payer: 'Aetna',
    state: { en: 'Denial review', es: 'Revisión de denegación' },
    next: { en: 'Review payer response and prepare appeal', es: 'Revisar respuesta y preparar apelación' },
    source: 'synthetic' as const, verifiedAt: null,
  },
  {
    id: 'DEMO-CLM-1003', payer: 'UnitedHealthcare',
    state: { en: 'Awaiting remittance', es: 'En espera de remesa' },
    next: { en: 'Reconcile 835 when received', es: 'Conciliar 835 al recibirlo' },
    source: 'synthetic' as const, verifiedAt: null,
  },
] as const;

export const sampleEligibility = [
  {
    id: 'DEMO-ELG-01', payer: 'Healthfirst',
    label: { en: 'Eligibility check pending', es: 'Verificación de elegibilidad pendiente' },
    next: { en: 'Queue 270/271 inquiry after authorization', es: 'Preparar consulta 270/271 tras autorización' },
    source: 'synthetic' as const, verifiedAt: null,
  },
  {
    id: 'DEMO-ELG-02', payer: 'Aetna',
    label: { en: 'Benefits review required', es: 'Se requiere revisión de beneficios' },
    next: { en: 'Confirm plan-level coverage before service', es: 'Confirmar cobertura del plan antes del servicio' },
    source: 'synthetic' as const, verifiedAt: null,
  },
] as const;

export const sampleSchedule = [
  {
    id: 'DEMO-SCH-01', session: { en: 'Morning clinic block', es: 'Bloque matutino de consulta' },
    load: 16, note: { en: 'Eligibility review before appointments', es: 'Revisar elegibilidad antes de las citas' },
  },
  {
    id: 'DEMO-SCH-02', session: { en: 'Procedure block', es: 'Bloque de procedimientos' },
    load: 6, note: { en: 'Prior-authorization exceptions to resolve', es: 'Resolver excepciones de autorización previa' },
  },
  {
    id: 'DEMO-SCH-03', session: { en: 'Afternoon clinic block', es: 'Bloque vespertino de consulta' },
    load: 10, note: { en: 'Charge capture and scheduling reconciliation', es: 'Conciliar cargos y programación' },
  },
] as const;

export const workspaceDemoText = {
  en: {
    eyebrow: 'Practice Operations Intelligence',
    title: 'Revenue command center',
    description: 'One connected operational view from scheduling through payer reimbursement and provider enrollment.',
    simulation: 'SYNTHETIC PREVIEW · No live EHR, payer, patient or credentialing feeds',
    overview: 'Overview', revenue: 'Revenue cycle', credentialing: 'Credentialing', practice: 'Practice operations',
    payerActivity: 'Claims & payer response', claims: 'Claims in workflow', activeCredentials: 'Open enrollments',
    eligibility: 'Eligibility', exceptions: 'Action exceptions', schedule: 'Scheduled slots',
    payerProcessing: 'Payer processing', enrollmentStatus: 'Provider × payer enrollment tracker',
    details: 'Credentialing pipeline', stages: 'Enrollment milestones', nextAction: 'Next required action',
    owner: 'Responsible owner', lastVerified: 'Last externally verified', notVerified: 'Not verified — demo only',
    applications: 'Enrollment applications', record: 'Application reference', type: 'Application type',
    source: 'Data source', synthetic: 'Synthetic demonstration', status: 'Status',
    rcm: 'Revenue cycle operations', claimPipeline: 'Revenue cycle stage distribution',
    pendingChecks: 'Eligibility & benefits', scheduleBoard: 'Scheduling and practice management',
    requests: 'Practice action queue', provider: 'Clinician / provider', payer: 'Payer',
    refresh: 'Live refresh requires approved integration credentials and tenant access.',
    visibility: 'Every state requires a source, last check, next action and responsible owner before activation.',
    disclaimer: 'All displayed counts, claims, applications, payer responses and provider aliases are fictional product demonstration data. No live status is claimed.',
    liveState: 'LIVE DATA OFF', stageCaption: 'Demonstration status only; not obtained from payer.',
    outstanding: 'Open exceptions', viewCredentialing: 'View credentialing detail', viewClaims: 'Explore claim workflows',
    ready: 'Integration-ready design', compliance: 'No PHI in this demonstration',
    search: 'Search', filter: 'Filter', sort: 'Sort',
    sortById: 'ID', sortByPayer: 'Payer', sortByStatus: 'Status', sortByPhase: 'Phase',
    sortAsc: 'Ascending', sortDesc: 'Descending',
    allStatuses: 'All statuses', allPhases: 'All phases',
    openRecord: 'Open record', closeRecord: 'Close',
    history: 'History', provenance: 'Provenance', syntheticTag: 'SYNTHETIC',
    advanceCredentialing: 'Advance credentialing', denyClaim: 'Trigger denial',
    resetDemo: 'Reset demo', demoOperator: 'Demo operator',
    demoOperatorHint: 'Staff-only synthetic controls. These do not contact payers or EHRs.',
    notifications: 'Notifications', auditTrail: 'Audit events', dirtMetrics: 'DIRT metrics',
    denialRate: 'Denial rate', daysInAr: 'Days in A/R',
    openEnrollmentsMetric: 'Open enrollments', exceptionCount: 'Exception count',
    metricUnavailable: 'Not computed by the operations API',
    eligibilityFlag: 'Eligibility', authFlag: 'Authorization',
    flagOn: 'Cleared', flagOff: 'Exception', flagUnknown: 'Not supplied',
    noResults: 'No matching records', loadError: 'Operations state could not be loaded.',
    actionError: 'The operations action could not be completed.',
    loadingOps: 'Loading operations state…', retry: 'Retry',
    denialQueue: 'Denial queue', emptyHistory: 'No history events returned for this record.',
    emptyNotifications: 'No notifications returned.', emptyAudit: 'No audit events returned.',
    recordDetail: 'Record detail', filterClaims: 'Filter claims',
    filterApplications: 'Filter applications', searchClaims: 'Search claims',
    searchApplications: 'Search applications', operatorAdvance: 'Advance selected enrollment',
    operatorDeny: 'Deny selected claim', selectApplication: 'Enrollment application',
    selectClaim: 'Claim', appointmentLoad: 'Scheduled volume',
    selectPractice: 'Practice', advanceTimeline: 'Advance week',
    setPersona: 'Persona', setTier: 'Catalog tier',
    metricsNote: 'Values are computed by the server from the current synthetic store. Missing values are shown as dashes — they are not estimated here.',
  },
  es: {
    eyebrow: 'Inteligencia de operaciones de la práctica',
    title: 'Centro de control de ingresos',
    description: 'Una vista operativa desde programación hasta reembolso y credencialización.',
    simulation: 'VISTA SINTÉTICA · Sin datos clínicos, del pagador o de credencialización en vivo',
    overview: 'Resumen', revenue: 'Ciclo de ingresos', credentialing: 'Credencialización', practice: 'Operaciones',
    payerActivity: 'Reclamos y respuesta del pagador', claims: 'Reclamos en proceso', activeCredentials: 'Inscripciones abiertas',
    eligibility: 'Elegibilidad', exceptions: 'Excepciones', schedule: 'Citas previstas',
    payerProcessing: 'Procesamiento del pagador', enrollmentStatus: 'Seguimiento profesional × pagador',
    details: 'Proceso de credencialización', stages: 'Hitos de inscripción', nextAction: 'Siguiente acción',
    owner: 'Responsable', lastVerified: 'Última verificación externa', notVerified: 'Sin verificación — solo demostración',
    applications: 'Solicitudes de inscripción', record: 'Referencia', type: 'Tipo de solicitud',
    source: 'Origen de datos', synthetic: 'Demostración sintética', status: 'Estado',
    rcm: 'Operaciones del ciclo de ingresos', claimPipeline: 'Etapas del ciclo de ingresos',
    pendingChecks: 'Elegibilidad y beneficios', scheduleBoard: 'Programación y gestión de la práctica',
    requests: 'Cola operativa', provider: 'Profesional', payer: 'Pagador',
    refresh: 'La actualización en vivo requiere integraciones autorizadas y acceso del cliente.',
    visibility: 'Cada estado requiere fuente, fecha de verificación, siguiente acción y responsable.',
    disclaimer: 'Todos los datos mostrados son ejemplos ficticios. No se afirma información en vivo.',
    liveState: 'DATOS EN VIVO DESACTIVADOS', stageCaption: 'Solo demostración; no obtenido del pagador.',
    outstanding: 'Excepciones abiertas', viewCredentialing: 'Ver credencialización', viewClaims: 'Explorar reclamos',
    ready: 'Diseño preparado para integración', compliance: 'Sin PHI en esta demostración',
    search: 'Buscar', filter: 'Filtrar', sort: 'Ordenar',
    sortById: 'ID', sortByPayer: 'Pagador', sortByStatus: 'Estado', sortByPhase: 'Fase',
    sortAsc: 'Ascendente', sortDesc: 'Descendente',
    allStatuses: 'Todos los estados', allPhases: 'Todas las fases',
    openRecord: 'Abrir registro', closeRecord: 'Cerrar',
    history: 'Historial', provenance: 'Procedencia', syntheticTag: 'SINTÉTICO',
    advanceCredentialing: 'Avanzar credencialización', denyClaim: 'Registrar denegación',
    resetDemo: 'Restablecer demostración', demoOperator: 'Operador de demostración',
    demoOperatorHint: 'Controles sintéticos solo para personal. No contactan pagadores ni EHR.',
    notifications: 'Notificaciones', auditTrail: 'Eventos de auditoría', dirtMetrics: 'Métricas DIRT',
    denialRate: 'Tasa de denegación', daysInAr: 'Días en C/C',
    openEnrollmentsMetric: 'Inscripciones abiertas', exceptionCount: 'Excepciones',
    metricUnavailable: 'No calculado por la API de operaciones',
    eligibilityFlag: 'Elegibilidad', authFlag: 'Autorización',
    flagOn: 'Libre', flagOff: 'Excepción', flagUnknown: 'No indicado',
    noResults: 'Sin registros coincidentes', loadError: 'No se pudo cargar el estado de operaciones.',
    actionError: 'No se pudo completar la acción de operaciones.',
    loadingOps: 'Cargando estado de operaciones…', retry: 'Reintentar',
    denialQueue: 'Cola de denegaciones', emptyHistory: 'No hay eventos de historial para este registro.',
    emptyNotifications: 'No hay notificaciones.', emptyAudit: 'No hay eventos de auditoría.',
    recordDetail: 'Detalle del registro', filterClaims: 'Filtrar reclamos',
    filterApplications: 'Filtrar solicitudes', searchClaims: 'Buscar reclamos',
    searchApplications: 'Buscar solicitudes', operatorAdvance: 'Avanzar inscripción seleccionada',
    operatorDeny: 'Denegar reclamo seleccionado', selectApplication: 'Solicitud de inscripción',
    selectClaim: 'Reclamo', appointmentLoad: 'Volumen programado',
    selectPractice: 'Práctica', advanceTimeline: 'Avanzar semana',
    setPersona: 'Persona', setTier: 'Nivel de catálogo',
    metricsNote: 'Los valores los calcula el servidor a partir del almacén sintético. Si faltan, se muestra un guion; no se estiman aquí.',
  },
} as const;
