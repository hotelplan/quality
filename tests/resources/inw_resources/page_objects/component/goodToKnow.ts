import { type Page, type Locator, expect } from '@playwright/test';
import environmentBaseUrl from '../../../utils/environmentBaseUrl';
import { faker } from '@faker-js/faker';

export class GoodToKnowComponent {
    readonly page: Page
    readonly goodToKnowTitle: Locator
    readonly goodToKnowItemBtn: Locator
    readonly submitGoodToKnowItem: Locator
    public goodToKnowTitleText: string = faker.word.adjective() + ' ' + faker.word.noun() + ' Automation ' + faker.number.int({ min: 50, max: 1000 })

    constructor(page: Page) {
        this.page = page;
        this.goodToKnowTitle = page.locator('#title')
        this.goodToKnowItemBtn = page.locator('#button_iconText')
        this.submitGoodToKnowItem = page.locator('.btn-primary').last()
    }

    async fillOutGoodToKnowTitle() {
        await this.goodToKnowTitle.waitFor({ state: 'visible' })
        await this.goodToKnowTitle.fill(this.goodToKnowTitleText)
    }

    async clickGoodToKnowItemBtn() {
        await this.goodToKnowItemBtn.click()
    }

    async fillOutGoodToKnowItemTitle() {
        const goodToKnowItemTitle = faker.word.adjective() + ' ' + faker.word.noun() + ' Title ' + faker.number.int({ min: 50, max: 1000 })
        await this.goodToKnowTitle.nth(1).waitFor({ state: 'visible' })
        await this.goodToKnowTitle.nth(1).fill(goodToKnowItemTitle)

        return goodToKnowItemTitle
    }

    async clickSubmitGoodToKnowItem() {
        await this.submitGoodToKnowItem.click()
    }

    async validateGoodToKnowAvailability(newPage = this.page, goodToKnowDetails, rteContent) {
        await expect(newPage.locator('body')).toContainText(this.goodToKnowTitleText);
        await expect(newPage.locator('body')).toContainText(rteContent);

        for (const goodToKnowItem of goodToKnowDetails) {
            const actualIcon = await newPage.getByText(goodToKnowItem.title).evaluate(node => node.parentElement?.previousElementSibling?.classList.value)
            const actualTitleAlignment = await newPage.getByText(goodToKnowItem.title).evaluate(node => node.className)
            const actualDescription = await newPage.getByText(goodToKnowItem.description).evaluate(node => node.parentElement?.className)
            const actualLink = await newPage.getByText(goodToKnowItem.link).evaluate(node => node.parentElement?.getAttribute('href'))


            expect(actualIcon?.includes(goodToKnowItem.icon), "Good to know Icon is correct").toBeTruthy()
            expect(actualTitleAlignment?.includes('center'), "Good to know Title Alignment is correct").toBeTruthy()
            expect(actualDescription?.includes('center'), "Good to know Description Alignment is correct").toBeTruthy()
            expect(actualLink?.includes(environmentBaseUrl.googleLink.testLink), "Good to know Link is correct").toBeTruthy()

        }
    }
}

export default GoodToKnowComponent