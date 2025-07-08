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
        await this.goodToKnowTitle.waitFor({ state: 'visible', timeout: 10000 })
        await this.goodToKnowTitle.waitFor({ state: 'attached' })
        await this.goodToKnowTitle.fill(this.goodToKnowTitleText)
        
        // Verify the text was entered correctly
        await expect(this.goodToKnowTitle).toHaveValue(this.goodToKnowTitleText)
    }

    async clickGoodToKnowItemBtn() {
        await this.goodToKnowItemBtn.waitFor({ state: 'visible', timeout: 10000 })
        await this.goodToKnowItemBtn.waitFor({ state: 'attached' })
        await this.goodToKnowItemBtn.click()
        
        // Wait for the form to be ready for input
        await this.page.waitForTimeout(500)
    }

    async fillOutGoodToKnowItemTitle() {
        const goodToKnowItemTitle = faker.word.adjective() + ' ' + faker.word.noun() + ' Title ' + faker.number.int({ min: 50, max: 1000 })
        await this.goodToKnowTitle.nth(1).waitFor({ state: 'visible', timeout: 10000 })
        await this.goodToKnowTitle.nth(1).waitFor({ state: 'attached' })
        await this.goodToKnowTitle.nth(1).fill(goodToKnowItemTitle)
        
        // Verify the text was entered correctly
        await expect(this.goodToKnowTitle.nth(1)).toHaveValue(goodToKnowItemTitle)

        return goodToKnowItemTitle
    }

    async clickSubmitGoodToKnowItem() {
        await this.submitGoodToKnowItem.waitFor({ state: 'visible', timeout: 10000 })
        await this.submitGoodToKnowItem.waitFor({ state: 'attached' })
        await this.submitGoodToKnowItem.click()
        
        // Wait for the item to be created and form to be ready
        await this.page.waitForTimeout(1000)
    }

    async validateGoodToKnowAvailability(newPage = this.page, goodToKnowDetails, rteContent) {
        // Wait for page to be fully loaded
        await newPage.waitForLoadState('networkidle', { timeout: 30000 })
        
        // Wait for the main content to be visible
        await newPage.locator('body').waitFor({ state: 'visible', timeout: 10000 })
        
        // Validate main content with retry logic
        await expect(newPage.locator('body')).toContainText(this.goodToKnowTitleText, { timeout: 15000 });
        await expect(newPage.locator('body')).toContainText(rteContent, { timeout: 15000 });

        for (const goodToKnowItem of goodToKnowDetails) {
            try {
                // Wait for the item to be visible before validating
                await newPage.getByText(goodToKnowItem.title).waitFor({ state: 'visible', timeout: 10000 })
                
                const actualIcon = await newPage.getByText(goodToKnowItem.title).evaluate(node => node.parentElement?.previousElementSibling?.querySelector('svg')?.classList.value)
                const actualTitleAlignment = await newPage.getByText(goodToKnowItem.title).evaluate(node => window.getComputedStyle(node).textAlign)
                const actualDescription = await newPage.getByText(goodToKnowItem.description).evaluate(node => window.getComputedStyle(node).textAlign)
                const actualLink = await newPage.getByText(goodToKnowItem.link).evaluate(node => node.getAttribute('href'))

                expect(actualIcon?.includes(goodToKnowItem.icon), `Good to know Icon is correct for item: ${goodToKnowItem.title}`).toBeTruthy()
                expect(actualTitleAlignment?.includes('center'), `Good to know Title Alignment is correct for item: ${goodToKnowItem.title}`).toBeTruthy()
                expect(actualDescription?.includes('center'), `Good to know Description Alignment is correct for item: ${goodToKnowItem.title}`).toBeTruthy()
                expect(actualLink?.includes(environmentBaseUrl.googleLink.testLink), `Good to know Link is correct for item: ${goodToKnowItem.title}`).toBeTruthy()
                
            } catch (error) {
                console.error(`Error validating Good to Know item: ${goodToKnowItem.title}`, error)
                throw error
            }
        }
    }
}

export default GoodToKnowComponent