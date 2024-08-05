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
    await page.close();
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
        
            const response = await ApiContext['get'](`${baseUrl}/umbraco/delivery/api/v2/content?filter=resortCode%3A${laplandData.ResortCode}%2C%20product%3Alapland&skip=0&take=10&fields=properties%5B%24all%5D`);
        
            const responseBody = await response.json();
        
            console.log(await response.status()); // Log the status for debugging
            console.log(responseBody); // Log the response body for debugging
        
            expect(response.status()).toBe(200);
          });

    }

});


test.describe('P_CMS Santa Test', () => {
    const uniqueSantaCountryCodeData = Array.from(new Set(SantaDatacsv
        .map(data => data.CountryCode)))
        .map(uniqueCountryCode => {
            return SantaDatacsv.find(data => data.CountryCode === uniqueCountryCode);
        });

    const uniqueSantaResortCodeData = Array.from(new Set(SantaDatacsv
        .map(data => data.ResortCode)
        .filter(resortCode => resortCode !== null && resortCode !== undefined  && resortCode.trim() !== '')))
        .map(uniqueResortCode => {
            return SantaDatacsv.find(data => data.ResortCode === uniqueResortCode);
        });

    for (const santaData of uniqueSantaCountryCodeData){
        test(`Santa Country Code(${santaData.CountryCode})`, async ({ page }) => {
            test.setTimeout(3000000);
        
            const response = await ApiContext['get'](`${baseUrl}/umbraco/delivery/api/v2/content?filter=countryCode%3A${santaData.CountryCode}%2C%20product%3Asanta&skip=0&take=10&fields=properties%5B%24all%5D`);
        
            const responseBody = await response.json();
        
            console.log(await response.status()); // Log the status for debugging
            console.log(responseBody); // Log the response body for debugging
        
            expect(response.status()).toBe(200);
          });

    }


    for (const santaData of uniqueSantaResortCodeData){
        test(`Santa Resort Code(${santaData.ResortCode})`, async ({ page }) => {
            test.setTimeout(3000000);
        
            const response = await ApiContext['get'](`${baseUrl}/umbraco/delivery/api/v2/content?filter=resortCode%3A${santaData.ResortCode}%2C%20product%3Asanta&skip=0&take=10&fields=properties%5B%24all%5D`);
        
            const responseBody = await response.json();
        
            console.log(await response.status()); // Log the status for debugging
            console.log(responseBody); // Log the response body for debugging
        
            expect(response.status()).toBe(200);
          });

    }

});


test.describe('P_CMS Ski Test', () => {
    const uniqueSkiCountryCodeData = Array.from(new Set(SkiDatacsv
        .map(data => data.CountryCode)))
        .map(uniqueCountryCode => {
            return SkiDatacsv.find(data => data.CountryCode === uniqueCountryCode);
        });
    
    const uniqueSkiRegionCodeData = Array.from(new Set(SkiDatacsv
        .map(data => data.RegionCode)
        .filter(regionCode => regionCode !== null && regionCode !== undefined  && regionCode.trim() !== '')))
        .map(uniqueRegionCode => {
            return SkiDatacsv.find(data => data.RegionCode === uniqueRegionCode);
        });

    const uniqueSkiResortCodeData = Array.from(new Set(SkiDatacsv
        .map(data => data.ResortCode)
        .filter(resortCode => resortCode !== null && resortCode !== undefined  && resortCode.trim() !== '')))
        .map(uniqueResortCode => {
            return SkiDatacsv.find(data => data.ResortCode === uniqueResortCode);
        });

    for (const skiData of uniqueSkiCountryCodeData){
        test(`Ski Country Code(${skiData.CountryCode})`, async ({ page }) => {
            test.setTimeout(3000000);
        
            const response = await ApiContext['get'](`${baseUrl}/umbraco/delivery/api/v2/content?filter=countryCode%3A${skiData.CountryCode}%2C%20product%3Aski&skip=0&take=10&fields=properties%5B%24all%5D`);
        
            const responseBody = await response.json();
        
            console.log(await response.status()); // Log the status for debugging
            console.log(responseBody); // Log the response body for debugging
        
            expect(response.status()).toBe(200);
          });

    }


    for (const skiData of uniqueSkiRegionCodeData){
        test(`Ski Region Code(${skiData.RegionCode})`, async ({ page }) => {
            test.setTimeout(3000000);
        
            const response = await ApiContext['get'](`${baseUrl}/umbraco/delivery/api/v2/content?filter=regionCode%3A${skiData.RegionCode}%2C%20product%3Aski&skip=0&take=10&fields=properties%5B%24all%5D`);
        
            const responseBody = await response.json();
        
            console.log(await response.status()); // Log the status for debugging
            console.log(responseBody); // Log the response body for debugging
        
            expect(response.status()).toBe(200);
          });

    }


    for (const skiData of uniqueSkiResortCodeData){
        test(`Ski Resort Code(${skiData.ResortCode})`, async ({ page }) => {
            test.setTimeout(3000000);
        
            const response = await ApiContext['get'](`${baseUrl}/umbraco/delivery/api/v2/content?filter=resortCode%3A${skiData.ResortCode}%2C%20product%3Aski&skip=0&take=10&fields=properties%5B%24all%5D`);
        
            const responseBody = await response.json();
        
            console.log(await response.status()); // Log the status for debugging
            console.log(responseBody); // Log the response body for debugging
        
            expect(response.status()).toBe(200);
          });

    }

});


test.describe('P_CMS Walking Test', () => {
    const uniqueWalkingCountryCodeData = Array.from(new Set(WalkingDatacsv
        .map(data => data.CountryCode)))
        .map(uniqueCountryCode => {
            return WalkingDatacsv.find(data => data.CountryCode === uniqueCountryCode);
        });
    
    const uniqueWalkingRegionCodeData = Array.from(new Set(WalkingDatacsv
        .map(data => data.RegionCode)
        .filter(regionCode => regionCode !== null && regionCode !== undefined  && regionCode.trim() !== '')))
        .map(uniqueRegionCode => {
            return WalkingDatacsv.find(data => data.RegionCode === uniqueRegionCode);
        });

    const uniqueWalkingResortCodeData = Array.from(new Set(WalkingDatacsv
        .map(data => data.ResortCode)
        .filter(resortCode => resortCode !== null && resortCode !== undefined  && resortCode.trim() !== '')))
        .map(uniqueResortCode => {
            return WalkingDatacsv.find(data => data.ResortCode === uniqueResortCode);
        });

    for (const walkingData of uniqueWalkingCountryCodeData){
        test(`Walking Country Code(${walkingData.CountryCode})`, async ({ page }) => {
            test.setTimeout(3000000);
        
            const response = await ApiContext['get'](`${baseUrl}/umbraco/delivery/api/v2/content?filter=countryCode%3A${walkingData.CountryCode}%2C%20product%3Awalking&skip=0&take=10&fields=properties%5B%24all%5D`);
        
            const responseBody = await response.json();
        
            console.log(await response.status()); // Log the status for debugging
            console.log(responseBody); // Log the response body for debugging
        
            expect(response.status()).toBe(200);
          });

    }


    for (const walkingData of uniqueWalkingRegionCodeData){
        test(`Walking Region Code(${walkingData.RegionCode})`, async ({ page }) => {
            test.setTimeout(3000000);
        
            const response = await ApiContext['get'](`${baseUrl}/umbraco/delivery/api/v2/content?filter=regionCode%3A${walkingData.RegionCode}%2C%20product%3Awalking&skip=0&take=10&fields=properties%5B%24all%5D`);
        
            const responseBody = await response.json();
        
            console.log(await response.status()); // Log the status for debugging
            console.log(responseBody); // Log the response body for debugging
        
            expect(response.status()).toBe(200);
          });

    }


    for (const walkingData of uniqueWalkingResortCodeData){
        test(`Walking Resort Code(${walkingData.ResortCode})`, async ({ page }) => {
            test.setTimeout(3000000);
        
            const response = await ApiContext['get'](`${baseUrl}/umbraco/delivery/api/v2/content?filter=resortCode%3A${walkingData.ResortCode}%2C%20product%3Awalking&skip=0&take=10&fields=properties%5B%24all%5D`);
        
            const responseBody = await response.json();
        
            console.log(await response.status()); // Log the status for debugging
            console.log(responseBody); // Log the response body for debugging
        
            expect(response.status()).toBe(200);
          });

    }

});

