import { type Page, type Locator, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

export class HeadlineComponent {
    readonly page: Page
    readonly headlineTextFld: Locator
    readonly headlineDropdowns: Locator
    readonly headlineText: string
    public size: string[]
    public alignment: string[]

    constructor(page: Page) {
        this.page = page;
        this.headlineTextFld = page.getByRole('textbox', { name: 'Property alias:' })
        this.headlineText = `${faker.word.adjective()} ${faker.word.noun()} Automation Headline ${faker.number.int({ min: 50, max: 1000 })}`
        this.headlineDropdowns = page.locator('select[name="dropDownList"]')
    }

    async fillOutHeadlineDetails(component: string = 'none') {
        const sizeRandomIndex = Math.floor(Math.random() * 5) + 1;
        const alignmentRandomIndex = Math.floor(Math.random() * 3) + 1;
        const headlineForAccordionEntry = `${faker.word.adjective()} ${faker.word.noun()} Automation Headline ${faker.number.int({ min: 50, max: 1000 })}`

        if (component == 'accordion') {
            const headlineTextFldUnderAccordion = this.page.getByLabel('Text')
            await headlineTextFldUnderAccordion.waitFor({ state: 'visible' })
            await headlineTextFldUnderAccordion.fill(headlineForAccordionEntry)
        } else {
            await this.headlineTextFld.waitFor({ state: 'visible' })
            await this.headlineTextFld.fill(this.headlineText)
        }

        await this.headlineDropdowns.nth(2).click()
        this.size = await this.headlineDropdowns.nth(2).selectOption({ index: sizeRandomIndex })
        await this.headlineDropdowns.nth(3).click()
        this.alignment = await this.headlineDropdowns.nth(3).selectOption({ index: alignmentRandomIndex })

    }

    async validateHeadlineAvailability(newPage) {
        await expect(newPage.locator('body')).toContainText(this.headlineText);
        const updatedHeadlineText = this.headlineText.replace(/\s+/g, '').toLowerCase();
        const headlineId = newPage.locator(`#${updatedHeadlineText}`);

        const expectedSizeTag = this.size[0].replace(/.*string:(\w+).*/, '$1')
        const expectedAlignment = this.alignment[0].replace(/.*string:(\w+).*/, '$1').toLowerCase();
        const actualTagName = await headlineId.evaluate(node => node.tagName)
        const actualTextAlign = await headlineId.evaluate(node => window.getComputedStyle(node).textAlign)

        expect(actualTagName).toBe(expectedSizeTag);
        expect(actualTextAlign).toBe(expectedAlignment);
    }
}

export default HeadlineComponent