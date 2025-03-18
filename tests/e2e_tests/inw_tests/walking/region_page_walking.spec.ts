import { test, expect } from '../../../resources/inw_resources/page_objects/base/page_base';
import {parse} from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';
import environmentBaseUrl from '../../../resources/utils/environmentBaseUrl';
import { ECMS } from '../../../resources/inw_resources/utilities/e_cmsUtilities';
import dotenv from 'dotenv';


dotenv.config();
const env = process.env.ENV || "qa";
const InghamsUrl = environmentBaseUrl[env].inghams;
const ECMSurl = environmentBaseUrl[env].e_cms;
const PCMSurl = environmentBaseUrl[env].p_cms;

// Helper function to read URLs from the CSV file
const WalkingDatacsv = parse(fs.readFileSync(path.join(__dirname, 'migration_data', 'Migration_Walking.csv')), {columns: true, skip_empty_lines: true});
const WalkingRegionData = WalkingDatacsv.filter(row => row['Alias'].includes('region'));

//test.beforeAll(async ({page}) => {
    
//});

//test.beforeEach(async ({ page }) => {
    
//});
  
test.afterEach(async ({ page },testInfo) => {
  //await page.close();
});
  
/*test.afterAll(async ({ page }) => {
  
});*/


for(const walkingRegiondata of WalkingRegionData){

  test.describe(`Walking Region Page (${walkingRegiondata.SourcePath})`, () => {
    test.describe.configure({mode: "serial"});

    const country = walkingRegiondata.Country.split('\\').pop()
    ?.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

    const target = walkingRegiondata.SourcePath.split('\\').pop()
    ?.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

    
    test(`Header-Footer Test Walking Region Page (${walkingRegiondata.SourcePath})`, {tag: ['@regression'],}, async ({page, ecmsSignInpage, ecmsMainPage, regionPage}) => {
      test.setTimeout(180000);

      console.log('Country:', country);
      console.log('Target:', target);

      await page.goto(ECMSurl+'/umbraco/login',{ waitUntil: 'domcontentloaded' });
      await ecmsSignInpage.ECMS_Login(process.env.ECMS_USERNAME,process.env.ECMS_PASSWORD);
      await ecmsMainPage.ECMS_Expand_Tree("Walking Holidays", null, country, target, null);
      await ecmsMainPage.ECMS_Select_Target_Page(target);

      await ecmsMainPage.ECMS_Add_Default_Program_Header_Footer("Walking");
      await ecmsMainPage.ECMS_Click_Save_And_Publish();

      const SiteURL = await ECMS.Walking_URL_Builder(ECMSurl, walkingRegiondata.SourcePath);

      await page.goto(SiteURL, { waitUntil: 'domcontentloaded' });
      await regionPage.Check_Walking_Region_Page_Header();  
      await regionPage.Check_Walking_Region_Page_Footer();
      /////////
      await page.goto(ECMSurl+'/umbraco/login',{ waitUntil: 'domcontentloaded' });
      await ecmsSignInpage.ECMS_Login(process.env.ECMS_USERNAME,process.env.ECMS_PASSWORD);
      await ecmsMainPage.ECMS_Expand_Tree("Walking Holidays", null, country, target, null);
      await ecmsMainPage.ECMS_Select_Target_Page(target);

      await ecmsMainPage.ECMS_Remove_Default_Program_Header_Footer();
      await ecmsMainPage.ECMS_Click_Save_And_Publish();

      await page.goto(SiteURL, { waitUntil: 'domcontentloaded' });
      await regionPage.Check_Walking_Region_Page_Header_Not_Visible();  
      await regionPage.Check_Walking_Region_Page_Footer_Not_Visible();

    });


    test(`Hero Banner Test Walking Region Page (${walkingRegiondata.SourcePath})`, {tag: ['@regression'],}, async ({page, ecmsSignInpage, ecmsMainPage, regionPage}) => {
      test.setTimeout(180000);

      await page.goto(ECMSurl+'/umbraco/login',{ waitUntil: 'domcontentloaded' });
      await ecmsSignInpage.ECMS_Login(process.env.ECMS_USERNAME,process.env.ECMS_PASSWORD);
      await ecmsMainPage.ECMS_Expand_Tree("Walking Holidays", null, country, target, null);
      await ecmsMainPage.ECMS_Select_Target_Page(target);
      await ecmsMainPage.ECMS_Modify_Hero_Banner("291A0817");
      await ecmsMainPage.ECMS_Click_Save_And_Publish();

      const SiteURL = await ECMS.Walking_URL_Builder(ECMSurl, walkingRegiondata.SourcePath);
      // Open the URL
      await page.goto(SiteURL, { waitUntil: 'domcontentloaded' });
      await regionPage.Region_Hero_Banner_Checker("291A0817","Full Bleed","Top","Full");
        
    });

    
    test(`At a Glance Test Walking Region Page  (${walkingRegiondata.SourcePath})`, {tag: ['@regression'],}, async ({page, pcmsSignInpage, pcmsMainPage, regionPage}) => {
      test.setTimeout(180000);

      await page.goto(PCMSurl+'/umbraco/login',{ waitUntil: 'domcontentloaded' });
      await pcmsSignInpage.PCMS_Login(process.env.PCMS_USERNAME,process.env.PCMS_PASSWORD);
      await pcmsMainPage.PCMS_Expand_Tree("Walking");
      await pcmsMainPage.PCMS_Select_Target_Page("Regions", target);
      const LocaleParams = await pcmsMainPage.PCMS_Modify_Country_Locale();
      await pcmsMainPage.PCMS_Click_Saved_And_Publish();

      const SiteURL = await ECMS.Walking_URL_Builder(ECMSurl, walkingRegiondata.SourcePath);
      // Open the URL
      await page.goto(SiteURL, { waitUntil: 'domcontentloaded' });
      await regionPage.Check_At_a_Glance(target, LocaleParams);
        
    });
    

    test(`Accordions Test Walking Region Page (${walkingRegiondata.SourcePath})`, {tag: ['@regression'],}, async ({page, ecmsSignInpage, ecmsMainPage, regionPage}) => {
      test.setTimeout(180000);

      await page.goto(ECMSurl+'/umbraco/login',{ waitUntil: 'domcontentloaded' });
      await ecmsSignInpage.ECMS_Login(process.env.ECMS_USERNAME,process.env.ECMS_PASSWORD);
      await ecmsMainPage.ECMS_Expand_Tree("Walking Holidays", null, country, target, null);
      await ecmsMainPage.ECMS_Select_Target_Page(target);
      
      await ecmsMainPage.ECMS_Modify_Accordions();
      await ecmsMainPage.ECMS_Click_Save_And_Publish();

      const SiteURL = await ECMS.Walking_URL_Builder(ECMSurl, walkingRegiondata.SourcePath);
      // Open the URL
      await page.goto(SiteURL, { waitUntil: 'domcontentloaded' });
      await regionPage.Check_Accordions();
        
    });



    
  });











}

