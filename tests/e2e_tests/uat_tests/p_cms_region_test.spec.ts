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
            const configFilePath = path.join(__dirname, 'uat_data', skiData.SourcePath, 'content.config');
            const configData = await readConfigFile(configFilePath);

            if(skiData.RegionCode !== null && skiData.RegionCode !== undefined && skiData.RegionCode.trim() !== ''){
                await PCMS.Check_SkiRegionCode(ApiContext, baseUrl, skiData.RegionCode, configData);
            }
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
            const configFilePath = path.join(__dirname, 'uat_data', walkingData.SourcePath, 'content.config');
            const configData = await readConfigFile(configFilePath);

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

