import { test } from '../../../resources/inw_resources/page_objects/base/page_base';
import environmentBaseUrl from '../../../resources/utils/environmentBaseUrl';

const env = process.env.ENV || "qa";
const ECMSurl = environmentBaseUrl[env].e_cms;
let newPage
let rteContent
let testPageName

test.beforeEach(async ({ page, sharedSteps }) => {
    await test.step('Given: I navigate to home page', async () => {
        await page.goto(ECMSurl + '/umbraco#/content')
    })

    await test.step(`When: Create a Generic Content page`, async () => {
        testPageName = await sharedSteps.createGenericContentPage()
        await sharedSteps.clickSaveAndPublishBtn()
    });

    await test.step('Then: I navigate back to home page', async () => {
        await page.goto(ECMSurl + '/umbraco#/content')
    })
})

test.afterEach(async ({ page, sharedSteps }) => {
    await test.step('Given: I navigate to home page', async () => {
        await page.goto(ECMSurl + '/umbraco#/content')
    });

    await test.step(`And: I select a Generic Content page`, async () => {
        await sharedSteps.searchAndSelectNewGenericContentPage(testPageName)
    });

    await test.step(`Then: Delete a Generic Content page`, async () => {
        await sharedSteps.deleteGenericContentPage(testPageName)
        await sharedSteps.clickSaveAndPublishBtn()
    });

});

test.describe('Call to Book', async () => {
    test.use({ storageState: '.auth/ecmsUserStorageState.json' });
    test(`An ECMS user creates a CTB component and views it on the General Content page @inw`, async ({ ctbComponent, sharedSteps }) => {
        await test.step(`Background: I get the Telephone number from Contact Section page`, async () => {
            await sharedSteps.searchPage('Contact Section')
            await ctbComponent.getCTBPhoneNumber()
        });

        await test.step(`Given: I select a Generic Content page`, async () => {
            await sharedSteps.searchAndSelectNewGenericContentPage(testPageName)
        });

        await test.step(`And: I click 'Content' tab`, async () => {
            await sharedSteps.clickContentTab()
        });

        await test.step(`And: I click 'Add content' tab`, async () => {
            await sharedSteps.clickAddContentBtn()

        });

        await test.step(`And: I search for the CTB component`, async () => {
            await sharedSteps.searchComponent('CTB')

        });

        await test.step(`And: I click the CTB component`, async () => {
            await sharedSteps.selectComponent()

        });

        await test.step(`And: I fill out CTB Title`, async () => {
            await ctbComponent.fillOutCTBTitle()

        });

        await test.step(`And: I select CTB Layout`, async () => {
            await ctbComponent.selectCTBLayout()

        });

        await test.step(`And: I fill out the CTB Rich text editor`, async () => {
            rteContent = await sharedSteps.fillOutRTETextEditor()
        });

        await test.step(`And: I click 'Create' button for CTB component
                         And: I click 'Save and publish' button`, async () => {
            await sharedSteps.clickCreateBtn()
            await sharedSteps.clickSaveAndPublishBtn()
        });

        await test.step(`When: I click 'Info' tab
                         And: click the link to the page`, async () => {
            await sharedSteps.clickInfoTab()
            newPage = await sharedSteps.clickPageLink()
        });

        await test.step(`And: I redirect the Generic Content page
                         Then: I should see the CTB displayed on the Generic Content Page with details`, async () => {
            await sharedSteps.validateNewPageUrl(newPage)
            await ctbComponent.validateCtbButtonAvailability(newPage, rteContent)
        });

    })

})