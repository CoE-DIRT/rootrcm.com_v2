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
    specialties: 'Specialties',
    locations: 'New York',
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
  preview: 'Sample workspace — fictional data',
  adaptersOff: 'Appwrite, HubSpot, Stripe and Apollo adapters remain disabled.',
  home: {
    eyebrow: 'RCM and revenue operations',
    title: 'Take control of your revenue — without giving up your EHR.',
    body: 'ROOT works inside the systems your practice already uses. Every claim, denial and credentialing task gets a named owner, a reason and a next action — and you see the same numbers we do.',
    primaryCta: 'Get a free revenue leak review',
    secondaryCta: 'Explore the sample workspace',
    trust: [
      'No forced EHR replacement',
      'Named exception owners',
      'Weekly cash reconciliation',
      'HIPAA-aligned processes',
    ],
    methodEyebrow: 'How it works',
    methodTitle: 'What actually changes when ROOT takes over the work?',
    methodBody: 'Three moves, repeated every week. Nothing about your clinical workflow has to change.',
    method: [
      {
        title: 'Reveal',
        body: 'We baseline your open claims, denials, aging A/R and enrollment gaps so you can see exactly where revenue is waiting.',
      },
      {
        title: 'Assign',
        body: 'Every exception gets a named owner, a reason and a due date. Nothing sits in an anonymous backlog.',
      },
      {
        title: 'Reconcile',
        body: 'Each week, cash collected is reconciled against open work — on a dashboard you and ROOT both read.',
      },
    ],
    servicesEyebrow: 'Services',
    servicesTitle: 'Who handles each part of my revenue cycle?',
    sameEyebrow: 'Shared visibility',
    sameTitle: 'Will I see the same numbers you see?',
    sameBody: 'Yes. Your team and ROOT work from one shared view of claims, denials, credentialing and cash — so weekly reviews start from facts, not from a report you have to trust.',
    samePoints: [
      'One dashboard for your team and ours',
      'Every open item shows its owner and next action',
      'Cash reconciled weekly against open work',
    ],
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
    body: 'Typical concerns: revenue leakage, aging A/R, denials, enrollment bottlenecks and disconnected operations.',
    sections: [
      {
        title: 'Revenue leakage',
        body: 'Identify where work stalls between charge, claim, denial and payment. No sample claim is treated as a result.',
      },
      {
        title: 'Aging A/R',
        body: 'Make aging visible by owner and next action, so nothing quietly ages past timely filing.',
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
    body: 'DIRT is the intelligence built into ROOT’s service. It turns payer activity into owned next actions.',
    cta: 'Open DIRT preview',
    sections: [
      {
        title: 'DIRT previews',
        body: 'The sample workspace uses fictional practice data so you can explore the screens before connecting anything.',
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
      'One price list for every engagement',
      'Defined deliverables, dependencies and exclusions',
      'Speak with our team to choose the right engagement',
    ],
  },
  resources: {
    title: 'Methods you can put to work.',
    body: 'Practical guides, checklists and pointers to official CMS and payer forms.',
    sections: [
      {
        title: 'Official forms',
        body: 'Current CMS and payer forms must come from their issuer. ROOT does not host substitute government PDFs here.',
      },
      {
        title: 'Templates',
        body: 'Put structure around every exception with checklists your team can reuse.',
      },
      {
        title: 'Education',
        body: 'Methods you can apply this week to find stalled claims and enrollment gaps.',
      },
    ],
    faqs: [
      {
        title: 'Where are the CMS forms?',
        body: 'Always use the issuer’s current publication. We link to official sources rather than hosting copies.',
      },
      {
        title: 'Are these results from other practices?',
        body: 'We only publish customer results with the customer’s written approval. Ask us for references during your consultation.',
      },
    ],
  },
  company: {
    title: 'Infrastructure for independent practices to thrive.',
    body: 'A focused revenue operations partner for independent practices, care teams and growing healthcare organizations.',
    sections: [
      {
        title: 'Partnership',
        body: 'An operating partner that works inside your current software.',
      },
      {
        title: 'Getting started',
        body: 'Consultation and diagnostic requests collect business contact details only — never patient information.',
      },
      {
        title: 'Client portal',
        body: 'A secure workspace where your team follows claims, denials and credentialing in one place.',
      },
      {
        title: 'Specialist team',
        body: 'ROOT specialists work assigned queues with role-based access to your organization only.',
      },
      {
        title: 'DIRT intelligence',
        body: 'Revenue intelligence built into the service — not a separate product to buy.',
      },
    ],
    faqs: [
      {
        title: 'Are certifications displayed?',
        body: 'We only display certifications or partnerships that can be verified. Ask for our security documentation during your consultation.',
      },
      {
        title: 'Can I talk to someone before committing?',
        body: 'Yes. Book a free consultation or request the revenue leak review — there is no obligation to continue.',
      },
    ],
  },
  consultation: {
    title: 'Talk with a revenue expert',
    body: 'Tell us about your practice, revenue goals or operational challenges. Please do not share patient information.',
    submit: 'Send business inquiry',
    received: 'Your business inquiry has been received.',
    unavailable: 'Online inquiries are not open yet. Please email, call or message us on WhatsApp.',
    checkoutUnavailable: 'Online checkout is not open yet. No payment was created.',
  },
  account: {
    title: 'Start without financial commitment',
    body: 'Explore the platform experience and speak with ROOT about establishing your practice workspace.',
    steps: [
      'Create an account',
      'Verify email',
      'Identify organization',
      'Choose a goal',
      'Enter limited workspace',
    ],
  },
  diagnostic: {
    title: 'Revenue Optimization Diagnostic · $2,500',
    body: 'Fixed-fee assessment of where your revenue is stalling. Any follow-on work is quoted separately and only with your approval.',
    steps: [
      'Scope and exclusions',
      'Billing summary',
      'Secure payment',
      'Onboarding',
      'Deliverable tracking',
    ],
  },
  custom: {
    title: 'Choose managed services',
    body: 'Inclusions, responsibilities, rates and dependencies are agreed in writing before work begins.',
    steps: [
      'Compare plan',
      'Request scope',
      'Approve contract',
      'Subscribe',
      'View entitlement',
    ],
  },
  signIn: {
    title: 'Choose your ROOT workspace.',
    body: 'Explore example client and team workspaces. Request your own organization account through the ROOT team.',
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
    errors: {
      required: 'Required',
      nameShort: 'Enter a business contact name.',
      nameLong: 'Name is too long.',
      emailInvalid: 'Enter a valid business email.',
      emailLong: 'Email is too long.',
      orgShort: 'Enter an organization name.',
      orgLong: 'Organization is too long.',
      messageLong: 'Message is too long.',
      consentRequired: 'Consent is required to send a business inquiry.',
      phiRejected: 'Do not include patient, clinical or identifying health details.',
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
    primaryNav: 'Primary navigation',
    billingPreviewTitle: 'Subscription management preview',
    billingNoEntitlement: 'No entitlement granted from this preview',
    tierMapTitle: 'Preview workspace tiers',
    tierMapBody:
      'Free, Growth and Managed are operations preview labels. They map to catalog offers — Free account & consultation, DIRT Intelligence, and Managed RCM. There is no Enterprise plan.',
    queue: 'Queue',
    clientTitle: 'Your practice, in control.',
    staffTitle: 'Your assigned work, in context.',
    staffOrg: 'ROOT operations',
    credentialingTitle: 'Credentialing readiness',
    dirtPreviewTitle: 'DIRT revenue intelligence preview',
    onboardingTitle: 'Onboarding preview',
    onboardingNote: 'Auth is disabled; these steps are not a live account.',
    requestsTitle: 'Service requests',
    requestsEmptyTitle: 'No requests',
    requestsEmptyBody: 'Synthetic queue is empty.',
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
    cookiesNecessary: 'Necessary cookies stay on.',
    cookiesAnalytics: 'Analytics',
    cookiesMarketing: 'Marketing',
    cookiesSave: 'Save choices',
    cookiesMemory: 'This browser is not storing preferences. Choices apply to this tab only.',
    body: 'The full policy text is being finalized with counsel and will be published here. Public forms accept business contacts only. Questions? Write to info@rootrcm.com.',
  },
  commercial: {
    servicesEyebrow: 'Services',
    servicesCta: 'See the full service map',
    specialtiesEyebrow: 'Specialty revenue operations',
    specialtiesTitle: 'Does ROOT know how my specialty bills?',
    specialtiesBody:
      'Each specialty bills differently. We start from the payer rules, codes-in-context and documentation habits your specialty actually lives with.',
    specialtiesCta: 'Browse all specialties',
    specialtiesIndexTitle: 'Which specialties does ROOT support?',
    specialtiesIndexBody:
      'Pick your specialty to see the billing work, common denial patterns and credentialing steps ROOT manages for it.',
    specialtyKicker: 'Specialty RCM',
    idKicker: 'Specialty focus',
    idHeadline: 'Infectious Disease Revenue Operations — From Authorization to Reimbursement',
    idLead:
      'Authorization, infusion and OPAT billing pathways, J-code unit hygiene, and medical versus pharmacy benefit routing — as administrative revenue operations for ID groups.',
    idClinicalDisclaimer:
      'This is not clinical care, stewardship advice or a treatment protocol. ROOT does not diagnose, prescribe or manage patients.',
    idSections: [
      {
        title: 'OPAT as billing work',
        body: 'Outpatient parenteral antimicrobial therapy creates a chain of site-of-service, supply and visit claims. ROOT tracks the administrative sequence and the owner of each packet. We do not design the regimen.',
      },
      {
        title: 'Infusion: buy-and-bill vs specialty pharmacy',
        body: 'The same infusion can travel as a medical-benefit buy-and-bill claim or as a pharmacy-benefit specialty fill. The operations problem is routing, units and who bills. Product choice stays with the practice.',
      },
      {
        title: 'J-code unit hygiene',
        body: 'Drug-unit claims fail on wastage documentation, calendar alignment and unit math. ROOT reviews the current code set with your billing lead rather than relying on a static list.',
      },
      {
        title: 'Authorization sequencing',
        body: 'ID schedules stall when authorization, start of care and the first billed unit are out of order. ROOT names the next administrative action. Coverage decisions remain with the plan.',
      },
      {
        title: 'Medical vs pharmacy benefit',
        body: 'Benefit routing is an enrollment and claims problem: which side of the plan the drug falls on, and which portal the packet uses. It is not a clinical substitution decision.',
      },
    ],
    ecosystemEyebrow: 'Technology ecosystem',
    ecosystemTitle: 'Can I keep my software?',
    ecosystemBody:
      'ROOT works alongside the EHR/PM platforms, clearinghouses and enrollment portals practices already rely on. Access is confirmed with each practice during scoping.',
    ecosystemDisclaimer:
      'Mention of a vendor does not imply endorsement, certification, a commercial relationship or a working API connection.',
    nyEyebrow: 'New York',
    nyTitle: 'New York payers',
    nyBody: 'Public listings of New York health plans, by program type.',
    nyCta: 'View New York payer pages',
    nyNoContract: 'A listing is not a ROOT contract, network status, or payer partnership.',
    nyNoOffice: 'ROOT has no published New York City office.',
    nyNoOfficeConfirm: 'Service location is agreed with each practice.',
    nyPageTitle: 'New York payer directory',
    nyPageBody: 'Public sources for New York payer programs and administrative requirements.',
    nycTitle: 'New York City boroughs',
    nycBody: 'The same public payer sources, for practices in the five boroughs.',
    nyDirectoryTitle: 'Public payer sources',
    boroughsLabel: 'Five boroughs',
    lastReviewed: 'Last reviewed',
    source: 'Source',
    programType: {
      commercial: 'Commercial',
      medicaid_mco: 'Medicaid MCO',
      medicare_advantage: 'Medicare Advantage',
      marketplace: 'Marketplace',
      medicare: 'Medicare',
      medicaid: 'Medicaid',
    },
    dirtEyebrow: 'DIRT intelligence',
    dirtTitle: 'Purposeful intelligence. Traceable next actions.',
    dirtBody:
      'DIRT is the intelligence built into ROOT’s service. It turns claims, denials and payer activity into a short list of next actions with owners.',
    dirtCta: 'Read the technology brief',
    proofEyebrow: 'Proof & voices',
    proofTitle: 'What can I verify before I sign?',
    proofBody:
      'We publish customer results, security attestations and service commitments only when they can be verified. Ask for any of them during your consultation.',
    proofEmptyTitle: 'Unpublished',
    proofEmptyBody:
      'Customer stories appear here once the customer approves them in writing.',
    pricingEyebrow: 'Plans',
    conversionTitle: 'Start with a business conversation',
    conversionBody:
      'Tell us where revenue feels stuck. The consultation is free and there is no obligation. Please do not include patient information.',
    conversionCta: 'Book a free consultation',
    journeyCta: 'See the client journey preview',
    journeyCtaBody:
      'See every step from first conversation to active service, with what happens at each stage and who owns it.',
    comparePlans: 'Compare plans',
    codeDisclaimer:
      'Code-level guidance is reviewed with your billing lead during onboarding, because code sets change every year.',
    marqueePause: 'Pause scrolling platforms',
    marqueePlay: 'Resume scrolling platforms',
    bottleneckEyebrow: 'Where revenue leaks',
    bottleneckTitle: 'Find your bottleneck. See the next move.',
    bottleneckBody:
      'Select an operational concern to explore how ROOT traces stalled revenue, credentialing delays, and system change.',
    bottleneckCards: [
      {
        title: 'Where is my money?',
        body: 'Trace claims, denials and accountable owners across clearinghouses and payer work queues.',
        cta: 'Explore claims workspace',
        href: '/preview/client',
      },
      {
        title: 'Why are enrollments stalled?',
        body: 'Validate missing documents, CAQH and PECOS requirements, and payer effective dates.',
        cta: 'Inspect credentialing',
        href: '/preview/credentialing',
      },
      {
        title: 'Can I keep my software?',
        body: 'Plan safer operational change around existing EHR/PM systems without forced replacements.',
        cta: 'View technology model',
        href: '/technology',
      },
    ],
    transitionEyebrow: 'Frictionless transition with real controls',
    transitionTitle: 'A safer transition, in three clear moves.',
    transitionBody:
      'Activity is not accountability. Technology is not intelligence. Every exception needs an owner, a reason and a documented next action.',
    transitionSteps: [
      {
        title: 'Connect & inventory',
        body: 'Baseline current billing inventory, payer mix, and clearinghouse queues without workflow disruption.',
      },
      {
        title: 'Assign exception owners',
        body: 'Every unpaid claim, denial, and credentialing milestone receives a named owner, reason code, and due date.',
      },
      {
        title: 'Transparent collections cadence',
        body: 'Weekly operational reviews reconcile cash collected against open work queues with verifiable audit trails.',
      },
    ],
    transitionAssurance:
      'No forced EHR replacement. Data access and downtime require a practice-specific plan.',
    philosophyEyebrow: 'Why ROOT exists',
    philosophyTitle: 'Outsourcing billing shouldn’t mean losing control.',
    philosophyBody:
      'ROOT brings outsourced revenue cycle management, operational intelligence and practice support into one accountable model. We begin with the people, tools and payer dependencies already in your practice—not an unnecessary EHR replacement.',
    philosophyCta: 'Explore our approach',
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
    specialties: 'Especialidades',
    locations: 'Nueva York',
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
  preview: 'Espacio de muestra — datos ficticios',
  adaptersOff: 'Los adaptadores de Appwrite, HubSpot, Stripe y Apollo siguen desactivados.',
  home: {
    eyebrow: 'RCM y operaciones de ingresos',
    title: 'Tome el control de sus ingresos, sin renunciar a su EHR.',
    body: 'ROOT trabaja dentro de los sistemas que su práctica ya utiliza. Cada reclamo, denegación y tarea de acreditación tiene un responsable, un motivo y una próxima acción, y usted ve las mismas cifras que nosotros.',
    primaryCta: 'Revisión gratuita de fugas de ingresos',
    secondaryCta: 'Explore el espacio de muestra',
    trust: [
      'Sin reemplazo forzado del EHR',
      'Responsables con nombre por excepción',
      'Conciliación semanal de caja',
      'Procesos alineados con HIPAA',
    ],
    methodEyebrow: 'Cómo funciona',
    methodTitle: '¿Qué cambia realmente cuando ROOT asume el trabajo?',
    methodBody: 'Tres movimientos, repetidos cada semana. Su flujo clínico no tiene que cambiar.',
    method: [
      {
        title: 'Revelar',
        body: 'Establecemos la línea base de reclamos abiertos, denegaciones, cuentas por cobrar y brechas de inscripción para que vea dónde esperan sus ingresos.',
      },
      {
        title: 'Asignar',
        body: 'Cada excepción recibe un responsable, un motivo y una fecha límite. Nada queda en una cola anónima.',
      },
      {
        title: 'Conciliar',
        body: 'Cada semana, la caja cobrada se concilia con el trabajo abierto, en un tablero que usted y ROOT leen por igual.',
      },
    ],
    servicesEyebrow: 'Servicios',
    servicesTitle: '¿Quién se encarga de cada parte de mi ciclo de ingresos?',
    sameEyebrow: 'Visibilidad compartida',
    sameTitle: '¿Veré las mismas cifras que ustedes?',
    sameBody: 'Sí. Su equipo y ROOT trabajan con una sola vista de reclamos, denegaciones, acreditación y caja, para que cada revisión semanal empiece con hechos.',
    samePoints: [
      'Un tablero para su equipo y el nuestro',
      'Cada elemento abierto muestra su responsable y próxima acción',
      'Caja conciliada semanalmente contra el trabajo abierto',
    ],
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
    body: 'Preocupaciones típicas: fuga de ingresos, A/R envejecida, denegaciones, cuellos de inscripción y fragmentación operativa.',
    sections: [
      {
        title: 'Fuga de ingresos',
        body: 'Identifique dónde se detiene el trabajo entre cargo, reclamo, denegación y pago. Ningún reclamo de ejemplo se trata como resultado.',
      },
      {
        title: 'A/R envejecida',
        body: 'Haga visible el envejecimiento por responsable y próxima acción, para que nada supere el plazo de presentación.',
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
    body: 'DIRT es la inteligencia integrada en el servicio de ROOT. Convierte la actividad de pagadores en próximas acciones con responsable.',
    cta: 'Abrir vista DIRT',
    sections: [
      {
        title: 'Vistas DIRT',
        body: 'El espacio de muestra usa datos ficticios para que explore las pantallas antes de conectar nada.',
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
      'Una sola lista de precios para cada servicio',
      'Entregables, dependencias y exclusiones definidos',
      'Consulte con nuestro equipo para elegir el servicio adecuado',
    ],
  },
  resources: {
    title: 'Métodos que puede aplicar.',
    body: 'Guías prácticas, listas de verificación y enlaces a formularios oficiales de CMS y pagadores.',
    sections: [
      {
        title: 'Formularios oficiales',
        body: 'Los formularios vigentes de CMS y pagadores deben venir de su emisor. ROOT no aloja PDF gubernamentales sustitutos aquí.',
      },
      {
        title: 'Plantillas',
        body: 'Ponga estructura en cada excepción con listas que su equipo puede reutilizar.',
      },
      {
        title: 'Educación',
        body: 'Métodos que puede aplicar esta semana para encontrar reclamos detenidos y brechas de inscripción.',
      },
    ],
    faqs: [
      {
        title: '¿Dónde están los formularios CMS?',
        body: 'Use siempre la publicación vigente del emisor. Enlazamos a fuentes oficiales en lugar de alojar copias.',
      },
      {
        title: '¿Estos resultados son de otras prácticas?',
        body: 'Solo publicamos resultados de clientes con su aprobación por escrito. Pida referencias durante su consulta.',
      },
    ],
  },
  company: {
    title: 'Infraestructura para que las prácticas independientes prosperen.',
    body: 'Un socio especializado en operaciones de ingresos para prácticas independientes y organizaciones sanitarias en crecimiento.',
    sections: [
      {
        title: 'Alianza',
        body: 'Un socio operativo que trabaja dentro de su software actual.',
      },
      {
        title: 'Cómo empezar',
        body: 'Las solicitudes de consulta y diagnóstico recogen solo datos de contacto empresarial, nunca información de pacientes.',
      },
      {
        title: 'Portal del cliente',
        body: 'Un espacio seguro donde su equipo sigue reclamos, denegaciones y acreditación en un solo lugar.',
      },
      {
        title: 'Equipo especialista',
        body: 'Los especialistas de ROOT trabajan colas asignadas con acceso por rol solo a su organización.',
      },
      {
        title: 'Inteligencia DIRT',
        body: 'Inteligencia de ingresos integrada en el servicio, no un producto aparte.',
      },
    ],
    faqs: [
      {
        title: '¿Se muestran certificaciones?',
        body: 'Solo mostramos certificaciones o alianzas cuando pueden verificarse. Pida nuestra documentación de seguridad durante la consulta.',
      },
      {
        title: '¿Puedo hablar con alguien antes de comprometerme?',
        body: 'Sí. Reserve una consulta gratuita o solicite la revisión de fugas de ingresos, sin obligación de continuar.',
      },
    ],
  },
  consultation: {
    title: 'Hable con un experto en ingresos',
    body: 'Cuéntenos sobre su práctica, objetivos de ingresos y retos operativos. No comparta información de pacientes.',
    submit: 'Enviar consulta empresarial',
    received: 'Se ha recibido su consulta empresarial.',
    unavailable:
      'Las consultas en línea aún no están abiertas. Escríbanos, llámenos o use WhatsApp.',
    checkoutUnavailable: 'El pago en línea aún no está abierto. No se creó ningún cobro.',
  },
  account: {
    title: 'Empiece sin compromiso financiero',
    body: 'Explore la experiencia de la plataforma y consulte con ROOT para establecer el espacio de su práctica.',
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
    body: 'Evaluación de tarifa fija de dónde se detienen sus ingresos. Cualquier trabajo adicional se cotiza aparte y solo con su aprobación.',
    steps: [
      'Alcance y exclusiones',
      'Resumen de facturación',
      'Pago seguro',
      'Incorporación',
      'Seguimiento del entregable',
    ],
  },
  custom: {
    title: 'Elija servicios administrados',
    body: 'Inclusiones, responsabilidades, tarifas y dependencias se acuerdan por escrito antes de empezar.',
    steps: [
      'Comparar plan',
      'Solicitar alcance',
      'Aprobar contrato',
      'Suscribirse',
      'Ver derechos',
    ],
  },
  signIn: {
    title: 'Elija su espacio ROOT.',
    body: 'Explore espacios de ejemplo para clientes y equipos. Solicite a ROOT una cuenta para su organización.',
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
    errors: {
      required: 'Obligatorio',
      nameShort: 'Introduzca un nombre de contacto empresarial.',
      nameLong: 'El nombre es demasiado largo.',
      emailInvalid: 'Introduzca un correo empresarial válido.',
      emailLong: 'El correo es demasiado largo.',
      orgShort: 'Introduzca el nombre de la organización.',
      orgLong: 'La organización es demasiado larga.',
      messageLong: 'El mensaje es demasiado largo.',
      consentRequired: 'Se requiere consentimiento para enviar una consulta empresarial.',
      phiRejected: 'No incluya datos de pacientes, clínicos ni identificadores de salud.',
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
    primaryNav: 'Navegación principal',
    billingPreviewTitle: 'Vista previa de gestión de suscripciones',
    billingNoEntitlement: 'Esta vista previa no otorga acceso a servicios',
    tierMapTitle: 'Niveles del espacio de vista previa',
    tierMapBody:
      'Free, Growth y Managed son etiquetas de vista previa operativa. Se asignan a ofertas del catálogo: cuenta gratuita y consulta, Inteligencia DIRT y RCM administrado. No hay un plan Enterprise.',
    queue: 'Cola',
    clientTitle: 'Su práctica, bajo control.',
    staffTitle: 'Su trabajo asignado, en contexto.',
    staffOrg: 'Operaciones ROOT',
    credentialingTitle: 'Preparación de credencialización',
    dirtPreviewTitle: 'Vista previa de inteligencia DIRT',
    onboardingTitle: 'Vista previa de incorporación',
    onboardingNote: 'La autenticación está desactivada; estos pasos no son una cuenta real.',
    requestsTitle: 'Solicitudes de servicio',
    requestsEmptyTitle: 'Sin solicitudes',
    requestsEmptyBody: 'La cola sintética está vacía.',
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
    cookiesNecessary: 'Las cookies necesarias permanecen activas.',
    cookiesAnalytics: 'Analítica',
    cookiesMarketing: 'Marketing',
    cookiesSave: 'Guardar elecciones',
    cookiesMemory: 'Este navegador no guarda las preferencias. Las elecciones aplican solo a esta pestaña.',
    body: 'El texto completo de la política se está finalizando con asesoría legal y se publicará aquí. Los formularios públicos solo aceptan contactos empresariales. ¿Preguntas? Escriba a info@rootrcm.com.',
  },
  commercial: {
    servicesEyebrow: 'Servicios',
    servicesCta: 'Ver el mapa completo de servicios',
    specialtiesEyebrow: 'Operaciones de ingresos por especialidad',
    specialtiesTitle: '¿Conoce ROOT cómo factura mi especialidad?',
    specialtiesBody:
      'Cada especialidad factura de forma distinta. Partimos de las reglas de pagadores, los códigos en contexto y los hábitos de documentación de su especialidad.',
    specialtiesCta: 'Ver todas las especialidades',
    specialtiesIndexTitle: '¿Qué especialidades atiende ROOT?',
    specialtiesIndexBody:
      'Elija su especialidad para ver el trabajo de facturación, los patrones de denegación y los pasos de acreditación que ROOT gestiona.',
    specialtyKicker: 'RCM por especialidad',
    idKicker: 'Especialidad destacada',
    idHeadline:
      'Operaciones de ingresos en enfermedades infecciosas — de la autorización al reembolso',
    idLead:
      'Autorización, vías de facturación de infusión y OPAT, higiene de unidades J-code y enrutamiento de beneficio médico frente a de farmacia: operaciones administrativas de ingresos para grupos de ID.',
    idClinicalDisclaimer:
      'Esto no es atención clínica, consejo de stewardship ni un protocolo de tratamiento. ROOT no diagnostica, receta ni gestiona pacientes.',
    idSections: [
      {
        title: 'OPAT como trabajo de facturación',
        body: 'La terapia antimicrobiana parenteral ambulatoria crea una cadena de reclamos de sitio de servicio, insumos y visitas. ROOT sigue la secuencia administrativa y el responsable de cada paquete. No diseñamos el régimen.',
      },
      {
        title: 'Infusión: buy-and-bill frente a farmacia especializada',
        body: 'La misma infusión puede viajar como reclamo buy-and-bill de beneficio médico o como dispensación de farmacia especializada. El problema operativo es el enrutamiento, las unidades y quién factura. La elección del producto queda en la práctica.',
      },
      {
        title: 'Higiene de unidades J-code',
        body: 'Los reclamos de unidades de medicamento fallan por documentación de desperdicio, alineación de calendario y matemática de unidades. ROOT revisa el conjunto de códigos vigente con su responsable de facturación en lugar de usar una lista estática.',
      },
      {
        title: 'Secuencia de autorización',
        body: 'Las agendas de ID se detienen cuando la autorización, el inicio de atención y la primera unidad facturada están fuera de orden. ROOT nombra la siguiente acción administrativa. Las decisiones de cobertura siguen en el plan.',
      },
      {
        title: 'Beneficio médico frente a de farmacia',
        body: 'El enrutamiento de beneficio es un problema de inscripción y reclamos: de qué lado del plan cae el medicamento y qué portal usa el paquete. No es una decisión de sustitución clínica.',
      },
    ],
    ecosystemEyebrow: 'Ecosistema tecnológico',
    ecosystemTitle: '¿Puedo conservar mi software?',
    ecosystemBody:
      'ROOT trabaja junto a las plataformas EHR/PM, intermediarios y portales de inscripción que su práctica ya usa. El acceso se confirma con cada práctica durante el alcance.',
    ecosystemDisclaimer:
      'Mencionar una marca no implica respaldo, certificación, relación comercial ni una conexión API funcional.',
    nyEyebrow: 'Nueva York',
    nyTitle: 'Pagadores de Nueva York',
    nyBody: 'Listados públicos de planes de salud de Nueva York, por tipo de programa.',
    nyCta: 'Ver las páginas de pagadores de Nueva York',
    nyNoContract:
      'Un listado no es un contrato, un estado de red ni una alianza de ROOT con el pagador.',
    nyNoOffice: 'ROOT no tiene una oficina publicada en la ciudad de Nueva York.',
    nyNoOfficeConfirm: 'La ubicación del servicio se acuerda con cada práctica.',
    nyPageTitle: 'Directorio de pagadores de Nueva York',
    nyPageBody:
      'Fuentes públicas sobre programas de pagadores y requisitos administrativos de Nueva York.',
    nycTitle: 'Boroughs de la ciudad de Nueva York',
    nycBody: 'Las mismas fuentes públicas, para prácticas en los cinco boroughs.',
    nyDirectoryTitle: 'Fuentes públicas de pagadores',
    boroughsLabel: 'Cinco boroughs',
    lastReviewed: 'Última revisión',
    source: 'Fuente',
    programType: {
      commercial: 'Comercial',
      medicaid_mco: 'MCO de Medicaid',
      medicare_advantage: 'Medicare Advantage',
      marketplace: 'Mercado',
      medicare: 'Medicare',
      medicaid: 'Medicaid',
    },
    dirtEyebrow: 'Inteligencia DIRT',
    dirtTitle: 'Inteligencia con propósito. Siguientes acciones trazables.',
    dirtBody:
      'DIRT es la inteligencia integrada en el servicio de ROOT. Convierte reclamos, denegaciones y actividad de pagadores en una lista corta de próximas acciones con responsable.',
    dirtCta: 'Leer el resumen de tecnología',
    proofEyebrow: 'Pruebas y voces',
    proofTitle: '¿Qué puedo verificar antes de firmar?',
    proofBody:
      'Publicamos resultados de clientes, certificaciones de seguridad y compromisos de servicio solo cuando pueden verificarse. Pídalos durante su consulta.',
    proofEmptyTitle: 'Sin publicar',
    proofEmptyBody:
      'Las historias de clientes aparecerán aquí cuando el cliente las apruebe por escrito.',
    pricingEyebrow: 'Planes',
    conversionTitle: 'Empiece con una conversación empresarial',
    conversionBody:
      'Cuéntenos dónde se atascan sus ingresos. La consulta es gratuita y sin compromiso. No incluya información de pacientes.',
    conversionCta: 'Reserve una consulta gratuita',
    journeyCta: 'Ver la vista previa del recorrido del cliente',
    journeyCtaBody:
      'Vea cada paso desde la primera conversación hasta el servicio activo, con lo que ocurre en cada etapa y quién es responsable.',
    comparePlans: 'Comparar planes',
    codeDisclaimer:
      'La orientación a nivel de código se revisa con su responsable de facturación durante la incorporación, porque los códigos cambian cada año.',
    marqueePause: 'Pausar plataformas en desplazamiento',
    marqueePlay: 'Reanudar plataformas en desplazamiento',
    bottleneckEyebrow: 'Dónde se pierden ingresos',
    bottleneckTitle: 'Encuentre el bloqueo. Vea el siguiente paso.',
    bottleneckBody:
      'Seleccione una preocupación operativa para ver cómo ROOT rastrea ingresos detenidos, retrasos de acreditación y cambios de sistemas.',
    bottleneckCards: [
      {
        title: '¿Dónde está mi dinero?',
        body: 'Rastree reclamos, denegaciones y responsables a través de intermediarios y colas de trabajo.',
        cta: 'Explorar espacio de reclamos',
        href: '/preview/client',
      },
      {
        title: '¿Por qué se detiene la inscripción?',
        body: 'Valide documentos faltantes, requisitos de CAQH y PECOS y fechas de vigencia de pagadores.',
        cta: 'Examinar acreditación',
        href: '/preview/credentialing',
      },
      {
        title: '¿Puedo conservar mi software?',
        body: 'Planifique cambios operativos seguros alrededor de sus sistemas EHR/PM actuales sin reemplazos forzados.',
        cta: 'Ver modelo de tecnología',
        href: '/technology',
      },
    ],
    transitionEyebrow: 'Transición sin fricción con controles reales',
    transitionTitle: 'Una transición más segura en tres pasos.',
    transitionBody:
      'La actividad no es responsabilidad. La tecnología no es inteligencia. Cada excepción necesita un responsable, una causa y una acción siguiente documentada.',
    transitionSteps: [
      {
        title: 'Conectar e inventariar',
        body: 'Establezca la línea base de facturación, combinación de pagadores y colas sin interrumpir el flujo.',
      },
      {
        title: 'Asignar responsables de excepción',
        body: 'Cada reclamo impago, denegación e hito de acreditación recibe un responsable, código de causa y fecha límite.',
      },
      {
        title: 'Cadencia de cobros transparente',
        body: 'Revisiones operativas semanales concilian los cobros reales con las colas de trabajo abiertas con pistas de auditoría verificables.',
      },
    ],
    transitionAssurance:
      'Sin reemplazo forzado de EHR. El acceso a datos y las transiciones requieren un plan específico por práctica.',
    philosophyEyebrow: 'Por qué existe ROOT',
    philosophyTitle: 'Delegar la facturación no debería significar perder el control.',
    philosophyBody:
      'ROOT reúne la gestión del ciclo de ingresos, la inteligencia operativa y el apoyo a la práctica en un modelo responsable. Comenzamos con el equipo, las herramientas y las dependencias de pagadores de su práctica, sin reemplazos innecesarios de EHR.',
    philosophyCta: 'Conozca nuestro enfoque',
  },
};

export const messages = { en, es };
export type { Messages };

export function copy(locale: Locale): Messages {
  return messages[locale];
}
