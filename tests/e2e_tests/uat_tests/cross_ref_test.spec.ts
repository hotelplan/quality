import { APIRequestContext, test, expect } from '@playwright/test';
import {parse} from 'csv-parse/sync';
import { PCMS } from '../../resources/fixtures/p_cmsUtilities';
import { ECMS } from '../../resources/fixtures/e_cmsUtilities';
import fs from 'fs';
import path from 'path';
import environmentBaseUrl from '../../resources/utils/environmentBaseUrl';
import tokenConfig from '../../resources/utils/tokenConfig';

let ApiContext: APIRequestContext;
const env = process.env.ENV || 'qa';
const baseUrl = environmentBaseUrl[env].p_cms;
const adminToken = tokenConfig[env].p_cms;
const HOMEpath = environmentBaseUrl[env].e_cms;
const ERRORpath = `${HOMEpath}/error-500`;

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

test.describe('Lapland Test', () => {

    for (const laplandData of LaplandDatacsv){
        test(`Lapland (${laplandData.SourcePath})`, async ({ page }) => {
        
            const countryCode = await getLaplandCountry(LaplandCountries, laplandData);

            await ECMS.Lapland_Sourcepath_Checker(page, laplandData.SourcePath, HOMEpath, ERRORpath);

            if (countryCode !== undefined) {
                await PCMS.Check_LaplandCountryCode(ApiContext, baseUrl, countryCode);
            }

            if(laplandData.RegionCode !== null && laplandData.RegionCode !== undefined && laplandData.RegionCode.trim() !== ''){
                await PCMS.Check_LaplandRegionCode(ApiContext, baseUrl, laplandData.RegionCode);
            }

            if(laplandData.ResortCode !== null && laplandData.ResortCode !== undefined && laplandData.ResortCode.trim() !== ''){
                await PCMS.Check_LaplandResortCode(ApiContext, baseUrl, laplandData.ResortCode);
            }

            
          });

    }

});


test.describe('P_CMS Santa Test', () => {
    const uniqueSantaCountryCodeData = Array.from(new Set(SantaCountries
        .map(data => data.Code)))
        .map(uniqueCountryCode => {
            return SantaCountries.find(data => data.Code === uniqueCountryCode);
        });

    const uniqueSantaResortCodeData = Array.from(new Set(SantaDatacsv
        .map(data => data.ResortCode)
        .filter(resortCode => resortCode !== null && resortCode !== undefined  && resortCode.trim() !== '')))
        .map(uniqueResortCode => {
            return SantaDatacsv.find(data => data.ResortCode === uniqueResortCode);
        });

    for (const santaData of uniqueSantaCountryCodeData){
        test(`Santa Country Code(${santaData.Code})`, async ({ page }) => {
            
            const response = await ApiContext['get'](`${baseUrl}/umbraco/delivery/api/v2/content?filter=product%3Asanta&filter=countryCode%3A${santaData.Code}&skip=0&take=10&fields=properties%5B%24all%5D`);
            
            const responseBody = await response.json();
            
            console.log(await response.status()); // Log the status for debugging
            console.log(responseBody); // Log the response body for debugging
            
            expect(response.status()).toBe(200);

            // Check the response body structure and content
            expect(responseBody).toHaveProperty('items');
            expect(Array.isArray(responseBody.items)).toBe(true);
            expect(responseBody.items.length).toEqual(1);

            // Check the first item in the response body
            const Code = santaData.Code;
            const ModifiedCode = Code.toString();
            const content = responseBody.items[0];

            expect(content).toHaveProperty('contentType');
            expect(content.contentType).toBe('countryLapland');

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
            expect(content.properties).toHaveProperty('countryCode');
            expect(content.properties.countryCode).toBe(santaData.Code);
            });
    
    }
    

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


test.describe('P_CMS Ski Test', () => {
    const uniqueSkiCountryCodeData = Array.from(new Set(SkiCountries
        .map(data => data.Code)))
        .map(uniqueCountryCode => {
            return SkiCountries.find(data => data.Code === uniqueCountryCode);
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
        test(`Ski Country Code(${skiData.Code})`, async ({ page }) => {
        
            const response = await ApiContext['get'](`${baseUrl}/umbraco/delivery/api/v2/content?filter=product%3Aski&filter=countryCode%3A${skiData.Code}&skip=0&take=10&fields=properties%5B%24all%5D`);
        
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
            expect(content.contentType).toBe('countrySki');

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
            expect(content.properties).toHaveProperty('countryCode');
            expect(content.properties.countryCode).toBe(skiData.Code);
          });

    }


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


test.describe('P_CMS Walking Test', () => {
    const uniqueWalkingCountryCodeData = Array.from(new Set(WalkingCountries
        .map(data => data.Code)))
        .map(uniqueCountryCode => {
            return WalkingCountries.find(data => data.Code === uniqueCountryCode);
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
        test(`Walking Country Code(${walkingData.Code})`, async ({ page }) => {
        
            const response = await ApiContext['get'](`${baseUrl}/umbraco/delivery/api/v2/content?filter=product%3Awalking&filter=countryCode%3A${walkingData.Code}&skip=0&take=10&fields=properties%5B%24all%5D`);
        
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
            expect(content.contentType).toBe('countryWalking');

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
            expect(content.properties).toHaveProperty('countryCode');
            expect(content.properties.countryCode).toBe(walkingData.Code);
          });

    }


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



async function getLaplandCountry(LaplandCountries: any, laplandData:any ) {

    for (const laplandCountry of LaplandCountries) {
        const countryName = laplandCountry.Name;
        const lowerCaseCountryName = countryName.toLowerCase();
        const modifiedName = lowerCaseCountryName.replace(/\//g, '-');
        if (modifiedName === laplandData.Country) {
            const code = laplandCountry.Code;
            return code;
            break;
        }
    }
    return undefined; // Return undefined if no match is found
}
