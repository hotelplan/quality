import { type Page, type Locator, expect } from '@playwright/test';
import environmentBaseUrl from '../../../../resources/utils/environmentBaseUrl';
import { faker } from '@faker-js/faker';

export class PillsComponent {
    readonly page: Page
    readonly pillLinkStyle: Locator
    readonly pillTitle: Locator
    readonly pillDescription: Locator
    readonly pillLink: Locator
    readonly pillLinkIcon: Locator
    readonly iconPickerItem: Locator
    readonly pillCtaBtn: Locator
    readonly pillLinkSubmitBtn: Locator
    readonly pillSubmitBtn: Locator
    readonly linkField: Locator
    readonly linkTitleFld: Locator
    readonly urlPickerSubmitBtn: Locator

    public iconName: string | null


    constructor(page: Page) {
        this.page = page;
        this.pillLinkStyle = page.locator('select[name="dropDownList"]').nth(2)
        this.pillTitle = page.locator('#title')
        this.pillDescription = page.locator('iframe').contentFrame().locator('#tinymce');
        this.pillLink = page.locator('#button_links')
        this.pillLinkIcon = page.locator('.add-link')
        this.iconPickerItem = page.locator('.umb-iconpicker-item')
        this.linkTitleFld = page.locator('#nodeNameLinkPicker')
        this.urlPickerSubmitBtn = page.locator('.btn-success').last()
        this.pillLinkSubmitBtn = page.locator('.btn-primary').last()
        this.pillCtaBtn = page.locator('button[ng-click="openLinkPicker()"]')
        this.linkField = page.locator('#urlLinkPicker')

    }

    async setupPillsComponent() {
        const randomIndex = Math.floor(Math.random() * 2) + 1;

        await this.pillLinkStyle.waitFor({ state: 'visible' })
        await this.pillLinkStyle.selectOption({ index: randomIndex })
        await this.pillTitle.fill(faker.word.adjective() + ' ' + faker.word.noun() + ' Pills Automation ' + faker.number.int({ min: 50, max: 1000 }))
        await this.pillLink.click()
        await this.pillLinkIcon.click()
        await expect(this.iconPickerItem.nth(0)).toBeVisible()

        const iconPickerItemCount = await this.iconPickerItem.count()
        const iconItemIndex = Math.floor(Math.random() * iconPickerItemCount)
        this.iconName = await this.iconPickerItem.nth(iconItemIndex).locator('a').getAttribute('title')
        await this.iconPickerItem.nth(iconItemIndex).click()
        await this.pillCtaBtn.nth(1).click()
        await this.linkField.fill(environmentBaseUrl.googleLink.testLink)
        await this.linkTitleFld.fill(faker.word.adjective() + ' ' + faker.word.noun() + ' Pills Link Automation ' + faker.number.int({ min: 50, max: 1000 }))
        await this.urlPickerSubmitBtn.click()
        await this.pillLinkSubmitBtn.click()
        await this.pillDescription.fill(faker.lorem.paragraph())

    }

    async validatePillAvailability(page) {

    }
}

export default PillsComponent