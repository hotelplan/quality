import { type Page, type Locator, expect } from '@playwright/test';
import environmentBaseUrl from '../../../utils/environmentBaseUrl';
import { faker } from '@faker-js/faker';

export class GoodToKnowComponent {
    readonly page: Page
    readonly goodToKnowTitle: Locator
    readonly goodToKnowDescription: Locator
    readonly goodToKnowItemBtn: Locator
    readonly iconPickerItem: Locator
    readonly linkPicker: Locator
    readonly linkField: Locator
    readonly linkTitleFld: Locator
    readonly urlPickerSubmitBtn: Locator
    readonly iconPickerBtn: Locator
    readonly submitGoodToKnowItem: Locator
    public goodToKnowTitleText: string = faker.word.adjective() + ' ' + faker.word.noun() + ' Automation ' + faker.number.int({ min: 50, max: 1000 })
    public goodToKnowDescriptionText: string = faker.lorem.paragraph()
    public iconName: string | null

    constructor(page: Page) {
        this.page = page;
        this.goodToKnowTitle = page.locator('#title')
        this.goodToKnowDescription = page.locator('iframe').contentFrame().locator('#tinymce');
        this.goodToKnowItemBtn = page.locator('#button_iconText')
        this.iconPickerItem = page.locator('.umb-iconpicker-item')
        this.linkPicker = page.locator('button[ng-click="openLinkPicker()"]')
        this.linkField = page.locator('#urlLinkPicker')
        this.linkTitleFld = page.locator('#nodeNameLinkPicker')
        this.urlPickerSubmitBtn = page.locator('.btn-success').last()
        this.submitGoodToKnowItem = page.locator('.btn-primary').last()
        this.iconPickerBtn = page.locator('.add-link')
    }

    async fillOutGoodToKnowTitle() {
        await this.goodToKnowTitle.waitFor({ state: 'visible' })
        await this.goodToKnowTitle.fill(this.goodToKnowTitleText)
    }

    async fillOutGoodToKnowDescription() {
        await this.goodToKnowDescription.waitFor({ state: 'visible' })
        await this.goodToKnowDescription.fill(this.goodToKnowDescriptionText)
    }

    async clickGoodToKnowItemBtn() {
        await this.goodToKnowItemBtn.click()
    }

    async selectGoodToKnowItemIcon() {
        await this.iconPickerBtn.click()
        await expect(this.iconPickerItem.nth(0)).toBeVisible()
        const iconPickerItemCount = await this.iconPickerItem.count()
        const iconItemIndex = Math.floor(Math.random() * iconPickerItemCount)
        this.iconName = await this.iconPickerItem.nth(iconItemIndex).locator('a').getAttribute('title')
        await this.iconPickerItem.nth(iconItemIndex).click()
    }

    async fillOutGoodToKnowItemTitle() {
        const goodToKnowItemTitle = faker.word.adjective() + ' ' + faker.word.noun() + ' Title ' + faker.number.int({ min: 50, max: 1000 })
        await this.goodToKnowTitle.nth(1).waitFor({ state: 'visible' })
        await this.goodToKnowTitle.nth(1).fill(goodToKnowItemTitle)
    }

    async fillOutGoodToKnowItemDescription() {
        const goodToKnowItemDescription = faker.word.adjective() + ' ' + faker.word.noun() + ' Item Description Automation ' + faker.number.int({ min: 50, max: 1000 })
        await this.page.locator('iframe').nth(1).contentFrame().locator('#tinymce').fill(goodToKnowItemDescription)
    }

    async fillOutGoodToKnowItemLink() {
        const goodToKnowLinkTitle = faker.word.noun() + ' Good to know Link ' + faker.number.int({ min: 50, max: 1000 })
        await this.linkPicker.click()
        await this.linkField.waitFor({ state: 'visible' })
        await this.linkField.fill(environmentBaseUrl.googleLink.testLink)
        await this.linkTitleFld.fill(goodToKnowLinkTitle)
        await this.urlPickerSubmitBtn.click()
    }

    async clickSubmitGoodToKnowItem() {
        await this.submitGoodToKnowItem.click()
    }

    async validateGoodToKnowAvailability(newPage) {
        await expect(newPage.locator('body')).toContainText(this.goodToKnowTitleText);
        await expect(newPage.locator('body')).toContainText(this.goodToKnowDescriptionText);

    }
}

export default GoodToKnowComponent