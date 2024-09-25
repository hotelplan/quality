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

test.describe('Lapland Region Test', () => {

    const filteredData = LaplandDatacsv.filter(row => row['Alias'].includes('region'));

    for (const laplandData of filteredData){
        test(`Lapland (${laplandData.SourcePath})`, async ({ page }) => {
        
            const configFilePath = path.join(__dirname, 'uat_data', laplandData.SourcePath, 'content.config');
            const configData = await readConfigFile(configFilePath);

            await ECMS.Lapland_Sourcepath_Checker(page, laplandData.SourcePath, HOMEpath, ERRORpath);

            if(laplandData.RegionCode !== null && laplandData.RegionCode !== undefined && laplandData.RegionCode.trim() !== ''){
                await PCMS.Check_LaplandRegionCode(ApiContext, baseUrl, laplandData.RegionCode, configData);
            }

            
          });
    }

});


test.describe('Santa Region Test', () => {

    const filteredData = SantaDatacsv.filter(row => row['Alias'].includes('region'));

    for (const santaData of filteredData){
        test(`Santa (${santaData.SourcePath})`, async ({ page }) => {
        
            const configFilePath = path.join(__dirname, 'uat_data', santaData.SourcePath, 'content.config');
            const configData = await readConfigFile(configFilePath);

            await ECMS.Santa_Sourcepath_Checker(page, santaData.SourcePath, HOMEpath, ERRORpath);

            if(santaData.RegionCode !== null && santaData.RegionCode !== undefined && santaData.RegionCode.trim() !== ''){
                await PCMS.Check_SantaRegionCode(ApiContext, baseUrl, santaData.RegionCode, configData);
            }

            
          });
    }

});


test.describe('Ski Region Test', () => {

    const filteredData = SkiDatacsv.filter(row => row['Alias'].includes('region'));

    for (const skiData of filteredData){
        test(`Ski (${skiData.SourcePath})`, async ({ page }) => {
        
            const configFilePath = path.join(__dirname, 'uat_data', skiData.SourcePath, 'content.config');
            const configData = await readConfigFile(configFilePath);

            await ECMS.Ski_Sourcepath_Checker(page, skiData.SourcePath, HOMEpath, ERRORpath);


            if(skiData.RegionCode !== null && skiData.RegionCode !== undefined && skiData.RegionCode.trim() !== ''){
                await PCMS.Check_SkiRegionCode(ApiContext, baseUrl, skiData.RegionCode, configData);
            }
          });
    }    

});


test.describe('Walking Region Test', () => {

    const filteredData = WalkingDatacsv.filter(row => row['Alias'].includes('region'));

    for (const walkingData of filteredData){
        test(`Walking (${walkingData.SourcePath})`, async ({ page }) => {
        
            const configFilePath = path.join(__dirname, 'uat_data', walkingData.SourcePath, 'content.config');
            const configData = await readConfigFile(configFilePath);

            await ECMS.Walking_Sourcepath_Checker(page, walkingData.SourcePath, HOMEpath, ERRORpath);


            if(walkingData.RegionCode !== null && walkingData.RegionCode !== undefined && walkingData.RegionCode.trim() !== ''){
                await PCMS.Check_WalkingRegionCode(ApiContext, baseUrl, walkingData.RegionCode, configData);
            }
          });
    }    


});


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