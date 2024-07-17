// Import necessary modules
import { test, expect } from '@playwright/test';
import {parse} from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';

//test.afterAll(async ({ page },testInfo) => {
  //await page.close();
//});

// Helper function to read URLs from the CSV file
const SkiDatacsv = parse(fs.readFileSync(path.join(__dirname, 'uat_data', 'Migration_Ski.csv')), {
  columns: true,
  skip_empty_lines: true
});


// Define the test suite
for(const skiData of SkiDatacsv){
  test(`Test the source path for ${skiData.SourcePath}`, async ({ page }) => {
    test.setTimeout(3000000);

    const homePath = 'https://inghamsv2-ecms.stg.hotelplan.co.uk';
    const sourcePath = skiData.SourcePath.replace("home", "");
    const sourceURL = sourcePath.replace("ski-resorts","resorts");
    const FullURL = homePath + sourceURL;
    // Open the URL
    const response = await page.goto(FullURL, { waitUntil: 'domcontentloaded' });
    console.log('TEST = '+ FullURL);
    console.log('Response = '+ response.status());
    await expect(page).not.toHaveURL("https://inghamsv2-ecms.stg.hotelplan.co.uk/error-500")
    expect(response.status()).not.toBe(404);
    expect(response.status()).not.toBe(500);
  });
}
