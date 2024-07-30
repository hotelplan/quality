import { APIRequestContext, test, expect } from '@playwright/test';
import environmentBaseUrl from '../../resources/utils/environmentBaseUrl';

let AdminApiContext: APIRequestContext;


test.beforeAll(async ({playwright,page}) => {
    const env = process.env.ENV || 'dev_test';
    const baseUrl = environmentBaseUrl[env].p_cms;
    const adminToken = tokenConfig[env].admin;

    AdminApiContext = await playwright.request.newContext({
        baseURL: baseUrl,
        extraHTTPHeaders: {
            Authorization: `Bearer ${adminToken}`,
            Accept: 'application/json',
        },
    });
});

test.beforeEach(async ({ page },testInfo) => {
    await page.goto('/',{ waitUntil: 'domcontentloaded' })
    await page.goto('/move-in',{ waitUntil: 'domcontentloaded' });
});
  
test.afterEach(async ({ page },testInfo) => {
    //await page.close();
  });