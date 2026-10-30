import type { Locale } from '@/i18n/locales';

const en = {
  brand: 'ROOT',
  brandLong: 'ROOT / REVENUE OPERATIONS & OUTCOMES TECHNOLOGY',
  skip: 'Skip to content',
  nav: {
    whyRoot: 'Why ROOT',
    services: 'Services',
    technology: 'Technology',
    plans: 'Plans',
    resources: 'Resources',
    company: 'Company',
    consultation: 'Consultation',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    solutions: 'Solutions',
    signIn: 'Sign in',
  },
  theme: { light: 'Light theme', dark: 'Dark theme', toggle: 'Toggle color theme', short: 'Theme' },
  locale: { en: 'English', es: 'Español', switchTo: 'Switch language' },
  footer: {
    notice: 'Practice-first revenue operations',
    policies: 'Policies',
    resources: 'Resources',
    contact: 'Contact',
    privacy: 'Privacy',
    terms: 'Terms',
    cookies: 'Cookies',
    noPhi: 'Do not submit patient information.',
    copyright: '© 2026 ROOT — Revenue Operations & Outcomes Technology.',
  },
  pending: 'Pending verification',
  preview: 'Synthetic preview — not live operations',
  adaptersOff: 'Appwrite, HubSpot, Stripe and Apollo adapters remain disabled.',
  home: {
    eyebrow: 'ROOT / REVENUE OPERATIONS & OUTCOMES TECHNOLOGY',
    titleDesktop:
      'Handing Over the Keys to Your Revenue Shouldn’t Mean Losing Control of Your Practice.',
    titleTablet: 'More clarity, without changing what works.',
    titleMobile: 'Your practice. Your revenue. Your control.',
    bodyDesktop:
      'A hybrid MSO for RCM, practice operations and revenue intelligence. Keep control of your clinical workflows while making every next action visible.',
    bodyTablet: 'An operating partner that connects services, technology and accountability.',
    bodyMobile: 'Less guesswork. Clear billing, credentialing and operations with ROOT.',
    ctaDesktop: 'Book a free consultation',
    ctaTablet: 'Take a guided look',
    ctaMobile: 'Speak with ROOT',
    explore: 'Explore the connected experience',
    tiles: [
      { title: 'The black-box fear', href: '/why-root' },
      { title: 'Revenue at risk', href: '/solutions' },
      { title: 'You keep your systems', href: '/technology' },
      { title: 'An operating partner', href: '/company' },
      { title: 'Claim-by-claim accountability', href: '/services' },
      { title: 'Free diagnostic exploration', href: '/diagnostic' },
    ],
    mobileTiles: [
      { title: 'Understand a problem', href: '/solutions' },
      { title: 'Explore services', href: '/services' },
      { title: 'See a workspace', href: '/preview/client' },
    ],
    tabletTiles: [
      { title: 'RCM', href: '/services' },
      { title: 'DIRT intelligence', href: '/technology' },
      { title: 'Credentialing', href: '/services' },
      { title: 'Practice operations', href: '/company' },
    ],
    bands: [
      'Discover → Assess → Scope → Onboard → Connect → Execute → Monitor → Optimize',
      'Technology & integration compatibility · status must be verified',
      'Customer voices & proof · editorial slots pending verification',
    ],
    tileHint: 'Explore the scope, evidence and next action.',
  },
  why: {
    title: 'An operating partner, not a black box.',
    body: 'Practice owners keep control. RCM directors get traceability. Finance sees cash-flow context. Credentialing tracks payer readiness. Staff see a smaller change surface.',
    tiles: [
      { title: 'Practice owners: control', href: '/company' },
      { title: 'RCM directors: traceability', href: '/services' },
      { title: 'CFO: cash-flow confidence', href: '/technology' },
      { title: 'Credentialing: payer readiness', href: '/services' },
      { title: 'Staff: change comfort', href: '/resources' },
    ],
    sections: [
      {
        title: 'Practice owners: control',
        body: 'Outsourcing should not become a black box. Owners keep an audit trail and aging A/R visibility. No unverified recovery claims.',
      },
      {
        title: 'RCM directors: traceability',
        body: 'Missed follow-up is a process gap. ROOT shows the next action and owner without inventing collection percentages.',
      },
      {
        title: 'CFO: cash-flow confidence',
        body: 'Finance sees cash-flow context from scoped work, not screenshots presented as outcomes.',
      },
      {
        title: 'Credentialing: payer readiness',
        body: 'Enrollment delays are tracked as a readiness checklist. Live payer partnerships are not claimed.',
      },
      {
        title: 'Staff: change comfort',
        body: 'Modular work, smaller change surface, and systems that stay in place unless a justified change is approved.',
      },
    ],
  },
  services: {
    title: 'Everything your practice needs, working together.',
    body: 'RCM, A/R recovery, credentialing, prior authorization, practice setup, virtual support, reporting and DIRT intelligence.',
    cta: 'Start an assessment',
    tiles: [
      { title: 'Medical billing & coding', href: '/services' },
      { title: 'Denials & appeals', href: '/solutions' },
      { title: 'A/R analysis & recovery', href: '/solutions' },
      { title: 'Eligibility & authorization', href: '/services' },
      { title: 'Credentialing & licensing', href: '/preview/credentialing' },
      { title: 'Practice operations', href: '/company' },
      { title: 'DIRT revenue intelligence', href: '/technology' },
      { title: 'Technology & automation', href: '/technology' },
      { title: 'Virtual practice support', href: '/services' },
    ],
    bands: [
      'Select a concern → scope the work → see responsible teams',
      'Specialty × State × Payer mix intelligence',
      'Systems stay in place unless a justified change is approved',
    ],
  },
  solutions: {
    title: 'Your systems stay. The process gets sharper.',
    body: 'Typical concerns: revenue leakage, aging A/R, denials, enrollment bottlenecks and operational fragmentation. Evidence stays labeled until verified.',
    sections: [
      {
        title: 'Revenue leakage',
        body: 'Identify where work stalls between charge, claim, denial and payment. No sample claim is treated as a result.',
      },
      {
        title: 'Aging A/R',
        body: 'Make aging visible by owner and next action. Figures in this build are synthetic until a tenant import is authorized.',
      },
      {
        title: 'Denials and appeals',
        body: 'Route denials to a named queue. Outcomes are not advertised without verified evidence.',
      },
      {
        title: 'Enrollment bottlenecks',
        body: 'Credentialing and payer enrollment steps stay on a checklist. ROOT does not claim approved EHR or payer integrations.',
      },
      {
        title: 'Operational fragmentation',
        body: 'Keep current systems unless a written change is approved. ROOT is an operating partner, not a forced rip-and-replace.',
      },
    ],
  },
  technology: {
    title: 'Purposeful intelligence. Traceable actions.',
    body: 'DIRT is ROOT’s embedded intelligence capability, not a standalone product. Dashboards in this build are synthetic previews.',
    sections: [
      {
        title: 'DIRT previews',
        body: 'Revenue intelligence screens use fictional practice data and are labeled synthetic. They are not live claims processing.',
      },
      {
        title: 'Systems stay in place',
        body: 'Technology compatibility must be verified per engagement. Status is pending until documented.',
      },
      {
        title: 'Traceable next actions',
        body: 'Each insight is meant to name an owner and a next step. No model is presented as autonomously collecting cash.',
      },
    ],
  },
  plans: {
    title: 'Transparent scope. A clear place to start.',
    body: 'Free consultation, fixed-fee diagnostics, ongoing managed RCM and scoped project engagements. Fees and exclusions confirmed in writing.',
    cta: 'Compare your options',
    bands: [
      'One canonical pricing catalog',
      'Defined deliverables, dependencies and exclusions',
      'Checkout and subscriptions are future production flows',
    ],
  },
  resources: {
    title: 'Methods you can put to work.',
    body: 'Templates, official CMS form links and education. Current forms should come from their issuer. No fabricated case-study results.',
    sections: [
      {
        title: 'Official forms',
        body: 'Current CMS and payer forms must come from their issuer. ROOT does not host substitute government PDFs here.',
      },
      {
        title: 'Templates',
        body: 'Put structure around every exception. Template packs are listed when reviewed; none are implied as certified.',
      },
      {
        title: 'Education',
        body: 'Methods you can apply. Case-study frameworks stay empty until independently verified.',
      },
    ],
    faqs: [
      {
        title: 'Where are the CMS forms?',
        body: 'Use the issuer’s current publication. Links will be added only after they are reviewed.',
      },
      {
        title: 'Are these results from other practices?',
        body: 'No. Editorial proof slots remain pending verification. We would rather verify than embellish.',
      },
    ],
  },
  company: {
    title: 'Infrastructure for independent practices to thrive.',
    body: 'Leadership, careers and partnership pages remain placeholders until biographies, logos and certifications are evidenced.',
    sections: [
      {
        title: 'Public website',
        body: 'Discover the operating partner model without a software switch.',
      },
      {
        title: 'Conversion and CRM',
        body: 'Consultation and diagnostic paths collect business contacts only. Live HubSpot is disabled.',
      },
      {
        title: 'Client portal',
        body: 'Labeled synthetic workspace until Appwrite Auth is approved for an isolated V2 project.',
      },
      {
        title: 'Employee workspace',
        body: 'ROOT staff queues are previews. They cannot impersonate a tenant.',
      },
      {
        title: 'DIRT intelligence',
        body: 'Embedded capability, not a standalone product. Synthetic until import is authorized.',
      },
    ],
    faqs: [
      {
        title: 'Are certifications displayed?',
        body: 'No HIPAA, SOC 2, ISO or payer-partnership marks are shown until evidenced.',
      },
      {
        title: 'Is this the live V1 site?',
        body: 'No. V1 on rootrcm.com is untouched. This is the V2 application shell.',
      },
    ],
  },
  consultation: {
    title: 'Talk with a revenue expert',
    body: 'Describe concerns without sharing patient information. HubSpot sync is disabled in this environment.',
    submit: 'Send business inquiry',
    received: 'Your business inquiry has been received.',
    unavailable: 'Online inquiries are not active yet. No information will be sent or stored.',
  },
  account: {
    title: 'Start without financial commitment',
    body: 'Email or Google/Microsoft sign-in is planned; onboarding collects business information, not PHI.',
    steps: ['Create an account', 'Verify email', 'Identify organization', 'Choose a goal', 'Enter limited workspace'],
  },
  diagnostic: {
    title: 'Revenue Optimization Diagnostic · $2,500',
    body: 'Fixed-fee assessment; additional work is quoted separately. Payment is not collected in this build.',
    steps: ['Scope and exclusions', 'Billing summary', 'Secure payment (planned)', 'Onboarding', 'Deliverable tracking'],
  },
  custom: {
    title: 'Choose managed services',
    body: 'Define inclusion, responsibility, rate structure and dependencies in writing. Subscription checkout is planned, not live.',
    steps: ['Compare plan', 'Request scope', 'Approve contract', 'Subscribe (planned)', 'View entitlement'],
  },
  signIn: {
    title: 'Choose your ROOT workspace.',
    body: 'Authentication is disabled. Use labeled synthetic previews; they are not a successful login.',
    clientPreview: 'Preview client workspace',
    staffPreview: 'Preview staff workspace',
  },
  form: {
    name: 'Name',
    email: 'Business email',
    organization: 'Organization',
    concern: 'Primary concern',
    message: 'How can ROOT help? (no patient details)',
    consent: 'I confirm this is a business inquiry and does not include patient information.',
    required: 'Required',
    working: 'Working…',
    concernOptions: {
      consultation: 'Consultation',
      diagnostic: 'Diagnostic',
      managed: 'Managed RCM',
      custom: 'Custom MSO',
    },
  },
  workspace: {
    client: 'Client workspace',
    staff: 'ROOT staff',
    orgPreview: 'Organization preview',
    tenantNote:
      'Switching tenants requires server membership. This control is labeled preview-only and cannot grant access.',
    overview: 'Overview',
    requests: 'Requests',
    dirt: 'DIRT',
    credentialing: 'Credentialing',
    billing: 'Billing',
    onboarding: 'Onboarding',
    subscriptions: 'Subscriptions',
    queue: 'Queue',
  },
  status: {
    loading: 'Loading',
    empty: 'Nothing to show yet.',
    error: 'This action could not be completed.',
    disabled: 'This integration is disabled.',
  },
  legal: {
    privacyTitle: 'Privacy Policy',
    termsTitle: 'Terms of Use',
    cookiesTitle: 'Cookie Preferences',
    body: 'Legal text is a placeholder pending counsel review. Public forms accept business contacts only. Indexing is off in this environment.',
  },
};

type Messages = typeof en;

const es: Messages = {
  brand: 'ROOT',
  brandLong: 'ROOT / TECNOLOGÍA DE OPERACIONES E INGRESOS',
  skip: 'Saltar al contenido',
  nav: {
    whyRoot: 'Por qué ROOT',
    services: 'Servicios',
    technology: 'Tecnología',
    plans: 'Planes',
    resources: 'Recursos',
    company: 'Empresa',
    consultation: 'Consulta',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    solutions: 'Soluciones',
    signIn: 'Iniciar sesión',
  },
  theme: { light: 'Tema claro', dark: 'Tema oscuro', toggle: 'Cambiar tema', short: 'Tema' },
  locale: { en: 'English', es: 'Español', switchTo: 'Cambiar idioma' },
  footer: {
    notice: 'Operaciones de ingresos centradas en la práctica',
    policies: 'Políticas',
    resources: 'Recursos',
    contact: 'Contacto',
    privacy: 'Privacidad',
    terms: 'Términos',
    cookies: 'Cookies',
    noPhi: 'No envíe información de pacientes.',
    copyright: '© 2026 ROOT — Revenue Operations & Outcomes Technology.',
  },
  pending: 'Pendiente de verificación',
  preview: 'Vista sintética — no es operación en vivo',
  adaptersOff: 'Los adaptadores de Appwrite, HubSpot, Stripe y Apollo siguen desactivados.',
  home: {
    eyebrow: 'ROOT / TECNOLOGÍA DE OPERACIONES E INGRESOS',
    titleDesktop:
      'Entregar las llaves de sus ingresos no debería significar perder el control de su práctica.',
    titleTablet: 'Más claridad, sin cambiar lo que funciona.',
    titleMobile: 'Su práctica. Sus ingresos. Su control.',
    bodyDesktop:
      'Un MSO híbrido para RCM, operaciones e inteligencia de ingresos. Conserve sus flujos clínicos y haga visible cada siguiente acción.',
    bodyTablet: 'Un socio operativo que conecta servicios, tecnología y responsabilidad.',
    bodyMobile: 'Menos incertidumbre. Facturación, credencialización y operaciones claras con ROOT.',
    ctaDesktop: 'Reserve una consulta gratuita',
    ctaTablet: 'Vea una guía',
    ctaMobile: 'Hable con ROOT',
    explore: 'Explore la experiencia conectada',
    tiles: [
      { title: 'El temor de la caja negra', href: '/why-root' },
      { title: 'Ingresos en riesgo', href: '/solutions' },
      { title: 'Usted conserva sus sistemas', href: '/technology' },
      { title: 'Un socio operativo', href: '/company' },
      { title: 'Rendición de cuentas reclamo a reclamo', href: '/services' },
      { title: 'Exploración diagnóstica gratuita', href: '/diagnostic' },
    ],
    mobileTiles: [
      { title: 'Entender un problema', href: '/solutions' },
      { title: 'Explorar servicios', href: '/services' },
      { title: 'Ver un espacio de trabajo', href: '/preview/client' },
    ],
    tabletTiles: [
      { title: 'RCM', href: '/services' },
      { title: 'Inteligencia DIRT', href: '/technology' },
      { title: 'Credencialización', href: '/services' },
      { title: 'Operaciones de la práctica', href: '/company' },
    ],
    bands: [
      'Descubrir → Evaluar → Definir alcance → Incorporar → Conectar → Ejecutar → Monitorear → Optimizar',
      'Compatibilidad tecnológica · el estado debe verificarse',
      'Voces de clientes y pruebas · espacios editoriales pendientes de verificación',
    ],
    tileHint: 'Explore el alcance, la evidencia y la siguiente acción.',
  },
  why: {
    title: 'Un socio operativo, no una caja negra.',
    body: 'Los dueños conservan el control. Los directores de RCM obtienen trazabilidad. Finanzas ve el flujo de caja. Credencialización sigue la preparación ante pagadores. El personal ve menos cambio disruptivo.',
    tiles: [
      { title: 'Dueños: control', href: '/company' },
      { title: 'Directores de RCM: trazabilidad', href: '/services' },
      { title: 'CFO: confianza en el flujo de caja', href: '/technology' },
      { title: 'Credencialización: preparación', href: '/services' },
      { title: 'Personal: cambio manejable', href: '/resources' },
    ],
    sections: [
      {
        title: 'Dueños: control',
        body: 'Externalizar no debe volverse una caja negra. Los dueños conservan auditoría y visibilidad de A/R. Sin cifras no verificadas.',
      },
      {
        title: 'Directores de RCM: trazabilidad',
        body: 'El seguimiento perdido es un problema de proceso. ROOT muestra la siguiente acción y el responsable, sin porcentajes inventados.',
      },
      {
        title: 'CFO: confianza en el flujo de caja',
        body: 'Finanzas ve contexto de caja a partir del trabajo con alcance, no capturas presentadas como resultados.',
      },
      {
        title: 'Credencialización: preparación',
        body: 'Los retrasos de inscripción se siguen en una lista de preparación. No se afirman alianzas con pagadores.',
      },
      {
        title: 'Personal: cambio manejable',
        body: 'Trabajo modular, menor superficie de cambio, y sistemas que permanecen salvo un cambio justificado y aprobado.',
      },
    ],
  },
  services: {
    title: 'Todo lo que su práctica necesita, trabajando en conjunto.',
    body: 'RCM, recuperación de A/R, credencialización, autorización previa, puesta en marcha, apoyo virtual, reportes e inteligencia DIRT.',
    cta: 'Iniciar una evaluación',
    tiles: [
      { title: 'Facturación y codificación médica', href: '/services' },
      { title: 'Denegaciones y apelaciones', href: '/solutions' },
      { title: 'Análisis y recuperación de A/R', href: '/solutions' },
      { title: 'Elegibilidad y autorización', href: '/services' },
      { title: 'Credencialización y licencias', href: '/preview/credentialing' },
      { title: 'Operaciones de la práctica', href: '/company' },
      { title: 'Inteligencia de ingresos DIRT', href: '/technology' },
      { title: 'Tecnología y automatización', href: '/technology' },
      { title: 'Apoyo virtual a la práctica', href: '/services' },
    ],
    bands: [
      'Seleccione una preocupación → defina el trabajo → vea equipos responsables',
      'Inteligencia de especialidad × estado × mix de pagadores',
      'Los sistemas se mantienen salvo un cambio justificado y aprobado',
    ],
  },
  solutions: {
    title: 'Sus sistemas se quedan. El proceso se afila.',
    body: 'Preocupaciones típicas: fuga de ingresos, A/R envejecida, denegaciones, cuellos de inscripción y fragmentación operativa. La evidencia permanece etiquetada hasta verificarse.',
    sections: [
      {
        title: 'Fuga de ingresos',
        body: 'Identifique dónde se detiene el trabajo entre cargo, reclamo, denegación y pago. Ningún reclamo de ejemplo se trata como resultado.',
      },
      {
        title: 'A/R envejecida',
        body: 'Haga visible el envejecimiento por responsable y siguiente acción. Las cifras de esta versión son sintéticas hasta autorizar una importación.',
      },
      {
        title: 'Denegaciones y apelaciones',
        body: 'Dirija las denegaciones a una cola con dueño. Los resultados no se anuncian sin evidencia verificada.',
      },
      {
        title: 'Cuellos de inscripción',
        body: 'La credencialización y la inscripción ante pagadores permanecen en una lista. ROOT no afirma integraciones EHR o de pagadores aprobadas.',
      },
      {
        title: 'Fragmentación operativa',
        body: 'Conserve los sistemas actuales salvo un cambio escrito y aprobado. ROOT es un socio operativo, no un reemplazo forzado.',
      },
    ],
  },
  technology: {
    title: 'Inteligencia con propósito. Acciones trazables.',
    body: 'DIRT es la capacidad de inteligencia embebida de ROOT, no un producto aparte. Los tableros de esta versión son vistas sintéticas.',
    sections: [
      {
        title: 'Vistas DIRT',
        body: 'Las pantallas de inteligencia de ingresos usan datos de práctica ficticios y se etiquetan como sintéticas. No procesan reclamos reales.',
      },
      {
        title: 'Los sistemas se quedan',
        body: 'La compatibilidad tecnológica debe verificarse por compromiso. El estado permanece pendiente hasta documentarse.',
      },
      {
        title: 'Siguientes acciones trazables',
        body: 'Cada hallazgo debe nombrar un responsable y un siguiente paso. Ningún modelo se presenta como cobrador autónomo.',
      },
    ],
  },
  plans: {
    title: 'Alcance transparente. Un punto de partida claro.',
    body: 'Consulta gratuita, diagnósticos de tarifa fija, RCM administrado y proyectos con alcance. Honorarios y exclusiones se confirman por escrito.',
    cta: 'Compare sus opciones',
    bands: [
      'Un catálogo canónico de precios',
      'Entregables, dependencias y exclusiones definidos',
      'Checkout y suscripciones son flujos futuros de producción',
    ],
  },
  resources: {
    title: 'Métodos que puede aplicar.',
    body: 'Plantillas, enlaces a formularios oficiales de CMS y educación. Los formularios vigentes deben venir de su emisor. Sin resultados de casos inventados.',
    sections: [
      {
        title: 'Formularios oficiales',
        body: 'Los formularios vigentes de CMS y pagadores deben venir de su emisor. ROOT no aloja PDF gubernamentales sustitutos aquí.',
      },
      {
        title: 'Plantillas',
        body: 'Ponga estructura en cada excepción. Los paquetes se listan cuando están revisados; ninguno se implica como certificado.',
      },
      {
        title: 'Educación',
        body: 'Métodos aplicables. Los marcos de casos permanecen vacíos hasta verificación independiente.',
      },
    ],
    faqs: [
      {
        title: '¿Dónde están los formularios CMS?',
        body: 'Use la publicación vigente del emisor. Los enlaces se añadirán solo después de revisarse.',
      },
      {
        title: '¿Estos resultados son de otras prácticas?',
        body: 'No. Los espacios de prueba editorial permanecen pendientes. Preferimos verificar antes que adornar.',
      },
    ],
  },
  company: {
    title: 'Infraestructura para que las prácticas independientes prosperen.',
    body: 'Liderazgo, empleo y alianzas permanecen como marcadores de posición hasta evidenciar biografías, logotipos y certificaciones.',
    sections: [
      {
        title: 'Sitio público',
        body: 'Descubra el modelo de socio operativo sin cambiar de software.',
      },
      {
        title: 'Conversión y CRM',
        body: 'Consulta y diagnóstico recogen solo contactos empresariales. HubSpot en vivo está desactivado.',
      },
      {
        title: 'Portal del cliente',
        body: 'Espacio sintético etiquetado hasta que Appwrite Auth se apruebe en un proyecto V2 aislado.',
      },
      {
        title: 'Espacio del personal',
        body: 'Las colas del personal ROOT son vistas previas. No pueden suplantar a un inquilino.',
      },
      {
        title: 'Inteligencia DIRT',
        body: 'Capacidad embebida, no un producto aparte. Sintética hasta autorizar importaciones.',
      },
    ],
    faqs: [
      {
        title: '¿Se muestran certificaciones?',
        body: 'No se muestran marcas HIPAA, SOC 2, ISO ni alianzas con pagadores hasta evidenciarse.',
      },
      {
        title: '¿Este es el sitio V1 en vivo?',
        body: 'No. V1 en rootrcm.com no se toca. Esta es la aplicación V2.',
      },
    ],
  },
  consultation: {
    title: 'Hable con un experto en ingresos',
    body: 'Describa preocupaciones sin compartir información de pacientes. La sincronización con HubSpot está desactivada en este entorno.',
    submit: 'Enviar consulta empresarial',
    received: 'Se ha recibido su consulta empresarial.',
    unavailable: 'Las consultas en línea aún no están activas. No se enviará ni guardará información.',
  },
  account: {
    title: 'Empiece sin compromiso financiero',
    body: 'El inicio de sesión con correo o Google/Microsoft está planificado; el alta recoge información empresarial, no PHI.',
    steps: [
      'Crear una cuenta',
      'Verificar correo',
      'Identificar organización',
      'Elegir un objetivo',
      'Entrar a un espacio limitado',
    ],
  },
  diagnostic: {
    title: 'Diagnóstico de optimización de ingresos · $2,500',
    body: 'Evaluación de tarifa fija; el trabajo adicional se cotiza aparte. En esta versión no se cobra.',
    steps: [
      'Alcance y exclusiones',
      'Resumen de facturación',
      'Pago seguro (planificado)',
      'Incorporación',
      'Seguimiento del entregable',
    ],
  },
  custom: {
    title: 'Elija servicios administrados',
    body: 'Defina inclusión, responsabilidad, estructura de tarifas y dependencias por escrito. El alta de suscripción está planificada, no activa.',
    steps: [
      'Comparar plan',
      'Solicitar alcance',
      'Aprobar contrato',
      'Suscribirse (planificado)',
      'Ver derechos',
    ],
  },
  signIn: {
    title: 'Elija su espacio ROOT.',
    body: 'La autenticación está desactivada. Use vistas sintéticas etiquetadas; no son un inicio de sesión exitoso.',
    clientPreview: 'Vista previa del cliente',
    staffPreview: 'Vista previa del personal',
  },
  form: {
    name: 'Nombre',
    email: 'Correo empresarial',
    organization: 'Organización',
    concern: 'Preocupación principal',
    message: '¿Cómo puede ayudar ROOT? (sin datos de pacientes)',
    consent: 'Confirmo que esta es una consulta empresarial y no incluye información de pacientes.',
    required: 'Obligatorio',
    working: 'Procesando…',
    concernOptions: {
      consultation: 'Consulta',
      diagnostic: 'Diagnóstico',
      managed: 'RCM administrado',
      custom: 'MSO a medida',
    },
  },
  workspace: {
    client: 'Espacio del cliente',
    staff: 'Personal ROOT',
    orgPreview: 'Vista previa de organización',
    tenantNote:
      'Cambiar de inquilino requiere membresía en el servidor. Este control está etiquetado como vista previa y no otorga acceso.',
    overview: 'Resumen',
    requests: 'Solicitudes',
    dirt: 'DIRT',
    credentialing: 'Credencialización',
    billing: 'Facturación',
    onboarding: 'Incorporación',
    subscriptions: 'Suscripciones',
    queue: 'Cola',
  },
  status: {
    loading: 'Cargando',
    empty: 'Aún no hay nada que mostrar.',
    error: 'No se pudo completar esta acción.',
    disabled: 'Esta integración está desactivada.',
  },
  legal: {
    privacyTitle: 'Política de privacidad',
    termsTitle: 'Términos de uso',
    cookiesTitle: 'Preferencias de cookies',
    body: 'El texto legal es un marcador de posición pendiente de revisión jurídica. Los formularios públicos solo aceptan contactos empresariales. La indexación está desactivada.',
  },
};

export const messages = { en, es };
export type { Messages };

export function copy(locale: Locale): Messages {
  return messages[locale];
}
