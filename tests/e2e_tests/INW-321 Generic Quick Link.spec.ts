import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://inghams-v2.newdev.hotelplan.co.uk/');
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Manage my booking' }).click();
  const page1 = await page1Promise;
  await expect(page1.getByText('MANAGE MY BOOKING', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Agents Login' }).click();
  await expect(page.locator('use').nth(1)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'AGENT LOGIN' })).toBeVisible();
  await page.getByRole('contentinfo').getByRole('link', { name: 'Ski Holidays', exact: true }).click();
  await expect(page.getByRole('link', { name: 'Inghams SKI' })).toBeVisible();
  await page.goto('https://inghams-v2.newdev.hotelplan.co.uk/');
});