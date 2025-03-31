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
        test(`The broad search proceeds with default values for ${product} holidays @inw`, async ({ searchResultPage }) => {
            await test.step(`Given: I search for holidays`, async () => {
                await searchResultPage.clickSearchHolidayBtn;
            });

            await test.step('And: I navigate to Search results page', async () => {
                await searchResultPage.validateSearchResultPageUrl();
            });

            await test.step('And: I see the search bar displaying at the top of the page', async () => {
                await searchResultPage.checkSearchBarAvailability();
            });

            await test.step('When: I scroll up and down the page', async () => {
                await searchResultPage.scrollDown();
            });

            await test.step('Then: the Search bar displayed is sticky', async () => {
                await searchResultPage.validateSearchBarTobeSticky();
            });
        });

        test(`The broad search proceeds with duration only for ${product} holidays @inw`, async ({ searchResultPage }) => {
            await test.step(`Given: I search for holidays`, async () => {
                await searchResultPage.clickSearchHolidayBtn;
            });

            await test.step('And: I navigate to Search results page', async () => {
                await searchResultPage.validateSearchResultPageUrl();
            });

            await test.step('And: I see the search bar displaying at the top of the page', async () => {
                await searchResultPage.checkSearchBarAvailability();
            });

            await test.step('When: I scroll up and down the page', async () => {
                await searchResultPage.scrollDown();
            });

            await test.step('Then: the Search bar displayed is sticky', async () => {
                await searchResultPage.validateSearchBarTobeSticky();
            });
        });
    }
});