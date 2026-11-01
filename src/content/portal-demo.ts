import type { CopyPair } from '@/content/ecosystem';
import { previewOrgs } from '@/content/preview-fixtures';

export const portalOrganizations = previewOrgs;

export type PortalPersona = 'practice-admin' | 'operations-lead';

export const portalNav = [
  { href: '/portal', key: 'dashboard' },
  { href: '/portal/denials', key: 'denials' },
  { href: '/portal/prior-authorizations', key: 'authorizations' },
  { href: '/portal/credentialing', key: 'credentialing' },
  { href: '/portal/dirt', key: 'dirt' },
  { href: '/portal/settings', key: 'settings' },
] as const;

export const portalLabels = {
  dashboard: { en: 'Dashboard', es: 'Tablero' },
  denials: { en: 'A/R and denial work queue', es: 'Cola de CxC y denegaciones' },
  authorizations: { en: 'Prior authorizations', es: 'Autorizaciones previas' },
  credentialing: { en: 'Credentialing roster', es: 'Plantilla de acreditación' },
  dirt: { en: 'DIRT intelligence', es: 'Inteligencia DIRT' },
  settings: { en: 'Practice settings', es: 'Ajustes de la práctica' },
  personaAdmin: { en: 'Practice admin', es: 'Administración de la práctica' },
  personaLead: { en: 'ROOT operations lead', es: 'Líder de operaciones ROOT' },
  personaNote: {
    en: 'Demo control only. Switching personas does not grant access and does not bypass server authorization.',
    es: 'Solo un control de demostración. Cambiar de persona no otorga acceso ni omite la autorización del servidor.',
  },
  synthetic: {
    en: 'Synthetic demo figures. Not verified customer results. No live payer connection.',
    es: 'Cifras sintéticas de demostración. No son resultados verificados de clientes. Sin conexión a pagadores.',
  },
  orgLabel: { en: 'Organization', es: 'Organización' },
  personaLabel: { en: 'Demo persona', es: 'Persona de demostración' },
  publicSite: { en: 'Public site', es: 'Sitio público' },
} as const satisfies Record<string, CopyPair>;

export type DenialRow = {
  id: string;
  payer: string;
  status: CopyPair;
  code: 'CO-4' | 'CO-16' | 'PR-204';
  priority: 'high' | 'medium';
  issue: CopyPair;
  timeline: { en: readonly string[]; es: readonly string[] };
  remark: CopyPair;
};

export const denialQueue: readonly DenialRow[] = [
  {
    id: 'syn-den-01',
    payer: 'Medicare',
    status: { en: 'Open', es: 'Abierta' },
    code: 'CO-16',
    priority: 'high',
    issue: { en: 'Implant carve-out mismatch', es: 'Desajuste de carve-out de implante' },
    timeline: {
      en: [
        'Day 0 · Synthetic remittance posted',
        'Day 2 · Demo label CO-16 applied',
        'Day 5 · Appeal draft not sent',
      ],
      es: [
        'Día 0 · Remesa sintética registrada',
        'Día 2 · Etiqueta demo CO-16 aplicada',
        'Día 5 · Borrador de apelación no enviado',
      ],
    },
    remark: {
      en: 'Demo remark: the sample line does not match the contract carve-out exhibit. Not a live payer note.',
      es: 'Nota demo: la línea de muestra no coincide con el anexo de carve-out. No es una nota real del pagador.',
    },
  },
  {
    id: 'syn-den-02',
    payer: 'Commercial',
    status: { en: 'In review', es: 'En revisión' },
    code: 'CO-4',
    priority: 'medium',
    issue: { en: 'MPPR 50% sample', es: 'Muestra MPPR 50%' },
    timeline: {
      en: [
        'Day 1 · Sample multiple-procedure reduction labeled',
        'Day 3 · Owner assigned in the demo queue',
        'Day 6 · No payer portal was contacted',
      ],
      es: [
        'Día 1 · Reducción de procedimiento múltiple etiquetada',
        'Día 3 · Responsable asignado en la cola demo',
        'Día 6 · No se contactó un portal de pagador',
      ],
    },
    remark: {
      en: 'Demo remark: CO-4 is a synthetic label for a 50% MPPR teaching row.',
      es: 'Nota demo: CO-4 es una etiqueta sintética para una fila didáctica de MPPR al 50%.',
    },
  },
  {
    id: 'syn-den-03',
    payer: 'BCBS',
    status: { en: 'Waiting', es: 'En espera' },
    code: 'PR-204',
    priority: 'high',
    issue: {
      en: 'Missing operative note / unbundled codes',
      es: 'Falta nota operatoria / códigos no agrupados',
    },
    timeline: {
      en: [
        'Day 0 · Synthetic status set to waiting',
        'Day 4 · Documentation request recorded as a label only',
        'Day 7 · Escalation checklist incomplete',
      ],
      es: [
        'Día 0 · Estado sintético en espera',
        'Día 4 · Pedido de documentación solo como etiqueta',
        'Día 7 · Lista de escalamiento incompleta',
      ],
    },
    remark: {
      en: 'Demo remark: PR-204 marks a sample documentation gap. Do not paste an operative note here.',
      es: 'Nota demo: PR-204 marca una brecha documental de muestra. No pegue una nota operatoria aquí.',
    },
  },
];

export const appealTemplate: CopyPair = {
  en: 'Synthetic appeal outline: name the contract exhibit, the demo denial label, the owner and the next business day. Do not include patient identifiers, dates of birth, or clinical narrative.',
  es: 'Esquema sintético de apelación: cite el anexo del contrato, la etiqueta demo, el responsable y el siguiente día hábil. No incluya identificadores de pacientes, fechas de nacimiento ni narrativa clínica.',
};

export const escalationChecklist: { en: readonly string[]; es: readonly string[] } = {
  en: [
    'Owner is a role, not a patient',
    'Deadline is a business date on the demo row',
    'Payer portal login is not available',
    'File is not emailed from this screen',
  ],
  es: [
    'El responsable es un rol, no un paciente',
    'La fecha es de negocio en la fila demo',
    'No hay acceso a un portal de pagador',
    'Esta pantalla no envía el archivo por correo',
  ],
};

export type RosterRow = {
  id: string;
  name: CopyPair;
  npi: string;
  caqh: CopyPair;
  license: CopyPair;
  privilege: CopyPair;
};

export const credentialingRoster: readonly RosterRow[] = [
  {
    id: 'syn-pro-01',
    name: { en: 'Synthetic surgeon A', es: 'Cirujano sintético A' },
    npi: 'SYNTHETIC-NPI-PLACEHOLDER-A',
    caqh: { en: 'Sample: attestation current', es: 'Muestra: atestación vigente' },
    license: { en: 'Sample expiration 2027-03-01', es: 'Vencimiento de muestra 2027-03-01' },
    privilege: { en: 'ASC privilege sample 2026-12-15', es: 'Privilegio ASC de muestra 2026-12-15' },
  },
  {
    id: 'syn-pro-02',
    name: { en: 'Synthetic surgeon B', es: 'Cirujano sintético B' },
    npi: 'SYNTHETIC-NPI-PLACEHOLDER-B',
    caqh: { en: 'Sample: reattestation due', es: 'Muestra: reatestación pendiente' },
    license: { en: 'Sample expiration 2026-08-20 · alert', es: 'Vencimiento de muestra 2026-08-20 · alerta' },
    privilege: { en: 'ASC privilege sample 2026-06-01 · alert', es: 'Privilegio ASC de muestra 2026-06-01 · alerta' },
  },
  {
    id: 'syn-pro-03',
    name: { en: 'Synthetic APP C', es: 'APP sintético C' },
    npi: 'SYNTHETIC-NPI-PLACEHOLDER-C',
    caqh: { en: 'Sample: not started', es: 'Muestra: no iniciada' },
    license: { en: 'Sample expiration 2028-01-12', es: 'Vencimiento de muestra 2028-01-12' },
    privilege: { en: 'No ASC privilege on this demo row', es: 'Sin privilegio ASC en esta fila demo' },
  },
];

export function illustrativeAr(orgId: string) {
  const seed = orgId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const total = 180000 + (seed % 17) * 15000;
  const over90 = 12 + (seed % 9);
  const clean = 86 + (seed % 7);
  const denial = 4 + (seed % 6);
  const unmapped = 8000 + (seed % 11) * 900;
  const bands = [
    { key: '0-30', share: 0.46 },
    { key: '31-60', share: 0.24 },
    { key: '61-90', share: 0.16 },
    { key: '90+', share: 0.14 },
  ] as const;
  return {
    total,
    over90,
    clean,
    denial,
    unmapped,
    bands: bands.map((band) => ({ key: band.key, amount: Math.round(total * band.share) })),
  };
}

export const priorAuthRows: readonly { id: string; label: CopyPair; state: CopyPair }[] = [
  {
    id: 'syn-pa-01',
    label: { en: 'Sample procedure request', es: 'Solicitud de procedimiento de muestra' },
    state: { en: 'Not submitted · payer connectivity disabled', es: 'No enviada · conectividad de pagador desactivada' },
  },
  {
    id: 'syn-pa-02',
    label: { en: 'Sample implant request', es: 'Solicitud de implante de muestra' },
    state: { en: 'Demo draft only', es: 'Solo borrador de demostración' },
  },
  {
    id: 'syn-pa-03',
    label: { en: 'Sample facility request', es: 'Solicitud de centro de muestra' },
    state: { en: 'Disabled adapter · no status from a payer', es: 'Adaptador desactivado · sin estado de un pagador' },
  },
];
