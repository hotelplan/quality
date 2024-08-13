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

test.describe('P_CMS Lapland Resort Test', () => {

    const uniqueLaplandResortCodeData = Array.from(new Set(LaplandDatacsv
        .map(data => data.ResortCode)
        .filter(resortCode => resortCode !== null && resortCode !== undefined  && resortCode.trim() !== '')))
        .map(uniqueResortCode => {
            return LaplandDatacsv.find(data => data.ResortCode === uniqueResortCode);
        });


    for (const laplandData of uniqueLaplandResortCodeData){
        test(`Lapland Resort Code(${laplandData.ResortCode})`, async ({ page }) => {
        
            const response = await ApiContext['get'](`${baseUrl}/umbraco/delivery/api/v2/content?filter=product%3Alapland&filter=resortCode%3A${laplandData.ResortCode}&skip=0&take=10&fields=properties%5B%24all%5D`);
        
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
            expect(content.contentType).toBe('resortLapland');

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
            expect(content.properties).toHaveProperty('resortCode');
            expect(content.properties.resortCode).toBe(laplandData.ResortCode);
          });

    }

});


test.describe('P_CMS Santa Resort Test', () => {

    const uniqueSantaResortCodeData = Array.from(new Set(SantaDatacsv
        .map(data => data.ResortCode)
        .filter(resortCode => resortCode !== null && resortCode !== undefined  && resortCode.trim() !== '')))
        .map(uniqueResortCode => {
            return SantaDatacsv.find(data => data.ResortCode === uniqueResortCode);
        });

 
    
    for (const santaData of uniqueSantaResortCodeData){
        test(`Santa Resort Code(${santaData.ResortCode})`, async ({ page }) => {
        
            const response = await ApiContext['get'](`${baseUrl}/umbraco/delivery/api/v2/content?filter=product%3Asanta&filter=resortCode%3A${santaData.ResortCode}&skip=0&take=10&fields=properties%5B%24all%5D`);
        
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
            expect(content.contentType).toBe('resortLapland');

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
            expect(content.properties).toHaveProperty('resortCode');
            expect(content.properties.resortCode).toBe(santaData.ResortCode);
          });

    }

});


test.describe('P_CMS Ski Resort Test', () => {

    const uniqueSkiResortCodeData = Array.from(new Set(SkiDatacsv
        .map(data => data.ResortCode)
        .filter(resortCode => resortCode !== null && resortCode !== undefined  && resortCode.trim() !== '')))
        .map(uniqueResortCode => {
            return SkiDatacsv.find(data => data.ResortCode === uniqueResortCode);
        });



    for (const skiData of uniqueSkiResortCodeData){
        test(`Ski Resort Code(${skiData.ResortCode})`, async ({ page }) => {
        
            const response = await ApiContext['get'](`${baseUrl}/umbraco/delivery/api/v2/content?filter=product%3Aski&filter=resortCode%3A${skiData.ResortCode}&skip=0&take=10&fields=properties%5B%24all%5D`);
        
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
            expect(content.contentType).toBe('resortSki');

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
            expect(content.properties).toHaveProperty('resortCode');
            expect(content.properties.resortCode).toBe(skiData.ResortCode);
          });

    }

});


test.describe('P_CMS Walking Resort Test', () => {

    const uniqueWalkingResortCodeData = Array.from(new Set(WalkingDatacsv
        .map(data => data.ResortCode)
        .filter(resortCode => resortCode !== null && resortCode !== undefined  && resortCode.trim() !== '')))
        .map(uniqueResortCode => {
            return WalkingDatacsv.find(data => data.ResortCode === uniqueResortCode);
        });



    for (const walkingData of uniqueWalkingResortCodeData){
        test(`Walking Resort Code(${walkingData.ResortCode})`, async ({ page }) => {
        
            const response = await ApiContext['get'](`${baseUrl}/umbraco/delivery/api/v2/content?filter=product%3Awalking&filter=resortCode%3A${walkingData.ResortCode}&skip=0&take=10&fields=properties%5B%24all%5D`);
        
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
            expect(content.contentType).toBe('resortWalking');

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
            expect(content.properties).toHaveProperty('resortCode');
            expect(content.properties.resortCode).toBe(walkingData.ResortCode);
          });

    }

});

