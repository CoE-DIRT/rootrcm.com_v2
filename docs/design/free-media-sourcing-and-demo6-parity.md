# ROOT V2 — Original media + free photography sourcing implementation

**Design reference**: Demo 6 HTML (`ROOT_V2_Interactive_Browser_Demo_6.html`) and Figma file `x5HJC3HjJNCCTUOwEdUc52`.

## Accepted source order

1. The founder-approved Demo 5/6 reference imagery: `mark.jpg` (250×243), `logo.jpg` (346×220), `poster.jpg` (400×400), `banner.jpg` (600×200), `story.jpg` (600×338), `waveLower.jpg` (600×52), in `CONTENT_IMAGE_LOCK_V5.json`. Restore original bytes and aspect ratio, do not recreate approximations.
2. Original ROOT-owned DIRT screenshots and analytics diagrams with fictional data, including new `public/media/root-revenue-hero.svg`, `root-workflow-network.svg`.
3. Curated freely licensed **Pexels free photos**, locally downloaded from the individual original photo page below. Only download the **free** option; verify license, depicted subject rights and whether a model or brand needs additional permission.
4. Unsplash free imagery: https://unsplash.com/license; Pixabay: https://pixabay.com/service/license-summary/. Exclude sponsored/premium/license-incompatible entries.
5. An additional original commissioned asset if an adequate licensed photo cannot be found.

## Curated Pexels candidate pages — manually verified 2026-10-31

| ROOT location | Subject / crop | Original Pexels photo page | License status on listing | Suggested local filename |
|---|---|---|---|---|
| Homepage healthcare + operations secondary visual | Medical professionals collaborating on laptop, portrait; place on right within masked glass composition | https://www.pexels.com/photo/medical-professionals-using-a-laptop-7800551/ | Free | `public/media/stock/clinical-team-laptop.webp` |
| Services / Practice management | Doctor using laptop in modern office, landscape | https://www.pexels.com/photo/a-doctor-working-on-his-laptop-4989174/ | Free | `public/media/stock/practice-doctor-laptop.webp` |
| Company / operational collaboration | Medical staff discussing work, landscape | https://www.pexels.com/photo/healthcare-workers-having-a-discussion-6129657/ | Free | `public/media/stock/healthcare-collaboration.webp` |
| Technology / DIRT case context | Diverse office team analyzing data; landscape | https://www.pexels.com/photo/a-person-using-a-laptop-while-in-a-meeting-7693733/ | Free | `public/media/stock/analytics-team.webp` |
| Credentialing / payer enrollment section | Doctor working at desk, landscape | https://www.pexels.com/photo/an-elderly-doctor-looking-at-the-monitor-of-a-laptop-8376296/ | Free | `public/media/stock/credentialing-office.webp` |
| Infectious Disease / specialty safety theme | Clinical staff moving in sterile hospital hallway | https://www.pexels.com/photo/medical-professionals-walking-in-a-hallway-9574339/ | Free | `public/media/stock/infectious-disease-hospital.webp` |
| Consultations / virtual support | Senior doctor at laptop in office | https://www.pexels.com/photo/a-doctor-using-laptop-8376228/ | Free | `public/media/stock/virtual-practice-support.webp` |
| Go/RCM operations and integrations | Team looking at graphs on digital screens | https://www.pexels.com/photo/people-looking-at-graphs-on-a-laptop-and-a-digital-tablet-6930432/ | Free | `public/media/stock/revenue-analytics.webp` |

**These are candidates, not downloaded/committed files.** A filename in this table does not mean it exists. Pick the most context-appropriate photos and avoid using many staged human photos with no diversity or business context. Match aspect ratios before implementation.

## Cursor execution workflow

1. Locate all original Demo 6 assets first, restore them to `public/brand/` with originals, and compare their intrinsic dimensions with `CONTENT_IMAGE_LOCK_V5.json`.
2. Open the **specific photo page** above in browser (or manually), confirm it says **Free**, select Download. Do not blindly scrape the Pexels website or hotlink CDN images at runtime. Never copy photos from arbitrary Google Image results.
3. Store original photographer name, original photo page, date, license link and asset-specific context in `docs/design/media-provenance.csv` or an updated manifest. Preserve the untouched original outside `public/` if needed.
4. Transform local originals using `sharp` or equivalent installed tooling into responsive WebP/AVIF, with metadata stripped and a sensible file-size target. Use locally served `next/image` files with declared `sizes` and reserved aspect ratio to prevent CLS.
5. Apply the established Clinical Glass image system: tinted navy image overlay, CSS gradient `mask-image` or layered alpha scrim, glass translucent text/actions, focus and contrast. Never place a critical line over an uncontrolled bright face or screen.
6. Verify all images in 375, 768, 1366 and 2560 widths; light/dark, touch, ES/EN, reduced-motion. Add screenshot comparisons against Demo 6 and Figma; test 404/broken images.
7. Replace original illustration **only when a reviewed image is actually better** and preserve all original prose, navigation, CTAs and data flows.

## Rights and claims

Pexels https://www.pexels.com/license/ permits free commercial use and modifications without mandatory attribution, but **no implied endorsement** by depicted persons/brands. Unsplash https://unsplash.com/license permits free commercial use, with separate rights concerns around recognizable people, trademarks and artworks. Photography licenses do **not** magically convey a client's testimonial or partner relationship.

Do not use stock portraits for ROOT personnel or clients, or badges for unverified certifications. Do not put any photo showing real PHI, recognizable patient records or medical documents on the website. The founder's real testimonials, case studies and certifications remain an independent final editorial approval gate.

## Website parity checks

- Global logo, header utility strip, six-category mega-menu with working dropdowns, touch mobile drawer.
- Homepage media-rich hero, specialties cards, ecosystem marquees, product preview, case-study slots, comparison and CTA sections.
- Rich footer: conversion CTA, four link columns, ROOT brand, newsletter request, verified social destinations, direct contact, full legal links and contact address.
- Floating Ask ROOT guide at bottom-right: open/close, quick topics, deterministic responses, route links, EN/ES, safe no-PHI behavior, mobile keyboard access.
- Client portal, Go synthetic provider/payer workflows, pricing gates, lead/onboarding progression and meaningful next-action behavior.
- All key fields and claims must trace to approved sources rather than visual placeholders.

**No content or interaction reduction is allowed as part of media integration.**
