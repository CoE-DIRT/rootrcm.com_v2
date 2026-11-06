import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('docs/design/screenshots');
fs.mkdirSync(outDir, { recursive: true });

const baseUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3010';

async function capture() {
  const browser = await chromium.launch();

  // Desktop context
  const desktop = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    deviceScaleFactor: 1,
  });

  // Mobile context
  const mobile = await browser.newContext({
    viewport: { width: 375, height: 812 },
    isMobile: true,
    hasTouch: true,
  });

  const dPage = await desktop.newPage();
  const mPage = await mobile.newPage();

  console.log('Capturing Desktop Home (Dark / EN)...');
  await dPage.goto(`${baseUrl}/en`);
  await dPage.screenshot({ path: path.join(outDir, 'desktop-home-dark-en.png'), fullPage: false });

  console.log('Capturing Desktop Home (Light / EN)...');
  await dPage.getByRole('button', { name: 'Toggle color theme' }).click();
  await dPage.screenshot({ path: path.join(outDir, 'desktop-home-light-en.png'), fullPage: false });

  console.log('Capturing Desktop Home (Dark / ES)...');
  await dPage.getByRole('button', { name: 'Toggle color theme' }).click();
  await dPage.getByRole('link', { name: 'Switch language' }).click();
  await dPage.screenshot({ path: path.join(outDir, 'desktop-home-dark-es.png'), fullPage: false });

  console.log('Capturing Mobile Home (Dark / EN)...');
  await mPage.goto(`${baseUrl}/en`);
  await mPage.screenshot({ path: path.join(outDir, 'mobile-home-dark-en.png'), fullPage: false });

  console.log('Capturing Mobile Home (Light / EN)...');
  await mPage.getByRole('button', { name: 'Toggle color theme' }).click();
  await mPage.screenshot({ path: path.join(outDir, 'mobile-home-light-en.png'), fullPage: false });

  console.log('Capturing Consultation & Calendly (EN)...');
  await dPage.goto(`${baseUrl}/en/consultation`);
  await dPage.screenshot({ path: path.join(outDir, 'desktop-consultation-calendly-en.png'), fullPage: false });

  console.log('Capturing Login (EN)...');
  await dPage.goto(`${baseUrl}/en/login`);
  await dPage.screenshot({ path: path.join(outDir, 'desktop-login-en.png'), fullPage: false });

  console.log('Capturing Sign Up (EN)...');
  await dPage.goto(`${baseUrl}/en/signup`);
  await dPage.screenshot({ path: path.join(outDir, 'desktop-signup-en.png'), fullPage: false });

  console.log('Capturing Forgot Password (EN)...');
  await dPage.goto(`${baseUrl}/en/forgot-password`);
  await dPage.screenshot({ path: path.join(outDir, 'desktop-forgot-password-en.png'), fullPage: false });

  console.log('Capturing Reset Password (EN)...');
  await dPage.goto(`${baseUrl}/en/reset-password?userId=test&secret=test`);
  await dPage.screenshot({ path: path.join(outDir, 'desktop-reset-password-en.png'), fullPage: false });

  console.log('Capturing Contact (EN)...');
  await dPage.goto(`${baseUrl}/en/contact`);
  await dPage.screenshot({ path: path.join(outDir, 'desktop-contact-en.png'), fullPage: false });

  console.log('Capturing Services (EN)...');
  await dPage.goto(`${baseUrl}/en/services`);
  await dPage.screenshot({ path: path.join(outDir, 'desktop-services-en.png'), fullPage: false });

  console.log('Capturing Technology (EN)...');
  await dPage.goto(`${baseUrl}/en/technology`);
  await dPage.screenshot({ path: path.join(outDir, 'desktop-technology-en.png'), fullPage: false });

  await browser.close();
  console.log('Screenshots captured successfully in docs/design/screenshots/');
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
