import { NextResponse } from 'next/server';
import { scoreLead } from '@/domain/lead-score';
import { hubspotAdapter } from '@/integrations/disabled';
import { getFeatureFlags } from '@/lib/flags';
import { validateBusinessContact } from '@/lib/validation/business-contact';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = validateBusinessContact(body);
  if (!parsed.ok) {
    return NextResponse.json(
      {
        data: null,
        meta: { correlationId: crypto.randomUUID() },
        error: { code: 'validation_error', message: 'Business contact validation failed.', fieldErrors: parsed.fieldErrors },
      },
      { status: 400 },
    );
  }

  const qualification = scoreLead({
    intent: (['consultation', 'diagnostic', 'managed', 'custom'].includes(parsed.data.concern ?? '')
      ? parsed.data.concern
      : 'other') as 'consultation' | 'diagnostic' | 'managed' | 'custom' | 'other',
    serviceFit: true,
    providerBand: 'unknown',
    complete: Boolean(parsed.data.message),
    consent: parsed.data.consent,
  });

  const flags = getFeatureFlags();
  const crm = hubspotAdapter();

  return NextResponse.json({
    data: {
      id: crypto.randomUUID(),
      status: 'received_local_only',
      crmEnabled: flags.crm,
      crm,
      qualification,
    },
    meta: { correlationId: crypto.randomUUID() },
    error: null,
  });
}
