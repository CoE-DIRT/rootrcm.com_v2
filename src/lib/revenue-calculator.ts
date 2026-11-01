/** Enterprise RCM & denial leakage calculator — illustrative planning math only. */

export const RECOVERY_RATE = 0.85;

export const CALCULATOR_DEFAULTS = {
  monthlyCollections: 850_000,
  denialRate: 8.5,
  practiceType: 'independent',
} as const;

export const CALCULATOR_BOUNDS = {
  monthlyCollections: { min: 100_000, max: 5_000_000, step: 10_000 },
  denialRate: { min: 2, max: 25, step: 0.1 },
} as const;

export const PRACTICE_TYPES = ['independent', 'asc', 'mso'] as const;
export type PracticeType = (typeof PRACTICE_TYPES)[number];

export type CalculatorInput = {
  monthlyCollections: number;
  denialRate: number;
  practiceType: PracticeType;
};

export type CalculatorOutput = {
  annualLost: number;
  recoverable: number;
  cleanClaim: number;
};

export function clampCollections(value: number): number {
  const { min, max, step } = CALCULATOR_BOUNDS.monthlyCollections;
  const rounded = Math.round(value / step) * step;
  return Math.min(max, Math.max(min, rounded));
}

export function clampDenialRate(value: number): number {
  const { min, max, step } = CALCULATOR_BOUNDS.denialRate;
  const rounded = Math.round(value / step) * step;
  return Math.min(max, Math.max(min, Number(rounded.toFixed(1))));
}

export function parsePracticeType(value: string | null | undefined): PracticeType {
  if (value === 'asc' || value === 'mso' || value === 'independent') return value;
  return CALCULATOR_DEFAULTS.practiceType;
}

export function computeLeakage(input: CalculatorInput): CalculatorOutput {
  const monthlyCollections = clampCollections(input.monthlyCollections);
  const denialRate = clampDenialRate(input.denialRate);
  const annualLost = monthlyCollections * 12 * (denialRate / 100);
  const recoverable = annualLost * RECOVERY_RATE;
  const cleanClaim = Number((100 - denialRate).toFixed(1));
  return {
    annualLost: Math.round(annualLost),
    recoverable: Math.round(recoverable),
    cleanClaim,
  };
}

export const CALCULATOR_QUERY_SOURCE = 'revenue-calculator';

/** Query-param contract consumed by `/onboarding` for diagnostic prefill. */
export type CalculatorQuery = {
  monthlyCollections: string;
  denialRate: string;
  practiceType: PracticeType;
  annualLost: string;
  recoverable: string;
  cleanClaim: string;
  source: typeof CALCULATOR_QUERY_SOURCE;
};

export function buildCalculatorQuery(input: CalculatorInput): CalculatorQuery {
  const output = computeLeakage(input);
  return {
    monthlyCollections: String(clampCollections(input.monthlyCollections)),
    denialRate: String(clampDenialRate(input.denialRate)),
    practiceType: parsePracticeType(input.practiceType),
    annualLost: String(output.annualLost),
    recoverable: String(output.recoverable),
    cleanClaim: String(output.cleanClaim),
    source: CALCULATOR_QUERY_SOURCE,
  };
}

export function calculatorQueryString(input: CalculatorInput): string {
  return new URLSearchParams(buildCalculatorQuery(input)).toString();
}

export function parseCalculatorSearchParams(
  params: URLSearchParams | Record<string, string | string[] | undefined>,
): CalculatorInput & CalculatorOutput & { source: string | null } {
  const get = (key: string): string | null => {
    if (params instanceof URLSearchParams) return params.get(key);
    const raw = params[key];
    if (Array.isArray(raw)) return raw[0] ?? null;
    return raw ?? null;
  };

  const monthlyCollections = clampCollections(
    Number(get('monthlyCollections') ?? CALCULATOR_DEFAULTS.monthlyCollections),
  );
  const denialRate = clampDenialRate(Number(get('denialRate') ?? CALCULATOR_DEFAULTS.denialRate));
  const practiceType = parsePracticeType(get('practiceType'));
  const computed = computeLeakage({ monthlyCollections, denialRate, practiceType });

  return {
    monthlyCollections,
    denialRate,
    practiceType,
    annualLost: Number(get('annualLost') ?? computed.annualLost) || computed.annualLost,
    recoverable: Number(get('recoverable') ?? computed.recoverable) || computed.recoverable,
    cleanClaim: Number(get('cleanClaim') ?? computed.cleanClaim) || computed.cleanClaim,
    source: get('source'),
  };
}
