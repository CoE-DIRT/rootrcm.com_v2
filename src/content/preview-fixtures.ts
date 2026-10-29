import organizations from '../../data/seed/organizations.example.json';

export const previewOrgs = organizations.organizations;

export const clientQueue = [
  { id: 'req-1042', title: 'Denial follow-up — sample claim family', owner: 'ROOT specialist', state: 'In review' },
  { id: 'req-1048', title: 'Credentialing packet completeness', owner: 'Practice admin', state: 'Waiting' },
];

export const staffQueue = [
  { id: 'work-22', org: 'Bayview Multi-Specialty Group', task: 'Assigned denial review', state: 'Open' },
  { id: 'work-29', org: 'Cedar Grove Family Practice', task: 'Credentialing checklist', state: 'Blocked' },
];

export const dirtMetrics = [
  { label: 'Net collection rate', value: '—', note: 'Synthetic placeholder; denominator unpublished' },
  { label: 'Denial rate', value: '—', note: 'No live payer feed' },
  { label: 'Days in A/R', value: '—', note: 'Illustrative workspace only' },
];

export const credentialingStages = ['Application', 'Primary source', 'Payer packet', 'Follow-up', 'Effective'];
