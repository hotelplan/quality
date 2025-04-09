import { type Page, type Locator, expect } from '@playwright/test';
import { SearchValues } from '../utilities/models';

export class ResortPage {
    public page: Page
    readonly viewHotelsButtons: Locator
    readonly searchBar: Locator
    readonly criteriaBar: Locator
    readonly resortSearchBarDetails: Locator
    public resortSearchBarValues: string[] = [];
    public searchValues: SearchValues | null = null;


    constructor(page: Page) {
        this.page = page;
        this.viewHotelsButtons = page.locator('.c-search-card__footer .c-search-card--resorts-footer').getByRole('button', { name: 'View hotels' })
        this.searchBar = page.locator('.c-search-criteria-bar')
        this.criteriaBar = page.locator('[data-sticky-content="criteriabar"]')
        this.resortSearchBarDetails = page.locator('.c-search-criteria-bar__price-basis > span')

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

    }

    async scrollDown() {
        await this.page.evaluate(() => window.scrollBy(0, 300));
        await this.page.waitForTimeout(500);
    }

    async validateSearchBarTobeSticky() {
        await expect(this.searchBar, 'Search bar is available').toBeVisible();

        const hasStickyFixedClass = await this.criteriaBar.evaluate((element: HTMLElement) =>
            element.classList.contains('sticky-fixed')
        );

        const positionStyle = await this.criteriaBar.evaluate((element: HTMLElement) =>
            window.getComputedStyle(element).position
        );

        const top = await this.criteriaBar.evaluate((element: HTMLElement) =>
            window.getComputedStyle(element).top
        );

        expect(hasStickyFixedClass, 'Search bar is sticky').toBe(true)
        expect(positionStyle).toBe('fixed')
        expect(top).toBe('0px')
    }

    async validateResortSearchBarDetails(searchValues: SearchValues) {

        for (let index = 0; index < 3; index++) {
            let resortSearchBarDetails = await this.resortSearchBarDetails.nth(index).textContent()
            if (resortSearchBarDetails !== null) {
                this.resortSearchBarValues.push(resortSearchBarDetails);
            }
        }

        const searchValuesList = [
            `From ${searchValues!.departure}`.trim().toLowerCase(),
            `${searchValues!.whosComing}`.trim().toLowerCase(),
            `Any date (${searchValues!.nights})`.trim().toLowerCase(),
        ];

        const resortSearchValuesNormalized = this.resortSearchBarValues.map(v => v.trim().toLowerCase());

        const allValuesPresent = searchValuesList.every(val =>
            resortSearchValuesNormalized.includes(val)
        );

        expect(allValuesPresent, 'All search values are present in the resort search bar').toBe(true);
    }

}


export default ResortPage
