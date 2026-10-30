import { expect, test } from '@playwright/test';
import { MARQUEE_LOCATOR, noHorizontalOverflow } from './helpers';

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

  test('marquee, if present, is paused rather than auto-scrolling', async ({ page }) => {
    await page.goto('/en');
    const marquee = page.locator(MARQUEE_LOCATOR);
    if ((await marquee.count()) === 0) {
      test.info().annotations.push({
        type: 'note',
        description: 'No marquee on this build; paused-motion assertion waits for frontend merge.',
      });
      return;
    }

    const looping = await marquee.first().evaluate((el) => {
      const styles = getComputedStyle(el);
      const duration = Number.parseFloat(styles.animationDuration) || 0;
      return duration > 0.05 && styles.animationIterationCount === 'infinite';
    });
    expect(looping, 'marquee must not keep infinite motion under prefers-reduced-motion').toBeFalsy();
  });
});

test.describe('keyboard marquee alternative', () => {
  test('when a marquee exists, a pause control or static list is keyboard reachable', async ({ page }) => {
    await page.goto('/en');
    const marquee = page.locator(MARQUEE_LOCATOR);
    if ((await marquee.count()) === 0) {
      test.info().annotations.push({
        type: 'note',
        description: 'No marquee on this build; keyboard alternative waits for frontend merge.',
      });
      return;
    }

    const pause = page.getByRole('button', { name: /pause|stop|play/i });
    if ((await pause.count()) > 0) {
      await pause.first().focus();
      await expect(pause.first()).toBeFocused();
      return;
    }

    const looping = await marquee.first().evaluate((el) => {
      const styles = getComputedStyle(el);
      const duration = Number.parseFloat(styles.animationDuration) || 0;
      return duration > 0.05 && styles.animationIterationCount === 'infinite';
    });
    expect(
      looping,
      'auto-scrolling marquee needs a keyboard-reachable pause/stop control (WCAG 2.2.2)',
    ).toBeFalsy();
  });
});
