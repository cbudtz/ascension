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
  await expect(page.locator('#game')).toHaveAttribute('data-view', 'planet');
  await expect(page.locator('#game')).toHaveAttribute('data-science', 'locked');
  expect(errors).toEqual([]);
});

test('ending the first turn unlocks science', async ({ page }) => {
  await page.goto('/');
  await page.locator('#game[data-ready="true"]').waitFor();
  await page.keyboard.press('e');
  await expect(page.locator('#game')).toHaveAttribute('data-science', 'open');
  await expect(page.locator('#game')).toHaveAttribute('data-day', '1');
});
