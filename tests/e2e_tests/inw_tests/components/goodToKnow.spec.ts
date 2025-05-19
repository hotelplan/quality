import { test } from '../../../resources/inw_resources/page_objects/base/page_base';
import environmentBaseUrl from '../../../resources/utils/environmentBaseUrl';
import { type GoodToKnowItem } from '../../../resources/inw_resources/utilities/models';

const env = process.env.ENV || "qa";
const ECMSurl = environmentBaseUrl[env].e_cms;
const goodToKnowItems: GoodToKnowItem[] = []
let goodToKnowItem: GoodToKnowItem = {
    icon: null,
    title: null,
    description: null,
    link: null
}
let newPage
let rteContent


test.beforeEach(async ({ page }) => {
    await test.step('Given: I navigate to home page', async () => {
        await page.goto(ECMSurl + '/umbraco#/content')
    })
})

test.describe('Good to know', async () => {
    test.use({ storageState: '.auth/ecmsUserStorageState.json' });
    test(`An ECMS user creates Good-to-know component and views it on the General Content page @inw`, async ({ goodToKnowComponent, sharedSteps }) => {
        await test.step(`Given: I select a Generic Content page`, async () => {
            await sharedSteps.searchAndSelectGenericContentPage()
        });

        await test.step(`And: I click 'Content' tab`, async () => {
            await sharedSteps.clickContentTab()
        });

        await test.step(`And: I click 'Add content' tab`, async () => {
            await sharedSteps.clickAddContentBtn()

        });

        await test.step(`And: I search for the Good-to-know component`, async () => {
            await sharedSteps.searchComponent('Good to know')

        });

        await test.step(`And: I click the Good-to-know component`, async () => {
            await sharedSteps.selectComponent()

        });

        await test.step(`And: I fill out Good-to-know title`, async () => {
            await goodToKnowComponent.fillOutGoodToKnowTitle()
        });

        await test.step(`And: I fill out the Good-to-know Description Rich text editor`, async () => {
            rteContent = await sharedSteps.fillOutRTETextEditor()
        });

        // Creates 6 Good-to-know items
        for (let i = 0; i <= 5; i++) {
            await test.step(`And: I click "Add Good to know item" button`, async () => {
                await goodToKnowComponent.clickGoodToKnowItemBtn()
            });

            await test.step(`And: I fill out Good-to-know item title`, async () => {
                goodToKnowItem.title = await goodToKnowComponent.fillOutGoodToKnowItemTitle()
            });

            await test.step(`And: I fill out Good-to-know item description`, async () => {
                goodToKnowItem.description = await sharedSteps.fillOutRTETextEditor('Good to know item')
            });

            await test.step(`And: I select a Good-to-know item icon`, async () => {
                goodToKnowItem.icon = await goodToKnowComponent.selectGoodToKnowItemIcon()
            });

            await test.step(`And: I fill out Good-to-know item link`, async () => {
                goodToKnowItem.link = await sharedSteps.pickComponentLink('Good to know item')

            });

            await test.step(`And: I click 'Create' button for Good-to-know item`, async () => {
                await goodToKnowComponent.clickSubmitGoodToKnowItem()
            });

            goodToKnowItems.push(goodToKnowItem)
        }

        await test.step(`And: I click 'Create' button for Good-to-know component
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
            await goodToKnowComponent.validateGoodToKnowAvailability(newPage, goodToKnowItems, rteContent)

        });

    })

})