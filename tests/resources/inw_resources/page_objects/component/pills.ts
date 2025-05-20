import { type Page, type Locator, expect } from '@playwright/test';
import environmentBaseUrl from '../../../../resources/utils/environmentBaseUrl';
import { faker } from '@faker-js/faker';

export class PillsComponent {
    readonly page: Page
    readonly pillLinkStyle: Locator
    readonly pillTitle: Locator
    readonly pillLink: Locator
    public pillTitleText: string
    public selectedPillStyle: string[]

    constructor(page: Page) {
        this.page = page;
        this.pillLinkStyle = page.locator('select[name="dropDownList"]').nth(2)
        this.pillTitle = page.locator('#title')
        this.pillLink = page.locator('#button_links')
        this.pillTitleText = faker.word.adjective() + ' ' + faker.word.noun() + ' Pills Automation ' + faker.number.int({ min: 50, max: 1000 })
    }

    async selectPillLinkStyle() {
        const randomIndex = Math.floor(Math.random() * 2) + 1;

        await this.pillLinkStyle.waitFor({ state: 'visible' })
        this.selectedPillStyle = await this.pillLinkStyle.selectOption({ index: randomIndex })
    }

    async fillOutPillTitle() {
        await this.pillTitle.fill(this.pillTitleText)

    }

    async clickAddPillLinkBtn() {
        await this.pillLink.click()

    }

    async validatePillAvailability(newPage, pillProperty) {
        const pillStyle = this.selectedPillStyle[0].split(':')[1]
        const expectedText = [this.pillTitleText, pillProperty.rteContent, pillProperty.linkTitle, pillProperty.ctaButtonLinkTitle]

        for (const text of expectedText) {
            await expect(newPage.locator('body')).toContainText(text);
        }

        if (pillStyle === 'Rectangle') {
            const actualPillStyle = await newPage.getByText(`${pillProperty.linkTitle}`).evaluate(node => node.parentElement?.parentElement?.className)
            expect(actualPillStyle?.includes('c-catblock'), "Pill Style is correct").toBeTruthy()

        } else if (pillStyle === 'Rounded') {
            const actualPillStyle = await newPage.getByText(`${pillProperty.linkTitle}`).evaluate(node => node.parentElement?.parentElement?.className)
            expect(actualPillStyle?.includes('c-oval-badges'), "Pill Style is correct").toBeTruthy()
        }

        const actualPillIcon = await newPage.getByText(`${pillProperty.linkTitle}`).evaluate(node => node.firstElementChild?.classList.value)
        expect(actualPillIcon?.includes(pillProperty.icon), "Pill Style is correct").toBeTruthy()

        await expect(newPage.getByText(`${pillProperty.linkTitle}`), "CTA Button link is correct").toHaveAttribute('href', environmentBaseUrl.googleLink.testLink)
        await expect(newPage.locator(`a[title="${pillProperty.ctaButtonLinkTitle}"]`), "CTA Button link is correct").toHaveAttribute('href', environmentBaseUrl.googleLink.testLink)

    }
}

export default PillsComponent