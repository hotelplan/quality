import { test } from '../../../resources/inw_resources/page_objects/base/page_base';
import environmentBaseUrl from '../../../resources/utils/environmentBaseUrl';
import { SearchValues } from '../../../resources/inw_resources/utilities/models';

const env = process.env.ENV || "qa";
const ECMSurl = environmentBaseUrl[env].e_cms;

const products = ['Ski', 'Walking', 'Lapland'];
let defaultSearchValues: SearchValues
let updatedSearchValues
let newPage

test.beforeEach(async ({ page }) => {
    await test.step('Given: I navigate to home page', async () => {
        await page.goto(ECMSurl + '/')
    })
})

test.describe('Search', async () => {
    for (const product of products) {
        test(`The search bar should be displayed as sticky on Resort details page for ${product} holidays @inw`, async ({ searchResultPage, resortPage }) => {
            await test.step(`Given: I select a product to search`, async () => {
                await searchResultPage.clickSearchProductTab(product);
            });

            await test.step(`And: I search for ${product} holidays`, async () => {
                await searchResultPage.clickSearchHolidayBtn()
            })

            await test.step('And: I navigate to Search results page', async () => {
                await searchResultPage.validateSearchResultPageUrl()
            })

            await test.step(`And: I choose and select an Accommodation by clicking 'View Hotels' button
                             And: I see the search bar displaying at the top of the page`, async () => {
                newPage = await resortPage.checkResortSearchBarAvailability()
            })

            await test.step(`When: I scroll up and down the page`, async () => {
                await resortPage.scrollDown(newPage)

            })

            await test.step(`Then: the Search bar displayed is sticky`, async () => {
                await resortPage.validateSearchBarTobeSticky(newPage)
            })
        })

        test(`Search bar should display Number of nights, Number of guests, Departure location and Date on Resort details page for ${product} holidays @inw`, async ({ searchResultPage, resortPage }) => {
            await test.step(`Given: I select a product to search`, async () => {
                await searchResultPage.clickSearchProductTab(product);
            });

            await test.step(`And: I get the default values for Number of nights, Number of guests, Departure location and Date`, async () => {
                defaultSearchValues = await searchResultPage.getDefaultSearchValues()
            })

            await test.step(`And: I search for ${product} holidays`, async () => {
                await searchResultPage.clickSearchHolidayBtn()
            })

            await test.step('And: I navigate to Search results page', async () => {
                await searchResultPage.validateSearchResultPageUrl()
            })

            await test.step(`And: I choose and select an Accommodation by clicking 'View Hotels' button
                             And: I see the search bar displaying at the top of the page`, async () => {
                newPage = await resortPage.checkResortSearchBarAvailability()
            })

            await test.step(`When: I check the Number of nights, Number of guests, Departure location and Date
                             Then: I should see correct Number of nights, Number of guests, Departure location and Date displayed on the search bar`, async () => {
                await resortPage.validateResortSearchBarDetails(defaultSearchValues, newPage)

            })
        })

        test(`The search bar should display the updated number of nights, number of guests, departure location, and date on the Resort Details page for ${product} holidays when the details have been updated. @inw`, async ({ searchResultPage, resortPage }) => {
            await test.step(`Given: I select a product to search`, async () => {
                await searchResultPage.clickSearchProductTab(product);
            });

            await test.step(`And: I search for ${product} holidays`, async () => {
                await searchResultPage.clickSearchHolidayBtn()
            })

            await test.step('And: I navigate to Search results page', async () => {
                await searchResultPage.validateSearchResultPageUrl()
            })

            await test.step(`And: I choose and select an Accommodation by clicking 'View Hotels' button
                             And: I see the search bar displaying at the top of the page`, async () => {
                newPage = await resortPage.checkResortSearchBarAvailability()
            })

            await test.step(`And: I update the number of nights, number of guests, departure location, and date`, async () => {
                updatedSearchValues = await resortPage.updateResortSearchDetails(newPage)
            })

            await test.step(`When: I check the Number of nights, Number of guests, Departure location and Date
                             Then: I should see correct Number of nights, Number of guests, Departure location and Date displayed on the search bar`, async () => {
                await resortPage.validateResortSearchBarDetails(updatedSearchValues, newPage, true)

            })
        })
    }

})