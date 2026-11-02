import { NextResponse } from 'next/server';
import type { ApiResponse } from '../../domain/http.ts';
import type { PolicyDecision } from '../auth/policy.ts';

export function correlationId(): string {
  return crypto.randomUUID();
}

export function jsonApi<T>(
  status: number,
  body: ApiResponse<T>,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

export function jsonError(
  status: number,
  code: string,
  message: string,
  id = correlationId(),
): NextResponse<ApiResponse<null>> {
  return jsonApi(status, {
    data: null,
    meta: { correlationId: id },
    error: { code, message },
  });
}

export function policyStatus(decision: Extract<PolicyDecision, { allow: false }>): number {
  switch (decision.code) {
    case 'auth_disabled':
      return 503;
    case 'unauthenticated':
      return 401;
    case 'not_a_member':
    case 'forbidden':
    case 'entitlement_inactive':
      return 403;
    default:
      return 403;
  }
}

export function policyDenied(
  decision: Extract<PolicyDecision, { allow: false }>,
): NextResponse<ApiResponse<null>> {
  const messages: Record<typeof decision.code, string> = {
    auth_disabled: 'Authentication is not active.',
    unauthenticated: 'Sign-in is required.',
    not_a_member: 'Not a member of this organization.',
    forbidden: 'This role cannot perform that action.',
    entitlement_inactive: 'Required entitlement is not active.',
  };
  return jsonError(policyStatus(decision), decision.code, messages[decision.code]);
}
