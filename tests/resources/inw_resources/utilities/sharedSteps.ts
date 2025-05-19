import { type Page, type Locator, expect, FrameLocator } from '@playwright/test';
import environmentBaseUrl from '../../../resources/utils/environmentBaseUrl';
import { faker } from '@faker-js/faker';

export class SharedSteps {
    readonly page: Page
    readonly globalSearch: Locator
    readonly globalSearchInput: Locator
    readonly globalSearchFirstResult: Locator
    readonly contentTab: Locator
    readonly addContentBtn: Locator
    readonly searchComponentFld: Locator
    readonly componentRes: Locator
    readonly createComponentBtn: Locator
    readonly saveAndPublishBtn: Locator
    readonly publishNotification: Locator
    readonly infoTab: Locator
    readonly pageLink: Locator
    readonly genericContentPage: string
    readonly rteFrame: FrameLocator
    readonly rteParagraph: Locator
    readonly urlPickerBtn: Locator
    readonly linkField: Locator
    readonly linkTitleFld: Locator
    readonly urlPickerSubmitBtn: Locator
    readonly pillLinkSubmitBtn: Locator
    readonly iconPickerBtn: Locator
    readonly iconPickerItem: Locator

    constructor(page: Page) {
        this.page = page;
        this.globalSearch = page.locator(`//*[@data-element='global-search']`);
        this.globalSearchInput = page.getByPlaceholder('Type to search...')
        this.globalSearchFirstResult = page.locator('.umb-search-item').first()
        this.addContentBtn = page.getByRole('button', { name: 'Add content' })
        this.searchComponentFld = page.locator('#block-search')
        this.componentRes = page.locator('umb-block-card')
        this.contentTab = page.getByRole('tab', { name: 'Content', exact: true })
        this.createComponentBtn = page.locator('.btn-primary')
        this.saveAndPublishBtn = page.locator('[data-element="button-saveAndPublish"]')
        this.infoTab = page.locator('[data-element="sub-view-umbInfo"]')
        this.pageLink = page.locator('[icon="icon-out"]')
        this.publishNotification = page.locator('.umb-notifications__notifications > li')
        this.rteFrame = page.frameLocator('[title="Rich Text Area"]');
        this.rteParagraph = this.rteFrame.locator('#tinymce');
        this.urlPickerBtn = page.getByRole('button', { name: 'Url Picker: Add url' })
        this.linkField = page.locator('#urlLinkPicker')
        this.linkTitleFld = page.locator('#nodeNameLinkPicker')
        this.urlPickerSubmitBtn = page.locator('.btn-success').last()
        this.pillLinkSubmitBtn = page.locator('.btn-primary').last()
        this.iconPickerBtn = page.locator('[data-element="sortable-thumbnails"]')
        this.iconPickerItem = page.locator('.umb-iconpicker-item')

        //The location of the Generic Content Page name can be placed in a separate file.
        this.genericContentPage = 'Automation SKI Components'
    }

    async searchAndSelectGenericContentPage() {
        await this.globalSearch.waitFor({ state: 'visible' })
        await this.globalSearch.click()
        await this.globalSearchInput.fill(this.genericContentPage)
        await this.globalSearchInput.press('Enter')
        await expect(this.globalSearchFirstResult).toBeVisible()
        await this.globalSearchFirstResult.click()
    }

    async clickContentTab() {
        await this.contentTab.waitFor({ state: 'visible' })
        await this.contentTab.click()
    }

    async clickAddContentBtn() {
        await this.addContentBtn.waitFor({ state: 'visible' })
        await this.addContentBtn.click()
    }

    async searchComponent(component: string) {
        await this.searchComponentFld.pressSequentially(component)
    }

    async selectComponent() {
        await this.componentRes.waitFor({ state: 'visible' })
        await this.componentRes.click()
    }

    async clickCreateBtn(locator: number = 0) {
        if (locator == 1) {
            //for some reason, the locator .btn primary is not working so we need to use nth(0) to select
            const createComponentBtnOtherLocator = this.page.locator('.btn-primary').nth(0)
            await createComponentBtnOtherLocator.click()
        } else {
            await this.createComponentBtn.waitFor({ state: 'visible' })
            await this.createComponentBtn.click()
        }

    }
    async clickSaveAndPublishBtn() {
        await this.saveAndPublishBtn.waitFor({ state: 'visible' })
        await this.saveAndPublishBtn.click()
        await this.publishNotification.waitFor({ state: 'visible' })

        await expect(this.publishNotification).toHaveCount(1)
    }

    async clickInfoTab() {
        await this.infoTab.waitFor({ state: 'visible' })
        await this.infoTab.click()
    }

    async clickPageLink() {
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.pageLink.click()
        ]);

        await newPage.waitForLoadState('domcontentloaded')
        await newPage.bringToFront()

        return newPage
    }

    async validatePageUrl(newPage) {
        const formattedUrlPart = this.genericContentPage.replace(/\s+/g, '-').toLowerCase();
        await expect(newPage).toHaveURL(new RegExp(`.*${formattedUrlPart}`));
    }

    async fillOutRTETextEditor(component: string = 'common') {
        //Rich text content is initialized here to meet test cases that require unique input.
        const richTextContent = faker.lorem.paragraph()

        if (component == 'Good to know item') {
            const goodToKnowItemDescription = faker.word.adjective() + ' ' + faker.word.noun() + ' Item Description Automation ' + faker.number.int({ min: 50, max: 1000 })
            await this.page.locator('iframe').nth(1).contentFrame().locator('#tinymce').fill(goodToKnowItemDescription)
            return goodToKnowItemDescription
        } else {
            await this.rteParagraph.waitFor({ state: 'visible' })
            await this.rteParagraph.fill(richTextContent);

            return richTextContent

        }
    }

    async pickComponentLink(component: string = 'common') {
        if (component == 'Good to know item') {
            const goodToKnowLinkTitle = faker.word.noun() + ' Good to know Link ' + faker.number.int({ min: 50, max: 1000 })

            await this.page.locator('button[ng-click="openLinkPicker()"]').click()
            await this.linkField.waitFor({ state: 'visible' })
            await this.linkField.fill(environmentBaseUrl.googleLink.testLink)
            await this.linkTitleFld.fill(goodToKnowLinkTitle)
            await this.urlPickerSubmitBtn.click()
            
            return goodToKnowLinkTitle

        } else if (component == 'Pills') {
            const pillLinkTitle = faker.word.noun() + ' Pill Link ' + faker.number.int({ min: 50, max: 1000 })
            await this.page.locator('button[ng-click="openLinkPicker()"]').nth(1).click()
            await this.linkField.waitFor({ state: 'visible' })
            await this.linkField.fill(environmentBaseUrl.googleLink.testLink)
            await this.linkTitleFld.fill(pillLinkTitle)
            await this.urlPickerSubmitBtn.click()
            await this.pillLinkSubmitBtn.click()

            return pillLinkTitle

        } else if (component == 'CTA Button') {
            const ctaButtonTitle = faker.word.adjective() + ' ' + faker.word.noun() + ' CTA Button Automation ' + faker.number.int({ min: 50, max: 1000 })
            await this.urlPickerBtn.click()
            await this.linkField.waitFor({ state: 'visible' })
            await this.linkField.fill(environmentBaseUrl.googleLink.testLink)
            await this.linkTitleFld.fill(ctaButtonTitle)
            await this.urlPickerSubmitBtn.click()

            return ctaButtonTitle
        } else if (component == 'Pill CTA Button') {
            const ctaButtonTitle = faker.word.adjective() + ' ' + faker.word.noun() + ' Button ' + faker.number.int({ min: 50, max: 1000 })

            await this.page.getByRole('button', { name: 'View All CTA Button: Add url' }).click()
            await this.linkField.waitFor({ state: 'visible' })
            await this.linkField.fill(environmentBaseUrl.googleLink.testLink)
            await this.linkTitleFld.fill(ctaButtonTitle)
            await this.urlPickerSubmitBtn.click()

            return ctaButtonTitle
        }

        return '';
    }

    async selectComponentIcon() {
        await this.iconPickerBtn.click()
        await expect(this.iconPickerItem.nth(0)).toBeVisible()

        const iconPickerItemCount = await this.iconPickerItem.count()
        const iconItemIndex = Math.floor(Math.random() * iconPickerItemCount)
        const iconName = await this.iconPickerItem.nth(iconItemIndex).locator('a').getAttribute('title')
        await this.iconPickerItem.nth(iconItemIndex).click()

        return iconName
    }
}

export default SharedSteps