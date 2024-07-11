import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  // Recording...
await page.goto('http://admin-inghams.test.hotelplan.co.uk/ski-holidays/ski-resorts/austria/arlberg-ski-area/st-anton#0');
await page.getByLabel('Close dialog').click();
await page.getByRole('link', { name: 'Austria', exact: true }).click();
await page.locator('#tabpanel1').getByRole('link', { name: 'Mayrhofen', exact: true }).click();
await expect(page.getByRole('link', { name: 'Accommodation', exact: true })).toBeVisible();
await expect(page.getByRole('link', { name: 'Ski & Snowboard' })).toBeVisible();
await expect(page.getByRole('link', { name: 'Things To Do' })).toBeVisible();
await expect(page.getByRole('link', { name: 'Ski Extras' })).toBeVisible();
await expect(page.getByText('Excursions Tab')).toBeVisible();
await page.locator('#tabTop').getByLabel('Next').click();
await expect(page.getByRole('link', { name: 'Transfers - General Info' })).toBeVisible();
await page.locator('#tabTop').getByLabel('Previous').click();
await page.getByRole('link', { name: 'Accommodation', exact: true }).click();
await expect(page.getByText('Ski hotels in Mayrhofen Foersterhaus zum Kramerwirt from£989pp @accommodation.')).toBeVisible();
await page.getByRole('link', { name: 'Ski & Snowboard' }).click();
await expect(page.locator('[id="SkiSnowboard\\|Ski\\&Snowboard"] div').nth(1)).toBeVisible();
await page.getByRole('link', { name: 'Things To Do' }).click();
await expect(page.locator('#js-accordion-m9uv2k div').nth(2)).toBeVisible();
await page.getByRole('link', { name: 'Ski Extras' }).click();
await expect(page.locator('#tabTop div').filter({ hasText: 'Ski hotels in Mayrhofen' }).first()).toBeVisible();
await page.getByText('Excursions Tab').click();
await expect(page.locator('#tabTop div').filter({ hasText: 'Ski hotels in Mayrhofen' }).first()).toBeVisible();
await page.locator('#tabTop').getByLabel('Next').click();
await page.getByRole('link', { name: 'Transfers - General Info' }).click();
await expect(page.getByText('Flights depart Saturdays Transfer time Innsbruck airport: approx. 1 hour by')).toBeVisible();
});