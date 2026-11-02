import type { CopyPair } from '@/content/ecosystem';

export type ServiceBand = 'revenue' | 'operations' | 'technology' | 'strategy';

export type ServiceCapability = {
  id: string;
  band: ServiceBand;
  name: CopyPair;
  summary: CopyPair;
  steps: { en: readonly string[]; es: readonly string[] };
  kpi: CopyPair;
};

/** Sixteen Demo 6 V4_CATALOG capabilities. Administrative scope only. */
export const serviceCapabilities: readonly ServiceCapability[] = [
  {
    id: 'rcm',
    band: 'revenue',
    name: { en: 'Managed revenue cycle', es: 'Ciclo de ingresos gestionado' },
    summary: {
      en: 'Charge capture, claim submission, posting, denials, A/R follow-up and financial controls.',
      es: 'Cargos, envío, pagos, denegaciones, cuentas por cobrar y control financiero.',
    },
    steps: {
      en: ['Baseline billing inventory', 'Prioritized claim work queues', 'Daily exception resolution', 'Transparent collections reporting'],
      es: ['Inventario base de facturación', 'Colas priorizadas de reclamos', 'Resolución diaria de excepciones', 'Informe de cobros con responsables'],
    },
    kpi: { en: 'Illustrative: named owner per open exception', es: 'Ilustrativo: responsable por excepción abierta' },
  },
  {
    id: 'dirt',
    band: 'technology',
    name: { en: 'DIRT / data intelligence', es: 'DIRT / inteligencia de datos' },
    summary: {
      en: 'Revenue leakage signals, payer behavior and prioritized financial action. Sample data until an import is authorized.',
      es: 'Señales de fuga, comportamiento de pagadores y acción financiera prioritaria. Datos de muestra hasta autorizar una importación.',
    },
    steps: {
      en: ['Connect approved source data', 'Normalize and reconcile', 'Map state, specialty and payer', 'Distribute owned actions'],
      es: ['Conectar fuentes aprobadas', 'Normalizar y conciliar', 'Mapear estado, especialidad y pagador', 'Repartir acciones con responsable'],
    },
    kpi: { en: 'Illustrative: actions with an owner', es: 'Ilustrativo: acciones con responsable' },
  },
  {
    id: 'credential',
    band: 'revenue',
    name: { en: 'Provider credentialing and enrollment', es: 'Acreditación e inscripción' },
    summary: {
      en: 'CAQH, PECOS/NPPES readiness, payer applications, roster work and revalidation tracking. No live payer connection is claimed.',
      es: 'Preparación CAQH, PECOS/NPPES, solicitudes, plantilla y revalidación. No se afirma conexión en vivo con pagadores.',
    },
    steps: {
      en: ['Provider data collection', 'Licensure and taxonomy checks', 'Payer-specific submissions', 'Follow-up and maintenance'],
      es: ['Recolección de datos del profesional', 'Licencia y taxonomía', 'Envíos según el pagador', 'Seguimiento y mantenimiento'],
    },
    kpi: { en: 'Illustrative: packet completeness', es: 'Ilustrativo: completitud del paquete' },
  },
  {
    id: 'licensing',
    band: 'operations',
    name: { en: 'Practice and provider licensing', es: 'Licencias de práctica y profesionales' },
    summary: {
      en: 'State professional, group and facility license tracking and renewals.',
      es: 'Seguimiento de licencias profesionales, de grupo y de instalación por estado.',
    },
    steps: {
      en: ['Identify license class', 'Verify state board requirements', 'Assemble applications', 'Track renewals and evidence'],
      es: ['Identificar el tipo de licencia', 'Verificar requisitos del estado', 'Armar solicitudes', 'Seguir renovaciones y evidencia'],
    },
    kpi: { en: 'Illustrative: days until a renewal date', es: 'Ilustrativo: días hasta una renovación' },
  },
  {
    id: 'practice-launch',
    band: 'operations',
    name: { en: 'Practice formation and launch', es: 'Creación y apertura de prácticas' },
    summary: {
      en: 'Launch planning, taxonomies, payer setup, workflows and vendor readiness.',
      es: 'Plan de apertura, taxonomías, pagadores, procesos y preparación de proveedores.',
    },
    steps: {
      en: ['Launch readiness map', 'Entity and payer checklist', 'Staff and technology design', 'Go-live milestones'],
      es: ['Mapa de preparación', 'Lista de entidad y pagadores', 'Diseño de personal y tecnología', 'Hitos de salida en vivo'],
    },
    kpi: { en: 'Illustrative: checklist items still open', es: 'Ilustrativo: ítems abiertos de la lista' },
  },
  {
    id: 'virtual',
    band: 'operations',
    name: { en: 'Virtual assistance', es: 'Asistencia virtual' },
    summary: {
      en: 'Administrative support for verified nonclinical workflows.',
      es: 'Apoyo administrativo para procesos no clínicos verificados.',
    },
    steps: {
      en: ['Define shift and role', 'Train on approved tools', 'Assign an accountable manager', 'Review service measures'],
      es: ['Definir turno y rol', 'Formar en herramientas aprobadas', 'Asignar un responsable', 'Revisar medidas del servicio'],
    },
    kpi: { en: 'Illustrative: tasks closed in the agreed window', es: 'Ilustrativo: tareas cerradas en la ventana acordada' },
  },
  {
    id: 'office',
    band: 'operations',
    name: { en: 'Front-office and back-office support', es: 'Soporte de recepción y administración' },
    summary: {
      en: 'Eligibility, referrals, scheduling coordination, follow-up and documentation workflows.',
      es: 'Elegibilidad, referidos, coordinación de citas, seguimiento y documentación.',
    },
    steps: {
      en: ['Map incoming tasks', 'Set escalation rules', 'Operate daily queues', 'Measure response time'],
      es: ['Mapear tareas entrantes', 'Definir escalamiento', 'Operar colas diarias', 'Medir tiempo de respuesta'],
    },
    kpi: { en: 'Illustrative: queue age', es: 'Ilustrativo: antigüedad de la cola' },
  },
  {
    id: 'scheduling',
    band: 'operations',
    name: { en: 'Scheduling and referral coordination', es: 'Citas y coordinación de referidos' },
    summary: {
      en: 'Appointment flows, confirmations, rescheduling and referral routing with defined boundaries.',
      es: 'Citas, confirmaciones, cambios y derivación con límites definidos.',
    },
    steps: {
      en: ['Map appointment types', 'Configure approved scripts', 'Track task outcomes', 'Review capacity trends'],
      es: ['Mapear tipos de cita', 'Configurar guiones aprobados', 'Seguir resultados de tareas', 'Revisar tendencia de capacidad'],
    },
    kpi: { en: 'Illustrative: referrals without a next step', es: 'Ilustrativo: referidos sin siguiente paso' },
  },
  {
    id: 'prior-auth',
    band: 'revenue',
    name: { en: 'Prior authorization operations', es: 'Operaciones de autorización previa' },
    summary: {
      en: 'Benefit and policy checks, request preparation, documentation and status escalation. Not a live payer submission.',
      es: 'Verificación de beneficios y póliza, preparación, documentación y escalamiento. No es un envío en vivo al pagador.',
    },
    steps: {
      en: ['Identify payer rules', 'Assemble supporting documents', 'Track authorization status', 'Document the outcome'],
      es: ['Identificar reglas del pagador', 'Reunir documentos de apoyo', 'Seguir el estado', 'Documentar el resultado'],
    },
    kpi: { en: 'Illustrative: requests still unowned', es: 'Ilustrativo: solicitudes sin responsable' },
  },
  {
    id: 'website',
    band: 'technology',
    name: { en: 'Practice websites and digital experience', es: 'Sitios y experiencia digital' },
    summary: {
      en: 'Accessible practice sites, content, patient-facing pages and SEO foundations.',
      es: 'Sitios accesibles, contenidos, páginas para pacientes y bases de SEO.',
    },
    steps: {
      en: ['Discovery and wireframes', 'Design system', 'Content, SEO and accessibility', 'Publish and maintain'],
      es: ['Descubrimiento y wireframes', 'Sistema de diseño', 'Contenido, SEO y accesibilidad', 'Publicar y mantener'],
    },
    kpi: { en: 'Illustrative: pages with an owner', es: 'Ilustrativo: páginas con responsable' },
  },
  {
    id: 'automation',
    band: 'technology',
    name: { en: 'Workflow automation and integrations', es: 'Automatización e integraciones' },
    summary: {
      en: 'Scoped EHR or clearinghouse work and measured automation, only where authorized. Adapters in this build stay disabled.',
      es: 'Trabajo acotado de EHR o clearinghouse y automatización medida, solo si se autoriza. Los adaptadores de esta versión siguen desactivados.',
    },
    steps: {
      en: ['Inventory systems', 'Verify permissions and APIs', 'Prototype in a safe environment', 'Monitor and adjust'],
      es: ['Inventariar sistemas', 'Verificar permisos y API', 'Prototipar en un entorno seguro', 'Monitorear y ajustar'],
    },
    kpi: { en: 'Illustrative: integrations still unverified', es: 'Ilustrativo: integraciones aún sin verificar' },
  },
  {
    id: 'coding',
    band: 'revenue',
    name: { en: 'Coding quality and compliance review', es: 'Calidad de codificación y revisión' },
    summary: {
      en: 'Documentation-gap review for codes and modifiers. This site does not publish code sets or billing advice.',
      es: 'Revisión de brechas documentales para códigos y modificadores. Este sitio no publica conjuntos de códigos ni asesoría de facturación.',
    },
    steps: {
      en: ['Inventory review rules', 'Scan documentation gaps', 'Review sample encounters', 'Track corrected causes'],
      es: ['Inventariar reglas de revisión', 'Detectar brechas documentales', 'Revisar encuentros de muestra', 'Seguir causas corregidas'],
    },
    kpi: { en: 'Illustrative: samples waiting for review', es: 'Ilustrativo: muestras en espera de revisión' },
  },
  {
    id: 'mso',
    band: 'operations',
    name: { en: 'MSO and management services', es: 'Servicios de gestión MSO' },
    summary: {
      en: 'Operations, staffing, vendor oversight, analytics and accountable delivery under a written scope.',
      es: 'Operaciones, personal, supervisión de proveedores, analítica y entrega responsable bajo un alcance escrito.',
    },
    steps: {
      en: ['Operating-model assessment', 'Document responsibilities', 'Launch managed services', 'Executive review cadence'],
      es: ['Evaluar el modelo operativo', 'Documentar responsabilidades', 'Iniciar servicios gestionados', 'Cadencia de revisión ejecutiva'],
    },
    kpi: { en: 'Illustrative: decisions with a recorded owner', es: 'Ilustrativo: decisiones con responsable registrado' },
  },
  {
    id: 'advisory',
    band: 'strategy',
    name: { en: 'RCM advisory and revenue optimization', es: 'Consultoría y optimización de ingresos' },
    summary: {
      en: 'Audits, denial root-cause diagnostics and a 90-day plan. Not a promise of recovered dollars.',
      es: 'Auditorías, diagnóstico de causas de denegación y un plan de 90 días. No promete dólares recuperados.',
    },
    steps: {
      en: ['Quantify a baseline', 'Identify preventable friction', 'Prioritize opportunities', 'Document a 90-day roadmap'],
      es: ['Cuantificar una línea base', 'Identificar fricción evitable', 'Priorizar oportunidades', 'Documentar un plan de 90 días'],
    },
    kpi: { en: 'Illustrative: roadmap items dated', es: 'Ilustrativo: ítems del plan con fecha' },
  },
  {
    id: 'analytics',
    band: 'technology',
    name: { en: 'Financial reporting and analytics', es: 'Informes y analítica financiera' },
    summary: {
      en: 'Executive scorecards and payer-mix views using synthetic figures until a source is authorized.',
      es: 'Tableros ejecutivos y mezcla de pagadores con cifras sintéticas hasta autorizar una fuente.',
    },
    steps: {
      en: ['Define measures', 'Validate sources', 'Develop dashboards', 'Review deviations'],
      es: ['Definir medidas', 'Validar fuentes', 'Desarrollar tableros', 'Revisar desviaciones'],
    },
    kpi: { en: 'Illustrative: measures still unpublished', es: 'Ilustrativo: medidas aún sin publicar' },
  },
  {
    id: 'patient',
    band: 'operations',
    name: { en: 'Patient financial experience', es: 'Experiencia financiera del paciente' },
    summary: {
      en: 'Statement and balance workflows. This demo does not store patient balances or clinical details.',
      es: 'Flujos de estados de cuenta y saldos. Esta demo no guarda saldos de pacientes ni datos clínicos.',
    },
    steps: {
      en: ['Review balance policy', 'Design approved communication', 'Track disputes and follow-up', 'Measure the experience'],
      es: ['Revisar la política de saldos', 'Diseñar la comunicación aprobada', 'Seguir disputas', 'Medir la experiencia'],
    },
    kpi: { en: 'Illustrative: statements without an owner', es: 'Ilustrativo: estados sin responsable' },
  },
];

export const serviceBands = ['all', 'revenue', 'operations', 'technology', 'strategy'] as const;
export type ServiceBandFilter = (typeof serviceBands)[number];
