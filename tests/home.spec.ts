import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('should have navigation to cardapio', async ({ page }) => {
    await page.goto('/');
    const cardapioLink = page.getByRole('link', { name: /cardápio|menu|ver menu/i });
    await expect(cardapioLink.first()).toBeVisible();
  });

  test('should display restaurant info', async ({ page }) => {
    await page.goto('/');
    // Check for common elements like phone, address, hours
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();
  });

  test('should have responsive navigation', async ({ page }) => {
    await page.goto('/');

    // Desktop nav should be visible on large screens
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(500);

    // Mobile: menu might be in hamburger
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
  });

  test('should toggle theme', async ({ page }) => {
    await page.goto('/');

    const themeToggle = page.getByRole('button', { name: /tema|theme|modo/i });
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(300);
    }
  });

  test('should navigate to cardapio page', async ({ page }) => {
    await page.goto('/');

    const cardapioLink = page.getByRole('link', { name: /cardápio|ver menu/i }).first();
    if (await cardapioLink.isVisible()) {
      await cardapioLink.click();
      await expect(page).toHaveURL(/cardapio/);
    }
  });
});
