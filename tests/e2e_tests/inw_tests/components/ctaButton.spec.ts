import { test } from '../../../resources/inw_resources/page_objects/base/page_base';
import environmentBaseUrl from '../../../resources/utils/environmentBaseUrl';
import { type CtaButtonProperty } from '../../../resources/inw_resources/utilities/models';

const env = process.env.ENV || "qa";
const ECMSurl = environmentBaseUrl[env].e_cms;
let ctaButtonProperty: CtaButtonProperty = {
    icon: null,
    title: null,
}
let newPage
let testPageName

test.beforeEach(async ({ page, sharedSteps }) => {
    // Reset object properties to prevent cross-test pollution
    ctaButtonProperty = {
        icon: null,
        title: null,
    }
    
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

test.describe('CTA Button', async () => {
    test.use({ storageState: '.auth/ecmsUserStorageState.json' });
    test(`An ECMS user creates a CTA button component and views it on the General Content page @inw @component`, async ({ ctaButtonComponent, sharedSteps }) => {
        await test.step(`Given: I select a Generic Content page`, async () => {
            await sharedSteps.searchAndSelectNewGenericContentPage(testPageName)
        });

        await test.step(`And: I click 'Content' tab`, async () => {
            await sharedSteps.clickContentTab()
        });

        await test.step(`And: I click 'Add content' tab`, async () => {
            await sharedSteps.clickAddContentBtn()

        });

        await test.step(`And: I search for the CTA button component`, async () => {
            await sharedSteps.searchComponent('CTA button')

        });

        await test.step(`And: I click the CTA button component`, async () => {
            await sharedSteps.selectComponent()
            // Wait for CTA button form to load
            await ctaButtonComponent.page.waitForLoadState('domcontentloaded')
        });

        await test.step(`And: I select CTA button Theme`, async () => {
            await ctaButtonComponent.selectCTAButtonTheme()
        });

        await test.step(`And: I select CTA button Position`, async () => {
            await ctaButtonComponent.selectCTAButtonPosition()
        });

        await test.step(`And: I select Cta button Link`, async () => {
            ctaButtonProperty.title = await sharedSteps.pickComponentLink('CTA Button')
            if (!ctaButtonProperty.title) {
                throw new Error('Failed to set CTA button title')
            }
        });

        await test.step(`And: I select CTA button Icon`, async () => {
            ctaButtonProperty.icon = await sharedSteps.selectComponentIcon()
            if (!ctaButtonProperty.icon) {
                throw new Error('Failed to set CTA button icon')
            }
        });

        await test.step(`And: I click 'Create' button for CTA button component
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
                         Then: I should see the CTA button displayed on the Generic Content Page with details`, async () => {
            await sharedSteps.validateNewPageUrl(newPage)
            await ctaButtonComponent.validateCtaButtonAvailability(newPage, ctaButtonProperty)
        });

    })

})