import { type Page, type Locator, expect } from '@playwright/test';

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
}

export default SharedSteps