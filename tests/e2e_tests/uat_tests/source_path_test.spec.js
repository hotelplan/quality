// Import modules
import { test, expect } from '@playwright/test';
import {parse} from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';


//test.afterAll(async ({ page },testInfo) => {
  //await page.close();
//});


//path of the UAT site
//const HOMEpath = 'https://inghamsv2-ecms.stg.hotelplan.co.uk';
const HOMEpath = 'https://inghams-v2.newdev.hotelplan.co.uk';
//const ERRORpath ='https://inghamsv2-ecms.stg.hotelplan.co.uk/error-500';
const ERRORpath = 'https://inghams-v2.newdev.hotelplan.co.uk/error-500';

// Helper function to read URLs from the CSV file
const LaplandDatacsv = parse(fs.readFileSync(path.join(__dirname, 'uat_data', 'Migration_Lapland.csv')), {columns: true, skip_empty_lines: true});
const SantaDatacsv = parse(fs.readFileSync(path.join(__dirname, 'uat_data', 'Migration_SantasBreaks.csv')), {columns: true, skip_empty_lines: true});
const SkiDatacsv = parse(fs.readFileSync(path.join(__dirname, 'uat_data', 'Migration_Ski.csv')), {columns: true, skip_empty_lines: true});
const WalkingDatacsv = parse(fs.readFileSync(path.join(__dirname, 'uat_data', 'Migration_Walking.csv')), {columns: true, skip_empty_lines: true});


// Define the test suite
test.describe('Lapland Source Path', () => {
for(const laplandData of LaplandDatacsv){
  test(`Lapland source path test for ${laplandData.SourcePath}`, async ({ page }) => {
    test.setTimeout(3000000);

    const sourcePath = laplandData.SourcePath.replace("home", "");
    const FullURL = HOMEpath + sourcePath;
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


for(const santasData of SantaDatacsv){
  test(`Santas source path test for ${santasData.SourcePath}`, async ({ page }) => {
    test.setTimeout(3000000);

    const sourcePath = santasData.SourcePath.replace("home", "");
    const FullURL = HOMEpath + sourcePath;
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
  test(`Ski source path test for ${skiData.SourcePath}`, async ({ page }) => {
    test.setTimeout(3000000);

    const sourcePath = skiData.SourcePath.replace("home", "");
    const sourceURL = sourcePath.replace("ski-resorts","resorts");
    const FullURL = HOMEpath + sourceURL;
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
  test(`Walking source path test for ${walkingData.SourcePath}`, async ({ page }) => {
    test.setTimeout(3000000);

    const sourcePath = walkingData.SourcePath.replace("home", "/walking-holidays");
    //const sourceURL = sourcePath.replace("ski-resorts","resorts");
    const FullURL = HOMEpath + sourcePath;
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
