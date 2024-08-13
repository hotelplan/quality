import { APIRequestContext, test, expect } from '@playwright/test';
import {parse} from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';
import environmentBaseUrl from '../../resources/utils/environmentBaseUrl';
import tokenConfig from '../../resources/utils/tokenConfig';
import { describe } from 'node:test';

let ApiContext: APIRequestContext;
const env = process.env.ENV || 'qa';
const baseUrl = environmentBaseUrl[env].p_cms;
const adminToken = tokenConfig[env].p_cms;

// Helper function to read URLs from the CSV file
const LaplandDatacsv = parse(fs.readFileSync(path.join(__dirname, 'uat_data', 'Migration_Lapland.csv')), {columns: true, skip_empty_lines: true});
const SantaDatacsv = parse(fs.readFileSync(path.join(__dirname, 'uat_data', 'Migration_SantasBreaks.csv')), {columns: true, skip_empty_lines: true});
const SkiDatacsv = parse(fs.readFileSync(path.join(__dirname, 'uat_data', 'Migration_Ski.csv')), {columns: true, skip_empty_lines: true});
const WalkingDatacsv = parse(fs.readFileSync(path.join(__dirname, 'uat_data', 'Migration_Walking.csv')), {columns: true, skip_empty_lines: true});

const LaplandCountries = parse(fs.readFileSync(path.join(__dirname, 'uat_data', 'DD_List_CountriesLapland.csv')), {columns: true, skip_empty_lines: true});
const SantaCountries = parse(fs.readFileSync(path.join(__dirname, 'uat_data', 'DD_List_CountriesSanta.csv')), {columns: true, skip_empty_lines: true});
const SkiCountries = parse(fs.readFileSync(path.join(__dirname, 'uat_data', 'DD_List_CountriesSki.csv')), {columns: true, skip_empty_lines: true});
const WalkingCountries = parse(fs.readFileSync(path.join(__dirname, 'uat_data', 'DD_List_CountriesWalking.csv')), {columns: true, skip_empty_lines: true});

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

test.describe.configure({retries: 2, timeout: 30000,})

test.describe('P_CMS Ski Region Test', () => {
    
    const uniqueSkiRegionCodeData = Array.from(new Set(SkiDatacsv
        .map(data => data.RegionCode)
        .filter(regionCode => regionCode !== null && regionCode !== undefined  && regionCode.trim() !== '')))
        .map(uniqueRegionCode => {
            return SkiDatacsv.find(data => data.RegionCode === uniqueRegionCode);
        });


    for (const skiData of uniqueSkiRegionCodeData){
        test(`Ski Region Code(${skiData.RegionCode})`, async ({ page }) => {

            const response = await ApiContext['get'](`${baseUrl}/umbraco/delivery/api/v2/content?filter=product%3Aski&filter=regionCode%3A${skiData.RegionCode}&skip=0&take=10&fields=properties%5B%24all%5D`);
        
            const responseBody = await response.json();
            
            console.log(await response.status()); // Log the status for debugging
            console.log(responseBody); // Log the response body for debugging
        
            expect(response.status()).toBe(200);

            // Check the response body structure and content
            expect(responseBody).toHaveProperty('items');
            expect(Array.isArray(responseBody.items)).toBe(true);
            expect(responseBody.items.length).toEqual(1);

            // Check the first item in the response body
            const content = responseBody.items[0];

            expect(content).toHaveProperty('contentType');
            expect(content.contentType).toBe('regionSki');

            expect(content).toHaveProperty('name');
            expect(content.name).not.toBeNull();

            expect(content).toHaveProperty('createDate');
            expect(content.createDate).not.toBeNull();

            expect(content).toHaveProperty('updateDate');
            expect(content.updateDate).not.toBeNull();

            expect(content).toHaveProperty('route');
            expect(content.route).not.toBeNull();

            expect(content).toHaveProperty('id');
            expect(content.id).not.toBeNull();


            expect(content).toHaveProperty('properties');
            expect(content).toHaveProperty('properties');
            expect(content.properties).toHaveProperty('regionCode');
            expect(content.properties.regionCode).toBe(skiData.RegionCode);
          });

    }

});


test.describe('P_CMS Walking Region Test', () => {
    
    const uniqueWalkingRegionCodeData = Array.from(new Set(WalkingDatacsv
        .map(data => data.RegionCode)
        .filter(regionCode => regionCode !== null && regionCode !== undefined  && regionCode.trim() !== '')))
        .map(uniqueRegionCode => {
            return WalkingDatacsv.find(data => data.RegionCode === uniqueRegionCode);
        });

    for (const walkingData of uniqueWalkingRegionCodeData){
        test(`Walking Region Code(${walkingData.RegionCode})`, async ({ page }) => {
        
            const response = await ApiContext['get'](`${baseUrl}/umbraco/delivery/api/v2/content?filter=product%3Awalking&filter=regionCode%3A${walkingData.RegionCode}&skip=0&take=10&fields=properties%5B%24all%5D`);
        
            const responseBody = await response.json();
        
            console.log(await response.status()); // Log the status for debugging
            console.log(responseBody); // Log the response body for debugging
        
            expect(response.status()).toBe(200);

            // Check the response body structure and content
            expect(responseBody).toHaveProperty('items');
            expect(Array.isArray(responseBody.items)).toBe(true);
            expect(responseBody.items.length).toEqual(1);

            // Check the first item in the response body
            const content = responseBody.items[0];

            expect(content).toHaveProperty('contentType');
            expect(content.contentType).toBe('regionWalking');

            expect(content).toHaveProperty('name');
            expect(content.name).not.toBeNull();

            expect(content).toHaveProperty('createDate');
            expect(content.createDate).not.toBeNull();

            expect(content).toHaveProperty('updateDate');
            expect(content.updateDate).not.toBeNull();

            expect(content).toHaveProperty('route');
            expect(content.route).not.toBeNull();

            expect(content).toHaveProperty('id');
            expect(content.id).not.toBeNull();


            expect(content).toHaveProperty('properties');
            expect(content).toHaveProperty('properties');
            expect(content.properties).toHaveProperty('regionCode');
            expect(content.properties.regionCode).toBe(walkingData.RegionCode);
          });

    }

});

