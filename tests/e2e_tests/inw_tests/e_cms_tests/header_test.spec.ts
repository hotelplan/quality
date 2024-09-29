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


test.describe('Lapland Header Content Test', () => {
  
  test('Header Country Page Test', async ({page, ecmsSignInpage}) => {
    await page.goto(ECMSurl+'/umbraco/login',{ waitUntil: 'domcontentloaded' });
    await ecmsSignInpage.ECMS_Login("chris.hobden@hotelplan.co.uk","Welcome123");

  });





});

