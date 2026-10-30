# Local media inbox

`raw/` holds Pexels originals downloaded **after** a human approval record. Files here are gitignored. They are not site assets.

Workflow:

1. `PEXELS_API_KEY` in the local shell only (never `NEXT_PUBLIC_`).
2. `npm run media:search -- --asset=home-clinical`
3. Review the photo page, license, people, and trademarks.
4. Edit `docs/design/media-reviews.json` (do not use `--approve` flags).
5. `npm run media:download -- --asset=home-clinical`
6. Transform, strip EXIF, and publish through a separate reviewable PR.
