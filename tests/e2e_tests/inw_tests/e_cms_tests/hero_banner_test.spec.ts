import { test, expect } from '../../../resources/fixtures/page_fixtures';
import environmentBaseUrl from '../../../resources/utils/environmentBaseUrl';

const env = process.env.ENV || 'qa';
const InghamsUrl = environmentBaseUrl[env].inghams;
const ECMSurl = environmentBaseUrl[env].e_cms;
const PCMSurl = environmentBaseUrl[env].p_cms;



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
  
  test('Hero Banner Country Page Test', async ({page, ecmsSignInpage, ecmsMainPage}) => {
    await page.goto(ECMSurl+'/umbraco/login',{ waitUntil: 'domcontentloaded' });
    await ecmsSignInpage.ECMS_Login("chris.hobden@hotelplan.co.uk","Welcome123");
    await ecmsMainPage.ECMS_Expand_Tree("Lapland Holidays", null, "LaplandFinland", null, null, null);
    await ecmsMainPage.ECMS_Select_Target_Page("LaplandFinland");
    await ecmsMainPage.ECMS_Modify_Hero_Banner("291A0817");

    //https://inghamsv2-ecms.qa.hotelplan.co.uk/lapland-holidays/resorts/laplandfinland
    

  });





});

