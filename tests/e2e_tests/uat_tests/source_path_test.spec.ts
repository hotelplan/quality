// Import necessary modules
import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import * as path from 'path';

// Helper function to read URLs from the CSV file
async function readCSVAndGetURLs(filePath: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const urls: string[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => urls.push(data.sourcePath))
      .on('end', () => resolve(urls))
      .on('error', (error) => reject(error));
  });
}

let urls: string[] = [];
  
  test.beforeAll(async () => {
    // Adjust the path as necessary
    const filePath = path.join(__dirname, '..', 'tests', 'resources', 'data', 'Migration_Ski.csv');
    urls = await readCSVAndGetURLs(filePath);
  });

// Define the test
test.describe('Migration Ski URL Tests', () => {
  

    test(`Check URL for Not Found:`, async ({ page }) => {
      for (let url of urls) {
        console.log(url);
        const fullUrl = 'https://inghamsv2-pcms.stg.hotelplan.co.uk/';
        await page.goto(fullUrl, { waitUntil: 'domcontentloaded' });
      }
    
      //const fullUrl = url.startsWith('http') ? url : `https://inghamsv2-pcms.stg.hotelplan.co.uk/`; // Adjust as necessary
      //const response = await page.goto(fullUrl, { waitUntil: 'domcontentloaded' });
     
      // Check for 404 status code or specific content indicating "Page Not Found"
      /*if (response && response.status() === 404) {
        expect(response.status()).toBe(404);
      } else if (response && (await page.content()).includes('Page Not Found')) {
        expect(response.status()).toBe(404);
      } else {
        expect(response?.status()).not.toBe(404);
      }*/
    });

});