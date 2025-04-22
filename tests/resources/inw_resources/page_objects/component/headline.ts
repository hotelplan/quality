import { type Page, type Locator, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

export class HeadlineComponent {
    readonly page: Page
    readonly headlineTextFld: Locator
    readonly headlineDropdowns: Locator
    readonly headlineText: string

    constructor(page: Page) {
        this.page = page;
        this.headlineTextFld = page.getByRole('textbox', { name: 'Property alias:' })
        this.headlineText = `Automation Headline ${faker.number.int({ min: 50, max: 1000 })}`
        this.headlineDropdowns = page.locator('select[name="dropDownList"]')
    }

    async fillOutHeadlineDetails(){
        await this.headlineTextFld.waitFor({ state: 'visible' })
        await this.headlineTextFld.fill(this.headlineText)
        await this.headlineDropdowns.nth(2).click()
        await this.headlineDropdowns.nth(2).selectOption({ index: 1 })
        await this.headlineDropdowns.nth(3).click()
        await this.headlineDropdowns.nth(3).selectOption({ index: 1 })
    }

    async validateHeadlineAvailability(newPage) {
        await expect(newPage.locator('body')).toContainText(this.headlineText);
    }
}

export default HeadlineComponent