# 04 — Conversion

## Entry routes
| Route | Business outcome | Data owner |
| --- | --- | --- |
| Free account | Business signup, free workspace, CRM lead | Appwrite + HubSpot |
| Free consultation | Scheduling request, follow-up | HubSpot |
| Paid diagnostic | Checkout, onboarding, deliverable tracking | Stripe + Appwrite |
| Recurring plan | Subscription, invoices, entitlements | Stripe + Appwrite |
| Custom RCM/MSO | Qualified opportunity, proposal, contract | HubSpot + Appwrite |

All external services are *disabled* in foundation. Explicit consent, schema validation, rate limiting and no PHI in public forms. Stripe webhooks must be verified before granting entitlements. Paid pricing and contractual inclusions require approval against final service catalog.
