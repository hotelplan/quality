import { type Page, type Locator, expect } from '@playwright/test';
import { BoundingBox } from '../../utilities/models';

export class SearchResultPage {
    readonly page: Page
    readonly searchProductTab: (product: string) => Locator;
    readonly searchBar: Locator
    readonly searchHolidayBtn: Locator
    readonly searchFldMobile: Locator
    public initialBox: BoundingBox | null = null;

    constructor(page: Page) {
        this.page = page;
        this.searchProductTab = (product: string = 'Ski') => page.getByRole('button', { name: product, exact: true });
        this.searchBar = page.locator('.c-search-criteria-bar')
        this.searchHolidayBtn = page.getByRole('button', { name: 'Search holidays' })
        this.searchFldMobile = page.getByRole('button', { name: 'Search..' })
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

    async clickSearchHolidayBtn() {
        if (!(await this.searchHolidayBtn.isVisible())) {
            await this.searchFldMobile.click();
        }
        await this.searchHolidayBtn.click();
    }

}


export default SearchResultPage
