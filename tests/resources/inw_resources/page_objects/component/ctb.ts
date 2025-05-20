import { type Page, type Locator, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

export class CTBComponent {
    readonly page: Page
    readonly ctbTitle: Locator
    readonly ctbPhoneNumer: Locator
    readonly ctbLayout: Locator
    public ctaButtonTitle: string
    public ctaPhoneNumber: string
    public selectedLayout: string[]

    constructor(page: Page) {
        this.page = page;
        this.ctbTitle = page.locator('#title')
        this.ctbPhoneNumer = page.locator('#phoneNumber')
        this.ctbLayout = page.locator('select[name="dropDownList"]').nth(2)
        this.ctaButtonTitle = faker.word.adjective() + ' ' + faker.word.noun() + ' CTB Automation ' + faker.number.int({ min: 50, max: 1000 })
        this.ctaPhoneNumber = faker.phone.number({ style: 'national' })
    }

    async fillOutCTBTitle() {
        await this.ctbTitle.waitFor({ state: 'visible' })
        await this.ctbTitle.fill(this.ctaButtonTitle)
    }

    async fillOutCTBPhoneNumber() {
        await this.ctbPhoneNumer.fill(this.ctaPhoneNumber)
    }

    async selectCTBLayout() {
        const layoutRandomIndex = Math.floor(Math.random() * 2) + 1;
        await this.ctbLayout.click()
        this.selectedLayout = await this.ctbLayout.selectOption({ index: layoutRandomIndex })
    }

    async validateCtaButtonAvailability(newPage, rteContent) {
        const ctbLayout = this.selectedLayout[0].split(':')[1]
        await expect(newPage.locator('body')).toContainText(this.ctaButtonTitle);

        if (ctbLayout === 'Standard') {
            await expect(newPage.locator('body')).toContainText(rteContent);
            const actualCtbLayout = await newPage.getByText(`${this.ctaButtonTitle}`).evaluate(node => node.className)
            expect(actualCtbLayout.includes('standard'), "CTB Layout is correct").toBeTruthy()

        } else if (ctbLayout === 'Compact') {
            const actualCtbLayout = await newPage.getByText(`${this.ctaButtonTitle}`).evaluate(node => node.className)
            expect(actualCtbLayout.includes('mini'), "CTB Layout is correct").toBeTruthy()
        }

        await expect(newPage.locator('body')).toContainText(this.ctaPhoneNumber);
        const actualCtbPhoneIcon = await newPage.getByText(`${this.ctaPhoneNumber}`).evaluate(node => node.parentElement?.previousElementSibling?.classList.value)
        expect(actualCtbPhoneIcon?.includes('icon-phone-outlined'), "CTB Phone icon is correct").toBeTruthy()

    }

}

export default CTBComponent