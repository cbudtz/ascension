import { expect, test } from '@playwright/test';

test('boots the homeworld planet view without browser errors', async ({
  page,
}) => {
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
  await expect(page.getByText('ASCENSION — Homeworld')).toBeVisible();
  expect(errors).toEqual([]);
});

test('ending the first turn unlocks science', async ({ page }) => {
  await page.goto('/');
  await page.locator('#game[data-ready="true"]').waitFor();
  await page.keyboard.press('e');
  await expect(page.getByText('Science: open')).toBeVisible();
});
