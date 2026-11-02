import type { CopyPair } from '@/content/ecosystem';
import type { Locale } from '@/i18n/locales';

export type Specialty = {
  slug: string;
  name: CopyPair;
  /** Homepage featured card title when it groups related catalog entries. */
  featuredTitle?: CopyPair;
  summary: CopyPair;
  body: CopyPair;
  focus: { en: readonly string[]; es: readonly string[] };
  featured: boolean;
  featuredOrder?: number;
  dedicatedPage?: boolean;
};

function pair(en: string, es: string): CopyPair {
  return { en, es };
}

/**
 * Full specialty catalog. V4_SPEC from Demo 6 is retained. Featured ten are
 * first-class homepage cards. Infectious Disease is a dedicated page (not in
 * the prototype — requested for this commercial slice). Copy is administrative
 * RCM, not clinical care. No CPT codes; founder must validate any code set.
 */
export const specialties: readonly Specialty[] = [
  {
    slug: 'internal-family-medicine',
    name: pair('Internal / Family Medicine', 'Medicina interna / familiar'),
    featured: true,
    featuredOrder: 1,
    summary: pair(
      'Longitudinal E/M, preventive visits and chronic-care reporting for mixed adult panels — with documentation that supports the claim, not a clinical protocol.',
      'E/M longitudinal, visitas preventivas e informes de cuidados crónicos para paneles mixtos de adultos: documentación que sostiene el reclamo, no un protocolo clínico.',
    ),
    body: pair(
      'Internal and family medicine groups stall when wellness, problem-oriented visits and care-management add-ons are captured inconsistently across locations. ROOT scopes charge review, payer mix and denial follow-up as administrative work. We do not replace the note, invent quality scores or publish recovery percentages. Family medicine and internal medicine remain separate catalog pages for practices that want a narrower brief.',
      'Los grupos de medicina interna y familiar se detienen cuando los servicios de bienestar, las visitas por problema y los complementos de gestión de cuidados se capturan de forma inconsistente. ROOT delimita revisión de cargos, mezcla de pagadores y seguimiento de denegaciones como trabajo administrativo. No reemplazamos la nota clínica ni publicamos porcentajes de recobro. Medicina familiar y medicina interna siguen como páginas de catálogo separadas.',
    ),
    focus: {
      en: [
        'Visit-level charge completeness',
        'Preventive vs problem-oriented billing',
        'Chronic-care documentation for claims',
      ],
      es: [
        'Completitud de cargos por visita',
        'Facturación preventiva frente a por problema',
        'Documentación de cuidados crónicos para reclamos',
      ],
    },
  },
  {
    slug: 'cardiology',
    name: pair('Cardiology', 'Cardiología'),
    featuredTitle: pair('Cardiology / Vascular', 'Cardiología / Vascular'),
    featured: true,
    featuredOrder: 2,
    summary: pair(
      'Device, diagnostic and interventional claim edits, plus prior-authorization sequencing against payer policy — not a cath-lab playbook.',
      'Edits de reclamos de dispositivos, diagnósticos e intervencionismo, y secuencia de autorizaciones según la póliza del pagador — no un manual de hemodinamia.',
    ),
    body: pair(
      'Cardiology and vascular programs lose time when authorization, implant documentation and professional/facility splits are owned by different inboxes. ROOT maps those administrative handoffs and the next action. Vascular practices are included in this featured brief because the billing pattern (policy research, device tracking, site of service) overlaps; a separate vascular catalog page remains for groups that want it isolated. No outcome rates are shown.',
      'Cardiología y vascular pierden tiempo cuando autorización, documentación de implantes y la división profesional/centro viven en bandejas distintas. ROOT mapea esos pases administrativos y la siguiente acción. Vascular entra en este destacado porque el patrón de facturación se solapa; hay página de catálogo aparte. No se muestran tasas de resultado.',
    ),
    focus: {
      en: [
        'Authorization before the scheduled service',
        'Device and diagnostic claim edits',
        'Professional vs facility ownership',
      ],
      es: [
        'Autorización antes del servicio programado',
        'Edits de dispositivos y diagnósticos',
        'Titularidad profesional frente a centro',
      ],
    },
  },
  {
    slug: 'infectious-disease',
    name: pair('Infectious Disease', 'Enfermedades infecciosas'),
    featured: true,
    featuredOrder: 3,
    dedicatedPage: true,
    summary: pair(
      'Administrative revenue operations for ID groups: authorization, infusion and OPAT billing pathways, J-code unit hygiene and medical vs pharmacy benefit routing.',
      'Operaciones administrativas de ingresos para grupos de ID: autorización, vías de infusión y OPAT, higiene de unidades J-code y enrutamiento de beneficio médico frente a de farmacia.',
    ),
    body: pair(
      'Infectious Disease Revenue Operations — From Authorization to Reimbursement. This page is about claim, benefit and documentation logistics. It is not clinical advice, stewardship guidance or a treatment protocol. Specific CPT and HCPCS codes are omitted until the founder validates the current code set with counsel and a billing lead.',
      'Operaciones de ingresos en enfermedades infecciosas — de la autorización al reembolso. Esta página trata de logística de reclamos, beneficios y documentación. No es consejo clínico ni un protocolo de tratamiento. Se omiten códigos CPT y HCPCS concretos hasta que el fundador valide el conjunto vigente.',
    ),
    focus: {
      en: [
        'OPAT coordination as billing work',
        'Infusion buy-and-bill vs specialty pharmacy',
        'Medical vs pharmacy benefit routing',
      ],
      es: [
        'OPAT como trabajo de facturación',
        'Buy-and-bill de infusión frente a farmacia especializada',
        'Enrutamiento de beneficio médico frente a de farmacia',
      ],
    },
  },
  {
    slug: 'orthopedics',
    name: pair('Orthopedics', 'Ortopedia'),
    featured: true,
    featuredOrder: 4,
    summary: pair(
      'Surgical globals, implant tracking, imaging coordination and post-op therapy handoffs treated as claim logistics.',
      'Globales quirúrgicos, seguimiento de implantes, coordinación de imágenes y pases a terapia posoperatoria como logística de reclamos.',
    ),
    body: pair(
      'Orthopedic groups juggle clinic, ASC and hospital sites with different global periods and implant invoices. ROOT’s brief is to keep those administrative dependencies visible: who owns the implant invoice, who follows the denial, who confirms the therapy authorization. We do not advertise surgical outcomes or implied case volumes.',
      'Los grupos de ortopedia combinan clínica, ASC y hospital con periodos globales e facturas de implantes distintos. El alcance de ROOT es visibilizar esas dependencias administrativas. No anunciamos resultados quirúrgicos ni volúmenes de casos.',
    ),
    focus: {
      en: [
        'Global period claim hygiene',
        'Implant invoice matching',
        'Post-op therapy authorization',
      ],
      es: [
        'Higiene de reclamos en periodo global',
        'Conciliación de facturas de implantes',
        'Autorización de terapia posoperatoria',
      ],
    },
  },
  {
    slug: 'behavioral-health',
    name: pair('Behavioral Health', 'Salud conductual'),
    featuredTitle: pair('Behavioral Health / Psychiatry', 'Salud conductual / Psiquiatría'),
    featured: true,
    featuredOrder: 5,
    summary: pair(
      'Program structure, clinician credential matching and therapy coverage rules — administrative, not a clinical model of care.',
      'Estructura de programa, coincidencia de credenciales y reglas de cobertura de terapia: administrativo, no un modelo clínico de atención.',
    ),
    body: pair(
      'Behavioral health and psychiatry groups stall when visit format, supervisor credentials and payer coverage tables disagree. ROOT tracks enrollment readiness and denial reasons as operations work. Psychiatry remains a separate catalog page for medication-management-heavy groups. No clinical protocols or outcome claims.',
      'Salud conductual y psiquiatría se detienen cuando el formato de visita, las credenciales de supervisión y las tablas de cobertura no coinciden. ROOT sigue la preparación de inscripción y las causas de denegación. Psiquiatría sigue como página aparte. Sin protocolos clínicos ni resultados inventados.',
    ),
    focus: {
      en: [
        'Credential-to-payer matching',
        'Covered visit formats',
        'Authorization for intensive programs',
      ],
      es: [
        'Coincidencia credencial-pagador',
        'Formatos de visita cubiertos',
        'Autorización de programas intensivos',
      ],
    },
  },
  {
    slug: 'pain-management',
    name: pair('Pain Management', 'Manejo del dolor'),
    featured: true,
    featuredOrder: 6,
    summary: pair(
      'Procedure authorization, laterality/modifier hygiene and coverage policy research before the scheduled intervention.',
      'Autorización de procedimientos, higiene de laterality/modificadores e investigación de pólizas antes de la intervención programada.',
    ),
    body: pair(
      'Pain programs are denied when frequency, laterality or site-of-service rules are missed in the administrative packet. ROOT scopes the checklist and the follow-up owner. We do not publish utilization targets or imply clinical appropriateness. Code-level examples wait for founder validation.',
      'Los programas de dolor se deniegan cuando faltan frecuencia, laterality o sitio de servicio en el paquete administrativo. ROOT delimita la lista de verificación y el responsable del seguimiento. No publicamos metas de utilización. Los ejemplos a nivel de código esperan validación del fundador.',
    ),
    focus: {
      en: [
        'Payer policy before the calendar',
        'Modifier and laterality checks',
        'Named denial follow-up',
      ],
      es: [
        'Póliza del pagador antes del calendario',
        'Controles de modificador y laterality',
        'Seguimiento nominado de denegaciones',
      ],
    },
  },
  {
    slug: 'podiatry',
    name: pair('Podiatry', 'Podología'),
    featured: true,
    featuredOrder: 7,
    summary: pair(
      'Office procedures, surgical claims and diabetic-foot documentation intensity treated as revenue operations, not wound protocols.',
      'Procedimientos de consulta, reclamos quirúrgicos y documentación del pie diabético como operaciones de ingresos, no como protocolos de heridas.',
    ),
    body: pair(
      'Podiatry mixes routine nail care edits, surgical globals and supply-heavy diabetic foot visits. The failure mode is usually medical-necessity language and frequency limits in the administrative record, not the procedure itself. ROOT keeps those limits visible per payer mix. No healing-rate metrics.',
      'La podología mezcla edits de cuidado rutinario, globales quirúrgicos y visitas de pie diabético con insumos. El fallo suele ser el lenguaje de necesidad médica y los límites de frecuencia en el expediente administrativo. ROOT visibiliza esos límites por mezcla de pagadores. Sin métricas de cicatrización.',
    ),
    focus: {
      en: [
        'Frequency and necessity documentation',
        'Surgical global tracking',
        'Supply and procedure pairing',
      ],
      es: [
        'Documentación de frecuencia y necesidad',
        'Seguimiento de globales quirúrgicos',
        'Emparejamiento de insumos y procedimientos',
      ],
    },
  },
  {
    slug: 'anesthesia',
    name: pair('Anesthesia', 'Anestesia'),
    featuredTitle: pair('Anesthesia / ASC', 'Anestesia / ASC'),
    featured: true,
    featuredOrder: 8,
    summary: pair(
      'Time units, concurrency, anesthesia modifiers and ASC facility/professional splits — administrative billing, not intraoperative care.',
      'Unidades de tiempo, concurrencia, modificadores de anestesia y división centro/profesional en ASC: facturación administrativa, no cuidado intraoperatorio.',
    ),
    body: pair(
      'Anesthesia and ASC work fail in the unit math, concurrency flags and who bills facility versus professional. ROOT’s featured brief covers both because they share the same calendar and contract set. Ambulatory surgery remains its own catalog page for facility-only groups. No quality or volume claims.',
      'Anestesia y ASC fallan en la matemática de unidades, las banderas de concurrencia y quién factura centro frente a profesional. El destacado cubre ambos porque comparten calendario y contratos. La cirugía ambulatoria sigue como página propia. Sin afirmaciones de calidad o volumen.',
    ),
    focus: {
      en: [
        'Time-unit and concurrency hygiene',
        'Modifier ownership',
        'ASC facility vs professional claims',
      ],
      es: [
        'Higiene de unidades de tiempo y concurrencia',
        'Titularidad de modificadores',
        'Reclamos de centro frente a profesionales en ASC',
      ],
    },
  },
  {
    slug: 'wound-care',
    name: pair('Wound Care', 'Cuidado de heridas'),
    featured: true,
    featuredOrder: 9,
    summary: pair(
      'Documentation-intensive modalities, supply sequencing and authorization order — not a clinical wound pathway.',
      'Modalidades intensivas en documentación, secuencia de insumos y orden de autorización: no una vía clínica de heridas.',
    ),
    body: pair(
      'Wound programs stall when advanced modality visits, dressing units and authorization windows are out of sequence in the billing file. ROOT treats that as an operations problem: timestamps, units and the next packet. Healing percentages and product endorsements are out of scope.',
      'Los programas de heridas se detienen cuando las visitas de modalidad avanzada, las unidades de apósitos y las ventanas de autorización están fuera de secuencia. ROOT lo trata como un problema operativo. Los porcentajes de cicatrización y el respaldo de productos quedan fuera de alcance.',
    ),
    focus: {
      en: [
        'Authorization before modality visits',
        'Supply unit documentation',
        'Sequence of billed services',
      ],
      es: [
        'Autorización antes de modalidades',
        'Documentación de unidades de insumos',
        'Secuencia de servicios facturados',
      ],
    },
  },
  {
    slug: 'otolaryngology',
    name: pair('Otolaryngology / ENT', 'Otorrinolaringología / ORL'),
    featured: true,
    featuredOrder: 10,
    summary: pair(
      'Office procedures, diagnostics and surgical claims with procedure-specific payer policy — administrative, not operative technique.',
      'Procedimientos de consulta, diagnósticos y reclamos quirúrgicos con póliza específica: administrativo, no técnica operatoria.',
    ),
    body: pair(
      'ENT groups combine clinic procedures, audiology and OR days. Denials cluster on bundled office procedures and missing diagnostic authorization. ROOT scopes the policy check and the appeal owner. We do not list CPT examples until they are founder-validated.',
      'ORL combina procedimientos de consulta, audiología y quirófano. Las denegaciones se agrupan en paquetes de consulta y autorizaciones diagnósticas faltantes. ROOT delimita la revisión de póliza y el responsable de la apelación. No listamos CPT hasta validación del fundador.',
    ),
    focus: {
      en: [
        'Bundled office-procedure edits',
        'Diagnostic authorization',
        'Surgical vs clinic claim split',
      ],
      es: [
        'Edits de procedimientos de consulta empaquetados',
        'Autorización diagnóstica',
        'División de reclamo quirúrgico frente a clínica',
      ],
    },
  },
  {
    slug: 'family-medicine',
    name: pair('Family Medicine', 'Medicina familiar'),
    featured: false,
    summary: pair(
      'Primary-care E/M, wellness and chronic-care workflows with continuity across a mixed-age panel.',
      'E/M de atención primaria, bienestar y cuidados crónicos con continuidad en un panel de edades mixtas.',
    ),
    body: pair(
      'Family medicine billing breaks when preventive and problem-oriented work is collapsed into one line, or when care-management months are missing supporting time records. ROOT reviews the administrative pattern, not the exam. See also Internal / Family Medicine on the featured grid.',
      'La facturación de medicina familiar se rompe cuando lo preventivo y lo orientado a problemas se comprime en una línea, o faltan registros de tiempo para meses de gestión de cuidados. ROOT revisa el patrón administrativo. Véase también Medicina interna / familiar en la cuadrícula destacada.',
    ),
    focus: {
      en: [
        'Preventive and problem-oriented split',
        'Panel continuity reporting',
        'Care-management support documents',
      ],
      es: [
        'Separación preventiva y por problema',
        'Informes de continuidad del panel',
        'Soportes de gestión de cuidados',
      ],
    },
  },
  {
    slug: 'internal-medicine',
    name: pair('Internal Medicine', 'Medicina interna'),
    featured: false,
    summary: pair(
      'Complex adult E/M, multi-morbidity documentation and longitudinal reporting for claim support.',
      'E/M adulto complejo, documentación de multimorbilidad e informes longitudinales para sostener el reclamo.',
    ),
    body: pair(
      'Internal medicine groups generate denser notes and more concurrent conditions. The revenue risk is under-coded visits from missing administrative elements, or denials when chronic-care billing lacks a defined period. ROOT does not score clinical quality.',
      'Medicina interna genera notas más densas y más condiciones concurrentes. El riesgo de ingresos es la visita subcodificada por elementos administrativos faltantes, o denegaciones cuando falta el periodo definido. ROOT no puntúa calidad clínica.',
    ),
    focus: {
      en: [
        'Complexity documentation for claims',
        'Defined chronic-care periods',
        'Referral and testing authorization',
      ],
      es: [
        'Documentación de complejidad para reclamos',
        'Periodos definidos de cuidados crónicos',
        'Autorización de derivaciones y pruebas',
      ],
    },
  },
  {
    slug: 'psychiatry',
    name: pair('Psychiatry', 'Psiquiatría'),
    featured: false,
    summary: pair(
      'Evaluation, medication-management visits and payer participation checks for the rendering clinician.',
      'Evaluación, visitas de manejo de medicación y controles de participación del profesional que presta el servicio.',
    ),
    body: pair(
      'Psychiatry revenue operations hinge on who is enrolled, which visit format the plan covers, and whether add-on time is documented in the administrative record. This is not a prescribing guide. See Behavioral Health / Psychiatry on the featured grid for the combined brief.',
      'Las operaciones de ingresos en psiquiatría dependen de quién está inscrito, qué formato cubre el plan y si el tiempo adicional está en el expediente administrativo. No es una guía de prescripción. Véase Salud conductual / Psiquiatría en la cuadrícula destacada.',
    ),
    focus: {
      en: [
        'Clinician participation',
        'Covered visit families',
        'Time documentation without clinical advice',
      ],
      es: [
        'Participación del profesional',
        'Familias de visita cubiertas',
        'Documentación de tiempo sin consejo clínico',
      ],
    },
  },
  {
    slug: 'ambulatory-surgery',
    name: pair('Ambulatory Surgery / ASC', 'Cirugía ambulatoria / ASC'),
    featured: false,
    summary: pair(
      'Facility and professional claims, implants, modifiers and contract terms for outpatient surgery days.',
      'Reclamos de centro y profesionales, implantes, modificadores y términos contractuales para días de cirugía ambulatoria.',
    ),
    body: pair(
      'ASC billing is a calendar problem: implants, laterality, implants invoices and the professional claim must land in the same administrative window. ROOT tracks owners. Clinical technique is out of scope. The featured Anesthesia / ASC card covers shared operating days.',
      'La facturación de ASC es un problema de calendario: implantes, laterality y el reclamo profesional deben caer en la misma ventana administrativa. ROOT sigue responsables. La técnica clínica queda fuera. La tarjeta destacada Anestesia / ASC cubre los días compartidos.',
    ),
    focus: {
      en: [
        'Facility vs professional timing',
        'Implant and modifier packets',
        'Contract term visibility',
      ],
      es: [
        'Sincronía centro vs profesional',
        'Paquetes de implantes y modificadores',
        'Visibilidad de términos contractuales',
      ],
    },
  },
  {
    slug: 'ophthalmology',
    name: pair('Ophthalmology', 'Oftalmología'),
    featured: false,
    summary: pair(
      'Global surgery periods, injection units, diagnostic testing and drug-unit documentation.',
      'Periodos de cirugía global, unidades de inyección, pruebas diagnósticas y documentación de unidades de medicamento.',
    ),
    body: pair(
      'Ophthalmology denials often sit in drug units, laterality and global-period collisions between clinic lasers and OR days. ROOT treats units and globals as operations data. Drug names and HCPCS examples wait for founder validation.',
      'Las denegaciones en oftalmología suelen estar en unidades de medicamento, laterality y colisiones de periodo global. ROOT trata unidades y globales como datos operativos. Los ejemplos de HCPCS esperan validación del fundador.',
    ),
    focus: {
      en: [
        'Drug-unit claim hygiene',
        'Global period collisions',
        'Diagnostic testing authorization',
      ],
      es: [
        'Higiene de unidades de medicamento',
        'Colisiones de periodo global',
        'Autorización de pruebas diagnósticas',
      ],
    },
  },
  {
    slug: 'physical-therapy',
    name: pair('Physical Therapy', 'Fisioterapia'),
    featured: false,
    summary: pair(
      'Plan-of-care compliance, unit caps, authorization windows and modifier controls.',
      'Cumplimiento del plan de cuidados, topes de unidades, ventanas de autorización y controles de modificadores.',
    ),
    body: pair(
      'Therapy practices hit utilization caps and expired plans of care. ROOT’s work is the administrative clock: visits remaining, recertification dates, the denial queue. No functional-outcome scores are published here.',
      'Las prácticas de terapia chocan con topes de utilización y planes vencidos. El trabajo de ROOT es el reloj administrativo. Aquí no se publican puntuaciones funcionales.',
    ),
    focus: {
      en: ['Visit-cap tracking', 'Plan-of-care dates', 'Authorization recertification'],
      es: [
        'Seguimiento de topes de visita',
        'Fechas del plan de cuidados',
        'Recertificación de autorización',
      ],
    },
  },
  {
    slug: 'occupational-therapy',
    name: pair('Occupational Therapy', 'Terapia ocupacional'),
    featured: false,
    summary: pair(
      'Plan-of-care units, functional-goal documentation required by the payer, and edit follow-up.',
      'Unidades del plan de cuidados, documentación de objetivos que exige el pagador y seguimiento de edits.',
    ),
    body: pair(
      'OT claims fail when units, goals and certification dates are incomplete in the billing packet. ROOT does not write treatment goals; it flags missing administrative fields and the owner of the correction.',
      'Los reclamos de TO fallan cuando faltan unidades, objetivos y fechas de certificación en el paquete de facturación. ROOT no redacta objetivos de tratamiento; señala campos administrativos faltantes y el dueño de la corrección.',
    ),
    focus: {
      en: [
        'Missing administrative fields',
        'Unit and certification dates',
        'Payer-specific therapy edits',
      ],
      es: [
        'Campos administrativos faltantes',
        'Unidades y fechas de certificación',
        'Edits de terapia según el pagador',
      ],
    },
  },
  {
    slug: 'speech-language-pathology',
    name: pair('Speech-Language Pathology', 'Fonoaudiología'),
    featured: false,
    summary: pair(
      'Therapy authorizations, taxonomy of the rendering provider, telehealth flags and utilization.',
      'Autorizaciones de terapia, taxonomía del profesional, banderas de telesalud y utilización.',
    ),
    body: pair(
      'SLP billing is sensitive to who rendered the service, whether telehealth is in the plan, and remaining authorized units. ROOT tracks those facts. Clinical methods stay with the practice.',
      'La facturación de fonoaudiología depende de quién prestó el servicio, si el plan admite telesalud y las unidades autorizadas restantes. ROOT sigue esos hechos. Los métodos clínicos quedan en la práctica.',
    ),
    focus: {
      en: ['Rendering-provider taxonomy', 'Telehealth plan flags', 'Authorized unit remaining'],
      es: [
        'Taxonomía del profesional',
        'Banderas de telesalud del plan',
        'Unidades autorizadas restantes',
      ],
    },
  },
  {
    slug: 'neurology',
    name: pair('Neurology', 'Neurología'),
    featured: false,
    summary: pair(
      'Specialty testing, procedure coverage and referral management as claim logistics.',
      'Pruebas especializadas, cobertura de procedimientos y gestión de derivaciones como logística de reclamos.',
    ),
    body: pair(
      'Neurology revenue work is heavy on testing authorization and whether the study is billed technically, professionally or globally. ROOT maps the split and the follow-up. Interpretive clinical content is not offered.',
      'El trabajo de ingresos en neurología pesa en la autorización de pruebas y en si el estudio se factura técnico, profesional o global. ROOT mapea la división. No se ofrece contenido clínico interpretativo.',
    ),
    focus: {
      en: [
        'Testing authorization',
        'Technical vs professional split',
        'Referral packet completeness',
      ],
      es: [
        'Autorización de pruebas',
        'División técnica frente a profesional',
        'Completitud del paquete de derivación',
      ],
    },
  },
  {
    slug: 'dermatology',
    name: pair('Dermatology', 'Dermatología'),
    featured: false,
    summary: pair(
      'Minor procedures, pathology handoffs and medical-necessity language for billed destructions and excisions.',
      'Procedimientos menores, pases a patología y lenguaje de necesidad médica para destrucciones y escisiones facturadas.',
    ),
    body: pair(
      'Dermatology claims collide when procedure, pathology and diagnosis pointers are out of sync. ROOT keeps the administrative chain intact. Lesion-count examples wait for founder-validated code sets.',
      'Los reclamos de dermatología chocan cuando procedimiento, patología y punteros diagnósticos no coinciden. ROOT mantiene la cadena administrativa. Los ejemplos de recuento de lesiones esperan conjuntos de códigos validados.',
    ),
    focus: {
      en: [
        'Procedure-to-pathology matching',
        'Necessity language in the packet',
        'Site and laterality hygiene',
      ],
      es: [
        'Emparejamiento procedimiento-patología',
        'Lenguaje de necesidad en el paquete',
        'Higiene de sitio y laterality',
      ],
    },
  },
  {
    slug: 'gastroenterology',
    name: pair('Gastroenterology', 'Gastroenterología'),
    featured: false,
    summary: pair(
      'Endoscopy scheduling vs screening/diagnostic modifiers and facility coordination.',
      'Programación de endoscopia frente a modificadores de tamizaje/diagnóstico y coordinación de centros.',
    ),
    body: pair(
      'GI billing turns on whether the case is screening or diagnostic in the administrative record, and who bills the facility. ROOT does not advise on clinical conversion of a screening case. Modifier examples are withheld pending founder validation.',
      'La facturación de GI depende de si el caso es tamizaje o diagnóstico en el expediente administrativo y de quién factura el centro. ROOT no aconseja la conversión clínica de un tamizaje. Los modificadores se omiten hasta validación del fundador.',
    ),
    focus: {
      en: ['Screening vs diagnostic flags', 'Facility coordination', 'Anesthesia add-on ownership'],
      es: [
        'Banderas de tamizaje frente a diagnóstico',
        'Coordinación de centros',
        'Titularidad de complementos de anestesia',
      ],
    },
  },
  {
    slug: 'urgent-care',
    name: pair('Urgent Care', 'Urgencias ambulatorias'),
    featured: false,
    summary: pair(
      'Walk-in eligibility, rapid charge capture and plan variation across a high-volume front desk.',
      'Elegibilidad sin cita, captura rápida de cargos y variación de planes en un mostrador de alto volumen.',
    ),
    body: pair(
      'Urgent care leakage is usually eligibility that was not checked and charges that never left the EHR. ROOT scopes the front-desk-to-claim path. We do not claim wait-time or collection-rate improvements.',
      'La fuga en urgent care suele ser elegibilidad no verificada y cargos que no salieron del EHR. ROOT delimita el camino del mostrador al reclamo. No afirmamos mejoras de espera ni de recobro.',
    ),
    focus: {
      en: [
        'Eligibility before the visit closes',
        'Same-day charge capture',
        'Plan variation at the desk',
      ],
      es: [
        'Elegibilidad antes de cerrar la visita',
        'Captura de cargos el mismo día',
        'Variación de planes en el mostrador',
      ],
    },
  },
  {
    slug: 'radiology',
    name: pair('Radiology / Imaging', 'Radiología / imágenes'),
    featured: false,
    summary: pair(
      'Technical and professional components, contrast documentation and authorization workflows.',
      'Componentes técnicos y profesionales, documentación de contraste y flujos de autorización.',
    ),
    body: pair(
      'Imaging claims split across TC/PC and fail when authorization does not match the study actually billed. ROOT tracks that match. Contrast and study-type codes are not listed until founder-validated.',
      'Los reclamos de imagen se parten en TC/PC y fallan cuando la autorización no coincide con el estudio facturado. ROOT sigue esa coincidencia. Los códigos de contraste no se listan hasta validación del fundador.',
    ),
    focus: {
      en: ['TC/PC ownership', 'Auth-to-study matching', 'Contrast documentation in the packet'],
      es: [
        'Titularidad TC/PC',
        'Coincidencia autorización-estudio',
        'Documentación de contraste en el paquete',
      ],
    },
  },
  {
    slug: 'home-health',
    name: pair('Home Health', 'Atención domiciliaria'),
    featured: false,
    summary: pair(
      'Eligibility, certification periods and payer documentation packets for home-based services.',
      'Elegibilidad, periodos de certificación y paquetes documentales del pagador para servicios en el hogar.',
    ),
    body: pair(
      'Home health revenue work is certification dates, face-to-face administrative evidence and payer-specific packets. ROOT does not staff visits or assert star ratings.',
      'El trabajo de ingresos en atención domiciliaria son fechas de certificación, evidencia administrativa de face-to-face y paquetes del pagador. ROOT no dota visitas ni afirma calificaciones.',
    ),
    focus: {
      en: [
        'Certification period tracking',
        'Eligibility recertification',
        'Payer packet completeness',
      ],
      es: [
        'Seguimiento del periodo de certificación',
        'Recertificación de elegibilidad',
        'Completitud del paquete del pagador',
      ],
    },
  },
  {
    slug: 'chiropractic',
    name: pair('Chiropractic', 'Quiropráctica'),
    featured: false,
    summary: pair(
      'Visit limits, coverage boundaries, therapy-with-adjustments rules and denial patterns.',
      'Límites de visitas, fronteras de cobertura, reglas de terapia con ajustes y patrones de denegación.',
    ),
    body: pair(
      'Chiropractic claims hit maintenance-care edits and visit caps. ROOT makes the cap and the denial reason visible. We do not argue medical necessity as a clinical opinion.',
      'Los reclamos quiroprácticos chocan con edits de mantenimiento y topes de visita. ROOT visibiliza el tope y la causa. No argumentamos necesidad médica como opinión clínica.',
    ),
    focus: {
      en: ['Visit-cap visibility', 'Maintenance vs active-care flags', 'Denial-reason queues'],
      es: [
        'Visibilidad del tope de visitas',
        'Banderas de mantenimiento frente a cuidado activo',
        'Colas por causa de denegación',
      ],
    },
  },
  {
    slug: 'multi-specialty',
    name: pair('Multi-specialty Groups', 'Grupos multiespecialidad'),
    featured: false,
    summary: pair(
      'Cross-specialty reporting, site of service, shared staff and payer-contract inventory.',
      'Informes transversales, sitio de servicio, personal compartido e inventario de contratos de pagadores.',
    ),
    body: pair(
      'Multi-specialty groups lose the thread when each service line uses a different work queue. ROOT’s administrative brief is one inventory of contracts, sites and owners. Listing a specialty here is not a clinical program.',
      'Los grupos multiespecialidad pierden el hilo cuando cada línea usa una cola distinta. El alcance administrativo de ROOT es un inventario de contratos, sedes y responsables. Listar una especialidad no es un programa clínico.',
    ),
    focus: {
      en: [
        'Single contract inventory',
        'Site-of-service reporting',
        'Named owners per service line',
      ],
      es: [
        'Inventario único de contratos',
        'Informes de sitio de servicio',
        'Responsables por línea de servicio',
      ],
    },
  },
  {
    slug: 'vascular',
    name: pair('Vascular Care', 'Atención vascular'),
    featured: false,
    summary: pair(
      'Office-based and hospital vascular procedures with device tracking and policy research.',
      'Procedimientos vasculares en consulta y hospital con seguimiento de dispositivos e investigación de pólizas.',
    ),
    body: pair(
      'Vascular billing shares device and authorization patterns with cardiology, which is why the featured card is combined. This catalog page exists for vascular-only groups that want a narrower scope. No procedure outcomes are claimed.',
      'La facturación vascular comparte patrones de dispositivos y autorización con cardiología, por eso la tarjeta destacada está combinada. Esta página existe para grupos solo vasculares. No se afirman resultados de procedimientos.',
    ),
    focus: {
      en: ['Device claim tracking', 'Site-of-service policy', 'Authorization windows'],
      es: [
        'Seguimiento de reclamos de dispositivos',
        'Póliza de sitio de servicio',
        'Ventanas de autorización',
      ],
    },
  },
];

export function specialtyBySlug(slug: string): Specialty | undefined {
  return specialties.find((item) => item.slug === slug);
}

export function featuredSpecialties(): Specialty[] {
  return specialties
    .filter((item) => item.featured)
    .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));
}

export function catalogSpecialties(): Specialty[] {
  return [...specialties].sort((a, b) => a.slug.localeCompare(b.slug));
}

export function specialtyLabel(specialty: Specialty, locale: Locale, featured = false) {
  if (featured && specialty.featuredTitle) return specialty.featuredTitle[locale];
  return specialty.name[locale];
}

export const infectiousDiseaseSlug = 'infectious-disease';
