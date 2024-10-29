import { APIRequestContext, test, expect } from '@playwright/test';
import {parse} from 'csv-parse/sync';
import { PCMS } from '../../resources/fixtures/p_cmsUtilities';
import fs from 'fs';
import path from 'path';
import { parseString } from 'xml2js';
import environmentBaseUrl from '../../resources/utils/environmentBaseUrl';
import tokenConfig from '../../resources/utils/tokenConfig';
import { describe } from 'node:test';

let ApiContext: APIRequestContext;
const env = process.env.ENV || 'stg';
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

test.describe.configure({retries: 2, timeout: 30000,})

test.describe('P_CMS Lapland Resort Test', {tag: '@migration'}, () => {

    const uniqueLaplandResortCodeData = Array.from(new Set(LaplandDatacsv
        .map(data => data.ResortCode)
        .filter(resortCode => resortCode !== null && resortCode !== undefined  && resortCode.trim() !== '')))
        .map(uniqueResortCode => {
            return LaplandDatacsv.find(data => data.ResortCode === uniqueResortCode);
        });


    for (const laplandData of uniqueLaplandResortCodeData){
        test(`Lapland Resort Code(${laplandData.ResortCode})`, async ({ page }) => {

            const configFilePath = path.join(__dirname, 'uat_data', laplandData.SourcePath.replace(/\\/g, '/'), 'content.config');
            const configData = await readConfigFile(configFilePath);
            
            if(laplandData.ResortCode !== null && laplandData.ResortCode !== undefined && laplandData.ResortCode.trim() !== ''){
                await PCMS.Check_LaplandResortCode(ApiContext, baseUrl, laplandData.ResortCode, configData);
            }
          
        });

    }

});


test.describe('P_CMS Santa Resort Test', {tag: '@migration'}, () => {

    const uniqueSantaResortCodeData = Array.from(new Set(SantaDatacsv
        .map(data => data.ResortCode)
        .filter(resortCode => resortCode !== null && resortCode !== undefined  && resortCode.trim() !== '')))
        .map(uniqueResortCode => {
            return SantaDatacsv.find(data => data.ResortCode === uniqueResortCode);
        });

 
    
    for (const santaData of uniqueSantaResortCodeData){
        test(`Santa Resort Code(${santaData.ResortCode})`, async ({ page }) => {
        
            const configFilePath = path.join(__dirname, 'uat_data', santaData.SourcePath.replace(/\\/g, '/'), 'content.config');
            const configData = await readConfigFile(configFilePath);

            if(santaData.ResortCode !== null && santaData.ResortCode !== undefined && santaData.ResortCode.trim() !== ''){
                await PCMS.Check_SantaResortCode(ApiContext, baseUrl, santaData.ResortCode, configData);
            }
          });

    }

});


test.describe('P_CMS Ski Resort Test', {tag: '@migration'}, () => {

    const uniqueSkiResortCodeData = Array.from(new Set(SkiDatacsv
        .map(data => data.ResortCode)
        .filter(resortCode => resortCode !== null && resortCode !== undefined  && resortCode.trim() !== '')))
        .map(uniqueResortCode => {
            return SkiDatacsv.find(data => data.ResortCode === uniqueResortCode);
        });



    for (const skiData of uniqueSkiResortCodeData){
        test(`Ski Resort Code(${skiData.ResortCode})`, async ({ page }) => {
            const configFilePath = path.join(__dirname, 'uat_data', skiData.SourcePath.replace(/\\/g, '/'), 'content.config');
            const configData = await readConfigFile(configFilePath);

            if(skiData.ResortCode !== null && skiData.ResortCode !== undefined && skiData.ResortCode.trim() !== ''){
                await PCMS.Check_SkiResortCode(ApiContext, baseUrl, skiData.ResortCode, configData);
            }
          });

    }

});


test.describe('P_CMS Walking Resort Test', {tag: ['@migration'],}, () => {

    const uniqueWalkingResortCodeData = Array.from(new Set(WalkingDatacsv
        .map(data => data.ResortCode)
        .filter(resortCode => resortCode !== null && resortCode !== undefined  && resortCode.trim() !== '')))
        .map(uniqueResortCode => {
            return WalkingDatacsv.find(data => data.ResortCode === uniqueResortCode);
        });



    for (const walkingData of uniqueWalkingResortCodeData){
        test(`Walking Resort Code(${walkingData.ResortCode})`, async ({ page }) => {
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

