import { type Page, type Locator, expect } from '@playwright/test';
import { SearchValues, ResortSearchValues } from '../utilities/models';

export class ResortPage {
    public page: Page
    readonly viewHotelsButtons: Locator
    readonly searchBar: Locator
    readonly criteriaBar: Locator
    readonly resortSearchBarDetails: Locator
    readonly editSearchBar: Locator
    readonly northEnglandCheckbox: Locator
    readonly departureBtn: Locator
    readonly whosComingBtn: Locator
    readonly addAdultBtn: Locator
    readonly addChildBtn: Locator
    readonly childOption: Locator
    readonly durationBtn: Locator
    readonly durationSampleVal: Locator
    readonly departureDate: Locator
    readonly doneBtn: Locator
    readonly confirmDetailsBtn: Locator
    readonly resortSearchDepartureVal: Locator
    readonly resortSearchArrivalValue: Locator
    readonly resortSearchWhosComingValue: Locator
    readonly resortSearchNightsValue: Locator
    public resortSearchBarValues: string[] = [];
    public resortSearchValues: ResortSearchValues | null = null;


    constructor(page: Page) {
        this.page = page;
        this.viewHotelsButtons = page.locator('.c-search-card__footer .c-search-card--resorts-footer').getByRole('button', { name: 'View hotels' })
        this.searchBar = page.locator('.c-search-criteria-bar')
        this.criteriaBar = page.locator('[data-sticky-content="criteriabar"]')
        this.resortSearchBarDetails = page.locator('.c-search-criteria-bar__price-basis > span')
        this.editSearchBar = page.getByRole('button', { name: 'Edit' })
        this.departureBtn = page.getByRole('button', { name: 'Departure location(s) Any' })
        this.northEnglandCheckbox = page.locator('label').filter({ hasText: 'Any North Of England' })
        this.whosComingBtn = page.getByRole('button', { name: `Who's coming?` })
        this.addAdultBtn = page.locator('.number-range').getByRole('button', { name: '+' })
        this.addChildBtn = page.getByRole('button', { name: 'Add a child' })
        this.childOption = page.getByRole('option', { name: '1 year old' })
        this.durationBtn = page.locator('.nights-btn')
        this.durationSampleVal = page.locator(`//*[@for='3']`)
        this.departureDate = page.getByRole('button', { name: 'Select date' })
        this.doneBtn = page.getByRole('button', { name: 'Done' })
        this.confirmDetailsBtn = page.getByRole('button', { name: ' Confirm details ' })
        this.resortSearchDepartureVal = page.locator('.trip-search__option .option--selected')
        this.resortSearchNightsValue = page.getByRole('button', { name: 'nights' })
    }

    async checkResortSearchBarAvailability() {
        let hasStickyFixedClass: boolean = false
        let positionStyle: string = ''

        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.viewHotelsButtons.first().waitFor({ state: 'visible' }),
            this.viewHotelsButtons.first().click()
        ]);
        await newPage.waitForLoadState('domcontentloaded')
        this.page = newPage

        await expect(newPage.locator('.c-search-criteria-bar'), 'Search bar is available').toBeVisible();
        hasStickyFixedClass = await newPage.locator('[data-sticky-content="criteriabar"]').evaluate((element: HTMLElement) =>
            element.classList.contains('sticky-fixed')
        );

        positionStyle = await newPage.locator('[data-sticky-content="criteriabar"]').evaluate((element: HTMLElement) =>
            window.getComputedStyle(element).position
        );

        expect(hasStickyFixedClass, 'Search bar is not initially sticky').toBe(false)
        expect(positionStyle).toBe('relative')

        return newPage
    }

    async scrollDown(newPage) {
        const resortPage = new ResortPage(newPage);
        await newPage.waitForLoadState('domcontentloaded')

        await newPage.evaluate(() => window.scrollBy(0, 300));
        await newPage.waitForTimeout(500);
    }

    async validateSearchBarTobeSticky(newPage) {
        const resortPage = new ResortPage(newPage);
        await newPage.waitForLoadState('domcontentloaded')

        await expect(resortPage.searchBar, 'Search bar is available').toBeVisible();

        const hasStickyFixedClass = await resortPage.criteriaBar.evaluate((element: HTMLElement) =>
            element.classList.contains('sticky-fixed')
        );

        const positionStyle = await resortPage.criteriaBar.evaluate((element: HTMLElement) =>
            window.getComputedStyle(element).position
        );

        const top = await resortPage.criteriaBar.evaluate((element: HTMLElement) =>
            window.getComputedStyle(element).top
        );

        expect(hasStickyFixedClass, 'Search bar is sticky').toBe(true)
        expect(positionStyle).toBe('fixed')
        expect(top).toBe('0px')
    }

    async validateResortSearchBarDetails(searchValues: SearchValues, newPage: Page, updatedVal: boolean = false) {
        const resortPage = new ResortPage(newPage);
        await newPage.waitForLoadState('domcontentloaded')
        await newPage.waitForTimeout(2000);

        for (let index = 0; index < 3; index++) {
            let resortSearchBarDetails = await resortPage.resortSearchBarDetails.nth(index).textContent()
            if (resortSearchBarDetails !== null) {
                this.resortSearchBarValues.push(resortSearchBarDetails);
            }
        }

        if (updatedVal) {
            const expectedValues = this.resortSearchValues;
            const actualBarValues = this.resortSearchBarValues.map(v => v.trim().toLowerCase());

            // Format expected values to match how they appear in the bar
            const expectedFormatted = [
                `any date (${(expectedValues?.nights || '').trim().toLowerCase()})`,
                (expectedValues?.whosComing || '')
                    .replace(/([a-zA-Z])(?=\d)/g, '$1 , ') // letter followed by number, no space
                    .replace(/(\d)(?=[a-zA-Z])/g, '$1 , ') // number followed by letter, no space
                    .replace(/\s+,/g, ',')                // cleanup: remove space before comma if any
                    .replace(/,\s+/g, ' , ')              // ensure exactly one space after comma
                    .toLowerCase()
                    .trim(),
                (expectedValues?.departure || '')
                    .split(',')[0] // Get the first location only
                    .replace(/\+\d+ more/, '') // Remove "+X more"
                    .toLowerCase()
                    .trim()
            ];


            const allMatch = expectedFormatted.every(val =>
                actualBarValues.some(actual => actual.includes(val))
            );

            expect(allMatch, 'All search values are correctly reflected in the resort search bar').toBe(true);

        } else {
            const searchValuesList = [
                `From ${searchValues!.departure}`.trim().toLowerCase(),
                `Any guest`.trim().toLowerCase(),
                `Any date (${searchValues!.nights})`.trim().toLowerCase(),
            ];

            const resortSearchValuesNormalized = this.resortSearchBarValues.map(v => v.trim().toLowerCase());

            const allValuesPresent = searchValuesList.every(val =>
                resortSearchValuesNormalized.includes(val)
            );

            expect(allValuesPresent, 'All search values are present in the resort search bar').toBe(true);
        }





    }

    async updateResortSearchDetails(newPage) {
        const resortPage = new ResortPage(newPage);

        await newPage.waitForLoadState('domcontentloaded')
        await resortPage.editSearchBar.waitFor({ state: 'attached' });
        await newPage.waitForTimeout(1000);
        await resortPage.editSearchBar.click()
        await resortPage.departureBtn.click()
        await resortPage.northEnglandCheckbox.waitFor({ state: 'attached' });
        await resortPage.northEnglandCheckbox.click()
        await resortPage.doneBtn.click()
        await resortPage.whosComingBtn.click()
        await resortPage.addAdultBtn.click()
        await resortPage.addChildBtn.click()
        await resortPage.childOption.click()
        await resortPage.doneBtn.click()
        await resortPage.durationBtn.click()
        await resortPage.durationSampleVal.click()
        await resortPage.doneBtn.click()
        await resortPage.resortSearchDepartureVal.first().waitFor({ state: 'visible' });

        this.resortSearchValues = {
            departure: await resortPage.resortSearchDepartureVal.first().textContent(),
            whosComing: await resortPage.resortSearchDepartureVal.last().textContent(),
            nights: await resortPage.resortSearchNightsValue.textContent(),
        };

        await resortPage.confirmDetailsBtn.click()

        return this.resortSearchValues;

    }

}


export default ResortPage
