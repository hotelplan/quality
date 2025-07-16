import { test } from '../../../resources/inw_resources/page_objects/base/page_base';
import environmentBaseUrl from '../../../resources/utils/environmentBaseUrl';

const env = process.env.ENV || "qa";
const ECMSurl = environmentBaseUrl[env].e_cms;
const accordionTitleArr: string[] = [];
const headlineTitleArr: string[] = [];
let accordionTitle: string
let headlineTitle
let newPage
let testPageName

test.beforeEach(async ({ page, sharedSteps }) => {
    // Clear arrays to prevent cross-test pollution
    accordionTitleArr.length = 0
    headlineTitleArr.length = 0
    
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

test.describe('Accordion', async () => {
    test.use({ storageState: '.auth/ecmsUserStorageState.json' });
    test(`An ECMS user creates an Accordion component and views it on the General Content page @inw @component`, async ({ accordionComponent, headlineComponent, sharedSteps }) => {
        await test.step(`Given: I select a Generic Content page`, async () => {
            await sharedSteps.searchAndSelectNewGenericContentPage(testPageName)
        });

        await test.step(`And: I click 'Content' tab`, async () => {
            await sharedSteps.clickContentTab()
        });

        await test.step(`And: I click 'Add content' tab`, async () => {
            await sharedSteps.clickAddContentBtn()

        });

        await test.step(`And: I search for the Accordion component`, async () => {
            await sharedSteps.searchComponent('Accordion')

        });

        await test.step(`And: I click the Accordion component`, async () => {
            await sharedSteps.selectComponent()
            // Wait for accordion form to load
            await accordionComponent.page.waitForLoadState('domcontentloaded')
        });
        // creates 4 accordions
        for (let i = 0; i <= 3; i++) {

            await test.step(`And: I click the Add Accordion Item button (${i + 1}/4)`, async () => {
                await accordionComponent.clickAddAccordionItemBtn()
            });

            await test.step(`And: I input Accordion Title`, async () => {
                accordionTitle = await accordionComponent.inputAccordionTitle()
                accordionTitleArr.push(accordionTitle)

            });

            await test.step(`And: I click Add content button
                             And: I choose and select Headline component for the accordion entry.`, async () => {
                await accordionComponent.clickAddContentBtn()
                await sharedSteps.searchComponent('Headline')
                await sharedSteps.selectComponent()
                await headlineComponent.page.waitForLoadState('domcontentloaded')
                headlineTitle = await headlineComponent.fillOutHeadlineDetails('accordion')
                headlineTitleArr.push(headlineTitle)
                await accordionComponent.clickCreateAccordionEntryBtn()
            });


            await test.step(`And: I click 'Create' button for Accordion Item`, async () => {
                await accordionComponent.clickCreateAccordionItemBtn()
            });

        }

        await test.step(`And: I click 'Create' button for Accordion component
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
                         Then: I should see the Accordion displayed on the Generic Content Page with details`, async () => {
            await sharedSteps.validateNewPageUrl(newPage)
            await accordionComponent.validateAccordionAvailability(newPage, accordionTitleArr, headlineTitleArr)
        });

    })

})