import { type Page, type Locator, expect } from '@playwright/test';
import { BoundingBox } from '../../utilities/models';
import exp from 'constants';

export class SearchResultPage {
    readonly page: Page
    readonly searchProductTab: (product: string) => Locator;
    readonly searchBar: Locator
    readonly searchHolidayBtn: Locator
    readonly searchFldMobile: Locator
    readonly searchAnywhereBtn: Locator
    readonly searchWhereToGofield: Locator
    readonly searchWhereToGoResult: (location: string) => Locator;
    readonly searchWhereToGoAltResult: (location: string) => Locator;

    readonly searchNoGuestsBtn: Locator
    readonly searchNoGuestHeader: Locator
    readonly searchNoGuestDoneBtn: Locator
    readonly minusButton: Locator
    readonly plusButton: Locator
    readonly numberValue: Locator
    readonly addChildButton: Locator
    readonly childAgeSelections: Locator
    readonly searchCriteriaBarResult: (context: any) => Locator
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
        this.searchAnywhereBtn = page.getByRole('button', { name: 'Anywhere' })
        this.searchWhereToGofield = page.getByRole('textbox', { name: 'Start typing..' })
        this.searchWhereToGoResult = (location: string) => page.locator('span').filter({ hasText: location });
        this.searchWhereToGoAltResult = (location: string) => page.getByText(location, { exact: true });

        this.searchNoGuestsBtn = page.locator('//button[@class="trip-search__option guests"]')
        this.searchNoGuestHeader = page.getByRole('heading', { name: 'Who\'s coming?' })
        this.minusButton = page.getByRole('button', { name: '-', exact: true })
        this.plusButton = page.getByRole('button', { name: '+', exact: true })
        this.numberValue = page.locator('//div[@class="number-range__value"]')
        this.addChildButton = page.getByRole('button', { name: 'Add a child' })
        this.childAgeSelections = page.locator('//datalist[@id="childSelectList"]/option')
        this.searchCriteriaBarResult = (context: any) => context.locator('//div[@class="c-search-criteria-bar__price-basis"]')
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
        expect(this.searchCriteriaBarResult(this.page)).toBeVisible({timeout: 30000});
        expect(this.searchCriteriaBarResult(this.page)).toContainText(content, {timeout: 30000});
    }

    async countAccommodationCards() {
        await this.page.waitForLoadState('domcontentloaded');
        await this.searchAccomodationCard.first().waitFor({ state: 'attached', timeout: 10000 });
        const cardCount = await this.searchAccomodationCard.count();
        console.log(`Initial count of accommodation cards: ${cardCount}`);
        expect(cardCount).toBeGreaterThan(0);
        expect(this.searchAccomodationCardImage.first()).toBeVisible({timeout: 30000});
    }

    async opentAccommodationCards() {
        expect(this.searchAccomodationViewHotelsBtn.first()).toBeVisible({timeout: 30000});
        await this.searchAccomodationViewHotelsBtn.first().click();

        const page2Promise = this.page.waitForEvent('popup');
        const page2 = await page2Promise;

        return page2;
    }

    async checkAccomodationPageCriteriaBar(context: any, content: string) {
        await context.waitForLoadState('domcontentloaded')
        await context.waitForTimeout(5000);
        expect(this.searchCriteriaBarResult(context)).toBeVisible({timeout: 30000});
        expect(this.searchCriteriaBarResult(context)).toContainText(content, {timeout: 30000});
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

    async setNumberOfGuests(targetNumber: number, numberOfChildren: number = 0, maxAttempts = 20){
        await this.searchNoGuestsBtn.isVisible();
        await this.searchNoGuestsBtn.isEnabled();
        await this.searchNoGuestsBtn.click();
        await this.searchNoGuestHeader.waitFor({ state: 'visible' });
  
        let attempts = 0;
        
        // Set number of adult guests
        while (attempts < maxAttempts) {
            // Get the current value
            await this.numberValue.waitFor({ state: 'visible' });
            const currentText = await this.numberValue.innerText();
            const currentValue = parseInt(currentText.trim(), 10);
            
            // Exit if we've reached the target value
            if (currentValue === targetNumber) {
                break; // Don't click Done yet, as we might need to add children
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
            
            if (attempts >= maxAttempts) {
                throw new Error(`Failed to set adult count to ${targetNumber} after ${maxAttempts} attempts`);
            }
        }
        
        // Add children if specified
        if (numberOfChildren > 0) {
            for (let i = 0; i < numberOfChildren; i++) {
                await this.addChildButton.click();
                await this.page.waitForTimeout(300); // Wait for UI to update
                
                // Select a random age between 0-15 for each child
                const ageOptions = await this.childAgeSelections.count();
                if (ageOptions > 0) {
                    // Get a random index between 0 and min(17, available options)
                    const randomIndex = Math.floor(Math.random() * Math.min(18, ageOptions));
                    await this.childAgeSelections.nth(randomIndex).click();
                }
            }
        }
        
        // Click Done after setting both adults and children
        await this.searchNoGuestDoneBtn.click();
    }

    async searchAnywhere(location: string){
        await this.searchAnywhereBtn.click();
        await expect(this.searchWhereToGofield).toBeVisible({timeout: 30000});
        await this.searchWhereToGofield.fill(location);
        await this.searchWhereToGofield.press('Enter');
        const captitalizedLocation = location.split('/').map(part => 
            part.split(' ').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')
        ).join('/');
        try{
            await expect(this.searchWhereToGoResult(captitalizedLocation)).toBeVisible({timeout: 3000});
            await this.searchWhereToGoResult(captitalizedLocation).click();
        }catch(error){
            await expect(this.searchWhereToGoAltResult(captitalizedLocation)).toBeVisible({timeout: 3000});
            await this.searchWhereToGoAltResult(captitalizedLocation).click();
        }
    }

}


export default SearchResultPage
