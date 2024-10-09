import { APIRequestContext, test, expect } from '@playwright/test';
import {parse} from 'csv-parse/sync';
import { PCMS } from '../../resources/fixtures/p_cmsUtilities';
import { ECMS } from '../../resources/fixtures/e_cmsUtilities';
import { parseString } from 'xml2js';
import fs from 'fs';
import path from 'path';
import environmentBaseUrl from '../../resources/utils/environmentBaseUrl';
import tokenConfig from '../../resources/utils/tokenConfig';

let ApiContext: APIRequestContext;
const env = process.env.ENV || 'stg';
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

test.describe.configure({retries: 2, timeout: 30000,})

test.describe('Lapland Accommodation Test', () => {

    const filteredData = LaplandDatacsv.filter(row => row['Alias'].includes('accommodation'));

    for (const laplandData of filteredData){
        test(`Lapland (${laplandData.SourcePath.replace(/\\/g, '/')})`, async ({ page }) => {
        
            const configFilePath = path.join(__dirname, 'uat_data', laplandData.SourcePath.replace(/\\/g, '/'), 'content.config');
            const configData = await readConfigFile(configFilePath);

            const accommodation = laplandData.SourcePath.replace(/\\/g, '/').split('\\').pop()
                ?.split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            console.log('Accommodation:', accommodation);

            //await PCMS.Check_LaplandAccommodation(ApiContext, baseUrl, accommodation, configData);
            
          });
    }

});


test.describe('Santa Accommodation Test',  () => {

    const filteredData = SantaDatacsv.filter(row => row['Alias'].includes('accommodation'));

    for (const santaData of filteredData){
        test(`Santa (${santaData.SourcePath.replace(/\\/g, '/')})`, async ({ page }) => {
        
            const configFilePath = path.join(__dirname, 'uat_data', santaData.SourcePath.replace(/\\/g, '/'), 'content.config');
            const configData = await readConfigFile(configFilePath);

            if(santaData.ResortCode !== null && santaData.ResortCode !== undefined && santaData.ResortCode.trim() !== ''){
                await PCMS.Check_SantaResortCode(ApiContext, baseUrl, santaData.ResortCode, configData);
            }

            
          });
    }

});


test.describe('Ski Accommodation Test',  () => {

    const filteredData = SkiDatacsv.filter(row => row['Alias'].includes('accommodation'));

    for (const skiData of filteredData){
        test(`Ski (${skiData.SourcePath.replace(/\\/g, '/')})`, async ({ page }) => {
        
            const configFilePath = path.join(__dirname, 'uat_data', skiData.SourcePath.replace(/\\/g, '/'), 'content.config');
            const configData = await readConfigFile(configFilePath);


            if(skiData.ResortCode !== null && skiData.ResortCode !== undefined && skiData.ResortCode.trim() !== ''){
                await PCMS.Check_SkiResortCode(ApiContext, baseUrl, skiData.ResortCode, configData);
            }
          });
    }    

});


test.describe('Walking Accommodation Test', () => {

    const filteredData = WalkingDatacsv.filter(row => row['Alias'].includes('accommodation'));

    for (const walkingData of filteredData){
        test(`Walking (${walkingData.SourcePath.replace(/\\/g, '/')})`, async ({ page }) => {
        
            const configFilePath = path.join(__dirname, 'uat_data', walkingData.SourcePath.replace(/\\/g, '/'), 'content.config');
            const configData = await readConfigFile(configFilePath);

            if(walkingData.ResortCode !== null && walkingData.ResortCode !== undefined && walkingData.ResortCode.trim() !== ''){
                await PCMS.Check_WalkingResortCode(ApiContext, baseUrl, walkingData.ResortCode, configData);
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