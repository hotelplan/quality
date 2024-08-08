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
const HOMEpath = environmentBaseUrl[env].inghams;
const ERRORpath = `${HOMEpath}/error-500`;

// Helper function to read URLs from the CSV file
const LaplandDatacsv = parse(fs.readFileSync(path.join(__dirname, 'uat_data', 'Migration_Lapland.csv')), {columns: true, skip_empty_lines: true});
const SantaDatacsv = parse(fs.readFileSync(path.join(__dirname, 'uat_data', 'Migration_SantasBreaks.csv')), {columns: true, skip_empty_lines: true});
const SkiDatacsv = parse(fs.readFileSync(path.join(__dirname, 'uat_data', 'Migration_Ski.csv')), {columns: true, skip_empty_lines: true});
const WalkingDatacsv = parse(fs.readFileSync(path.join(__dirname, 'uat_data', 'Migration_Walking.csv')), {columns: true, skip_empty_lines: true});


// Define the test suite
test.describe('Lapland Source Path', () => {
  for(const laplandData of LaplandDatacsv){
    test(`Lapland (${laplandData.Country}) test: ${laplandData.SourcePath}`, async ({ page }) => {
      test.setTimeout(3000000);
  
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
  
  
  test.describe('Santa Source Path', () => {
    for(const santasData of SantaDatacsv){
      test(`Santa Breaks (${santasData.Country}) test: ${santasData.SourcePath}`, async ({ page }) => {
        test.setTimeout(3000000);
    
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
  
  
  test.describe('Ski Source Path', () => {
  for(const skiData of SkiDatacsv){
    test(`Ski (${skiData.Country}) test: ${skiData.SourcePath}`, async ({ page }) => {
      test.setTimeout(3000000);
  
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
  
  
  test.describe('Walking Source Path', () => {
  for(const walkingData of WalkingDatacsv){
    test(`Walking (${walkingData.Country}) test: ${walkingData.SourcePath}`, async ({ page }) => {
      test.setTimeout(3000000);
  
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
  