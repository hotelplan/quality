import { test } from '../../../resources/inw_resources/page_objects/base/page_base';
import environmentBaseUrl from '../../../resources/utils/environmentBaseUrl';

const env = process.env.ENV || "qa";
const ECMSurl = environmentBaseUrl[env].e_cms;
let newPage

test.beforeEach(async ({ page }) => {
    await test.step('Given: I navigate to home page', async () => {
        await page.goto(ECMSurl + '/umbraco#/content')
    })
})

test.describe('Call to Book', async () => {
    test.use({ storageState: '.auth/ecmsUserStorageState.json' });
    test(`An ECMS user creates a CTB component and views it on the General Content page @inw`, async ({ ctbComponent, sharedSteps }) => {
        await test.step(`Given: I select a Generic Content page`, async () => {
            await sharedSteps.searchAndSelectGenericContentPage()
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

        await test.step(`And: I setup a CTB component`, async () => {
            await ctbComponent.setupCtB()

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
            await sharedSteps.validatePageUrl(newPage)
            await ctbComponent.validateCtaButtonAvailability(newPage)
        });

    })

})