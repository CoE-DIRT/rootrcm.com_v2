import type { CopyPair } from '@/content/ecosystem';
import { previewOrgs } from '@/content/preview-fixtures';
import { loadPortalDenials } from '@/features/portal/denials/load-denials';
import type { PortalDenialRow } from '@/features/portal/denials/types';

export const portalOrganizations = previewOrgs;

export type PortalPersona =
  | 'practice-physician'
  | 'practice-admin'
  | 'root-rcm-specialist';

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
  personaPhysician: {
    en: 'Practice Physician/Owner',
    es: 'Médico / propietario de la práctica',
  },
  personaAdmin: { en: 'Practice Administrator', es: 'Administrador de la práctica' },
  personaSpecialist: { en: 'ROOT RCM Specialist', es: 'Especialista RCM de ROOT' },
  /** @deprecated Use personaSpecialist — kept for any residual copy references */
  personaLead: { en: 'ROOT RCM Specialist', es: 'Especialista RCM de ROOT' },
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

export type { PortalDenialRow as DenialRow } from '@/features/portal/denials/types';
export { loadPortalDenials as denialQueueSource } from '@/features/portal/denials/load-denials';

/** ASC denial work queue — synthetic seed; inspector timeline preserved. */
export const denialQueue: readonly PortalDenialRow[] = loadPortalDenials();

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
