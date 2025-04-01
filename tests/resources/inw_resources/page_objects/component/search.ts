import { type Page, type Locator, expect } from '@playwright/test';
import { BoundingBox } from '../../utilities/models';
import exp from 'constants';

export class SearchResultPage {
    readonly page: Page
    readonly searchProductTab: (product: string) => Locator;
    readonly searchBar: Locator
    readonly searchHolidayBtn: Locator
    readonly searchFldMobile: Locator
    readonly searchNoGuestsBtn: Locator
    readonly searchNoGuestHeader: Locator
    readonly searchNoGuestDoneBtn: Locator
    readonly minusButton: Locator
    readonly plusButton: Locator
    readonly numberValue: Locator
    readonly searchCriteriaBarResult: (criteria: string) => Locator
    readonly searchAccomodationCard: Locator
    readonly searchAccomodationCardImage: Locator
    readonly searchAccomodationViewHotelsBtn: Locator
    public initialBox: BoundingBox | null = null;

    constructor(page: Page) {
        this.page = page;
        this.searchProductTab = (product: string) => page.getByRole('button', { name: product, exact: true });
        this.searchBar = page.locator('.c-search-criteria-bar')
        this.searchHolidayBtn = page.getByRole('button', { name: 'Search holidays' })
        this.searchFldMobile = page.getByRole('button', { name: 'Search..' })
        this.searchNoGuestsBtn = page.locator('//button[@class="trip-search__option guests"]')
        this.searchNoGuestHeader = page.getByRole('heading', { name: 'Who\'s coming?' })
        this.minusButton = page.getByRole('button', { name: '-' })
        this.plusButton = page.getByRole('button', { name: '+' })
        this.numberValue = page.locator('//div[@class="number-range__value"]')
        this.searchCriteriaBarResult = (criteria: string) => page.getByText(criteria, { exact: true })
        this.searchNoGuestDoneBtn = page.getByRole('button', { name: 'Done' })
        this.searchAccomodationCard = page.locator('//div[@class="c-search-card c-card c-card-slider"]')
        this.searchAccomodationCardImage = page.locator('//div[@aria-labelledby="accomodation-images"]')
        this.searchAccomodationViewHotelsBtn = page.locator('.c-search-card--resorts-footer > .c-btn')
        this.initialBox = null
    }

    async validateSearchResultPageUrl() {
        await this.page.waitForLoadState('domcontentloaded')
        await expect(this.page, 'User successfully navigated to Search result page').toHaveURL(/.*search-results/);
    }

    async checkSearchBarAvailability() {
        await expect(this.searchBar, 'Search bar is available').toBeVisible();
        this.initialBox = await this.searchBar.boundingBox();
        expect(this.initialBox).not.toBeNull();
    }

    async scrollDown() {
        await this.page.evaluate(() => window.scrollBy(0, 300));
        await this.page.waitForTimeout(500);
    }

    async validateSearchBarTobeSticky() {
        const afterScrollBox = await this.searchBar.boundingBox();
        expect(afterScrollBox).not.toBeNull();
        expect(afterScrollBox!.y).toBe(this.initialBox!.y);
    }

    async checkCriteriaBarContent(content: string) {
        await this.page.waitForLoadState('domcontentloaded')
        await this.page.waitForLoadState('load')
        await this.page.waitForTimeout(5000);
        expect(this.searchCriteriaBarResult(content)).toBeVisible({timeout: 30000});
    }

    async countAccommodationCards() {
        await this.page.waitForLoadState('domcontentloaded');
        await this.searchAccomodationCard.first().waitFor({ state: 'attached', timeout: 10000 });
        const cardCount = await this.searchAccomodationCard.count();
        console.log(`Initial count of accommodation cards: ${cardCount}`);
        expect(cardCount).toBeGreaterThan(0);
        expect(this.searchAccomodationCardImage.first()).toBeVisible({timeout: 30000});
    }

    async checkAccomodationPageCriteriaBar(content: string) {
        expect(this.searchAccomodationViewHotelsBtn.first()).toBeVisible({timeout: 30000});
        await this.searchAccomodationViewHotelsBtn.first().click();

        const page2Promise = this.page.waitForEvent('popup');
        const page2 = await page2Promise;

        await page2.waitForLoadState('domcontentloaded')
        await page2.waitForTimeout(5000);
        await expect(page2.getByText(content, { exact: true })).toBeVisible({timeout: 30000});

        await page2.close();
    }

/////////////////Search Actions ///////////////////////

    async clickSearchProductTab(product: string = 'Ski') {
        await this.searchProductTab(product).isVisible();
        await this.searchProductTab(product).click();
    }
    
    async clickSearchHolidayBtn() {
        if (!(await this.searchHolidayBtn.isVisible())) {
            await this.searchFldMobile.click();
        }
        await this.searchHolidayBtn.click();
    }

    async setNumberOfGuests(targetNumber: number, maxAttempts = 20){
        await this.searchNoGuestsBtn.isVisible();
        await this.searchNoGuestsBtn.isEnabled();
        await this.searchNoGuestsBtn.click();
        await this.searchNoGuestHeader.waitFor({ state: 'visible' });

        let attempts = 0;
        
        while (attempts < maxAttempts) {
            // Get the current value
            await this.numberValue.waitFor({ state: 'visible' });
            const currentText = await this.numberValue.innerText();
            const currentValue = parseInt(currentText.trim(), 10);
            
            // Exit if we've reached the target value
            if (currentValue === targetNumber) {
                await this.searchNoGuestDoneBtn.click();
                return;
            }
            
            // Click the appropriate button based on comparison
            if (currentValue > targetNumber) {
                await this.minusButton.click();
            } else {
                await this.plusButton.click();
            }
            
            // Small wait to allow UI to update
            await this.page.waitForTimeout(100);
            attempts++;
        }
        
        throw new Error(`Failed to set value to ${targetNumber} after ${maxAttempts} attempts`);
    }

}


export default SearchResultPage
