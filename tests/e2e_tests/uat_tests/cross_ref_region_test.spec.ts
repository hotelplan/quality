import { APIRequestContext, test, expect } from '@playwright/test';
import {parse} from 'csv-parse/sync';
import { PCMS } from '../../resources/fixtures/p_cmsUtilities';
import { ECMS } from '../../resources/fixtures/e_cmsUtilities';
import fs from 'fs';
import path from 'path';
import { parseString } from 'xml2js';
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

test.describe('Lapland Region Test', () => {

    const filteredData = LaplandDatacsv.filter(row => row['Alias'].includes('region'));

    for (const laplandData of filteredData){
        test(`Lapland (${laplandData.SourcePath})`, async ({ page }) => {
        
            const countryCode = await getLaplandCountry(LaplandCountries, laplandData);
            const configFilePath = path.join(__dirname, 'uat_data', laplandData.SourcePath, 'content.config');
            const configData = await readConfigFile(configFilePath);

            await ECMS.Lapland_Sourcepath_Checker(page, laplandData.SourcePath, HOMEpath, ERRORpath);

            if (countryCode !== undefined) {
                await PCMS.Check_LaplandCountryCode(ApiContext, baseUrl, countryCode);
            }

            if(laplandData.RegionCode !== null && laplandData.RegionCode !== undefined && laplandData.RegionCode.trim() !== ''){
                await PCMS.Check_LaplandRegionCode(ApiContext, baseUrl, laplandData.RegionCode, configData);
            }

            if(laplandData.ResortCode !== null && laplandData.ResortCode !== undefined && laplandData.ResortCode.trim() !== ''){
                await PCMS.Check_LaplandResortCode(ApiContext, baseUrl, laplandData.ResortCode, configData);
            }

            
          });
    }

});


test.describe('Santa Region Test', () => {

    const filteredData = SantaDatacsv.filter(row => row['Alias'].includes('region'));

    for (const santaData of filteredData){
        test(`Santa (${santaData.SourcePath})`, async ({ page }) => {
        
            const countryCode = await getSantaCountry(SantaCountries, santaData);
            const configFilePath = path.join(__dirname, 'uat_data', santaData.SourcePath, 'content.config');
            const configData = await readConfigFile(configFilePath);

            await ECMS.Santa_Sourcepath_Checker(page, santaData.SourcePath, HOMEpath, ERRORpath);

            if (countryCode !== undefined) {
                await PCMS.Check_SantaCountryCode(ApiContext, baseUrl, countryCode);
            }

            if(santaData.RegionCode !== null && santaData.RegionCode !== undefined && santaData.RegionCode.trim() !== ''){
                await PCMS.Check_SantaRegionCode(ApiContext, baseUrl, santaData.RegionCode, configData);
            }

            if(santaData.ResortCode !== null && santaData.ResortCode !== undefined && santaData.ResortCode.trim() !== ''){
                await PCMS.Check_SantaResortCode(ApiContext, baseUrl, santaData.ResortCode, configData);
            }

            
          });
    }

});


test.describe('Ski Region Test', () => {

    const filteredData = SkiDatacsv.filter(row => row['Alias'].includes('region'));

    for (const skiData of filteredData){
        test(`Ski (${skiData.SourcePath})`, async ({ page }) => {
        
            const countryCode = await getSkiCountry(SkiCountries, skiData);
            const configFilePath = path.join(__dirname, 'uat_data', skiData.SourcePath, 'content.config');
            const configData = await readConfigFile(configFilePath);

            await ECMS.Ski_Sourcepath_Checker(page, skiData.SourcePath, HOMEpath, ERRORpath);

            if (countryCode !== undefined) {
                await PCMS.Check_SkiCountryCode(ApiContext, baseUrl, countryCode);
            }

            if(skiData.RegionCode !== null && skiData.RegionCode !== undefined && skiData.RegionCode.trim() !== ''){
                await PCMS.Check_SkiRegionCode(ApiContext, baseUrl, skiData.RegionCode, configData);
            }

            if(skiData.ResortCode !== null && skiData.ResortCode !== undefined && skiData.ResortCode.trim() !== ''){
                await PCMS.Check_SkiResortCode(ApiContext, baseUrl, skiData.ResortCode, configData);
            }
          });
    }    

});


test.describe('Walking Region Test', () => {

    const filteredData = WalkingDatacsv.filter(row => row['Alias'].includes('region'));

    for (const walkingData of filteredData){
        test(`Walking (${walkingData.SourcePath})`, async ({ page }) => {
        
            const countryCode = await getWalkingCountry(WalkingCountries, walkingData);
            const configFilePath = path.join(__dirname, 'uat_data', walkingData.SourcePath, 'content.config');
            const configData = await readConfigFile(configFilePath);

            await ECMS.Walking_Sourcepath_Checker(page, walkingData.SourcePath, HOMEpath, ERRORpath);

            if (countryCode !== undefined) {
                await PCMS.Check_WalkingCountryCode(ApiContext, baseUrl, countryCode);
            }

            if(walkingData.RegionCode !== null && walkingData.RegionCode !== undefined && walkingData.RegionCode.trim() !== ''){
                await PCMS.Check_WalkingRegionCode(ApiContext, baseUrl, walkingData.RegionCode, configData);
            }

            if(walkingData.ResortCode !== null && walkingData.ResortCode !== undefined && walkingData.ResortCode.trim() !== ''){
                await PCMS.Check_WalkingResortCode(ApiContext, baseUrl, walkingData.ResortCode, configData);
            }
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
            console.log(code);
            return code;
            break;
        }
    }
    return undefined; // Return undefined if no match is found
}


async function getSantaCountry(SantaCountries: any, santaData:any ) {

    for (const santaCountry of SantaCountries) {
        const countryName = santaCountry.Name;
        const lowerCaseCountryName = countryName.toLowerCase();
        const modifiedName = lowerCaseCountryName.replace(/\//g, '-');
        if (modifiedName === santaData.Country) {
            const code = santaCountry.Code;
            console.log(code);
            return code;
            break;
        }
    }
    return undefined; // Return undefined if no match is found
}


async function getSkiCountry(SkiCountries: any, skiData:any ) {

    for (const skiCountry of SkiCountries) {
        const countryName = skiCountry.Name;
        const lowerCaseCountryName = countryName.toLowerCase();
        const modifiedName = lowerCaseCountryName.replace(/\//g, '-');
        if (modifiedName === skiData.Country) {
            const code = skiCountry.Code;
            console.log(code);
            return code;
            break;
        }
    }
    return undefined; // Return undefined if no match is found
}


async function getWalkingCountry(WalkingCountries: any, walkingData:any ) {

    for (const walkingCountry of WalkingCountries) {
        const countryName = walkingCountry.Name;
        const lowerCaseCountryName = countryName.toLowerCase();
        const modifiedName = lowerCaseCountryName.replace(/\//g, '-');
        if (modifiedName === walkingData.Country) {
            const code = walkingCountry.Code;
            console.log(code);
            return code;
            break;
        }
    }
    return undefined; // Return undefined if no match is found
}

async function readConfigFile(configFilePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
        fs.readFile(configFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading the config file:', err);
                reject(err);
                return;
            }
            parseString(data, (parseErr, result) => {
                if (parseErr) {
                    console.error('Error parsing the config file:', parseErr);
                    reject(parseErr);
                    return;
                }
                //console.log('Config:', result);
                resolve(result);
            });
        });
    });
}