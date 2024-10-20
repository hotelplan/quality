import { test, expect } from '../../../resources/fixtures/page_fixtures';
import {parse} from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';
import environmentBaseUrl from '../../../resources/utils/environmentBaseUrl';
import { ECMS } from '../../../resources/fixtures/e_cmsUtilities';

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
    test(`Hero Banner Country Page Test (${laplandCountrydata.SourcePath})`, {tag: ['@regression'],}, async ({page, ecmsSignInpage, ecmsMainPage, countryPage}) => {
      test.slow();

      const username = process.env.ECMS_USERNAME;
      const password = process.env.ECMS_PASSWORD;
      const environment = process.env.ENVIRONMENT;
      console.log('Username:', username);
      console.log('Password:', password);
      console.log('Environment:', environment);

      const target = laplandCountrydata.SourcePath.split('\\').pop()
        ?.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      console.log('Target:', target);

      await page.goto(ECMSurl+'/umbraco/login',{ waitUntil: 'domcontentloaded' });
      await ecmsSignInpage.ECMS_Login(username,password);
      await ecmsMainPage.ECMS_Expand_Tree("Lapland Holidays", null, target, null, null);
      await ecmsMainPage.ECMS_Select_Target_Page(target);
      await ecmsMainPage.ECMS_Modify_Hero_Banner("291A0817");

      const SiteURL = await ECMS.Lapland_URL_Builder(ECMSurl, laplandCountrydata.SourcePath);
      // Open the URL
      await page.goto(SiteURL, { waitUntil: 'domcontentloaded' });
      await countryPage.Country_Hero_Banner_Checker("291A0817","Full Bleed","Top","Full");
      
    });
  }

});



test.describe('Ski Hero Banner Content Test', () => {

  const SkiCountryData = SkiDatacsv.filter(row => row['Alias'].includes('country'));
  const SkiRegionData = SkiDatacsv.filter(row => row['Alias'].includes('region'));
  const SkiResortData = SkiDatacsv.filter(row => row['Alias'].includes('resort'));
  const SkiAccomodationData = SkiDatacsv.filter(row => row['Alias'].includes('accommodation'));
  
  test.describe('Ski Country Page', () => {

    for(const skiCountrydata of SkiCountryData){
      test(`Hero Banner Country Page Test (${skiCountrydata.SourcePath})`, {tag: ['@smoke', '@regression'],}, async ({page, ecmsSignInpage, ecmsMainPage, countryPage}) => {
        test.slow();

        const target = skiCountrydata.SourcePath.split('\\').pop()
          ?.split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        console.log('Target:', target);

        await page.goto(ECMSurl+'/umbraco/login',{ waitUntil: 'domcontentloaded' });
        await ecmsSignInpage.ECMS_Login("christian.ticar@hotelplan.co.uk","[&3}xmN)V)");
        await ecmsMainPage.ECMS_Expand_Tree("Ski Holidays", null, target, null, null);
        await ecmsMainPage.ECMS_Select_Target_Page(target);
        await ecmsMainPage.ECMS_Modify_Hero_Banner("291A0817");

        const SiteURL = await ECMS.Ski_URL_Builder(ECMSurl, skiCountrydata.SourcePath);
        // Open the URL
        await page.goto(SiteURL, { waitUntil: 'domcontentloaded' });
        await countryPage.Country_Hero_Banner_Checker("291A0817","Full Bleed","Top","Full");
        
      });
    }

  });


  test.describe('Ski Region Page', () => {
    for(const skiRegiondata of SkiRegionData){
      test(`Hero Banner Region Page Test (${skiRegiondata.SourcePath})`, {tag: ['@regression'],}, async ({page, ecmsSignInpage, ecmsMainPage, regionPage}) => {
        test.slow();

        console.log('Region:', skiRegiondata.Region);
        const target = skiRegiondata.Region.split('-')
        .map(part => part.split(' ')
            .map(word => {
                if (word.includes('’')) {
                    const parts = word.split('’');
                    return parts[0].charAt(0).toLowerCase() + '’' + parts[1].charAt(0).toUpperCase() + parts[1].slice(1).toLowerCase();
                } else {
                    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                }
            })
            .join(' ')
        )
        .join('-');
        console.log('Target:', target);

        const country = skiRegiondata.Country.split('\\').pop()
        ?.split('-')
        .map(word => word.split(' ')
            .map(subWord => subWord.charAt(0).toUpperCase() + subWord.slice(1).toLowerCase())
            .join(' ')
        )
        .join('-');
        console.log('Country:', country);

        await page.goto(ECMSurl+'/umbraco/login',{ waitUntil: 'domcontentloaded' });
        await ecmsSignInpage.ECMS_Login("christian.ticar@hotelplan.co.uk","[&3}xmN)V)");
        await ecmsMainPage.ECMS_Expand_Tree("Ski Holidays", null, country, target, null);
        await ecmsMainPage.ECMS_Select_Target_Page(target);
        await ecmsMainPage.ECMS_Modify_Hero_Banner("291A0817");

        const SiteURL = await ECMS.Ski_URL_Builder(ECMSurl, skiRegiondata.SourcePath);
        // Open the URL
        await page.goto(SiteURL, { waitUntil: 'domcontentloaded' });
        await regionPage.Region_Hero_Banner_Checker("291A0817","Full Bleed","Top","Full");
        
      });
    }

  });

});


test.describe('Walking Hero Banner Content Test', () => {

  const WalkingCountryData = WalkingDatacsv.filter(row => row['Alias'].includes('country'));
  const WalkingRegionData = WalkingDatacsv.filter(row => row['Alias'].includes('region'));
  const WalkingResortData = WalkingDatacsv.filter(row => row['Alias'].includes('resort'));
  const WalkingAccomodationData = WalkingDatacsv.filter(row => row['Alias'].includes('accommodation'));
  
  test.describe('Walking Country Page', () => {

    for(const walkingCountrydata of WalkingCountryData){
      test(`Hero Banner Country Page Test (${walkingCountrydata.SourcePath})`, {tag: ['@regression'],}, async ({page, ecmsSignInpage, ecmsMainPage, countryPage}) => {
        test.slow();

        const target = walkingCountrydata.SourcePath.split('\\').pop()
          ?.split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        console.log('Target:', target);

        await page.goto(ECMSurl+'/umbraco/login',{ waitUntil: 'domcontentloaded' });
        await ecmsSignInpage.ECMS_Login("christian.ticar@hotelplan.co.uk","[&3}xmN)V)");
        await ecmsMainPage.ECMS_Expand_Tree("Walking Holidays", null, target, null, null);
        await ecmsMainPage.ECMS_Select_Target_Page(target);
        await ecmsMainPage.ECMS_Modify_Hero_Banner("291A0817");

        const SiteURL = await ECMS.Walking_URL_Builder(ECMSurl, walkingCountrydata.SourcePath);
        // Open the URL
        await page.goto(SiteURL, { waitUntil: 'domcontentloaded' });
        await countryPage.Country_Hero_Banner_Checker("291A0817","Full Bleed","Top","Full");
        
      });
    }

  });


  test.describe('Walking Region Page', () => {
    for(const walkingRegiondata of WalkingRegionData){
      test(`Hero Banner Region Page Test (${walkingRegiondata.SourcePath})`, {tag: ['@smoke', '@regression'],}, async ({page, ecmsSignInpage, ecmsMainPage, regionPage}) => {
        test.slow();

        console.log('Region:', walkingRegiondata.Region);
        const target = walkingRegiondata.Region.split('-')
        .map(part => part.split(' ')
            .map(word => {
                if (word.includes('’')) {
                    const parts = word.split('’');
                    return parts[0].charAt(0).toLowerCase() + '’' + parts[1].charAt(0).toUpperCase() + parts[1].slice(1).toLowerCase();
                } else {
                    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                }
            })
            .join(' ')
        )
        .join('-');
        console.log('Target:', target);

        const country = walkingRegiondata.Country.split('\\').pop()
        ?.split('-')
        .map(word => word.split(' ')
            .map(subWord => subWord.charAt(0).toUpperCase() + subWord.slice(1).toLowerCase())
            .join(' ')
        )
        .join('-');
        console.log('Country:', country);

        await page.goto(ECMSurl+'/umbraco/login',{ waitUntil: 'domcontentloaded' });
        await ecmsSignInpage.ECMS_Login("christian.ticar@hotelplan.co.uk","[&3}xmN)V)");
        await ecmsMainPage.ECMS_Expand_Tree("Walking Holidays", null, country, target, null);
        await ecmsMainPage.ECMS_Select_Target_Page(target);
        await ecmsMainPage.ECMS_Modify_Hero_Banner("291A0817");

        const SiteURL = await ECMS.Walking_URL_Builder(ECMSurl, walkingRegiondata.SourcePath);
        // Open the URL
        await page.goto(SiteURL, { waitUntil: 'domcontentloaded' });
        await regionPage.Region_Hero_Banner_Checker("291A0817","Full Bleed","Top","Full");
        
      });
    }

  });

});

