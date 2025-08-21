import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://inghamsv2-ecms.qa.hotelplan.co.uk/');
  await page.getByRole('button', { name: 'Ski' }).click();
  await page.getByRole('button', { name: 'Search holidays' }).click();
  await page.locator('div').filter({ hasText: /^View results by resort$/ }).locator('label').click();
  await expect(page.getByRole('button', { name: 'Ratings' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Best For' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Board Basis' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Facilities' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Holiday Types' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Duration' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Budget' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'All filters' })).toBeVisible();
  await expect(page.locator('#searchResult div').filter({ hasText: 'ChamonixFranceFantastic off' }).nth(2)).toBeVisible();
});