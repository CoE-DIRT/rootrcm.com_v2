import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { HIGH_PRIORITY_USD, type DenialQueueTab, type PortalDenialRow } from './types.ts';

type DenialSeed = { rows: PortalDenialRow[] };

function readDenialSeed(): DenialSeed {
  const file = join(process.cwd(), 'data', 'seed', 'portal-denials.example.json');
  return JSON.parse(readFileSync(file, 'utf8')) as DenialSeed;
}

let cached: readonly PortalDenialRow[] | null = null;

export function loadPortalDenials(): readonly PortalDenialRow[] {
  if (!cached) cached = readDenialSeed().rows;
  return cached;
}

export function filterDenialsByTab(
  rows: readonly PortalDenialRow[],
  tab: DenialQueueTab,
): PortalDenialRow[] {
  switch (tab) {
    case 'appeal':
      return rows.filter((row) => row.queueState === 'appeal');
    case 'resolved':
      return rows.filter((row) => row.queueState === 'resolved');
    case 'high':
      return rows.filter((row) => row.amountUsd > HIGH_PRIORITY_USD);
    case 'all':
    default:
      return rows.filter((row) => row.queueState === 'active' || row.queueState === 'appeal');
  }
}

export function buildAppealLetter(row: PortalDenialRow, locale: 'en' | 'es'): string {
  const form = row.formType;
  if (locale === 'es') {
    return [
      `CARTA DE APELACIÓN FORMAL · DEMOSTRACIÓN ${form}`,
      `────────────────────────────────────────`,
      `Reclamo sintético: ${row.claimId}`,
      `Referencia de paciente: ${row.patientRef}`,
      `Pagador: ${row.payer}`,
      `Código de denegación: ${row.code}`,
      `CPT: ${row.cpt}${row.modifier ? ` · Modificador ${row.modifier}` : ''}`,
      `Monto de muestra: $${row.amountUsd.toLocaleString('en-US')}`,
      ``,
      `Asunto: Solicitud de reconsideración — ${row.issue.es}`,
      ``,
      `Estimado departamento de apelaciones:`,
      ``,
      `Esta carta es un borrador educativo de estilo ${form}. No contiene PHI.`,
      `La denegación etiquetada ${row.code} se relaciona con: ${row.remark.es}`,
      ``,
      `Cita de codificación (educativa):`,
      row.citation.es,
      ``,
      `Solicitud: reconsiderar el reclamo sintético ${row.claimId} con la documentación`,
      `de demostración adjunta (no enviada). El adaptador de intermediario permanece desactivado.`,
      ``,
      `Atentamente,`,
      `Equipo de demostración ROOT RCM`,
      `(Simulación — no es un envío electrónico)`,
    ].join('\n');
  }

  return [
    `FORMAL APPEAL LETTER · ${form} DEMONSTRATION`,
    `────────────────────────────────────────`,
    `Synthetic claim: ${row.claimId}`,
    `Patient reference: ${row.patientRef}`,
    `Payer: ${row.payer}`,
    `Denial code: ${row.code}`,
    `CPT: ${row.cpt}${row.modifier ? ` · Modifier ${row.modifier}` : ''}`,
    `Sample amount: $${row.amountUsd.toLocaleString('en-US')}`,
    ``,
    `Subject: Request for reconsideration — ${row.issue.en}`,
    ``,
    `Dear Appeals Department:`,
    ``,
    `This letter is an educational ${form}-style draft. It contains no PHI.`,
    `The labeled denial ${row.code} relates to: ${row.remark.en}`,
    ``,
    `Coding citation (educational):`,
    row.citation.en,
    ``,
    `Request: please reconsider synthetic claim ${row.claimId} with the attached`,
    `demonstration documentation (not transmitted). The clearinghouse adapter stays disabled.`,
    ``,
    `Respectfully,`,
    `ROOT RCM demonstration desk`,
    `(Simulation — not an electronic submission)`,
  ].join('\n');
}
