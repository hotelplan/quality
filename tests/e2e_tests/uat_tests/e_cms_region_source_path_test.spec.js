// Import modules
import { test, expect } from '@playwright/test';
import environmentBaseUrl from '../../resources/utils/environmentBaseUrl';
import {parse} from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';


//test.afterAll(async ({ page },testInfo) => {
  //await page.close();
//});

const env = process.env.ENV || 'dev_test';
const HOMEpath = environmentBaseUrl[env].e_cms;
const ERRORpath = `${HOMEpath}/error-500`;

// Helper function to read URLs from the CSV file
const LaplandDatacsv = parse(fs.readFileSync(path.join(__dirname, 'uat_data', 'Migration_Lapland.csv')), {columns: true, skip_empty_lines: true});
const SantaDatacsv = parse(fs.readFileSync(path.join(__dirname, 'uat_data', 'Migration_SantasBreaks.csv')), {columns: true, skip_empty_lines: true});
const SkiDatacsv = parse(fs.readFileSync(path.join(__dirname, 'uat_data', 'Migration_Ski.csv')), {columns: true, skip_empty_lines: true});
const WalkingDatacsv = parse(fs.readFileSync(path.join(__dirname, 'uat_data', 'Migration_Walking.csv')), {columns: true, skip_empty_lines: true});

test.describe.configure({retries: 2, timeout: 60000,})
// Define the test suite
test.describe('Lapland Region Source Path', () => {

  const filteredData = LaplandDatacsv.filter(row => row['Alias'].includes('region'));

  for(const laplandData of filteredData){
    test(`Lapland (${laplandData.Country}) test: ${laplandData.SourcePath}`, async ({ page }) => {

      const sourcePath = laplandData.SourcePath.replace("home", "");
      const sourceURL = sourcePath.replace(/lapland-/g,"lapland");
      const sourceURLmod = sourceURL.replace("laplandholidays","lapland-holidays");
      const sourcePathmod = sourceURLmod.replace(/st\./g,"st-");
      const FullURL = HOMEpath + sourcePathmod;
      // Open the URL
      const response = await page.goto(FullURL, { waitUntil: 'domcontentloaded' });
      console.log('TEST = '+ FullURL);
      console.log('Response = '+ response.status());
      await expect(page).not.toHaveURL(ERRORpath)
      await expect(response.status()).not.toBe(404);
      await expect(response.status()).not.toBe(500);
      await expect(response.status()).not.toBe(503);
    });
  }
});


test.describe('Santa Region Source Path', () => {
  
  const filteredData = SantaDatacsv.filter(row => row['Alias'].includes('region'));

  for(const santasData of filteredData){
    test(`Santa Breaks (${santasData.Country}) test: ${santasData.SourcePath}`, async ({ page }) => {
  
      const sourcePath = santasData.SourcePath.replace("home", "");
      const sourceURL = sourcePath.replace(/lapland-/g,"lapland");
      const sourceURLmod = sourceURL.replace("laplandholidays","lapland-holidays");
      const sourcePathmod = sourceURLmod.replace(/st\./g,"st-");
      const FullURL = HOMEpath + sourcePathmod;
      // Open the URL
      const response = await page.goto(FullURL, { waitUntil: 'domcontentloaded' });
      console.log('TEST = '+ FullURL);
      console.log('Response = '+ response.status());
      await expect(page).not.toHaveURL(ERRORpath)
      await expect(response.status()).not.toBe(404);
      await expect(response.status()).not.toBe(500);
      await expect(response.status()).not.toBe(503);
    });
  }

});


test.describe('Ski Region Source Path', () => {

  const filteredData = SkiDatacsv.filter(row => row['Alias'].includes('region'));

  for(const skiData of filteredData){
    test(`Ski (${skiData.Country}) test: ${skiData.SourcePath}`, async ({ page }) => {

      const sourcePath = skiData.SourcePath.replace("home", "");
      const sourceURL = sourcePath.replace("ski-resorts","resorts");
      const sourcePathmod = sourceURL.replace(/st\./g,"st-");
      const FullURL = HOMEpath + sourcePathmod;
      // Open the URL
      const response = await page.goto(FullURL, { waitUntil: 'domcontentloaded' });
      console.log('TEST = '+ FullURL);
      console.log('Response = '+ response.status());
      await expect(page).not.toHaveURL(ERRORpath)
      await expect(response.status()).not.toBe(404);
      await expect(response.status()).not.toBe(500);
      await expect(response.status()).not.toBe(503);
    });
  }
});


test.describe('Walking Region Source Path', () => {

  const filteredData = WalkingDatacsv.filter(row => row['Alias'].includes('region'));

  for(const walkingData of filteredData){
    test(`Walking (${walkingData.Country}) test: ${walkingData.SourcePath}`, async ({ page }) => {

      const sourcePath = walkingData.SourcePath.replace("home", "/walking-holidays");
      const sourcePathmod = sourcePath.replace(/st\./g,"st-");
      const FullURL = HOMEpath + sourcePathmod;
      // Open the URL
      const response = await page.goto(FullURL, { waitUntil: 'domcontentloaded' });
      console.log('TEST = '+ FullURL);
      console.log('Response = '+ response.status());
      await expect(page).not.toHaveURL(ERRORpath)
      await expect(response.status()).not.toBe(404);
      await expect(response.status()).not.toBe(500);
      await expect(response.status()).not.toBe(503);
    });
  }
});
