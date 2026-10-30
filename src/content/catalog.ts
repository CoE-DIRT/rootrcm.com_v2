/** Canonical public offer catalog. Do not duplicate prices in page copy. */
export const priceCatalog = [
  {
    id: 'free-account-consultation',
    href: '/account',
    priceLabel: { en: 'Free', es: 'Gratis' },
    name: { en: 'Free account & consultation', es: 'Cuenta gratuita y consulta' },
    summary: {
      en: 'Business workspace preview and a consultation request. No patient information.',
      es: 'Vista previa del espacio de trabajo y solicitud de consulta. Sin información de pacientes.',
    },
    figmaNodeId: '4:100',
  },
  {
    id: 'revenue-diagnostic',
    href: '/diagnostic',
    priceLabel: { en: '$2,500', es: '$2,500' },
    name: { en: 'Revenue Diagnostic — $2,500', es: 'Diagnóstico de ingresos — $2,500' },
    summary: {
      en: 'Fixed-fee assessment. Additional work is quoted separately. Checkout is not live.',
      es: 'Evaluación de tarifa fija. El trabajo adicional se cotiza por separado. El pago no está activo.',
    },
    figmaNodeId: '4:103',
  },
  {
    id: 'managed-rcm',
    href: '/custom',
    priceLabel: { en: 'Scoped', es: 'Según alcance' },
    name: { en: 'Managed RCM — scoped', es: 'RCM administrado — según alcance' },
    summary: {
      en: 'Recurring operations with written inclusions, exclusions and owners.',
      es: 'Operaciones recurrentes con inclusiones, exclusiones y responsables por escrito.',
    },
    figmaNodeId: '4:106',
  },
  {
    id: 'dirt-intelligence',
    href: '/technology',
    priceLabel: { en: 'Scoped', es: 'Según alcance' },
    name: { en: 'DIRT Intelligence — scoped', es: 'Inteligencia DIRT — según alcance' },
    summary: {
      en: 'Revenue intelligence previews use synthetic data until import is authorized.',
      es: 'Las vistas de inteligencia de ingresos usan datos sintéticos hasta autorizar importaciones.',
    },
    figmaNodeId: '4:110',
  },
  {
    id: 'credentialing',
    href: '/services',
    priceLabel: { en: 'Per provider', es: 'Por profesional' },
    name: { en: 'Credentialing — per provider', es: 'Credencialización — por profesional' },
    summary: {
      en: 'Enrollment readiness tracking. No live payer connectivity is claimed.',
      es: 'Seguimiento de preparación para inscripción. No se afirma conectividad real con pagadores.',
    },
    figmaNodeId: '4:113',
  },
  {
    id: 'custom-mso',
    href: '/custom',
    priceLabel: { en: 'Custom', es: 'A medida' },
    name: { en: 'Custom MSO partnership', es: 'Alianza MSO a medida' },
    summary: {
      en: 'Qualified opportunity and proposal through a separately approved channel.',
      es: 'Oportunidad calificada y propuesta por un canal aprobado por separado.',
    },
    figmaNodeId: '4:116',
  },
] as const;

export type OfferId = (typeof priceCatalog)[number]['id'];
