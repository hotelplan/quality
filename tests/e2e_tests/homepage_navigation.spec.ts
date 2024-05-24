import { test,expect,type Page } from '@playwright/test';
import { HomePage }  from '.././resources/page_objects/homapage';


let homePage: HomePage;


/*test.beforeAll(async ({playwright,page}) => {

});*/

test.beforeEach(async ({ page },testInfo) => {
  await page.goto('https://inghams-v2.newdev.hotelplan.co.uk/',{ waitUntil: 'domcontentloaded' });
  homePage = new HomePage(page);
});

test.afterEach(async ({ page },testInfo) => {

});

/*test.afterAll(async ({ page }) => {

});*/


test.describe('Homepage Navigation', () => {

    test('Go to Our History', async ({page}) => {
        await homePage.click_Our_History;
        await homePage.check_Our_History;
    });


    test('Search', async ({page}) =>{
        await homePage.Search('resort');
    });
  
});

