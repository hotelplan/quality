import { test } from '../../../resources/inw_resources/page_objects/base/page_base';
import environmentBaseUrl from '../../../resources/utils/environmentBaseUrl';

const env = process.env.ENV || "qa";
const ECMSurl = environmentBaseUrl[env].e_cms;

const products = ['Ski', 'Walking', 'Lapland'];

test.beforeEach(async ({ page }) => {
    await test.step('Given: I navigate to home page', async () => {
        await page.goto(ECMSurl + '/')
    })
})

test.describe('Search', async () => {
    for (const product of products) {
        test(`The search bar should be displayed as sticky for ${product} holidays @inw`, async ({ searchResultPage }) => {
            await test.step(`Given: I select a product to search`, async () => {
                await searchResultPage.clickSearchProductTab(product);
            });

            await test.step(`And: I search for ${product} holidays`, async () => {
                await searchResultPage.clickSearchHolidayBtn()
            })

            await test.step('And: I navigate to Search results page', async () => {
                await searchResultPage.validateSearchResultPageUrl()
            })

            await test.step(`And: I see the search bar displaying at the top of the page`, async () => {
                await searchResultPage.checkSearchBarAvailability()
            })

            await test.step(`When: I scroll up and down the page`, async () => {
                await searchResultPage.scrollDown()

            })

            await test.step(`Then: the Search bar displayed is sticky`, async () => {
                await searchResultPage.validateSearchBarTobeSticky()
            })

        })

        test(`The search results are to be grouped by using a toggle to group by Accommodation or Resorts for ${product} holidays @inw`, async ({ searchResultPage }) => {
            await test.step(`Given: I select a product to search`, async () => {
                await searchResultPage.clickSearchProductTab(product);
            });

            await test.step(`And: I search for ${product} holidays`, async () => {
                await searchResultPage.clickSearchHolidayBtn()
            })

            await test.step('And: I navigate to Search results page', async () => {
                await searchResultPage.validateSearchResultPageUrl()
            })

            await test.step(`And: I see that the search results are grouped by Accommodation by default`, async () => {
                await searchResultPage.validateToggleValue()
            })

            await test.step(`When: I verify that the Accommodation API response corresponds to accommodation.`, async () => {
                await searchResultPage.validateAccommodationApiResults(product)
            })

            await test.step(`Then: I verify that the accommodation name displayed in the UI matches the API response.`, async () => {
                await searchResultPage.validateAccommodationResponseAgainstUIDisplay()
            })

            await test.step(`And: I see that the 'View Hotels' button is displayed on each card.`, async () => {
                await searchResultPage.validateViewHotelsButtonAvailability()
            })

            await test.step(`And: I click the toggle group by resorts`, async () => {
                await searchResultPage.clickGroupToggle()

            })
            await test.step(`When: I verify that the Resorts API response corresponds to Resort.`, async () => {
                await searchResultPage.validateResortApiResults(product)
            })

            await test.step(`Then: I verify that the Resort name displayed in the UI matches the API response.`, async () => {
                await searchResultPage.validateResortResponseAgainstUIDisplay()
            })

            await test.step(`And: I see that the 'View Accommodation(s)' button is displayed on each card.`, async () => {
                await searchResultPage.validateViewAccommodationsButtonAvailability()
            })

        })
    }

})