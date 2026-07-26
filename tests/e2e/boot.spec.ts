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

test('control panel end-turn button unlocks science', async ({ page }) => {
  await page.goto('/');
  await page.locator('#game[data-ready="true"]').waitFor();
  await expect(page.locator('#control-panel')).toBeVisible();
  await page.locator('[data-command="end-turn"]').click();
  await expect(page.locator('#game')).toHaveAttribute('data-science', 'open');
  await expect(page.locator('#game')).toHaveAttribute('data-day', '1');
  await expect(page.locator('.js-day')).toHaveText('Day 1');
});

test('shows capital guidance and blocks build until a blueprint is unlocked', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('#game[data-ready="true"]').waitFor();
  await expect(page.locator('.js-project')).toHaveText(/Build: none/);
  await expect(page.locator('[data-building="factory"]')).toBeDisabled();
  const canvas = page.locator('#game canvas');
  const box = await canvas.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await expect(page.locator('.js-message')).toContainText(
    'Select an unlocked building',
  );
});
