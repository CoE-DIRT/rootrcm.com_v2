/**
 * Captures the responsive evidence grid and checks horizontal overflow.
 * Usage: BASE_URL=https://<deploy-preview> node scripts/capture-responsive.mjs [outDir]
 * Prints one JSON line per route×width: { route, width, scrollWidth, overflow, h1, navVisible }.
 */
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const base = process.env.BASE_URL ?? 'http://localhost:8889';
const out = process.argv[2] ?? 'test-results/responsive';
const widths = [320, 375, 414, 768, 1024, 1280, 1440, 1920, 2560];
const routes = (process.env.ROUTES ?? '/en,/en/login,/en/signup,/en/contact').split(',');
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
for (const route of routes) {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(base + route, { waitUntil: 'networkidle' });
    const r = await page.evaluate(() => {
      const bar = document.querySelector('.ui-nav__bar');
      const rect = bar?.getBoundingClientRect();
      const offenders = [...document.querySelectorAll('body *')]
        .filter((el) => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1 && getComputedStyle(el).position !== 'fixed')
        .slice(0, 3)
        .map((el) => el.className?.toString().slice(0, 60) || el.tagName);
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        h1: document.querySelectorAll('h1').length,
        navVisible: Boolean(rect && rect.height > 0 && rect.right <= window.innerWidth + 1),
        offenders,
      };
    });
    const slug = route.replace(/\//g, '_') || 'root';
    await page.screenshot({ path: `${out}/${slug}-${width}.png` });
    console.log(JSON.stringify({ route, width, ...r, overflow: r.scrollWidth > r.clientWidth }));
    await page.close();
  }
}
await browser.close();
