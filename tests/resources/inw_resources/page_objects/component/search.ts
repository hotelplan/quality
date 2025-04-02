import { type Page, type Locator, expect } from '@playwright/test';
import { BoundingBox } from '../../utilities/models';
import { APIRequestContext, APIResponse } from "@playwright/test";
import { areSortedStringArraysEqual } from '../../utilities/helper'
import tokenConfig from '../../../../resources/utils/tokenConfig';
import environmentBaseUrl from '../../../../resources/utils/environmentBaseUrl';

export class SearchResultPage {
    readonly page: Page
    readonly searchBar: Locator
    readonly searchHolidayBtn: Locator
    readonly searchFldMobile: Locator
    readonly toggleValue: Locator
    readonly toggleSwitch: Locator
    readonly accommodationCard: Locator
    readonly resortCard: Locator
    readonly viewHotelsButtons: Locator
    readonly viewAccommodationsButtons: Locator
    public initialBox: BoundingBox | null = null;
    public env: string | null = null;
    public PCMSurl: string | null = null;
    public accommodationNamesFromAPI: string[] = [];
    public accommodationNamesFromUI: string[] = [];
    public resortNamesFromAPI: string[] = [];
    public resortNamesFromUI: string[] = [];
    private request: APIRequestContext;

    constructor(page: Page, apiContext: APIRequestContext) {
        this.page = page;
        this.searchBar = page.locator('.c-search-criteria-bar')
        this.searchHolidayBtn = page.getByRole('button', { name: 'Search holidays' })
        this.searchFldMobile = page.getByRole('button', { name: 'Search..' })
        this.toggleValue = page.locator('input[value="showDest"]')
        this.toggleSwitch = page.locator('.c-toggle-switch')
        this.accommodationCard = page.locator('.c-search-card--resorts .c-search-card .c-header-h3')
        this.viewHotelsButtons = page.locator('.c-search-card__footer .c-search-card--resorts-footer').getByRole('button', { name: 'View hotels' })
        this.viewAccommodationsButtons = page.locator('.c-search-card .c-search-card__footer').getByRole('button', { name: 'View accommodation(s)' })
        this.resortCard = page.locator('.c-search-card .content .c-header-h3')
        this.request = apiContext
        this.env = process.env.ENV || "qa";
        this.PCMSurl = environmentBaseUrl[this.env].p_cms;
        this.initialBox = null
        this.accommodationNamesFromAPI = []
        this.accommodationNamesFromUI = []
        this.resortNamesFromAPI = []
        this.resortNamesFromUI = []
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
        const isChecked = await this.toggleValue.isChecked();

        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.toggleValue, 'Toggle is available').toHaveCount(1)

        if (toggleValue) {
            expect(isChecked, 'Toggle is grouped by Accommodation').toBe(true)
        } else {
            expect(isChecked, 'Toggle is grouped by Resort').toBe(false)

        }
    }

    async validateAccommodationApiResults() {
        const currentURL = new URL(this.page.url());
        const params = currentURL.searchParams.toString();
        const apiURL = this.PCMSurl + '/api/Availability/ING/GBINA%7CGBINN%7CGBIND/accommodations?' + params

        let getAccommodations: APIResponse | undefined

        await this.page.waitForLoadState('domcontentloaded')
        getAccommodations = await this.request.get(apiURL, {
            headers: {
                'api-key': `${tokenConfig.qa.p_cms}`
            }
        })

        expect(getAccommodations.status(), 'Accommodation API returns 200 success and a valid json response').toBe(200)

        const accommodationResponse = (await getAccommodations.json()).items
        accommodationResponse.forEach((item) => {
            expect(item, 'Accommodation API returns a property accommodationKey').toHaveProperty('accommodationKey');
            expect(item.accommodationKey, 'Accommodation API property accommodationKey has value').not.toBeNull();
            expect(item.accommodationKey, 'Accommodation API property accommodationKey is defined').not.toBeUndefined();
        });

        accommodationResponse.forEach((item) => {
            this.accommodationNamesFromAPI.push(item.accommodation.name)
        });

    }

    async validateAccommodationResponseAgainstUIDisplay() {
        //Todo: Optimize the page waiting mechanism to eliminate the need for waitForTimeout
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('load');
        await this.accommodationCard.first().waitFor({ state: 'visible' })
        await this.page.waitForTimeout(5000)
        let accommodationCardCount = await this.accommodationCard.count()

        for (let index = 0; index < accommodationCardCount; index++) {
            let accommodationName = await this.accommodationCard.nth(index).textContent()
            if (accommodationName !== null) {
                this.accommodationNamesFromUI.push(accommodationName);
            }
        }
        expect(this.accommodationNamesFromAPI.sort()).toEqual(this.accommodationNamesFromUI.sort());
    }

    async validateViewHotelsButtonAvailability() {
        let viewHotelsBtnCount = await this.viewHotelsButtons.count()

        for (let index = 0; index < viewHotelsBtnCount; index++) {
            expect(await this.viewHotelsButtons.nth(index).textContent(), `View Hotels button is available on card: ${index + 1}`).toBe('View Hotels')
        }
    }

    async clickGroupToggle() {
        await this.toggleSwitch.waitFor({ state: 'visible' })
        await this.toggleSwitch.click()
    }

    async validateResortApiResults() {
        const currentURL = new URL(this.page.url());
        const params = currentURL.searchParams.toString();
        const apiURL = this.PCMSurl + '/api/Availability/ING/GBINA%7CGBINN%7CGBIND/resorts?' + params

        let getResorts: APIResponse | undefined

        await this.page.waitForLoadState('domcontentloaded')
        getResorts = await this.request.get(apiURL, {
            headers: {
                'api-key': `${tokenConfig.qa.p_cms}`
            }
        })

        expect(getResorts.status(), 'Accommodation API returns 200 success and a valid json response').toBe(200)

        const resortResponse = (await getResorts.json()).items

        resortResponse.forEach((item) => {
            expect(item, 'Resort API should return a property regions').toHaveProperty('regions');
            expect(Array.isArray(item.regions), 'Regions should be an array').toBe(true);

            item.regions.forEach((region) => {
                expect(region, 'Region should have a property "resorts"').toHaveProperty('resorts');
                expect(Array.isArray(region.resorts), 'Resorts should be an array').toBe(true);
                expect(region.resorts.length, 'Resort array should not be empty').toBeGreaterThan(0);
            });
        });

        resortResponse.forEach((item) => {
            item.regions.forEach((region) => {
                region.resorts.forEach((resort) => {
                    this.resortNamesFromAPI.push(resort.name);
                });
            });
        });
    }

    async validateResortResponseAgainstUIDisplay() {
        //Todo: Optimize the page waiting mechanism to eliminate the need for waitForTimeout
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('load');
        await this.resortCard.first().waitFor({ state: 'visible' })
        await this.page.waitForTimeout(5000)
        let resortCount = await this.resortCard.count()

        for (let index = 0; index < resortCount; index++) {
            let resortName = await this.resortCard.nth(index).textContent()
            if (resortName !== null) {
                this.resortNamesFromUI.push(resortName);
            }
        }

        expect(this.resortNamesFromAPI.sort()).toEqual(this.resortNamesFromUI.sort());

    }

    async validateViewAccommodationsButtonAvailability() {
        let viewHotelsBtnCount = await this.viewAccommodationsButtons.count()

        for (let index = 0; index < viewHotelsBtnCount; index++) {
            expect(await this.viewAccommodationsButtons.nth(index).textContent(), `View Accommodations button is available on card: ${index + 1}`).toBe('View accommodation(s)')
        }
    }
}


export default SearchResultPage
