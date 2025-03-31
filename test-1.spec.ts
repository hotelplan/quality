import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://inghamsv2-ecms.qa.hotelplan.co.uk/');
  await expect(page.locator('#trip-search div').filter({ hasText: 'Departure location(s)Any departure location Where would you like to go?' }).nth(2)).toBeVisible();
  //click Ski, walking or Lapland
  await page.getByRole('button', { name: 'Search holidays' }).click();
  await expect(page.getByText('Any date (7 nights)')).toBeVisible();
  await page.getByText('2 adults', { exact: true }).click();
  await expect(page.getByText('You searched forAny date (7 nights)2 adults From Any departure locationEdit')).toBeVisible();
  await expect(page.getByText('4Les Crozats')).toBeVisible();
  const page1Promise = page.waitForEvent('popup');
  await page.locator('.c-search-card--resorts-footer > .c-btn').first().click();
  const page1 = await page1Promise;
  await expect(page1.getByText('Any date (7 nights)')).toBeVisible();
  await expect(page1.getByText('2 adults', { exact: true })).toBeVisible();
  await expect(page1.getByText('2 adults', { exact: true })).toBeVisible();
});