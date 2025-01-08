import { type Page, type Locator, expect } from '@playwright/test';

export class Homepage {
    //variables
    readonly page: Page;
    readonly culture_button: Locator;
    readonly explore_button: Locator;
    readonly destination_field: Locator;
    readonly destination_option:Locator;
    readonly trip_type_field: Locator;
    readonly monthyear_picker: Locator;
    readonly nextbutton: Locator;
    readonly selected_month: Locator;
    readonly go_button: Locator;
    readonly select_button: Locator;
    readonly div_filters: Locator;
    readonly card_view: Locator;

    //locators
    constructor(page: Page) {
        this.page = page;
        this.culture_button = page.getByText('gb', { exact: true });
        this.destination_field = page.getByPlaceholder('Search for a destination...');
        this.destination_option = page.getByRole('option').locator('span').first();
        this.trip_type_field = page.getByRole('searchbox', {name: 'Any type'});
        this.monthyear_picker = page.getByRole('textbox', { name: 'Datepicker input' });
        this.nextbutton = page.getByLabel('Next year');
        this.selected_month = page.getByRole('gridcell');
        this.select_button = page.getByRole('button', { name: 'Select' });
        this.go_button = page.getByText("Let's go!");
        this.div_filters = page.locator('//div[@class="filter-panel__wrapper"]');
        this.card_view = page.locator('//div[@class="algolia-search-results-panel"]');
    }

    //methods
    async searchDestination(destination: any) {
        await this.destination_field.waitFor({ state: 'visible', timeout: 10000 });
        await this.destination_field.click();
        await this.destination_field.fill(destination);
        await this.destination_option.click();
                
        await this.go_button.waitFor({ state: 'visible', timeout: 10000 });
        await this.go_button.hover();
        await this.go_button.click();

        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('load');
        await this.page.waitForTimeout(5000);

        await expect(this.div_filters).toContainText(destination);
    }

    async randomSearch(query_type: any, destination: any | null, trip_type: any | null, monthyear: any | null) {    

        if (query_type != 'keyword') {
            if (!destination) {
                console.log('Destination is null or empty, skipping destination field.');
            } else {
                await this.destination_field.waitFor({ state: 'visible', timeout: 10000 });
                await this.destination_field.click();
                await this.destination_field.fill(destination);
                await this.destination_option.click();
            }
        }
        else {
            if (!destination) {
                console.log('Destination is null or empty, skipping destination field.');
            } else {
                await this.destination_field.waitFor({ state: 'visible', timeout: 10000 });
                await this.destination_field.click();
                await this.destination_field.fill(destination);
                await this.destination_field.click();
            }
        }
        if (!trip_type) {
            console.log('Trip type is null or empty, skipping trip type field.');
        } else {
            await this.trip_type_field.waitFor({ state: 'visible', timeout: 10000 });
            await this.trip_type_field.click();
            await this.trip_type_field.fill(trip_type);
            await this.page.getByRole('option', { name: trip_type, exact:true }).locator('span').first().click();
        }
        if (!monthyear) {
            console.log('Monthyear is null or empty, skipping trip type field.');
        } else {
            await this.monthyear_picker.waitFor({ state: 'visible', timeout: 10000 });
            await this.monthyear_picker.click();
            await this.nextbutton.click();
            await this.selected_month.getByText(monthyear).click();
            await this.select_button.click();
        }
        
        await this.go_button.waitFor({ state: 'visible', timeout: 10000 });
        await this.go_button.hover();
        await this.go_button.click();
        
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('load');
        await this.page.waitForTimeout(5000);

        await expect(this.div_filters).toContainText(destination);
        await expect(this.div_filters).toContainText(trip_type);
        await expect(this.div_filters).toContainText(monthyear);
    }

    async searchFunction() {
        await this.go_button.waitFor({ state: 'visible', timeout: 10000 });
        await this.go_button.hover();
        await this.go_button.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('load');
        await this.page.waitForTimeout(5000);
    }
}
export default Homepage;