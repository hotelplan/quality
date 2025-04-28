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

test.describe('Accordion', async () => {
    test.use({ storageState: '.auth/ecmsUserStorageState.json' });
    test.only(`An ECMS user creates an Accordion component and views it on the General Content page @inw`, async ({ accordionComponent, headlineComponent, sharedSteps }) => {
        await test.step(`Given: I select a Generic Content page`, async () => {
            await sharedSteps.searchAndSelectGenericContentPage()
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

        });

        await test.step(`And: I click the Add Accordion Item button`, async () => {
            await accordionComponent.clickAddAccordionItemBtn()
        });

        await test.step(`And: I input Accordion Title`, async () => {
            await accordionComponent.inputAccordionTitle()

        });
        // creates 4 accordions
        for (let i = 0; i <= 3; i++) {
            await test.step(`And: I click Add content button
                             And: I choose and select Headline component for the accordion entry.`, async () => {
                await accordionComponent.clickAddContentBtn()
                await sharedSteps.searchComponent('Headline')
                await sharedSteps.selectComponent()
                await headlineComponent.fillOutHeadlineDetails('accordion')
                await accordionComponent.clickCreateAccordionEntryBtn()
            });
        }

        await test.step(`And: I click 'Create' button for Accordion Item`, async () => {
            await accordionComponent.clickCreateAccordionItemBtn()
        });

        await test.step(`And: I click 'Create' button for Accordion component
                         And: I click 'Save and publish' button`, async () => {
            await sharedSteps.clickCreateBtn()
            await sharedSteps.clickSaveAndPublishBtn()
        });

        // await test.step(`When: I click 'Info' tab
        //                  And: click the link to the page`, async () => {
        //     await sharedSteps.clickInfoTab()
        //     newPage = await sharedSteps.clickPageLink()
        // });

        // await test.step(`And: I redirect the Generic Content page
        //                  Then: I should see the Accordion displayed on the Generic Content Page with correct size and alignment`, async () => {
        //     await sharedSteps.validatePageUrl(newPage)
        //     await headlineComponent.validateHeadlineAvailability(newPage)
        // });

    })

})