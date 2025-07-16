import { test } from '../../../resources/inw_resources/page_objects/base/page_base';
import environmentBaseUrl from '../../../resources/utils/environmentBaseUrl';
import { type PillsProperty } from '../../../resources/inw_resources/utilities/models';

const env = process.env.ENV || "qa";
const ECMSurl = environmentBaseUrl[env].e_cms;
let pillProperty: PillsProperty = {
    rteContent: null,
    linkTitle: null,
    link: null,
    ctaButtonLinkTitle: null,
    icon: null
} 
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

test.describe('Pills', async () => {
    test.use({ storageState: '.auth/ecmsUserStorageState.json' });
    test(`An ECMS user creates a Pill component and views it on the General Content page @inw @component`, async ({ pillsComponent, sharedSteps }) => {
        await test.step(`Given: I select a Generic Content page`, async () => {
            await sharedSteps.searchAndSelectNewGenericContentPage(testPageName)
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

        await test.step(`And: I click Pill Link button`, async () => {
            await pillsComponent.clickAddPillLinkBtn()
        });

        await test.step(`And: I select Pill Icon`, async () => {
            pillProperty.icon = await sharedSteps.selectComponentIcon()
        });

        await test.step(`And: I select Pill Link`, async () => {
            pillProperty.linkTitle = await sharedSteps.pickComponentLink('Pills')
        });

        await test.step(`And: I add a CTA button`, async () => {
            pillProperty.ctaButtonLinkTitle = await sharedSteps.pickComponentLink('Pill CTA Button')
        });

        await test.step(`And: I fill out the Pill Description Rich text editor`, async () => {
            pillProperty.rteContent = await sharedSteps.fillOutRTETextEditor()
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
            await sharedSteps.validateNewPageUrl(newPage)
            await pillsComponent.validatePillAvailability(newPage, pillProperty)

        });

    })

})