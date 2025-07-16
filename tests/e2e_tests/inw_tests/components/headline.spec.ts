import { test } from '../../../resources/inw_resources/page_objects/base/page_base';
import environmentBaseUrl from '../../../resources/utils/environmentBaseUrl';

const env = process.env.ENV || "qa";
const ECMSurl = environmentBaseUrl[env].e_cms;
let newPage
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

test.describe('Headline', async () => {
    test.use({ storageState: '.auth/ecmsUserStorageState.json' });
    test(`An ECMS user creates a Headline component and views it on the General Content page ${testPageName} @inw @component`, async ({ headlineComponent, sharedSteps }) => {
        await test.step(`Given: I select a Generic Content page`, async () => {
            await sharedSteps.searchAndSelectNewGenericContentPage(testPageName)
        });

        await test.step(`And: I click 'Content' tab`, async () => {
            await sharedSteps.clickContentTab()
        });

        await test.step(`And: I click 'Add content' tab`, async () => {
            await sharedSteps.clickAddContentBtn()

        });

        await test.step(`And: I search for the Headline component`, async () => {
            await sharedSteps.searchComponent('Headline')

        });

        await test.step(`And: I click the Headline component`, async () => {
            await sharedSteps.selectComponent()

        });

        await test.step(`And: I fill out headline details`, async () => {
            await headlineComponent.fillOutHeadlineDetails()

        });

        await test.step(`And: I click 'Create' button
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
                         Then: I should see the Headline displayed on the Generic Content Page with correct size and alignment`, async () => {
            await sharedSteps.validateNewPageUrl(newPage)
            await headlineComponent.validateHeadlineAvailability(newPage)
        });

    })

})