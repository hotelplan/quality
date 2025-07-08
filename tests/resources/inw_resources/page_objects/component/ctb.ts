import { type Page, type Locator, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

export class CTBComponent {
    readonly page: Page
    readonly ctbTitle: Locator
    readonly ctbPhoneNumer: Locator
    readonly ctbLayout: Locator
    readonly telephonNumberFld: Locator
    public ctbTitleData: string
    public ctaPhoneNumber: string
    public telephoneNumberFromContactSection: string
    public selectedLayout: string[]

    constructor(page: Page) {
        this.page = page;
        this.ctbTitle = page.locator('#title')
        this.ctbPhoneNumer = page.locator('#phoneNumber')
        this.ctbLayout = page.locator('select[name="dropDownList"]').nth(2)
        this.ctbTitleData = faker.word.adjective() + ' ' + faker.word.noun() + ' CTB Automation ' + faker.number.int({ min: 50, max: 1000 })
        this.ctaPhoneNumber = faker.phone.number({ style: 'national' })
        this.telephonNumberFld = page.locator('#telephoneNumber')
    }

    async fillOutCTBTitle() {
        await this.ctbTitle.waitFor({ state: 'visible' })
        await this.ctbTitle.fill(this.ctbTitleData)
    }

    async fillOutCTBPhoneNumber() {
        await this.ctbPhoneNumer.fill(this.ctaPhoneNumber)
    }

    async getCTBPhoneNumber() {
        await this.telephonNumberFld.waitFor({ state: 'visible' })
        this.telephoneNumberFromContactSection = await this.telephonNumberFld.inputValue()

        return this.telephoneNumberFromContactSection
    }

    async selectCTBLayout() {
        const layoutRandomIndex = Math.floor(Math.random() * 2) + 1;
        await this.ctbLayout.click()
        this.selectedLayout = await this.ctbLayout.selectOption({ index: layoutRandomIndex })
    }

    async validateCtbButtonAvailability(newPage, rteContent) {
        let actualCtbPhoneIcon: any
        const ctbLayout = this.selectedLayout[0].split(':')[1]
        expect(await newPage.getByText(this.ctbTitleData).isVisible(), "CTB Title is visible").toBeTruthy();

        if (ctbLayout === 'Standard') {
            await expect(newPage.locator('body')).toContainText(rteContent);
            const actualCtbLayout = await newPage.getByText(`${this.ctbTitleData}`).evaluate(node => node.className)
            expect(actualCtbLayout.includes('title'), "CTB Layout is correct").toBeTruthy()
            actualCtbPhoneIcon = await newPage.getByText(`${this.telephoneNumberFromContactSection}`).locator('svg[title="Dropdown"]').evaluate(node => node.classList.value)


        } else if (ctbLayout === 'Compact') {
            const actualCtbLayout = await newPage.getByText(`${this.ctbTitleData}`).evaluate(node => node.className)
            expect(actualCtbLayout.includes('leftContent'), "CTB Layout is correct").toBeTruthy()

            actualCtbPhoneIcon = await newPage.getByText(`${this.telephoneNumberFromContactSection}`).nth(2).evaluate(node => node.previousElementSibling.classList.value)
        }

        expect(await actualCtbPhoneIcon?.includes('icon-phone-outlined'), "CTB Phone icon is correct").toBeTruthy()
    }

}

export default CTBComponent