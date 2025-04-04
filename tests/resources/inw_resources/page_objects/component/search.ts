import { type Page, type Locator, expect } from '@playwright/test';
import { BoundingBox } from '../../utilities/models';
import { APIRequestContext, APIResponse } from "@playwright/test";
import tokenConfig from '../../../../resources/utils/tokenConfig';
import environmentBaseUrl from '../../../../resources/utils/environmentBaseUrl';
import exp from 'constants';

export class SearchResultPage {
    readonly page: Page
    readonly searchProductTab: (product: string) => Locator;
    readonly searchBar: Locator
    readonly searchHolidayBtn: Locator
    readonly searchFldMobile: Locator
    readonly toggleValue: Locator
    readonly toggleSwitch: Locator
    readonly accommodationCard: Locator
    readonly resortCard: Locator
    readonly viewHotelsButtons: Locator
    readonly viewAccommodationsButtons: Locator
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
    public env: string | null = null;
    public PCMSurl: string | null = null;
    public accommodationNamesFromAPI: string[] = [];
    public accommodationNamesFromUI: string[] = [];
    public resortNamesFromAPI: string[] = [];
    public resortNamesFromUI: string[] = [];
    private request: APIRequestContext;

    constructor(page: Page, apiContext: APIRequestContext) {
        this.page = page;
        this.searchProductTab = (product: string) => page.getByRole('button', { name: product, exact: true });
        this.searchBar = page.locator('.c-search-criteria-bar')
        this.searchHolidayBtn = page.getByRole('button', { name: 'Search holidays' })
        this.searchFldMobile = page.getByRole('button', { name: 'Search..' })
        this.toggleValue = page.locator('input[value="showDest"]')
        this.toggleSwitch = page.locator('.c-toggle-switch')
        this.accommodationCard = page.locator('.c-search-card--resorts .c-search-card .c-header-h3')
        this.viewHotelsButtons = page.locator('.c-search-card__footer .c-search-card--resorts-footer').getByRole('button', { name: 'View hotels' })
        this.viewAccommodationsButtons = page.locator('.c-search-card .c-search-card__footer').getByRole('button', { name: 'View accommodation(s)' })
        this.resortCard = page.locator('.c-search-card .content .c-header-h3')
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

    async checkCriteriaBarContent(content: string) {
        await this.page.waitForLoadState('domcontentloaded')
        await this.page.waitForLoadState('load')
        await this.page.waitForTimeout(5000);
        expect(this.searchCriteriaBarResult(this.page)).toBeVisible({ timeout: 30000 });
        expect(this.searchCriteriaBarResult(this.page)).toContainText(content, { timeout: 30000 });
    }

    async countAccommodationCards() {
        await this.page.waitForLoadState('domcontentloaded');
        await this.searchAccomodationCard.first().waitFor({ state: 'attached', timeout: 10000 });
        const cardCount = await this.searchAccomodationCard.count();
        console.log(`Initial count of accommodation cards: ${cardCount}`);
        expect(cardCount).toBeGreaterThan(0);
        expect(this.searchAccomodationCardImage.first()).toBeVisible({ timeout: 30000 });
    }

    async opentAccommodationCards() {
        expect(this.searchAccomodationViewHotelsBtn.first()).toBeVisible({ timeout: 30000 });
        await this.searchAccomodationViewHotelsBtn.first().click();

        const page2Promise = this.page.waitForEvent('popup');
        const page2 = await page2Promise;

        return page2;
    }

    async checkAccomodationPageCriteriaBar(context: any, content: string) {
        await context.waitForLoadState('domcontentloaded')
        await context.waitForTimeout(5000);
        expect(this.searchCriteriaBarResult(context)).toBeVisible({ timeout: 30000 });
        expect(this.searchCriteriaBarResult(context)).toContainText(content, { timeout: 30000 });
    }

    /////////////////Search Actions ///////////////////////

    async clickSearchProductTab(product: string = 'Ski') {
        await this.searchProductTab(product).isVisible();
        await this.searchProductTab(product).click();
    }

    async clickSearchHolidayBtn() {
        await this.searchHolidayBtn.waitFor({ state: 'visible' })
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

    async validateAccommodationApiResults(product: string) {
        const currentURL = new URL(this.page.url());
        const params = currentURL.searchParams.toString();
        let apiURL: string = ''

        if (product === 'Ski') {
            apiURL = this.PCMSurl + '/api/Availability/ING/GBINA%7CGBINN%7CGBIND/accommodations?' + params
        } else if (product === 'Walking') {
            apiURL = this.PCMSurl + '/api/Availability/ING/GBINB/accommodations?' + params

        } else if (product === 'Lapland') {
            apiURL = this.PCMSurl + '/api/Availability/ING/GBINA%7CGBINS/accommodations?' + params

        }

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

    async validateResortApiResults(product: string) {
        const currentURL = new URL(this.page.url());
        const params = currentURL.searchParams.toString();
        let apiURL: string = ''

        if (product === 'Ski') {
            apiURL = this.PCMSurl + '/api/Availability/ING/GBINA%7CGBINN%7CGBIND/resorts?' + params
        } else if (product === 'Walking') {
            apiURL = this.PCMSurl + '/api/Availability/ING/GBINB/resorts?' + params

        } else if (product === 'Lapland') {
            apiURL = this.PCMSurl + '/api/Availability/ING/GBINA%7CGBINS/resorts?' + params

        }
        let getResorts: APIResponse | undefined

        await this.page.waitForLoadState('domcontentloaded')
        getResorts = await this.request.get(apiURL, {
            headers: {
                'api-key': `${tokenConfig.qa.p_cms}`
            }
        })

        expect(getResorts.status(), 'Resort API returns 200 success and a valid json response').toBe(200)

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
    async setNumberOfGuests(targetNumber: number, numberOfChildren: number = 0, maxAttempts = 20) {
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

    async searchAnywhere(location: string) {
        await this.searchAnywhereBtn.click();
        await expect(this.searchWhereToGofield).toBeVisible({ timeout: 30000 });
        await this.searchWhereToGofield.fill(location);
        await this.searchWhereToGofield.press('Enter');
        const captitalizedLocation = location.split('/').map(part =>
            part.split(' ').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')
        ).join('/');
        try {
            await expect(this.searchWhereToGoResult(captitalizedLocation)).toBeVisible({ timeout: 3000 });
            await this.searchWhereToGoResult(captitalizedLocation).click();
        } catch (error) {
            await expect(this.searchWhereToGoAltResult(captitalizedLocation)).toBeVisible({ timeout: 3000 });
            await this.searchWhereToGoAltResult(captitalizedLocation).click();
        }
    }

}


export default SearchResultPage
