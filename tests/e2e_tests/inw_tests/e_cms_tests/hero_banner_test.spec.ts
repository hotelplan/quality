import { test, expect } from '../../../resources/fixtures/page_fixtures';
import {parse} from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';
import environmentBaseUrl from '../../../resources/utils/environmentBaseUrl';

const env = process.env.ENV || 'qa';
const InghamsUrl = environmentBaseUrl[env].inghams;
const ECMSurl = environmentBaseUrl[env].e_cms;
const PCMSurl = environmentBaseUrl[env].p_cms;

// Helper function to read URLs from the CSV file
const LaplandDatacsv = parse(fs.readFileSync(path.join(__dirname, 'migration_data', 'Migration_Lapland.csv')), {columns: true, skip_empty_lines: true});
const SantaDatacsv = parse(fs.readFileSync(path.join(__dirname, 'migration_data', 'Migration_SantasBreaks.csv')), {columns: true, skip_empty_lines: true});
const SkiDatacsv = parse(fs.readFileSync(path.join(__dirname, 'migration_data', 'Migration_Ski.csv')), {columns: true, skip_empty_lines: true});
const WalkingDatacsv = parse(fs.readFileSync(path.join(__dirname, 'migration_data', 'Migration_Walking.csv')), {columns: true, skip_empty_lines: true});

//test.beforeAll(async ({page}) => {
    
//});

//test.beforeEach(async ({ page }) => {
    
//});
  
test.afterEach(async ({ page },testInfo) => {
  //await page.close();
});
  
/*test.afterAll(async ({ page }) => {
  
});*/


test.describe('Lapland Hero Banner Content Test', () => {

  const LaplandCountryData = LaplandDatacsv.filter(row => row['Alias'].includes('country'));
  const LaplandRegionData = LaplandDatacsv.filter(row => row['Alias'].includes('region'));
  const LaplandResortData = LaplandDatacsv.filter(row => row['Alias'].includes('resort'));
  const LaplandAccomodationData = LaplandDatacsv.filter(row => row['Alias'].includes('accommodation'));
  

  for(const laplandCountrydata of LaplandCountryData){
    test(`Hero Banner Country Page Test (${laplandCountrydata.SourcePath})`, async ({page, ecmsSignInpage, ecmsMainPage}) => {

      const target = laplandCountrydata.SourcePath.split('\\').pop()
        ?.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      console.log('Target:', target);

      await page.goto(ECMSurl+'/umbraco/login',{ waitUntil: 'domcontentloaded' });
      await ecmsSignInpage.ECMS_Login("chris.hobden@hotelplan.co.uk","Welcome123");
      await ecmsMainPage.ECMS_Expand_Tree("Lapland Holidays", null, target, null, null);
      await ecmsMainPage.ECMS_Select_Target_Page(target);
      await ecmsMainPage.ECMS_Modify_Hero_Banner("291A0817");

      //await expect(page.locator('//div[contains(@class,"c-hero is-active")]')).toBeVisible({timeout: 30000});

      //https://inghamsv2-ecms.qa.hotelplan.co.uk/lapland-holidays/resorts/laplandfinland
      ////div[contains(@class,"c-hero is-active")]
      

    });
  }




});

