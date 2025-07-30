import { test } from '../../../resources/inw_resources/page_objects/base/page_base';
import environmentBaseUrl from '../../../resources/utils/environmentBaseUrl';
import { SearchValues } from '../../../resources/inw_resources/utilities/models';

const env = process.env.ENV || "qa";
const ECMSurl = environmentBaseUrl[env].e_cms;

const products = ['Ski', 'Walking', 'Lapland'];

test.beforeEach(async ({ page, sharedSteps }) => {
    await test.step('Given: I navigate to home page', async () => {
        await page.goto(ECMSurl + '/')
        await sharedSteps.clickAcceptAllCookiesBtn(page);
    })
})

test.describe('Search', async () => {
    for (const product of products) {
        let initialSearchValues: SearchValues
        let updatedSearchValues
        let newPage
        
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

            await test.step(`And: I choose and select an Accommodation by clicking 'View details' button
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
            let testInitialSearchValues: SearchValues
            let testNewPage
            
            await test.step(`Given: I select a product to search`, async () => {
                await searchResultPage.clickSearchProductTab(product);
            });

            await test.step(`And: I set guests to 0`, async () => {
                await searchResultPage.setNumberOfGuests(0);
            });

            await test.step(`And: I get the default values for Number of nights, Number of guests, Departure location and Date`, async () => {
                testInitialSearchValues = await searchResultPage.getInitialSearchValues()
            })

            await test.step(`And: I search for ${product} holidays`, async () => {
                await searchResultPage.clickSearchHolidayBtn()
            })

            await test.step('And: I navigate to Search results page', async () => {
                await searchResultPage.validateSearchResultPageUrl()
            })

            await test.step(`And: I choose and select an Accommodation by clicking 'View details' button
                             And: I see the search bar displaying at the top of the page`, async () => {
                testNewPage = await resortPage.checkResortSearchBarAvailability()
            })

            await test.step(`When: I check the Number of nights, Number of guests, Departure location and Date
                             Then: I should see correct Number of nights, Number of guests, Departure location and Date displayed on the search bar`, async () => {
                await resortPage.validateResortSearchBarDetails(testInitialSearchValues, testNewPage)

            })
        })

        test(`The search bar should display the updated number of nights, number of guests, departure location, and date on the Resort Details page for ${product} holidays when the details have been updated. @inw`, async ({ searchResultPage, resortPage }) => {
            let testUpdatedSearchValues
            let testNewPage
            
            await test.step(`Given: I select a product to search`, async () => {
                await searchResultPage.clickSearchProductTab(product);
            });

            await test.step(`And: I search for ${product} holidays`, async () => {
                await searchResultPage.clickSearchHolidayBtn()
            })

            await test.step('And: I navigate to Search results page', async () => {
                await searchResultPage.validateSearchResultPageUrl()
            })

            await test.step(`And: I choose and select an Accommodation by clicking 'View details' button
                             And: I see the search bar displaying at the top of the page`, async () => {
                testNewPage = await resortPage.checkResortSearchBarAvailability()
            })

            await test.step(`And: The price should display the cheapest Holiday price. `, async () => {
                await resortPage.validateResortPrice(testNewPage, product)

            })

            await test.step(`And: I update the number of nights, number of guests, departure location, and date`, async () => {
                testUpdatedSearchValues = await resortPage.updateResortSearchDetails(testNewPage)
            })

            await test.step(`When: I check the Number of nights, Number of guests, Departure location and Date
                             Then: I should see correct Number of nights, Number of guests, Departure location and Date displayed on the search bar`, async () => {
                await resortPage.validateResortSearchBarDetails(testUpdatedSearchValues, testNewPage, true)

            })
        })
    }

})