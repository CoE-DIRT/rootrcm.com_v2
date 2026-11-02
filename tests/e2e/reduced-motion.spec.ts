import { expect, test } from '@playwright/test';
import { MARQUEE_LOCATOR, MARQUEE_TRACK_LOCATOR, noHorizontalOverflow } from './helpers';

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('home remains usable and does not overflow', async ({ page }) => {
    await page.goto('/en');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Skip to content' })).toHaveCount(1);
    await noHorizontalOverflow(page);

    const prefersReduce = await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
    expect(prefersReduce).toBe(true);
  });

  test('infinite CSS animations are effectively disabled', async ({ page }) => {
    await page.goto('/en');
    const looping = await page.evaluate(() =>
      [...document.querySelectorAll('*')].some((el) => {
        const styles = getComputedStyle(el);
        const duration = Number.parseFloat(styles.animationDuration) || 0;
        return duration > 0.05 && styles.animationIterationCount === 'infinite';
      }),
    );
    expect(looping).toBeFalsy();
  });

  test('keyboard can still reach skip link and main', async ({ page }) => {
    await page.goto('/en');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main')).toBeVisible();
  });

  test('shipped marquees stop auto-scrolling under reduced motion', async ({ page }) => {
    await page.goto('/en');
    const marquee = page.locator(MARQUEE_LOCATOR);
    await expect(marquee.first(), 'home must render EcosystemMarquees').toHaveCount(1);

    const staticList = page.locator('.marquee-static-list').first();
    await expect(staticList).toBeVisible();

    const looping = await page.locator(MARQUEE_TRACK_LOCATOR).first().evaluate((el) => {
      const styles = getComputedStyle(el);
      const duration = Number.parseFloat(styles.animationDuration) || 0;
      const hiddenParent = getComputedStyle(el.closest('[data-marquee]') ?? el).display === 'none';
      return !hiddenParent && duration > 0.05 && styles.animationIterationCount === 'infinite';
    });
    expect(looping, 'marquee must not keep infinite motion under prefers-reduced-motion').toBeFalsy();
  });
});

test.describe('keyboard marquee alternative', () => {
  test('marquees exist and expose a keyboard-reachable pause control', async ({ page }) => {
    await page.goto('/en');
    const marquee = page.locator(MARQUEE_LOCATOR);
    await expect(marquee.first(), 'home must render EcosystemMarquees').toBeVisible();

    const pause = page.getByRole('button', { name: /pause scrolling platforms/i }).first();
    await expect(pause).toBeVisible();
    await pause.focus();
    await expect(pause).toBeFocused();
    await pause.click();
    await expect(page.getByRole('button', { name: /resume scrolling platforms/i }).first()).toBeVisible();
  });
});
