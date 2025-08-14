import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://inghamsv2-ecms.qa.hotelplan.co.uk/');
  await page.getByRole('button', { name: 'Ski' }).click();
  await page.getByRole('button', { name: 'Search holidays' }).click();
  await page.getByRole('button', { name: 'Board Basis' }).click();
  await expect(page.locator('.c-modal__body')).toBeVisible();
  await page.locator('label').filter({ hasText: 'All Inclusive' }).click();
  await page.getByRole('button', { name: 'Confirm' }).click();
  await expect(page.locator('.c-search-card--resorts__board-basis').first()).toBeVisible();
  await page.getByRole('button', { name: 'Board Basis' }).click();
  await page.locator('label').filter({ hasText: 'All Inclusive' }).getByRole('img').click();
  await page.locator('label').filter({ hasText: 'Half Board' }).click();
  await page.getByRole('button', { name: 'Confirm' }).click();
  await expect(page.locator('.c-search-card--resorts__board-basis').first()).toBeVisible();
  await page.getByRole('button', { name: 'Board Basis' }).click();
  await page.locator('label').filter({ hasText: 'Half Board' }).click();
  await page.locator('label').filter({ hasText: 'Full Board' }).click();
  await page.locator('div').filter({ hasText: 'Confirm' }).nth(4).click();
  await expect(page.locator('.c-search-card--resorts__board-basis').first()).toBeVisible();
});