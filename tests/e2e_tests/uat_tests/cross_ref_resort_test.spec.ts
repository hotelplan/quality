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

test.describe.configure({retries: 2, timeout: 60000,})

test.describe('Lapland Resort Test', {tag: '@uat'}, () => {

    const filteredData = LaplandDatacsv.filter(row => row['Alias'].includes('resort'));

    for (const laplandData of filteredData){
        test(`Lapland (${laplandData.SourcePath.replace(/\\/g, '/')})`, async ({ page }) => {
        
            const configFilePath = path.join(__dirname, 'uat_data', laplandData.SourcePath.replace(/\\/g, '/'), 'content.config');
            const configData = await readConfigFile(configFilePath);

            console.log(configFilePath)
            //console.log(configData,);

            await ECMS.Lapland_Sourcepath_Checker(page, laplandData.SourcePath.replace(/\\/g, '/'), HOMEpath, ERRORpath);

            if(laplandData.ResortCode !== null && laplandData.ResortCode !== undefined && laplandData.ResortCode.trim() !== ''){
                await PCMS.Check_LaplandResortCode(ApiContext, baseUrl, laplandData.ResortCode, configData);
            }

          });
    }

});


test.describe('Santa Resort Test', {tag: '@uat'}, () => {

    const filteredData = SantaDatacsv.filter(row => row['Alias'].includes('resort'));

    for (const santaData of filteredData){
        test(`Santa (${santaData.SourcePath.replace(/\\/g, '/')})`, async ({ page }) => {
        
            const configFilePath = path.join(__dirname, 'uat_data', santaData.SourcePath.replace(/\\/g, '/'), 'content.config');
            const configData = await readConfigFile(configFilePath);

            await ECMS.Santa_Sourcepath_Checker(page, santaData.SourcePath.replace(/\\/g, '/'), HOMEpath, ERRORpath);

            if(santaData.ResortCode !== null && santaData.ResortCode !== undefined && santaData.ResortCode.trim() !== ''){
                await PCMS.Check_SantaResortCode(ApiContext, baseUrl, santaData.ResortCode, configData);
            }

            
          });
    }

});


test.describe('Ski Resort Test', {tag: '@uat'}, () => {

    const filteredData = SkiDatacsv.filter(row => row['Alias'].includes('resort'));

    for (const skiData of filteredData){
        test(`Ski (${skiData.SourcePath.replace(/\\/g, '/')})`, async ({ page }) => {
        
            const configFilePath = path.join(__dirname, 'uat_data', skiData.SourcePath.replace(/\\/g, '/'), 'content.config');
            const configData = await readConfigFile(configFilePath);

            await ECMS.Ski_Sourcepath_Checker(page, skiData.SourcePath.replace(/\\/g, '/'), HOMEpath, ERRORpath);

            if(skiData.ResortCode !== null && skiData.ResortCode !== undefined && skiData.ResortCode.trim() !== ''){
                await PCMS.Check_SkiResortCode(ApiContext, baseUrl, skiData.ResortCode, configData);
            }
          });
    }    

});


test.describe('Walking Resort Test', {tag: '@uat'}, () => {

    const filteredData = WalkingDatacsv.filter(row => row['Alias'].includes('resort'));

    for (const walkingData of filteredData){
        test(`Walking (${walkingData.SourcePath.replace(/\\/g, '/')})`, async ({ page }) => {
        
            const configFilePath = path.join(__dirname, 'uat_data', walkingData.SourcePath.replace(/\\/g, '/'), 'content.config');
            const configData = await readConfigFile(configFilePath);

            await ECMS.Walking_Sourcepath_Checker(page, walkingData.SourcePath.replace(/\\/g, '/'), HOMEpath, ERRORpath);

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
