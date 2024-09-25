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
const env = process.env.ENV || 'dev_test';
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

test.describe.configure({retries: 2, timeout: 60000,})

test.describe('Lapland Country Test', () => {

    const filteredData = LaplandDatacsv.filter(row => row['Alias'].includes('country'));

    for (const laplandData of filteredData){
        test(`Lapland (${laplandData.SourcePath})`, async ({ page }) => {
        
            const countryCode = await getLaplandCountry(LaplandCountries, laplandData);
            const configFilePath = path.join(__dirname, 'uat_data', laplandData.SourcePath, 'content.config');
            const configData = await readConfigFile(configFilePath);

            await ECMS.Lapland_Sourcepath_Checker(page, laplandData.SourcePath, HOMEpath, ERRORpath);

            if (countryCode !== undefined) {
                await PCMS.Check_LaplandCountryCode(ApiContext, baseUrl, countryCode);
            }

            
          });
    }

});


test.describe('Santa Country Test', () => {

    const filteredData = SantaDatacsv.filter(row => row['Alias'].includes('country'));

    for (const santaData of filteredData){
        test(`Santa (${santaData.SourcePath})`, async ({ page }) => {
        
            const countryCode = await getSantaCountry(SantaCountries, santaData);
            const configFilePath = path.join(__dirname, 'uat_data', santaData.SourcePath, 'content.config');
            const configData = await readConfigFile(configFilePath);

            await ECMS.Santa_Sourcepath_Checker(page, santaData.SourcePath, HOMEpath, ERRORpath);

            if (countryCode !== undefined) {
                await PCMS.Check_SantaCountryCode(ApiContext, baseUrl, countryCode);
            }


            
          });
    }

});


test.describe('Ski Country Test', () => {

    const filteredData = SkiDatacsv.filter(row => row['Alias'].includes('country'));

    for (const skiData of filteredData){
        test(`Ski (${skiData.SourcePath})`, async ({ page }) => {
        
            const countryCode = await getSkiCountry(SkiCountries, skiData);
            const configFilePath = path.join(__dirname, 'uat_data', skiData.SourcePath, 'content.config');
            const configData = await readConfigFile(configFilePath);

            await ECMS.Ski_Sourcepath_Checker(page, skiData.SourcePath, HOMEpath, ERRORpath);

            if (countryCode !== undefined) {
                await PCMS.Check_SkiCountryCode(ApiContext, baseUrl, countryCode);
            }

          });
    }    

});


test.describe('Walking Country Test', () => {

    const filteredData = WalkingDatacsv.filter(row => row['Alias'].includes('country'));

    for (const walkingData of filteredData){
        test(`Walking (${walkingData.SourcePath})`, async ({ page }) => {
        
            const countryCode = await getWalkingCountry(WalkingCountries, walkingData);
            const configFilePath = path.join(__dirname, 'uat_data', walkingData.SourcePath, 'content.config');
            const configData = await readConfigFile(configFilePath);

            await ECMS.Walking_Sourcepath_Checker(page, walkingData.SourcePath, HOMEpath, ERRORpath);

            if (countryCode !== undefined) {
                await PCMS.Check_WalkingCountryCode(ApiContext, baseUrl, countryCode);
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