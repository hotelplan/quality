import { test, expect } from '../../../resources/inw_resources/fixtures/page_fixtures';
import {parse} from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';
import environmentBaseUrl from '../../../resources/utils/environmentBaseUrl';
import { ECMS } from '../../../resources/inw_resources/fixtures/e_cmsUtilities';
import dotenv from 'dotenv';


dotenv.config();
const env = process.env.ENV || "qa";
const InghamsUrl = environmentBaseUrl[env].inghams;
const ECMSurl = environmentBaseUrl[env].e_cms;
const PCMSurl = environmentBaseUrl[env].p_cms;

// Helper function to read URLs from the CSV file
const SkiDatacsv = parse(fs.readFileSync(path.join(__dirname, 'migration_data', 'Migration_Ski.csv')), {columns: true, skip_empty_lines: true});
const SkiCountryData = SkiDatacsv.filter(row => row['Alias'].includes('country'));

//test.beforeAll(async ({page}) => {
    
//});

//test.beforeEach(async ({ page }) => {
    
//});
  
test.afterEach(async ({ page },testInfo) => {
  //await page.close();
});
  
/*test.afterAll(async ({ page }) => {
  
});*/


for(const SkiCountrydata of SkiCountryData){

  test.describe(`Ski Country Page (${SkiCountrydata.SourcePath})`, () => {
    test.describe.configure({mode: "serial"});

    test(`Header-Footer Test Ski Country Page (${SkiCountrydata.SourcePath})`, {tag: ['@regression'],}, async ({page, ecmsSignInpage, ecmsMainPage, countryPage}) => {
      test.setTimeout(180000);

      const target = SkiCountrydata.SourcePath.split('\\').pop()
      ?.split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
      console.log('Target:', target);

      await page.goto(ECMSurl+'/umbraco/login',{ waitUntil: 'domcontentloaded' });
      await ecmsSignInpage.ECMS_Login(process.env.ECMS_USERNAME,process.env.ECMS_PASSWORD);
      await ecmsMainPage.ECMS_Expand_Tree("Ski Holidays", null, target, null, null);
      await ecmsMainPage.ECMS_Select_Target_Page(target);

      await ecmsMainPage.ECMS_Add_Default_Program_Header_Footer("Ski");
      await ecmsMainPage.ECMS_Click_Save_And_Publish();

      const SiteURL = await ECMS.Ski_URL_Builder(ECMSurl, SkiCountrydata.SourcePath);

      await page.goto(SiteURL, { waitUntil: 'domcontentloaded' });
      await countryPage.Check_Ski_Country_Page_Header();  
      await countryPage.Check_Ski_Country_Page_Footer();
      /////////
      await page.goto(ECMSurl+'/umbraco/login',{ waitUntil: 'domcontentloaded' });
      await ecmsSignInpage.ECMS_Login(process.env.ECMS_USERNAME,process.env.ECMS_PASSWORD);
      await ecmsMainPage.ECMS_Expand_Tree("Ski Holidays", null, target, null, null);
      await ecmsMainPage.ECMS_Select_Target_Page(target);

      await ecmsMainPage.ECMS_Remove_Default_Program_Header_Footer();
      await ecmsMainPage.ECMS_Click_Save_And_Publish();

      await page.goto(SiteURL, { waitUntil: 'domcontentloaded' });
      await countryPage.Check_Ski_Country_Page_Header_Not_Visible();  
      await countryPage.Check_Ski_Country_Page_Footer_Not_Visible();

    });


    test(`Hero Banner Test Ski Country Page (${SkiCountrydata.SourcePath})`, {tag: ['@regression'],}, async ({page, ecmsSignInpage, ecmsMainPage, countryPage}) => {
      test.setTimeout(180000);

      const target = SkiCountrydata.SourcePath.split('\\').pop()
        ?.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      console.log('Target:', target);

      await page.goto(ECMSurl+'/umbraco/login',{ waitUntil: 'domcontentloaded' });
      await ecmsSignInpage.ECMS_Login(process.env.ECMS_USERNAME,process.env.ECMS_PASSWORD);
      await ecmsMainPage.ECMS_Expand_Tree("Ski Holidays", null, target, null, null);
      await ecmsMainPage.ECMS_Select_Target_Page(target);
      await ecmsMainPage.ECMS_Modify_Hero_Banner("291A0817");
      await ecmsMainPage.ECMS_Click_Save_And_Publish();

      const SiteURL = await ECMS.Ski_URL_Builder(ECMSurl, SkiCountrydata.SourcePath);
      // Open the URL
      await page.goto(SiteURL, { waitUntil: 'domcontentloaded' });
      await countryPage.Country_Hero_Banner_Checker("291A0817","Full Bleed","Top","Full");
        
    });

    
    test(`At a Glance Test Ski Country Page  (${SkiCountrydata.SourcePath})`, {tag: ['@regression'],}, async ({page, pcmsSignInpage, pcmsMainPage, countryPage}) => {
      test.setTimeout(180000);

      const target = SkiCountrydata.SourcePath.split('\\').pop()
        ?.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      console.log('Target:', target);

      await page.goto(PCMSurl+'/umbraco/login',{ waitUntil: 'domcontentloaded' });
      await pcmsSignInpage.PCMS_Login(process.env.PCMS_USERNAME,process.env.PCMS_PASSWORD);
      await pcmsMainPage.PCMS_Expand_Tree("Ski");
      await pcmsMainPage.PCMS_Select_Target_Page("Countries", target);
      const LocaleParams = await pcmsMainPage.PCMS_Modify_Country_Locale();
      await pcmsMainPage.PCMS_Click_Saved_And_Publish();

      const SiteURL = await ECMS.Ski_URL_Builder(ECMSurl, SkiCountrydata.SourcePath);
      // Open the URL
      await page.goto(SiteURL, { waitUntil: 'domcontentloaded' });
      await countryPage.Check_At_a_Glance(target, LocaleParams);
        
    });
    

    test(`Accordions Test Ski Country Page (${SkiCountrydata.SourcePath})`, {tag: ['@regression'],}, async ({page, ecmsSignInpage, ecmsMainPage, countryPage}) => {
      test.setTimeout(180000);

      const target = SkiCountrydata.SourcePath.split('\\').pop()
        ?.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      console.log('Target:', target);

      await page.goto(ECMSurl+'/umbraco/login',{ waitUntil: 'domcontentloaded' });
      await ecmsSignInpage.ECMS_Login(process.env.ECMS_USERNAME,process.env.ECMS_PASSWORD);
      await ecmsMainPage.ECMS_Expand_Tree("Ski Holidays", null, target, null, null);
      await ecmsMainPage.ECMS_Select_Target_Page(target);
      
      await ecmsMainPage.ECMS_Modify_Accordions();
      await ecmsMainPage.ECMS_Click_Save_And_Publish();

      const SiteURL = await ECMS.Ski_URL_Builder(ECMSurl, SkiCountrydata.SourcePath);
      // Open the URL
      await page.goto(SiteURL, { waitUntil: 'domcontentloaded' });
      await countryPage.Check_Accordions();
        
    });



    
  });











}

