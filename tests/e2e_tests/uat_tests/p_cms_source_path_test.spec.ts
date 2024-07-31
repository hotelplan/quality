import { APIRequestContext, test, expect } from '@playwright/test';
import {parse} from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';
import environmentBaseUrl from '../../resources/utils/environmentBaseUrl';
import tokenConfig from '../../resources/utils/tokenConfig';
import { describe } from 'node:test';

let ApiContext: APIRequestContext;
const env = process.env.ENV || 'dev_test';
const baseUrl = environmentBaseUrl[env].p_cms;
const adminToken = tokenConfig[env].p_cms;

// Helper function to read URLs from the CSV file
const LaplandDatacsv = parse(fs.readFileSync(path.join(__dirname, 'uat_data', 'Migration_Lapland.csv')), {columns: true, skip_empty_lines: true});
const SantaDatacsv = parse(fs.readFileSync(path.join(__dirname, 'uat_data', 'Migration_SantasBreaks.csv')), {columns: true, skip_empty_lines: true});
const SkiDatacsv = parse(fs.readFileSync(path.join(__dirname, 'uat_data', 'Migration_Ski.csv')), {columns: true, skip_empty_lines: true});
const WalkingDatacsv = parse(fs.readFileSync(path.join(__dirname, 'uat_data', 'Migration_Walking.csv')), {columns: true, skip_empty_lines: true});


//test.beforeAll(async ({playwright,page}) => {
    
//});

test.beforeEach(async ({ playwright, page },testInfo) => {

    ApiContext = await playwright.request.newContext({
        baseURL: baseUrl,
        extraHTTPHeaders: {
            'Api-Key': adminToken,
            'Accept': 'application/json',
        },
    });
});
  
test.afterEach(async ({ page },testInfo) => {
    //await page.close();
});

test.describe('P_CMS Lapland Test', () => {
    const uniqueLaplandCountryCodeData = Array.from(new Set(LaplandDatacsv
        .map(data => data.CountryCode)))
        .map(uniqueCountryCode => {
            return LaplandDatacsv.find(data => data.CountryCode === uniqueCountryCode);
        });

    const uniqueLaplandResortCodeData = Array.from(new Set(LaplandDatacsv
        .map(data => data.ResortCode)
        .filter(resortCode => resortCode !== null && resortCode !== undefined  && resortCode.trim() !== '')))
        .map(uniqueResortCode => {
            return LaplandDatacsv.find(data => data.ResortCode === uniqueResortCode);
        });

    for (const laplandData of uniqueLaplandCountryCodeData){
        test(`Lapland Country Code(${laplandData.CountryCode})`, async ({ page }) => {
            test.setTimeout(3000000);
        
            const response = await ApiContext['get'](`${baseUrl}/umbraco/delivery/api/v2/content?filter=countryCode%3A${laplandData.CountryCode}%2C%20product%3Alapland&skip=0&take=10&fields=properties%5B%24all%5D`);
        
            const responseBody = await response.json();
        
            console.log(await response.status()); // Log the status for debugging
            console.log(responseBody); // Log the response body for debugging
        
            expect(response.status()).toBe(200);
          });

    }


    for (const laplandData of uniqueLaplandResortCodeData){
        test(`Lapland Resort Code(${laplandData.ResortCode})`, async ({ page }) => {
            test.setTimeout(3000000);
        
            const response = await ApiContext['get'](`${baseUrl}/umbraco/delivery/api/v2/content?filter=ResortCode%3A${laplandData.ResortCode}%2C%20product%3Alapland&skip=0&take=10&fields=properties%5B%24all%5D`);
        
            const responseBody = await response.json();
        
            console.log(await response.status()); // Log the status for debugging
            console.log(responseBody); // Log the response body for debugging
        
            expect(response.status()).toBe(200);
          });

    }

});

