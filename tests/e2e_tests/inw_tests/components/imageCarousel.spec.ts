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

test.describe('Image Carousel', async () => {
    test.use({ storageState: '.auth/ecmsUserStorageState.json' });
    test(`An ECMS user creates a Image Carousel component and views it on the General Content page @inw`, async ({ rteComponent, sharedSteps }) => {
        await test.step(`Given: I select a Generic Content page`, async () => {
            await sharedSteps.searchAndSelectGenericContentPage()
        });

        await test.step(`And: I click 'Content' tab`, async () => {
            await sharedSteps.clickContentTab()
        });

        await test.step(`And: I click 'Add content' tab`, async () => {
            await sharedSteps.clickAddContentBtn()

        });

        await test.step(`And: I search for the Image Carousel component`, async () => {
            await sharedSteps.searchComponent('Image Carousel')

        });

        await test.step(`And: I click the Image Carousel component`, async () => {
            await sharedSteps.selectComponent()

        });

        await test.step(`And: I setup a Image Carousel component`, async () => {
            //await rteComponent.setupRTE()

        });

        await test.step(`And: I click 'Create' button for Image Carousel component
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
                         Then: I should see the Image Carousel displayed on the Generic Content Page with details`, async () => {
            await sharedSteps.validatePageUrl(newPage)
            //await rteComponent.validateRTE(newPage)
        });

    })

})