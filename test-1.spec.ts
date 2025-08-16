import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://inghamsv2-ecms.qa.hotelplan.co.uk/');
  await page.getByRole('button', { name: 'Ski' }).click();
  await page.getByRole('button', { name: 'Search holidays' }).click();
  await page.getByRole('button', { name: 'Duration' }).click();
  await page.getByRole('listitem').filter({ hasText: /^3 nights$/ }).locator('span').nth(1).click();
  await page.getByRole('button', { name: 'Confirm' }).click();
  await expect(page.getByText('Any date')).toBeVisible();
  await expect(page.getByText('25 results')).toBeVisible();
  await page.getByRole('button', { name: 'Duration' }).click();
  await page.locator('label').filter({ hasText: /^4 nights$/ }).click();
  await page.getByRole('button', { name: 'Confirm' }).click();
  await expect(page.getByText('Any date')).toBeVisible();
  await expect(page.getByText('25 results')).toBeVisible();
  await page.getByRole('button', { name: 'Duration' }).click();
  await page.locator('label').filter({ hasText: '5 nights' }).click();
  await page.getByRole('button', { name: 'Confirm' }).click();
  await expect(page.getByText('Any date')).toBeVisible();
  await expect(page.getByText('16 results')).toBeVisible();
  await page.getByRole('button', { name: 'Duration' }).click();
  await page.locator('label').filter({ hasText: '6 nights' }).click();
  await page.getByRole('button', { name: 'Confirm' }).click();
  await expect(page.getByText('Any date')).toBeVisible();
  await expect(page.getByText('30 results')).toBeVisible();
});