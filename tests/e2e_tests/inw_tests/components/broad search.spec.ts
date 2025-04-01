import { test } from '../../../resources/inw_resources/page_objects/base/page_base';
import environmentBaseUrl from '../../../resources/utils/environmentBaseUrl';

const env = process.env.ENV || "qa";
const ECMSurl = environmentBaseUrl[env].e_cms;

const products = ['Ski', 'Walking', 'Lapland'];

test.beforeEach(async ({ page }) => {
    await test.step('Given: I navigate to home page', async () => {
        await page.goto(ECMSurl + '/');
    });
});

test.describe('Broad Search', async () => {
    for (const product of products) {
        test(`The broad search proceeds with default values for ${product} holidays @inw`, async ({ searchResultPage}) => {
            test.setTimeout(120000);
            await test.step(`Given: I sleect a product to search`, async () => {
                await searchResultPage.clickSearchProductTab(product);
            });
            
            await test.step(`And: I search for holidays`, async () => {
                await searchResultPage.clickSearchHolidayBtn();
            });

            await test.step('And: I navigate to Search results page', async () => {
                await searchResultPage.validateSearchResultPageUrl();
            });

            await test.step('And: I check the Search results criteria', async () => {
                await searchResultPage.checkCriteriaBarContent('Any date (7 nights)');
                await searchResultPage.checkCriteriaBarContent('2 adults');
                await searchResultPage.checkCriteriaBarContent('From Any departure location');
            });

            await test.step('When: I check Accomodation cards search results', async () => {
                await searchResultPage.countAccommodationCards();
            });

            await test.step('Then: search criteria matches the accomodation page', async () => {
                await searchResultPage.checkAccomodationPageCriteriaBar('Any date (7 nights)');
                await searchResultPage.checkAccomodationPageCriteriaBar('2 adults');
                await searchResultPage.checkAccomodationPageCriteriaBar('From Any departure location');
            });
        });

        test(`The broad search proceeds with duration only for ${product} holidays @inw`, async ({ searchResultPage }) => {
            await test.step(`Given: I sleect a product to search`, async () => {
                await searchResultPage.clickSearchProductTab(product);
            });

            await test.step(`And: I set guests to 0`, async () => {
                await searchResultPage.setNumberOfGuests(0);
            });

            await test.step(`And: I search for holidays`, async () => {
                await searchResultPage.clickSearchHolidayBtn();
            });

            await test.step('And: I navigate to Search results page', async () => {
                await searchResultPage.validateSearchResultPageUrl();
            });

            await test.step('And: I check the Search results criteria', async () => {
                await searchResultPage.checkCriteriaBarContent('Any date (7 nights)');
                await searchResultPage.checkCriteriaBarContent('Any Guest');
                await searchResultPage.checkCriteriaBarContent('From Any departure location');
            });

            await test.step('When: I check Accomodation cards search results', async () => {
                await searchResultPage.countAccommodationCards();
            });

            await test.step('Then: search criteria matches the accomodation page', async () => {
                await searchResultPage.checkAccomodationPageCriteriaBar('Any date (7 nights)');
                await searchResultPage.checkAccomodationPageCriteriaBar('Any Guest');
                await searchResultPage.checkAccomodationPageCriteriaBar('From Any departure location');
            });
        });
    }
});