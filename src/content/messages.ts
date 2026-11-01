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
    clientPortal: 'Client portal',
    freeConsultation: 'Free consultation',
    emergency: 'Business line only. Do not send patient information.',
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
    refunds: 'Refunds',
    faqs: 'FAQs',
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
    sow: 'Fees, inclusions and exclusions are confirmed only in a written statement of work. This catalog is not an invoice, a payment outcome, or a collections guarantee.',
    catalogGap:
      'A prototype price sheet lists indicative ranges, including a collections percentage, that are not in this catalog. Those figures are omitted.',
    bundlesEmpty: 'No priced bundle is published in this catalog.',
    filters: {
      all: 'All',
      entry: 'Entry',
      diagnostic: 'Diagnostic',
      managed: 'Managed',
      projects: 'Projects',
      bundles: 'Bundles',
    },
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
    codeDisclaimer:
      'No CPT, HCPCS or ICD examples are listed. Code sets change and must be founder-validated before publication.',
    marqueePause: 'Pause scrolling platforms',
    marqueePlay: 'Resume scrolling platforms',
  },
  calculator: {
    eyebrow: 'Enterprise RCM planning',
    title: 'Denial leakage calculator',
    body: 'Estimate annual denial exposure from monthly collections and an assumed denial rate. Figures are illustrative planning aids for a diagnostic scope — not verified recovery outcomes.',
    collectionsLabel: 'Monthly collections',
    collectionsHint: 'Range $100k–$5M. Business figures only; do not enter patient or claim identifiers.',
    denialLabel: 'Estimated denial rate',
    denialHint: 'Range 2%–25%. Adjust to match your internal reporting, not a payer portal export.',
    practiceLabel: 'Practice type',
    practiceHint: 'Used to label the diagnostic scope. It does not change the recovery assumption.',
    practiceTypes: {
      independent: 'Independent clinic',
      asc: 'ASC',
      mso: 'MSO',
    },
    annualLostLabel: 'Estimated annual lost revenue',
    recoverableLabel: 'Recoverable revenue via ROOT',
    recoverableHint: 'Planning assumption: 85% of estimated annual loss. Not a collections guarantee.',
    cleanClaimLabel: 'Clean claim target',
    cleanClaimHint: 'Implied first-pass clean-claim share from the denial rate slider (100% − denial rate).',
    disclaimer:
      'Illustrative only. No PHI. No HIPAA certification claim. Adapters stay disabled until a written engagement authorizes imports.',
    cta: 'Lock in diagnostic scope',
  },
  onboarding: {
    title: 'Lock in your diagnostic scope',
    body: 'Review the calculator assumptions, then continue with a business-only diagnostic inquiry. Payment and Auth remain disabled in this build.',
    summaryTitle: 'Calculator prefill',
    emptyNote: 'No calculator values were supplied. Defaults below are for planning only.',
    continueDiagnostic: 'Continue to revenue diagnostic',
    backHome: 'Back to homepage',
  },
  pricingPage: {
    title: 'Pricing and leakage planning',
    body: 'Use the denial leakage calculator, then compare the canonical plan catalog. Fees and exclusions are confirmed only in a written statement of work.',
    catalogCta: 'Open the plans catalog',
  },
  /**
   * Namespaced bilingual dictionary for services, specialties, pricing rules and portal terms.
   * Alpha/Gamma may add sibling top-level keys (e.g. nav mega-menu) without colliding here.
   */
  dictionary: {
    services: {
      rcm: {
        name: 'Managed revenue cycle',
        summary: 'Charge capture, claim submission, posting, denials, A/R follow-up and financial controls.',
        steps: [
          'Baseline billing inventory',
          'Prioritized claim work queues',
          'Daily exception resolution',
          'Transparent collections reporting',
        ],
      },
      dirt: {
        name: 'DIRT / data intelligence',
        summary:
          'Revenue leakage signals, payer behavior and prioritized financial action. Sample data until an import is authorized.',
        steps: [
          'Connect approved source data',
          'Normalize and reconcile',
          'Map state, specialty and payer',
          'Distribute owned actions',
        ],
      },
      credential: {
        name: 'Provider credentialing and enrollment',
        summary:
          'CAQH, PECOS/NPPES readiness, payer applications, roster work and revalidation tracking. No live payer connection is claimed.',
        steps: [
          'Provider data collection',
          'Licensure and taxonomy checks',
          'Payer-specific submissions',
          'Follow-up and maintenance',
        ],
      },
      licensing: {
        name: 'Practice and provider licensing',
        summary: 'State professional, group and facility license tracking and renewals.',
        steps: [
          'Identify license class',
          'Verify state board requirements',
          'Assemble applications',
          'Track renewals and evidence',
        ],
      },
      practiceLaunch: {
        name: 'Practice formation and launch',
        summary: 'Launch planning, taxonomies, payer setup, workflows and vendor readiness.',
        steps: [
          'Launch readiness map',
          'Entity and payer checklist',
          'Staff and technology design',
          'Go-live milestones',
        ],
      },
      virtual: {
        name: 'Virtual assistance',
        summary: 'Administrative support for verified nonclinical workflows.',
        steps: [
          'Define shift and role',
          'Train on approved tools',
          'Assign an accountable manager',
          'Review service measures',
        ],
      },
      office: {
        name: 'Front-office and back-office support',
        summary: 'Eligibility, referrals, scheduling coordination, follow-up and documentation workflows.',
        steps: [
          'Map incoming tasks',
          'Set escalation rules',
          'Operate daily queues',
          'Measure response time',
        ],
      },
      scheduling: {
        name: 'Scheduling and referral coordination',
        summary: 'Appointment flows, confirmations, rescheduling and referral routing with defined boundaries.',
        steps: [
          'Map appointment types',
          'Configure approved scripts',
          'Track task outcomes',
          'Review capacity trends',
        ],
      },
      priorAuth: {
        name: 'Prior authorization operations',
        summary:
          'Benefit and policy checks, request preparation, documentation and status escalation. Not a live payer submission.',
        steps: [
          'Identify payer rules',
          'Assemble supporting documents',
          'Track authorization status',
          'Document the outcome',
        ],
      },
      website: {
        name: 'Practice websites and digital experience',
        summary: 'Accessible practice sites, content, patient-facing pages and SEO foundations.',
        steps: [
          'Discovery and wireframes',
          'Design system',
          'Content, SEO and accessibility',
          'Publish and maintain',
        ],
      },
      automation: {
        name: 'Workflow automation and integrations',
        summary:
          'Scoped EHR or clearinghouse work and measured automation, only where authorized. Adapters in this build stay disabled.',
        steps: [
          'Inventory systems',
          'Verify permissions and APIs',
          'Prototype in a safe environment',
          'Monitor and adjust',
        ],
      },
      coding: {
        name: 'Coding quality and compliance review',
        summary:
          'Documentation-gap review for codes and modifiers. This site does not publish code sets or billing advice.',
        steps: [
          'Inventory review rules',
          'Scan documentation gaps',
          'Review sample encounters',
          'Track corrected causes',
        ],
      },
      mso: {
        name: 'MSO and management services',
        summary: 'Operations, staffing, vendor oversight, analytics and accountable delivery under a written scope.',
        steps: [
          'Operating-model assessment',
          'Document responsibilities',
          'Launch managed services',
          'Executive review cadence',
        ],
      },
      advisory: {
        name: 'RCM advisory and revenue optimization',
        summary: 'Audits, denial root-cause diagnostics and a 90-day plan. Not a promise of recovered dollars.',
        steps: [
          'Quantify a baseline',
          'Identify preventable friction',
          'Prioritize opportunities',
          'Document a 90-day roadmap',
        ],
      },
      analytics: {
        name: 'Financial reporting and analytics',
        summary:
          'Executive scorecards and payer-mix views using synthetic figures until a source is authorized.',
        steps: ['Define measures', 'Validate sources', 'Develop dashboards', 'Review deviations'],
      },
      patient: {
        name: 'Patient financial experience',
        summary:
          'Statement and balance workflows. This demo does not store patient balances or clinical details.',
        steps: [
          'Review balance policy',
          'Design approved communication',
          'Track disputes and follow-up',
          'Measure the experience',
        ],
      },
    },
    specialties: {
      cardiology: {
        name: 'Cardiology',
        summary: 'Cardiovascular procedures, device claims, prior authorizations, payer policy and claim edits.',
      },
      asc: {
        name: 'Ambulatory surgery / ASC',
        summary: 'Facility and professional claims, global periods, implants, procedure modifiers and contracts.',
      },
      podiatry: {
        name: 'Podiatry',
        summary: 'Foot and ankle procedures, diabetic foot care, surgical services and medical necessity.',
      },
      woundCare: {
        name: 'Wound care',
        summary: 'Advanced wound modalities, supplies, documentation and authorization sequencing.',
      },
      painManagement: {
        name: 'Pain management',
        summary: 'Injection and procedural authorization, coverage policy, documentation and modifiers.',
      },
      behavioralHealth: {
        name: 'Behavioral health / psychotherapy',
        summary: 'Visit formats, clinician credentials, therapy code families and payer coverage.',
      },
      familyMedicine: {
        name: 'Family medicine',
        summary: 'Primary care E/M, wellness, preventive and chronic care workflows.',
      },
      internalMedicine: {
        name: 'Internal medicine',
        summary: 'Complex E/M, chronic-care plans, documentation and longitudinal reporting.',
      },
      ophthalmology: {
        name: 'Ophthalmology',
        summary: 'Global surgery, injections, drug units, diagnostic testing and modifiers.',
      },
      anesthesiology: {
        name: 'Anesthesiology / CRNA',
        summary: 'Time units, concurrency, anesthesia modifiers and payer-specific arrangements.',
      },
      ent: {
        name: 'ENT / Otolaryngology',
        summary: 'Office procedures, diagnostics, surgeries and procedure-specific policy.',
      },
      physicalTherapy: {
        name: 'Physical therapy',
        summary: 'Therapy plans, utilization caps, authorization and modifier controls.',
      },
      occupationalTherapy: {
        name: 'Occupational therapy',
        summary: 'Plan-of-care compliance, units, functional goals and payer edits.',
      },
      speechPathology: {
        name: 'Speech-language pathology',
        summary: 'Therapy authorizations, provider taxonomy, telehealth and utilization.',
      },
      neurology: {
        name: 'Neurology',
        summary: 'Specialty testing, neurological procedures, coverage and referral management.',
      },
      dermatology: {
        name: 'Dermatology',
        summary: 'Minor procedures, pathology, excisions and medical necessity rules.',
      },
      gastroenterology: {
        name: 'Gastroenterology',
        summary: 'Endoscopy, screening versus diagnostic modifiers and facility coordination.',
      },
      orthopedics: {
        name: 'Orthopedics',
        summary: 'Surgery, imaging, postoperative global periods and therapy coordination.',
      },
      urgentCare: {
        name: 'Urgent care',
        summary: 'Walk-in eligibility, rapid charge capture and payer plan variations.',
      },
      radiology: {
        name: 'Radiology / imaging',
        summary: 'Technical and professional components, contrast and authorization workflows.',
      },
      homeHealth: {
        name: 'Home health',
        summary: 'Eligibility, certification, service records and complex payer documentation.',
      },
      psychiatry: {
        name: 'Psychiatry',
        summary: 'Evaluation, medication management and payer/clinician participation.',
      },
      chiropractic: {
        name: 'Chiropractic',
        summary: 'Visit limits, coverage boundaries, therapy rules and denials.',
      },
      multiSpecialty: {
        name: 'Multi-specialty groups',
        summary: 'Cross-specialty reporting, site of service, shared staff and payer contracts.',
      },
    },
    pricing: {
      notice:
        'Demo 6 V4_PRICES terminology retained for bilingual parity. Indicative ranges are not invoices, payment outcomes or collections guarantees. Canonical SKUs remain in the public catalog.',
      rules: [
        {
          id: 'free',
          name: 'Free consultation',
          price: '$0',
          billing: 'No obligation',
          summary: 'A discovery discussion about practice problems, technology and scope.',
        },
        {
          id: 'explorer',
          name: 'Explorer workspace',
          price: 'Free',
          billing: 'Limited access',
          summary: 'Preview platform, assessment, saved sample views and guided onboarding.',
        },
        {
          id: 'diagnostic',
          name: 'Revenue Optimization Diagnostic',
          price: '$2,500',
          billing: 'Fixed fee / one time',
          summary: 'A/R, denial, workflow and reporting review; opportunity register; 90-day roadmap.',
        },
        {
          id: 'advanced',
          name: 'Advanced Enterprise Diagnostic',
          price: '$15,000',
          billing: 'Proposed scope / one time',
          summary:
            'Larger multi-location / multi-payer assessment. Statement of work required before sale.',
        },
        {
          id: 'managed',
          name: 'Managed RCM',
          price: 'Scoped',
          billing: 'Onboarding from $1,500',
          summary:
            'End-to-end billing, denial operations, A/R and financial reporting by signed scope. Prototype collections-percentage figures are omitted from the public catalog.',
        },
        {
          id: 'dirt',
          name: 'DIRT / Revenue Intelligence',
          price: 'Scoped',
          billing: 'Indicative recurring range',
          summary: 'Connected financial visibility, payer patterns and prioritized action.',
        },
        {
          id: 'credentialing',
          name: 'Credentialing & enrollment',
          price: 'Per provider',
          billing: 'Maintenance quoted separately',
          summary: 'Provider enrollment, roster maintenance, follow-ups and revalidation.',
        },
        {
          id: 'projects',
          name: 'Projects & automation',
          price: 'Scoped project range',
          billing: 'Statement of work',
          summary: 'Reporting, workflow automation, cleanup, technology and operating-system improvements.',
        },
        {
          id: 'practice',
          name: 'Practice setup & launch',
          price: 'Custom quote',
          billing: 'By state, service and launch scope',
          summary: 'Operational setup, licensure milestones, EHR/PM and payer workflow readiness.',
        },
        {
          id: 'office',
          name: 'Virtual / office services',
          price: 'Custom quote',
          billing: 'Role and service-volume based',
          summary: 'Front desk, scheduling, referral processing, prior auth and administrative support.',
        },
        {
          id: 'digital',
          name: 'Practice websites & digital operations',
          price: 'Custom quote',
          billing: 'Defined build + optional maintenance',
          summary: 'Practice website design, accessible content architecture and digital workflows.',
        },
        {
          id: 'mso',
          name: 'Full MSO operating partnership',
          price: 'Custom quote',
          billing: 'Written partnership agreement',
          summary: 'Revenue, technology, operations, people and leadership reporting.',
        },
        {
          id: 'bundles',
          name: 'RCM + Credentialing Bundle',
          price: 'Custom bundle',
          billing: 'Combined scope + agreed discount if approved',
          summary: 'Coordinated claim operations and provider enrollment; a single accountability plan.',
        },
        {
          id: 'intelbundle',
          name: 'DIRT + Automation Bundle',
          price: 'Custom bundle',
          billing: 'Phased project + managed intelligence',
          summary: 'Use analytics to prioritize carefully authorized automations.',
        },
      ],
    },
    portal: {
      agingBands: {
        '0-30': '0–30 days',
        '31-60': '31–60 days',
        '61-90': '61–90 days',
        '90+': '90+ days',
      },
      denialCodes: {
        'CO-4': 'CO-4 · procedure / modifier inconsistency (synthetic label)',
        'CO-16': 'CO-16 · claim / service lacks information (synthetic label)',
        'PR-204': 'PR-204 · service not covered / documentation gap (synthetic label)',
      },
      appealStatuses: {
        open: 'Open',
        inReview: 'In review',
        waiting: 'Waiting',
        draft: 'Appeal draft (not sent)',
        closed: 'Closed (demo)',
      },
      credentialingStages: {
        intake: 'Provider data intake',
        licensure: 'Licensure and taxonomy check',
        caqh: 'CAQH / PECOS readiness',
        payerPacket: 'Payer packet assembly',
        submitted: 'Submitted (demo label)',
        followUp: 'Follow-up and revalidation',
        active: 'Roster active (synthetic)',
      },
    },
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
    clientPortal: 'Portal del cliente',
    freeConsultation: 'Consulta gratuita',
    emergency: 'Solo línea comercial. No envíe información de pacientes.',
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
    refunds: 'Reembolsos',
    faqs: 'Preguntas frecuentes',
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
    sow: 'Honorarios, inclusiones y exclusiones se confirman solo en un enunciado de trabajo escrito. Este catálogo no es una factura, un resultado de pago ni una garantía de cobro.',
    catalogGap:
      'Un prototipo lista rangos indicativos, incluido un porcentaje sobre cobros, que no están en este catálogo. Esas cifras se omiten.',
    bundlesEmpty: 'Este catálogo no publica un paquete con precio.',
    filters: {
      all: 'Todos',
      entry: 'Entrada',
      diagnostic: 'Diagnóstico',
      managed: 'Administrado',
      projects: 'Proyectos',
      bundles: 'Paquetes',
    },
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
    codeDisclaimer:
      'No se listan ejemplos CPT, HCPCS ni CIE. Los conjuntos de códigos cambian y deben ser validados por el fundador antes de publicarse.',
    marqueePause: 'Pausar plataformas en desplazamiento',
    marqueePlay: 'Reanudar plataformas en desplazamiento',
  },
  calculator: {
    eyebrow: 'Planificación RCM empresarial',
    title: 'Calculadora de fugas por denegación',
    body: 'Estime la exposición anual por denegaciones a partir de cobros mensuales y una tasa de denegación asumida. Las cifras son ayudas ilustrativas de planificación para un alcance diagnóstico — no resultados de recobro verificados.',
    collectionsLabel: 'Cobros mensuales',
    collectionsHint:
      'Rango $100k–$5M. Solo cifras empresariales; no introduzca identificadores de pacientes ni de reclamos.',
    denialLabel: 'Tasa estimada de denegación',
    denialHint:
      'Rango 2%–25%. Ajústela a su informe interno, no a una exportación de portal de pagador.',
    practiceLabel: 'Tipo de práctica',
    practiceHint:
      'Etiqueta el alcance del diagnóstico. No cambia el supuesto de recuperación.',
    practiceTypes: {
      independent: 'Clínica independiente',
      asc: 'ASC',
      mso: 'MSO',
    },
    annualLostLabel: 'Ingresos anuales perdidos estimados',
    recoverableLabel: 'Ingresos recuperables vía ROOT',
    recoverableHint:
      'Supuesto de planificación: 85% de la pérdida anual estimada. No es una garantía de cobro.',
    cleanClaimLabel: 'Meta de reclamo limpio',
    cleanClaimHint:
      'Participación implícita de reclamo limpio en primer paso según el deslizador (100% − tasa de denegación).',
    disclaimer:
      'Solo ilustrativo. Sin PHI. Sin afirmación de certificación HIPAA. Los adaptadores permanecen desactivados hasta que un compromiso escrito autorice importaciones.',
    cta: 'Fijar el alcance del diagnóstico',
  },
  onboarding: {
    title: 'Fije el alcance de su diagnóstico',
    body: 'Revise los supuestos de la calculadora y continúe con una consulta diagnóstica solo empresarial. El pago y la autenticación siguen desactivados en esta versión.',
    summaryTitle: 'Prefill de la calculadora',
    emptyNote: 'No se suministraron valores de la calculadora. Los valores por defecto son solo de planificación.',
    continueDiagnostic: 'Continuar al diagnóstico de ingresos',
    backHome: 'Volver al inicio',
  },
  pricingPage: {
    title: 'Precios y planificación de fugas',
    body: 'Use la calculadora de fugas por denegación y luego compare el catálogo canónico de planes. Honorarios y exclusiones se confirman solo en un enunciado de trabajo escrito.',
    catalogCta: 'Abrir el catálogo de planes',
  },
  dictionary: {
    services: {
      rcm: {
        name: 'Ciclo de ingresos gestionado',
        summary: 'Cargos, envío, pagos, denegaciones, cuentas por cobrar y control financiero.',
        steps: [
          'Inventario inicial de facturación',
          'Colas de reclamos prioritarios',
          'Resolver excepciones diarias',
          'Informes transparentes de cobros',
        ],
      },
      dirt: {
        name: 'DIRT / inteligencia de datos',
        summary:
          'Señales de fuga, comportamiento de pagadores y acción financiera prioritaria. Datos de muestra hasta autorizar una importación.',
        steps: [
          'Conectar fuentes autorizadas',
          'Normalizar y conciliar',
          'Mapear estado, especialidad y pagador',
          'Asignar acciones responsables',
        ],
      },
      credential: {
        name: 'Acreditación e inscripción',
        summary:
          'Preparación CAQH, PECOS/NPPES, solicitudes, plantilla y revalidación. No se afirma conexión en vivo con pagadores.',
        steps: [
          'Recopilar datos del proveedor',
          'Verificar licencias y taxonomía',
          'Presentación específica por pagador',
          'Seguimiento y mantenimiento',
        ],
      },
      licensing: {
        name: 'Licencias de práctica y profesionales',
        summary: 'Seguimiento de licencias profesionales, de grupo y de instalación por estado.',
        steps: [
          'Identificar clase de licencia',
          'Validar requisitos estatales',
          'Preparar solicitudes',
          'Monitorear renovaciones',
        ],
      },
      practiceLaunch: {
        name: 'Creación y apertura de prácticas',
        summary: 'Plan de apertura, taxonomías, pagadores, procesos y preparación de proveedores.',
        steps: [
          'Mapa de preparación',
          'Lista de entidad y pagador',
          'Diseño de personal y sistemas',
          'Hitos de lanzamiento',
        ],
      },
      virtual: {
        name: 'Asistencia virtual',
        summary: 'Apoyo administrativo para procesos no clínicos verificados.',
        steps: [
          'Definir función y horario',
          'Formar sobre herramientas autorizadas',
          'Asignar responsable',
          'Revisar indicadores',
        ],
      },
      office: {
        name: 'Soporte de recepción y administración',
        summary: 'Elegibilidad, referidos, coordinación de citas, seguimiento y documentación.',
        steps: [
          'Mapear tareas entrantes',
          'Definir escalamiento',
          'Gestionar colas diarias',
          'Medir respuesta',
        ],
      },
      scheduling: {
        name: 'Citas y coordinación de referidos',
        summary: 'Citas, confirmaciones, cambios y derivación con límites definidos.',
        steps: [
          'Mapear tipos de cita',
          'Configurar guiones autorizados',
          'Monitorear resultados',
          'Revisar capacidad',
        ],
      },
      priorAuth: {
        name: 'Operaciones de autorización previa',
        summary:
          'Verificación de beneficios y póliza, preparación, documentación y escalamiento. No es un envío en vivo al pagador.',
        steps: [
          'Identificar reglas de pagadores',
          'Preparar evidencia clínica',
          'Monitorear autorización',
          'Documentar resultados',
        ],
      },
      website: {
        name: 'Sitios y experiencia digital',
        summary: 'Sitios accesibles, contenidos, páginas para pacientes y bases de SEO.',
        steps: [
          'Descubrimiento y estructura',
          'Sistema de diseño',
          'SEO y accesibilidad',
          'Publicar y mantener',
        ],
      },
      automation: {
        name: 'Automatización e integraciones',
        summary:
          'Trabajo acotado de EHR o clearinghouse y automatización medida, solo si se autoriza. Los adaptadores de esta versión siguen desactivados.',
        steps: [
          'Inventario de sistemas',
          'Verificar permisos y API',
          'Prototipar en entorno seguro',
          'Medir y optimizar',
        ],
      },
      coding: {
        name: 'Calidad de codificación y revisión',
        summary:
          'Revisión de brechas documentales para códigos y modificadores. Este sitio no publica conjuntos de códigos ni asesoría de facturación.',
        steps: [
          'Inventario de reglas',
          'Detectar brechas documentales',
          'Revisar encuentros de ejemplo',
          'Monitorear causas corregidas',
        ],
      },
      mso: {
        name: 'Servicios de gestión MSO',
        summary:
          'Operaciones, personal, supervisión de proveedores, analítica y entrega responsable bajo un alcance escrito.',
        steps: [
          'Evaluar modelo operativo',
          'Documentar responsabilidades',
          'Iniciar servicios gestionados',
          'Revisiones ejecutivas',
        ],
      },
      advisory: {
        name: 'Consultoría y optimización de ingresos',
        summary:
          'Auditorías, diagnóstico de causas de denegación y un plan de 90 días. No promete dólares recuperados.',
        steps: [
          'Cuantificar línea base',
          'Identificar obstáculos',
          'Priorizar oportunidades',
          'Documentar plan de 90 días',
        ],
      },
      analytics: {
        name: 'Informes y analítica financiera',
        summary:
          'Tableros ejecutivos y mezcla de pagadores con cifras sintéticas hasta autorizar una fuente.',
        steps: [
          'Definir indicadores',
          'Validar fuentes',
          'Desarrollar paneles',
          'Revisar desviaciones',
        ],
      },
      patient: {
        name: 'Experiencia financiera del paciente',
        summary:
          'Flujos de estados de cuenta y saldos. Esta demo no guarda saldos de pacientes ni datos clínicos.',
        steps: [
          'Revisar política de saldos',
          'Diseñar comunicación aprobada',
          'Monitorear disputas',
          'Medir experiencia',
        ],
      },
    },
    specialties: {
      cardiology: {
        name: 'Cardiología',
        summary:
          'Procedimientos cardiovasculares, dispositivos, autorizaciones y reglas del pagador.',
      },
      asc: {
        name: 'Cirugía ambulatoria / ASC',
        summary:
          'Reclamos de centro y profesionales, periodos globales, implantes y contratos.',
      },
      podiatry: {
        name: 'Podología',
        summary: 'Cirugía de pie y tobillo, pie diabético y necesidad médica.',
      },
      woundCare: {
        name: 'Cuidado de heridas',
        summary: 'Modalidades avanzadas, insumos, documentación y autorización.',
      },
      painManagement: {
        name: 'Manejo del dolor',
        summary: 'Autorización de inyecciones y procedimientos, cobertura y modificadores.',
      },
      behavioralHealth: {
        name: 'Salud conductual / psicoterapia',
        summary: 'Modalidades de consulta, credenciales y cobertura de terapia.',
      },
      familyMedicine: {
        name: 'Medicina familiar',
        summary: 'Evaluación primaria, prevención y gestión de cuidados crónicos.',
      },
      internalMedicine: {
        name: 'Medicina interna',
        summary: 'Atención compleja, cuidados crónicos y documentación longitudinal.',
      },
      ophthalmology: {
        name: 'Oftalmología',
        summary: 'Cirugía global, inyecciones, unidades de medicamentos y pruebas.',
      },
      anesthesiology: {
        name: 'Anestesiología / CRNA',
        summary: 'Unidades de tiempo, concurrencia, modificadores y acuerdos del pagador.',
      },
      ent: {
        name: 'Otorrinolaringología',
        summary: 'Procedimientos de consulta, diagnósticos y cirugías.',
      },
      physicalTherapy: {
        name: 'Fisioterapia',
        summary: 'Planes terapéuticos, límites de uso, autorizaciones y modificadores.',
      },
      occupationalTherapy: {
        name: 'Terapia ocupacional',
        summary: 'Cumplimiento del plan, unidades, objetivos y reglas del pagador.',
      },
      speechPathology: {
        name: 'Fonoaudiología',
        summary: 'Autorizaciones, taxonomía, telesalud y utilización.',
      },
      neurology: {
        name: 'Neurología',
        summary: 'Pruebas especializadas, procedimientos y derivaciones.',
      },
      dermatology: {
        name: 'Dermatología',
        summary: 'Procedimientos menores, patología y necesidad médica.',
      },
      gastroenterology: {
        name: 'Gastroenterología',
        summary: 'Endoscopia, modificadores de prevención y coordinación de centros.',
      },
      orthopedics: {
        name: 'Ortopedia',
        summary: 'Cirugía, imágenes, periodos posoperatorios y terapia.',
      },
      urgentCare: {
        name: 'Urgencias ambulatorias',
        summary: 'Elegibilidad, cargos rápidos y variaciones de cobertura.',
      },
      radiology: {
        name: 'Radiología / imágenes',
        summary: 'Componentes técnicos y profesionales y autorizaciones.',
      },
      homeHealth: {
        name: 'Atención domiciliaria',
        summary: 'Elegibilidad, certificación y documentación para pagadores.',
      },
      psychiatry: {
        name: 'Psiquiatría',
        summary: 'Evaluación, medicación y participación del profesional.',
      },
      chiropractic: {
        name: 'Quiropráctica',
        summary: 'Límites de visitas, cobertura y denegaciones.',
      },
      multiSpecialty: {
        name: 'Grupos multiespecialidad',
        summary: 'Informes transversales, múltiples sedes, personal y contratos.',
      },
    },
    pricing: {
      notice:
        'Se conserva la terminología V4_PRICES de Demo 6 para paridad bilingüe. Los rangos indicativos no son facturas, resultados de pago ni garantías de cobro. Los SKU canónicos siguen en el catálogo público.',
      rules: [
        {
          id: 'free',
          name: 'Consulta gratuita',
          price: '$0',
          billing: 'Sin compromiso',
          summary: 'Conversación sobre desafíos, tecnología y alcance.',
        },
        {
          id: 'explorer',
          name: 'Espacio Explorer',
          price: 'Gratis',
          billing: 'Acceso limitado',
          summary: 'Vista previa, evaluación y guía de incorporación.',
        },
        {
          id: 'diagnostic',
          name: 'Diagnóstico de optimización de ingresos',
          price: '$2,500',
          billing: 'Tarifa fija / pago único',
          summary: 'Revisión de CxC, denegaciones, procesos, informe y plan de 90 días.',
        },
        {
          id: 'advanced',
          name: 'Diagnóstico avanzado empresarial',
          price: '$15,000',
          billing: 'Alcance propuesto / único',
          summary: 'Evaluación extensa multicentro/multipagador. Requiere propuesta.',
        },
        {
          id: 'managed',
          name: 'RCM gestionado',
          price: 'Según alcance',
          billing: 'Incorporación desde $1,500',
          summary:
            'Facturación, denegaciones, CxC y reportes por alcance acordado. Las cifras de porcentaje sobre cobros del prototipo se omiten del catálogo público.',
        },
        {
          id: 'dirt',
          name: 'DIRT / Inteligencia de ingresos',
          price: 'Según alcance',
          billing: 'Rango mensual indicativo',
          summary: 'Visibilidad financiera, patrones por pagador y acciones prioritarias.',
        },
        {
          id: 'credentialing',
          name: 'Acreditación e inscripción',
          price: 'Por profesional',
          billing: 'Mantenimiento cotizado aparte',
          summary: 'Inscripción de proveedores, mantenimiento y revalidación.',
        },
        {
          id: 'projects',
          name: 'Proyectos y automatización',
          price: 'Rango por proyecto',
          billing: 'Enunciado de trabajo',
          summary: 'Informes, automatización, limpieza y mejoras de sistemas.',
        },
        {
          id: 'practice',
          name: 'Puesta en marcha de prácticas',
          price: 'Cotización a medida',
          billing: 'Según estado y alcance',
          summary: 'Apertura, licencias, sistemas y preparación de pagadores.',
        },
        {
          id: 'office',
          name: 'Servicios virtuales y de oficina',
          price: 'Cotización a medida',
          billing: 'Por rol y volumen',
          summary: 'Recepción, citas, referidos, autorizaciones y soporte.',
        },
        {
          id: 'digital',
          name: 'Webs y operaciones digitales',
          price: 'Cotización a medida',
          billing: 'Desarrollo y mantenimiento opcional',
          summary: 'Diseño web, contenido accesible y procesos digitales.',
        },
        {
          id: 'mso',
          name: 'Alianza MSO integral',
          price: 'Cotización a medida',
          billing: 'Acuerdo escrito',
          summary: 'Ingresos, tecnología, operaciones, personal e informes.',
        },
        {
          id: 'bundles',
          name: 'Paquete RCM + Acreditación',
          price: 'Paquete a medida',
          billing: 'Alcance conjunto y posible descuento',
          summary: 'RCM e inscripción coordinados con responsabilidades claras.',
        },
        {
          id: 'intelbundle',
          name: 'Paquete DIRT + Automatización',
          price: 'Paquete a medida',
          billing: 'Proyecto por fases e inteligencia',
          summary: 'Use análisis para priorizar automatizaciones autorizadas.',
        },
      ],
    },
    portal: {
      agingBands: {
        '0-30': '0–30 días',
        '31-60': '31–60 días',
        '61-90': '61–90 días',
        '90+': '90+ días',
      },
      denialCodes: {
        'CO-4': 'CO-4 · inconsistencia de procedimiento / modificador (etiqueta sintética)',
        'CO-16': 'CO-16 · falta información del reclamo / servicio (etiqueta sintética)',
        'PR-204': 'PR-204 · servicio no cubierto / brecha documental (etiqueta sintética)',
      },
      appealStatuses: {
        open: 'Abierta',
        inReview: 'En revisión',
        waiting: 'En espera',
        draft: 'Borrador de apelación (no enviado)',
        closed: 'Cerrada (demo)',
      },
      credentialingStages: {
        intake: 'Recolección de datos del profesional',
        licensure: 'Verificación de licencia y taxonomía',
        caqh: 'Preparación CAQH / PECOS',
        payerPacket: 'Armado del paquete para el pagador',
        submitted: 'Enviado (etiqueta demo)',
        followUp: 'Seguimiento y revalidación',
        active: 'Plantilla activa (sintético)',
      },
    },
  },
};

export const messages = { en, es };
export type { Messages };

export function copy(locale: Locale): Messages {
  return messages[locale];
}
