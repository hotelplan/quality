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

test.describe('Pills', async () => {
    test.use({ storageState: '.auth/ecmsUserStorageState.json' });
    test(`An ECMS user creates a Pill component and views it on the General Content page @inw`, async ({ pillsComponent, sharedSteps }) => {
        await test.step(`Given: I select a Generic Content page`, async () => {
            await sharedSteps.searchAndSelectGenericContentPage()
        });

        await test.step(`And: I click 'Content' tab`, async () => {
            await sharedSteps.clickContentTab()
        });

        await test.step(`And: I click 'Add content' tab`, async () => {
            await sharedSteps.clickAddContentBtn()

        });

        await test.step(`And: I search for the Pills component`, async () => {
            await sharedSteps.searchComponent('Pills')

        });

        await test.step(`And: I click the Pills component`, async () => {
            await sharedSteps.selectComponent()

        });

        await test.step(`And: I select Pill Link Style`, async () => {
            await pillsComponent.selectPillLinkStyle()
        });

        await test.step(`And: I fill out Pill title`, async () => {
            await pillsComponent.fillOutPillTitle()

        });

        await test.step(`And: I select Pill Link`, async () => {
            await pillsComponent.addPillLink()
        });

        await test.step(`And: I add a CTA button`, async () => {
            await pillsComponent.addCTAbutton()
        });

        await test.step(`And: I fill out Pill Description`, async () => {
            await pillsComponent.fillOutPillDescription()

        });

        await test.step(`And: I click 'Create' button for Pills component
                         And: I click 'Save and publish' button`, async () => {
            await sharedSteps.clickCreateBtn(1)
            await sharedSteps.clickSaveAndPublishBtn()
        });

        await test.step(`When: I click 'Info' tab
                         And: click the link to the page`, async () => {
            await sharedSteps.clickInfoTab()
            newPage = await sharedSteps.clickPageLink()
        });

        await test.step(`And: I redirect the Generic Content page
                         Then: I should see the Pills displayed on the Generic Content Page with details`, async () => {
            await sharedSteps.validatePageUrl(newPage)
            await pillsComponent.validatePillAvailability(newPage)
            
        });

    })

})