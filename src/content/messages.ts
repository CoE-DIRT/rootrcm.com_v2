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
    cta: 'Open DIRT preview',
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
    body: 'Fixed-fee assessment; additional work is quoted separately. Payment is not collected in this build.',
    steps: [
      'Scope and exclusions',
      'Billing summary',
      'Secure payment (planned)',
      'Onboarding',
      'Deliverable tracking',
    ],
  },
  custom: {
    title: 'Choose managed services',
    body: 'Define inclusion, responsibility, rate structure and dependencies in writing. Subscription checkout is planned, not live.',
    steps: [
      'Compare plan',
      'Request scope',
      'Approve contract',
      'Subscribe (planned)',
      'View entitlement',
    ],
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
    body: 'Legal text is a placeholder pending counsel review. Public forms accept business contacts only. Indexing is off in this environment.',
    cookiesBannerTitle: 'Cookie preferences',
    cookiesBannerBody:
      'Necessary cookies keep language, theme and labeled preview sessions working. Analytics and marketing pixels are not loaded in this environment. Your choice stays in this browser.',
    cookiesNecessaryOnly: 'Necessary only',
    cookiesAcceptAll: 'Allow optional cookies',
    cookiesCustomize: 'Manage cookies',
    cookiesSaved:
      'Preferences saved in this browser. No analytics or marketing pixels are loaded in this build.',
    cookiesNecessary: 'Necessary',
    cookiesNecessaryBody:
      'Locale, color theme and signed preview-session cookies. These are not advertising cookies.',
    cookiesAnalytics: 'Analytics',
    cookiesAnalyticsBody:
      'Preference only. ROOT does not load an analytics vendor in this environment, even if allowed.',
    cookiesMarketing: 'Marketing',
    cookiesMarketingBody:
      'Preference only. ROOT does not load marketing pixels or CRM trackers in this environment.',
    cookiesSave: 'Save preferences',
    cookiesAlwaysOn: 'Always on',
    cookiesRuntimeOff: 'No third-party tracking scripts are present in this build.',
  },
  commercial: {
    servicesEyebrow: 'Services',
    servicesCta: 'See the full service map',
    specialtiesEyebrow: 'Specialty revenue operations',
    specialtiesTitle: 'Built for how each specialty actually bills',
    specialtiesBody:
      'Ten first-class practices, plus the rest of the catalog. Copy is administrative RCM — not a clinical protocol and not a name-swap.',
    specialtiesCta: 'Browse all specialties',
    specialtiesIndexTitle: 'Specialty catalog',
    specialtiesIndexBody:
      'Every specialty below has its own administrative brief. Featured ten appear first on the homepage. Infectious Disease has a dedicated page.',
    specialtyKicker: 'Specialty RCM',
    idKicker: 'Dedicated page',
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
        body: 'Drug-unit claims fail on wastage documentation, calendar alignment and unit math. Specific HCPCS and CPT codes are omitted until the founder validates the current set with a billing lead. Do not treat this page as a code list.',
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
    ecosystemTitle: 'Built Around the Systems Healthcare Practices Already Use',
    ecosystemBody:
      'An evaluation directory of EHR/PM platforms, clearinghouses and payer enrollment workflows observed in the Demo 6 prototype. Status must be verified per engagement.',
    ecosystemDisclaimer:
      'Mention of a vendor does not imply endorsement, certification, a commercial relationship or a working API connection.',
    nyEyebrow: 'New York market',
    nyTitle: 'A New York payer landscape — not a contract list',
    nyBody:
      'Plans that operate in New York, with program type and a public source. ROOT is not claiming a network contract, delegated credentialing or a physical NYC office.',
    nyCta: 'Open the New York market pages',
    nyNoContract:
      'Listing a plan is market orientation. It is not evidence that ROOT is contracted, in-network or delegated with that payer.',
    nyNoOffice: 'ROOT does not claim a physical New York City office on these pages.',
    nyNoOfficeConfirm:
      'All work is scoped remotely or at a practice site the client names in writing.',
    nyPageTitle: 'New York revenue operations landscape',
    nyPageBody:
      'Statewide orientation for practices that bill New York payers. Boroughs are listed because NYC mix differs from the rest of the state. Sources: NYS DOH, NYC DOHMH and NYHPA, last reviewed 2026-10-30.',
    nycTitle: 'New York City — five boroughs',
    nycBody:
      'Manhattan, Brooklyn, Queens, Bronx and Staten Island. This page is a market map for NYC payer mix. It is not a storefront, clinic or ROOT office listing.',
    nyDirectoryTitle: 'Payer directory (public sources)',
    boroughsLabel: 'NYC boroughs',
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
      'DIRT is ROOT’s embedded intelligence capability, not a standalone product. Dashboards in this build are synthetic previews until an import is authorized.',
    dirtCta: 'Read the technology brief',
    proofEyebrow: 'Proof & voices',
    proofTitle: 'Editorial slots pending verification',
    proofBody:
      'Customer voices publish only after founder review. Empty states are intentional. No quotes, licenses, certifications or case-study metrics are invented here.',
    proofEmptyTitle: 'Unpublished',
    proofEmptyBody:
      'This slot is unpublished. A quote appears only with editorialStatus published and founder-approved attribution. Nothing is fabricated to fill the grid.',
    pricingEyebrow: 'Plans',
    conversionTitle: 'Start with a business conversation',
    conversionBody:
      'Describe operational concerns without patient information. Consultation is free. HubSpot sync remains disabled in this environment.',
    conversionCta: 'Book a free consultation',
    journeyCta: 'See the client journey preview',
    journeyCtaBody:
      'Nine stages from visitor to active service. HubSpot, Apollo and Stripe stay typed and disabled — no CRM write, enrichment spend or payment.',
    comparePlans: 'Compare plans',
    requestCheckout: 'Request checkout',
    checkoutUnavailable:
      'Checkout is not active. No payment was collected and no Stripe session was created.',
    entitlementTitle: 'Free vs paid capabilities',
    entitlementBody:
      'Capabilities come from the canonical catalog. Free includes a basic workspace and consultation. Paid offers add diagnostic, operations, DIRT or MSO features. There is no Enterprise SKU. This preview does not grant access.',
    entitlementIncluded: 'Included',
    entitlementLocked: 'Not included in this offer',
    freeOffer: 'Free',
    paidOffer: 'Paid catalog offer',
    codeDisclaimer:
      'No CPT, HCPCS or ICD examples are listed. Code sets change and must be founder-validated before publication.',
    marqueePause: 'Pause scrolling platforms',
    marqueePlay: 'Resume scrolling platforms',
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
    bodyMobile:
      'Menos incertidumbre. Facturación, credencialización y operaciones claras con ROOT.',
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
    cta: 'Abrir vista DIRT',
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
    unavailable:
      'Las consultas en línea aún no están activas. No se enviará ni guardará información.',
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
    body: 'El texto legal es un marcador de posición pendiente de revisión jurídica. Los formularios públicos solo aceptan contactos empresariales. La indexación está desactivada.',
    cookiesBannerTitle: 'Preferencias de cookies',
    cookiesBannerBody:
      'Las cookies necesarias mantienen el idioma, el tema y las sesiones de vista previa. En este entorno no se cargan píxeles de analítica ni de marketing. La elección queda en este navegador.',
    cookiesNecessaryOnly: 'Solo necesarias',
    cookiesAcceptAll: 'Permitir cookies opcionales',
    cookiesCustomize: 'Gestionar cookies',
    cookiesSaved:
      'Preferencias guardadas en este navegador. En esta versión no se cargan píxeles de analítica ni de marketing.',
    cookiesNecessary: 'Necesarias',
    cookiesNecessaryBody:
      'Idioma, tema de color y cookies firmadas de vista previa. No son cookies publicitarias.',
    cookiesAnalytics: 'Analítica',
    cookiesAnalyticsBody:
      'Solo preferencia. ROOT no carga un proveedor de analítica en este entorno, aunque se permita.',
    cookiesMarketing: 'Marketing',
    cookiesMarketingBody:
      'Solo preferencia. ROOT no carga píxeles de marketing ni rastreadores CRM en este entorno.',
    cookiesSave: 'Guardar preferencias',
    cookiesAlwaysOn: 'Siempre activas',
    cookiesRuntimeOff: 'Esta versión no incluye scripts de seguimiento de terceros.',
  },
  commercial: {
    servicesEyebrow: 'Servicios',
    servicesCta: 'Ver el mapa completo de servicios',
    specialtiesEyebrow: 'Operaciones de ingresos por especialidad',
    specialtiesTitle: 'Diseñado para cómo factura realmente cada especialidad',
    specialtiesBody:
      'Diez prácticas de primer nivel, más el resto del catálogo. El texto es RCM administrativo: no es un protocolo clínico ni un intercambio de nombres.',
    specialtiesCta: 'Ver todas las especialidades',
    specialtiesIndexTitle: 'Catálogo de especialidades',
    specialtiesIndexBody:
      'Cada especialidad tiene su propio resumen administrativo. Las diez destacadas aparecen primero en la portada. Enfermedades infecciosas tiene una página dedicada.',
    specialtyKicker: 'RCM por especialidad',
    idKicker: 'Página dedicada',
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
        body: 'Los reclamos de unidades de medicamento fallan por documentación de desperdicio, alineación de calendario y matemática de unidades. Se omiten códigos HCPCS y CPT concretos hasta que el fundador valide el conjunto vigente. No trate esta página como una lista de códigos.',
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
    ecosystemTitle: 'Construido alrededor de los sistemas que las prácticas ya usan',
    ecosystemBody:
      'Directorio de evaluación de plataformas EHR/PM, intermediarios y flujos de inscripción observados en el prototipo Demo 6. El estado debe verificarse por compromiso.',
    ecosystemDisclaimer:
      'Mencionar una marca no implica respaldo, certificación, relación comercial ni una conexión API funcional.',
    nyEyebrow: 'Mercado de Nueva York',
    nyTitle: 'Un panorama de pagadores de Nueva York — no una lista de contratos',
    nyBody:
      'Planes que operan en Nueva York, con tipo de programa y una fuente pública. ROOT no afirma un contrato de red, credencialización delegada ni una oficina física en NYC.',
    nyCta: 'Abrir las páginas del mercado de Nueva York',
    nyNoContract:
      'Listar un plan es orientación de mercado. No es evidencia de que ROOT esté contratado, dentro de la red o delegado con ese pagador.',
    nyNoOffice: 'ROOT no afirma una oficina física en la ciudad de Nueva York en estas páginas.',
    nyNoOfficeConfirm:
      'Todo el trabajo se delimita en remoto o en un sitio de práctica que el cliente nombre por escrito.',
    nyPageTitle: 'Panorama de operaciones de ingresos en Nueva York',
    nyPageBody:
      'Orientación estatal para prácticas que facturan a pagadores de Nueva York. Se listan los condados urbanos porque la mezcla de NYC difiere del resto del estado. Fuentes: NYS DOH, NYC DOHMH y NYHPA, última revisión 2026-10-30.',
    nycTitle: 'Ciudad de Nueva York — cinco boroughs',
    nycBody:
      'Manhattan, Brooklyn, Queens, Bronx y Staten Island. Esta página es un mapa de mercado para la mezcla de pagadores de NYC. No es un local, clínica ni listado de oficina de ROOT.',
    nyDirectoryTitle: 'Directorio de pagadores (fuentes públicas)',
    boroughsLabel: 'Boroughs de NYC',
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
      'DIRT es la capacidad de inteligencia embebida de ROOT, no un producto aparte. Los tableros de esta versión son vistas sintéticas hasta autorizar una importación.',
    dirtCta: 'Leer el resumen de tecnología',
    proofEyebrow: 'Pruebas y voces',
    proofTitle: 'Espacios editoriales pendientes de verificación',
    proofBody:
      'Las voces de clientes se publican solo después de revisión del fundador. Los estados vacíos son intencionales. Aquí no se inventan citas, licencias, certificaciones ni métricas de casos.',
    proofEmptyTitle: 'Sin publicar',
    proofEmptyBody:
      'Este espacio está sin publicar. Una cita aparece solo con editorialStatus published y atribución aprobada por el fundador. Nada se fabrica para llenar la cuadrícula.',
    pricingEyebrow: 'Planes',
    conversionTitle: 'Empiece con una conversación empresarial',
    conversionBody:
      'Describa preocupaciones operativas sin información de pacientes. La consulta es gratuita. La sincronización con HubSpot sigue desactivada en este entorno.',
    conversionCta: 'Reserve una consulta gratuita',
    journeyCta: 'Ver la vista previa del recorrido del cliente',
    journeyCtaBody:
      'Nueve etapas desde visitante hasta servicio activo. HubSpot, Apollo y Stripe permanecen tipados y desactivados: sin escritura CRM, gasto de enriquecimiento ni cobro.',
    comparePlans: 'Comparar planes',
    requestCheckout: 'Solicitar pago',
    checkoutUnavailable:
      'El pago no está activo. No se cobró y no se creó una sesión de Stripe.',
    entitlementTitle: 'Capacidades gratuitas y de pago',
    entitlementBody:
      'Las capacidades provienen del catálogo canónico. Lo gratuito incluye un espacio básico y consulta. Las ofertas de pago añaden diagnóstico, operaciones, DIRT o MSO. No hay un SKU Enterprise. Esta vista previa no otorga acceso.',
    entitlementIncluded: 'Incluido',
    entitlementLocked: 'No incluido en esta oferta',
    freeOffer: 'Gratis',
    paidOffer: 'Oferta de pago del catálogo',
    codeDisclaimer:
      'No se listan ejemplos CPT, HCPCS ni CIE. Los conjuntos de códigos cambian y deben ser validados por el fundador antes de publicarse.',
    marqueePause: 'Pausar plataformas en desplazamiento',
    marqueePlay: 'Reanudar plataformas en desplazamiento',
  },
};

export const messages = { en, es };
export type { Messages };

export function copy(locale: Locale): Messages {
  return messages[locale];
}
