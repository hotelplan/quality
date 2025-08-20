import { test } from '../../../resources/inw_resources/page_objects/base/page_base';
import environmentBaseUrl from '../../../resources/utils/environmentBaseUrl';

const env = process.env.ENV || "qa";
const ECMSurl = environmentBaseUrl[env].qa;

test.beforeEach(async ({ page, sharedSteps }) => {
    await test.step('Given: I navigate to home page', async () => {
        await page.goto(ECMSurl + '/')
        await sharedSteps.clickAcceptAllCookiesBtn(page);
    })
})

test.describe('Accommodation page', async () => {

    test.describe('SKI Search bar check availability', () => {
        test(`The search bar should show 'Check availability' and the text 'Check availability to see more accurate pricing' on SKI holidays' Resort page when arriving without parameters from the Country page @inw `, async ({ sharedSteps }) => {
            await test.step(`Given: I click the Ski holidays menu from the header`, async () => {
                await sharedSteps.clickProductMenu('Ski');
            });

            await test.step(`And: I navigated to the selected Product page`, async () => {
                await sharedSteps.validateInwURL('Product-landing-ski');

            });

            await test.step(`And: I hover and click Destinations menu`, async () => {
                await sharedSteps.hoverDestinationsMenu('Ski')

            });

            await test.step(`And: I choose and select a Country`, async () => {
                await sharedSteps.selectCountry()

            });

            await test.step(`And: I navigated to the selected Country page`, async () => {
                await sharedSteps.validateInwURL();

            });

            await test.step(`And: I choose and select a resort card from Product carousel`, async () => {
                await sharedSteps.selectResortCard();

            });

            await test.step(`And: I navigated to the selected Resort`, async () => {
                await sharedSteps.validateInwURL('resortFromCarousel');

            });

            await test.step(`When: search bar is available`, async () => {
                await sharedSteps.validateSearchBarAvailability();
            });

            await test.step(`Then: I should see the button text with "Check Availability"`, async () => {
                await sharedSteps.validateSearchBarText()
            });

            await test.step(`And: I should see the search bar text with "Check availability to see more accurate pricing"`, async () => {
                await sharedSteps.validateSearchBarButtonText()
            });
        })

        test(`The search bar should show 'Check availability' and the text 'Check availability to see more accurate pricing' on SKI holidays' Accommodation page when arriving without parameters from the Region page @inw `, async ({ sharedSteps }) => {
            await test.step(`Given: I click the Ski holidays menu from the header`, async () => {
                await sharedSteps.clickProductMenu('Ski');
            });

            await test.step(`And: I navigated to the selected Product page`, async () => {
                await sharedSteps.validateInwURL('Product-landing-ski');

            });

            await test.step(`And: I hover and click Destinations menu`, async () => {
                await sharedSteps.hoverDestinationsMenu('Ski')

            });

            await test.step(`And: I choose and select a Region`, async () => {
                await sharedSteps.selectRegion()

            });

            await test.step(`And: I navigated to the selected Region page`, async () => {
                await sharedSteps.validateInwURL('region');

            });

            await test.step(`And: I choose and select an Accommodation card from Product carousel`, async () => {
                await sharedSteps.selectAccommodationCard();

            });

            await test.step(`And: I navigated to the selected Accommodation`, async () => {
                await sharedSteps.validateInwURL('accommodationFromCarousel');

            });

            await test.step(`When: search bar is available`, async () => {
                await sharedSteps.validateSearchBarAvailability();
            });

            await test.step(`Then: I should see the button text with "Check Availability"`, async () => {
                await sharedSteps.validateSearchBarText()
            });

            await test.step(`And: I should see the search bar text with "Check availability to see more accurate pricing"`, async () => {
                await sharedSteps.validateSearchBarButtonText()
            });

        })
    });

    test.describe('WALKING Search bar check availability', () => {
        test(`The search bar should show 'Check availability' and the text 'Check availability to see more accurate pricing' on WALKING holidays' Accommodation page when arriving without parameters from the Region page @inw `, async ({ sharedSteps }) => {
            await test.step(`Given: I click the Walking holidays menu from the header`, async () => {
                await sharedSteps.clickProductMenu('Walking');
            });

            await test.step(`And: I navigated to the selected Product page`, async () => {
                await sharedSteps.validateInwURL('Product-landing-walking');

            });

            await test.step(`And: I hover and click Destinations menu`, async () => {
                await sharedSteps.hoverDestinationsMenu('Walking')

            });

            await test.step(`And: I choose and select a Region`, async () => {
                await sharedSteps.selectRegion('Walking')

            });

            await test.step(`And: I navigated to the selected Region page`, async () => {
                await sharedSteps.validateInwURL('region');

            });

            await test.step(`And: I choose and select an Accommodation card from Product carousel`, async () => {
                await sharedSteps.selectAccommodationCard();

            });

            await test.step(`And: I navigated to the selected Accommodation`, async () => {
                await sharedSteps.validateInwURL('accommodationFromCarousel');

            });

            await test.step(`When: search bar is available`, async () => {
                await sharedSteps.validateSearchBarAvailability();
            });

            await test.step(`Then: I should see the button text with "Check Availability"`, async () => {
                await sharedSteps.validateSearchBarText()
            });

            await test.step(`And: I should see the search bar text with "Check availability to see more accurate pricing"`, async () => {
                await sharedSteps.validateSearchBarButtonText()
            });
        })

        test(`The search bar should show 'Check availability' and the text 'Check availability to see more accurate pricing' on WALKING holidays' Resort page when arriving without parameters from another Resort page @inw `, async ({ sharedSteps }) => {
            await test.step(`Given: I click the Walking holidays menu from the header`, async () => {
                await sharedSteps.clickProductMenu('Walking');
            });

            await test.step(`And: I navigated to the selected Product page`, async () => {
                await sharedSteps.validateInwURL('Product-landing-walking');

            });

            await test.step(`And: I hover and click Destinations menu`, async () => {
                await sharedSteps.hoverDestinationsMenu('Walking')

            });

            await test.step(`And: I choose and select a Resort`, async () => {
                await sharedSteps.selectResort()

            });

            await test.step(`And: I navigated to the selected Resort page`, async () => {
                await sharedSteps.validateInwURL('resort');

            });

            await test.step(`And: I choose and select a Resort card from Product carousel`, async () => {
                await sharedSteps.selectResortCard();

            });

            await test.step(`And: I navigated to the selected Resort`, async () => {
                await sharedSteps.validateInwURL('resortFromCarousel');

            });

            await test.step(`When: search bar is available`, async () => {
                await sharedSteps.validateSearchBarAvailability();
            });

            await test.step(`Then: I should see the button text with "Check Availability"`, async () => {
                await sharedSteps.validateSearchBarText()
            });

            await test.step(`And: I should see the search bar text with "Check availability to see more accurate pricing"`, async () => {
                await sharedSteps.validateSearchBarButtonText()
            });

        })
    });

    test.describe('LAPLAND Search bar check availability', () => {
        test(`The search bar should show 'Check availability' and the text 'Check availability to see more accurate pricing' on LAPLAND holidays' Accommodation page when arriving without parameters from another Resort page @inw `, async ({ sharedSteps }) => {
            await test.step(`Given: I click the Lapland holidays menu from the header`, async () => {
                await sharedSteps.clickProductMenu('Lapland');
            });

            await test.step(`And: I navigated to the selected Product page`, async () => {
                await sharedSteps.validateInwURL('Product-landing-lapland');

            });

            await test.step(`And: I hover and click Destinations menu`, async () => {
                await sharedSteps.hoverDestinationsMenu()

            });

            await test.step(`And: I choose and select a Resort`, async () => {
                await sharedSteps.selectResort('lapland')

            });

            await test.step(`And: I navigated to the selected Resort page`, async () => {
                await sharedSteps.validateInwURL('resort');

            });

            await test.step(`And: I choose and select an Accommodation card from Product carousel`, async () => {
                await sharedSteps.selectAccommodationCard();

            });

            await test.step(`And: I navigated to the selected Accommodation`, async () => {
                await sharedSteps.validateInwURL('accommodationFromCarousel');

            });

            await test.step(`When: search bar is available`, async () => {
                await sharedSteps.validateSearchBarAvailability();
            });

            await test.step(`Then: I should see the button text with "Check Availability"`, async () => {
                await sharedSteps.validateSearchBarText()
            });

            await test.step(`And: I should see the search bar text with "Check availability to see more accurate pricing"`, async () => {
                await sharedSteps.validateSearchBarButtonText()
            });
        })

        test(`The search bar should show 'Check availability' and the text 'Check availability to see more accurate pricing' on LAPLAND holidays' Resort page when arriving without parameters from the Lapland Activities page @inw `, async ({ sharedSteps }) => {
            await test.step(`Given: I click the Lapland holidays menu from the header`, async () => {
                await sharedSteps.clickProductMenu('Lapland');
            });

            await test.step(`And: I navigated to the selected Product page`, async () => {
                await sharedSteps.validateInwURL('Product-landing-lapland');

            });

            await test.step(`And: I hover and click Destinations menu`, async () => {
                await sharedSteps.hoverDestinationsMenu()

            });

            await test.step(`And: I choose and select a Lapland Activity`, async () => {
                await sharedSteps.selectLaplandActivity();

            });

            await test.step(`And: I navigated to the selected Lapland Activity page`, async () => {
                await sharedSteps.validateInwURL('laplandActivity');

            });

            await test.step(`And: I choose and select a Resort card from Product carousel`, async () => {
                await sharedSteps.selectResortCard();

            });

            await test.step(`And: I navigated to the selected Accommodation`, async () => {
                await sharedSteps.validateInwURL('resortFromCarousel');

            });

            await test.step(`When: search bar is available`, async () => {
                await sharedSteps.validateSearchBarAvailability();
            });

            await test.step(`Then: I should see the button text with "Check Availability"`, async () => {
                await sharedSteps.validateSearchBarText()
            });

            await test.step(`And: I should see the search bar text with "Check availability to see more accurate pricing"`, async () => {
                await sharedSteps.validateSearchBarButtonText()
            });

        })
    });



})