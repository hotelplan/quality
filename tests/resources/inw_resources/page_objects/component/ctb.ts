import { type Page, type Locator, expect } from '@playwright/test';
import environmentBaseUrl from '../../../utils/environmentBaseUrl';
import { faker } from '@faker-js/faker';

export class CTBComponent {
    readonly page: Page
    readonly ctbTitle: Locator
    readonly ctbPhoneNumer: Locator
    readonly ctbLayout: Locator
    readonly ctbDescription: Locator
    public ctaButtonTitle: string
    public ctaPhoneNumber: string
    public ctbDescriptionText: string
    public selectedLayout: string[]

    constructor(page: Page) {
        this.page = page;
        this.ctbTitle = page.locator('#title')
        this.ctbPhoneNumer = page.locator('#phoneNumber')
        this.ctbLayout = page.locator('select[name="dropDownList"]').nth(2)
        this.ctbDescription = page.locator('iframe').contentFrame().locator('#tinymce');
        this.ctaButtonTitle = faker.word.adjective() + ' ' + faker.word.noun() + ' CTB Automation ' + faker.number.int({ min: 50, max: 1000 })
        this.ctaPhoneNumber = faker.phone.number({ style: 'national' })
        this.ctbDescriptionText = faker.lorem.paragraph()
    }

    async setupCtB() {
        const layoutRandomIndex = Math.floor(Math.random() * 2) + 1;

        await this.ctbTitle.waitFor({ state: 'visible' })
        await this.ctbTitle.fill(this.ctaButtonTitle)
        await this.ctbPhoneNumer.fill(this.ctaPhoneNumber)
        await this.ctbLayout.click()
        this.selectedLayout = await this.ctbLayout.selectOption({ index: layoutRandomIndex })
        await this.ctbDescription.fill(this.ctbDescriptionText)
    }

    async validateCtaButtonAvailability(newPage) {

    }

}

export default CTBComponent