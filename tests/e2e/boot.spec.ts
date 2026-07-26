import { expect, test } from '@playwright/test';

test('boots Phaser without browser errors', async ({ page }) => {
  const errors: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  page.on('pageerror', (error) => {
    errors.push(error.message);
  });

  await page.goto('/');
  await page.locator('#game[data-ready="true"]').waitFor();

  await expect(page.locator('#game canvas')).toBeVisible();
  expect(errors).toEqual([]);
});
