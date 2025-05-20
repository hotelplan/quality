import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.getByRole('textbox', { name: 'Property alias:' }).click();
  await page.getByRole('textbox', { name: 'Property alias:' }).fill('Image Carousel Test');
  await page.getByRole('button', { name: 'Add Image Carousel Item' }).click();
  await page.getByRole('link', { name: 'Select Image Or Video' }).click();
  await page.getByRole('button', { name: 'Upload' }).click();
  await page.getByRole('button', { name: 'Upload' }).setInputFiles('357954091_931943701208774_8078663252509394719_n.jpg');
  await page.getByText('Ski Walking Lapland Generic V').click();
  await page.getByRole('button', { name: 'Select' }).click();
  await page.getByRole('button', { name: 'Create', exact: true }).nth(1).click();
});