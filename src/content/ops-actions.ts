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

export function translateOpsAction(value: string): Pair {
  return OPS_NEXT_ACTIONS[value] ?? { en: value, es: value };
}
