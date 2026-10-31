# Original Demo 6 brand recovery

Six original WebP files were decoded unchanged from `window.ROOT_ASSETS` in the checked-in Demo 6 reference. SHA-256 digests and actual dimensions are in `original-brand-assets.json`.

The shared header/footer lockup now uses the original `mark.webp` with its native aspect ratio. `logo.webp`, `banner.webp`, `story.webp`, `poster.webp`, and `waveLower.webp` are available for contextual placement without recreating the brand. These are founder-supplied prototype assets; this extraction does not establish additional third-party rights.

The embedded banner/story/poster/wave assets are larger than the historical reference dimensions; the manifest records the actual decoded bytes. Do not resize or stretch them to an inaccurate historical lock.

The six brand files still match `original-brand-assets.json` byte for byte. `mark.webp` is the header lockup and is embedded, unchanged, in `src/app/icon.svg` and the apple-touch renderer. `waveLower.webp` is the New York page rule at its native 1600×138 ratio. `logo.webp`, `banner.webp`, `story.webp`, and `poster.webp` stay in `public/brand` and are not mounted: the story and poster bake in outcome slogans, and the logo and banner are full lockups that would duplicate the header.

Four Pexels photos were downloaded on 2026-10-31 after the original pages were opened and checked for a Free license and subject fit. Provenance is in `editorial-media-manifest.json`. The homepage and services heroes use the office laptop photograph. The technology hero uses the meeting photograph. Both carry a visible caption that the people are not ROOT staff. The hallway and chart photographs are local but not mounted, because their sections live in files this slice does not own. Four other candidate pages were free to use and were rejected for clinical paperwork, medication, or a patient-care description. They are not in `public/`.

The original revenue and workflow SVG illustrations remain the hero background. New York EN/ES copy names the public-source directory and keeps the no-contract and no-office disclosures. Individual payer source links and review dates are unchanged.
