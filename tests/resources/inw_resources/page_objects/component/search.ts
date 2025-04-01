import { type Page, type Locator, expect } from '@playwright/test';
import { BoundingBox } from '../../utilities/models';
import { APIRequestContext, APIResponse } from "@playwright/test";
import tokenConfig from '../../../../resources/utils/tokenConfig';
import environmentBaseUrl from '../../../../resources/utils/environmentBaseUrl';

export class SearchResultPage {
    readonly page: Page
    readonly searchBar: Locator
    readonly searchHolidayBtn: Locator
    readonly searchFldMobile: Locator
    readonly toggle: Locator
    public initialBox: BoundingBox | null = null;
    public env: string | null = null;
    public PCMSurl: string | null = null;
    private request: APIRequestContext;

    constructor(page: Page, apiContext: APIRequestContext) {
        this.page = page;
        this.searchBar = page.locator('.c-search-criteria-bar')
        this.searchHolidayBtn = page.getByRole('button', { name: 'Search holidays' })
        this.searchFldMobile = page.getByRole('button', { name: 'Search..' })
        this.toggle = page.locator('input[value="showDest"]')
        this.request = apiContext
        this.env = process.env.ENV || "qa";
        this.PCMSurl = environmentBaseUrl[this.env].p_cms;
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
        await this.searchHolidayBtn.waitFor({ state: 'visible', timeout: 5000 })
            .catch(async () => {
                await this.searchFldMobile.click();
            });

        await this.searchHolidayBtn.click();
    }

    async validateToggleValue(toggleValue: boolean = false) {
        const isChecked = await this.toggle.isChecked();

        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.toggle, 'Toggle is available').toHaveCount(1)

        if (toggleValue) {
            expect(isChecked, 'Toggle is grouped by Accommodation').toBe(true)
        } else {
            expect(isChecked, 'Toggle is grouped by Resort').toBe(false)

        }
    }

    async validateAccommodationGroupResults() {
        const currentURL = new URL(this.page.url());
        const params = currentURL.searchParams.toString();
        const apiURL = this.PCMSurl + '/api/Availability/ING/GBINA%7CGBINS/accommodations?' + params
        let getAccommodations: APIResponse | undefined

        await this.page.waitForLoadState('domcontentloaded')
        getAccommodations = await this.request.get(apiURL, {
            headers: {
                'api-key': `${tokenConfig.qa.p_cms}`
            }
        })

        console.log("getAccommodations:: ", await getAccommodations.json())
    }

}


export default SearchResultPage
