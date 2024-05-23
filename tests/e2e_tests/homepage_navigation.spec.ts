import { test,expect,type Page } from '@playwright/test';
import { HomePage }  from '.././resources/page_objects/homapage';


let homePage: HomePage;


/*test.beforeAll(async ({playwright,page}) => {

});*/

test.beforeEach(async ({ page },testInfo) => {
  await page.goto('url');
  homePage = new HomePage(page);
});

test.afterEach(async ({ page },testInfo) => {

});

/*test.afterAll(async ({ page }) => {

});*/


test.describe('Homepage Navigation', () => {
  
  test('Go to ', async (page) => {

  });
  


});

