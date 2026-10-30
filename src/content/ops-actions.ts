import type { Pair } from './operations-demo';

/** Domain next-action English strings → EN/ES pairs. Do not treat English as Spanish. */
export const OPS_NEXT_ACTIONS: Record<string, Pair> = {
  'Complete application intake packet': {
    en: 'Complete application intake packet',
    es: 'Completar el paquete de ingreso de la solicitud',
  },
  'Collect outstanding enrollment documents': {
    en: 'Collect outstanding enrollment documents',
    es: 'Reunir los documentos de inscripción pendientes',
  },
  'Validate CAQH attestation': {
    en: 'Validate CAQH attestation',
    es: 'Validar la atestación CAQH',
  },
  'Complete primary-source verification': {
    en: 'Complete primary-source verification',
    es: 'Completar la verificación de fuente primaria',
  },
  'Confirm payer acknowledgement — submission is not an effective date': {
    en: 'Confirm payer acknowledgement — submission is not an effective date',
    es: 'Confirmar acuse del pagador — el envío no es una fecha de vigencia',
  },
  'Track payer review': {
    en: 'Track payer review',
    es: 'Seguir la revisión del pagador',
  },
  'Request payer review status': {
    en: 'Request payer review status',
    es: 'Solicitar el estado de revisión del pagador',
  },
  'Supply requested payer information': {
    en: 'Supply requested payer information',
    es: 'Entregar la información solicitada por el pagador',
  },
  'Await payer-stated effective date — not inferred from submission': {
    en: 'Await payer-stated effective date — not inferred from submission',
    es: 'Esperar la fecha de vigencia indicada por el pagador — no se infiere del envío',
  },
  'Monitor revalidation window': {
    en: 'Monitor revalidation window',
    es: 'Supervisar la ventana de revalidación',
  },
  'Start revalidation packet': {
    en: 'Start revalidation packet',
    es: 'Iniciar el paquete de revalidación',
  },
  'Review rejection and decide resubmit or withdraw': {
    en: 'Review rejection and decide resubmit or withdraw',
    es: 'Revisar el rechazo y decidir reenviar o retirar',
  },
  'Close withdrawn enrollment': {
    en: 'Close withdrawn enrollment',
    es: 'Cerrar la inscripción retirada',
  },
  'Resolve hold reason': {
    en: 'Resolve hold reason',
    es: 'Resolver el motivo de la retención',
  },
  'Review enrollment status': {
    en: 'Review enrollment status',
    es: 'Revisar el estado de inscripción',
  },
  'Review payer response and prepare appeal': {
    en: 'Review payer response and prepare appeal',
    es: 'Revisar la respuesta del pagador y preparar la apelación',
  },
  'Review denial': {
    en: 'Review denial',
    es: 'Revisar la denegación',
  },
  'Next 276/277 status inquiry': {
    en: 'Next 276/277 status inquiry',
    es: 'Siguiente consulta de estado 276/277',
  },
  'Follow up 276/277 inquiry': {
    en: 'Follow up 276/277 inquiry',
    es: 'Dar seguimiento a la consulta 276/277',
  },
  'Reconcile posted remittance': {
    en: 'Reconcile posted remittance',
    es: 'Conciliar la remesa registrada',
  },
  'Await 999 acknowledgement': {
    en: 'Await 999 acknowledgement',
    es: 'Esperar el acuse 999',
  },
  'Await 277CA acceptance': {
    en: 'Await 277CA acceptance',
    es: 'Esperar la aceptación 277CA',
  },
  'Track payer processing': {
    en: 'Track payer processing',
    es: 'Seguir el procesamiento del pagador',
  },
  'Submit 837': {
    en: 'Submit 837',
    es: 'Enviar el 837',
  },
  'Correct 837 and resubmit': {
    en: 'Correct 837 and resubmit',
    es: 'Corregir el 837 y reenviar',
  },
  'Track appeal acknowledgement': {
    en: 'Track appeal acknowledgement',
    es: 'Seguir el acuse de la apelación',
  },
  'Confirm plan-level coverage before service': {
    en: 'Confirm plan-level coverage before service',
    es: 'Confirmar la cobertura del plan antes del servicio',
  },
  'Submit missing authorization packet': {
    en: 'Submit missing authorization packet',
    es: 'Enviar el paquete de autorización faltante',
  },
};

/** Claim, enrollment, task, eligibility and appointment status codes. */
export const OPS_STATUS_LABELS: Record<string, Pair> = {
  queued: { en: 'Queued', es: 'En cola' },
  '837_submitted': { en: '837 submitted', es: '837 enviado' },
  '999_acknowledged': { en: '999 acknowledged', es: '999 acusada' },
  '277ca_accepted': { en: '277CA accepted', es: '277CA aceptada' },
  '277ca_rejected': { en: '277CA rejected', es: '277CA rechazada' },
  payer_processing: { en: 'Payer processing', es: 'Procesamiento del pagador' },
  '276_277_pending': { en: '276/277 pending', es: '276/277 pendiente' },
  '276_277_adjudicated': { en: '276/277 adjudicated', es: '276/277 adjudicada' },
  '835_posted': { en: '835 posted', es: '835 registrada' },
  denied: { en: 'Denied', es: 'Denegado' },
  appealed: { en: 'Appealed', es: 'Apelado' },
  intake: { en: 'Intake', es: 'Ingreso' },
  documents_pending: { en: 'Documents pending', es: 'Documentos pendientes' },
  caqh_attestation: { en: 'CAQH attestation', es: 'Atestación CAQH' },
  caqh: { en: 'CAQH & documents', es: 'CAQH y documentos' },
  primary_source: { en: 'Primary-source verification', es: 'Verificación de fuente primaria' },
  submitted: { en: 'Submitted', es: 'Enviada' },
  payer_acknowledged: { en: 'Payer acknowledged', es: 'Pagador acusó recibo' },
  payer_submission: { en: 'Payer submission', es: 'Envío al pagador' },
  payer_review: { en: 'Payer review', es: 'Revisión del pagador' },
  additional_information: { en: 'Additional information', es: 'Información adicional' },
  approved_pending_effective: { en: 'Approved, pending effective date', es: 'Aprobada, pendiente de vigencia' },
  effective: { en: 'Effective', es: 'Vigente' },
  revalidation_due: { en: 'Revalidation due', es: 'Revalidación pendiente' },
  rejected: { en: 'Rejected', es: 'Rechazada' },
  withdrawn: { en: 'Withdrawn', es: 'Retirada' },
  on_hold: { en: 'On hold', es: 'En espera' },
  open: { en: 'Open', es: 'Abierta' },
  blocked: { en: 'Blocked', es: 'Bloqueada' },
  done: { en: 'Done', es: 'Hecha' },
  closed: { en: 'Closed', es: 'Cerrada' },
  coded: { en: 'Coded', es: 'Codificada' },
  billed: { en: 'Billed', es: 'Facturada' },
  captured: { en: 'Captured', es: 'Capturada' },
  scheduled: { en: 'Scheduled', es: 'Programada' },
  completed: { en: 'Completed', es: 'Completada' },
  '270_submitted': { en: '270 submitted', es: '270 enviada' },
  '271_active': { en: '271 active', es: '271 activa' },
  '271_inactive': { en: '271 inactive', es: '271 inactiva' },
  '271_error': { en: '271 error', es: 'Error 271' },
  needs_review: { en: 'Needs review', es: 'Requiere revisión' },
  not_required: { en: 'Not required', es: 'No requerida' },
  pending: { en: 'Pending', es: 'Pendiente' },
  approved: { en: 'Approved', es: 'Aprobada' },
  expired: { en: 'Expired', es: 'Vencida' },
  credentialing: { en: 'Credentialing', es: 'Credencialización' },
  denial: { en: 'Denial', es: 'Denegación' },
  eligibility: { en: 'Eligibility', es: 'Elegibilidad' },
  authorization: { en: 'Authorization', es: 'Autorización' },
  ar: { en: 'A/R', es: 'C/C' },
  claim: { en: 'Claim', es: 'Reclamo' },
  preview: { en: 'Preview', es: 'Vista previa' },
};

/** Record titles, owners, notifications and other English domain strings. */
export const OPS_RECORD_LABELS: Record<string, Pair> = {
  'Not connected — simulated status': {
    en: 'Not connected — simulated status',
    es: 'Sin conexión — estado simulado',
  },
  Notification: { en: 'Notification', es: 'Notificación' },
  Eligibility: { en: 'Eligibility', es: 'Elegibilidad' },
  'Unspecified payer': { en: 'Unspecified payer', es: 'Pagador no especificado' },
  update: { en: 'Update', es: 'Actualización' },
  event: { en: 'Event', es: 'Evento' },
  system: { en: 'System', es: 'Sistema' },
  'preview-staff': { en: 'ROOT staff (preview)', es: 'Personal ROOT (vista previa)' },
  'preview-client': { en: 'Practice admin (preview)', es: 'Administración de la práctica (vista previa)' },
  staff: { en: 'Staff', es: 'Personal' },
  client: { en: 'Client', es: 'Cliente' },
  'Sample Clinician A': { en: 'Sample Clinician A', es: 'Profesional de ejemplo A' },
  'Sample Clinician B': { en: 'Sample Clinician B', es: 'Profesional de ejemplo B' },
  'Sample Clinician C': { en: 'Sample Clinician C', es: 'Profesional de ejemplo C' },
  'Clinician A': { en: 'Clinician A', es: 'Profesional A' },
  'ASC Clinician A': { en: 'ASC Clinician A', es: 'Profesional de CA A' },
  'Morning clinic block': { en: 'Morning clinic block', es: 'Bloque matutino de consulta' },
  'Procedure block': { en: 'Procedure block', es: 'Bloque de procedimientos' },
  'Afternoon clinic block': { en: 'Afternoon clinic block', es: 'Bloque vespertino de consulta' },
  'Main office': { en: 'Main office', es: 'Consultorio principal' },
  'North clinic': { en: 'North clinic', es: 'Clínica norte' },
  'South clinic': { en: 'South clinic', es: 'Clínica sur' },
  'OR suite 1': { en: 'OR suite 1', es: 'Quirófano 1' },
  'Denial posted': { en: 'Denial posted', es: 'Denegación registrada' },
  'Enrollment bottleneck': { en: 'Enrollment bottleneck', es: 'Cuello de botella de inscripción' },
  'Documents pending': { en: 'Documents pending', es: 'Documentos pendientes' },
  'Credentialing status advanced': {
    en: 'Credentialing status advanced',
    es: 'Estado de credencialización avanzado',
  },
  'Claim denied': { en: 'Claim denied', es: 'Reclamo denegado' },
  'Synthetic Aetna denial on clm-bv-1002 is open for review.': {
    en: 'Synthetic Aetna denial on clm-bv-1002 is open for review.',
    es: 'La denegación sintética de Aetna en clm-bv-1002 está abierta para revisión.',
  },
  'Fidelis requested additional information on cred-bv-004.': {
    en: 'Fidelis requested additional information on cred-bv-004.',
    es: 'Fidelis solicitó información adicional sobre cred-bv-004.',
  },
  'Enrollment packet for cred-cg-001 still needs documents.': {
    en: 'Enrollment packet for cred-cg-001 still needs documents.',
    es: 'El paquete de inscripción de cred-cg-001 aún necesita documentos.',
  },
  'Healthfirst enrollment follow-up': {
    en: 'Healthfirst enrollment follow-up',
    es: 'Seguimiento de inscripción Healthfirst',
  },
  'Aetna CAQH attestation': { en: 'Aetna CAQH attestation', es: 'Atestación CAQH de Aetna' },
  'UHC location packet acknowledgement': {
    en: 'UHC location packet acknowledgement',
    es: 'Acuse del paquete de ubicación de UHC',
  },
  'Fidelis additional information bottleneck': {
    en: 'Fidelis additional information bottleneck',
    es: 'Cuello de botella de información adicional de Fidelis',
  },
  'Aetna denial review': { en: 'Aetna denial review', es: 'Revisión de denegación de Aetna' },
  'Aetna benefits review before procedure block': {
    en: 'Aetna benefits review before procedure block',
    es: 'Revisión de beneficios de Aetna antes del bloque de procedimientos',
  },
  'Prior-authorization pending for procedure block': {
    en: 'Prior-authorization pending for procedure block',
    es: 'Autorización previa pendiente para el bloque de procedimientos',
  },
  'Cedar Grove document roster': {
    en: 'Cedar Grove document roster',
    es: 'Lista de documentos de Cedar Grove',
  },
  '277CA rejection correction': {
    en: '277CA rejection correction',
    es: 'Corrección del rechazo 277CA',
  },
  'Await UHC stated effective date': {
    en: 'Await UHC stated effective date',
    es: 'Esperar la fecha de vigencia indicada por UHC',
  },
  'ASC appeal tracking': { en: 'ASC appeal tracking', es: 'Seguimiento de apelación del CA' },
  'Coverage snapshot on file for this slot': {
    en: 'Coverage snapshot on file for this slot',
    es: 'Instantánea de cobertura archivada para este horario',
  },
  'Await 271 response': { en: 'Await 271 response', es: 'Esperar respuesta 271' },
  'No auth required': { en: 'No auth required', es: 'Sin autorización requerida' },
  'Authorization on file': { en: 'Authorization on file', es: 'Autorización en archivo' },
  'Claim lacks required attachment': {
    en: 'Claim lacks required attachment',
    es: 'El reclamo carece del adjunto requerido',
  },
  advance_credentialing: { en: 'Advance credentialing', es: 'Avanzar credencialización' },
  deny_claim: { en: 'Deny claim', es: 'Denegar reclamo' },
  reset: { en: 'Reset demo', es: 'Restablecer demostración' },
  advance_timeline: { en: 'Advance timeline', es: 'Avanzar cronograma' },
  set_persona: { en: 'Set persona', es: 'Cambiar persona' },
  set_tier: { en: 'Set catalog tier', es: 'Cambiar nivel del catálogo' },
  'seed.created': { en: 'Seed created', es: 'Semilla creada' },
  snapshot: { en: 'Snapshot', es: 'Instantánea' },
};

function lookupOpsCopy(value: string): Pair | undefined {
  return OPS_NEXT_ACTIONS[value] ?? OPS_STATUS_LABELS[value] ?? OPS_RECORD_LABELS[value];
}

function translateOpsPattern(value: string): Pair | undefined {
  const moved = value.match(/^(\S+) moved from (\S+) to ([A-Za-z0-9_]+)\.?$/);
  if (moved) {
    const [, id, from, to] = moved;
    const fromPair = lookupOpsCopy(from) ?? { en: from, es: from };
    const toPair = lookupOpsCopy(to) ?? { en: to, es: to };
    return {
      en: `${id} moved from ${fromPair.en} to ${toPair.en}.`,
      es: `${id} pasó de ${fromPair.es} a ${toPair.es}.`,
    };
  }
  const enrollmentFollowUp = value.match(/^Enrollment follow-up (.+)$/);
  if (enrollmentFollowUp) {
    return {
      en: `Enrollment follow-up ${enrollmentFollowUp[1]}`,
      es: `Seguimiento de inscripción ${enrollmentFollowUp[1]}`,
    };
  }
  const denialReview = value.match(/^Denial review (.+)$/);
  if (denialReview) {
    return {
      en: `Denial review ${denialReview[1]}`,
      es: `Revisión de denegación ${denialReview[1]}`,
    };
  }
  return undefined;
}

export function translateOpsAction(value: string): Pair {
  return lookupOpsCopy(value) ?? translateOpsPattern(value) ?? { en: value, es: value };
}
